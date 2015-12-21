RPSLS.Components.Index = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData () {
    Meteor.subscribe('currentRounds')

    return {
      loggedIn: Boolean(Meteor.user()),
      matches: _.unique(RPSLS.Queries.currentRounds().fetch(), 'matchId')
    }
  },
  render () {
    return (
      <div>
        <div className='jumbotron'>
          <div className='row text-center'>
            <div className='col-xs-4 col-sm-2 col-sm-offset-1'>
              <h1><i className='fa fa-hand-rock-o'></i></h1>
              <h4>Rock</h4>
            </div>
            <div className='col-xs-4 col-sm-2'>
              <h1><i className='fa fa-hand-paper-o'></i></h1>
              <h4>Paper</h4>
            </div>
            <div className='col-xs-4 col-sm-2'>
              <h1><i className='fa fa-hand-scissors-o'></i></h1>
              <h4>Scissors</h4>
            </div>
            <div className='col-xs-4 col-xs-offset-2 col-sm-2 col-sm-offset-0'>
              <h1><i className='fa fa-hand-lizard-o'></i></h1>
              <h4>Lizard</h4>
            </div>
            <div className='col-xs-4 col-sm-2'>
              <h1><i className='fa fa-hand-spock-o'></i></h1>
              <h4>Spock</h4>
            </div>
          </div>
          <RPSLS.Components.Matches.StartButtons loggedIn={ this.data.loggedIn } />
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h4 className='panel-title text-center'>Matches in Progress</h4>
              </div>
              <RPSLS.Components.Matches.List matches={ this.data.matches } />
            </div>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h4 className='panel-title text-center'>Upcoming Features</h4>
              </div>
              <div className='list-group'>
                <div className='list-group-item'>Ability to spectate matches</div>
                <div className='list-group-item'>Enforce time limit on moves, otherwise forfeit the match</div>
                <div className='list-group-item'>Profile pages with user stats</div>
                <div className='list-group-item'>Leaderboard</div>
              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <h3 className='text-center'>
              <RPSLS.Components.ActiveUserCount />
            </h3>
            <h3 className='text-center'>
              <RPSLS.Components.Matches.MostRecentMatch />
            </h3>
          </div>
        </div>
      </div>
    )
  }
})
