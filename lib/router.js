let checkLoggedIn = function (ctx, redirect) {
  if (!Meteor.userId()) {
    redirect('/')
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

FlowRouter.route('/play', {
  name: 'play',
  triggersEnter: [checkLoggedIn],
  action: function () {
    BlazeLayout.render('layout', { yield: 'play' })
  }
})

FlowRouter.route('/matches/:matchId', {
  name: 'matchPage',
  action: function () {
    BlazeLayout.render('layout', { yield: 'matchPage' })
  }
})

// FlowRouter.route('/watch?players=:players', {
//   name: 'watch',
//   action: function () {
//     BlazeLayout.render('layout', { yield: 'matchPage' })
//   }
// })
