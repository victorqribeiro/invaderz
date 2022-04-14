//
// Explosion.js
// Created by Todd Dalton on 14/04/2022.


/**
This is an individual particle of an explosion.

It holds it's own details which are updated each rendered frame until it's finished
*/
class SingleParticle {
	constructor (x, y, life, direction, size, colour) {
		this.x = x || 0.5; // normalised position within the canvas
		this.y = y || 0.5;
		this.life = life || 60; // this is the number of rendered frames that the particle lasts
		this.direction = direction || {dX: (Math.random() * 0.4) - 0.2, dY: (Math.random() * 0.4) - 0.2}; // this is the direction along the x and y axis that the particle travels
		this.size = size || 5; // this is the size of the the square that the particle is
		this.colour = colour || 'rgb(1.0, 1.0, 0.0, 1.0)'; // drawn colour of particle
		this.startingLife = life || 60;// used to calculate the opacity of the particle over its life time
	}
}

class Explosion {
	
	// This class is a small, home-grown particle system to emulate an explosion
	// We need to give it the canvas width and height and a normalised position
	// the `gravity` will dictate the simplistic physics behaviour of the individual particles
	// The `duration` is the amount of seconds that the explosion lasts
	constructor(width, height, xPos, yPos, gravity){
		this.maxParticleSpeed = 1.6; // the maximum delta of the direction of each particle between frames
		this.containerWidth = width; // the absolute size of the container
		this.containerHeight = height;
		this.gravity = 0.4 || gravity; // simple gravity parameter which is added to the y position of the particle each frame
		
		this.particleCount = 40; // number of particles that make up the explosion
		
		this.particles = []; // will be an array of `SingleParticle`s.
		
		this.speed = 0.0005; // this is the initial speed of the particles
		
		//In order to accomodate resizing canvas, the x-pos needs to be normalised 0...1
		this.xPos = xPos || 0.5;
		this.yPos = yPos || 0.5;
		
		this.isRunning = false; // indicates if we've reached the end of the animation
	}
	
	//Initiate the explosion
	start() {
		// but not if it's already going! V.unlikely to happen
		if (this.isRunning) {
			return;
		}
		//store calculation up front
		let halfMax = this.maxParticleSpeed / 2;
		for (let i = 0; i < this.particleCount; i++) {
			let newParticle = new SingleParticle(
				this.xPos,
				this.yPos,
				(Math.random() * 110) + 30, // random life that's at least 30 frames
				{dX: (Math.random() * this.maxParticleSpeed) - halfMax, dY: (Math.random() * this.maxParticleSpeed) - halfMax},
				4,
				randomColour()
			);
			this.particles.push(newParticle);
		}
		this.isRunning = true;
	}
	
	// return the x position in pixels of this sprite
	absoluteX() {
		return this.containerWidth * this.xPos;
	}
	
	// return the y position in pixels of this sprite
	absoluteY() {
		return this.containerHeight * this.yPos;
	}
	
	update() {
		
		if (!this.isRunning) {
			return;
		}
		
		let particleAliveCount = 0;
		for (let i = 0; i < this.particles.length; i++) {
			if (this.particles[i].life < 1) {
				continue;
			}
			particleAliveCount += 1;
			this.particles[i].x += this.particles[i].direction.dX;
			this.particles[i].y += this.particles[i].direction.dY + this.gravity; // add on gravity - very simplistic physics...
			
			c.fillStyle = this.particles[i].colour;
			c.globalAlpha = Math.sin(this.particles[i].life / this.particles[i].startingLife); // affect transparency over the lifetime
			
			c.fillRect(this.absoluteX() + this.particles[i].x, this.absoluteY() + this.particles[i].y, this.particles[i].size, this.particles[i].size);
			
			c.globalAlpha = 1.0; // make sure everything else is drawn fully opaque
			
			this.particles[i].life -= 1;
		}
		this.isRunning = particleAliveCount > 0;
	}
}