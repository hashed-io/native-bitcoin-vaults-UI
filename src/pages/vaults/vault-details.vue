<template lang="pug">
#container
  //- Error Banner
  banner.q-mb-md(v-if="offchainMessage" v-bind="offchainMessage" )
  //- Action Btn
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(fab icon="refresh" color="secondary" @click="updateVault")
      q-tooltip(self="bottom left" anchor="top left" :offset="[10, 10]") Refresh
  //- Header
  .row.justify-between.q-mb-md
    .text-h5 Vault Details
    .row.q-gutter-x-sm
      #exportDescriptor.no-padding.q-ma-none
        q-btn(
          label="Export descriptor"
          color="secondary"
          icon="qr_code"
          no-caps
          outline
          @click="exportVault"
          :disabled="!outputDescriptor"
        )
        q-tooltip(v-if="!outputDescriptor") Pending
      #deleteVault
        q-btn(
          label="Delete vault"
          color="negative"
          icon="delete"
          no-caps
          outline
          @click="removeVault"
          v-if="iAmOwner"
        )
  //- Body
  .text-subtitle2.q-mt-md Vault Id
  .text-body2 {{ vaultId }}
  .row
    .col
      .text-subtitle2.q-mt-md Balance
      .row
        q-icon.q-mr-md(name="fak fa-satoshisymbol-solid" size="sm" color="secondary")
        .text-body2 {{ balance || 0 }} Sats
    .col
      .text-subtitle2.q-mt-md Description
      .text-body2 {{ description }}
    .col
      .text-subtitle2.q-mt-md Threshold
      .text-body2 {{ threshold }}
  .text-subtitle2.q-mt-md Owner
  account-item(:address="owner")
  .text-subtitle2.q-mt-md Cosigners
  .q-gutter-sm(v-for="cosigner in cosigners")
    account-item.q-mt-md(:address="cosigner")
  .text-subtitle2.q-mt-md(v-if="outputDescriptor") Receive Address
  q-card.q-pa-xs(v-if="outputDescriptor")
    q-item
      q-item-section.no-padding(v-if="vaultAddress")
        q-item-label.text-body2(lines="1") {{ vaultAddress }}
      q-item-section.no-padding(avatar)
        q-btn(
          :label="!vaultAddress ? 'Get receive address' : 'Refresh receive address'"
          size="sm"
          no-caps
          color="secondary"
          @click="getReceiveAddress"
        )
  .text-subtitle2.q-mt-md(v-if="outputDescriptor") Output Descriptor
  q-card.q-pa-xs(v-if="outputDescriptor")
    q-item
      q-item-section
        q-item-label.text-body2(lines="1") {{ outputDescriptor }}
      q-item-section.no-padding(avatar)
        q-btn(
          label="Copy to clipboard"
          size="sm"
          no-caps
          color="secondary"
          @click="copyTextToClipboard(outputDescriptor)"
        )
  //- Proposals
  #proposals.row.justify-between.items-center.q-mt-lg.q-mb-sm
    .text-subtitle2.q-mt-md Proposals
    #btnCreateProposal
      q-btn(
        label="Create proposal"
        icon="add"
        color="secondary"
        no-caps
        outline
        @click="isShowingCreateProposal = true"
        :disabled="!balance || balance <= 0"
      )
      q-tooltip(v-if="!balance || balance <= 0") The vault's balance must be greater than 0
  proposals-list(:proposals="proposalsList" @onProposalSelected="goToProposalDetails")
  #modals
    q-dialog(v-model="isShowingCreateProposal" persistent)
      q-card.modalSize.minH
        create-proposal-form(@submittedForm="createNewProposal" :currentBalance="balance")
    q-dialog(v-model="isShowingVaultQR")
      q-card.modalQrSize.q-pa-sm
        .text-body2.text-weight-light.q-ml-sm.text-center.q-mt-sm Descriptor QR
        div.qrContainer(v-html="vaultQR")
        q-btn.full-width.q-mx-md(
          icon="content_copy"
          label="Copy text to clipboard"
          flat
          size="md"
          no-caps
          @click="copyTextToClipboard(vaultQrText)"
        )
</template>

<script>
import { mapGetters } from 'vuex'
import { AccountItem, Banner } from '~/components/common'
import CreateProposalForm from '~/components/proposals/create-proposal-form'
import ProposalsList from '~/components/proposals/proposals-list'
import { Encoder } from '@smontero/nbv-ur-codec'

