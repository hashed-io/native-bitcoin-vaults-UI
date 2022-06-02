import AccountsMenu from '../../components/common/accounts-menu.vue'

export default {
  title: 'Common/AccountsMenu',
  component: AccountsMenu
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AccountsMenu },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<accountsMenu/>'
})

export const Base = Template.bind({})
Base.args = {
  accounts: [
    {
      address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      meta: {
        name: 'Test Account'
      }
    },
    {
      address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      meta: {
        name: 'Test Account 2'
      }
    }
  ],
  selectedAccount: {
    address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym'
  }
}
