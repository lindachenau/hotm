export const CHANGE_ORGANIC = 'CHANGE_ORGANIC'
export const CHANGE_PENSIONER_RATE = 'CHANGE_PENSIONER_RATE'
export const SUBMIT_BOOKING = 'SUBMIT_BOOKING'
export const CHANGE_BOOKING_STAGE = 'CHANGE_BOOKING_STAGE'
export const GET_AVAIL_ARTISTS = 'GET_AVAIL_ARTISTS'
export const SET_SELECTED_ARTIST = 'SET_SELECTED_ARTIST'
export const INC_ITEM_QTY = 'INC_ITEM_QTY'
export const DEC_ITEM_QTY = 'DEC_ITEM_QTY'

export const toggleOrganic = () => ({
  type: CHANGE_ORGANIC
})

export const togglePensionerRate = () => ({
  type: CHANGE_PENSIONER_RATE
})

export const submitBooking = (date, addr) => ({
  type: SUBMIT_BOOKING,
  bookingDate: date,
  bookingAddr: addr
})

export const changeBookingStage = stage => ({
  type: CHANGE_BOOKING_STAGE,
  stage
})

export const changeSelectedArtist = order => ({
  type: SET_SELECTED_ARTIST,
  order
})

export const getAvailArtist = (bookingItems, bookingDate, bookingAddr) => ({
  type: GET_AVAIL_ARTISTS,
  bookingItems,
  bookingDate,
  bookingAddr
})

export const incItemQty = id => ({
  type: INC_ITEM_QTY,
  itemId: id
})

export const decItemQty = id => ({
  type: DEC_ITEM_QTY,
  itemId: id
})
