<template lang="pug">
#container
  //- Error Banner
  banner.q-mb-md(v-if="offchainMessage" v-bind="offchainMessage" )
  //- Action Btn
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(fab icon="refresh" color="secondary" @click="updateProposal")
      q-tooltip(self="bottom left" anchor="top left" :offset="[10, 10]") Refresh
  //- Header
  .row.justify-between.q-mb-md
    .text-h5 Proposal Details
    .row.q-gutter-x-sm
      #signPSBT
        q-btn(
          label="Sign PSBT"
          color="secondary"
          icon="qr_code"
          no-caps
          outline
          @click="showSignPSBT"
          :disabled="isOffchainError"
        )
        q-tooltip(v-if="isOffchainError") {{ validationMessage }}
      #DeleteProposal(v-if="canRemove")
        q-btn(
          label="Delete Proposal"
          color="negative"
          icon="delete"
          no-caps
          outline
          @click="removeProposal"
        )
  //- Body
  .text-subtitle2.q-mt-md Vault Id
  .text-body2 {{ vaultId }}
  .text-subtitle2.q-mt-md Proposal Id
  .text-body2 {{ proposalId }}
  .row
    .col
      .text-subtitle2.q-mt-md Description
      .text-body2 {{ description }}
    .col
      .text-subtitle2.q-mt-md Status
      .text-body2 {{ labelStatus }}
  .row
    .col
      .text-subtitle2.q-mt-md Threshold
      .text-body2 {{ threshold }}
    .col
      .text-subtitle2.q-mt-md Satoshi Amount
      .text-body2 {{ amount }}
    .col
      .text-subtitle2.q-mt-md Fee in Satoshi Per Virtual Byte
      .text-body2 {{ feeSatPerVb }}
  .row
    .col
      .text-subtitle2.q-mt-md To Address
      .text-body2 {{ toAddress }}
  .row(v-if="txId")
    .col
      .text-subtitle2.q-mt-md Tx
      .text-body2.txLabel(@click="openTxExplorer") {{ txId }}
  .text-subtitle2.q-mt-md Proposer
  account-item(:address="proposer")
  #cosigners
    .text-subtitle2.q-mt-md Cosigners
    cosigners-list(:cosigners="proposalCosigners")
  #modals
    q-dialog(v-model="isShowingSignPsbt")
      q-card.modalSize.q-pa-sm
        sign-proposal-stepper(
          :psbt="psbt"
          :canFinalize="canFinalize"
          :canBroadcast="canBroadcast"
          :alreadySigned="alreadySigned"
          :isBroadcasted="isBroadcasted"
          :isFinalized="isFinalized"
          @onSavePsbt="savePsbt"
          @onFinalizePsbt="finalizePsbt"
          @onBroadcastPsbt="broadcastPsbt"
        )

</template>

<script>
import { mapGetters } from 'vuex'
import { AccountItem, Banner } from '~/components/common'
import CosignersList from '~/components/proposals/cosigners-list'
import SignProposalStepper from '~/components/proposals/sign-proposal-stepper'

