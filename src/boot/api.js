/* eslint-disable dot-notation */
import PolkadotApi from '~/services/polkadotApi.js'
import { TreasuryApi, NbvStorageApi } from '~/services/polkadot-pallets'
import { showGlobalLoading, hideGlobalLoading, showGlobalNotification } from '~/mixins/notifications'

export default async ({ app, store }) => {
  try {
    showGlobalLoading({
      message: 'Connecting with server'
    })
    const api = new PolkadotApi()
    await api.connect()
    console.log('PolkadotApiCreated', api)
    const treasuryApi = new TreasuryApi(api, showGlobalLoading)
    const nbvStorageApi = new NbvStorageApi(api, showGlobalLoading)
    store['$polkadotApi'] = api
    store['$treasuryApi'] = treasuryApi
    store['$nbvStorageApi'] = nbvStorageApi
    store['$connectedToServer'] = true
  } catch (e) {
    store['$connectedToServer'] = false
    showGlobalNotification({ message: e.message || e, color: 'negative' })
  } finally {
    hideGlobalLoading()
  }
}
