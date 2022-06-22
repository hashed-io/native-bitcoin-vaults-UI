<template lang="pug">
q-banner.text-white(rounded :class="{ 'bg-red': error, 'bg-warning': loading, 'bg-primary': normal }")
    template(v-slot:avatar v-if="status")
      q-spinner-tail(v-if="loading" color="white" size="md")
      q-icon(v-else-if="error" name="notification_important" color="white" size="md")
    .text-body2 {{ message }}
</template>

<script>
/**
 * This component show a banner with message
 */
export default {
  name: 'Banner',
  props: {
    /**
     * Message to show
     */
    message: {
      type: String,
      default: undefined
    },
    /**
     * Switch to show spinner, error or success icon
     */
    status: {
      type: String,
      default: undefined
    }
  },
  computed: {
    error () {
      return !!(this.status && this.status.toLowerCase() === 'error')
    },
    loading () {
      return !!(this.status && this.status.toLowerCase() === 'loading')
    },
    normal () {
      return !!(!this.status || this.status.toLowerCase() === '')
    }
  },
  mounted () {
    console.log('mounted', this.status, this.message)
  }
}
</script>
