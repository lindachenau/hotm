import { connect } from 'react-redux'
import { changeSelectedArtist } from '../actions/bookingCreator'
import PickTherapist from '../components/PickTherapist'

const mapStateToProps = state => {
  return {
    availArtists: state.availArtists,
    selectedArtist: state.selectedArtist.order,
    bookingDateAddr: state.bookingDateAddr
  }
}

const mapDispatchToProps = dispatch => {
    return {
      changeSelectedArtist: order => dispatch(changeSelectedArtist((order)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickTherapist)