<template lang="pug">
#container
  #empty(v-if="!vaults || vaults.length === 0")
    .text-body2.text-center There are not vaults yet
  #list.q-gutter-y-sm(v-else)
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
