Template.landing.helpers({
  searching: function () {
    return Session.get('searching')
  },
  mostRecentMatch: function () {
    return Session.get('mostRecentMatchFromNow')
  }
})

Template.landing.events({
  'click #start': function () {
    // already searching
    if (Session.get('searching')) {
      return
    }

    Session.set('searching', true)

    let matchTimeout = Meteor.setTimeout(function () {
      Session.set('searching', false)
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
  this.subscribe('activeUsers')
  this.subscribe('mostRecentMatch')

  Meteor.setInterval(function () {
    let mostRecent = RPSLS.Collections.Matches.findOne()

    if (mostRecent) {
      Session.set('mostRecentMatchFromNow', moment(mostRecent.started).fromNow())
    }
  }, 1000)
})
