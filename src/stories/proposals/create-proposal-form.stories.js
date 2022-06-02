import CreateProposalForm from '../../components/proposals/create-proposal-form.vue'

export default {
  title: 'Proposals/CreateProposalForm',
  component: CreateProposalForm
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { CreateProposalForm },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<CreateProposalForm/>'
})

export const Base = Template.bind({})
Base.args = {
}
