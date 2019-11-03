import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles'
import './App.css';
import Routes from './config/routes'
import { indigo } from '@material-ui/core/colors'

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
      <div>
        <ThemeProvider theme={theme}>
          <Routes theme={theme}/>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
