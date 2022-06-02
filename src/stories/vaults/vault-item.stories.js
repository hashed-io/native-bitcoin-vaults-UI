import VaultItem from '../../components/vaults/vault-item.vue'

export default {
  title: 'Vaults/VaultItem',
  component: VaultItem
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { VaultItem },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<VaultItem/>'
})

export const Base = Template.bind({})
Base.args = {
  vaultId: '0xfec05bfacdb146452aabaa2841978b8b75628e2d554baafa607f43f99cfc2c91',
  description: 'This is a test for proposals',
  descriptors: undefined,
  owner: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
  threshold: 2,
  cosigners: ['5CmFmVadzNQFaeiyXXNugRXT1MuaoocUyogtYHEQeWjGp7pX', '5DaWmLfzBTLbKFwBC5YxtAQ45XMSAQCDLcZL6zW9ZiJsGSST']
}
