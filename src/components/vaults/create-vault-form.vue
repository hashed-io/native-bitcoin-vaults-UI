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
          label="Label"
          v-model="description"
          :rules="[rules.required]"
        )
      .col
        .text-body2 {{ $t('vaults.descriptionLabel')  }}
    .row.items-center.q-col-gutter-md.q-my-sm
      //- .col-2
      //-   q-input(
      //-     outlined
      //-     label="Threshold"
      //-     v-model="threshold"
      //-     :rules="[rules.required, rules.positiveInteger, rules.greaterOrEqualThan(minCosigners), rules.lessOrEqualThan(maxCosigners)]"
      //-   )
      .col-7
        q-range(
          v-model="thresholdRange"
          marker-labels
          markers
          drag-range
          snap
          :min="minCosigners"
          :max="7"
        )
      .col
        .text-body2 {{ $t('vaults.cosigners')  }}
    .row.items-center.q-col-gutter-md.q-my-sm
      .col-7.justify-end
        .text-body2.text-right {{ `${thresholdRange.min} / ${thresholdRange.max}`  }}
      .col
        .text-body2 {{ $t('vaults.mOfn')  }}
    #cosigners
      .row
        .col-7
          .row.justify-between.q-mr-sm.q-mb-sm
            .text-subtitle2 Cosigners
            //- q-btn(
            //-   icon="add"
            //-   size="sm"
            //-   color="secondary"
            //-   label="Add"
            //-   @click="addNewCosigner"
            //- )
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
          .text-body2 {{ $t('vaults.cosignersLabelDesc')  }}
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
      thresholdRange: {
        min: 1,
        max: 1
      },
      cosigners: [{
        id: 0,
        address: undefined
      }]
    }
  },
  computed: {
    minCosigners () {
      return 1
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
    },
    async 'thresholdRange.max' (newLength) {
      await this.$nextTick()
      const currentLength = this.cosigners.length
      await this.$nextTick()
      if (currentLength > newLength) {
        const diff = currentLength - newLength
        // console.log('dif to remove', diff)
        for (let i = 0; i < diff; i++) {
          await this.$nextTick()
          this.cosigners.splice(this.cosigners.length - 1, 1)
          await this.$nextTick()
        }
      } else if (currentLength < newLength) {
        const diff = newLength - currentLength
        // console.log('dif to add', diff)
        for (let i = 0; i < diff; i++) {
          this.addNewCosigner()
        }
      }
    }
  },
  mounted () {
    this.thresholdRange.max = 7
  },
  methods: {
    async submitForm () {
      try {
        const data = {
          description: this.description,
          // threshold: this.threshold,
          threshold: this.thresholdRange.min,
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
    async removeCosigner (cosignerId) {
      const index = this.cosigners.findIndex(e => e.id === cosignerId)
      this.cosigners.splice(index, 1)
      await this.$nextTick()
      this.thresholdRange.max = this.cosigners.length
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
