<template lang="pug">
q-form.q-pa-xl.q-gutter-y-md(@submit="submitForm" ref="form")
    q-btn.float-right(
      icon="close"
      round
      color="negative"
      v-close-popup
      size="sm"
    )
    .text-h4.q-mb-lg Create new vault
    .row.items-center.q-col-gutter-md.q-my-sm
      .col-7
        q-input(
          outlined
          label="Description"
          v-model="description"
          :rules="[rules.required]"
        )
      .col
        .text-body2 {{ $t('general.lorem')  }}
    #cosigners
      .row
        .col-7
          .row.justify-between.q-mr-sm.q-mb-sm
            .text-subtitle2 Cosigners
            q-btn(
              icon="add"
              size="sm"
              color="secondary"
              label="Add"
              @click="addNewCosigner"
            )
      .row.items-center.q-col-gutter-md.q-mb-sm
        .col-7
          .row.items-center(v-for="cosigner in cosigners")
            .col
              account-input(
                label="Account address"
                v-model="cosigner.address"
                outlined
                :rules="[rules.required, rules.isValidPolkadotAddress, rules.notOwnAccount(signer), notDuplicatedAccounts]"
              )
            q-icon.icon-btn.q-mb-md(
              size="md"
              name="delete"
              color="negative"
              @click="removeCosigner(cosigner.id)"
              v-if="cosigners.length > 1"
            )
        .col
          .text-body2 {{ $t('general.loremShort')  }}
    .row.items-center.q-col-gutter-md.q-my-sm
      .col-7
        q-input(
          outlined
          label="Threshold"
          v-model="threshold"
          :rules="[rules.required, rules.positiveInteger, rules.greaterOrEqualThan(minCosigners), rules.lessOrEqualThan(maxCosigners)]"
        )
      .col
        .text-body2 {{ $t('general.loremShort')  }}
    .q-col-gutter-md.q-my-sm
      q-toggle(label="Include owner as cosigner" v-model="includeOwnerAsCosigner")
    q-btn.float-right.q-mb-md(
        label="Create Vault"
        color="primary"
        size="md"
        type="submit"
        no-caps
    )
</template>

<script>
import { validation } from '~/mixins/validation'
import AccountInput from '~/components/common/account-input'

/**
 * Form to create a new vault
 */
export default {
  name: 'CreateProposalForm',
  components: { AccountInput },
  mixins: [validation],
  props: {
    /**
     * User address to sign
     * This field is used to some validations
     */
    signer: {
      type: String,
      default: undefined
    }
  },
  emits: ['submittedForm'],
  data () {
    return {
      description: undefined,
      threshold: undefined,
      includeOwnerAsCosigner: false,
      cosigners: [{
        id: 0,
        address: undefined
      }]
    }
  },
  computed: {
    minCosigners () {
      return 2
    },
    maxCosigners () {
      if (this.includeOwnerAsCosigner) {
        return this.cosigners.length + 1
      }
      return this.cosigners.length
    }
  },
  watch: {
    async includeOwnerAsCosigner () {
      await this.$nextTick()
      this.$refs.form.validate()
    },
    async cosigners () {
      await this.$nextTick()
      this.$refs.form.resetValidation()
    }
  },
  methods: {
    async submitForm () {
      try {
        const data = {
          description: this.description,
          threshold: this.threshold,
          cosigners: this.cosigners.map(v => v.address),
          includeOwnerAsCosigner: this.includeOwnerAsCosigner
        }
        /**
         * This event return all data from form when is filled correctly
         */
        this.$emit('submittedForm', data)
      } catch (e) {
        console.error('submitProposal', e)
      }
    },
    addNewCosigner () {
      this.cosigners.push({
        id: this.cosigners.length,
        address: undefined
      })
    },
    removeCosigner (cosignerId) {
      const index = this.cosigners.findIndex(e => e.id === cosignerId)
      this.cosigners.splice(index, 1)
    },
    notDuplicatedAccounts (account) {
      const exist = this.cosigners.filter(e => e.address === account)
      if (exist && exist.length > 1) {
        return 'This account is duplicated'
      } return true
    }
  }
}
</script>
