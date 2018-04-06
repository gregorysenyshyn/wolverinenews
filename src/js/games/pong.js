var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

  var canvas = document.createElement('canvas');
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
canvas.style = "position:absolute; left: 50%; width: 1000px; margin-left: -500px;";
var context = canvas.getContext('2d');

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
};

var render = function() {
  context.fillStyle = "##e6e6e6";
  context.fillRect(0, 0, width, height);
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#000";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(10, 180, 10, 50);
}

function Computer() {
  this.paddle = new Paddle(580, 180, 10, 50);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 3;
  this.y_speed = 0;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#000";
  context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(300,200);

var render = function() {
  context.fillStyle = "#e6e6e6";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

var update = function() {
  ball.update();
};

Ball.prototype.update = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;
};

var update = function() {
  ball.update(player.paddle, computer.paddle);
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var bottom_of_ball = this.y - 5;
  var left_of_ball = this.x - 5;
  var top_of_ball = this.y + 5;
  var right_of_ball = this.x + 5;

  if(this.y - 5 < 0) { // hitting the bottom wall
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if(this.y + 5 > 400) { // hitting the top wall
    this.y = 395;
    this.y_speed = -this.y_speed;
  }

  if(this.x < 0 || this.x > 600) { // a point was scored
    this.x_speed = -3;
    this.y_speed = 0;
    this.x = 300;
    this.y = 200;
  }

  if(left_of_ball > 300) {
    if(bottom_of_ball < (paddle2.y + paddle2.height) && //bottom of ball is below top of paddle1
     top_of_ball > paddle2.y &&   //top of ball is above bottom of paddle1
     left_of_ball < (paddle2.x + paddle2.width) &&
    right_of_ball > paddle2.x) {
      // hit the player's paddle
      this.x_speed = -3;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if(bottom_of_ball < (paddle1.y + paddle1.height) &&
    top_of_ball > paddle1.y &&
    left_of_ball < (paddle1.x + paddle1.width) &&
    right_of_ball > paddle1.x) {
      // hit the computer's paddle
      this.x_speed = 3;
      this.y_speed += (paddle1.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var update = function() {
  player.update();
  ball.update(player.paddle, computer.paddle);
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) { // down arrow
      this.paddle.move(0, -4);
    } else if (value == 40) { // up arrow
      this.paddle.move(0, 4);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) { // all the way to the bottom
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.height > 400) { // all the way to the top
    this.y = 400-this.height ;
    this.y_speed = 0;
  }
}

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function(ball) {
  var y_pos = ball.y;
  var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(0, diff);
  if(this.paddle.y < 0) {
    this.paddle.y = 0;
  } else if (this.paddle.y + this.paddle.height > 400) {
    this.paddle.y = 400-this.paddle.height ;
  }
};
