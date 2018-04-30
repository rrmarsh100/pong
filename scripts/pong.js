var field_canvas = document.getElementById("field");
var field_context = field_canvas.getContext("2d");
var player = new Player();
var computer = new Computer();
var ball = new Ball(397, 295);
var keysDown= {};

var render = function() {
  field_context.fillStyle="black";
  field_context.fillRect(5, 25, 800, 600);
  field_context.strokeStyle="white";
  field_context.strokeRect(10, 30, 785, 565 );
  field_context.moveTo(405,30);
  field_context.lineTo(400,595);
  field_context.stroke();
  player.render();
  computer.render();
  ball.render();
};

var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function(callback) {window.setTimeout(callback, 1000/60) };

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
  player.update();
  ball.update(player.paddle, computer.paddle);
};

function Paddle (x,y,width,height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = 5;
};

function Computer() {
  this.paddle = new Paddle(30, 280, 10, 40);
};

function Player() {
  this.paddle = new Paddle(765,280,10,40)
};

function Ball(x,y) {
  this.x = x;
  this.y = y;
  this.xSpeed = 3;
  this.ySpeed = Math.floor((Math.random()* 8) + -4);
};

Paddle.prototype.render = function() {
  field_context.fillStyle = "white";
  field_context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x,y) {
  this.x += x;
  this.y += y;
  if(this.y < 30) {
    this.y = 30;
  } else if (this.y + this.height > 595) {
    this.y = 595 - this.height;
  }
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) {
      this.paddle.move(0, -this.paddle.speed);
    } else if (value == 40) {
      this.paddle.move(0, this.paddle.speed);
    } else {
      this.paddle.move(0,0);
    }
  }
};

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

Ball.prototype.render = function() {
  field_context.beginPath();
  field_context.fillStyle = "white";
  field_context.fillRect(this.x, this.y, 10, 10);
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.xSpeed;
  this.y += this.ySpeed;
  this.right = this.x + 5;
  this.top = this.y + 5;
  this.left = this.x - 5;
  this.bottom = this.y - 5;

  if(this.top < 30) {
    this.y = 30;
    this.ySpeed = -this.ySpeed;
  } else if(this.bottom > 590) {
    this.y = 585;
    this.ySpeed = -this.ySpeed;
  }

  if(this.right > (paddle1.x - paddle1.width) && this.right < (paddle1.x + paddle1.width) && (this.top < (paddle1.y + paddle1.height) && this.bottom > (paddle1.y - paddle1.height/2))) {
    this.xSpeed = -this.xSpeed;
    this.y > paddle1.y ? this.ySpeed += (paddle1.speed / 2) : this.ySpeed -= (paddle1.speed / 2);
  }
  if(this.left < (paddle2.x + paddle2.width) && this.left < (paddle2.x + paddle2.width) && (this.top < (paddle2.y + paddle2.height) && this.bottom > (paddle2.y - paddle2.height/2))) {
    this.xSpeed = -this.xSpeed;
    this.y > paddle2.y ? this.ySpeed -= (paddle2.speed / 2) : this.ySpeed += (paddle2.speed / 2);
  }

  if (this.x < 5 || this.x > 795) {
    this.y = 300;
    this.x = 400;
    this.ySpeed = Math.floor((Math.random()* 8) + -4);
    this.xSpeed = 3;
  }

};

window.onload = function() {
  animate(step);
};

window.addEventListener("keydown", function(event){
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
  delete keysDown[event.keyCode];
});
