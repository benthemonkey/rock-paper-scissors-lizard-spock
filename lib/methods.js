/* globals Match, Random */
import _ from 'lodash'

Meteor.methods({
  clearRedirect: () => Meteor.users.update(Meteor.userId(), { $set: { 'profile.redirect': false } }),
  playAgainstComputer: function () {
    let username = Meteor.user().username
    let now = new Date().getTime()
    let matchId = Random.id()

    check(username, String)

    RPSLS.Collections.Rounds.insert({
      matchId: matchId,
      played: now + 15 * 60 * 1000,
      players: [username, 'bot'],
      moves: {
        [username]: false,
        bot: Random.choice(RPSLS.Constants.ValidMoves)
      }
    })

    RPSLS.redirectPlayers([username], { name: 'play', data: { matchId: matchId } })
  },
  findMatch: function () {
    let username = Meteor.user().username
    let now = new Date().getTime()

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
      let matchId = Random.id()

      RPSLS.Collections.Rounds.insert({
        matchId: matchId,
        played: now + 15 * 60 * 1000,
        players: [username, opponent.username],
        moves: {
          [username]: false,
          [opponent.username]: false
        }
      })

      RPSLS.log('match made')

      RPSLS.redirectPlayers([username, opponent.username], { name: 'play', data: { matchId: matchId } })

      return true
    } else {
      RPSLS.log('added to queue')
      RPSLS.Queue.push({
        expires: now + 30 * 1000,
        username: username
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

    matchInfo.currentRound.moves[username] = move

    RPSLS.Collections.Rounds.update(
      { _id: matchInfo.currentRound._id },
      { $set: { ['moves.' + username]: move } }
    )

    if (!RPSLS.isRoundComplete(matchInfo.currentRound)) {
      RPSLS.log('waiting for other players move')
      // waiting for other player's move
      return 'waiting'
    }

    RPSLS.log('round completed, move on')
    // recalculate with the new move
    matchInfo = RPSLS.matchInfo(rounds)

    if (matchInfo.winner) {
      let matchId = rounds[0].matchId

      RPSLS.Collections.Matches.insert({
        _id: matchId,
        winner: matchInfo.winner,
        players: matchInfo.players,
        rounds: rounds,
        played: new Date().getTime()
      })

      RPSLS.Collections.Rounds.remove({ matchId: matchId })

      RPSLS.redirectPlayers(matchInfo.players, { name: 'matchPage', data: { matchId: matchId } })

      return 'matchFinished'
    }

    // round completed, move on
    RPSLS.Collections.Rounds.insert(
      {
        matchId: rounds[0].matchId,
        played: new Date().getTime() + 18 * 60 * 1000,
        players: matchInfo.players,
        moves: {
          [matchInfo.players[0]]: false,
          [matchInfo.players[1]]: (matchInfo.players[1] === 'bot' ? Random.choice(RPSLS.Constants.ValidMoves) : false)
        }
      }
    )

    return 'roundFinished'
  }
})
