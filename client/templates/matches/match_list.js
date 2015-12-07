Template.matchList.helpers({
  matches: function () {
    let rounds = RPSLS.Collections.Rounds.find({}, { sort: { played: -1 } }).fetch()

    return _.unique(rounds, (round) => round.players[0])
  }
})

Template.matchList.onCreated(function () {
  this.subscribe('currentRounds')
})
