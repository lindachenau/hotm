import { connect } from 'react-redux'
import { updateBooking } from '../actions/bookingCreator'
import MyCalendar from '../pages/MyCalendar'

const mapDispatchToProps = dispatch => {
  return {
    updateBooking: (bookingInfo, bookingType, callMe, checkout) => dispatch(updateBooking(bookingInfo, bookingType, callMe, checkout))
  }
}

export default connect(null, mapDispatchToProps)(MyCalendar)