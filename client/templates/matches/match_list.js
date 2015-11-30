Template.matchList.helpers({
  matches: function () {
    return RPSLS.Collections.Matches.find({ active: true }, { sort: { played: -1 } })
  }
})

Template.matchList.onCreated(function () {
  this.subscribe('currentMatches')
})
