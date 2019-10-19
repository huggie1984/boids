function boidData(radius,mass,color,id){
	if(typeof(radius)==='undefined') radius = 20;
	if(typeof(color)==='undefined') color = '#0000ff';
	if(typeof(mass)==='undefined') mass = 1;
	this.radius = radius;
	this.mass = mass;
	this.color = color;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
	this.id = id;
}		
boidData.prototype = {
	get pos2D (){
		return new Vector2D(this.x,this.y);			
	},
	set pos2D (pos){
		this.x = pos.x;
		this.y = pos.y;
	},
	get velo2D (){
		return new Vector2D(this.vx,this.vy);			
	},
	set velo2D (velo){
		this.vx = velo.x;
		this.vy = velo.y;
	},
	draw: function (context) {  
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
		context.closePath();
		context.fill();		
	},
	limit: function(){
		var vlim = 5;
		var velx = this.vx;
		var vely = this.vy;
		var v = Math.sqrt(Math.pow(velx, 2) + Math.pow(vely, 2));
		if (v > vlim) {
			this.vx = (this.vx / v) * vlim;
			this.vy = (this.vy / v) * vlim;
		}
	},
	stayInBounds: function(canvas){
		if (this.x < 0)  this.vx = -this.vx;
		if (this.x > canvas.width) this.vx = -this.vx;
		if (this.y < 0) this.vy = -this.vy;
		if (this.y > canvas.height) this.vy = -this.vy;	
	},
	wonder: function(b){
		b.vx += (Math.random()-0.5)*0.5;
		b.vy += (Math.random()-0.5)*0.5;	
	},
	cohesian: function(){
		var flock = new Vector2D(0,0);
		var count = 0;
		for(var i=0; i< boids.length; i++){

				flock.x += boids[i].x;//get local positions
				flock.y += boids[i].y;
		}
		flock.x /= (boids.length);//averageing the position
		flock.y /= (boids.length);
		return new Vector2D((flock.x -this.x)/100,(flock.y - this.y)/100);
	},
	separation: function(){
		var aviod = new Vector2D(0,0);
		for(var i=0; i< boids.length; i++){
			var dx = boids[i].x - this.x;
			var dy = boids[i].y - this.y;
			var dist = Math.sqrt(dx*dx+dy*dy);
			var neighbourhood = this.radius+boids[i].radius;
			if (dist>0 && dist<Math.PI*this.radius*2){
			aviod.x -= (boids[i].x - this.x);
			aviod.y -= (boids[i].y - this.y);
			aviod.normalize();
		}
		}
		return aviod;
	},
	align: function(){
		var flock_velocity = new Vector2D(0,0);
		var count = 0;
		for (var i = 0; i < boids.length; i++) {
		var dx = boids[i].x - this.x;
		var dy = boids[i].y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);
		if((dist>0)&& (dist < (Math.PI*this.radius)*4)){		
				count ++;
				flock_velocity.x += boids[i].vx;
				flock_velocity.y += boids[i].vy;
		}
		}
		if(count > 0){
		flock_velocity.x /= (boids.length);
		flock_velocity.y /= (boids.length);
		flock_velocity.normalize();
		}
		return new Vector2D((flock_velocity.x),(flock_velocity.y));
	},
	obsAviodance: function(){
		var aviod = new Vector2D(0,0);
		for(var i=0; i< obsticles.length; i++){
			var dx = obsticles[i].x - this.x;
			var dy = obsticles[i].y - this.y;
			var dist = Math.sqrt(dx*dx+dy*dy);
			var neighbourhood = this.radius+obsticles[i].radius;
			if (dist>0 && dist<Math.PI*this.radius*4){
			aviod.x -= (obsticles[i].x - this.x);
			aviod.y -= (obsticles[i].y - this.y);
			aviod.normalize();
		}
		}
		return aviod;
	},
};