var socket;

let video;
let poseNet;
let pose;
let hat;
let tree;
let treeFlip;
let greenBird;
let blueBird;
let yellowBird;
let pinkBird;
let birdL = [];
let birdR = [];
let shoulderL = 0;//左肩膀上没有鸟
let shoulderR = 0;//右肩膀上没有鸟
let nR;
let nL;
let scores = 0;
let score = [0];
let arr = [];
let shoulderRX = 0;
let shoulderRY = 0;
let shoulderLX = 0;
let shoulderLY = 0;
let ran1;
let ran2;
let lenran1;
let lenran2;
var newArr = [];
let sel;
let flowerRate = 50;
let flowerRate0 = 50;

let gameState = 0;//游戏进行状态
let win = 0;
let music;
let  musicState = 0;
let winState = 0;

let timer = 60;//倒计时

function preload(){
	soundFormats('mp3', 'ogg');
	music = loadSound('music/music.mp3');

	//hat = loadImage('img/hat.png');
	tree1 = loadImage('img/tree.png');
	treeFlip1 = loadImage('img/treeFlip.png');
	
	greenBird = loadImage('img/greenBird.png');
	blueBird = loadImage('img/blueBird.png');
	yellowBird = loadImage('img/yellowBird.png');
	pinkBird = loadImage('img/pinkBird.png');
	thank = loadImage('img/thank.png');
	flower = loadImage('img/flower.png');
	bee = loadImage('img/bee.png');
	win = loadImage('img/win.png');
	lose = loadImage('img/lose.png');
}

function setup() {
	 createCanvas(840, 480);
	// background(0);
	
	 socket = io.connect('http://5386w319o8.qicp.vip');
	 rectMode(CORNERS)
	 video = createCapture(VIDEO);
	 video.size(640, 480);
	 video.hide();
	poseNet = ml5.poseNet(video, modelLoaded);
	poseNet.on('pose', gotPoses);

	sel = createSelect();
	sel.position(720, 30);
	sel.option('normal');
	sel.option('hard');
	sel.option('hell');

	for(let i = 1; i < 60; i++){
		ran1 = Math.floor(random(1,3));//blue
		lanran1 = Math.floor(random(-105,-95));//blue
		//console.log(ran1);
		birdR[i] = new Bird(300, lanran1*i*4, ran1, 127);
		ran2 = Math.floor(random(3,5));//yellow
		lanran2 = Math.floor(random(-175,-165));//blue
		//console.log(ran2);
		birdL[i] = new Bird(300, lanran2*i*4, ran2, 127);
	  }

	treeFlip = new TreeFlip();
	tree = new Tree();
	
	socket.on('gameState', function(temp){
		console.log('got temp: ' + temp);
		gameState = temp;
		console.log('gameState: ' + gameState);
		//snake = new Snake();
		//foodLocation();
	    //snake.show();
	    timer = 60;
		//scores = 0;

	});

}


  
  
function gotPoses(poses){
	//console.log(poses);
	if(poses.length > 0){
	  pose = poses[0].pose;
	}
  }
  
  
