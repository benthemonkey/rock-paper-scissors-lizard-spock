Template.landing.helpers({
  searching: () => Session.get('searching'),
  mostRecentMatch: () => Session.get('mostRecentMatchFromNow')
})

let searchTimeout
let directToPlayPage = () => {
  Meteor.clearTimeout(searchTimeout)
  Session.set('searching', false)
  FlowRouter.go('play')
}

Template.landing.events({
  'click #findMatch': function () {
    // already searching
    if (Session.get('searching')) {
      return
    }

    Session.set('searching', true)

    searchTimeout = Meteor.setTimeout(function () {
      Session.set('searching', false)
    }, 30000)

    Meteor.call('findMatch', function (err, found) {
      if (err) {
        return
      }

      if (found) {
        directToPlayPage()
      }
    })
  },
  'click #playAgainstComputer': function () {
    Meteor.call('playAgainstComputer', function (err) {
      if (!err) {
        directToPlayPage()
      }
    })
  }
})

Template.landing.onCreated(function () {
  this.subscribe('activeUsers')
  this.subscribe('mostRecentMatch')
  this.subscribe('rounds')

  RPSLS.Collections.Rounds.find().observe({
    added: function (round) {
      if (Meteor.user() && round.players.indexOf(Meteor.user().username) !== -1) {
        directToPlayPage()
      }
    }
  })

  Meteor.setInterval(function () {
    let mostRecent = RPSLS.Collections.Matches.findOne()

    if (mostRecent) {
      Session.set('mostRecentMatchFromNow', moment(mostRecent.played).fromNow())
    }
  }, 1000)
})
