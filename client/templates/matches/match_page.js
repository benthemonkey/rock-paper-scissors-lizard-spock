Template.matchPage.helpers({
  match: () => {
    let match = RPSLS.Collections.Matches.findOne({ _id: FlowRouter.getParam('matchId') })

    if (match) {
      return _.extend(match, RPSLS.matchInfo(match.rounds))
    }
  }
})

Template.matchPage.onCreated(function () {
  let matchId = FlowRouter.getParam('matchId')

  this.subscribe('match', matchId)
})
