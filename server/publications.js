Meteor.publish('currentMatches', function () {
  return RPSLS.Collections.Matches.find({ active: true })
})
