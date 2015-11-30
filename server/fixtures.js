// Fixture data
if (RPSLS.Collections.Matches.find().count() === 0) {
  let now = new Date()

  // create two users
  let alice = 'Alice'
  let bob = 'Bob'
  Meteor.users.insert({
    username: alice
  })
  Meteor.users.insert({
    username: bob
  })

  let match1Id = RPSLS.Collections.Matches.insert({
    players: [alice, bob],
    played: now,
    active: true,
    winner: bob
  })

  let match2Id = RPSLS.Collections.Matches.insert({
    players: [alice, bob],
    played: now,
    active: true,
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: ['rock', 'paper'],
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: ['spock', 'paper'],
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: ['scissors', 'paper'],
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: ['lizard', 'paper'],
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: ['lizard', 'spock'],
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: ['rock', 'paper'],
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: ['spock', 'paper'],
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: ['scissors', 'paper'],
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: ['lizard', 'paper'],
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: ['lizard', 'spock'],
    winner: bob
  })
}
