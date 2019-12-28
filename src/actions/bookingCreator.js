export const CHANGE_ORGANIC = 'CHANGE_ORGANIC'
export const CHANGE_PENSIONER_RATE = 'CHANGE_PENSIONER_RATE'
export const SUBMIT_BOOKING = 'SUBMIT_BOOKING'
export const CHANGE_BOOKING_STAGE = 'CHANGE_BOOKING_STAGE'
export const SET_SELECTED_ARTIST = 'SET_SELECTED_ARTIST'
export const INC_ITEM_QTY = 'INC_ITEM_QTY'
export const DEC_ITEM_QTY = 'DEC_ITEM_QTY'
export const GET_AVAIL_ARTISTS = 'GET_AVAIL_ARTISTS'
export const RECEIVE_AVAIL_ARTISTS = 'RECEIVE_AVAIL_ARTISTS'
export const ERROR_AVAIL_ARTISTS = 'ERROR_AVAIL_ARTISTS'
export const RESET_BOOKING = 'RESET_BOOKING'
export const MAKE_BOOKING = 'MAKE_BOOKING'
export const ACTIVATE_BOOKINGS = 'ACTIVATE_BOOKINGS'
export const ADD_BOOKING = 'ADD_BOOKING'
export const SAVE_BOOKING = 'SAVE_BOOKING'
export const ASSIGN_ARTISTS = 'ASSIGN_ARTISTS'
export const LOAD_BOOKING = 'LOAD_BOOKING'

export const toggleOrganic = () => ({
  type: CHANGE_ORGANIC
})

export const togglePensionerRate = () => ({
  type: CHANGE_PENSIONER_RATE
})

export const submitBooking = (date, bookingEnd, addr) => ({
  type: SUBMIT_BOOKING,
  bookingDate: date,
  bookingEnd: bookingEnd,
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

export function getAvailArtist(url) {
  return function(dispatch) {
    
    dispatch({
      type: GET_AVAIL_ARTISTS
    })

    return fetch(url)
    .then(
      response => response.json(),
      error => {
        console.log("Artists fetching error")
        dispatch({
          type: ERROR_AVAIL_ARTISTS
        })
      }
    )
    .then(data => {
      dispatch({
        type: RECEIVE_AVAIL_ARTISTS,
        payload: data
      })
    })
  }
}

export const incItemQty = id => ({
  type: INC_ITEM_QTY,
  itemId: id
})

export const decItemQty = id => ({
  type: DEC_ITEM_QTY,
  itemId: id
})

export const resetBooking = () => ({
  type: RESET_BOOKING,
})

export const setActivateBookings = val => ({
  type : ACTIVATE_BOOKINGS,
  val
})

export const addBooking = (bookingInfo, callMe) => ({
  type: ADD_BOOKING,
  payload: bookingInfo,
  callMe
})

export const saveBooking = (bookingData) => ({
  type: SAVE_BOOKING,
  payload: bookingData,
})

export const assignArtists = (artistIds) => ({
  type: ASSIGN_ARTISTS,
  artistIds
})

export const loadBooking = (booking) => ({
  type: LOAD_BOOKING,
  booking
})