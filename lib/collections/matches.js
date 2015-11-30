RPSLS.Collections.Matches = new Meteor.Collection('matches')

/**
 * Validates an object before being inserted into the Matches collection
 * @param  {object}  match object to insert
 * @return {errors}        array of errors. empty if valid
 */
RPSLS.validateMatch = function (match) {
  let errors = []

  // there are two players
  if (round.players.length !== 2) {
    errors.push('Wrong number of players submitted.')
  }
}

Meteor.methods({
  startMatch: function () {
    let userId = Meteor.userId()

    check(userId, String)

    Meteor.users.update({ _id: userId }, { profile: { searching: true, searchStarted: new Date() } })
  }
})
