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

canvas = document.createElement('canvas');
canvas.width = w = 240;
canvas.height = h = 480;
c = canvas.getContext('2d',{alpha: false});
if (window.devicePixelRatio > 1) {
	c.canvas.width = c.canvas.width * window.devicePixelRatio;
	c.canvas.height = c.canvas.height * window.devicePixelRatio;
	c.canvas.style.width = w+'px';
	c.canvas.style.height = h+'px';
	c.scale(window.devicePixelRatio, window.devicePixelRatio);
}
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
	lives = 0;
	generation = 1;
	dt = 0;
	lastUpdate = Date.now();
	canvas.style.border = "solid";
	document.body.appendChild( canvas );
	document.body.appendChild( div );
	invaders = new Genetics();
	invaders.createPopulation();
	player = new Player( w/4/2, h/4-4 );
	update();
}

function deltaTime(){
	let now = Date.now();
	dt = now - lastUpdate;
	lastUpdate = now;
}

function getBestOfGeneration(){
	let index = 0, best = 0;
	for(let i = 0; i < invaders.population.length; i++){
		if( invaders.population[i].fit > best ){
			best = invaders.population[i].fit;
			index = i;
		}
	}
	if( !invaders.bestOfGeneration || invaders.population[index].fit > invaders.bestOfGeneration.fit ){
		invaders.bestOfGeneration = invaders.population[index];
	}
}

function gameOver(){
	c.fillStyle = "white";
	c.fillRect(0,0,w,h);
	c.fillStyle = "black";
	c.font = "10px Arial";
	c.fillText("Generation: "+generation, 5, 10);
	c.fillText("Invaders: "+lives, 5, 20);
	let txt = "Game Over!";
	c.font = "30px Arial";
	c.fillText(txt, (w-c.measureText(txt).width)/2, h/2);
}

function update(){
	c.fillStyle = "white";
	c.fillRect(0,0,w,h);
	c.fillStyle = "black";
	c.font = "10px Arial";
	c.fillText("Generation: "+generation, 5, 10);
	c.fillText("Invaders: "+lives, 5, 20);
	for(let i = 0; i < invaders.population.length; i++){
		invaders.population[i].show();
	}
	player.show();
	let allDead = true;
	for(let i = 0; i < invaders.population.length; i++){
		if( invaders.population[i].isAlive ){
			allDead = false;
			break;
		}
	}
	if(allDead){
		getBestOfGeneration();
		if(generation%7){
			invaders.evolve();
		}else{
			invaders.elitism();
		}
		generation++;
	}
	if(lives > 4){
		gameOver();
		return;
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
	
	window.addEventListener('load', function(e) {

		window.applicationCache.addEventListener('updateready', function(e) {
		  if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
				window.applicationCache.swapCache();
				window.location.reload();
		  }
		}, false);

	}, false);


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

