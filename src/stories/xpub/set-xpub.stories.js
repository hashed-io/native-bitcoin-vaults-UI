// import ProposalItem from '../../components/proposals/proposal-card.vue'
import SetXpubForm from '../../components/xpub/set-xpub-form.vue'
import { userEvent, within } from '@storybook/testing-library'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Xpub/xpub-form',
  component: SetXpubForm,
  argType: {
    onsubmit: { action: 'submit' }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { SetXpubForm },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  methods: {
    onsubmit: action('submit')
  },
  // Then, the spread values can be accessed directly in the template
  template: '<SetXpubForm @onSubmitted="onSubmit"/>'
})

export const Base = Template.bind({})
Base.args = {
  userAddress: 'HnBKWAi6qrCHmiryEy9UPJnZsajWXXwEWjYRfYa9AqDQtVy',
  qr: 'false'
}
export const BaseSuccess = Template.bind({})
BaseSuccess.args = {
  userAddress: 'HnBKWAi6qrCHmiryEy9UPJnZsajWXXwEWjYRfYa9AqDQtVy',
  qr: 'false'
}
BaseSuccess.play = async ({ args, canvasElement }) => {
  const validXpub = 'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz'

  const canvas = within(canvasElement)

  await userEvent.type(canvas.getByTestId('fullXpubInput'), validXpub)
  await userEvent.click(canvas.getByTestId('submitButton'))
}
export const UsingFormBase = Template.bind({})
UsingFormBase.args = {
  userAddress: 'HnBKWAi6qrCHmiryEy9UPJnZsajWXXwEWjYRfYa9AqDQtVy',
  qr: 'false'
}
UsingFormBase.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByTestId('toggleForm'))
}
export const UsingFormSucess = Template.bind({})
UsingFormSucess.args = {
  userAddress: 'HnBKWAi6qrCHmiryEy9UPJnZsajWXXwEWjYRfYa9AqDQtVy',
  qr: 'false'
}
UsingFormSucess.play = async ({ args, canvasElement }) => {
  const validXpub = 'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz'
  const validMasterFingerprint = '0A8CF3A2'
  const validDerivationPath = "m/48'/0'/0'/3'"

  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByTestId('toggleForm'))
  // await userEvent.type(canvas.getByTestId('labelInput'), 'label')
  await userEvent.type(canvas.getByTestId('publicKey'), validXpub)
  await userEvent.type(canvas.getByTestId('masterFingerprint'), validMasterFingerprint)
  await userEvent.clear(canvas.getByTestId('derivationInput'))
  await userEvent.type(canvas.getByTestId('derivationInput'), validDerivationPath)
  await userEvent.click(canvas.getByTestId('submitButton'))
}
export const UsingFormFail = Template.bind({})
UsingFormFail.args = {
  userAddress: 'HnBKWAi6qrCHmiryEy9UPJnZsajWXXwEWjYRfYa9AqDQtVy',
  qr: 'false'
}
UsingFormFail.play = async ({ args, canvasElement }) => {
  const validXpub = 'xpub'
  const validMasterFingerprint = '0A8CF3s2'
  const validDerivationPath = ' '

  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByTestId('toggleForm'))
  // await userEvent.type(canvas.getByTestId('labelInput'), 'label')
  await userEvent.type(canvas.getByTestId('publicKey'), validXpub)
  await userEvent.type(canvas.getByTestId('masterFingerprint'), validMasterFingerprint)
  await userEvent.clear(canvas.getByTestId('derivationInput'))
  await userEvent.type(canvas.getByTestId('derivationInput'), validDerivationPath)
  await userEvent.click(canvas.getByTestId('submitButton'))
}
export const OpenQR = Template.bind({})
OpenQR.args = {
  userAddress: 'HnBKWAi6qrCHmiryEy9UPJnZsajWXXwEWjYRfYa9AqDQtVy',
  qr: 'true'
}
OpenQR.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByTestId('openQr'))
}
