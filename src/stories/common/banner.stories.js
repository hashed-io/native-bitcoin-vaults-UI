import Banner from '../../components/common/banner.vue'

export default {
  title: 'Common/Banner',
  component: Banner
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Banner },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { ...args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<Banner/>'
})

export const Base = Template.bind({})
Base.args = {
  message: 'Hello this is an important message',
  status: 'loading'
}
