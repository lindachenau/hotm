import { connect } from 'react-redux'
import { resetBooking, addBooking, setActivateBookings } from '../actions/bookingCreator'
import Payment from '../components/Payment'

let bookingId = 100

const mapStateToProps = state => {
  return {
    bookingInfo: {
      id: bookingId++,
      start: state.bookingDateAddr.bookingDate,
      end: state.bookingDateAddr.bookingEnd,
      address: state.bookingDateAddr.bookingAddr,
      artist: state.availArtists.ids[state.selectedArtist.order],
      client: 2,
      items: Object.keys(state.itemQty),
      quantity: Object.values(state.itemQty),
      organic: state.priceFactors.organic,
      pensionerRate: state.priceFactors.pensionerRate,
      depositPaid: 0,
      balancePaid: 0,
      comment: ''
    },
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