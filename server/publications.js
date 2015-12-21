Meteor.publish('currentRounds', () => RPSLS.Queries.currentRounds())
Meteor.publish('mostRecentMatch', () => RPSLS.Queries.mostRecentMatch())
Meteor.publish('match', (matchId) => {
  check(matchId, String)
  return RPSLS.Queries.match(matchId)
})
Meteor.publish('matchRounds', (matchId) => {
  check(matchId, String)
  return RPSLS.Queries.matchRounds(matchId)
})
Meteor.publish('activeUsers', function () { Counts.publish(this, 'activeUsers', RPSLS.Queries.activeUsers()) })
