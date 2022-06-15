<template lang="pug">
#container
  #empty(v-if="!proposals || proposals.length === 0")
    q-card.q-pa-md
        .text-body2.text-center There are not proposals yet
  #list(v-if="proposals && proposals.length > 0")
    proposal-item.full-width.q-mt-md(v-for="proposal in proposals" v-bind="proposal" @proposalClicked="proposalClicked")
</template>

<script>
import ProposalItem from '~/components/proposals/proposal-item'

/**
 * This component handler the status for proposal list
 */
export default {
  name: 'ProposalsList',
  components: { ProposalItem },
  props: {
    /**
     * Proposal list to render for proposal-item component
     */
    proposals: {
      type: Array,
      default: () => []
    }
  },
  emits: ['onProposalSelected'],
  methods: {
    proposalClicked (data) {
      /**
      * Emit the data of selected proposal
      */
      this.$emit('onProposalSelected', data)
    }
  }
}
</script>
