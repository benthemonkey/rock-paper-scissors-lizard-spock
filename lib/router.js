FlowRouter.route('/', {
  name: 'landing',
  action: function () {
    let user = Meteor.user()

    if (user && user.profile.currentGame) {
      FlowRouter.go('/matches/' + user.profile.currentGame)
    }

    BlazeLayout.render('layout', { yield: 'landing' })
  }
})

FlowRouter.notFound = {
  name: 'notFound',
  action: function () {
    BlazeLayout.render('layout', { yield: 'notFound' })
  }
}

FlowRouter.route('/matches/:matchId', {
  name: 'matchPage',
  action: function (params) {
    BlazeLayout.render('layout', { yield: 'matchPage' })
  }
})
