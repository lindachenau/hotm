import { combineReducers } from 'redux'
import {
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  availArtists,
  itemQty,
  storeActivation
} from './bookingInfo'

import { RESET_BOOKING } from '../actions/bookingCreator'

const appReducer = combineReducers({
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  availArtists,
  itemQty,
  storeActivation
})

const rootReducer = (state, action) => {
  if (action.type === RESET_BOOKING) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer