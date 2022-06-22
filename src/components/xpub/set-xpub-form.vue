<template lang="pug">
#container.q-gutter-y-sm
  q-form.q-gutter-y-md(ref="form" @submit="setXpub")
    q-toggle(
      data-testid="toggleForm"
      data-cy="toggleForm"
      label="Use form"
      v-model="useForm"
    )
    #useForm.q-gutter-y-sm(v-if="useForm")
     .row.q-col-gutter-x-md
        .col-7
          q-input(
            data-testid="labelInput"
            data-cy="labelInput"
            v-model="label"
            placeholder="Label"
            label="Label"
            outlined
            disable
          )
        .col
          .text-body2 {{ $t('general.lorem')  }}
     .row.q-col-gutter-x-md
        .col-7
          q-input(
            data-testid="publicKey"
            data-cy="publicKey"
            v-model="publicKey"
            placeholder="Public Key"
            label="Public key"
            outlined
            :rules="[rules.required, rules.isValidXPub]"
          )
        .col
          .text-body2 {{ $t('general.loremShort')  }}
     .row.q-col-gutter-x-md
        .col-7
          q-input(
            data-testid="masterFingerprint"
            data-cy="masterFingerprint"
            v-model="masterFingerprint"
            placeholder="Master fingerprint"
            label="Master fingerprint"
            :rules="[rules.required, rules.isValidFingerPrint]"
            outlined
          )
        .col
          .text-body2 {{ $t('general.loremShort')  }}
     .row.q-col-gutter-x-md
        .col-7
          q-input(
            data-testid="derivationInput"
            data-cy="derivationInput"
            v-model="derivation"
            placeholder="Derivation"
            label="Derivation path"
            :rules="[rules.required, rules.isValidDerivationPath]"
            outlined
          )
        .col
          .text-body2 {{ $t('general.lorem')  }}
    #scanQR(v-else)
      .row.q-col-gutter-x-md
        .col-7
            q-input(
                data-testid="fullXpubInput"
                data-cy="fullXpubInput"
                v-model="fullXpub"
                placeholder="Paste or write your XPUB"
                label="XPUB"
                stack-label
                outlined
                :rules="[rules.required, rules.isValidFullXpub]"
            )
                template(v-slot:append)
                    q-icon.icon-btn(data-testid="openQr" data-cy="openQr" name="qr_code_scanner" @click="toggleQRScanner(true)")
                        q-tooltip Scan your XPUB
        .col
          .text-body2 {{ $t('general.lorem')  }}
    q-btn.q-mt-sm(
      data-testid="submitButton"
      data-cy="submitButton"
      label="Set XPUB"
      color="primary"
      no-caps
      type="submit"
    )
  #modals
    qr-decode-xpub(ref="qrDecodeXpub" @xpubDecoded="onDecode" )
</template>

<script>
import QrDecodeXpub from '~/components/decode/qr-decode-xpub'
import { validation } from '~/mixins/validation'

export default {
  name: 'SetXpubForm',
  components: {
    QrDecodeXpub
  },
  mixins: [validation],
  props: {
    /**
     * Polkadot address
     * This prop is used to set the address in the form
     */
    userAddress: {
      type: String,
      default: undefined
    }
  },
  emits: ['onSubmitted'],
  data () {
    return {
      // fullXpub: "[993D5AA8/48'/0'/0'/2']Zpub752e1TJf2Roex9i8Wr4BCVgtoEWtQQeP2bievFbxFyheuNJoUQMXwxuafVercaBhAWXno2wXWAQesVjrDRNHkCL9Jf89Gx4aRKNNCF5Moq2",
      fullXpub: undefined,
      useForm: false,
      publicKey: undefined,
      masterFingerprint: undefined,
      derivation: "m/48'/0'/0'/2'",
      label: undefined
    }
  },
  methods: {
    toggleQRScanner (bool) {
      if (bool) {
        this.$refs.qrDecodeXpub.openDialog()
      } else this.$refs.qrDecodeXpub.hideDialog()
    },
    onDecode (xpub) {
      this.toggleQRScanner(false)
      this.fullXpub = xpub.fullXpub
    },
    setXpub () {
      const XPUB = (!this.useForm) ? this.fullXpub : `[${this.masterFingerprint}${this.derivation.replace('m', '')}]${this.publicKey}`
      this.$emit('onSubmitted', {
        // XPUB: this.fullXpub
        XPUB
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon-btn:hover
  color: primary
</style>
