import { connect } from 'react-redux'
import { addBooking, updateBooking, cancelBooking } from '../actions/bookingCreator'
import CorporateBooking from '../pages/CorporateBooking'

const mapDispatchToProps = dispatch => {
  return {
    addBooking: (bookingInfo, bookingType, callMe) => dispatch(addBooking(bookingInfo, bookingType, callMe)),
    updateBooking: (bookingInfo, bookingType, callMe) => dispatch(updateBooking(bookingInfo, bookingType, callMe)),
    cancelBooking: (bookingInfo, bookingType, callMe) => dispatch(cancelBooking(bookingInfo, bookingType, callMe))
  }
}

export default connect(null, mapDispatchToProps)(CorporateBooking)