Template.matchPage.helpers({
  match: () => RPSLS.Collections.Matches.findOne({ _id: FlowRouter.getParam('matchId') })
})

Template.matchPage.events({
  'click .btn': function (e) {
    Meteor.call('sendMove', $(e.currentTarget).data('move'))
  }
})

Template.matchPage.onCreated(function () {
  let matchId = FlowRouter.getParam('matchId')

  this.subscribe('match', matchId)
  this.subscribe('matchRounds', matchId)
})
