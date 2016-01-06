import _ from 'lodash'

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
RPSLS.isRoundComplete = (round) => _.every(_.values(round.moves))

/**
 * Determins the winner of a round of RPSLS
 * @param  {object} round  instance of the Rounds collection
 * @return {object}        contains either (isTie, tieMove) or (winPlayer, winMove, losePlayer, lostMove, description)
 *                           where description is the verb that details how the the winning move destroys the losing move
 */
RPSLS.roundResult = function (round) {
  let players = round.players
  let indices = players.map((player) => RPSLS.Constants.ValidMoves.indexOf(round.moves[player]))
  let diff = indices[0] - indices[1]

  // flip the order so the diff is positive
  if (diff < 0) {
    diff = Math.abs(diff)
    indices = [indices[1], indices[0]]
    players = [players[1], players[0]]
  }

  // shorthand
  let p0Move = round.moves[players[0]]
  let p1Move = round.moves[players[1]]

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
 *         {array}  out.players      Players in the match
 *         {array}  out.results      Description of all finished rounds in the match
 *         {object} out.score        keys: usernames, values: user's score
 *         {string} out.winner       winner of the match, if it exists
 */
RPSLS.matchInfo = function (rounds) {
  let currentRound = null
  let completedRounds = rounds

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

  return {currentRound, players, results, score, winner}
}

/**
 * Updates players user.profile.redirect to point to a different page
 * @param  {array}  players    array of strings of the player's usernames
 * @param  {object} page
 *                  page.name  route name of the page
 *                  page.data  any additional information to pass to FlowRouter
 */
RPSLS.redirectPlayers = function (players, page) {
  if (Meteor.isServer) {
    let ids = _.pluck(Meteor.users.find({ username: { $in: players } }).fetch(), '_id')

    _.each(ids, function (id) {
      Meteor.users.update(
        id,
        { $set: { 'profile.redirect': page } }
      )
    })
  }
}

// if (Meteor.isServer) {
//   // If something goes wrong, automatically mark matches as inactive after 5 minutes
//   Meteor.setInterval(function () {
//     RPSLS.Collections.Rounds.remove({
//       played: { $lt: new Date().getTime() - 5 * 60 * 1000 }
//     })
//   }, 30 * 1000)
// }
