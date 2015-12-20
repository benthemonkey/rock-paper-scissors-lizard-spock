/* global RPSLS:true, lodash, _: true */

RPSLS = {
  Collections: {},
  Components: {
    Matches: {}
  },
  Constants: {},
  log: function (message) {
    // silly way of turning logging on and off
    if (true) {
      console.log(message)
    }
  }
}

_ = lodash
