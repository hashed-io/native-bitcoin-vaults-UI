import PsbtQRViewer from '../../components/proposals/psbt-qr-viewer.vue'
export default {
  title: 'Proposals/PsbtQRViewer',
  component: PsbtQRViewer
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { PsbtQRViewer },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { args }
  },
  methods: {
  },
  // Then, the spread values can be accessed directly in the template
  template: '<QCard bordered flat class="q-pa-xl"><PsbtQRViewer/></QCard>'
})

export const Base = Template.bind({})
Base.args = {
  // Payload of the PSBTs
  qrs: []
}
