import { combineReducers } from 'redux'
import services from './services'
import artists from './artists'
import clients from './clients'
import bookings from './bookings'
import {
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  availArtists,
  itemQty
} from './bookingInfo'

export default combineReducers({
  services,
  artists,
  clients,
  bookings,
  priceFactors,
  bookingDateAddr,
  bookingStage,
  selectedArtist,
  availArtists,
  itemQty
})