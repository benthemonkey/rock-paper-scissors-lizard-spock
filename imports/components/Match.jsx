import React from 'react'
import Loading from '/imports/components/general/Loading.jsx'
import MatchSummary from '/imports/components/matches/MatchSummary.jsx'

import { match } from '/lib/queries'

const Match = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    let matchId = FlowRouter.getParam('matchId')
    let subscription = Meteor.subscribe('match', matchId, {
      onReady () {
        if (!match(matchId).fetch()) {
          FlowRouter.go('notFound')
        }
      }
    })

    return {
      isLoading: !subscription.ready(),
      match: match(matchId).fetch()[0]
    }
  },
  render () {
    if (this.data.isLoading) {
      return <Loading size='4' />
    } else {
      return <MatchSummary rounds={ this.data.match.rounds } />
    }
  }
})

export default Match
