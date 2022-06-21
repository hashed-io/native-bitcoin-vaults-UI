<template lang="pug">
#container.q-gutter-y-sm
  q-card(v-for="cosigner in cosigners")
    account-item(:address="cosigner.address")
        q-item-section(v-if="cosigner.signed" avatar)
            q-chip(label="Signed" color="primary" text-color="white")
</template>

<script>
import { AccountItem } from '~/components/common'

/**
 * This component handler the events for cosigners list
 */
export default {
  name: 'CosignersList',
  components: { AccountItem },
  props: {
    /**
     * Cosigners Array [{ address, signed }]
     */
    cosigners: {
      type: Array,
      default: () => []
    }
  }
}
</script>
