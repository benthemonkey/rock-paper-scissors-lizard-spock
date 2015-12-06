/* globals Match */

RPSLS.Collections.Rounds = new Mongo.Collection('rounds')

RPSLS.Constants.ValidMoves = ['rock', 'paper', 'scissors', 'spock', 'lizard']
RPSLS.Constants.Verbs = {
  'rock': {
    'lizard': 'crushes',
    'scissors': 'crushes'
  },
  'paper': {
    'rock': 'covers',
    'spock': 'disproves'
  },
  'scissors': {
    'paper': 'cuts',
    'lizard': 'decapitates'
  },
  'spock': {
    'scissors': 'smashes',
    'rock': 'vaporizes'
  },
  'lizard': {
    'spock': 'poisons',
    'paper': 'eats'
  }
}

// useless on client, stores the match queue on server
RPSLS.Queue = []

/**
 * Wether both players have made a move
 * @param  {object} round
 * @return {bool}
 */
RPSLS.isRoundComplete = (round) => _.every(_.values(round))

/**
 * Determins the winner of a round of RPSLS
 * @param  {object} round           instance of the Rounds collection
 * @return {object} out     contains either (isTie, tieMove) or (winPlayer, winMove, losePlayer, lostMove, description)
 *                          where description is the verb that details how the the winning move destroys the losing move
 */
RPSLS.roundResult = function (round) {
  let players = round.players
  let indices = players.map((player) => RPSLS.Constants.ValidMoves.indexOf(round[player]))
  let diff = indices[0] - indices[1]

  // flip the order so the diff is positive
  if (diff < 0) {
    diff = Math.abs(diff)
    indices = [indices[1], indices[0]]
    players = [players[1], players[0]]
  }

  // shorthand
  let p0Move = round[players[0]]
  let p1Move = round[players[1]]

  switch (diff) {
    case 0:
      return {
        isTie: true,
        tieMove: p0Move
      }
    case 1:
    case 3:
      return {
        winPlayer: players[0],
        winMove: p0Move,
        losePlayer: players[1],
        loseMove: p1Move,
        description: RPSLS.Constants.Verbs[p0Move][p1Move]
      }
    case 2:
    case 4:
      return {
        winPlayer: players[1],
        winMove: p1Move,
        losePlayer: players[0],
        loseMove: p0Move,
        description: RPSLS.Constants.Verbs[p1Move][p0Move]
      }
  }
}

/**
 * Nicely formats information about a RPSLS match
 * @param  {array}  rounds           Rounds of a match, in chronological order
 * @return {object} out              Information about the match
 *         {object} out.currentRound Current round
 *         {array}  out.results      Description of all finished rounds in the match
 *         {object} out.score        keys: usernames, values: user's score
 *         {string} out.winner       winner of the match, if it exists
 */
RPSLS.matchInfo = function (rounds) {
  let completedRounds = rounds
  let currentRound = null

  if (!rounds.length) {
    return {}
  }

  let players = rounds[0].players

  if (!RPSLS.isRoundComplete(rounds[0])) {
    currentRound = _.first(rounds)
    completedRounds = _.rest(rounds)
  }

  let results = completedRounds.map((round) => _.extend(round, RPSLS.roundResult(round)))
  let score = _.reduce(
    results,
    (accumulator, value) => {
      if (!value.isTie) {
        accumulator[value.winPlayer]++
      }

      return accumulator
    },
    _.zipObject(players, [0, 0])
  )
  let winner = _.findKey(score, (s) => (s >= 3)) || ''

  RPSLS.log(score)

  return {currentRound, players, results, score, winner}
}

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

    RPSLS.log(rounds)

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

// if (Meteor.isServer) {
//   // If something goes wrong, automatically mark matches as inactive after 5 minutes
//   Meteor.setInterval(function () {
//     RPSLS.Collections.Rounds.remove({
//       played: { $lt: new Date().getTime() - 5 * 60 * 1000 }
//     })
//   }, 30 * 1000)
// }
