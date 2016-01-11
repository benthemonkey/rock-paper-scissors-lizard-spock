import { currentRounds, mostRecentMatch, match, matchRounds, activeUsers } from '/lib/queries'

global._ = require('lodash')

Meteor.publish('currentRounds', () => currentRounds())
Meteor.publish('mostRecentMatch', () => mostRecentMatch())
Meteor.publish('match', (matchId) => {
  check(matchId, String)
  return match(matchId)
})
Meteor.publish('matchRounds', (matchId) => {
  check(matchId, String)
  return matchRounds(matchId)
})
Meteor.publish('activeUsers', function () { Counts.publish(this, 'activeUsers', activeUsers()) })
