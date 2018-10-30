class Player {

	constructor(x,y,shape,color){
		this.x = x || 0;
		this.y = y || 0;
		this.xDir = 1;
		this.s = 4;
		this.color = color || 'black';
		this.shape = shape || [0,0,0,0,0,1,1,0,0,1,1,0,1,1,1,1];
		this.speed = 0.05;
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isShooting = false;
		this.bullet = {x: this.x, y: this.y, s: 3};
	}
	
	shoot(){
	 if( !this.isShooting ){
	 	this.bullet = {x: this.x+this.s/2, y: this.y, s: 3};
	 	this.isShooting = true;
	 }
	}
	
	update(){
	
		if( this.x > 0 && this.isMovingLeft ){
			this.x -= this.speed * dt;
		}
		if( this.x < w/4-this.s && this.isMovingRight ){
			this.x += this.speed * dt;
		}

		if(this.isShooting){
			this.bullet.y -= 0.1 * dt;
			if( this.bullet.y < 0 ){
				this.isShooting = false;
				this.bullet = {};
			}
		}
	
	}

	show(){
		c.fillStyle = this.color;
		for(let i = 0; i < this.shape.length; i++){
				if(this.shape[i]){
					c.fillRect( (this.x+i%4)*this.s, (this.y+(i>>2))*this.s, this.s, this.s);
				}
		}
		if( this.isShooting ){
			c.fillRect( this.bullet.x*this.s, this.bullet.y*this.s, this.bullet.s, this.bullet.s);
		}
		this.update();
	}

}
