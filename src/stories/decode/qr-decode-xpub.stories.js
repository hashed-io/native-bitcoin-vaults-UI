import QrDecodeXpub from '../../components/decode/qr-decode-xpub.vue'
import { ref } from 'vue'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Decode/QrDecodeXpub',
  component: QrDecodeXpub,
  argType: {
    onDecode: { action: 'onDecode' }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { QrDecodeXpub },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    const open = ref(true)
    return { args, open }
  },
  methods: {
    onDecode: action('onDecode'),
    openModal () {
      this.$refs.qrDecodeXpub.openDialog()
    }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<QBtn ref="BtnModal" @click="openModal()" color="primary"> Open Modal <QrDecodeXpub ref="qrDecodeXpub" v-bind="args" @xpubDecoded="onDecode"/></QBtn>'
})

export const Base = Template.bind({})
Base.args = {}
