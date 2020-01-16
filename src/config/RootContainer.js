import { connect } from 'react-redux'
import Routes from '../components/Routes'
import { changeBookingStage, resetBooking } from '../actions/bookingCreator'

const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors,
    itemQty: state.itemQty,
    artists: state.artists,
    clients: state.clients,
    bookings: state.bookings,
    bookingStage: state.bookingStage.stage,
    loggedIn: state.userInfo.loggedIn,
    isArtist: state.userInfo.isArtist
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeBookingStage: stage => dispatch(changeBookingStage(stage)),
    resetBooking: () => dispatch(resetBooking())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)