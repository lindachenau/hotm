import { connect } from 'react-redux'
import { resetBooking, addBooking, cancelBooking } from '../actions/bookingCreator'
import Payment from '../components/Payment'

const mapStateToProps = state => {
  return {
    bookingInfo: state.availArtists.recs[state.selectedArtist.order],
    bookingDate: state.bookingDateAddr.bookingDate,
    itemQty: state.itemQty,
    bookingDateAddr: state.bookingDateAddr,
    priceFactors: state.priceFactors,
    userId: state.userInfo.id,
    userName: state.userInfo.firstName + ' ' + state.userInfo.lastName,
    loggedIn: state.userInfo.loggedIn,
    clientEmail: state.userInfo.email
  }
}
const mapDispatchToProps = dispatch => {
  return {
    resetBooking: () => dispatch(resetBooking()),
    addBooking: (bookingInfo, bookingType, callMe) => dispatch(addBooking(bookingInfo, bookingType, callMe)),
    cancelBooking: (bookingInfo, bookingType, callMe) => dispatch(cancelBooking(bookingInfo, bookingType, callMe)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)