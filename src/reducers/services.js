import { getServices } from '../utils/fakeload'

export default (state = getServices(), action) => {
  return state
}