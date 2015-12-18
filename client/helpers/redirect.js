// Observe user object for updates to user.profile.redirect
Tracker.autorun(function () {
  let user = Meteor.user()

  if (user && user.profile.redirect) {
    FlowRouter.go(user.profile.redirect.name, user.profile.redirect.data)
    Meteor.call('clearRedirect')
  }
})
