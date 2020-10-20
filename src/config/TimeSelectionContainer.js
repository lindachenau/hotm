import { connect } from 'react-redux'
import { submitBooking } from '../actions/bookingCreator'
import TimeSelection from '../components/TimeSelection'

const mapStateToProps = state => {
  return {
    bookingDateAddr: state.bookingDateAddr,
    itemQty: state.itemQty,
    pensionerRate: state.priceFactors.pensionerRate
  }
}

const mapDispatchToProps = dispatch => {
    return {
      submitBooking: (artistStart, date, bookingEnd, addr) => dispatch(submitBooking(artistStart, date, bookingEnd, addr))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelection)