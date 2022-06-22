import VaultList from '../../components/vaults/vault-list.vue'

export default {
  title: 'Vaults/VaultList',
  component: VaultList
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { VaultList },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<VaultList/>'
})

export const Base = Template.bind({})
Base.args = {
  vaults: [
    {
      vaultId: '0xfec05bfacdb146452aabaa2841978b8b75628e2d554baafa607f43f99cfc2c91',
      cosigners: ['5CmFmVadzNQFaeiyXXNugRXT1MuaoocUyogtYHEQeWjGp7pX', '5DaWmLfzBTLbKFwBC5YxtAQ45XMSAQCDLcZL6zW9ZiJsGSST'],
      description: 'This is a test for proposals',
      descriptors: undefined,
      owner: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      threshold: 4,
      offchainStatus: 'offChainStatus'
    },
    {
      vaultId: '0xfec05bfacdb146452aabaa2841978b8b75628e2d554baafa607f43f99cfc2c91',
      cosigners: ['5CmFmVadzNQFaeiyXXNugRXT1MuaoocUyogtYHEQeWjGp7pX', '5DaWmLfzBTLbKFwBC5YxtAQ45XMSAQCDLcZL6zW9ZiJsGSST'],
      description: 'This is a test for proposals',
      descriptors: undefined,
      owner: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      threshold: 4,
      offchainStatus: 'offChainStatus'
    }
  ]
}
export const EmptyList = Template.bind({})
EmptyList.args = {}
