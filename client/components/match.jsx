RPSLS.Components.Match = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    let matchId = FlowRouter.getParam('matchId')
    let subscription = Meteor.subscribe('match', matchId, {
      onReady () {
        if (!RPSLS.Collections.Matches.findOne({ _id: matchId })) {
          FlowRouter.go('notFound')
        }
      }
    })

    return {
      isLoading: !subscription.ready(),
      match: RPSLS.Collections.Matches.findOne({ _id: matchId })
    }
  },
  render () {
    if (this.data.isLoading) {
      return <RPSLS.Components.Loading size='4' />
    } else {
      return <RPSLS.Components.Matches.Summary rounds={ this.data.match.rounds } />
    }
  }
})
