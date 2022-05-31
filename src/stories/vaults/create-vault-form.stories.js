import CreateVaultForm from '../../components/vaults/create-vault-form.vue'

export default {
  title: 'Vaults/CreateVaultForm',
  component: CreateVaultForm
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { CreateVaultForm },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<CreateVaultForm/>'
})

export const Base = Template.bind({})
Base.args = {
}
