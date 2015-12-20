/* global ReactDOM, Blaze, Template */

RPSLS.Components.AccountsUIWrapper = React.createClass({
  componentDidMount () {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template._loginButtons, ReactDOM.findDOMNode(this.refs.container))
  },
  componentWillUnmount () {
    // Clean up Blaze view
    Blaze.remove(this.view)
  },
  render () {
    return <ul ref='container' className='nav navbar-nav navbar-right'></ul>
  }
})
