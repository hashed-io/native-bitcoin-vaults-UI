<template lang="pug">
#container
  q-stepper(
    v-model="step"
    animated
    ref="stepper"
    flat
  )
    q-step.minH(
      :name="steps.exportPsbt"
      title="Export PSBT"
      icon="settings"
      :done="step > steps.exportPsbt"
    )
      .row
        .col-6
          psbt-qr-viewer(v-if="psbtQR" :qrs="psbtQR")
        .col
          .text-body2.q-mt-md {{ $t('general.lorem') }}
    q-step.minH(
      :name="steps.importPsbt"
      title="Import signed PSBT"
      icon="settings"
      :done="step > steps.importPsbt"
    )
      .row
        .col-7
          psbt-qr-scanner.q-pa-md(@onScanned="onPSBTScanned")
        .col
          .text-body2.q-mt-md {{ $t('general.lorem') }}
    q-step.minH(
      :name="steps.finalize"
      title="Finalize"
      icon="settings"
      :done="step > steps.finalize"
      :disable="!signedPsbt"
    )
      .column.minH
        .col
            .row.items-center.q-col-gutter-sm.q-mb-md
                .col-6
                    q-btn.full-width(
                        label="Save PSBT"
                        color="secondary"
                        no-caps
                        outline
                        @click="savePsbt"
                    )
                .col
                    .text-body2 {{ $t('general.lorem') }}
        .col
            .row.items-center.q-col-gutter-sm.q-mb-md
                .col-6
                    q-btn.full-width(
                        label="Finalize PSBT"
                        color="secondary"
                        no-caps
                        outline
                        @click="finalizePsbt"
                        :disabled="!canFinalize"
                    )
                .col
                    .text-body2 {{ $t('general.lorem') }}
        .col
            .row.items-center.q-col-gutter-sm.q-mb-md
                .col-6
                    q-btn.full-width(
                        label="Broadcast PSBT"
                        color="secondary"
                        no-caps
                        outline
                        @click="broadcastPsbt"
                        :disabled="!canBroadcast"
                    )
                .col
                    .text-body2 {{ $t('general.lorem') }}
    template(v-slot:navigation)
      q-stepper-navigation
        .row.justify-end
            q-btn(v-if="step > 1" @click="$refs.stepper.previous()" flat color="primary" label="Back" class="q-ml-sm")
            q-btn(@click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'")
</template>

<script>
import PsbtQrViewer from '~/components/proposals/psbt-qr-viewer'
import PsbtQrScanner from '~/components/proposals/psbt-qr-scanner'
import { Encoder, Decoder } from '@smontero/nbv-ur-codec'

/**
 * This component handler all status to sign a psbt
 */
export default {
  name: 'SignProposalStepper',
  components: { PsbtQrViewer, PsbtQrScanner },
  props: {
    /**
     * Proposal PSBT
     */
    psbt: {
      type: String,
      default: undefined
    },
    /**
     * Boolean to know if the proposal can be finalized
     */
    canFinalize: {
      type: Boolean,
      default: false
    },
    /**
     * Boolean to know if the proposal can be broadcasted
     */
    canBroadcast: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onSavePsbt', 'onFinalizePsbt', 'onBroadcastPsbt'],
  data () {
    return {
      step: 1,
      steps: {
        exportPsbt: 1,
        importPsbt: 2,
        finalize: 3
      },
      psbtQR: undefined,
      signedPsbt: undefined
    }
  },
  watch: {
    psbt () {
      this.getPsbtQR()
    }
  },
  beforeMount () {
    this.getPsbtQR()
  },
  methods: {
    getPsbtQR () {
      try {
        this.showLoading()
        console.log('PsbtQrViewer', PsbtQrViewer)
        const encoder = new Encoder()
        this.psbtQR = encoder.psbtToQRCode(this.psbt, 200)
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async onPSBTScanned (data) {
      try {
        this.showLoading()
        const decoder = new Decoder()
        this.signedPsbt = decoder.decodePSBT(data)
        await this.$nextTick()
        setTimeout(() => {
          this.$refs.stepper.next()
        }, 500)
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    savePsbt () {
      /**
       * Emitted when the user click on save psbt button
       */
      this.$emit('onSavePsbt', this.signedPsbt)
    },
    finalizePsbt () {
      /**
       * Emitted when the user click on finalize psbt button
       */
      this.$emit('onFinalizePsbt', this.signedPsbt)
    },
    broadcastPsbt () {
      /**
       * Emitted when the user click on broadcast psbt button
       */
      this.$emit('onBroadcastPsbt', this.signedPsbt)
    }
  }
}
</script>

<style lang="stylus" scoped>
.stepContainer
  width: 25vw
  max-width: 80vw

.minH
 height: 70vh
</style>
