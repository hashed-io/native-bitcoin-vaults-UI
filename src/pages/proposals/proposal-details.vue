<template lang="pug">
#container
  //- Header
  .row.justify-between.q-mb-md
    .text-h5 Proposal Details
    .row.q-gutter-x-sm
      #exportDescriptor.no-padding.q-ma-none
        q-btn(
          label="Export PSBT"
          color="secondary"
          icon="qr_code"
          no-caps
          outline
          @click="exportPSBT"
          :disabled="!hasPsbt"
        )
        q-tooltip(v-if="!hasPsbt") Pending
      #DeleteProposal
        q-btn(
          label="Delete Proposal"
          color="negative"
          icon="delete"
          no-caps
          outline
        )
  //- Body
  .text-subtitle2.q-mt-md Vault Id
  .text-body2 {{ proposal.vaultId }}
  .text-subtitle2.q-mt-md Proposal Id
  .text-body2 {{ proposal.proposalId }}
  .row
    .col
      .text-subtitle2.q-mt-md Description
      .text-body2 {{ proposal.description }}
    .col
      .text-subtitle2.q-mt-md Status
      .text-body2 {{ proposal.status }}
  .row
    .col
      .text-subtitle2.q-mt-md Satoshi Amount
      .text-body2 {{ proposal.amount }}
    .col
      .text-subtitle2.q-mt-md Fee in Satoshi Per Virtual Byte
      .text-body2 {{ proposal.feeSatPerVb }}
  .text-subtitle2.q-mt-md To Address
  .text-body2 {{ proposal.toAddress }}
  .text-subtitle2.q-mt-md Proposer
  account-item(:address="proposal.proposer")
  #Cosigners.q-my-sm
    q-btn(
      label="Scan PSBT"
      color="secondary"
      icon="qr_code_scanner"
      no-caps
      outline
      @click="scanPSBT"
    )
  #modals
    q-dialog(v-model="isShowingPsbtQR")
      q-card.modalQrSize.q-pa-sm
        .text-body2.text-weight-light.q-ml-sm.text-center.q-mt-sm Export PSBT QR
        psbt-qr-viewer(:qrs="psbtQR")
    q-dialog(v-model="isShowingScanPsbtQR")
      q-card.modalQrSize.q-pa-sm
        .text-body2.text-weight-light.q-ml-sm.text-center.q-mt-sm Import PSBT QR
        psbt-qr-scanner(:qrs="psbtQR" @onScanned="onPSBTScanned")
</template>

<script>
import { mapGetters } from 'vuex'
import { AccountItem } from '~/components/common'
import PsbtQrViewer from '~/components/proposals/psbt-qr-viewer'
import PsbtQrScanner from '~/components/proposals/psbt-qr-scanner'
import { Encoder, Decoder } from '@smontero/nbv-ur-codec'

export default {
  name: 'ProposalDetails',
  components: { AccountItem, PsbtQrViewer, PsbtQrScanner },
  data () {
    return {
      // parentParams: undefined,
      proposal: undefined,
      isShowingPsbtQR: false,
      isShowingScanPsbtQR: false,
      psbtQR: undefined
    }
  },
  computed: {
    ...mapGetters('polkadotWallet', ['selectedAccount']),
    hasPsbt () {
      return !!(this.proposal && this.proposal.psbt)
    }
  },
  beforeMount () {
    const params = this.$route.params

    if (params && params.parentParams && params.proposalParams) {
      const paramsParent = JSON.parse(params.parentParams)
      console.log('paramsParent', paramsParent)
      const proposal = JSON.parse(params.proposalParams)
      if (proposal && proposal.vaultId) {
        this.proposal = proposal
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
    async onPSBTScanned (data) {
      try {
        this.showLoading()
        this.isShowingScanPsbtQR = false
        const decoder = new Decoder()
        const psbt = decoder.decodePSBT(data)
        console.log('psbt', psbt)
        await this.$store.$nbvStorageApi.savePsbt({
          proposalId: this.proposal.proposalId,
          signer: this.selectedAccount.address,
          psbt
        })
        this.showNotification({ message: 'PSBT saved successfully' })
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    scanPSBT () {
      try {
        this.showLoading()
        this.isShowingScanPsbtQR = true
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async exportPSBT () {
      try {
        this.showLoading()
        const encoder = new Encoder()
        const result = encoder.psbtToQRCode(this.proposal.psbt, 200)
        this.psbtQR = result
        this.isShowingPsbtQR = true
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    }
  }
}
</script>
