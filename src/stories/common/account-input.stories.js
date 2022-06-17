import AccountInput from '../../components/common/account-input.vue'
import { validation } from '~/mixins/validation'
import { userEvent, within } from '@storybook/testing-library'
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
    return { args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<accountInput v-model="data" :rules="[rules.required, rules.isValidPolkadotAddress]"/>'
})

export const Base = Template.bind({})
Base.args = {
  label: 'Account Input Test',
  outlined: true
}
export const SuccessValidation = Template.bind({})
SuccessValidation.args = {
  label: 'Account Input Test',
  outlined: true
}
const addressAccount = '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym'
SuccessValidation.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.type(canvas.getByTestId('account_input', addressAccount))
}
export const FailedValidation = Template.bind({})
FailedValidation.args = {
  label: 'Account Input Test',
  outlined: true
}
FailedValidation.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.clear(canvas.getByTestId('account_input'))
}
