Template.roundItem.helpers({
  playerColor: function (player) {
    return this.players.indexOf(player) ? 'success' : 'primary'
  }
})
