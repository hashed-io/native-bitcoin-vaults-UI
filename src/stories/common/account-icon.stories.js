import AccountIcon from '../../components/common/account-icon.vue'

export default {
  title: 'Common/AccountIcon',
  component: AccountIcon
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AccountIcon },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<accountIcon/>'
})

export const Base = Template.bind({})
Base.args = {
  address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
  size: '5em'
}
