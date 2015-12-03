/* globals Match */

RPSLS.Collections.Rounds = new Mongo.Collection('rounds')

RPSLS.Constants.ValidMoves = ['rock', 'paper', 'scissors', 'spock', 'lizard']

/**
 * Determins the winner of a round of RPSLS
 * @param  {object} moves   keys: player usernames, values: moves
 * @return {string}         outcome, a username if there is a winner, otherwise "tie"
 */
RPSLS.determineWinner = function (moves) {
  let players = Object.keys(moves)
  let indices = _.values(moves).map((move) => RPSLS.Constants.ValidMoves.indexOf(move))
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

Meteor.methods({
  sendMove: function (move) {
    let user = Meteor.user()

    if (!user) {
      return
    }

    let username = user.username
    let currentMatch = user.profile.currentMatch

    check(username, String)
    check(currentMatch, String)
    check(move, Match.Where((m) => RPSLS.Constants.ValidMoves.indexOf(move) !== -1))

    let match = RPSLS.Collections.Matches.findOne({ _id: currentMatch })
    let round = RPSLS.Collections.Rounds.findOne({ _id: match.currentRound })

    if (round.moves[username]) {
      throw new Meteor.Error('User already made a move this round')
    }

    round.moves[username] = move

    console.log(round.moves)
    if (_.some(round.moves, (move) => (!move))) {
      RPSLS.log('waiting for other players move')
      // waiting for other player's move
      RPSLS.Collections.Rounds.update(
        { _id: match.currentRound },
        { $set: { ['moves.' + username]: move } }
      )
    } else {
      RPSLS.log('round completed, move on')
      // round completed, move on
      RPSLS.Collections.Rounds.update(
        { _id: match.currentRound },
        {
          $set: {
            moves: round.moves,
            winner: RPSLS.determineWinner(round.moves)
          }
        }
      )

      let newRoundId = RPSLS.Collections.Rounds.insert({
        started: new Date().getTime(),
        matchId: currentMatch,
        players: round.players,
        moves: _.object(round.players, [false, false]),
        winner: ''
      })

      RPSLS.Collections.Matches.update(
        { _id: currentMatch },
        {
          $addToSet: { rounds: round._id },
          $set: { currentRound: newRoundId }
        }
      )
    }
  }
})
