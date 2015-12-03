/* globals Random */

RPSLS.Collections.Matches = new Meteor.Collection('matches')

// useless on client, stores the match queue on server
RPSLS.Queue = []

Meteor.users.allow({
  update: (userId, user, fieldNames) => (userId === user._id && _.isEqual(fieldNames, ['profile']))
})

Meteor.methods({
  startMatch: function () {
    let userId = Meteor.userId()
    let username = Meteor.user().username
    let now = new Date().getTime()

    check(userId, String)
    check(username, String)

    // strip old queue entries
    RPSLS.Queue = _.filter(RPSLS.Queue, (entry) => (entry.expires >= now))

    // already in queue
    if (_.find(RPSLS.Queue, (x) => (x.username === username))) {
      return false
    }

    if (RPSLS.Queue.length > 0) {
      let opponent = RPSLS.Queue.shift()

      let newRoundId = Random.id()

      let newMatchId = RPSLS.Collections.Matches.insert({
        started: now,
        players: [username, opponent.username],
        currentRound: newRoundId,
        rounds: [],
        winner: '',
        active: true
      })

      RPSLS.Collections.Rounds.insert({
        _id: newRoundId,
        matchId: newMatchId,
        started: now,
        players: [username, opponent.username],
        moves: {
          [username]: false,
          [opponent.username]: false
        },
        winner: ''
      })

      Meteor.users.update(
        { _id: userId },
        { $set: { 'profile.currentMatch': newMatchId } }
      )

      if (Meteor.isServer) {
        Meteor.users.update(
          { _id: opponent.userId },
          { $set: { 'profile.currentMatch': newMatchId } }
        )
      }

      return newMatchId
    } else {
      RPSLS.Queue.push({
        expires: now + 30 * 1000,
        username: username,
        userId: userId
      })

      return false
    }
  }
})

if (Meteor.isServer) {
  // If something goes wrong, automatically mark matches as inactive after 5 minutes
  Meteor.setInterval(function () {
    RPSLS.Collections.Matches.remove({
      active: true,
      started: { $lt: new Date().getTime() - 5 * 60 * 1000 },
      winner: ''
    })
  }, 30 * 1000)
}
