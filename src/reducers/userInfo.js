import {SIGN_IN, SIGN_OUT} from '../actions/userCreator'

const initUser = {
  firstName: '',
  lastName: '',
  nickName: '',
  email: '',
  id: '',
  phone: '',
  loggedIn: false,
  isArtist: false
}

export function userInfo(state = initUser, action) {
  switch (action.type) {
    case SIGN_IN: {
      return Object.assign({}, state, {
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        nickName: action.payload.nickName,
        email: action.payload.email,
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