import { getArtists } from '../utils/fakeload'

export default (state = getArtists(), action) => {
  return state
}