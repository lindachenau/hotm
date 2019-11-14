import {
  CHANGE_ORGANIC,
  CHANGE_PENSIONER_RATE,
  CHANGE_BOOKING_STAGE,
  GET_AVAIL_ARTISTS,
  SET_SELECTED_ARTIST,
  INC_ITEM_QTY,
  DEC_ITEM_QTY,
  SUBMIT_BOOKING,
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
  bookingAddr: ''
}

export function bookingDateAddr(state = initDateAddr, action) {
  if (action.type === SUBMIT_BOOKING) {
    return {
      bookingDate: action.bookingDate,
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

export function availArtists(state = {}, action) {
  if (action.type === GET_AVAIL_ARTISTS) {
    //temporary testing code before API is ready
    let noArtists = Math.ceil(Math.random() * 5)
    let list = []

    for (let i = 0; i < noArtists; i++) {
      let id = Math.floor(Math.random() * 50)
      if (!list.includes(id))
      list.push(id)
    }
    return {ids: list}
  } else {
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
      if (qty > 0)
        qty -= 1
      return Object.assign({}, state, {
      [id]: qty
      })
    }
    default:
      return state
  }
}
