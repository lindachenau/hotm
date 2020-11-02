import { connect } from 'react-redux'
import Routes from '../components/Routes'
import { changeBookingStage, resetBooking, searchBooking, enableStore } from '../actions/bookingCreator'

const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors,
    itemQty: state.itemQty,
    artists: state.artists,
    bookings: state.bookings,
    bookingStage: state.bookingStage.stage,
    bookingType: state.bookingFilter.bookingType.name,
    loggedIn: state.userInfo.loggedIn,
    isArtist: state.userInfo.isArtist,
    userEmail: state.userInfo.email
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeBookingStage: stage => dispatch(changeBookingStage(stage)),
    resetBooking: () => dispatch(resetBooking()),
    enableStore: () => dispatch(enableStore()),
    searchBooking: () => dispatch(searchBooking())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)