function modelLoaded() {
	console.log('poseNet ready');
  }
  
  

  function keyPressed(){
	if(key == 's'){  //按下s游戏开始
	  gameState = 1;
	  flowerRate = 50;
	  //snake = new Snake();
	  birdR.length = 0;
	  birdL.length = 0;
	  for(let i = 1; i < 60; i++){
		ran1 = Math.floor(random(1,3));//blue
		lanran1 = Math.floor(random(-105,-95));//blue
		//console.log(ran1);
		birdR[i] = new Bird(300, lanran1*i*4, ran1, 127);
		ran2 = Math.floor(random(3,5));//yellow
		lanran2 = Math.floor(random(-175,-165));//blue
		//console.log(ran2);
		birdL[i] = new Bird(300, lanran2*i*4, ran2, 127);
	  }
	  timer = 60;
	  arr = [];

	  scores = 0;
	  let temp = gameState;
	  socket.emit('gameState', temp);
	}
	
  }
  
  
  function draw() {

	//console.log(sel.value());
	background(157, 229, 185);
	frameRate(40);
	let scoreMax = Math.max.apply(null,score);
	


	//flowerRate=230;
	// image(flower, 610, 400-flowerRate0, 100+flowerRate0/2, 100+flowerRate0);
	// image(bee, 650, 50, 150, 150);
	
	rect(720, 480, 770, 480-flowerRate0);

	translate(video.width, 0);
	scale(-1, 1);
	image(video, 0, 0);
	translate(640, 0);
	scale(-1, 1);
	textSize(20);
	text('BEST SCORE: '+scoreMax, 20, 450);
	if(timer <= 0 && flowerRate >= 230){
		console.log('win');
		gameState = 0;
		//flowerRate = 230;
		//music.stop();
		musicState = 0;
		// textSize(20);
		// text('YOU GOT '+scores+' SCORES', 20, 250);
		image(win, 100, 50, 550, 350);
		
		append(score,scores);
	}else if(timer <= 0 && flowerRate <= 230){
		console.log('lose')
		gameState = 0;
		// text('TRY AGAIN', 20, 250);
		image(lose, 200, 50, 300, 300);
		textSize(40);
		text('Press \'s\' to save the bird! ', 80, 350);
		append(score,scores);
	}
	if(sel.value() == 'normal'){
		let scoreHeight = 480-flowerRate0;
		if(scoreHeight < 180){
			winState = 1;
		}
		noStroke();
		rect(640, 185, 840, 180);
		stroke(0);
		flowerRate = scores*15;
	}else if(sel.value() == 'hard'){
		let scoreHeight = 480-flowerRate0;
		if(scoreHeight < 105){
			winState = 1;
		}
		noStroke();
		rect(640, 110, 840, 105);
		stroke(0);
		flowerRate = scores*15;
	}else if(sel.value() == 'hell'){
		let scoreHeight = 480-flowerRate0;
		if(scoreHeight < 30){
			winState = 1;
		}
		noStroke();
		rect(640, 35, 840, 30);
		stroke(0);
		flowerRate = scores*15;
	}

	let newFR = flowerRate;
	flowerRate0 = lerp(flowerRate0, newFR, 0.4);

	
	newArr = [];
	  var o = {};  // { 1:true, 2:true}
	  for (let i = 0; i < arr.length; i++) {
		  var t = arr[i];
		  if(o[t]){  			// 标记是否处理过 
						  
		  }else{
			  newArr.push(arr[i]);
			  o[t] = true;
		  }
	 }
	 scores = newArr.length;
	//console.log(newArr)

	if(gameState){
		musicState++;
		if(musicState == 1){
			//music.play();
		}
		textSize(20);
		text('SCORES: '+scores, 20, 40);
		

		if (frameCount % 35 == 0 && timer > 0) { 
			//console.log(timer);
			timer--;
		  }
		  textSize(20);
		  //fill(217, 104, 49);
		  text('Time: '+timer, 550, 40);//显示倒计时
		  translate(640, 0);
		  scale(-1, 1);
		treeFlip.show();
		tree.show();
		let cnt = 0;
		for(let i = 1; i < 60; i++){
		  
			if(pose){

				let newRX = pose.rightShoulder.x;
				let newRY = pose.rightShoulder.y;
				shoulderRX = lerp(shoulderRX, newRX, 0.4);
				shoulderRY = lerp(shoulderRY, newRY, 0.4);

				let newLX = pose.leftShoulder.x;
				let newLY = pose.leftShoulder.y;
				shoulderLX = lerp(shoulderLX, newLX, 0.4);
				shoulderLY = lerp(shoulderLY, newLY, 0.4);

				fill('blue');
				//ellipse(birdR[i].x, birdR[i].y, 20);
				ellipse(shoulderRX, shoulderRY, 30);
				fill('yellow');
				ellipse(shoulderLX, shoulderLY, 30);
				//ellipse(birdL[i].x, birdL[i].y, 20);
			  
				let dRT = dist(birdR[i].x, birdR[i].y, treeFlip.x, treeFlip.y);

				birdR[i].show();
			  if(dRT < 150){
				//image(thank, tree.x, tree.y, 80, 80);
				birdR[i].hitRT();
				//treeFlip.in();
				shoulderR = 0;
				//scores++;
				append(arr, i);
				birdR[i].tin = 127;
			  }else{
				if(treeFlip.x < -50){
				  //treeFlip.out();
				}
				//birdR[i].show();
				birdR[i].move();
	  
				  let dR = dist(birdR[i].x+20, birdR[i].y+30, pose.rightShoulder.x, pose.rightShoulder.y);
				  if(dR < 100 & shoulderR == 0){
					nR = i;
					birdR[i].hitR();
					shoulderR = 1;
				  }else if(dR < 100 & shoulderR == 1){
					birdR[nR].hitR();
				  }
				
			  }
	  
			  birdL[i].show();
			  let dLT = dist(birdL[i].x+40, birdL[i].y+40, tree.x+150, tree.y+100);
			  if(dLT < 60){
				birdL[i].hitLT();
				//tree.in();
				shoulderL = 0;
				//scores++;
				append(arr, i+60);
				
			  }else{
				if(tree.x > 400){
				  //tree.out();
				}
				//birdL[i].show();
				birdL[i].move();
				let dL = dist(birdL[i].x, birdL[i].y, pose.leftShoulder.x, pose.leftShoulder.y);
				if(dL < 100 & shoulderL == 0){
				  nL = i;
				  birdL[i].hitL();
				  shoulderL = 1;
				}else if(dL < 100 & shoulderL == 1){
					birdL[nL].hitL();
				}
			  }

		  }
		}
	}
	
	 
  }
  
  function Bird(x,y,i,tin){
	this.x = x;
	this.y = y;
	this.i = i;
	this.tin = tin;

	
	
	this.show = function(){//小鸟在特定的点出现
	  //tint(255,this.tin);
	  if(i == 1){
		image(blueBird, this.x, this.y, 80, 80);
	  }
	  if(i == 2){
		image(blueBird, this.x, this.y, 80, 80);
	  }
	  if(i == 3){
		image(yellowBird, this.x, this.y, 80, 80);
	  }
	  if(i == 4){
		image(yellowBird, this.x, this.y, 80, 80);
	  }
	}
	
	this.move = function(){//从上往下落下
		if(sel.value() == 'normal'){
	  		this.y+=5;
		}else if(sel.value() == 'hard'){
			this.y+=5;
		}else if(sel.value() == 'hell'){
			this.y+=6;
		}
	}
	
	this.hitR = function(){//小鸟与右肩相碰则落下右肩上
	  this.x = shoulderRX-50;//pose.rightShoulder.x-50;
	  this.y = shoulderRY-100;pose.rightShoulder.y-100;
	}
	
	this.hitL = function(){//小鸟与左肩相碰则落在左肩上
	  this.x = shoulderLX-30;//pose.leftShoulder.x-30;
	  this.y = shoulderLY-80;//pose.leftShoulder.y-80;
	}
	
	this.hitRT = function(){//肩上的小鸟与右边的树相碰则落在树上
	  this.x = treeFlip.x+140;
	  this.y = treeFlip.y+11;
	}
	
	this.hitLT = function(){//肩上的小鸟与左边的树相碰则落在树上
	  this.x = tree.x+100;//+100;
	  this.y = tree.y+11;//+50;
	  //console.log(this.x);
	}
	
  }
  
  
  function TreeFlip(){
	this.x = -50;
	this.y = 130;
	this.state = 0;//0:x=-300; 1:x=-50;
	
	this.show = function(){
	  image(treeFlip1, this.x, this.y, 300, 200);
	}
	
	this.out = function(){
	  this.x+=1;
	  this.state = 1;
	}
	this.in = function(){
	  this.x-=1;
	  this.state = 0;
	}
  
	
  }
  
  
  function Tree(){
	this.x = 400;
	this.y = 130;
	this.state = 0;//0:x=700; 1:x=400;
	
	this.show = function(){
	  image(tree1, this.x, this.y, 300, 200);
	}
	
	this.out = function(){
	  this.x-=1;
	  this.state = 1;
	}
	this.in = function(){
	  this.x+=1;
	  this.state = 0;
	}
  
	
  }
  
  