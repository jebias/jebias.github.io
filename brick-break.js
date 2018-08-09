
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// stage
// 0-start screen, 1-stage 1, 2-stage 2, ...
var stage = 0; 

// score
var score = 0;
var lives = 3;

// ball
var ballx = canvas.width/2;
var bally = canvas.height-30;
var vx = -2;// velocity
var vy = -2;
var ballRadius = 5;

// paddle
var paddleh = 10;// height
var paddlew = 70;// width
var paddlex = (canvas.width-paddlew)/2;

// mouse
var mousex = 0;
var mousey = 0;
document.addEventListener("mousemove", function(evt) {
    var mousePos = getMousePosition(evt, canvas);
    paddlex = mousePos.x - 35;
    mousex = mousePos.x;
    mousey = mousePos.y;
    //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }, false);
//document.addEventListener("mouseover", getMousePosition);
document.addEventListener("click", mousePressed);

// bricks
var brickRowCount = 3;
var brickColCount = 5;
var brickw = 75;// width
var brickh = 20;// height
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(var col = 0; col < brickColCount; col++){
  bricks[col] = [];
  for(var row = 0; row < brickRowCount; row++){
    bricks[col][row] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

function collisionDetection(){
  for(var col = 0; col < brickColCount; col++){
    for(var row = 0; row < brickRowCount; row++){
      var b = bricks[col][row];
      if(b.status == 1){if(ballx > b.x && ballx < b.x + brickw && bally > b.y && bally < b.y + brickh){
        vy = -vy;
        b.status = 0;
        if(vx < 0 && vy < 0){
          vx-=2;
          vy-=2;
        }
        else{
          vx+=2;
          vy+=2;
        }
        score++;
        if(score == brickRowCount * brickColCount){
          //alert("YOU WIN, CONGRADULATIONS");
          stage = 3
          //document.location.reload();
        }
      }
      }
    }
  }
}

function drawLives(){
  ctx.font = "16px Comic Sans MS";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawScore(){
  ctx.font = "16px Comic Sans MS";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawBricks(){
  for(var col = 0; col < brickColCount; col++){
    for(var row = 0; row < brickRowCount; row++){
      if(bricks[col][row].status == 1){
        var brickx = (col * (brickw+brickPadding)) + brickOffsetLeft;
      var bricky = (row * (brickw+brickPadding)) + brickOffsetTop;
      bricks[col][row].x = brickx;
      bricks[col][row].y = bricky;
      ctx.beginPath();
      ctx.rect(brickx, bricky, brickw, brickh);
      ctx.fillStyle = "#04ffb4";
      ctx.fill();
      ctx.closePath();
      }   
    }
  }
}

function drawGameOver(){
    ctx.beginPath();
    ctx.font = "48px Comic Sans MS";
    ctx.fillStyle = "FFFFFF";
    ctx.fillText("GAME OVER", canvas.width/2-150, canvas.height/2);
    ctx.closePath();
}

function drawYouWin(){
    ctx.beginPath();
    ctx.font = "48px Comic Sans MS";
    ctx.fillStyle = "FFFFFF";
    ctx.fillText("YOU WIN", canvas.width/2-125, canvas.height/2);
    ctx.closePath();
}

function getMousePosition(evt, canv){
  var rect = canv.getBoundingClientRect(); 
  return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function mousePressed(e){
 if(stage == 0 && mousex > canvas.width/2-100 && mousex < canvas.width/2+100 && mousey > canvas.height/2-50 && mousey < canvas.height/2+50){
   stage = 1;
 }
  /*
  mousex = e.clientX;// - this.getCanvasPos(e.target).left + window.pageXOffset;
  mousey = e.clientY;
  */
}

function spacebarPressed(e){
    if(e.keyCode == 32){
        stage = 1;
    }
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddlex, canvas.height-paddleh, paddlew, paddleh);
  ctx.fillStyle = "#04ffb4";
  ctx.fill();
  ctx.closePath();
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(ballx, bally, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#40F000";
  ctx.fill();
  ctx.closePath();
}

function drawStartScreen(){
  ctx.beginPath();
  ctx.rect(canvas.width/2 - 100,canvas.height/2 - 50,200,100);
  ctx.strokeStyle = "#40F000";
  ctx.stroke();
  ctx.font = "16px Comic Sans MS";
  ctx.fillStyle = "#40F000";
  ctx.fillText("CLICK HERE TO START", canvas.width/2-90, canvas.height/2);
  ctx.closePath();
}

function drawStageOne(){
  if(stage == 1){
    drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  drawLives();
  collisionDetection();
  // moving the ball
  ballx += vx;
  bally += vy;
  
  // bounce off the top or bottom
  if(bally + vy < ballRadius){
    vy = -vy;
  }
  else if(bally + vy >   canvas.height-ballRadius){
    // ball hits paddle
    if(ballx > paddlex && ballx < paddlex + paddlew){      
    vy = -vy;
    }
    // game over
    else{
      lives--;
if(!lives) {
    stage = 2;
    //document.location.reload();
}
else {
    ballx = canvas.width/2;
    bally = canvas.height-30;
    vx = 2;
    vy = -2;
    paddlex = (canvas.width-paddlew)/2;
}
      
     }
          }
  if(ballx + vx > canvas.width-ballRadius || ballx + vx < ballRadius){
    vx = -vx; 
  }
  
  }
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(stage == 0){
    drawStartScreen();
    
    //document.addEventListener("keyup", spacebarPressed);
  }
  else if(stage == 1){
    drawStageOne();
  }
  else if(stage == 2){
      drawGameOver();
  }
  else{
      drawYouWin();
  }
  requestAnimationFrame(draw);
}

//setInterval(draw, (1/60)*1000);

draw();