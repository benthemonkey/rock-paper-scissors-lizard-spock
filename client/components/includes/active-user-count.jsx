RPSLS.Components.ActiveUserCount = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    let subscription = Meteor.subscribe('activeUsers')

    return {
      isLoading: !subscription.ready(),
      activeUsers: Counts.get('activeUsers')
    }
  },
  render () {
    if (this.data.isLoading) {
      return <RPSLS.Components.Loading />
    } else {
      return <span className='label label-info'>Players Online: { this.data.activeUsers }</span>
    }
  }
})
