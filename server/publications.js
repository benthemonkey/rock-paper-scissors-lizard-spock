Meteor.publish('currentMatches', function () {
  return RPSLS.Collections.Matches.find({ active: true })
})

Meteor.publish('mostRecentMatch', function () {
  return RPSLS.Collections.Matches.find({ '$query': {}, '$orderby': { started: -1 } }, { limit: 1 })
})

Meteor.publish('match', function (matchId) {
  return RPSLS.Collections.Matches.find({ _id: matchId })
})

Meteor.publish('matchRounds', function (matchId) {
  return RPSLS.Collections.Rounds.find({ matchId: matchId })
})

Meteor.publish('activeUsers', function () {
  Counts.publish(
    this,
    'activeUsers',
    Meteor.users.find({ 'status.idle': false, 'status.online': true }, { fields: { _id: true } })
  )
})
