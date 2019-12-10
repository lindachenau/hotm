import { connect } from 'react-redux'
import { resetBooking, addBooking, setActivateBookings } from '../actions/bookingCreator'
import Payment from '../components/Payment'

const mapStateToProps = state => {
  return {
    bookingInfo: state.availArtists.recs[state.selectedArtist.order],
    priceFactors: state.priceFactors,
    client_id: state.userInfo.id,
    clientName: state.userInfo.firstName + ' ' + state.userInfo.lastName,
    loggedIn: state.userInfo.loggedIn
  }
}
const mapDispatchToProps = dispatch => {
  return {
    resetBooking: () => dispatch(resetBooking()),
    addBooking: (bookingInfo, callMe) => dispatch(addBooking(bookingInfo, callMe)),
    setActivateBookings: (value) => dispatch(setActivateBookings(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)