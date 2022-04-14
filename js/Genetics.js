
// This class holds all the invaders
class Genetics {
	
	constructor(canvasWidth, canvasHeight){
		this.population = [];
		this.populationTmp = [];
		this.populationSize = 6;
		this.populationFeaturesSize = 64;
		this.bestOfGeneration;
		this.containerHeight = canvasHeight;
		this.containerWidth = canvasWidth;
		
		//String of HEX to generate a random colour
		this.hexDigits = "0123456789ABCDEF";
	}
	
	// Select a random invader to be a parent of this population
	selectParent(){
		let total = 0;
		for (let i = 0; i < this.population.length; i++) {
			total += this.population[i].fitness.furthestY;
		}
		let prob = Math.random() * total;
		for (let i = 0; i < this.population.length; i++) {
			// If the random number  < than this invaders furthest progression then return it as a new invader
			if ( prob < this.population[i].fitness.furthestY ) {
				// return the 0th element of an entirely new, single element array
				return this.population[i];
			}
			// increase the probability of returning an invader
			prob -= this.population[i].fitness.furthestY;
		}
		// Make absolutely sure we return something
		return this.population.splice(Math.random() * this.population.length - 1, 1)[0];
	}
	
	// Update the size of the canvas the sprite is sitting in.
	// If nothing is passed in, then the default canvas size is
	// used as according to:
	// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage#the_canvas_element
	updateContainerSize(newWidth, newHeight) {
		this.containerWidth = newWidth || 300;
		this.containerHeight = newHeight || 150;
		
		for (var i = 0; i < this.population.length; i++) {
			this.population[i].updateContainerSize(newWidth, newHeight);
		}
	}
	
	createPopulation(){
		this.population = [];
		for(let i = 0; i < this.populationSize; i++){
			let shape = [];
			for(let j = 0; j < this.populationFeaturesSize; j++){
				shape.push( Math.random() < 0.5 ? 1 : 0 );
			}
			this.population.push( new Invader( (Math.random() * 0.8) + 0.1, shape, randomColour() ) );
			this.population[this.population.length - 1].updateContainerSize(this.containerWidth, this.containerHeight);
			this.population[this.population.length - 1].finishSetup();
		}
	}

	// Returns a new invader with one of the cross overs
	crossOver(_a,_b){
		let a,b;
		
		
		if( Math.random() < 0.5 ){
			a = _a;
			b = _b;
		}else{
			a = _b;
			b = _a;
		}
		
		// generate a new child
		let shape = b.shape;	
		if (Math.random() < 0.5) {
			shape = a.shape;
		}
		let child = new Invader( (Math.random() * 0.8) + 0.1, shape, randomColour() );
		child.updateContainerSize(this.containerWidth, this.containerHeight);
		child.finishSetup();
		
		// and select the 'genes'
		let rand = Math.random();
		if( rand < 0.33 ){
			// take left side of the b invader
			for(let i = 0; i < a.shape.length; i+=child.shapeStride){
				for (var c = 0; c < child.shapeStride/2; c++) {
					child.shape[c] = b.shape[c];
				}
			}
		}else if( rand < 0.66){
			// take top vertical half of b
			for(let i = 0; i < a.shape.length/2; i++){
				child.shape[i] = b.shape[i];
			}
		}else{
			// take odd pixel (aka gene) from a and even from b
			for(let i = 0; i < a.shape.length; i++){
				let value;
				if( i % 2 ){
					value = a.shape[i];
				}else{
					value = b.shape[i];
				}
				child.shape[i] = value;
			}
		}
		return child;
	}
	
	// Change a random pixel in the sprite
	mutate(child){
		let spot = Math.floor(Math.random() * child.shape.length);
		if( child.shape[spot] ){
			child.shape[spot] = 0;
		}else{
			child.shape[spot] = 1;
		}
		return child;
	}
	
	evolve(){
		this.populationTmp = [];
		for(let x = 0; x < this.populationSize; x++){
			
			// Get two random invaders
			let a = this.selectParent();
			let b = this.selectParent();
			
			// Create a new invader that's some kind of mix of the two 'parents'
			let child = this.crossOver(a,b);
			
			// This is the 10% mutation
			if( Math.random() < 0.1 ){
				child = this.mutate(child);
			}
			this.populationTmp.push(child)
		}
		this.population = this.populationTmp.slice();
	}
	
	// Called every 7th generation to make a completely new population but construct one with the shape of the best invader so far
	elitism(){
		this.createPopulation();
		let rand = Math.floor(Math.random() * this.population.length);
		let invader = new Invader( (Math.random() * 0.8) + 0.1, this.bestOfGeneration.shape.slice(), randomColour() );
		this.population[rand] = invader;
	}	
}
