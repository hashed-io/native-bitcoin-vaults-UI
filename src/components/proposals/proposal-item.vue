<template lang="pug">
q-card.q-pa-sm.animated-item(@click="emitClick")
  q-item
    q-item-section.q-gutter-y-xs
      .row.justify-between
        .label-container
          .text-subtitle2.text-primary.hoverView Click to see details
        q-chip(v-bind="chipStatus")
      .row.items-center
        q-icon.q-mr-md(name="description" size="sm" color="secondary")
        .text-subtitle2 Description:
          span.text-body2.q-ml-sm {{ description }}
      .row.items-center
        .col.min-h
          .row
            q-icon.q-mr-md(name="fak fa-satoshisymbol-solid" size="sm" color="secondary")
            .text-subtitle2 Satoshi Amount:
              span.text-body2.q-ml-sm {{ amount }}
        .col.min-h
          .row
            q-icon.q-mr-md(name="fak fa-satoshisymbol-solid" size="sm" color="secondary")
            .text-subtitle2 Fee in Satoshi Per Virtual Byte:
              span.text-body2.q-ml-sm {{ feeSatPerVb }}
      .row.items-center
        q-icon.q-mr-md(name="currency_bitcoin" size="sm" color="secondary")
        .text-subtitle2 To Address:
          span.text-body2.q-ml-sm {{ toAddress }}
      .text-subtitle2 Proposer
      account-item(:address="proposer" flat inherit)
</template>

<script>
import { AccountItem } from '~/components/common'

/**
 * This component show proposal item info
 */
export default {
  name: 'ProposalItem',
  components: { AccountItem },
  props: {
    /**
     * Proposal's Vault Id
     */
    vaultId: {
      type: String,
      default: undefined
    },
    /**
     * Proposal Id
     */
    proposalId: {
      type: String,
      default: undefined
    },
    /**
     * Recipient address
     */
    toAddress: {
      type: String,
      default: undefined
    },
    /**
     * Proposal status
     */
    status: {
      type: String,
      default: undefined
    },
    /**
     * Proposal Description
     */
    description: {
      type: String,
      default: undefined
    },
    /**
     * Proposal Amount
     */
    amount: {
      type: String,
      default: undefined
    },
    /**
     * Proposal address
     */
    proposer: {
      type: String,
      default: undefined
    },
    /**
     * Fee in Satoshi Per Vault Bitcoin
     */
    feeSatPerVb: {
      type: String,
      default: undefined
    },
    offchainStatus: {
      type: [String, Object],
      default: () => undefined
    },
    txId: {
      type: String,
      default: undefined
    },
    psbt: {
      type: String,
      default: undefined
    },
    signedPsbts: {
      type: Array,
      default: () => []
    }
  },
  emits: ['proposalClicked'],
  computed: {
    chipStatus () {
      if (this.status && this.status.toLowerCase() === 'pending') {
        return {
          color: 'warning',
          'text-color': 'white',
          icon: 'error',
          label: 'Pending',
          size: '1.2em',
          ripple: false,
          clickable: false
        }
      }
      return undefined
    }
  },
  methods: {
    emitClick () {
      const data = {
        vaultId: this.vaultId,
        proposalId: this.proposalId,
        toAddress: this.toAddress,
        status: this.status,
        description: this.description,
        amount: this.amount,
        proposer: this.proposer,
        feeSatPerVb: this.feeSatPerVb,
        offchainStatus: this.offchainStatus,
        signedPsbts: this.signedPsbts,
        txId: this.txId,
        psbt: this.psbt
      }
      /**
       * Emit proposal data when the card is clicked
       */
      this.$emit('proposalClicked', data)
    }
  }
}
</script>

<style lang="stylus" scoped>
.min-h
  height: auto
  min-height: 5px
  max-height: 25px

.hoverView
  display: none

.animated-item:hover .hoverView
  display: block
</style>
