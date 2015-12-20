RPSLS.Components.Matches.Summary = React.createClass({
  propTypes: {
    rounds: React.PropTypes.array
  },
  displayWinner (winner) {
    if (winner) {
      return <h1 className='text-center'>Winner: { winner }</h1>
    }
  },
  resultsList (players, results) {
    if (results.length > 0) {
      return (
        <ul className='list-group'>
          {
            results.map((result, i) => {
              return <RPSLS.Components.Matches.RoundResult key={ i } players={ players } result={ result } />
            })
          }
        </ul>
      )
    } else {
      return <ul className='list-group'><li className='list-group-item'>None</li></ul>
    }
  },
  render () {
    let matchInfo = RPSLS.matchInfo(this.props.rounds)

    return (
      <div>
        { this.displayWinner(matchInfo.winner) }
        <div className='panel panel-default m-b-md'>
          <div className='panel-heading'>
            <h4 className='panel-title text-center'>Score (first to 3)</h4>
          </div>
          <div className='panel-body text-center'>
            <div className='row'>
              <div className='col-xs-6'>
                <h4>{ matchInfo.players[0] }:</h4>
                <h4>{ matchInfo.score[matchInfo.players[0]] }</h4>
              </div>
              <div className='col-xs-6'>
                <h4>{ matchInfo.players[1] }:</h4>
                <h4>{ matchInfo.score[matchInfo.players[1]] }</h4>
              </div>
            </div>
          </div>
          { this.resultsList(matchInfo.players, matchInfo.results) }
        </div>
      </div>
    )
  }
})
