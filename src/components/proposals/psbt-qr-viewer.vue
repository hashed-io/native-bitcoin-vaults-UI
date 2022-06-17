<template lang="pug">
#container
  .qrContainer(v-html="selectedQr")
  .rows.q-px-md
    .absolute.cursor-pointer.text-bold(@click="handlerSpeed") Speed {{ labelSpeed }}
    .text-center {{ stepInfo }}
  .row.justify-between
    .col
        q-btn.text-center(label="Previous", :disabled="interval" no-caps flat @click="previousStep")
    .col.text-center
        q-btn(:label="interval ? 'Stop' : 'Start'" no-caps flat @click="handlerInterval")
    .col.text-right
        q-btn(label="Next", :disabled="interval" no-caps flat @click="nextStep")
</template>

<script>
/**
 * This component show all qr for PSBT, also can adjust the speed and qr to view
 */
export default {
  name: 'PsbtQrViewer',
  props: {
    /**
     * Array for all qr (svg)
     */
    qrs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      speed: {
        low: '1500',
        medium: '1000',
        fast: '500'
      },
      selectedSpeed: undefined,
      selectedQr: undefined,
      step: undefined,
      interval: undefined
    }
  },
  computed: {
    stepInfo () {
      return `${this.step + 1} of ${this.qrs.length}`
    },
    labelSpeed () {
      switch (this.selectedSpeed) {
      case this.speed.low:
        return '0.5x'
      case this.speed.medium:
        return '1x'
      case this.speed.fast:
        return '1.5x'
      default:
        return '1x'
      }
    }
  },
  watch: {
    selectedSpeed () {
      this.cleanInterval()
      this.configInterval()
    }
  },
  beforeMount () {
    this.step = 0
    this.selectedQr = this.qrs[this.step]
    this.selectedSpeed = this.speed.medium
  },
  beforeUnmount () {
    this.cleanInterval()
  },
  methods: {
    configInterval () {
      this.interval = setInterval(() => {
        if (this.step < this.qrs.length - 1) {
          this.step = this.step + 1
        } else {
          this.step = 0
        }
        this.selectedQr = this.qrs[this.step]
      }, this.selectedSpeed)
    },
    cleanInterval () {
      clearInterval(this.interval)
      this.interval = undefined
    },
    handlerInterval () {
      if (this.interval) {
        this.cleanInterval()
      } else {
        this.configInterval()
      }
    },
    nextStep () {
      if (this.step < this.qrs.length - 1) {
        this.step = this.step + 1
      } else this.step = 0
      this.selectedQr = this.qrs[this.step]
    },
    previousStep () {
      if (this.step > 0) {
        this.step = this.step - 1
      } else this.step = this.qrs.length - 1
      this.selectedQr = this.qrs[this.step]
    },
    handlerSpeed () {
      switch (this.selectedSpeed) {
      case this.speed.low:
        this.selectedSpeed = this.speed.medium
        break
      case this.speed.medium:
        this.selectedSpeed = this.speed.fast
        break
      case this.speed.fast:
        this.selectedSpeed = this.speed.low
        break
      default:
        this.selectedSpeed = this.speed.medium
      }
    }
  }
}
</script>
