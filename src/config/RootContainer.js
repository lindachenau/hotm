import { connect } from 'react-redux'
import Routes from '../components/Routes'
import { changeBookingStage } from '../actions/bookingCreator'

const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors,
    itemQty: state.itemQty,
    artists: state.artists,
    clients: state.clients,
    bookings: state.bookings,
    bookingStage: state.bookingStage.stage,
    loggedIn: state.userInfo.loggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeBookingStage: stage => dispatch(changeBookingStage(stage))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)