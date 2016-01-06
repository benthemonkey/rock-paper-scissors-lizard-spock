import React from 'react'
import TimeAgo from 'react-timeago'
import Loading from '/app/imports/components/general/Loading.jsx'
import { mostRecentMatch } from '/app/lib/queries'

const MostRecentMatch = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    let subscription = Meteor.subscribe('mostRecentMatch')

    return {
      isLoading: !subscription.ready(),
      mostRecentMatch: mostRecentMatch().fetch()[0]
    }
  },
  render () {
    if (this.data.isLoading) {
      return <Loading />
    } else {
      return (
        <span className='label label-info'>
          Last match played: <TimeAgo date={ this.data.mostRecentMatch.played } />
        </span>
      )
    }
  }
})

export default MostRecentMatch
