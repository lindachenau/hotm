import { connect } from 'react-redux'
import { updateBooking } from '../actions/bookingCreator'
import PaymentLink from '../pages/PaymentLink'

const mapDispatchToProps = dispatch => {
  return {
    updateBooking: (bookingInfo, bookingType, callMe, checkout) => dispatch(updateBooking(bookingInfo, bookingType, callMe, checkout))
  }
}

export default connect(null, mapDispatchToProps)(PaymentLink)