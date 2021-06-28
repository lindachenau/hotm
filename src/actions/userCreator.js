import { clients_url } from '../config/dataLinks'
import axios from 'axios'

export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export const signinUser = (apiToken, payload) => {
  return async function(dispatch) {
    try {
      const config = {
        method: 'get',
        headers: {
          "Authorization": `Bearer ${apiToken}`
        },        
        url: `${clients_url}?id=${payload.id}`
      }
      const result = await axios(config)
      const user = result.data
      /*
      * generate_auth_cookies references wp_usermeta. When database prefix is not wp, capabilities returns []. 
      * clients API fetches this meta_key explicitly. wp88_capabilities instead of wp_capabilities.
      */
      const role = user.capability ? user.capability : ""
      const isArtist = role.includes('staff_members')

      if (isArtist) {
        //Sign in artist to Google for Calendar access
        if (window.gapi) {
          // if (!window.gapi.auth2.getAuthInstance().isSignedIn.get())
          window.gapi.auth2.getAuthInstance().signIn()
        }
        else {
          console.log("Error: gapi not loaded")
        }
      }        

      dispatch({
        type: SIGN_IN,
        payload: Object.assign({}, payload, {
          name: user.name,
          phone: user.phone,
          address: user.address,
          isArtist: isArtist
        })
      })
    } catch (err) {
      console.log("Client fetching error: ", err)
    }
  }
}

export const signoutUser = () => ({
  type: SIGN_OUT,
})
