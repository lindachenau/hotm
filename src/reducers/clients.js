import { getClients } from '../utils/fakeload'

export default (state = getClients(), action) => {
  return state
}