import React from 'react'
import Loading from '/imports/components/general/Loading.jsx'

const ActiveUserCount = React.createClass({
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
      return <Loading />
    } else {
      return <span className='label label-info'>Players Online: { this.data.activeUsers }</span>
    }
  }
})

export default ActiveUserCount
