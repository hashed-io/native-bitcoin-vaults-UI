import CosignersList from '../../components/proposals/cosigners-list.vue'

export default {
  title: 'Proposals/CosignersList',
  component: CosignersList
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { CosignersList },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<CosignersList/>'
})

export const Base = Template.bind({})
Base.args = {
  cosigners: [
    {
      address: 'GjrEGMtzCDqvs9L26VWcGXVuPa3pbAeLJyPWL1qu5LqNyPJ',
      signed: true
    },
    {
      address: '5CmFmVadzNQFaeiyXXNugRXT1MuaoocUyogtYHEQeWjGp7pX',
      signed: false
    }
  ]
}
