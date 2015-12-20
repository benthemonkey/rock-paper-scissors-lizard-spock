/* global Accounts, UserStatus */

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
})

Tracker.autorun(function (computation) {
  UserStatus.startMonitor({
    threshold: 30 * 1000,
    interval: 20 * 1000,
    idleOnBlur: true
  })

  computation.stop()
})
