class Genetics {

	constructor(){
		this.population = [];
		this.populationTmp = [];
		this.populationSize = 6;
		this.populationFeaturesSize = 16;
		this.bestOfGeneration;
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
	
	createPopulation(){
		this.population = [];
		for(let i = 0; i < this.populationSize; i++){
			let shape = [];
			for(let j = 0; j < this.populationFeaturesSize; j++){
				shape.push( Math.random() < 0.5 ? 1 : 0 );
			}
			this.population.push( new Invader( w/4/2 ,Math.random()*-20, shape) );
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
		let child = new Invader(x,Math.random()*-20,a.shape.slice());
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
