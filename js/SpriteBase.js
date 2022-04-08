//
// SpriteBase.java
// Created by Todd Dalton on 08/04/2022.

// This will be the base class for the invaders and player on screen
class SpriteBase {
	
	//For the resizable playing area, all sprites positions need to be normalised 0...1
	x; // 0 == left, 1 == right
	y; // 0 == top, 1 == bottom
	
	/**
	In order to make the sprite a little more 'easier' to customise,
	we should pass in the height and width of the canvas that the player is
	to sit in. This way, the player sprite can work out it's own starting
	position.
	*/
	constructor(width, height, shape, color){
		this.containerWidth = width;
		this.containerHeight = height;
		this.xDir = 1;
		this.s = 4; // size of each block making up the sprite shape
		this.color = color || '#000000';
		
		this.shapeStride = 8; // width of players bitmap shape
		this.shape = shape || [ // the default is the player sprite
			0,0,0,1,1,0,0,0,
			0,0,0,1,1,0,0,0,
			0,1,1,1,1,1,1,0,
			1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1
		]; // 8 x 5 bitmap of player from top left to bottom right
		
		this.speed = 0.0005; // with a normalised x-pos the speed needs to be geared down
		
		//In order to accomodate resizing canvas, the x-pos needs to be normalised 0...1
		this.x = 0.5; // mid position
	}
	
	// There are two iVars that have to be set up after the shape and shapeStride has been set
	finishSetup() {
		this.height = (this.shape.length / this.shapeStride) * this.s; // work out the height of the drawn player for later
		//Let's save the player's drawn width for later
		this.width = (this.shapeStride * this.s);
	}
	
	// return the x position in pixels of this sprite
	absoluteX() {
		return this.containerWidth * this.x;
	}
	
	// return the y position in pixels of this sprite
	absoluteY() {
		return this.containerHeight * this.y;
	}
	
	// Update the size of the canvas the sprite is sitting in.
	// If nothing is passed in, then the default canvas size is
	// used as according to:
	// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage#the_canvas_element
	updateContainerSize(newWidth, newHeight) {
		this.containerWidth = newWidth || 300;
		this.containerHeight = newHeight || 150;
	}
	
	// Common drawing method
	drawSprite() {
		c.fillStyle = this.color;
		for(let i = 0; i < this.shape.length; i++){
			if(this.shape[i]){
				c.fillRect((this.absoluteX() + (i%this.shapeStride)*this.s), (this.absoluteY() + (Math.floor(i / this.shapeStride))*this.s), this.s, this.s);
			}
		}
	}
}