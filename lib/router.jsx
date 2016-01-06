import React from 'react'
import { FlowRouter } from 'kadira:flow-router'
import { ReactLayout } from 'kadira:react-layout'

import { Layout, Home, Join, Match, NotFound, Play, SignIn } from '/app/imports/components'

let checkLoggedIn = function (ctx, redirect) {
  if (!Meteor.userId()) {
    redirect('/')
  }
}

FlowRouter.route('/', {
  name: 'index',
  action: function () {
    ReactLayout.render(Layout, { yield: React.createElement(Home, null) })
  }
})

FlowRouter.route('/login', {
  name: 'login',
  action: function () {
    ReactLayout.render(Layout, { yield: React.createElement(SignIn, null) })
  }
})

FlowRouter.route('/join', {
  name: 'join',
  action: function () {
    ReactLayout.render(Layout, { yield: React.createElement(Join, null) })
  }
})

FlowRouter.notFound = {
  name: 'notFound',
  action: function () {
    ReactLayout.render(Layout, { yield: React.createElement(NotFound, null) })
  }
}

FlowRouter.route('/play/:matchId', {
  name: 'play',
  // triggersEnter: [checkLoggedIn],
  action: function () {
    ReactLayout.render(Layout, { yield: React.createElement(Play, null) })
  }
})

FlowRouter.route('/matches/:matchId', {
  name: 'matchPage',
  action: function () {
    ReactLayout.render(Layout, { yield: React.createElement(Match, null) })
  }
})
