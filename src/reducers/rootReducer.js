import { combineReducers } from 'redux'
import {
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  assignedArtists,
  availArtists,
  itemQty,
  storeActivation
} from './bookingInfo'

import { userInfo } from './userInfo'

const rootReducer = combineReducers({
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  assignedArtists,
  availArtists,
  itemQty,
  storeActivation,
  userInfo
})

export default rootReducer