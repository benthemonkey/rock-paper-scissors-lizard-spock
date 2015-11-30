let requireLogin = function () {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      BlazeLayout.render('layout', { yield: 'loading' })
    } else {
      BlazeLayout.render('layout', { yield: 'accessDenied' })
    }
  } else {
    this.next()
  }
}

FlowRouter.route('/', {
  name: 'landing',
  action: function () {
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
