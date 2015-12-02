RPSLS.Collections.Matches = new Meteor.Collection('matches')

// useless on client, stores the match queue on server
RPSLS.Queue = []

Meteor.methods({
  startMatch: function () {
    let username = Meteor.user().username
    let now = new Date().getTime()

    check(username, String)

    // strip old queue entries
    RPSLS.Queue = _.filter(RPSLS.Queue, (entry) => (entry.expires >= now))

    // already in queue
    if (_.find(RPSLS.Queue, (x) => (x.username === username))) {
      return false
    }

    if (RPSLS.Queue.length > 0) {
      let opponent = RPSLS.Queue.shift()

      let newMatchId = RPSLS.Collections.Matches.insert({
        players: [username, opponent.username],
        started: now,
        winner: '',
        active: true
      })

      return newMatchId
    } else {
      RPSLS.Queue.push({
        expires: now + 30 * 1000,
        username: username
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
