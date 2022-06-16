<template lang="pug">
#container
    .text-h6 Not Connected
    q-btn(
      label="Try again"
      @click="reload"
    )
</template>

<script>
export default {
  name: 'NotConnected',
  methods: {
    reload () {
      location.reload()
    }
  }
}
</script>
