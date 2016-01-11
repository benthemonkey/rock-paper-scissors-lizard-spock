import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactLayout } from 'meteor/kadira:react-layout'

import { Layout, Home, Join, Match, NotFound, Play, SignIn } from '/imports/components'

let checkLoggedIn = function (ctx, redirect) {
  if (!Meteor.userId()) {
    redirect('/')
  }
}

FlowRouter.route('/', {
  name: 'index',
  action: function () {
    ReactLayout.render(Layout, { yield: <Home /> })
  }
})

FlowRouter.route('/login', {
  name: 'login',
  action: function () {
    ReactLayout.render(Layout, { yield: <SignIn /> })
  }
})

FlowRouter.route('/join', {
  name: 'join',
  action: function () {
    ReactLayout.render(Layout, { yield: <Join /> })
  }
})

FlowRouter.notFound = {
  name: 'notFound',
  action: function () {
    ReactLayout.render(Layout, { yield: <NotFound /> })
  }
}

FlowRouter.route('/play/:matchId', {
  name: 'play',
  // triggersEnter: [checkLoggedIn],
  action: function () {
    ReactLayout.render(Layout, { yield: <Play /> })
  }
})

FlowRouter.route('/matches/:matchId', {
  name: 'matchPage',
  action: function () {
    ReactLayout.render(Layout, { yield: <Match /> })
  }
})
