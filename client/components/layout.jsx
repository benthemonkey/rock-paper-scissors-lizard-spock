RPSLS.Components.Layout = React.createClass({
  propTypes: {
    yield: React.PropTypes.element.isRequired
  },
  render () {
    return (
      <div className='container'>
        <RPSLS.Components.Header />
        { this.props.yield }
      </div>
    )
  }
})
