import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import './App.css'
import Routes from './config/RootContainer'
import store from './config/Store'
import BookingsStoreProvider from './config/BookingsStoreProviderContainer'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FD8795',
      contrastText: "#fff"
    },
    secondary: {
      main: '#124762',
      contrastText: "#fff"
    },
    text: {
      primary: '#124762'
    }
  },
  // typography: {
  //   // Use the system font instead of the default Roboto font.
  //   fontFamily: [
  //     '"Lato"',
  //     'sans-serif'
  //   ].join(',')
  // }
})


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BookingsStoreProvider>
            <Routes theme={theme}/>
          </BookingsStoreProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App
