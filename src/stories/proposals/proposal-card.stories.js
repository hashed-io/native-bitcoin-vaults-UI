import ProposalCard from '../../components/proposals/proposal-card.vue'

export default {
  title: 'Proposals/ProposalCard',
  component: ProposalCard
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { ProposalCard },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<ProposalCard/>'
})

export const Base = Template.bind({})
Base.args = {
  id: 'iasd98adn7na89798d7s8n78asd978',
  proposal: 'iasd98adn7na89798d7s8n78asd978',
  council: 'iasd98adn7na89798d7s8n78asd978'
}
