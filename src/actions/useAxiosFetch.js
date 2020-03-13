import { useState, useEffect, useReducer } from "react"
import axios from "axios"

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, hasErrored: false }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        hasErrored: false,
        errorMessage: "",
        data: action.payload
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        hasErrored: true,
        errorMessage: "Data Retrieve Failure"
      }
    default:
      throw new Error()
  }
}

const useAxiosFetch = (initialUrl, initialData, trigger) => {
  const [url] = useState(initialUrl)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    hasErrored: false,
    errorMessage: "",
    data: initialData
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })
 
      try {
        const config = {
          method: 'get',
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          },
          url: url
        }
        
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
    
    fetchData()

    return () => {
      didCancel = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return { ...state }
}

export default useAxiosFetch
