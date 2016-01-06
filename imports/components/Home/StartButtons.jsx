import React from 'react'

const StartButtons = React.createClass({
  propTypes: {
    loggedIn: React.PropTypes.bool.isRequired
  },
  getInitialState () {
    return {
      searching: false
    }
  },
  findMatch () {
    if (this.state.searching) {
      return
    }

    this.setState({ searching: true })
    Meteor.setTimeout(() => this.setState({ searching: false }), 30000)
    Meteor.call('findMatch')
  },
  playAgainstComputer () {
    Meteor.call('playAgainstComputer')
  },
  render () {
    if (this.props.loggedIn) {
      return (
        <div className='row'>
          <div className='col-sm-6'>
            <div onClick={ this.findMatch } className='btn btn-lg btn-primary btn-block'>
              { this.state.searching ? 'Trying to join a game (30 secs)...' : 'Play against another Player' }
            </div>
          </div>
          <div className='col-sm-6'>
            <div onClick={ this.playAgainstComputer } className='btn btn-lg btn-info btn-block'>Play against a Computer</div>
          </div>
        </div>
      )
    } else {
      return <h2 className='text-center'>Sign in / Join to get started</h2>
    }
  }
})

export default StartButtons
