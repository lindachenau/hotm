import {SIGN_IN, SIGN_OUT} from '../actions/userCreator'

const initUser = {
  firstName: '',
  lastName: '',
  nickName: '',
  email: '',
  id: '',
  phone: '',
  loggedIn: false
}

export function userInfo(state = initUser, action) {
  switch (action.type) {
    case SIGN_IN: {
      return Object.assign({}, state, {
        firstName: action.payload.firstName,
        lastName: action.payload.firstName,
        nickName: action.payload.firstName,
        email: action.payload.firstName,
        id: action.payload.firstName,
        loggedIn: true
      })
    }
    case SIGN_OUT: {
      return Object.assign({}, initUser)
    }
    default:
      return state
  }
}