import { connect } from 'react-redux'
import Routes from './Routes'
import { changeBookingStage } from '../actions/bookingCreator'

const checkPackageBooking = (itemQty) => {
  return Object.keys(itemQty).filter(id => parseInt(id) >= 44).length > 0
}


const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors,
    itemQty: state.itemQty,
    artists: state.artists,
    clients: state.clients,
    bookings: state.bookings,
    bookingStage: state.bookingStage.stage,
    packageBooking: checkPackageBooking(state.itemQty)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeBookingStage: stage => dispatch(changeBookingStage(stage))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)