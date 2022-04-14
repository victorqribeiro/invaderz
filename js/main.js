let canvas, 
		c, 
		invaders, 
		w, 
		h, 
		dt, 
		player, 
		lives,
		lastUpdate,
		leftBtn,
		rightBtn,
		fireBtn,
		div,
		generation;

// Flag for signalling game border and score need a redraw
var refreshGameUI = false;

let hexDigits = "0123456789ABCDEF";

canvas = document.createElement('canvas');
canvas.id = "canvas";
// According to MDN docs, there should always be a fallback
canvas.innerHTML = "Sorry! Your browser doesn't support this page.<br>Please upgrade to a newer version.";

leftBtn = document.createElement('button');
leftBtn.innerText = "<";
rightBtn = document.createElement('button');
rightBtn.innerText = ">";
fireBtn = document.createElement('button');
fireBtn.innerText = "*";
div = document.createElement('div');
div.appendChild(leftBtn);
div.appendChild(fireBtn)
div.appendChild(rightBtn);

function init(){
	resizeCanvas();
	lives = 0;
	score = 0;
	generation = 1;
	dt = 0;
	lastUpdate = Date.now();
	canvas.style.border = "solid";
	document.body.appendChild( canvas );
	document.body.appendChild( div );
	invaders = new Genetics(w, h);
	invaders.createPopulation();
	player = new Player(w, h);
	player.finishSetup();
	update();
}

function randomColour() {
	var colour = "#";
	for (var i = 0; i < 3; i++) {
		colour += hexDigits.charAt((Math.random() * 14) + 1); // don't let the MSByte be '0', or 'F' so the colour isn't too light or dark
		colour += hexDigits.charAt(Math.random() * 15);
	}
	
	return colour;
}

