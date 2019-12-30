import { connect } from 'react-redux'
import { assignArtists, assignClient, saveBooking } from '../actions/bookingCreator'
import AddPeople from '../components/AddPeople'
import { statement } from '@babel/template'
import { FaSatellite } from 'react-icons/fa'

const mapStateToProps = state => {
  return {
    assignedArtists: state.assignedArtists,
    bookingDate: state.bookingDateAddr.bookingDate,
    bookingEnd: state.bookingDateAddr.bookingEnd,
    bookingAddr: state.bookingDateAddr.bookingAddr,
    itemQty: state.itemQty,
    organic: state.priceFactors.organic,
    pensioner: state.priceFactors.pensionerRate,
    clientInfo: state.clientInfo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    assignArtists: artistsIds => dispatch(assignArtists(artistsIds)),
    assignClient: client => dispatch(assignClient(client)),
    saveBooking: (bookingData) => dispatch(saveBooking(bookingData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPeople)
