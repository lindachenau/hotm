import { connect } from 'react-redux'
import { addBooking, loadBooking } from '../actions/bookingCreator'
import ArtistBooking from '../pages/ArtistBooking'

const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addBooking: (bookingInfo, bookingType, callMe) => dispatch(addBooking(bookingInfo, bookingType, callMe)),
    loadBooking: booking => dispatch(loadBooking((booking)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistBooking)