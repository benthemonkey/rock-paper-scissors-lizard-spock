/* globals Match */

Meteor.methods({
  findMatch: function () {
    let userId = Meteor.userId()
    let username = Meteor.user().username
    let now = new Date().getTime()

    check(userId, String)
    check(username, String)

    RPSLS.log(RPSLS.Queue)

    // strip old queue entries
    RPSLS.Queue = _.filter(RPSLS.Queue, (entry) => (entry.expires >= now))

    // already in queue
    if (_.find(RPSLS.Queue, { username: username })) {
      return false
    }

    if (RPSLS.Queue.length > 0) {
      let opponent = RPSLS.Queue.shift()

      RPSLS.Collections.Rounds.insert({
        played: now + 15 * 60 * 1000,
        players: [username, opponent.username],
        [username]: false,
        [opponent.username]: false
      })

      RPSLS.log('match made')

      return true
    } else {
      RPSLS.log('added to queue')
      RPSLS.Queue.push({
        expires: now + 30 * 1000,
        username: username,
        userId: userId
      })

      return false
    }
  },
  sendMove: function (move) {
    let user = Meteor.user()

    if (!user) {
      RPSLS.log('!user')
      return false
    }

    let username = user.username

    check(username, String)
    check(move, Match.Where((m) => RPSLS.Constants.ValidMoves.indexOf(move) !== -1))

    let rounds = RPSLS.Collections.Rounds.find({ players: username }, { sort: { played: -1 } }).fetch()

    if (!rounds.length) {
      RPSLS.log('no rounds found')
      return
    }

    let matchInfo = RPSLS.matchInfo(rounds)

    if (_.isNull(matchInfo.currentRound)) {
      throw new Meteor.Error('No round in progress')
    }

    if (matchInfo.currentRound[username]) {
      throw new Meteor.Error('User already made a move this round')
    }

    matchInfo.currentRound[username] = move

    RPSLS.Collections.Rounds.update(
      { _id: matchInfo.currentRound._id },
      { $set: { [username]: move } }
    )

    if (!RPSLS.isRoundComplete(matchInfo.currentRound)) {
      RPSLS.log('waiting for other players move')
      // waiting for other player's move
      return
    }

    RPSLS.log('round completed, move on')
    // recalculate with the new move
    matchInfo = RPSLS.matchInfo(rounds)

    if (matchInfo.winner) {
      RPSLS.Collections.Matches.insert({
        winner: matchInfo.winner,
        players: matchInfo.players,
        rounds: rounds,
        played: new Date().getTime()
      })

      RPSLS.Collections.Rounds.remove({ players: username })
      return
    }

    // round completed, move on
    RPSLS.Collections.Rounds.insert(
      {
        played: new Date().getTime() + 18 * 60 * 1000,
        players: matchInfo.players,
        [matchInfo.players[0]]: false,
        [matchInfo.players[1]]: false
      }
    )
  }
})
