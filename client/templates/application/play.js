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

let debounceRedirect = _.debounce(function (matchId) {
  FlowRouter.go('matchPage', { matchId })
}, 500)

Template.play.onCreated(function () {
  if (Meteor.user()) {
    this.subscribe('myRounds', Meteor.user().username, {
      onReady: () => {
        if (RPSLS.Collections.Rounds.find().count() === 0) {
          FlowRouter.go('landing')
        }

        RPSLS.Collections.Rounds.find({ players: Meteor.user().username }).observe({
          removed: (round) => {
            // match ended. redirect to play page
            console.log(round)
            debounceRedirect(round.matchId)
          }
        })
      }
    })
  }
})
