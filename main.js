var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var boids = [];
var obsticles = [];
var t0,dt;
var screen_width;
var screen_height;
var maxVelo = new Vector2D(5,5);

var numObsticles = 5;
var boidRange = document.getElementById("boidcount").value;
var obRange = document.getElementById("obcount").value;
var sepBox = document.getElementById("seperation");
var cohBox = document.getElementById("cohesian");
var alignBox = document.getElementById("alignment");
window.onload = init; 

function init() {
	screen_width = canvas.width = window.innerWidth;
	screen_height = canvas.height = window.innerHeight;
	for(var i=0; i<80; i++){
	boids[i] = new boidData(5,0,'#ffffff',i);
	boids[i].pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
	boids[i].velo2D = new Vector2D((Math.random()-0.5)*1.5,(Math.random()-0.5)*1.5);
	}
	for(var j=0; j<numObsticles; j++){
	obsticles[j] = new boidData(25,0,'#fd101f',i);
	obsticles[j].pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
	}
	t0 = new Date().getTime(); 
	animFrame();
}
function animFrame(){
	animId = requestAnimationFrame(animFrame,canvas);
	onTimer(); 
}
function onTimer(){
	var t1 = new Date().getTime(); 
	dt = 0.001*(t1-t0); 
	t0 = t1;	
	if (dt>0.1) {dt=0;};
	moveObject();
}
function moveObject(){
	for(var i=0;i<boids.length;i++){
	var coh = boids[i].cohesian();
	var sep = boids[i].separation();
	var align = boids[i].align();
	var obAviod = boids[i].obsAviodance();
	boids[i].velo2D = boids[i].velo2D.add(obAviod);
	boids[i].pos2D = boids[i].pos2D.add(boids[i].velo2D);
	boids[i].stayInBounds(canvas);
	boids[i].wonder(boids[i]);
	enableBehaviour(sepBox,sep,boids[i]);
	enableBehaviour(cohBox,coh,boids[i]);
	enableBehaviour(alignBox,align,boids[i]);
	boids[i].limit();
	}
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0;i<boids.length;i++){
		boids[i].draw(context);
	}
	for(var j=0; j<obsticles.length;j++){
			obsticles[j].draw(context);
	}
}
function enableBehaviour(ele,type,boid){
	if(ele.checked){
		boid.velo2D = boid.velo2D.add(type);
	}
}