//
// SpriteBase.java
// Created by Todd Dalton on 08/04/2022.

public class SpriteBase {
	
	/**
	In order to make the sprite a little more 'easier' to customise,
	we should pass in the height and width of the canvas that the player is
	to sit in. This way, the player sprite can work out it's own starting
	position.
	*/
	constructor(width, height, shape, color){
		this.bulletSize = 10;
		this.containerWidth = width;
		this.containerHeight = height;
		this.xDir = 1;
		this.s = 4; // size of each block making up the player shape
		this.color = color || 'black';
		
		this.shapeStride = 8; // width of players bitmap shape
		this.shape = shape || [ // the default is the player sprite
			0,0,0,1,1,0,0,0,
			0,0,0,1,1,0,0,0,
			0,1,1,1,1,1,1,0,
			1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1
		]; // 8 x 5 bitmap of player from top left to bottom right
		
		this.speed = 0.0005; // with a normalised x-pos the speed needs to be geared down
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isShooting = false;
		this.bullet = {x: this.x, y: this.y, s: 3};
		this.height = (this.shape.length / this.shapeStride) * this.s; // work out the height of the drawn player for later
		//Let's save the player's drawn width for later
		this.width = (this.shapeStride * this.s);
		//In order to accomodate resizing canvas, the x-pos needs to be normalised 0...1
		this.x = 0.5; // mid position
	}
	
	// Update the size of the canvas the sprite is sitting in.
	// If nothing is passed in, then the default canvas size is
	// used as according to:
	// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage#the_canvas_element
	updateContainerSize(newWidth, newHeight) {
		this.containerWidth = newWidth || 300;
		this.containerHeight = newHeight || 150;
		this.calculateYPosition();
	}
	
	//D.R.Y. for getting the sprite's y-position (top of the sprite)
	calculateYPosition(){
		this.y = this.containerHeight - this.height; // store it
		return this.y; // and return it in case caller needs it
	}
	
}