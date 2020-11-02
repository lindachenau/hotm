import { connect } from 'react-redux'
import { updateBooking, getClient } from '../actions/bookingCreator'
import MyCalendar from '../pages/MyCalendar'

const mapStateToProps = state => {
  return {
    client: state.client
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateBooking: (bookingInfo, bookingType, callMe, checkout) => dispatch(updateBooking(bookingInfo, bookingType, callMe, checkout)),
    getClient: (clientId) => dispatch(getClient(clientId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCalendar)