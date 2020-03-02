import { useEffect, useReducer } from "react"
import axios from "axios"
import { bookings_url, contact_phone } from '../config/dataLinks'

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key].toString()]: item,
    };
  }, initialValue)
}

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isUpdating: false,
        hasErrored: false,
        errorMessage: ""
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        // data: Object.assign({}, state.data, convertArrayToObject(action.payload, 'booking_id'))
        // Reload all bookings based on the new filter so the new booking list reflects the search results 
        data: Object.assign({}, convertArrayToObject(action.payload, 'booking_id'))
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        hasErrored: true,
        errorMessage: "Data Retrieve Failure"
      }
    case "UPDATE_INIT":
      return {
        ...state,
        isLoading: false,
        isUpdating: true,
        hasErrored: false,
        errorMessage: ""
      }
    case "POST_SUCCESS":
      return {
        ...state,
        isUpdating: false,
        data: Object.assign({}, state.data, convertArrayToObject([action.payload], 'booking_id'))
      }
    case "PUT_SUCCESS":
      return {
        ...state,
        isUpdating: false,
        data: Object.assign({}, state.data, convertArrayToObject([action.payload], 'booking_id'))
      }
    case "DELETE_SUCCESS":
      return {
        ...state,
        isUpdating: false
      }
    case "UPDATE_FAILURE":
      return {
        ...state,
        isUpdating: false,
        hasErrored: true,
        errorMessage: action.errorMessage
      }
    case "CHARGE_START":
      return {
        ...state,
        bookingInProgress: true
      }
    case "CHARGE_END":
        return {
          ...state,
          bookingInProgress: false
        }
  
    default:
      throw new Error()
  }
}

const useAxiosCRUD = (url, initialData, method, data, callMe, bookingTrigger) => {

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isUpdating: false,
    hasErrored: false,
    errorMessage: "",
    data: initialData,
    bookingInProgress: false
  })

  useEffect(() => {
    let didCancel = false

    const requestData = async () => {
      dispatch({ type: "FETCH_INIT" })

      /*
       * Do not cache booking query response because booking update only changes
       * individual booking which will have different url from the query url. If the
       * queried url is cached followed by a booking update, retrieval from the same
       * query will have stale info from cache.
       */
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        },
        url: url
      }

      try {
        let result = await axios(config)
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data })
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" })
        }
      }
    }

    const createData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})

      const config = {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        url: bookings_url,
        data: data
      }

      dispatch({ type: "CHARGE_START" })
      try {
        const result = await axios(config)
        const error = result.data.error
        if (!didCancel) {
          if (error) {
            alert(`${error} Your card is NOT charged. Please call ${contact_phone} to resolve this issue.`)
            dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
          }
          else {
            const bookingId = result.data.booking_id
            const payload = {...data, booking_id: bookingId}
            dispatch({ type: "POST_SUCCESS", payload: payload })
            //Now charge
            await callMe(bookingId)
          }
        }
      } catch (err) {
        if (!didCancel) {
          alert(`${err} Your card is NOT charged. Please call ${contact_phone} to resolve this issue.`)
          dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
        }
      }
      dispatch({ type: "CHARGE_END" })
    }

    const updateData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})

      const config = {
        method: 'put',
        headers: {"Content-Type": "application/json"},
        url: bookings_url,
        data: data
      }

      dispatch({ type: "CHARGE_START" })
      try {
        const result = await axios(config)
        const error = result.data.error
        if (!didCancel) {
          if (error) {
            alert(`${error} Your card is NOT charged. Please call ${contact_phone} to resolve this issue.`)
            dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
          }
          else {
            /*
             * Balance payment success. Change paid_checkout_total to total_amount locally. Server performs this step. Because 
             * we don't read back the updated booking record from the server, we simply modify paid_checkout_total locally.
             */ 
            if (data.payment_amount > 0)
              data.paid_checkout_total = data.payment_amount
            dispatch({ type: "PUT_SUCCESS", payload: data })
            await callMe()
          }
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
        }
      }
      dispatch({ type: "CHARGE_END" })
    }

    const deleteData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})

      const config = {
        method: 'delete',
        headers: {"Content-Type": "application/json"},
        url: bookings_url,
        data: data
      }

      try {
        const result = await axios(config)
        const error = result.data.error
        if (!didCancel) {
          /*
          * No need to do anything if no error as data hasn't been written into local Booking Store yet.
          */ 
          if (error) {
            alert(`${error} Your card is NOT charged. Please call ${contact_phone} to resolve this issue.`)
            dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
          } else {
            dispatch({ type: "DELETE_SUCCESS" })
          }
        }
      } catch (err) {
        if (!didCancel) {
          alert(`${err} Your card is NOT charged. Please call ${contact_phone} to resolve this issue.`)
          dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
        }
      }
    }

    if (!state.isLoading && !state.isUpdating) {
      switch (method) {
        case 'get': {
          requestData()
          break
        }
        case 'post': {
          createData(data)
          break
        }
        case 'put': {
          updateData(data)
          break
        }
        case 'delete': {
          deleteData(data)
          break
        }
        default:
          throw new Error()
      }
    }

    return () => {
      didCancel = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [bookingTrigger])

  return { ...state }
}

export default useAxiosCRUD
