class Player extends SpriteBase {
	
	constructor(width, height, shape, color){
		super(width, height, shape, color);
		this.bulletSize = 10;
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isShooting = false;
		this.bullet = {x: this.x, y: this.y};
		this.score = 0;
	}
	
	finishSetup() {
		super.finishSetup();
		this.y = (this.containerHeight - this.height) / this.containerHeight;
	}
	
	shoot(){
		if( !this.isShooting ){
			this.bullet = {x: (this.containerWidth * this.x) + (this.width / 2) - (this.bulletSize / 2), y: this.absoluteY()};
			this.isShooting = true;
		}
	}	
	
	update(){
		this.absoluteY();
		if( this.isMovingLeft ){
			this.x -= this.speed * dt;
		}
		if( this.isMovingRight ){
			this.x += this.speed * dt;
		}
		
		super.update();
		
		if(this.isShooting){
			this.bullet.y -= 0.7 * dt;
			if( this.bullet.y < 0 ){ // has the bullet reached the top of the canvas?
				this.isShooting = false;
				this.bullet = {};
			}
		}
	}

	// This is called by the main.js every frame update
	show(){
		this.drawSprite();
		if( this.isShooting ){
			c.fillRect( this.bullet.x, this.bullet.y, this.bulletSize, this.bulletSize);
		}
		this.update();
	}
	
}
