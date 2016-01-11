import React from 'react'
import MatchRoundResult from '/app/imports/components/matches/MatchRoundResult.jsx'
import { matchInfo } from '/app/lib/helpers'

const MatchSummary = React.createClass({
  propTypes: {
    rounds: React.PropTypes.array
  },
  displayWinner (winner) {
    if (winner) {
      return <h1 className='text-center'>Winner: { winner }</h1>
    }
  },
  resultsList (players, results) {
    if (results.length > 0) {
      return (
        <ul className='list-group'>
          {
            results.map((result, i) => <MatchRoundResult key={ i } players={ players } result={ result } />)
          }
        </ul>
      )
    } else {
      return <ul className='list-group'><li className='list-group-item'>None</li></ul>
    }
  },
  render () {
    let info = matchInfo(this.props.rounds)

    return (
      <div>
        { this.displayWinner(info.winner) }
        <div className='panel panel-default m-b-md'>
          <div className='panel-heading'>
            <h4 className='panel-title text-center'>Score (first to 3)</h4>
          </div>
          <div className='panel-body text-center'>
            <div className='row'>
              <div className='col-xs-6'>
                <h4>{ info.players[0] }:</h4>
                <h4>{ info.score[info.players[0]] }</h4>
              </div>
              <div className='col-xs-6'>
                <h4>{ info.players[1] }:</h4>
                <h4>{ info.score[info.players[1]] }</h4>
              </div>
            </div>
          </div>
          { this.resultsList(info.players, info.results) }
        </div>
      </div>
    )
  }
})

export default MatchSummary
