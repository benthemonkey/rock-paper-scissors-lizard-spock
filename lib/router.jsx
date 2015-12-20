let checkLoggedIn = function (ctx, redirect) {
  if (!Meteor.userId()) {
    redirect('/')
  }
}

FlowRouter.route('/', {
  name: 'index',
  action: function () {
    ReactLayout.render(RPSLS.Components.Layout, { yield: <RPSLS.Components.Index /> })
  }
})

FlowRouter.notFound = {
  name: 'notFound',
  action: function () {
    ReactLayout.render(RPSLS.Components.Layout, { yield: <RPSLS.Components.NotFound /> })
  }
}

FlowRouter.route('/play/:matchId', {
  name: 'play',
  triggersEnter: [checkLoggedIn],
  action: function () {
    ReactLayout.render(RPSLS.Components.Layout, { yield: <RPSLS.Components.Play /> })
  }
})

FlowRouter.route('/matches/:matchId', {
  name: 'matchPage',
  action: function () {
    ReactLayout.render(RPSLS.Components.Layout, { yield: <RPSLS.Components.Match /> })
  }
})
