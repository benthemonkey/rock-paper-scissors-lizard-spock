Template.matchList.helpers({
  matches: function () {
    let rounds = RPSLS.Collections.Rounds.find({}, { sort: { played: -1 } }).fetch()

    return _.unique(rounds, (round) => round.players[0])
  }
})

Template.matchList.onCreated(function () {
  this.subscribe('currentRounds')
})

Template.registerHelper('matchTitle', (players) => {
  if (typeof (players) !== 'undefined') {
    return players[0] + ' vs. ' + players[1]
  } else {
    return ''
  }
})
