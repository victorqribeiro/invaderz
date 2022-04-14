class Invader extends SpriteBase {


	constructor(x, shape,color,speed){
		
		super(300, 150, shape, color);
		
		this.x = x;
		this.y = -0.1 + ((Math.random() * 0.06)); // hack to start off screen
		this.xDir = 1;
		this.s = 4;
		this.i = 0; // appears to be offset of shape bitmap that is checked to allow or not a move.
		this.frame = 0; // frame counter to compare againse maxFrame and make a change of direction
		this.dir = ( Math.random () < 0.5 ? -1 : 1 );
		this.maxFrame = Math.floor( Math.random() * 32 ) + 16; // the number of frames to render before changing the invaderz direction
		this.color = color || 'black';
		this.shapeStride = 8;
		this.shape = shape || [0,1,1,0,0,1,1,0,1,1,1,1,0,1,1,0];
		this.isShot = false; // set when the invader is shot...
		this.isAlive = true; // but the alive only gets set to false at end of explosion
		this.pointage = 10; // This is the number of points we get for this invader and is added to the players score when it's hit
		// These are the criteria for the best in class of invader
		// furthestY: distance the invader dropped ( > 1 then it landed). This is the parameter best used to weight up if it's a good species
		// speed: it's falling and x-direction speed
		// landed: bool to indicate if it landed without being shot
		this.fitness = {furthestY: 0, speed: speed != undefined ? speed : (0.00005 * Math.random()) + 0.00003, landed: false};
	}
	
	update(){
		if( this.y >= 1 ){
			// we reached the end of the screen!
			this.fitness.speed = this.speed;
			this.fitness.landed = true;
			lives++;
			this.isAlive = false;
			return;
		}

		// work out if we can move left or right. Appears to be based on the pixel value of the invader
		if( !this.shape[this.i] ){
			let value =  this.dir * this.fitness.speed * dt // get the delta change
			// Work out if we're within the screen limits and if so make the move
			if( this.x + value > 0 && (this.x + value) < 1 ){
				this.x += value;
			}
		}
		
		super.update();
		
		this.y += this.fitness.speed * dt;
		
		// Has there been enough frames elapsed to change direction?
		if( this.frame >= this.maxFrame ){
			// reverse direction
			this.dir = -this.dir;
			// reset frame counter
			this.frame = 0;
			// calculate a new number of frames before the next change of direction
			this.maxFrame = Math.floor( Math.random() * 64 ) + 16;
			// pick a new pixel to check for moving (see above)
			this.i = ++this.i % this.shape.length;
		}
		
		this.frame++;
		this.fitness.furthestY = this.y;
		
		//var distanceFromBullet = Math.sqrt( (player.bullet.y - this.absoluteY())**2 + (player.bullet.x - (this.absoluteX()+2))**2);
		
		// Check for bullet hit
		let condition1 = player.bullet.x > (this.absoluteX() + this.width); // is bullet right of invader?
		let condition2 = (player.bullet.x + player.bulletSize) < this.absoluteX(); // is bullet left of invader?
		let condition3 = (player.bullet.y + player.bulletSize) < this.absoluteY(); // is bullet above invader?
		let condition4 = player.bullet.y > (this.absoluteY() + this.height); // is bullet below invader?
		
		if( player.isShooting && !(condition1 || condition2 || condition3 || condition4) ){ // if the player is shooting and non of the above are true...
			// the bullet is 'in' the invader
			let x = player.bullet.x;
			let y = player.bullet.y;
			// get the data rect of the bullet from the canvas and check to see if it contains a bit of the invader
			let area = c.getImageData(x, y, player.bulletSize+1, player.bulletSize);
			// and check for the bullet's 
			for(let i = 0; i < area.data.length; i++){
				if( area.data[i] ){
					this.isShot = true;
					player.bullet = {};
					player.isShooting = false;
					player.score += this.pointage;
					this.explosion = new Explosion(this.containerWidth, this.containerHeight, this.x, this.y);
					this.explosion.start();
					break;
				}
			}
		}
	}
	
	show() {
		if(!this.isShot && this.isAlive){
			this.drawSprite();
			this.update();
		}
		
		if (this.explosion) {
			this.explosion.update();
			
			// Check if we've been shot and the explosion's finished
			if (this.isShot && !this.explosion.isRunning) {
				this.isAlive = false;
			}
		}
	}
}
