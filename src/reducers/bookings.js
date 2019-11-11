import { getBookings } from '../utils/fakeload'

export default (state = getBookings(), action) => {
  return state
}