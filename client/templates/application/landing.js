Template.landing.events({
  'click #start': function () {
    Meteor.call('startMatch', function (err, res) {
      console.log(err)
      console.log(res)
    })
  }
})
