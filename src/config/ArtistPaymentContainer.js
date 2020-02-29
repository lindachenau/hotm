import { connect } from 'react-redux'
import { resetBooking, addBooking, updateBooking, cancelBooking } from '../actions/bookingCreator'
import ArtistPayment from '../components/ArtistPayment'

const mapStateToProps = state => {
  return {
    bookingData: state.storeActivation.bookingData,
    comment: state.clientInfo.comment,
    clientName: state.clientInfo.client.name,
    userEmail: state.userInfo.email,
    userName: state.userInfo.firstName + ' ' + state.userInfo.lastName
  }
}
const mapDispatchToProps = dispatch => {
  return {
    resetBooking: () => dispatch(resetBooking()),
    addBooking: (bookingInfo, callMe) => dispatch(addBooking(bookingInfo, callMe)),
    updateBooking: (bookingInfo, callMe) => dispatch(updateBooking(bookingInfo, callMe)),
    cancelBooking: (bookingInfo) => dispatch(cancelBooking(bookingInfo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistPayment)