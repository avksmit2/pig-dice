function Player(name) {
  this.name = name;
  this.score = 0;
  this.gamesWon = 0;
}

function Die() {
  this.numbers = [1, 2, 3, 4, 5, 6];
}

function Game(player1, player2) {
  this.players = [player1, player2];
  this.gameNum = 0;
  this.dice = [];
  this.turnTotal = 0;
  this.activePlayer = 0; //index of this.players
  // this.winner = 0;
}

Die.prototype.roll = function() {
  return this.numbers[Math.round(Math.random()*(this.numbers.length-1))];
};

Game.prototype.addRoll = function() {
  var dieNum = this.dice.roll();
  if (dieNum != 1) {
    this.turnTotal += dieNum;
    if (this.turnTotal === 100) {
      this.players[this.activePlayer].gamesWon += 1;
    }
  } else {
    this.turnTotal = 0;
    this.activePlayer = getActivePlayer(this);
  }
  return dieNum;
}

Game.prototype.playerHold = function() {

  this.players[this.activePlayer].score += this.turnTotal;
  this.activePlayer = getActivePlayer(this);
  this.turnTotal = 0;
}

var getActivePlayer = function(game) {
  if (game.activePlayer === 0) {
    return 1
  } else {
    return 0;
  }
}


$(document).ready(function() {
  var game;
  var rollDice = function() {
    var currentRoll = game.addRoll();
    $('h1.roll').text(currentRoll);
    $('h1.turnTotal').text(game.turnTotal);
  }
  $("form#playerInfo").submit(function(event) {
    event.preventDefault();
    var player1Name = $('input#player1').val();
    var player2Name = $('input#player2').val();
    var player1 = new Player(player1Name);
    var player2 = new Player(player2Name);
    if (!game) {
      game = new Game(player1, player2);
      game.dice = new Die();
    } else {
      game.players[0].score = 0;
      game.players[1].score = 0;
    }
      $('h1.activePlayer').text(game.players[game.activePlayer].name);
      $('span.player1Name').text(game.players[0].name + ": ");
      $('span.player1Score').text(game.players[0].score);
      $('span.player2Name').text(game.players[1].name + ": ");
      $('span.player2Score').text(game.players[1].score);
      game.gameNum ++;
      rollDice();
  });
  $('button#roll').click(function() {
    rollDice();
    $('h1.activePlayer').text(game.players[game.activePlayer].name);
  });
  $('button#hold').click(function() {
    game.playerHold();
    $('h1.roll').text(0);
    $('h1.turnTotal').text(game.turnTotal);
    $('span.player1Score').text(game.players[0].score);
    $('span.player2Score').text(game.players[1].score);
    $('h1.activePlayer').text(game.players[game.activePlayer].name);
  });
});
