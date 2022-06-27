import CreateVaultForm from '../../components/vaults/create-vault-form.vue'
import { action } from '@storybook/addon-actions'
import { userEvent, within } from '@storybook/testing-library'
import polkadotAddresses from './polkadotAddresses'
export default {
  title: 'Vaults/CreateVaultForm',
  component: CreateVaultForm,
  argTypes: {
    onSubmit: { action: 'submit' }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { CreateVaultForm },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  methods: {
    onSubmit: action('submit')
  },
  // Then, the spread values can be accessed directly in the template
  template: '<CreateVaultForm @submittedForm = "onSubmit"/>'
})

export const Base = Template.bind({})
Base.args = {
  signer: undefined
}
export const SuccessSubmit = Template.bind({})
SuccessSubmit.args = {
  signer: undefined
}
SuccessSubmit.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)

  await userEvent.type(canvas.getByTestId('vault-name-input'), 'Test Vault')

  const cosignerInputs = canvas.getAllByTestId('vault-cosigner-input')
  cosignerInputs.forEach(async (input, index) => {
    await userEvent.type(canvas.getAllByTestId('account_input')[index], polkadotAddresses[index])
  })

  await userEvent.click(canvas.getByTestId('toggle-include'))

  await userEvent.click(canvas.getByTestId('submitButton'))
}

export const FailSubmit = Template.bind({})
FailSubmit.args = {
  signer: undefined
}
FailSubmit.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)

  await userEvent.type(canvas.getByTestId('vault-name-input'), '')

  const cosignerInputs = canvas.getAllByTestId('vault-cosigner-input')
  cosignerInputs.forEach(async (input, index) => {
    await userEvent.type(canvas.getAllByTestId('account_input')[index], polkadotAddresses[1])
  })

  await userEvent.click(canvas.getByTestId('submitButton'))
}
