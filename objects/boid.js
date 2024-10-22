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
		if (this.x < 50)  this.vx = -this.vx;
		if (this.x > (canvas.width -50)) this.vx = -this.vx;
		if (this.y < 50) this.vy = -this.vy;
		if (this.y > (canvas.height -50)) this.vy = -this.vy;
	},
	wonder: function(b){
		b.vx += (Math.random()-0.5)*0.5;
		b.vy += (Math.random()-0.5)*0.5;	
	},
	cohesian: function(){
		var flock = new Vector2D(0, 0);

		// Average positions of all boids
		for (var i = 0; i < boids.length; i++) {
			flock.x += boids[i].x;
			flock.y += boids[i].y;
		}
		flock.x /= boids.length;
		flock.y /= boids.length;

		// Ensure cohesion doesn't pull boids outside the boundary
		var margin = 100; // Adjust margin as needed
		flock.x = Math.max(margin, Math.min(flock.x, canvas.width - margin));
		flock.y = Math.max(margin, Math.min(flock.y, canvas.height - margin));

		return new Vector2D((flock.x - this.x) / 100, (flock.y - this.y) / 100);
	},
	separation: function(){
		var avoid = new Vector2D(0, 0);
		var margin = 100; // Define a margin for boundary avoidance
		var boundaryForce = 0.1; // Adjust force applied when near boundary
		// Avoid other boids
		for (var i = 0; i < boids.length; i++) {
			var dx = boids[i].x - this.x;
			var dy = boids[i].y - this.y;
			var dist = Math.sqrt(dx * dx + dy * dy);
			var neighborhood = this.radius + boids[i].radius;
			if (dist > 0 && dist < neighborhood * 2) {
				avoid.x -= (boids[i].x - this.x);
				avoid.y -= (boids[i].y - this.y);
				avoid.normalize();
			}
		}
		if (this.x < margin) {
			avoid.x += boundaryForce;
		}
		if (this.x > canvas.width - margin) {
			avoid.x -= boundaryForce;
		}
		if (this.y < margin) {
			avoid.y += boundaryForce;
		}
		if (this.y > canvas.height - margin) {
			avoid.y -= boundaryForce;
		}
		return avoid;
	},
	align: function(){
		var flock_velocity = new Vector2D(0, 0);
		var count = 0;
		var neighborhoodRadius = 100; // Define a neighborhood radius for alignment

		for (var i = 0; i < boids.length; i++) {
			var dx = boids[i].x - this.x;
			var dy = boids[i].y - this.y;
			var dist = Math.sqrt(dx * dx + dy * dy);

			if (dist > 0 && dist < neighborhoodRadius) {  // Only include nearby boids
				flock_velocity.x += boids[i].vx; // Accumulate velocity
				flock_velocity.y += boids[i].vy;
				count++;
			}
		}

		if (count > 0) {
			flock_velocity.x /= count; // Averaging velocity
			flock_velocity.y /= count;

			flock_velocity.normalize(); // Normalize the result
		}

		return new Vector2D(flock_velocity.x, flock_velocity.y);
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
