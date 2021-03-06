import { connect } from 'react-redux'
import Routes from '../components/Routes'
import { changeBookingStage, resetBooking } from '../actions/bookingCreator'

const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors,
    itemQty: state.itemQty,
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
    resetBooking: () => dispatch(resetBooking())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)