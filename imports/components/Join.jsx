import React from 'react'
import { Accounts } from 'accounts-base'
import AuthErrors from '/app/imports/components/general/AuthErrors.jsx'
import FormInput from '/app/imports/components/general/FormInput.jsx'

const Join = React.createClass({
  getInitialState () {
    return {
      errors: {}
    }
  },
  onSubmit (event) {
    event.preventDefault()

    let username = event.target.username.value
    let password = event.target.password.value
    let password2 = event.target.password2.value

    let errors = {}

    if (!username) {
      errors.username = 'Username required'
    }

    if (!password) {
      errors.password = 'Password required'
    }

    if (!password2 || password !== password2) {
      errors.password2 = 'Passwords don\'t match'
    }

    this.setState({
      errors: errors
    })

    if (!_.isEmpty(errors)) {
      return
    }

    Accounts.createUser({ username, password }, (err) => {
      if (err) {
        this.setState({
          errors: {'none': err.reason}
        })

        return
      } else {
        FlowRouter.go('index')
      }
    })
  },
  render () {
    return (
      <div className='row'>
        <div className='col-sm-6 col-sm-offset-3'>
          <h1>Join</h1>

          <form onSubmit={this.onSubmit}>
            <AuthErrors errors={ this.state.errors } />
            <FormInput hasError={!!this.state.errors.username} name='Username' type='text' label='Username' />
            <FormInput hasError={!!this.state.errors.password} name='Password' type='password' label='Password' />
            <FormInput hasError={!!this.state.errors.password2} name='Password2' type='password' label='Password (again)' />
            <input type='submit' className='btn btn-default'/>
          </form>
        </div>
      </div>
    )
  }
})

export default Join
