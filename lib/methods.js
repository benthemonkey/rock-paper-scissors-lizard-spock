/* globals Match, Random */
import _ from 'lodash'
import Matches from '/lib/collections/matches'
import Rounds from '/lib/collections/rounds'
import helpers from '/lib/helpers'

let queue = []

/**
 * Updates players user.profile.redirect to point to a different page
 * @param  {array}  players    array of strings of the player's usernames
 * @param  {object} page
 *                  page.name  route name of the page
 *                  page.data  any additional information to pass to FlowRouter
 */
const redirectPlayers = function (players, page) {
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

const clearRedirect = function () {
  Meteor.users.update(Meteor.userId(), { $set: { 'profile.redirect': false } })
}

const playAgainstComputer = function () {
  let username = Meteor.user().username
  let now = new Date().getTime()
  let matchId = Random.id()

  check(username, String)

  Rounds.insert({
    matchId: matchId,
    played: now + 15 * 60 * 1000,
    players: [username, 'bot'],
    moves: {
      [username]: false,
      bot: Random.choice(helpers.validMoves)
    }
  })

  redirectPlayers([username], { name: 'play', data: { matchId: matchId } })
}

const findMatch = function () {
  let username = Meteor.user().username
  let now = new Date().getTime()

  check(username, String)

  helpers.log(queue)

  // strip old queue entries
  queue = _.filter(queue, (entry) => (entry.expires >= now))

  // already in queue
  if (_.find(queue, { username: username })) {
    return false
  }

  if (queue.length > 0) {
    let opponent = queue.shift()
    let matchId = Random.id()

    Rounds.insert({
      matchId: matchId,
      played: now + 15 * 60 * 1000,
      players: [username, opponent.username],
      moves: {
        [username]: false,
        [opponent.username]: false
      }
    })

    helpers.log('match made')

    redirectPlayers([username, opponent.username], { name: 'play', data: { matchId: matchId } })

    return true
  } else {
    helpers.log('added to queue')
    queue.push({
      expires: now + 30 * 1000,
      username: username
    })

    return false
  }
}

/**
 * Sends a RPSLS move from the currently logged-in user
 * @param  {string} move     one of the 5 valid moves
 * @return {string}          status. one of ['error', 'waiting', 'roundFinished', 'matchFinished']
 */
const sendMove = function (move) {
  let user = Meteor.user()

  if (!user) {
    throw new Meteor.Error('Requires logged-in user')
  }

  let username = user.username

  check(username, String)
  check(move, Match.Where((m) => helpers.validMoves.indexOf(move) !== -1))

  let rounds = Rounds.find({ players: username }, { sort: { played: -1 } }).fetch()

  if (!rounds.length) {
    helpers.log('no rounds found')
    return 'error'
  }

  let matchInfo = helpers.matchInfo(rounds)

  if (_.isNull(matchInfo.currentRound)) {
    throw new Meteor.Error('No round in progress')
  }

  if (matchInfo.currentRound[username]) {
    throw new Meteor.Error('User already made a move this round')
  }

  matchInfo.currentRound.moves[username] = move

  Rounds.update(
    { _id: matchInfo.currentRound._id },
    { $set: { ['moves.' + username]: move } }
  )

  if (!helpers.isRoundComplete(matchInfo.currentRound)) {
    helpers.log('waiting for other players move')
    // waiting for other player's move
    return 'waiting'
  }

  helpers.log('round completed, move on')
  // recalculate with the new move
  matchInfo = helpers.matchInfo(rounds)

  if (matchInfo.winner) {
    let matchId = rounds[0].matchId

    Matches.insert({
      _id: matchId,
      winner: matchInfo.winner,
      players: matchInfo.players,
      rounds: rounds,
      played: new Date().getTime()
    })

    Rounds.remove({ matchId: matchId })

    redirectPlayers(matchInfo.players, { name: 'matchPage', data: { matchId: matchId } })

    return 'matchFinished'
  }

  // round completed, move on
  Rounds.insert(
    {
      matchId: rounds[0].matchId,
      played: new Date().getTime() + 18 * 60 * 1000,
      players: matchInfo.players,
      moves: {
        [matchInfo.players[0]]: false,
        [matchInfo.players[1]]: (matchInfo.players[1] === 'bot' ? Random.choice(helpers.validMoves) : false)
      }
    }
  )

  return 'roundFinished'
}

Meteor.methods({
  clearRedirect,
  playAgainstComputer,
  findMatch,
  sendMove
})
