/* global RPSLS:true */

RPSLS = {
  Collections: {},
  Components: {
    Matches: {}
  },
  Constants: {},
  Queries: {},
  log: function (message) {
    // silly way of turning logging on and off
    if (true) {
      console.log(message)
      console.trace()
    }
  }
}

if (Meteor.isClient) {
  Object.keys(Package).forEach((packageName) => {
    Object.assign(window, Package[packageName])
  })
}
