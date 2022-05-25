import SelectedAccountBtn from '../../components/common/selected-account-btn.vue'

export default {
  title: 'Common/SelectedAccountBtn',
  component: SelectedAccountBtn
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { SelectedAccountBtn },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<selectedAccountBtn/>'
})

export const Base = Template.bind({})
Base.args = {
  selectedAccount: {
    address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
    meta: {
      name: 'Test Account'
    }
  }
}
