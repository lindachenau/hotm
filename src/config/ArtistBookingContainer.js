import { connect } from 'react-redux'
import { addBooking, loadBooking, updateBooking } from '../actions/bookingCreator'
import ArtistBooking from '../pages/ArtistBooking'

const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addBooking: (bookingInfo, bookingType, callMe) => dispatch(addBooking(bookingInfo, bookingType, callMe)),
    updateBooking: (bookingInfo, bookingType, callMe) => dispatch(updateBooking(bookingInfo, bookingType, callMe)),
    loadBooking: booking => dispatch(loadBooking((booking)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistBooking)