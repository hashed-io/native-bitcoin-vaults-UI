import ProposalsList from '../../components/proposals/proposals-list.vue'
import { action } from '@storybook/addon-actions'
export default {
  title: 'Proposals/ProposalsList',
  component: ProposalsList,
  argTypes: {
    onProposalSelected: { action: 'onProposalSelected' }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { ProposalsList },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { args }
  },
  methods: {
    onProposalClick: action('onProposalSelected')
  },
  // Then, the spread values can be accessed directly in the template
  template: '<ProposalsList @onProposalSelected="onProposalClick"/>'
})

export const Base = Template.bind({})
Base.args = {
  proposals: [
    {
      vaultId: 'vault-id-1',
      proposalId: 'proposal-id-1',
      toAddress: 'bc1q89fquejvzxqaq7cf3fuhtghw0p59jld5tja3vj',
      status: 'pending',
      description: 'Test proposal',
      amount: '1000',
      proposer: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      feeSatPerVb: '1000',
      offchainStatus: 'pending',
      txId: 'tx-id-1',
      psbt: 'psbt-1',
      signedPsbts: ['signed-psbts-1']
    }
  ]
}
export const EmptyList = Template.bind({})
EmptyList.args = {
  proposals: [
  ]
}