export default {
  name: 'ProposalDetails',
  components: { AccountItem, CosignersList, Banner, SignProposalStepper },
  data () {
    return {
      vaultId: undefined,
      proposalId: undefined,
      toAddress: undefined,
      status: undefined,
      description: undefined,
      amount: undefined,
      proposer: undefined,
      feeSatPerVb: undefined,
      offchainStatus: undefined,
      txId: undefined,
      psbt: undefined,
      signedPsbts: [],
      cosigners: [],
      isShowingSignPsbt: false,
      psbtQR: undefined,
      offchainMessage: undefined,
      threshold: undefined,
      paramsParent: undefined
    }
  },
  computed: {
    ...mapGetters('polkadotWallet', ['selectedAccount']),
    labelStatus () {
      if (this.status && this.status.ReadyToFinalize === true) {
        return 'Finalizing'
      } else if (this.status && this.status.ReadyToFinalize === false) {
        return 'Broadcasting'
      }
      return this.status
    },
    hasPsbt () {
      return !!(this.psbt)
    },
    proposalCosigners () {
      return this.cosigners.map(cosigner => {
        return {
          address: cosigner,
          signed: this.signedPsbts.find(v => v.signer === cosigner)
        }
      })
    },
    canRemove () {
      let canRemove = false
      if (this.proposer === this.selectedAccount.address && this.status === 'Pending') {
        canRemove = true
      }
      return canRemove
    },
    isOffchainError () {
      return !!(this.offchainMessage && this.offchainMessage.status === 'error')
    },
    validationMessage () {
      if (this.offchainStatus) {
        if (this.offchainStatus.status && this.offchainMessage.status === 'pending') {
          return 'Pending'
        } else if (this.offchainMessage.message) {
          return this.offchainMessage.message
        }
      }
      return undefined
    },
    canFinalize () {
      const signers = this.proposalCosigners.filter(v => v.signed)
      return !!(signers.length >= this.threshold)
    },
    canBroadcast () {
      return !!(this.labelStatus === 'Finalized')
    },
    isBroadcasted () {
      return !!(this.labelStatus === 'Broadcasted')
    },
    isFinalized () {
      return !!(this.labelStatus === 'Finalized')
    },
    alreadySigned () {
      return !!this.signedPsbts.find(v => v.signer === this.selectedAccount.address)
    }
  },
  beforeMount () {
    const params = this.$route.params

    if (params && params.parentParams && params.proposalParams) {
      const paramsParent = JSON.parse(params.parentParams)
      this.paramsParent = paramsParent
      this.cosigners = paramsParent.cosigners
      this.threshold = paramsParent.threshold
      console.log('paramsParent', paramsParent)
      const proposal = JSON.parse(params.proposalParams)
      if (proposal && proposal.vaultId) {
        // this.proposal = proposal
        this.syncData(proposal)
      } else {
        this.$router.replace({
          name: 'manageVaults'
        })
      }
      // Set router to back
      const breadcrumb = this.$route.meta.breadcrumb.map(b => {
        if (b.name === 'Details') {
          return {
            ...b,
            back: false,
            to: {
              name: 'vaultDetails',
              params: { vault: JSON.stringify(paramsParent) }
            }
          }
        }
        return b
      })
      this.$route.meta.breadcrumb = breadcrumb
    } else {
      this.$router.replace({ name: 'manageVaults' })
    }
  },
  methods: {
    openTxExplorer () {
      window.open(`https://mempool.space/tx/${this.txId}`, 'blank')
    },
    showSignPSBT () {
      this.isShowingSignPsbt = true
    },
    async broadcastPsbt () {
      try {
        this.showLoading()
        await this.$store.$nbvStorageApi.broadcastPsbt({
          proposalId: this.proposalId,
          signer: this.selectedAccount.address
        })
        this.isShowingSignPsbt = false
        this.showNotification({ message: 'Broadcasting' })
        this.updateProposal()
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async finalizePsbt () {
      try {
        this.showLoading()
        await this.$store.$nbvStorageApi.finalizePsbt({
          proposalId: this.proposalId,
          signer: this.selectedAccount.address
        })
        this.isShowingSignPsbt = false
        this.showNotification({ message: 'Finalized' })
        this.updateProposal()
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async removeProposal () {
      try {
        this.showLoading()
        await this.$store.$nbvStorageApi.removeProposal({
          proposalId: this.proposalId,
          signer: this.selectedAccount.address
        })
        this.$router.replace({
          name: 'vaultDetails',
          params: { vault: JSON.stringify(this.paramsParent) }
        })
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    syncData (proposal) {
      console.log('syncData', proposal)
      this.vaultId = proposal.vaultId
      this.proposalId = proposal.proposalId
      this.toAddress = proposal.toAddress
      this.status = proposal.status
      this.description = proposal.description
      this.amount = proposal.amount
      this.proposer = proposal.proposer
      this.feeSatPerVb = proposal.feeSatPerVb
      this.offchainStatus = proposal.offchainStatus
      this.txId = proposal.txId
      this.psbt = proposal.psbt
      this.signedPsbts = proposal.signedPsbts
      this.handlerOffchainStatus(this.offchainStatus)
    },
    async updateProposal () {
      try {
        this.showLoading({ message: 'Updating proposal' })
        const proposal = await this.$store.$nbvStorageApi.getProposalsById({ Ids: [this.proposalId] })
        this.syncData({
          ...proposal[0].toHuman(),
          proposalId: this.proposalId,
          threshold: this.threshold
        })
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async savePsbt (psbt) {
      try {
        this.showLoading()
        await this.$store.$nbvStorageApi.savePsbt({
          proposalId: this.proposalId,
          signer: this.selectedAccount.address,
          psbt
        })
        this.isShowingSignPsbt = false
        this.showNotification({ message: 'PSBT saved successfully' })
        this.updateProposal()
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    handlerOffchainStatus (offchainStatus) {
      if (offchainStatus.IrrecoverableError) {
        this.offchainMessage = {
          message: offchainStatus.IrrecoverableError,
          status: 'error'
        }
      } else if (offchainStatus.toLowerCase() === 'pending') {
        this.offchainMessage = {
          message: 'Please await a moment, we are creating the PSBT',
          status: 'loading'
        }
      } else if (offchainStatus.toLowerCase() === 'valid') {
        this.offchainMessage = undefined
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.txLabel
  text-decoration: underline
  cursor: pointer
</style>
