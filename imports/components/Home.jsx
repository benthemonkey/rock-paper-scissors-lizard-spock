import React from 'react'
import _ from 'lodash'
import StartButtons from '/imports/components/Home/StartButtons.jsx'
import ActiveUserCount from '/imports/components/Home/ActiveUserCount.jsx'
import MostRecentMatch from '/imports/components/matches/MostRecentMatch.jsx'
import MatchList from '/imports/components/matches/MatchList.jsx'

import { currentRounds } from '/lib/queries'

const Home = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    Meteor.subscribe('currentRounds')

    return {
      loggedIn: Boolean(Meteor.user()),
      matches: _.unique(currentRounds().fetch(), 'matchId')
    }
  },
  render () {
    return (
    <div>
        <div className='jumbotron'>
          <div className='row text-center'>
            <div className='col-xs-4 col-sm-2 col-sm-offset-1'>
              <h1><i className='fa fa-hand-rock-o'></i></h1>
              <h4>Rock</h4>
            </div>
            <div className='col-xs-4 col-sm-2'>
              <h1><i className='fa fa-hand-paper-o'></i></h1>
              <h4>Paper</h4>
            </div>
            <div className='col-xs-4 col-sm-2'>
              <h1><i className='fa fa-hand-scissors-o'></i></h1>
              <h4>Scissors</h4>
            </div>
            <div className='col-xs-4 col-xs-offset-2 col-sm-2 col-sm-offset-0'>
              <h1><i className='fa fa-hand-lizard-o'></i></h1>
              <h4>Lizard</h4>
            </div>
            <div className='col-xs-4 col-sm-2'>
              <h1><i className='fa fa-hand-spock-o'></i></h1>
              <h4>Spock</h4>
            </div>
          </div>
          <StartButtons loggedIn={ this.data.loggedIn } />
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h4 className='panel-title text-center'>Matches in Progress</h4>
              </div>
              <MatchList matches={ this.data.matches } />
            </div>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h4 className='panel-title text-center'>Upcoming Features</h4>
              </div>
              <div className='list-group'>
                <div className='list-group-item'>Ability to spectate matches</div>
                <div className='list-group-item'>Enforce time limit on moves, otherwise forfeit the match</div>
                <div className='list-group-item'>Profile pages with user stats</div>
                <div className='list-group-item'>Leaderboard</div>
              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <h3 className='text-center'>
              <ActiveUserCount />
            </h3>
            <h3 className='text-center'>
              <MostRecentMatch />
            </h3>
          </div>
        </div>
      </div>
    )
  }
})

export default Home
