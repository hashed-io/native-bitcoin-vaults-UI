<template lang="pug">
q-dialog(v-model="open")
  q-card.q-pa-md
    .row.justify-center.q-mt-md
      #error-permissions(v-if="!hasCameraPermission")
        .text-h5.text-negative.text-center Permission not granted
        .row.justify-center
          q-icon(name="video_camera_front" size="8em" color="primary")
        .text-body2.text-weight-light.text-center Please allow camera permission to scan your XPUB
      #granted-permissions(v-else)
        .text-h5.q-mb-sm QR Decode
        .text-body2.text-weight-light Please Scan your XPUB from Blue Wallet
        .row.justify-center.q-mt-sm
          q-spinner-puff(
            color="primary"
            size="10em"
            v-if="isDecrypting"
          )
          QrStream.qrContainer(
            ref="qrReader"
            @decode="onQrDetected"
            v-else
          )
</template>

<script>
import { QrStream } from 'vue3-qr-reader'
import { Decoder } from '@smontero/nbv-ur-codec'

export default {
  name: 'QrDecodeXpub',
  components: {
    QrStream
  },
  emits: ['xpubDecoded'],
  data () {
    return {
      open: false,
      isDecrypting: false,
      hasCameraPermission: false
    }
  },
  watch: {
    async open (v) {
      await this.$nextTick()
      if (v) {
        try {
          const { state } = await navigator.permissions.query({ name: 'camera' })
          console.log('cameraPermissions', state)
          if (state === 'granted' || state === 'prompt') {
            this.hasCameraPermission = true
          } else this.hasCameraPermission = false
        } catch (e) {
          try {
            // const mdevices = await navigator.mediaDevices.getUserMedia({ video: true })
            this.hasCameraPermission = true
          } catch (e) {
            console.error(e)
          }
        }
        // console.log('response ref', permissions, this.$refs.qrReader.camera)
      }
    }
  },
  methods: {
    openDialog () {
      this.open = true
    },
    hideDialog () {
      this.open = false
    },
    async onQrDetected (xpub) {
      try {
        console.log('on onQrDetected', xpub)
        this.isDecrypting = true
        const result = await new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              const decoder = new Decoder()
              const r = decoder.decodeXPub(xpub)
              resolve(r)
            } catch (e) {
              reject(e)
            }
          }, 1000)
        })
        console.log('xpub decoded', result)
        this.$emit('xpubDecoded', result)
      } catch (e) {
        this.showNotification({
          message: e.message || e,
          color: 'red'
        })
        console.error(e)
      } finally {
        this.isDecrypting = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.qrContainer
  width: auto
  height: auto
</style>
