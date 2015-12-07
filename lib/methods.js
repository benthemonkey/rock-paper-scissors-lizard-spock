/* globals Match */

Meteor.methods({
  playAgainstComputer: function () {
    let username = Meteor.user().username
    let now = new Date().getTime()

    check(username, String)

    RPSLS.Collections.Rounds.insert({
      matchId: Random.id(),
      played: now + 15 * 60 * 1000,
      players: [username, 'bot'],
      [username]: false,
      bot: false
    })
  },
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
        matchId: Random.id(),
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
  /**
   * Sends a RPSLS move from the currently logged-in user
   * @param  {string} move     one of the 5 valid moves
   * @return {string}          status. one of ['error', 'waiting', 'roundFinished', 'matchFinished']
   */
  sendMove: function (move) {
    let user = Meteor.user()

    if (!user) {
      throw new Meteor.Error('Requires logged-in user')
    }

    let username = user.username

    check(username, String)
    check(move, Match.Where((m) => RPSLS.Constants.ValidMoves.indexOf(move) !== -1))

    let rounds = RPSLS.Collections.Rounds.find({ players: username }, { sort: { played: -1 } }).fetch()

    if (!rounds.length) {
      RPSLS.log('no rounds found')
      return 'error'
    }

    let matchInfo = RPSLS.matchInfo(rounds)

    if (_.isNull(matchInfo.currentRound)) {
      throw new Meteor.Error('No round in progress')
    }

    if (matchInfo.currentRound[username]) {
      throw new Meteor.Error('User already made a move this round')
    }

    matchInfo.currentRound[username] = move

    if (!_.contains(matchInfo.currentRound.players, 'bot')) {
      // Not playing against bot
      RPSLS.Collections.Rounds.update(
        { _id: matchInfo.currentRound._id },
        { $set: { [username]: move } }
      )
    } else {
      // If playing against bot, pick random move for bot
      let botMove = Random.choice(RPSLS.Constants.ValidMoves)

      matchInfo.currentRound.bot = botMove
      RPSLS.Collections.Rounds.update(
        { _id: matchInfo.currentRound._id },
        { $set: { [username]: move, bot: botMove } }
      )
    }

    if (!RPSLS.isRoundComplete(matchInfo.currentRound)) {
      RPSLS.log('waiting for other players move')
      // waiting for other player's move
      return 'waiting'
    }

    RPSLS.log('round completed, move on')
    // recalculate with the new move
    matchInfo = RPSLS.matchInfo(rounds)

    if (matchInfo.winner) {
      RPSLS.Collections.Matches.insert({
        _id: rounds[0].matchId,
        winner: matchInfo.winner,
        players: matchInfo.players,
        rounds: rounds,
        played: new Date().getTime()
      })

      RPSLS.Collections.Rounds.remove({ players: username })

      return 'matchFinished'
    }

    // round completed, move on
    RPSLS.Collections.Rounds.insert(
      {
        matchId: rounds[0].matchId,
        played: new Date().getTime() + 18 * 60 * 1000,
        players: matchInfo.players,
        [matchInfo.players[0]]: false,
        [matchInfo.players[1]]: false
      }
    )

    return 'roundFinished'
  }
})
