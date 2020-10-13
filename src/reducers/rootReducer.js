import { combineReducers } from 'redux'
import {
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  availArtists,
  itemQty,
  storeActivation,
  bookingFilter
} from './bookingInfo'

import { userInfo } from './userInfo'

const rootReducer = combineReducers({
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  availArtists,
  itemQty,
  storeActivation,
  bookingFilter,
  userInfo,
})

export default rootReducer