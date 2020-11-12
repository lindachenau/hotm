import { connect } from 'react-redux'
import { updateBooking, cancelBooking } from '../actions/bookingCreator'
import CancelBookingForm from '../components/CancelBookingForm'

const mapDispatchToProps = dispatch => {
  return {
    updateBooking: (bookingInfo, bookingType, callMe, checkout) => dispatch(updateBooking(bookingInfo, bookingType, callMe, checkout)),
    cancelBooking: (bookingInfo, bookingType) => dispatch(cancelBooking(bookingInfo, bookingType))
  }
}

export default connect(null, mapDispatchToProps)(CancelBookingForm)