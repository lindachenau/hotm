import { connect } from 'react-redux'
import Confirmation from '../components/Confirmation'

const mapStateToProps = state => {
  return {
    artistName: state.artists[state.availArtists.ids[state.selectedArtist.order]].name,
    items: state.services.items,
    bookingDate: state.bookingDateAddr.bookingDate,
    bookingAddr: state.bookingDateAddr.bookingAddr,
    itemQty: state.itemQty,
    organic: state.priceFactors.organic,
    pensionerRate: state.priceFactors.pensionerRate
  }
}

export default connect(mapStateToProps, null)(Confirmation)
