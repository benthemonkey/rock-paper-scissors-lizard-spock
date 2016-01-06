const currentRounds = () => {
  return RPSLS.Collections.Rounds.find(
    {},
    {
      sort: { played: -1 },
      fields: { played: true, players: true, matchId: true }
    }
  )
}

const mostRecentMatch = () => {
  return RPSLS.Collections.Matches.find(
    {},
    {
      sort: { played: -1 },
      limit: 1,
      fields: { played: true }
    }
  )
}

const match = (matchId) => {
  return RPSLS.Collections.Matches.find({ _id: matchId })
}

const matchRounds = (matchId) => {
  return RPSLS.Collections.Rounds.find({ matchId: matchId }, { sort: { played: -1 } })
}

const activeUsers = () => {
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

export { currentRounds, mostRecentMatch, match, matchRounds, activeUsers }
