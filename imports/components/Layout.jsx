import React from 'react'
import Header from '/imports/components/Layout/Header.jsx'

export default React.createClass({
  propTypes: {
    yield: React.PropTypes.element.isRequired
  },
  render () {
    return (
      <div className='container-fluid'>
        <Header />
        { this.props.yield }
      </div>
    )
  }
})
