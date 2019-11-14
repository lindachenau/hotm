import { GET_SERVICES_ASYNC } from '../actions/asyncCreator'
import { GET_SERVICES_TEST } from '../actions/testCreator'

import { createServices } from '../utils/dataFormatter'

export default function services (state = {}, action) {
  switch (action.type) {
    case GET_SERVICES_ASYNC: {
      return createServices(action.payload)
    }
    case GET_SERVICES_TEST: {
      return action.payload
    }
    default: {
      return state
    }
  }
}
