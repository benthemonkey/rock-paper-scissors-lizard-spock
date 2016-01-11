import React from 'react'
import AuthErrors from '/imports/components/general/AuthErrors.jsx'
import FormInput from '/imports/components/general/FormInput.jsx'

const SignIn = React.createClass({
  getInitialState () {
    return {
      errors: {}
    }
  },
  onSubmit (event) {
    event.preventDefault()

    let username = event.target.username.value
    let password = event.target.password.value

    let errors = {}

    if (!username) {
      errors.username = 'Username required'
    }

    if (!password) {
      errors.password = 'Password required'
    }

    this.setState({
      errors: errors
    })

    if (!_.isEmpty(errors)) {
      return
    }

    Meteor.loginWithPassword(username, password, (err) => {
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
          <h1>Sign In</h1>

          <form onSubmit={this.onSubmit}>
            <AuthErrors errors={ this.state.errors } />
            <FormInput hasError={!!this.state.errors.username} name='Username' type='text' label='Username' />
            <FormInput hasError={!!this.state.errors.password} name='Password' type='password' label='Password' />

            <div className='row'>
              <div className='col-sm-6'>
                <input type='submit' className='btn btn-primary btn-block' />
              </div>
              <div className='col-sm-6'>
                <a href='/signup' className='btn btn-default btn-block'>Sign Up</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
})

export default SignIn
