// Fixture data
if (RPSLS.Collections.Matches.find().count() === 0) {
  let now = new Date().getTime()

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
        [bob]: 'rock',
        [alice]: 'paper',
        played: now - 80000
      },
      {
        [bob]: 'spock',
        [alice]: 'paper',
        played: now - 60000
      },
      {
        [bob]: 'scissors',
        [alice]: 'paper',
        played: now - 40000
      },
      {
        [bob]: 'lizard',
        [alice]: 'paper',
        played: now - 20000
      },
      {
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
        [bob]: 'rock',
        [alice]: 'paper',
        played: now - 80000
      },
      {
        [bob]: 'spock',
        [alice]: 'paper',
        played: now - 60000
      },
      {
        [bob]: 'scissors',
        [alice]: 'paper',
        played: now - 40000
      },
      {
        [bob]: 'lizard',
        [alice]: 'paper',
        played: now - 20000
      },
      {
        [bob]: 'rock',
        [alice]: 'scissors',
        played: now
      }
    ],
    winner: bob
  })
}
