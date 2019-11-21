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
      submitBooking: (date, bookingEnd, addr) => dispatch(submitBooking(date, bookingEnd, addr)),
      getAvailArtist: (url) => dispatch(getAvailArtist(url)),
      changeSelectedArtist: id => dispatch(changeSelectedArtist((id)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceSelection)
