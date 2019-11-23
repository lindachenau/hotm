export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export const signinUser = (payload) => ({
  type: SIGN_IN,
  payload
})

export const signoutUser = () => ({
  type: SIGN_OUT,
})
