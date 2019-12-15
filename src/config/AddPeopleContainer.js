import { connect } from 'react-redux'
import { assignArtists } from '../actions/bookingCreator'
import AddPeople from '../components/AddPeople'

const mapStateToProps = state => {
  return {
    artistId: state.availArtists.ids[state.selectedArtist.order],
    assignedArtists: state.assignedArtists,
    bookingDate: state.bookingDateAddr.bookingDate,
    bookingEnd: state.bookingDateAddr.bookingEnd,
    bookingAddr: state.bookingDateAddr.bookingAddr,
    itemQty: state.itemQty,
    organic: state.priceFactors.organic,
    pensioner: state.priceFactors.pensionerRate,
    availArtists: state.assignedArtists
  }
}

const mapDispatchToProps = dispatch => {
  return {
    assignArtists: artistsIds => dispatch(assignArtists(artistsIds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPeople)
