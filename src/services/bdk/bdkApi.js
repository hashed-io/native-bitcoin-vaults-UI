import axios from 'axios'

class BdkApi {
  constructor (baseUrl) {
    this.baseUrl = baseUrl || process.env.BDK_SERVICES_URL
    this.request = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * @description Get multisig
   * @param {String} descriptor Output descriptor
   */
  async getMultisig ({ descriptor }) {
    try {
      const { data } = await this.request.post('/get_multisig', {
        descriptor
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * @description Get new receive address
   * @param {String} descriptor Output descriptor
   */
  async getNewAddress ({ descriptor }) {
    try {
      const { data } = await this.request.post('/gen_new_address', {
        descriptor
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * @description Get balance
   * @param {String} descriptor Output descriptor
   * @param {String} changeDescriptor Change descriptor
   */
  async getBalance ({ descriptor, changeDescriptor }) {
    try {
      const { data } = await this.request.post('/get_balance', {
        descriptor,
        change_descriptor: changeDescriptor
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default BdkApi
