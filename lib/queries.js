RPSLS.Queries.currentRounds = () => {
  return RPSLS.Collections.Rounds.find(
    {},
    {
      sort: { played: -1 },
      fields: { played: true, players: true, matchId: true }
    }
  )
}

RPSLS.Queries.mostRecentMatch = () => {
  return RPSLS.Collections.Matches.find(
    {},
    {
      sort: { played: -1 },
      limit: 1,
      fields: { played: true }
    }
  )
}

RPSLS.Queries.match = (matchId) => {
  return RPSLS.Collections.Matches.find({ _id: matchId })
}

RPSLS.Queries.matchRounds = (matchId) => {
  return RPSLS.Collections.Rounds.find({ matchId: matchId }, { sort: { played: -1 } })
}

RPSLS.Queries.activeUsers = () => {
  return Meteor.users.find(
    {
      'status.idle': false,
      'status.online': true
    },
    {
      fields: { _id: true }
    }
  )
}
