<template lang="pug">
#container
  //- Header
  .row.justify-between.q-mb-md
    .text-h5 Proposal Details
    q-btn(
      label="Delete Proposal"
      color="negative"
      icon="delete"
      no-caps
      outline
    )
  //- Body
  .text-subtitle2.q-mt-md Vault Id
  .text-body2 {{ proposal.vaultId }}
  .text-subtitle2.q-mt-md Proposal Id
  .text-body2 {{ proposal.proposalId }}
  .row
    .col
      .text-subtitle2.q-mt-md Description
      .text-body2 {{ proposal.description }}
    .col
      .text-subtitle2.q-mt-md Status
      .text-body2 {{ proposal.status }}
  .row
    .col
      .text-subtitle2.q-mt-md Satoshi Amount
      .text-body2 {{ proposal.amount }}
    .col
      .text-subtitle2.q-mt-md Fee in Satoshi Per Virtual Byte
      .text-body2 {{ proposal.feeSatPerVb }}
  .text-subtitle2.q-mt-md To Address
  .text-body2 {{ proposal.toAddress }}
  .text-subtitle2.q-mt-md Proposer
  account-item(:address="proposal.proposer")
</template>

<script>
import { AccountItem } from '~/components/common'
export default {
  name: 'ProposalDetails',
  components: { AccountItem },
  data () {
    return {
      // parentParams: undefined,
      proposal: undefined
    }
  },
  beforeMount () {
    const params = this.$route.params
    if (params && params.parentParams) {
      const paramsParent = JSON.parse(params.parentParams)
      console.log('paramsParent', paramsParent)
      const proposal = JSON.parse(params.proposalParams)
      if (proposal && proposal.vaultId) {
        this.proposal = proposal
      } else {
        this.$router.replace({
          name: 'manageVaults'
        })
      }
      // Set router to back
      const breadcrumb = this.$route.meta.breadcrumb.map(b => {
        if (b.name === 'Details') {
          return {
            ...b,
            back: false,
            to: {
              name: 'vaultDetails',
              params: { vault: JSON.stringify(paramsParent) }
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
