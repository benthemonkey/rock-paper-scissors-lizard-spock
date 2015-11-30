Meteor.publish('currentMatches', function () {
  return RPSLS.Collections.Matches.find({ active: true })
})

Meteor.publish('match', function (matchId) {
  return RPSLS.Collections.Matches.find({ _id: matchId })
})

Meteor.publish('matchRounds', function (matchId) {
  return RPSLS.Collections.Rounds.find({ matchId: matchId })
})

Meteor.publish('userStatus', function () {
  return Meteor.users.find({ 'status.online': true }, { fields: { _id: true } })
})
