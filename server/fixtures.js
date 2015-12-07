// Fixture data
if (RPSLS.Collections.Matches.find().count() === 0) {
  let now = new Date().getTime()

  // Bot for playing against a computer
  Meteor.users.insert({ username: 'bot' })

  // we can't allow users named 'players' or 'played'
  Meteor.users.insert({ username: 'players' })
  Meteor.users.insert({ username: 'played' })

  // create two users
  let alice = 'Alice'
  let bob = 'Bob'
  Meteor.users.insert({
    username: alice
  })
  Meteor.users.insert({
    username: bob
  })

  RPSLS.Collections.Matches.insert({
    players: [alice, bob],
    played: now,
    rounds: [
      {
        players: [alice, bob],
        [bob]: 'rock',
        [alice]: 'paper',
        played: now - 80000
      },
      {
        players: [alice, bob],
        [bob]: 'spock',
        [alice]: 'paper',
        played: now - 60000
      },
      {
        players: [alice, bob],
        [bob]: 'scissors',
        [alice]: 'paper',
        played: now - 40000
      },
      {
        players: [alice, bob],
        [bob]: 'lizard',
        [alice]: 'paper',
        played: now - 20000
      },
      {
        players: [alice, bob],
        [bob]: 'rock',
        [alice]: 'scissors',
        played: now
      }
    ],
    winner: bob
  })

  RPSLS.Collections.Matches.insert({
    players: [alice, bob],
    played: now,
    rounds: [
      {
        players: [alice, bob],
        [bob]: 'rock',
        [alice]: 'paper',
        played: now - 80000
      },
      {
        players: [alice, bob],
        [bob]: 'spock',
        [alice]: 'paper',
        played: now - 60000
      },
      {
        players: [alice, bob],
        [bob]: 'scissors',
        [alice]: 'paper',
        played: now - 40000
      },
      {
        players: [alice, bob],
        [bob]: 'lizard',
        [alice]: 'paper',
        played: now - 20000
      },
      {
        players: [alice, bob],
        [bob]: 'rock',
        [alice]: 'scissors',
        played: now
      }
    ],
    winner: bob
  })
}
