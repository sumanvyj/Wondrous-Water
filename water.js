// icky globals
var scene;
var isRain = false;
var camera;
var renderer;
var mesh;
var geometry;
var attributes;
var uniforms;
var material;
var projector = new THREE.Projector;
var delay = 10;
var DETAIL = 128;
var prev_frame = new Float32Array(DETAIL * DETAIL);
var this_frame = new Float32Array(DETAIL * DETAIL);
var next_frame = new Float32Array(DETAIL * DETAIL);

// shaders
var vertMain = "uniform float amplitude; varying vec4 norm; varying vec3 pos;  void main()  { 	norm = vec4(normal,1.0); 	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1); 	pos = position; } ";
var fragMain = "varying vec4 norm; varying vec3 pos;  void main()  { 	vec3 col = vec3(0.2, -pos.y / 20.0,0.8) * (0.05+0.9* 			clamp(dot(norm.xyz, vec3(0,1,0)),0.0,1.0)); 	gl_FragColor = vec4(col, 0.6  + clamp(pos.y / 75.0, -0.4, 0.0) +  		clamp(1.0-dot(norm.xyz, vec3(0,1,0)),0.0,1.0)/3.0);   	/*vec3 wPos = cameraPosition - vViewPosition; 	gl_FragColor = textureCube( refl, wPos);*/ } ";

var C = 0.9;
var D = 0.4;
var U = 0.07;
var T = 0.13;

var TERM1 = ( 4.0 - 8.0*C*C*T*T/(D*D) ) / (U*T+2) ;
var TERM2 = ( U*T-2.0 ) / (U*T+2.0) ;
var TERM3 = ( 2.0 * C*C*T*T/(D*D) ) / (U*T+2) ;

function onDocumentMouseMove(event) 
{
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	var vec = new THREE.Vector3((event.clientX)/WIDTH, (event.clientY)/HEIGHT, 35);
	var xx, yy;
	
	if (WIDTH >= HEIGHT)
	{
		xx = Math.round(vec.x * DETAIL);
		var offset = HEIGHT/WIDTH;
		yy = Math.round(vec.y * (DETAIL) * offset + (1-offset)/2*DETAIL);
	}
	else
	{
		var offset = WIDTH/HEIGHT;
		xx = Math.round(vec.x * (DETAIL) * offset + (1-offset)/2*DETAIL);
		yy = Math.round(vec.y * DETAIL);
	}

	pushWater(xx, yy, -0.07);
}

function onClick(event)
{
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	var vec = new THREE.Vector3((event.clientX)/WIDTH, (event.clientY)/HEIGHT, 35);
	
	var xx, yy;
	
	if (WIDTH >= HEIGHT)
	{
		xx = Math.round(vec.x * DETAIL);
		var offset = HEIGHT/WIDTH;
		yy = Math.round(vec.y * (DETAIL) * offset + (1-offset)/2*DETAIL);
	}
	else
	{
		var offset = WIDTH/HEIGHT;
		xx = Math.round(vec.x * (DETAIL) * offset + (1-offset)/2*DETAIL);
		yy = Math.round(vec.y * DETAIL);
	}

	pushWater(xx, yy, -1.5);
}

function update() 
{
	renderer.render(scene, camera);
	delay--;
	if (delay == 0 && !mesh.geometry.__dirtyVertices)
	{
		delay = 2;
		var verts = mesh.geometry.vertices;

		for (var i = 1; i < DETAIL-1; ++i)
			for (var j = 1; j < DETAIL-1; ++j)
		{
			var index = i + j * DETAIL;
			verts[index].y = 
				(TERM1 * this_frame[index]) + 
				(TERM2 * prev_frame[index]) + 
				(TERM3 * (this_frame[index+1] + this_frame[index-1] 
				+ this_frame[index+DETAIL] + this_frame[index-DETAIL]));
			next_frame[index] = verts[index].y;
		}

		var temp = prev_frame;
		prev_frame = this_frame;
		this_frame = next_frame;
		next_frame = temp;
		mesh.geometry.verticesNeedUpdate = true;
		mesh.geometry.computeFaceNormals();
		mesh.geometry.computeVertexNormals();
		mesh.geometry.normalsNeedUpdate = true;
		
		// rain
		if (isRain && Math.floor(Math.random()*5) == 0)
		{
			pushWater(5+Math.floor(Math.random()*85),5+Math.floor(
				Math.random()*85),-0.5);
		}
	}
}

