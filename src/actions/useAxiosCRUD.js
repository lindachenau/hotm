import { useEffect, useReducer } from "react"
import axios from "axios"
import { bookings_url } from '../config/dataLinks'

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
        hasErrored: false
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: "",
        // data: Object.assign({}, state.data, convertArrayToObject(action.payload, 'booking_id'))
        // Reload all bookings based on the new filter so the new booking list reflects the search results 
        data: Object.assign({}, convertArrayToObject(action.payload, 'booking_id'))
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: true,
        errorMessage: "Data Retrieve Failure"
      }
    case "UPDATE_INIT":
      return {
        ...state,
        isLoading: false,
        isUpdating: true,
        hasErrored: false
      }
    case "POST_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: "",
        data: Object.assign({}, state.data, convertArrayToObject([action.payload], 'booking_id'))
      }
    case "PUT_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: "",
        data: Object.assign({}, state.data, convertArrayToObject([action.payload], 'booking_id'))
      }
    case "DELETE_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: ""
      }
    case "UPDATE_FAILURE":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: true,
        errorMessage: action.errorMessage
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
    data: initialData
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      try {
        let result = await axios.get(url)
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

      try {
        const result = await axios(config)
        const error = result.data.error
        if (!didCancel) {
          if (error) {
            alert(`${error} Please call to resolve this issue.`)
            dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
          }
          else {
            const bookingId = result.data.booking_id
            const payload = {...data, booking_id: bookingId}
            dispatch({ type: "POST_SUCCESS", payload: payload })
            callMe()
          }
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
        }
      }
    }

    const updateData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})

      const config = {
        method: 'put',
        headers: {"Content-Type": "application/json"},
        url: bookings_url,
        data: data
      }

      try {
        const result = await axios(config)
        const error = result.data.error
        if (!didCancel) {
          if (error) {
            alert(`${error} Please call to resolve this issue.`)
            dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
          }
          else {
            const bookingId = result.data.booking_id
            /*
             * Balance payment success. Change paid_checkout_total to total_amount locally. Server performs this step. Because 
             * we don't read back the updated booking record from the server, we simply modify paid_checkout_total locally.
             */ 
            if (data.payment_amount > 0)
              data.paid_checkout_total = data.payment_amount
            dispatch({ type: "PUT_SUCCESS", payload: data })
            callMe()
          }
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
        }
      }
    }

    if (!state.isLoading && !state.isUpdating) {
      switch (method) {
        case 'get': {
          fetchData()
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
        default:
          throw new Error()
      }
    }

    return () => {
      didCancel = true
    }
  }, [bookingTrigger])

  return { ...state }
}

export default useAxiosCRUD
