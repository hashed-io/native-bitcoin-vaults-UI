// import ProposalItem from '../../components/proposals/proposal-card.vue'
import ProposalItem from '../../components/proposals/proposal-item.vue'
// import { userEvent, within } from '@storybook/testing-library'
import { action } from '@storybook/addon-actions'
export default {
  title: 'Proposals/ProposalItem',
  component: ProposalItem
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { ProposalItem },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  methods: {
    emitClick: action('proposalClicked')
  },
  // Then, the spread values can be accessed directly in the template
  template: '<ProposalItem @proposalClicked="emitClick"/>'
})

export const Base = Template.bind({})
Base.args = {
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
  signedPsbts: 'signed-psbts-1'
}
