import { connect } from 'react-redux'
import Confirmation from '../components/Confirmation'

const mapStateToProps = state => {
  return {
    artistId: state.availArtists.ids[state.selectedArtist.order],
    bookingDate: state.bookingDateAddr.bookingDate,
    bookingEnd: state.bookingDateAddr.bookingEnd,
    bookingAddr: state.bookingDateAddr.bookingAddr,
    itemQty: state.itemQty,
    organic: state.priceFactors.organic,
    pensioner: state.priceFactors.pensionerRate
  }
}

export default connect(mapStateToProps, null)(Confirmation)
