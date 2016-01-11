import React from 'react'
import MatchListItem from '/app/imports/components/matches/MatchListItem.jsx'

const MatchList = React.createClass({
  propTypes: {
    matches: React.PropTypes.array.isRequired
  },
  render () {
    if (this.props.matches.length > 0) {
      return (
        <ul className='list-group'>
          { this.props.matches.map((match) => <MatchListItem key={ match._id } match={ match } />) }
        </ul>
      )
    } else {
      return <ul className='list-group'><li className='list-group-item'>None</li></ul>
    }
  }
})

export default MatchList
