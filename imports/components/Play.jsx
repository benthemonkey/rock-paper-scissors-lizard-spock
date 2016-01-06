import React from 'react'
import Loading from '/app/imports/components/general/Loading.jsx'
import MatchSummary from '/app/imports/components/matches/MatchSummary.jsx'

import { matchRounds } from '/app/lib/queries'

const Play = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    let matchId = FlowRouter.getParam('matchId')
    let subscription = Meteor.subscribe('matchRounds', matchId, {
      onReady () {
        if (matchRounds(matchId).count() === 0) {
          FlowRouter.go('notFound')
        }
      }
    })

    return {
      isLoading: !subscription.ready(),
      rounds: matchRounds(matchId).fetch()
    }
  },
  sendMove (event) {
    Meteor.call('sendMove', event.currentTarget.getAttribute('data-move'))
  },
  render () {
    if (this.data.isLoading || this.data.rounds.length === 0) {
      return <Loading size='4' />
    } else {
      return (
        <div>
          <h1 className='text-center'>{ this.data.rounds[0].players[0] } vs. { this.data.rounds[0].players[1] }</h1>
          <div className='row'>
            <div className='col-md-6 text-center m-b-md'>
              <h3>Pick a move:</h3>
              <div className='btn btn-primary' onClick={ this.sendMove } data-move='rock'>
                <i className='fa fa-hand-rock-o'></i><br />
                Rock
              </div>
              <div className='btn btn-primary' onClick={ this.sendMove } data-move='paper'>
                <i className='fa fa-hand-paper-o'></i><br />
                Paper
              </div>
              <div className='btn btn-primary' onClick={ this.sendMove } data-move='scissors'>
                <i className='fa fa-hand-scissors-o'></i><br />
                Scissors
              </div>
              <div className='btn btn-primary' onClick={ this.sendMove } data-move='lizard'>
                <i className='fa fa-hand-lizard-o'></i><br />
                Lizard
              </div>
              <div className='btn btn-primary' onClick={ this.sendMove } data-move='spock'>
                <i className='fa fa-hand-spock-o'></i><br />
                Spock
              </div>
            </div>
            <div className='col-md-6'>
              <MatchSummary rounds={ this.data.rounds } />
            </div>
          </div>
        </div>
      )
    }
  }
})

export default Play
