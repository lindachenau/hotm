import { clients_url } from '../config/dataLinks'
import axios from 'axios'

export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export const signinUser = (payload) => {
  return async function(dispatch) {
    try {
      const config = {
        method: 'get',
        url: `${clients_url}?id=${payload.id}`
      }
      const result = await axios(config)
      const user = result.data
      dispatch({
        type: SIGN_IN,
        payload: Object.assign({}, payload, {
          phone: user.phone,
          address: user.address
        })
      })
    } catch (err) {
      console.log("Client fetching error")
    }
  }
}

export const signoutUser = () => ({
  type: SIGN_OUT,
})
