function Player(name) {
  this.name = name;
  this.score = 0;
  this.gamesWon = 0;
}

function Die() {
  this.numbers = [1, 2, 3, 4, 5, 6];
}

function Game(player1, player2, winNum) {
  this.players = [player1, player2];
  this.gameNum = 0;
  this.dice = [];
  this.turnTotal = 0;
  this.activePlayer = player1; //index of this.players
  this.testing = player1;
  this.winNum = winNum;
  this.gameOver = false;
}

Die.prototype.roll = function() {
  return this.numbers[Math.round(Math.random()*(this.numbers.length-1))];
};

Game.prototype.addRoll = function() {
  var dieNum = this.dice.roll();
  if (dieNum != 1) {
    this.turnTotal += dieNum;
  } else {
    this.turnTotal = 0;
    this.activePlayer = getActivePlayer(this);
  }
  return dieNum;
}

Game.prototype.playerHold = function() {
  this.activePlayer.score += this.turnTotal;
  if (this.activePlayer.score >= this.winNum) {
    this.activePlayer.gamesWon += 1;
    this.gameOver = true;
  } else {
    this.activePlayer = getActivePlayer(this);
    this.turnTotal = 0;
  }
}

var getActivePlayer = function(game) {
  if (game.activePlayer === game.players[0]) {
    return game.players[1];
  } else {
    return game.players[0];
  }
}

//Front-end
$(document).ready(function() {
  var game;
  var dom = {
    newGame: $("#newGame"),
    gamePlay: $("#gamePlay"),
    currentRoll: $('h1.roll'),
    activePlayerName: $('h1.activePlayer'),
    turnTotal: $('h1.turnTotal'),
    player1Name: $('span.player1Name'),
    player2Name: $('span.player2Name'),
    player1Score: $('span.player1Score'),
    player2Score: $('span.player2Score'),
    gameNum: $('span.gameNum'),
    winner: $('span.winner'),
    congrats: $('#congrats')
  };
  var rollDice = function() {
    var currentRoll = game.addRoll();
    dom.currentRoll.text(currentRoll);
    dom.turnTotal.text("Turn total: " + game.turnTotal);
  }
var checkGameOver = function() {
  if (game.gameOver) {
    dom.gamePlay.hide();
    dom.winner.text(game.activePlayer.name.toUpperCase() + ', congratulations on your acheivement!! You are the PRIME PIG!!!');
    dom.congrats.show();
  }
}
  dom.newGame.submit(function(event) {
    event.preventDefault();
    var player1Name = $('input#player1').val();
    var player2Name = $('input#player2').val();
    var winNum = $('input#winNum').val();
    var player1 = new Player(player1Name);
    var player2 = new Player(player2Name);
    if (!game) {
      game = new Game(player1, player2, winNum);
      game.dice = new Die();
    } else {
      game.players[0].score = 0;
      game.players[1].score = 0;
      game.turnTotal = 0;
    }
    dom.newGame.hide();
    dom.gamePlay.show();
    dom.activePlayerName.text("Current player: " + game.activePlayer.name);
    dom.player1Name.text(game.players[0].name + ": ");
    dom.player1Score.text(game.players[0].score);
    dom.player2Name.text(game.players[1].name + ": ");
    dom.player2Score.text(game.players[1].score);
    game.gameNum ++;
    dom.gameNum.text(game.gameNum);
    rollDice();
  });
  $('button#roll').click(function() {
    rollDice();
    dom.activePlayerName.text("Current player: " + game.activePlayer.name);
  });
  $('button#hold').click(function() {
    game.playerHold();
    dom.currentRoll.text(0);
    dom.turnTotal.text("Turn Total: " + game.turnTotal);
    dom.player1Score.text(game.players[0].score);
    dom.player2Score.text(game.players[1].score);
    dom.activePlayerName.text("Current player: " + game.activePlayer.name);
    checkGameOver();
  });
  $('button#continue').click(function() {
    dom.congrats.hide();
    dom.newGame.show();
    dom.gamePlay.show();
  });
});
