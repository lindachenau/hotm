import {
  CHANGE_ORGANIC,
  CHANGE_PENSIONER_RATE,
  CHANGE_BOOKING_STAGE,
  SET_SELECTED_ARTIST,
  INC_ITEM_QTY,
  DEC_ITEM_QTY,
  SUBMIT_BOOKING,
  GET_AVAIL_ARTISTS,
  RECEIVE_AVAIL_ARTISTS,
  ERROR_AVAIL_ARTISTS,
  ACTIVATE_CLIENTS,
  ACTIVATE_BOOKINGS,
  ADD_BOOKING
} from '../actions/bookingCreator'

const initPriceFactors = {
  organic: false,
  pensionerRate: false
}

export function priceFactors(state = initPriceFactors, action) {
  switch (action.type) {
    case CHANGE_ORGANIC: {
      return Object.assign({}, state, {
        organic: !state.organic
      })
    }
    case CHANGE_PENSIONER_RATE: {
      return Object.assign({}, state, {
        pensionerRate: !state.pensionerRate
      })
    }
    default:
      return state
  }
}

const initDateAddr = {
  bookingDate: null,
  bookingEnd: null,
  bookingAddr: ''
}

export function bookingDateAddr(state = initDateAddr, action) {
  if (action.type === SUBMIT_BOOKING) {
    return {
      bookingDate: action.bookingDate,
      bookingEnd: action.bookingEnd,
      bookingAddr: action.bookingAddr
    }
  }
  else {
    return state
  }
}

export function bookingStage(state = {stage: 0}, action) {
  if (action.type === CHANGE_BOOKING_STAGE) {
    return Object.assign({}, state, {
      stage: action.stage
    })
  }
  else {
    return state
  }
}

export function selectedArtist(state = {order: 0}, action) {
  if (action.type === SET_SELECTED_ARTIST) 
  return Object.assign({}, state, {
    order: action.order
  })
else
    return state
}

const initAvailArtists = {
  ids: [],
  recs: [],
  isLoading: false,
  hasErr: false
}
export function availArtists(state = initAvailArtists, action) {
  switch (action.type) {
    case GET_AVAIL_ARTISTS: {
      return Object.assign({}, state, {
        ids: [],
        recs: [],
        isLoading: true,
        hasErr: false
      })
    }
    case RECEIVE_AVAIL_ARTISTS: {
      let list = []
      let recs = action.payload
  
      for (let rec of recs) {
        list.push(rec.artist_id)
      }
  
      return Object.assign({}, state, {
        isLoading: false,
        hasErr: false,
        ids: list,
        recs: recs
      })
    }
    case ERROR_AVAIL_ARTISTS: {
      return Object.assign({}, state, {
        ids: [],
        recs: [],
        isLoading: false,
        hasErr: true
      })
    }
    default:
      return state
  }
}

export function itemQty(state = {}, action) {
  let qty = 0
  let id = action.itemId
  if (id in state) {
    qty = state[id]
  }

  switch (action.type) {
    case INC_ITEM_QTY: {
      qty += 1
      return Object.assign({}, state, {
        [id]: qty
      })
    }
    case DEC_ITEM_QTY: {
      if (qty > 0) {
        qty -= 1
      }

      if (qty > 0) {
        return Object.assign({}, state, {
          [id]: qty
        })
      } else {
        let temp = Object.assign({}, state)
        //remove the empty item
        delete temp[id]
        return Object.assign({}, temp)
      }
    }
    default:
      return state
  }
}

const initActivation = {
  servicesActive: true,
  artistsActive: true,
  clientsActive: false,
  bookingsActive: false,
  requestMethod: 'get',
  data: {},
  callMe: null
}

export function storeActivation(state = initActivation, action) {
  switch (action.type) {
    case ACTIVATE_CLIENTS: {
      return Object.assign({}, state, {
        clientsActive: action.val
      })
    }
    case ACTIVATE_BOOKINGS: {
      return Object.assign({}, state, {
        bookingsActive: action.val,
        requestMethod: 'get'
      })
    }
    case ADD_BOOKING: {
      return Object.assign({}, state, {
        bookingsActive: true,
        requestMethod: 'post',
        data: action.payload,
        callMe: action.callMe
      })
    }
    default:
      return state
  }
}
