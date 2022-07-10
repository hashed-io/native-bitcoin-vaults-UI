<template lang="pug">
#container.q-gutter-sm
  vault-item.animated-item(v-for="vault in vaults" v-bind="vault" @onVaultDetails="onVaultDetails")
</template>

<script>
import VaultItem from '~/components/vaults/vault-item.vue'

export default {
  name: 'VaultList',
  components: {
    VaultItem
  },
  props: {
    vaults: {
      type: Array,
      default: () => []
    }
  },
  emits: ['onVaultDetails'],
  methods: {
    onVaultDetails (vault) {
      this.$emit('onVaultDetails', vault)
    }
  }
}
</script>