// D.R.Y. function for resizing canvas - called during setup and during live resize
function resizeCanvas() {
	// Set up the game canvas size
	canvas.width = w = window.innerWidth * 0.9;
	canvas.height = h = window.innerHeight * 0.8;
	
	// Resize for pixel ratios
	c = canvas.getContext('2d',{alpha: false});
	if (window.devicePixelRatio > 1) {
		c.canvas.width = c.canvas.width * window.devicePixelRatio;
		c.canvas.height = c.canvas.height * window.devicePixelRatio;
		c.canvas.style.width = w+'px';
		c.canvas.style.height = h+'px';
		c.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
}

//D.R.Y. of top left text (generation, lives)
function drawHUD() {
	c.fillStyle = "white";
	c.fillRect(0,0,w,h);
	c.fillStyle = "rgb(255, 0, 0)";
	c.font = "10px Arial";
	c.fillText("Generation: "+generation, 5, 10);
	c.fillStyle = "rgb(100, 100, 100)";
	c.fillText("Invaders: "+lives, 5, 20);
	c.fillStyle = 'rgb(0, 255, 0)';
	c.fillText("SCORE: " + player.score, 5, 40);
}

function deltaTime(){
	let now = Date.now();
	dt = now - lastUpdate;
	lastUpdate = now;
}

function getBestOfGeneration(){
	let bestInvaderIndex = 0;
	
	// Find furthest fallen
	var furthestY = -100; // with this value we'll always have a furthest fallen even if it somehow gets shot as soon as generated
	for (var i = 0; i < invaders.population.length; i++) {
		if (invaders.population[i].fitness.furthestY > furthestY) {
			bestInvaderIndex = i;
			furthestY = invaders.population[i].fitness.furthestY;
		}
	}
	
	// If we don't have an older 'best of...' then assign to it the current invader that's progressed the furthest (so this happens on the first level)
	// If we do have an older 'best of...', then which is faster? That old one or the current invader that's progressed the furthest
	if( !invaders.bestOfGeneration ) {
		invaders.bestOfGeneration = invaders.population[bestInvaderIndex];
	} else {
		if (invaders.population[bestInvaderIndex].fitness.speed > invaders.bestOfGeneration.fitness.speed) {
			invaders.bestOfGeneration = invaders.population.slice(bestInvaderIndex, 1)[0];
		}
	}
}

function gameOver(){
	drawHUD();
	c.fillStyle = "rgb(255, 0, 0)";
	let txt = "Game Over!";
	c.font = "30px Arial";
	c.fillText(txt, (w-c.measureText(txt).width)/2, h/2);
}

function update(){
	drawHUD();
	for(let i = 0; i < invaders.population.length; i++){
		invaders.population[i].show();
	}
	player.show();
	
	if(lives > 4){
		gameOver();
		return;
	}
	
	let allDead = true;
	for(let i = 0; i < invaders.population.length; i++){
		if( invaders.population[i].isAlive ){
			allDead = false;
			break;
		}
	}
	if(allDead){
		
		// we can reach here multiple times after killing all the 
		getBestOfGeneration();
		
		// every 7th generation we should make a whole new 'elite' population
		if(generation % 7){
			invaders.evolve();
		}else{
			invaders.elitism();
		}
		generation++;
		player.isShooting = false;
	}

	deltaTime();
	requestAnimationFrame(update);
}

function addEvents(){
	document.addEventListener("keydown",function(e){
		switch(e.keyCode){
			case 13 :
					init();
				break;
			case 32 :
					player.shoot();
				break;
			case 37 :
			case 65 :
					player.isMovingLeft = true;
				break;
			case 39 :
			case 68 :
					player.isMovingRight = true;
				break;
		}
	});

	document.addEventListener("keyup",function(e){
		switch(e.keyCode){
			case 37 :
			case 65 :
					player.isMovingLeft = false;
				break;
			case 39 :
			case 68 :
					player.isMovingRight = false;
				break;
		}
	});

	window.addEventListener("focus",function(){
		lastUpdate = Date.now();
	});

	fireBtn.addEventListener('touchstart', function(){
		if( lives > 4){
			init();
		}else{
			player.shoot();
		}
	});
	
	fireBtn.addEventListener('mousedown', function(){
		if( lives > 4){
			init();
		}else{
			player.shoot();
		}
	});

	leftBtn.addEventListener('touchstart', function(){
		player.isMovingLeft = true;
	});

	leftBtn.addEventListener('touchend', function(){
		player.isMovingLeft = false;
	});
	
	leftBtn.addEventListener('mousedown', function(){
		player.isMovingLeft = true;
	});

	leftBtn.addEventListener('mouseup', function(){
		player.isMovingLeft = false;
	});	

	rightBtn.addEventListener('touchstart', function(){
		player.isMovingRight = true;
	});

	rightBtn.addEventListener('touchend', function(){
		player.isMovingRight = false;
	});
	
	rightBtn.addEventListener('mousedown', function(){
		player.isMovingRight = true;
	});

	rightBtn.addEventListener('mouseup', function(){
		player.isMovingRight = false;
	});
	
	/**
	According to
	
	https://developer.mozilla.org/en-US/docs/Web/API/Window/applicationCache
	
	`applicationCache` is deprecated.
	*/
	/**
	window.addEventListener('load', function(e) {

		window.applicationCache.addEventListener('updateready', function(e) {
		  if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
				window.applicationCache.swapCache();
				window.location.reload();
		  }
		}, false);

	}, false);
	*/
	
	window.addEventListener('resize', () => {
		resizeCanvas();
		player.updateContainerSize(w, h);
		invaders.updateContainerSize(w, h);
	})

	if('serviceWorker' in navigator) {
		navigator.serviceWorker
		         .register('/invaderz/sw.js')
		         .then(function() { });
	}

	let deferredPrompt;
	const addBtn = document.createElement('button');

	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt = e;
		addBtn.addEventListener('click', (e) => {
		  addBtn.style.display = 'none';
		  deferredPrompt.prompt();
		  deferredPrompt.userChoice.then((choiceResult) => {
		      deferredPrompt = null;
		    });
		});
	});
	
}

addEvents();
init();

