import { connect } from 'react-redux'
import { resetBooking, addBooking, setActivateBookings } from '../actions/bookingCreator'
import ArtistPayment from '../components/ArtistPayment'

const mapStateToProps = state => {
  return {
    bookingData: state.storeActivation.bookingData,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    resetBooking: () => dispatch(resetBooking()),
    addBooking: (bookingInfo, callMe) => dispatch(addBooking(bookingInfo, callMe))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistPayment)