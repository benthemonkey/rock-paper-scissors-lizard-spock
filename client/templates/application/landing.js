Template.landing.helpers({
  searching: () => Session.get('searching'),
  mostRecentMatch: () => Session.get('mostRecentMatchFromNow')
})

let searchTimeout
let directToMatchPage = () => {
  Meteor.clearTimeout(searchTimeout)
  Session.set('searching', false)
  FlowRouter.go('matchPage')
}

Template.landing.events({
  'click #start': function () {
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
        directToMatchPage()
      }
    })
  }
})

Template.landing.onCreated(function () {
  this.subscribe('activeUsers')
  this.subscribe('mostRecentMatch')

  if (Meteor.user()) {
    this.subscribe('myRounds')
  }

  RPSLS.Collections.Rounds.find().observe({
    added: function (round) {
      if (round.players.indexOf(Meteor.user().username) !== -1) {
        directToMatchPage()
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
