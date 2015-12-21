RPSLS.Components.Layout = React.createClass({
  propTypes: {
    yield: React.PropTypes.element.isRequired
  },
  render () {
    return (
      <div className='container-fluid'>
        <RPSLS.Components.Header />
        { this.props.yield }
      </div>
    )
  }
})
