import { connect } from 'react-redux'
import { addBooking } from '../actions/bookingCreator'
import ArtistBooking from '../pages/ArtistBooking'

const mapStateToProps = state => {
  return {
    priceFactors: state.priceFactors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addBooking: (bookingInfo, bookingType, callMe) => dispatch(addBooking(bookingInfo, bookingType, callMe))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistBooking)