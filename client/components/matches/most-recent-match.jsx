RPSLS.Components.Matches.MostRecentMatch = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState () {
    return {
      mostRecentMatchFromNow: 'never'
    }
  },
  getMeteorData () {
    let subscription = Meteor.subscribe('mostRecentMatch', { onReady: () => Tracker.afterFlush(this.update) })

    return {
      isLoading: !subscription.ready(),
      mostRecentMatch: RPSLS.Queries.mostRecentMatch().fetch()[0]
    }
  },
  update () {
    if (this.data.mostRecentMatch) {
      this.setState({ mostRecentMatchFromNow: moment(this.data.mostRecentMatch.played).fromNow() })
    }
  },
  componentWillMount () {
    this.interval = Meteor.setInterval(this.update, 30000)
  },
  componentWillUnmount () {
    Meteor.clearInterval(this.interval)
  },
  render () {
    if (this.data.isLoading) {
      return <RPSLS.Components.Loading />
    } else {
      return <span className='label label-info'>Last match played: { this.state.mostRecentMatchFromNow }</span>
    }
  }
})
