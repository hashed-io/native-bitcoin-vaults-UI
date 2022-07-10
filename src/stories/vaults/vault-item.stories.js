import VaultItem from '../../components/vaults/vault-item.vue'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Vaults/VaultItem',
  component: VaultItem,
  argTypes: {
    onVaultDetails: { action: 'onVaultDetails' }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { VaultItem },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  methods: {
    onVaultDetails: action('onVaultDetails')
  },
  // Then, the spread values can be accessed directly in the template
  template: '<VaultItem @onVaultDetails="onVaultDetails"/>'
})

export const Base = Template.bind({})
Base.args = {
  vaultId: '0xfec05bfacdb146452aabaa2841978b8b75628e2d554baafa607f43f99cfc2c91',
  cosigners: ['5CmFmVadzNQFaeiyXXNugRXT1MuaoocUyogtYHEQeWjGp7pX', '5DaWmLfzBTLbKFwBC5YxtAQ45XMSAQCDLcZL6zW9ZiJsGSST'],
  description: 'This is a test for proposals',
  descriptors: {
    outputDescriptor: 'lorem ipsum',
    changeDescriptor: 'lorem ipsum'
  },
  owner: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
  threshold: 2,
  offchainStatus: 'offChainStatus'
}
