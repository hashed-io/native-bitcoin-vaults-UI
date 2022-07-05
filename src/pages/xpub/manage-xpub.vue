<template lang="pug">
#container
  .row.items-center.q-mb-md
    .text-h5 Manage Public Keys
    q-icon.q-ml-sm.icon-btn(name="help" color="primary" size="sm")
      q-tooltip.text-body2.myTooltip(:offset="[10, 10]")
        .myTooltip {{ $t('xpub.extendedPublicKeyInfo') }}
  .text-body2.text-weight-light.q-mb-lg {{ $t('xpub.textInfo')  }}
  q-card(v-if="userHasXpub")
    q-item
      q-item-section
        .one-line {{ userXpub.toHuman() }}
      q-item-section(avatar)
        q-icon.icon-btn(
          v-ripple
          round
          name="delete"
          color="negative"
          @click="removeXpub"
        )
          q-tooltip Remove your XPUB
  set-xpub-form(v-else :userAddress="selectedAccount.address" @onSubmitted="setXpub")
</template>

<script>
import SetXpubForm from '~/components/xpub/set-xpub-form'
import { mapGetters } from 'vuex'

export default {
  name: 'ManageXpub',
  components: {
    SetXpubForm
  },
  data () {
    return {
      userXpub: undefined,
      xpubUnsub: undefined
    }
  },
  computed: {
    ...mapGetters('polkadotWallet', ['selectedAccount']),
    userHasXpub () {
      return !!this.userXpub
    }
  },
  watch: {
    selectedAccount () {
      // await this.unsubscribeToXPUB()
      // this.subscribeToXPUB()
      this.getXpub()
    }
  },
  mounted () {
    this.getXpub()
    // this.subscribeToXPUB()
  },
  beforeUnmount () {
    // this.unsubscribeToXPUB()
  },
  methods: {
    async subscribeToXPUB () {
      try {
        this.showLoading()
        this.xpubUnsub = await this.$store.$nbvStorageApi.getXpubByUser(
          this.selectedAccount.address,
          e => {
            this.getXpub(e)
          }
        )
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async unsubscribeToXPUB () {
      try {
        this.showLoading()
        await this.xpubUnsub()
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async getXpub () {
      try {
        this.showLoading()
        this.userXpub = undefined
        const xpubId = await this.$store.$nbvStorageApi.getXpubByUser(this.selectedAccount.address)
        if (xpubId && xpubId.value) {
          const xpub = await this.$store.$nbvStorageApi.getXpubById(xpubId.value)
          this.userXpub = xpub.isEmpty ? undefined : xpub.value
        }
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async setXpub (payload) {
      try {
        this.showLoading({ message: this.$t('general.waitingWeb3') })
        console.log('setXpub', payload)
        await this.$store.$nbvStorageApi.submitXPUB({
          user: this.selectedAccount.address,
          XPUB: payload.XPUB
        })
        // console.log('setXpub', response)
        this.showNotification({ message: 'Your XPUB was added' })
        this.getXpub()
        // this.showLoading({ message: this.$t('general.waitingSub') })
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    },
    async removeXpub () {
      try {
        this.showLoading({ message: this.$t('general.waitingWeb3') })
        await this.$store.$nbvStorageApi.removeXpub({ user: this.selectedAccount.address })
        this.showNotification({ message: 'Your XPUB was removed' })
        // this.showLoading({ message: this.$t('general.waitingSub') })
        this.getXpub()
      } catch (e) {
        console.error('error', e)
        this.showNotification({ message: e.message || e, color: 'negative' })
      } finally {
        this.hideLoading()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.myTooltip
  // width: 500px
  max-width: 600px
</style>
