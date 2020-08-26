import { useEffect } from 'react'

const CLIENT_ID = process.env.REACT_APP_GC_CLIENT_ID
const API_KEY = process.env.REACT_APP_GC_API_KEY     
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly"

const CalendarLoader = ({ setIsSignIn }) => {
  useEffect(() => {
    const handleClientLoad = () => {
      const script = document.createElement("script")
      script.src = "https://apis.google.com/js/api.js"
      document.body.appendChild(script)
      script.onload = () => {
        window['gapi'].load('client:auth2', initClient);
      }
    }  
 
    const updateSigninStatus = (isSignedIn) => {
      setIsSignIn(isSignedIn)
    }

    const initClient = () => {
      window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: SCOPES        
      })
      .then(() => {
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        // Handle the initial sign-in state.
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      })
      .catch((e) => {
        console.log(e)
      })
  }

  handleClientLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default CalendarLoader