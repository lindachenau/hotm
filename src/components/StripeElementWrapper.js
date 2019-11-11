// A Wrapper for the <FormControl>, <InputLabel>, <Error> and the Stripe <*Element>.
// Similar to Material UI's <TextField>. Handles focused, empty and error state
// to correctly show the floating label and error messages etc.

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Errors from './Errors'

export default class extends PureComponent {
  static displayName = 'StripeElementWrapper'

  static propTypes = {
    component: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  }

  state = {
    focused: false,
    error: false,
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleChange = changeObj => {
    this.setState({
      error: changeObj.error
    })
  }
  
  render() {
    const { component, label } = this.props
    const { focused, error } = this.state

    return (
      <div>
        <FormControl fullWidth margin="normal">
          <InputLabel
            focused={focused}
            shrink
            error={!!error}>
            {label}
          </InputLabel>
          <Input
            fullWidth
            inputComponent={component}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={evt => this.handleChange(evt)}
            inputProps={{ component }}
            style={{fontSize: '1rem'}}
          />
        </FormControl>
        {error && <Errors>{error.message}</Errors>}
      </div>
    )
  }
}
