<template lang="pug">
q-form.q-pa-xl.q-gutter-y-md(@submit="submitForm")
    q-btn.float-right(
      icon="close"
      round
      color="negative"
      v-close-popup
      size="sm"
    )
    .text-h4.q-mb-lg {{ $t('proposals.create_proposal') }}
    .row.items-center.q-col-gutter-md.q-my-sm
      .col-7
        q-input(
          data-testid="description"
          outlined
          label="Description"
          v-model="description"
          :rules="[rules.required]"
        )
      .col
        .text-body2 {{ $t('proposals.descriptionDesc')  }}
    .row.items-center.q-col-gutter-md.q-my-sm
      .col-7
        q-input(
          data-testid="recipient"
          outlined
          label="Recipient address"
          v-model="recipientAddress"
          :rules="[rules.required, rules.isValidMainetBTC]"
        )
      .col
        .text-body2 {{ $t('proposals.recipientAddressDesc')  }}
    .row.items-center.q-col-gutter-md.q-my-sm
      .col-7
        q-input(
          data-testid="amount"
          outlined
          label="Amount in Satoshi"
          v-model="amountInSats"
          :rules="[rules.required, rules.positiveInteger, rules.lessOrEqualThan(currentBalance || 0), rules.greaterOrEqualThan(546)]"
        )
      .col
        .text-body2 {{ $t('proposals.amountDesc')  }}
    q-btn.float-right.q-mb-md(
        data-testid="submitButton"
        label="Create Proposal"
        color="primary"
        size="md"
        type="submit"
        no-caps
    )
</template>

<script>
import { validation } from '~/mixins/validation'

/**
 * Form to create a new proposal
 */
export default {
  name: 'CreateProposalForm',
  mixins: [validation],
  props: {
    /**
     * Current vault balance
     */
    currentBalance: {
      type: Number,
      default: undefined
    }
  },
  emits: ['submittedForm'],
  data () {
    return {
      recipientAddress: undefined,
      amountInSats: undefined,
      description: undefined
    }
  },
  methods: {
    async submitForm () {
      try {
        const data = {
          recipientAddress: this.recipientAddress,
          amountInSats: this.amountInSats,
          description: this.description
        }
        /**
         * This event return all data from form when is filled correctly
         */
        this.$emit('submittedForm', data)
      } catch (e) {
        console.error('submitProposal', e)
      }
    }
  }
}
</script>