function resizeWindow()
{
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	camera.aspect = WIDTH / HEIGHT;
	if (WIDTH >= HEIGHT)
	{
		camera.left = -20;
		camera.right = 20;
		camera.top = 20 * HEIGHT/WIDTH;
		camera.bottom = -20 * HEIGHT/WIDTH;
	}
	else 
	{
		camera.left = -20 * WIDTH/HEIGHT;
		camera.right = 20 * WIDTH/HEIGHT;
		camera.top = 20;
		camera.bottom = -20;
	}
	camera.updateProjectionMatrix();
	renderer.setSize(WIDTH, HEIGHT);
}

function pushWater(x, y, power)
{
	for (var i = -10; i <= 10; ++i)
		for (var j = -10; j <= 10; ++j)
	{
		if ((x+i) < 0 || (x+i) >= DETAIL || (y+j) < 0 || (y+j) >= DETAIL) continue;
		var dist_sq = Math.max((i * i + j * j) / 1.2, 1.0);
		if (i == 0 && j == 0)
			this_frame[(x+i) + DETAIL * (y+j)] += power;
		else
			this_frame[(x+i) + DETAIL * (y+j)] += power / dist_sq;
	}
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

function init()
{
	$(document).bind("keypress", function(e){
		switch (e.which) {
			case 114:
				isRain = !isRain;
				break;
		}      
	});

	swayUR(); 
	
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	window.onresize = resizeWindow;
	
	// set some camera attributes
	var VIEW_ANGLE = 90, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

	var container = document.createElement('div');
	container.style.height = HEIGHT + "px";
	container.style.width = WIDTH + "px";
	container.style.left = 0 + "px";
	container.style.top = 0 + "px";
	container.style.position = "fixed";
	container.style.zIndex = 1000;
	document.body.appendChild(container);

	var music = document.createElement("audio");
	music.loop = 'loop';
	music.src = 'http://s3.amazonaws.com/sumanvyj-uw-mr/music.mp3';
	container.appendChild(music);
	music.play();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColorHex(0x000000, 0);

	camera = new THREE.OrthographicCamera( 
		35 / - 2,  35/ 2, 35 / 2, 35 / - 2, 1, 1000 );
	
	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// the camera starts at 0,0,0
	// so pull it back
	camera.position.z = 500;
	camera.lookAt(new THREE.Vector3(0, 0, -1))

	renderer.setSize(WIDTH, HEIGHT);
	resizeWindow();
	container.appendChild(renderer.domElement);

	geometry = new THREE.PlaneGeometry( 40, 40, DETAIL - 1, DETAIL - 1 );
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	geometry.dynamic = true;

	attributes = {};
	uniforms = {};

	material = new THREE.ShaderMaterial
	({
		uniforms: 		uniforms,
		attributes:     attributes,
		vertexShader:   vertMain,
		fragmentShader: fragMain
	});

	mesh = new THREE.Mesh( geometry, material);
	mesh.geometry.dynamic = true;
	mesh.rotation.x = Math.PI / 2;
	scene.add( mesh );

	(function animloop(){
	  requestAnimFrame(animloop);
	  update();
	  updateFish();
	  updateTrans();
	})();

	window.onmousemove = onDocumentMouseMove;
	window.onclick = onClick;
}

function main() 
{
	init();
}

main();
