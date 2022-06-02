import AccountInput from '../../components/common/account-input.vue'
import { validation } from '~/mixins/validation'

export default {
  title: 'Common/AccountInput',
  component: AccountInput
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AccountInput },
  mixins: [validation],
  data () {
    return {
      data: ''
    }
  },
  mounted () {
    this.data = '5DaWmLfzBTLbKFwBC5YxtAQ45XMSAQCDLcZL6zW9ZiJsGSST'
  },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<accountInput v-model="data" :rules="[rules.required, rules.isValidPolkadotAddress]"/>'
})

export const Base = Template.bind({})
Base.args = {
  label: 'Account Input Test',
  outlined: true
}
