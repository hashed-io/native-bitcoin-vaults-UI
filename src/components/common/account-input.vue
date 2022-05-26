<template lang="pug">
#container
    q-input(
        :label="label"
        v-model="value"
        :outlined="outlined"
        :rules="[isValidPolkadotAddress]"
    )
        template(v-slot:prepend)
            account-icon(:address="value" size="40px")
        template(v-slot:label v-if="displayName && displayName.length < 30")
          #container
            span {{ label }}
            span.bg-secondary.text-white.rounded-borders.q-ml-xs.q-px-xs {{ displayName }}
            //- span(class="q-px-sm bg-deep-orange text-white text-italic rounded-borders") label
</template>

<script>
import AccountIcon from '~/components/common/account-icon.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'AccountInput',
  components: { AccountIcon },
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: undefined
    },
    outlined: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      accountInfo: undefined
    }
  },
  computed: {
    ...mapGetters('polkadotWallet', ['availableAccounts']),
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    displayName () {
      if (this.accountInfo) {
        const identity = this.accountInfo?.identity
        const localDisplay = this.availableAccounts.find(v => v.address === this.value)
        return (identity.display) ? identity.display : localDisplay?.meta?.name || this.value
      } return undefined
    }
  },
  watch: {
    async value (account) {
      const isValid = this.isValidPolkadotAddress(account)
      if (isValid === true) {
        const response = await this.$store.$polkadotApi.getAccountInfo(account)
        this.accountInfo = response
      } else this.accountInfo = false
    }
  },
  methods: {
    isValidPolkadotAddress (v) {
      if (!v) {
        return 'This field is required'
      } else if (this.$store.$polkadotApi.isValidPolkadotAddress(v)) {
        return true
      }
      return 'Is not a valid polkadot address'
    }
  }
}
</script>
