import {SIGN_IN, SIGN_OUT} from '../actions/userCreator'

const initUser = {
  name: '',
  email: '',
  id: '',
  phone: '',
  address: '',
  loggedIn: false,
  isArtist: false
}

export function userInfo(state = initUser, action) {
  switch (action.type) {
    case SIGN_IN: {
      return Object.assign({}, state, {
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
        address: action.payload.address,
        id: action.payload.id,
        loggedIn: action.payload.loggedIn,
        isArtist: action.payload.isArtist
      })
    }
    case SIGN_OUT: {
      return Object.assign({}, initUser)
    }
    default:
      return state
  }
}