import AccountItem from '../../components/common/account-item.vue'

export default {
  title: 'Common/AccountItem',
  component: AccountItem
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AccountItem },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<accountItem/>'
})

export const Base = Template.bind({})
Base.args = {
  address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym'
}
