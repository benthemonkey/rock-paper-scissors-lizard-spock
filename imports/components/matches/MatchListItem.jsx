import React from 'react'

const MatchListItem = React.createClass({
  propTypes: {
    match: React.PropTypes.object.isRequired
  },
  render () {
    return <li className='list-group-item'>{ this.props.match.players[0]} vs. { this.props.match.players[1]}</li>
  }
})

export default MatchListItem
