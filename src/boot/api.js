/* eslint-disable dot-notation */
import PolkadotApi from '~/services/polkadotApi'
import { NbvStorageApi } from '~/services/polkadot-pallets'
import BdkApi from '~/services/bdk/bdkApi'
import { showGlobalLoading, hideGlobalLoading, showGlobalNotification } from '~/mixins/notifications'

export default async ({ app, store }) => {
  try {
    showGlobalLoading({
      message: 'Connecting with server'
    })
    const api = new PolkadotApi()
    const bdkApi = new BdkApi()
    await api.connect()
    console.log('PolkadotApiCreated', api)
    // const treasuryApi = new TreasuryApi(api, showGlobalLoading)
    const nbvStorageApi = new NbvStorageApi(api, showGlobalLoading)
    store['$polkadotApi'] = api
    // store['$treasuryApi'] = treasuryApi
    store['$nbvStorageApi'] = nbvStorageApi
    store['$bdkApi'] = bdkApi
    store['$connectedToServer'] = true
  } catch (e) {
    store['$connectedToServer'] = false
    showGlobalNotification({ message: e.message || e, color: 'negative' })
  } finally {
    hideGlobalLoading()
  }
}
