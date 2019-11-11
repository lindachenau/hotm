import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import './App.css';
import Routes from './config/RootContainer'
import store from './config/Store'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#f18383'
    },
    secondary: {
      // main: '#e8e5e5'
      main: '#000'
    }
  },
  // typography: {
  //   // Use the system font instead of the default Roboto font.
  //   fontFamily: [
  //     '"Lato"',
  //     'sans-serif'
  //   ].join(',')
  // }
});


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Routes theme={theme}/>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;
