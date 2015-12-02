RPSLS.Collections.Rounds = new Mongo.Collection('rounds')

RPSLS.Constants.ValidMoves = ['rock', 'paper', 'scissors', 'spock', 'lizard']

/**
 * Determins the winner of a round of RPSLS
 * @param  {array}  players array of strings with the two player's ids
 * @param  {array}  moves   array of strings with each player's move (indexed identally to players)
 * @return {string}         outcome, a player id if there is a winner, otherwise "tie"
 */
RPSLS.determineWinner = function (players, moves) {
  let indices = moves.map(function (move) {
    return RPSLS.Constants.ValidMoves.indexOf(move)
  })
  let diff = indices[0] - indices[1]

  // flip the order so the diff is positive
  if (diff < 0) {
    diff = Math.abs(diff)
    indices = [indices[1], indices[0]]
    players = [players[1], players[0]]
  }

  switch (diff) {
    case 0:
      return 'tie'
    case 1:
      return players[0]
    case 2:
      return players[1]
    case 3:
      return players[0]
    case 4:
      return players[1]
  }
}

/**
 * Validates an object before being inserted into the Rounds collection
 * @param  {object}  round object to insert
 * @return {errors}        array of errors. empty if valid
 */
RPSLS.validateRound = function (round) {
  let errors = []

  // there are two moves
  if (round.moves.length !== 2) {
    errors.push('Wrong number of moves submitted.')
  }

  // both moves are valid
  round.moves.forEach(function (move) {
    if (RPSLS.Constants.ValidMoves.indexOf(move) === -1) {
      errors.push('"' + move + '" is not a valid move.')
    }
  })

  // there are two players
  if (round.players.length !== 2) {
    errors.push('Wrong number of players submitted.')
  }

  // valid winner
  if (round.players.indexOf(round.winner) === -1) {
    errors.push('Invalid winner.')
  }
}

Meteor.methods({
  insertRound: function (roundAttributes) {
    let errors

    check(roundAttributes, {
      matchId: String,
      players: [String],
      moves: Object,
      winner: String
    })

    errors = RPSLS.validateRound(roundAttributes)
    if (errors.length) {
      throw new Meteor.Error('invalid-round', errors.join(' '))
    }

    if (this.connection == null) {
      RPSLS.Collections.Rounds.insert(roundAttributes)
    } else {
      throw new Meteor.Error('server-only-method', 'This method can only be called from the server.')
    }
  }
})
