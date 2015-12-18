Template.landing.helpers({
  searching: () => Session.get('searching'),
  mostRecentMatch: () => Session.get('mostRecentMatchFromNow')
})

let searchTimeout

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

    Meteor.call('findMatch')
  },
  'click #playAgainstComputer': function () {
    Meteor.call('playAgainstComputer')
  }
})

Template.landing.onDestroyed(function () {
  Meteor.clearTimeout(searchTimeout)
  Session.set('searching', false)
})

Template.landing.onCreated(function () {
  this.subscribe('activeUsers')
  this.subscribe('mostRecentMatch')
  this.subscribe('rounds')

  Meteor.setInterval(function () {
    let mostRecent = RPSLS.Collections.Matches.findOne()

    if (mostRecent) {
      Session.set('mostRecentMatchFromNow', moment(mostRecent.played).fromNow())
    }
  }, 1000)
})
