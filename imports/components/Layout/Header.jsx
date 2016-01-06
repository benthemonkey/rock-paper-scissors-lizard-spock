import React from 'react'

const Header = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    return {
      currentUser: Meteor.user()
    }
  },
  userNav () {
    if (this.data.currentUser) {
      return (
        <ul className='nav navbar-nav navbar-right'>
          <li className='navbar-text'>Hello, { this.data.currentUser.username }</li>
          <li><a href='#' onClick={ Meteor.logout } >Logout</a></li>
        </ul>
      )
    } else {
      return (
        <ul className='nav navbar-nav navbar-right'>
          <li><a href='/login'>Sign In</a></li>
          <li><a href='/join'>Join</a></li>
        </ul>
      )
    }
  },
  render () {
    return (
      <nav className='navbar navbar-default' role='navigation'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navigation'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className='navbar-brand' href='/'>
              <span className='hidden-xs'>Rock Paper Scissors Lizard Spock</span>
              <span className='visible-xs-block'>RPSLS</span>
            </a>
          </div>
          { this.userNav() }
        </div>
      </nav>
    )
  }
})

export default Header
