Template.matchPage.helpers({
  getPlayer: function (index) {
    return _.isArray(this.players) ? this.players[index] : ''
  },
  getScore: function (index) {
    return _.isArray(this.players) ? this.score[this.players[index]] : ''
  },
  match: () => RPSLS.matchInfo(RPSLS.Collections.Rounds.find({}, { sort: { played: -1 } }).fetch())
})

Template.matchPage.events({
  'click .btn': function (e) {
    Meteor.call('sendMove', $(e.currentTarget).data('move'))
  }
})

Template.matchPage.onCreated(function () {
  if (Meteor.user()) {
    this.subscribe('myRounds', Meteor.user().username, {
      onReady: () => {
        if (RPSLS.Collections.Rounds.find().count() === 0) {
          FlowRouter.go('landing')
        }
      }
    })
  }
})
