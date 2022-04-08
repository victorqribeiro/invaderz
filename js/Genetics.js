
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
	
	randomColour() {
		var colour = "#";
		for (var i = 0; i < 3; i++) {
			colour += this.hexDigits.charAt((Math.random() * 14) + 1); // don't let the MSB be '0', or 'F' so the colour isn't too light or dark
			colour += this.hexDigits.charAt(Math.random() * 15);
		}
		
		return colour;
	}

	selectParent(){
		let total = 0;
		for(let i = 0; i < this.populationTmp.length; i++){
			total += this.populationTmp[i].fit;
		}
		let prob = Math.random() * total;
		for(let i = 0; i < this.populationTmp.length; i++){
			if( prob < this.populationTmp[i].fit ){
				return this.populationTmp.splice(i,1)[0];
			}
			prob -= this.populationTmp[i].fit
		}
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
			this.population.push( new Invader( (Math.random() * 0.8) + 0.1, shape, this.randomColour() ) );
			this.population[this.population.length - 1].updateContainerSize(this.containerWidth, this.containerHeight);
			this.population[this.population.length - 1].finishSetup();
		}
	}

	crossOver(_a,_b){
		let a,b,x;
		if( Math.random() < 0.5 ){
			a = _a;
			b = _b;
			x = w/4/2;
		}else{
			a = _b;
			b = _a;
			x = a.x
		}
		let child = new Invader( (Math.random() * 0.8) + 0.1, shape, this.randomColour() );
		let rand = Math.random();
		if( rand < 0.33 ){
			for(let i = 0; i < a.shape.length; i+=4){
				child.shape[i] = b.shape[i];
				child.shape[i+1] = b.shape[i+1];
			}
		}else if( rand < 0.66){
			for(let i = 0; i < a.shape.length/2; i++){
				child.shape[i] = b.shape[i];
			}
		}else{
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
		let newPopulation = [];
		for(let x = 0; x < this.populationSize; x++){
			this.populationTmp = this.population.slice();
			let a = this.selectParent();
			let b = this.selectParent();
			let child = this.crossOver(a,b);
			if( Math.random() < 0.1 ){
				child = this.mutate(child);
			}
			newPopulation.push( child );
		}
		this.population = newPopulation;
	}
	
	elitism(){
		this.createPopulation();
		let rand = Math.floor(Math.random() * this.population.length);
		let invader = new Invader(w/4/2 ,Math.random()*-20, this.bestOfGeneration.shape.slice());
		this.population[rand] = invader;
	}
	
}
