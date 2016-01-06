import React from 'react'

const Loading = React.createClass({
  propTypes: {
    size: React.PropTypes.oneOf(['1', '2', '3', '4'])
  },
  getDefaultProps () {
    return {
      size: '1'
    }
  },
  getSizeClass () {
    if (this.props.size === '1') {
      return 'fa fa-spinner fa-spin'
    } else {
      return 'fa fa-spinner fa-spin fa-' + this.props.size + 'x'
    }
  },
  render () {
    return <div className='text-center'><i className={ this.getSizeClass() }></i></div>
  }
})

export default Loading
