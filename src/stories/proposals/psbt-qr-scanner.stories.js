import PsbtQRScanner from '../../components/proposals/psbt-qr-scanner.vue'
import { action } from '@storybook/addon-actions'
export default {
  title: 'Proposals/PsbtQRScanner',
  component: PsbtQRScanner
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { PsbtQRScanner },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { args }
  },
  methods: {
    onScanned () {
      action('onScanned')
    }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<QCard class="q-pa-md" style="width:500px; height:400px;"> <PsbtQRScanner @onScanned="onScanned"/></QCard>'
})

export const Base = Template.bind({})
Base.args = {
}
