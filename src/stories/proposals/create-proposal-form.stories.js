import CreateProposalForm from '../../components/proposals/create-proposal-form.vue'
import { userEvent, within } from '@storybook/testing-library'
import { action } from '@storybook/addon-actions'
export default {
  title: 'Proposals/CreateProposalForm',
  component: CreateProposalForm,
  argTypes: {
    submitForm: { action: action('submitForm') }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { CreateProposalForm },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  methods: {
    submitForm: action('submitForm')
  },
  // Then, the spread values can be accessed directly in the template
  template: '<CreateProposalForm @submittedForm="submitForm"/>'
})

export const Base = Template.bind({})
Base.args = {
}
// Fail creation
export const FailCreation = Template.bind({})
FailCreation.args = {}
FailCreation.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.clear(canvas.getByTestId('description'))
  await userEvent.type(canvas.getByTestId('recipient'), 'Invalid BTC Address [required]')
  await userEvent.type(canvas.getByTestId('amount'), 'Invalid amount [required]')
  await userEvent.click(canvas.getByTestId('submitButton'), 'Create Proposal')
}
// Success creation
export const SuccessCreation = Template.bind({})
SuccessCreation.args = {}
SuccessCreation.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.type(canvas.getByTestId('description'), 'Test proposal')
  await userEvent.type(canvas.getByTestId('recipient'), 'bc1q89fquejvzxqaq7cf3fuhtghw0p59jld5tja3vj')
  await userEvent.type(canvas.getByTestId('amount'), '1000')
  await userEvent.click(canvas.getByTestId('submitButton'))
}
