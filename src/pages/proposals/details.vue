<template lang="pug">
#container
  .text-h5.q-mb-md Proposal Details
</template>

<script>
export default {
  name: 'ProposalDetails',
  data () {
    return {
      parentParams: undefined,
      proposal: undefined
    }
  },
  mounted () {
    const params = this.$route.params
    if (params && params.parentParams) {
      const paramsParent = JSON.parse(params.parentParams)
      this.proposal = JSON.parse(params.proposalParams)
      // Set router to back
      const breadcrumb = this.$route.meta.breadcrumb.map(b => {
        if (b.name === 'Details') {
          return {
            ...b,
            back: false,
            to: {
              name: 'vaultDetails',
              params: paramsParent
            }
          }
        }
        return b
      })
      this.$route.meta.breadcrumb = breadcrumb
    }
  }
}
</script>