export default {
  name: 'VaultDetails',
  components: { AccountItem, CreateProposalForm, ProposalsList, Banner },
  data () {
    return {
      vaultId: undefined,
      owner: undefined,
      description: undefined,
      descriptors: undefined,
      changeDescriptor: undefined,
      outputDescriptor: undefined,
      offchainStatus: undefined,
      threshold: undefined,
      cosigners: undefined,
      isShowingCreateProposal: false,
      isShowingVaultQR: false,
      vaultQR: undefined,
      vaultQrText: undefined,
      vaultAddress: undefined,
      balance: undefined,
      offchainMessage: undefined,
      proposalsList: []
    }
  },
  computed: {
    ...mapGetters('polkadotWallet', ['selectedAccount']),
    iAmOwner () {
      return this.selectedAccount.address === this.owner
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
    }
  },
  watch: {
    selectedAccount () {
      this.$router.replace({
        name: 'manageVaults'
      })
    }
  },
  beforeMount () {
    const params = this.$route.params
    if (!params || !params.vault) this.$router.replace({ name: 'manageVaults' })
    const vault = JSON.parse(params.vault)
    if (!vault || !vault.owner || !vault.vaultId) this.$router.replace({ name: 'manageVaults' })
    this.syncData(vault)
    // this.$route.meta.breadcrumb[1].name = 'Detailsss'
  },
  methods: {
    async updateVault () {
      try {
        this.showLoading({ message: 'Updating proposal' })
        const vault = await this.$store.$nbvStorageApi.getVaultsById({ Ids: [this.vaultId] })
        this.syncData({
          ...vault[0].toHuman(),
          vaultId: this.vaultId
        })
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    syncData (vault) {
      // console.log('vault syncData', vault)
      this.vaultId = vault.vaultId
      this.owner = vault.owner
      this.description = vault?.description
      this.threshold = vault?.threshold
      this.cosigners = vault?.cosigners
      this.descriptors = vault?.descriptors
      this.outputDescriptor = vault?.descriptors?.outputDescriptor
      this.changeDescriptor = vault?.descriptors?.changeDescriptor
      this.offchainStatus = vault?.offchainStatus
      this.handlerOffchainStatus(this.offchainStatus)
      this.getProposals()
      if (this.vaultId && this.outputDescriptor) {
        this.getBalance()
      }
    },
    async getBalance () {
      try {
        const balance = await this.$store.$bdkApi.getBalance({
          descriptor: this.outputDescriptor,
          changeDescriptor: this.changeDescriptor
        })
        this.balance = balance
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      }
    },
    async removeVault () {
      try {
        this.showLoading()
        await this.$store.$nbvStorageApi.removeVault({
          id: this.vaultId,
          user: this.selectedAccount.address
        })
        this.$router.replace({
          name: 'manageVaults'
        })
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async exportVault () {
      try {
        this.showLoading()
        if (!this.vaultQR) {
          const data = await this.$store.$bdkApi.getMultisig({
            descriptor: this.outputDescriptor
          })
          const encoder = new Encoder()
          const text = encoder.encodeVault(data, this.description)
          const result = encoder.vaultToQRCode(data, this.description)
          this.vaultQR = result
          this.vaultQrText = text
        }
        this.isShowingVaultQR = true
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async getReceiveAddress () {
      try {
        this.showLoading()
        const data = await this.$store.$bdkApi.getNewAddress({
          descriptor: this.outputDescriptor
        })
        this.vaultAddress = data
        this.copyTextToClipboard(data)
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async createNewProposal (payload) {
      try {
        this.showLoading()
        await this.$store.$nbvStorageApi.createProposal({
          vaultId: this.vaultId,
          signer: this.selectedAccount.address,
          recipientAddress: payload.recipientAddress,
          satoshiAmount: payload.amountInSats,
          description: payload.description
        })
        this.isShowingCreateProposal = false
        this.showNotification({ message: 'Proposal created' })
        this.getProposals()
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async getProposals () {
      try {
        this.showLoading()
        const proposalsIds = await this.$store.$nbvStorageApi.getProposalsByVault({ vaultId: this.vaultId })
        if (!proposalsIds.isEmpty) {
          const Ids = proposalsIds.toJSON()
          const proposals = await this.$store.$nbvStorageApi.getProposalsById({ Ids })
          this.proposalsList = proposals.map((v, i) => {
            return {
              ...v.toHuman(),
              proposalId: Ids[i]
            }
          })
        } else this.proposalsList = []
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    goToProposalDetails (proposal) {
      const parentParams = {
        vaultId: this.vaultId,
        owner: this.owner,
        description: this.description,
        descriptors: this.descriptors,
        threshold: this.threshold,
        cosigners: this.cosigners,
        outputDescriptor: this.outputDescriptor,
        changeDescriptor: this.changeDescriptor,
        offchainStatus: this.offchainStatus
      }
      const JsonParams = JSON.stringify(parentParams)
      const ProposalParams = JSON.stringify(proposal)
      this.$router.push({
        name: 'proposalDetails',
        params: {
          parentParams: JsonParams,
          proposalParams: ProposalParams
        }
      })
    },
    handlerOffchainStatus (offchainStatus) {
      if (offchainStatus.IrrecoverableError) {
        this.offchainMessage = {
          message: offchainStatus.IrrecoverableError,
          status: 'error'
        }
      } else if (offchainStatus.toLowerCase() === 'pending') {
        this.offchainMessage = {
          message: 'Please await a moment, we are creating the descriptor',
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
.qrContainer
  width: '200px'
  height : '200px'

.minH
 height: 700px !important
</style>
