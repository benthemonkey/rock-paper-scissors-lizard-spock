Template.matchInfo.helpers({
  getScore: function (index) {
    return _.isArray(this.players) ? this.score[this.players[index]] : ''
  }
})
