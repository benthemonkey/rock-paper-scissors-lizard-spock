Template.landing.helpers({
  searching: () => Session.get('searching'),
  mostRecentMatch: () => Session.get('mostRecentMatchFromNow')
})

let searchTimeout
let directToMatchPage = (matchId) => {
  Meteor.clearTimeout(searchTimeout)
  Session.set('searching', false)
  FlowRouter.go('matchPage', { matchId })
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

    Meteor.call('startMatch', function (err, matchId) {
      if (err) {
        return
      }

      if (matchId) {
        directToMatchPage(matchId)
      } else {
        RPSLS.Collections.Matches.find().observe({
          added: function (match) {
            if (Session.get('searching') && match.players.indexOf(Meteor.user().username) !== -1) {
              directToMatchPage(match._id)
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
