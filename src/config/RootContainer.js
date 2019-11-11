import { connect } from 'react-redux'
import Routes from './Routes'
import { changeBookingStage } from '../actions/bookingCreator'
import { filter } from 'dom-helpers'

const getBookingValue = (items, priceFactors, itemQty) => {
  let total = 0
  let organic = priceFactors.organic
  let pensioner = priceFactors.pensionerRate

  for (let id of Object.keys(itemQty)) {
    let qty = itemQty[id]
    total += (organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1) * qty
  }
  
  return total.toFixed(2)
}

const checkPackageBooking = (itemQty) => {
  //Only keep non-zero items
  let filteredIds = Object.keys(itemQty).map(key => (itemQty[key] > 0 ? key : null))

  return filteredIds.filter(id => id >= 44) != null
}

const mapStateToProps = state => {
  return {
    services: state.services,
    artists: state.artists,
    clients: state.clients,
    bookings: state.bookings,
    bookingStage: state.bookingStage.stage,
    bookingValue: getBookingValue(state.services.items, state.priceFactors, state.itemQty),
    packageBooking: checkPackageBooking(state.itemQty)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeBookingStage: stage => dispatch(changeBookingStage(stage))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)