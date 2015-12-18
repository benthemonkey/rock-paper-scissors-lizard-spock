Meteor.publish('currentRounds', function () {
  return RPSLS.Collections.Rounds.find({})
})

Meteor.publish('mostRecentMatch', function () {
  return RPSLS.Collections.Matches.find({}, { sort: { played: -1 }, limit: 1 })
})

Meteor.publish('match', function (matchId) {
  check(matchId, String)

  return RPSLS.Collections.Matches.find({ _id: matchId })
})

Meteor.publish('matchRounds', function (matchId) {
  check(matchId, String)

  return RPSLS.Collections.Rounds.find({ matchId: matchId }, { sort: { played: -1 } })
})

Meteor.publish('activeUsers', function () {
  Counts.publish(
    this,
    'activeUsers',
    Meteor.users.find({ 'status.idle': false, 'status.online': true }, { fields: { _id: true } })
  )
})
