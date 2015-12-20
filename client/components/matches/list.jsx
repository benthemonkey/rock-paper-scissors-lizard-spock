RPSLS.Components.Matches.List = React.createClass({
  propTypes: {
    matches: React.PropTypes.array.isRequired
  },
  render () {
    if (this.props.matches.length > 0) {
      return (
        <ul className='list-group'>
          { this.props.matches.map((match) => <RPSLS.Components.Matches.Item key={ match._id } match={ match } />) }
        </ul>
      )
    } else {
      return <ul className='list-group'><li className='list-group-item'>None</li></ul>
    }
  }
})
