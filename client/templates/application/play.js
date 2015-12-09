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
  let user = Meteor.user()

  if (user) {
    this.subscribe('myRounds', user.username, {
      onReady: () => {
        if (RPSLS.Collections.Rounds.find({ players: user.username }).count() === 0) {
          FlowRouter.go('landing')
        }
      }
    })

    Meteor.users.find({ _id: user._id }).observeChanges({
      changed: function (id, fields) {
        if (_.has(fields, 'profile.redirect') && fields.profile.redirect) {
          FlowRouter.go(fields.profile.redirect.name, fields.profile.redirect.data)
          Meteor.call('clearRedirect')
        }
      }
    })
  }
})
