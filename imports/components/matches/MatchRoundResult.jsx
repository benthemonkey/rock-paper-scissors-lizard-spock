import React from 'react'

const MatchRoundResult = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired,
    result: React.PropTypes.object.isRequired
  },
  playerColor (player) {
    return this.props.players.indexOf(player) ? 'text-info' : 'text-success'
  },
  render () {
    let result = this.props.result

    if (result.isTie) {
      return <li className='list-group-item'>Tie ({ result.tieMove })</li>
    } else {
      return (
        <li className='list-group-item'>
          <span className={ this.playerColor(result.winPlayer) }>
            { result.winPlayer }
          </span>'s&nbsp;
          { result.winMove }&nbsp;
          { result.description }&nbsp;
          <span className={ this.playerColor(result.losePlayer) }>
            { result.losePlayer }
          </span>'s&nbsp;
          { result.loseMove }
        </li>
      )
    }
  }
})

export default MatchRoundResult
