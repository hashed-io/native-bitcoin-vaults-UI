<template lang="pug">
#container
    QrStream.qrContainer(
      ref="qrReader"
      @decode="onQrDetected"
    )
    .row.justify-center(v-if="progress && progress > 0")
        q-chip.absolute.progress {{ progressMessage }}
</template>

<script>
import { QrStream } from 'vue3-qr-reader'
export default {
  name: 'PsbtQRScanner',
  components: { QrStream },
  emits: ['onScanned'],
  data () {
    return {
      qrs: [],
      limit: 100
    }
  },
  computed: {
    isValidPSBT () {
      let isValid = false
      if (this.qrs.length === 0) return false
      if (this.qrs.length === this.limit) {
        isValid = true
      }
      return isValid
    },
    progress () {
      if (this.qrs.length <= 0) return 0
      return (this.qrs.length / this.limit) * 100
    },
    progressMessage () {
      if (this.progress === 0) {
        return ''
      }
      return `Please continue scanning (${this.progress}/100)`
    }
  },
  watch: {
    isValidPSBT (v) {
      if (v === true) {
        this.$emit('onScanned', this.qrs.sort((a, b) => {
          return a.position - b.position
        }).map(v => v.value))
      }
    }
  },
  beforeUnmount () {
    this.qrs = []
  },
  methods: {
    onQrDetected (data) {
      if (!data.toUpperCase().startsWith('UR:CRYPTO-PSBT')) {
        this.qrs = []
        this.showNotification({
          message: 'PSBT not valid, please try again',
          color: 'red'
        })
      }
      const split = data.split('/')
      const index = split[1]
      const indexSplit = index.split('-')
      const limit = Number.parseInt(indexSplit[1])
      const position = indexSplit[0]
      this.limit = limit
      if (!this.qrs.find(v => v.value === data)) {
        this.qrs.push({
          value: data,
          limit,
          position
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.progress
  bottom: 20px
  text-align: 'center'
//   left: 0px
//   right: 0px
//   top: 20px
</style>
