import SetXpubForm from '../../components/xpub/set-xpub-form.vue'

export default {
  title: 'XPUB/SetXpubForm',
  component: SetXpubForm
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { SetXpubForm },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<SetXpubForm/>'
})

export const Base = Template.bind({})
Base.args = {
  userAddress: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
  qr: false
}
