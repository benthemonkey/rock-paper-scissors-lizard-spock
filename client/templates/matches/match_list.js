Template.matchList.helpers({
  matches: function () {
    return RPSLS.Collections.Matches.find({ active: true }, { sort: { played: -1 } })
  }
})

Template.matchList.onCreated(function () {
  this.subscribe('currentMatches')
})

Template.registerHelper('matchTitle', (players) => {
  if (typeof (players) !== 'undefined') {
    return players[0] + ' vs. ' + players[1]
  } else {
    return ''
  }
})
