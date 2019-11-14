import { connect } from 'react-redux'
import { changeSelectedArtist } from '../actions/bookingCreator'
import ArtistSelection from '../components/ArtistSelection'

//temporary testing code before API is ready
const fillArtists = (artists, ids) => {
  let availArtists = []
  for (let id of ids) {
    availArtists.push(artists[id.toString()])
  }

  return availArtists
}

const mapStateToProps = state => {
  return {
    availArtists: fillArtists(state.artists, state.availArtists.ids),
    selectedArtist: state.selectedArtist.order
  }
}

const mapDispatchToProps = dispatch => {
    return {
      changeSelectedArtist: id => dispatch(changeSelectedArtist((id)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistSelection)