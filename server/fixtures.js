// Fixture data
if (RPSLS.Collections.Matches.find().count() === 0) {
  let now = new Date().getTime()

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
    started: now,
    active: false,
    winner: bob
  })

  let match2Id = RPSLS.Collections.Matches.insert({
    players: [alice, bob],
    started: now,
    active: false,
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: {
      [bob]: 'rock',
      [alice]: 'paper'
    },
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: {
      [bob]: 'spock',
      [alice]: 'paper'
    },
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: {
      [bob]: 'scissors',
      [alice]: 'paper'
    },
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: {
      [bob]: 'lizard',
      [alice]: 'paper'
    },
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match1Id,
    players: [bob, alice],
    moves: {
      [bob]: 'lizard',
      [alice]: 'spock'
    },
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: {
      [bob]: 'rock',
      [alice]: 'paper'
    },
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: {
      [bob]: 'spock',
      [alice]: 'paper'
    },
    winner: alice
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: {
      [bob]: 'scissors',
      [alice]: 'paper'
    },
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: {
      [bob]: 'lizard',
      [alice]: 'paper'
    },
    winner: bob
  })

  RPSLS.Collections.Rounds.insert({
    matchId: match2Id,
    players: [bob, alice],
    moves: {
      [bob]: 'lizard',
      [alice]: 'spock'
    },
    winner: bob
  })
}
