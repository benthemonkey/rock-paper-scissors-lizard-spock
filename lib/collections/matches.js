RPSLS.Collections.Matches = new Meteor.Collection('matches')

// useless on client, stores the match queue on server
RPSLS.queue = []

Meteor.methods({
  startMatch: function () {
    let username = Meteor.user().username

    check(username, String)

    // already in queue
    if (RPSLS.queue.indexOf(username) !== -1) {
      return false
    }

    if (RPSLS.queue.length > 0) {
      let opponent = RPSLS.queue.shift()

      let newMatchId = RPSLS.Collections.Matches.insert({
        players: [username, opponent],
        played: new Date(),
        winner: '',
        active: true
      })

      return newMatchId
    } else {
      RPSLS.queue.push(username)

      return false
    }
  }
})
