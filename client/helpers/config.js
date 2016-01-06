/* global Accounts, UserStatus */

// Accounts.ui.config({
//   passwordSignupFields: 'USERNAME_ONLY'
// })

// this sometimes errors...
Meteor.startup(() => {
  UserStatus.startMonitor({
    threshold: 30 * 1000,
    interval: 20 * 1000,
    idleOnBlur: true
  })
})
