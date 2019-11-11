import { connect } from 'react-redux'
import { toggleOrganic, togglePensionerRate, submitBooking, getAvailArtist, changeSelectedArtist } from '../actions/bookingCreator'
import ServiceSelection from '../components/ServiceSelection'

const mapStateToProps = state => {
  return {
    organic: state.priceFactors.organic,
    pensionerRate: state.priceFactors.pensionerRate,
    bookingDate: state.bookingDateAddr.bookingDate,
    bookingAddr: state.bookingDateAddr.bookingAddr,
    itemQty: state.itemQty
  }
}

const mapDispatchToProps = dispatch => {
    return {
      toggleOrganic: () => dispatch(toggleOrganic()),
      togglePensionerRate: () => dispatch(togglePensionerRate()),
      submitBooking: (date, addr) => dispatch(submitBooking(date, addr)),
      getAvailArtist: (bookingItems, bookingDate, bookingAddr) => dispatch(getAvailArtist((bookingItems, bookingDate, bookingAddr))),
      changeSelectedArtist: id => dispatch(changeSelectedArtist((id)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceSelection)
