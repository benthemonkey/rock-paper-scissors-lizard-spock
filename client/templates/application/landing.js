Template.landing.helpers({
  onlineCount: function () {
    return Meteor.users.find({ 'status.online': true }).count()
  }
})

Template.landing.events({
  'click #start': function () {
    let btn = $(this)

    btn.button('loading')
    Session.set('searching', true)

    let matchTimeout = Meteor.setTimeout(function () {
      btn.button('reset')
    }, 30000)

    Meteor.call('startMatch', function (err, res) {
      if (err) {
        return
      }

      if (res) {
        FlowRouter.go('matchPage', { matchId: res })
        Meteor.clearTimeout(matchTimeout)
      } else {
        RPSLS.Collections.Matches.find().observe({
          added: function (match) {
            if (Session.get('searching') && match.players.indexOf(Meteor.user().username) !== -1) {
              FlowRouter.go('matchPage', { matchId: match._id })
            }
          }
        })
      }
    })
  }
})

Template.landing.onCreated(function () {
  this.subscribe('userStatus')
})
