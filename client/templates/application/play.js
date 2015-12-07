Template.play.helpers({
  match: () => RPSLS.matchInfo(RPSLS.Collections.Rounds.find({}, { sort: { played: -1 } }).fetch())
})

Template.play.events({
  'click .btn': function (e) {
    Meteor.call('sendMove', $(e.currentTarget).data('move'))
  }
})

Template.play.onCreated(function () {
  if (Meteor.user()) {
    this.subscribe('myRounds', Meteor.user().username, {
      onReady: () => {
        if (RPSLS.Collections.Rounds.find().count() === 0) {
          FlowRouter.go('landing')
        }
      }
    })
  }

  RPSLS.Collections.Rounds.find().observe({
    removed: (round) => {
      // match ended. redirect to play page
      FlowRouter.go('matchPage', { matchId: round.matchId })
    }
  })
})
