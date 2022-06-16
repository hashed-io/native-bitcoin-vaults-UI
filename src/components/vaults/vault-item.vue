<template lang="pug">
q-card.q-pa-sm(@click="goToVaultDetails")
  q-item
    q-item-section.q-gutter-y-xs
      //- .text-subtitle2 Id:
      //-   span.text-body2.one-line.q-ml-sm {{ vaultId }}
      .row.items-center
        q-icon.q-mr-md(name="description" size="sm" color="secondary")
        .text-subtitle2 Description:
          span.text-body2.q-ml-sm {{ description }}
      .row.items-center
        q-icon.q-mr-md(name="people" size="sm" color="secondary")
        .text-subtitle2 Threshold:
          span.text-body2.q-ml-sm {{ threshold }}
      .text-subtitle2 Owner
      account-item(:address="owner" flat inherit)
    q-item-section(avatar)
      .text-subtitle2.text-primary.hoverView Click to see details
      //- q-btn(
      //-   label="See details"
      //-   no-caps
      //-   size="md"
      //-   color="secondary"
      //-   @click="goToVaultDetails"
      //- )
</template>

<script>
import { AccountItem } from '~/components/common'

/**
 * This component show vault item info
 */
export default {
  name: 'VaultItem',
  components: { AccountItem },
  props: {
    /**
     * Vault Id
     */
    vaultId: {
      type: String,
      default: undefined
    },
    /**
     * Array of vault cosigners (address values)
     */
    cosigners: {
      type: Array,
      default: () => []
    },
    /**
     * Vault Description
     */
    description: {
      type: String,
      default: undefined
    },
    /**
     * Vault Descriptor
     */
    descriptors: {
      type: Object,
      default: () => {}
    },
    /**
     * Vault Owner
     */
    owner: {
      type: String,
      default: undefined
    },
    /**
     * Vault Threshold
     */
    threshold: {
      type: [String, Number],
      default: undefined
    },
    /**
     * Offchain Statis
     */
    offchainStatus: {
      type: [Object, String],
      default: () => undefined
    }
  },
  methods: {
    goToVaultDetails () {
      const vault = {
        vaultId: this.vaultId,
        cosigners: this.cosigners,
        description: this.description,
        outputDescriptor: this.descriptors.outputDescriptor,
        changeDescriptor: this.descriptors.changeDescriptor,
        owner: this.owner,
        threshold: this.threshold,
        offchainStatus: this.offchainStatus
      }
      this.$router.push({
        name: 'vaultDetails',
        params: { vault: JSON.stringify(vault) }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.hoverView
  display: none

.animated-item:hover .hoverView
  display: block
</style>
