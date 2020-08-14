import { connect } from 'react-redux'
import { addBooking } from '../actions/bookingCreator'
import CorporateBooking from '../pages/CorporateBooking'

const mapDispatchToProps = dispatch => {
  return {
    addBooking: (bookingInfo, bookingType, callMe) => dispatch(addBooking(bookingInfo, bookingType, callMe))
  }
}

export default connect(null, mapDispatchToProps)(CorporateBooking)