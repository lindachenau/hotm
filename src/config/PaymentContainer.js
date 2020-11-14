import { connect } from 'react-redux'
import { resetBooking, addBooking, updateBooking, cancelBooking } from '../actions/bookingCreator'
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
    clientEmail: state.userInfo.email,
    phone: state.userInfo.phone,
    name: state.userInfo.name
  }
}
const mapDispatchToProps = dispatch => {
  return {
    resetBooking: () => dispatch(resetBooking()),
    addBooking: (bookingInfo, bookingType, callMe) => dispatch(addBooking(bookingInfo, bookingType, callMe)),
    updateBooking: (bookingInfo, bookingType, callMe, checkout) => dispatch(updateBooking(bookingInfo, bookingType, callMe, checkout)),
    cancelBooking: (bookingInfo, bookingType, callMe) => dispatch(cancelBooking(bookingInfo, bookingType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)