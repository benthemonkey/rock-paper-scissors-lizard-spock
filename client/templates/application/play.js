Template.play.helpers({
  match: () => {
    let user = Meteor.user()

    if (user) {
      let rounds = RPSLS.Collections.Rounds.find({ players: user.username }, { sort: { played: -1 } }).fetch()

      return RPSLS.matchInfo(rounds)
    }
  }
})

Template.play.events({
  'click .btn': function (e) {
    Meteor.call('sendMove', $(e.currentTarget).data('move'))
  }
})

Template.play.onCreated(function () {
  let matchId = FlowRouter.getParam('matchId')

  this.subscribe('matchRounds', matchId, {
    onReady: () => {
      if (RPSLS.Collections.Rounds.find({ matchId: matchId }).count() === 0) {
        BlazeLayout.render('layout', { yield: 'notFound' })
      }
    }
  })
})
