<template lang="pug">
#container
  .row.justify-between.q-mb-md
    .text-h5 Vault Details
    .row.q-gutter-x-sm
      q-btn(
        label="Export descriptor"
        color="secondary"
        icon="qr_code"
        no-caps
        outline
        @click="exportVault"
        v-if="outputDescriptor"
      )
      q-btn(
        label="Delete vault"
        color="negative"
        icon="delete"
        no-caps
        outline
        @click="removeVault"
        v-if="iAmOwner"
      )
  .text-subtitle2.q-mt-md VaultId
  .text-body2 {{ vaultId }}
  .row
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
        .text-body2 {{ vaultAddress }}
      q-item-section.no-padding(avatar)
        q-btn(
          :label="!vaultAddress ? 'Get receive address' : 'Refresh receive address'"
          size="sm"
          no-caps
          color="secondary"
          @click="getReceiveAddress"
        )
  #proposals.row.justify-between.items-center.q-mt-lg
    .text-subtitle2.q-mt-md Proposals
    q-btn(
      label="Create proposal"
      icon="add"
      color="secondary"
      no-caps
      outline
      @click="isShowingCreateProposal = true"
    )
  .row
    proposal-item.full-width.q-mt-md(v-for="proposal in proposalsList" v-bind="proposal" @proposalClicked="goToProposalDetails")
  #modals
    q-dialog(v-model="isShowingCreateProposal" persistent)
      q-card.modalSize
        create-proposal-form(@submittedForm="createNewProposal")
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
          @click="copyTextToClipboard"
        )
</template>

<script>
import { mapGetters } from 'vuex'
import { AccountItem } from '~/components/common'
import CreateProposalForm from '~/components/proposals/create-proposal-form'
import ProposalItem from '~/components/proposals/proposal-item'
import { Encoder } from '@smontero/nbv-ur-codec'
import axios from 'axios'

export default {
  name: 'VaultDetails',
  components: { AccountItem, CreateProposalForm, ProposalItem },
  data () {
    return {
      vaultId: undefined,
      owner: undefined,
      description: undefined,
      changeDescriptor: undefined,
      outputDescriptor: undefined,
      threshold: undefined,
      cosigners: undefined,
      isShowingCreateProposal: false,
      isShowingVaultQR: false,
      vaultQR: undefined,
      vaultQrText: undefined,
      vaultAddress: undefined,
      proposalsList: []
    }
  },
  computed: {
    ...mapGetters('polkadotWallet', ['selectedAccount']),
    iAmOwner () {
      return this.selectedAccount.address === this.owner
    }
  },
  watch: {
    selectedAccount () {
      this.$router.replace({
        name: 'manageVaults'
      })
    }
  },
  mounted () {
    const vault = this.$route.params
    if (!vault || !vault.owner || !vault.vaultId) this.$router.replace({ name: 'manageVaults' })
    this.loadDetails(vault)
    // this.$route.meta.breadcrumb[1].name = 'Detailsss'
  },
  methods: {
    async loadDetails (vault) {
      this.vaultId = vault.vaultId
      this.owner = vault.owner
      this.description = vault?.description
      this.threshold = vault?.threshold
      this.cosigners = vault?.cosigners
      this.outputDescriptor = vault?.outputDescriptor
      this.changeDescriptor = vault?.changeDescriptor
      if (this.vaultId) {
        this.getProposals()
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
          // console.log('vaultQR', process.env.BDK_SERVICES_URL, BDK_SERVICES_URL)
          const http = axios.create({
            baseURL: process.env.BDK_SERVICES_URL,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          const { data } = await http.post('/get_multisig', {
            descriptor: this.outputDescriptor
          })
          // console.log('descr', data)
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
        // console.log('vaultQR', process.env.BDK_SERVICES_URL, BDK_SERVICES_URL)
        const http = axios.create({
          baseURL: process.env.BDK_SERVICES_URL,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const { data } = await http.post('/gen_new_address', {
          descriptor: this.outputDescriptor
        })
        this.vaultAddress = data
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
        threshold: this.threshold,
        cosigners: this.cosigners,
        outputDescriptor: this.outputDescriptor,
        changeDescriptor: this.changeDescriptor
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
    copyTextToClipboard () {
      try {
        navigator.clipboard.writeText(this.vaultQrText).then(e => {
          this.showNotification({ message: 'Text copied to clipboard' })
        })
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.qrContainer
  width: '200px'
  height : '200px'
</style>
