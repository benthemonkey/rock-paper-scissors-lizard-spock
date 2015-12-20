RPSLS.Components.Header = React.createClass({
  render () {
    return (
      <nav className='navbar navbar-default' role='navigation'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navigation'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <a className='navbar-brand' href={ FlowRouter.path('index') }>
            <span className='hidden-xs'>Rock Paper Scissors Lizard Spock</span>
            <span className='visible-xs-block'>RPSLS</span>
          </a>
        </div>
        <div className='collapse navbar-collapse' id='navigation'>
          <RPSLS.Components.AccountsUIWrapper />
        </div>
      </nav>
    )
  }
})
