// globalsssss
var scene;
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

var hackLoaded = true;
var domCopy = document.body.cloneNode(true);

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

	pushWater(xx, yy, -2);

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
		if (Math.floor(Math.random()*11) == 0)
		{
			//pushWater(5+Math.floor(Math.random()*85),5+Math.floor(Math.random()*85),-0.35);
		}
	}

	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.015;
}

function resizeWindow()
{
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	camera.aspect = WIDTH / HEIGHT;
	// TODO camera.view_angle = math;
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
	for (var i = -20; i <= 20; ++i)
		for (var j = -20; j <= 20; ++j)
	{
		if ((x+i) < 0 || (x+i) >= DETAIL || (y+j) < 0 || (y+j) >= DETAIL) continue;
		var dist_sq = Math.max((i * i + j * j) / 1.2, 1.0);
		if (i == 0 && j == 0)
			this_frame[(x+i) + DETAIL * (y+j)] += power;
		else
			this_frame[(x+i) + DETAIL * (y+j)] += power / dist_sq;
	}
}

function init()
{

	// set the scene size
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	//var WIDTH = 400, HEIGHT = 300;

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
	music.src = 'http://rileya.com/hackity/music.mp3';
	container.appendChild(music);
	music.play();

	//console.log("Setup stuffs");

	// create a WebGL renderer, camera and a scene
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColorHex(0x000000, 0);

	camera = new THREE.OrthographicCamera( 
		35 / - 2,  35/ 2, 35 / 2, 35 / - 2, 1, 1000 );
	//camera = new THREE.PerspectiveCamera(
	//	VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// the camera starts at 0,0,0
	// so pull it back
	camera.position.z = 500;
	camera.lookAt(new THREE.Vector3(0, 0, -1))
	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);
	resizeWindow();

	// attach the render-supplied DOM element
	container.appendChild(renderer.domElement);

	//console.log("Setup GL stuffs");

	//var geometry = new THREE.CubeGeometry( 50, 50, 50 );
	geometry = new THREE.PlaneGeometry( 40, 40, DETAIL - 1, DETAIL - 1 );
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	geometry.dynamic = true;

	//var r = "http://mrdoob.github.com/three.js/examples/textures/cube/Escher/";
	//var r = "http://alteredqualia.com/tmp/three/examples/textures/cube/Park3/";
	//var urls = [ r + "px.jpg", r + "nx.jpg",
	//			 r + "py.jpg", r + "ny.jpg",
	//			 r + "pz.jpg", r + "nz.jpg" ];
	//var images = THREE.ImageUtils.loadTextureCube( urls );
					
	//material = new THREE.MeshBasicMaterial( { color: 0xccddff, env_map: images, refraction_ratio: 0.98, reflectivity:0.9 } );

	//var textureCube = THREE.ImageUtils.loadTextureCube( urls );
	//material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, wireframe : false } )
	//var geometry = new THREE.SphereGeometry( 100, 96, 64 );

	attributes = 
	{
		//displacement: {	type: 'f', value: [] }
	};

	uniforms = 
	{
		amplitude: { type: "f", value: 1.0 },
		//refl: {type: "t", value: 1, texture: images}
		//color:     { type: "c", value: new THREE.Color( 0xff2200 ) },
	};

	/*var vertices = geometry.vertices;
	var values = attributes.displacement.value;

	for( var v = 0; v < vertices.length; v++ ) {
		values[v] = 0;
	}*/

	/*for (var i = 0; i < geometry.vertices.length; ++i)
	{
		var val = 0.25 + Math.random()*0.95;
		next_frame[i] = val;
		this_frame[i] = val;
		prev_frame[i] = 0.0;
		geometry.vertices[i].y = val;
	}*/

	/*next_frame[935] = 5.0;
	this_frame[935] = 5.0;
	prev_frame[935] = 5.0;
	geometry.vertices[935].y = 5.0;*/
	//pushWater(50,50,3.9);

	//var image = document.createElement( 'img' );
	//image.src = "http://www.filterforge.com/filters/750.jpg";

	//var texture = new THREE.Texture( image );
	//texture.needsUpdate = true;

	/*material = new THREE.MeshBasicMaterial
	({
		color: 0xff0000,
		opacity: 0.5,
		wireframe: true
		//map : texture
	});*/

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

	setInterval(update, 1000/30);
	//console.log("Setup GL stuffs " +  mesh.geometry.vertices.length);

	window.onmousemove = onDocumentMouseMove;
	window.onclick = onClick;
}

function main() 
{
	init();
}


main();

var myCanvas;
var fish = new Array();
var fishSpeeds = new Array();
var numFish = 10;
var fishLoc = new Array();
var fishLoc2 = new Array();
drawWater();
//animate();
function drawWater(){

	document.body.style.background = "#00CCFF";
	var canvasContainer = document.createElement('div');
	document.body.appendChild(canvasContainer);
	canvasContainer.style.position="fixed";
	canvasContainer.style.left="0px";
	canvasContainer.style.top="0px";
	canvasContainer.style.width="100%";
	canvasContainer.style.height="100%";
	canvasContainer.style.zIndex="100";
	myCanvas = document.createElement('canvas');
	myCanvas.style.width = canvasContainer.scrollWidth+"px";
	myCanvas.style.height = canvasContainer.scrollHeight+"px";
	myCanvas.globalAlpha = .5;
	myCanvas.width=canvasContainer.scrollWidth;
	myCanvas.height=canvasContainer.scrollHeight;
	myCanvas.style.overflow = 'visible';
	myCanvas.style.position = 'absolute';

	canvasContainer.appendChild(myCanvas);

	var context = myCanvas.getContext('2d');
	
	
	var lingrad = context.createLinearGradient(0,myCanvas.height,0,0);
	//lingrad.addColorStop(0, '#00ABEB');
	lingrad.addColorStop(1, "transparent");
	lingrad.addColorStop(0,"#00CCFF");
	context.fillStyle = lingrad;
//	myCanvas.fillStyle = "rgba(0, 204, 255, 0.5)";
	context.fillRect(0,0,myCanvas.width,myCanvas.height);

		
	var bg =  document.createElement("img");
	bg.src = "http://www.cs.washington.edu/homes/eastebry/hack/floor.png";
	bg.style.position="fixed";
	bg.style.bottom = 0;
	bg.style.left = 0;
	bg.style.zIndex="200";	
	document.body.appendChild(bg);
	
	var img0 = document.createElement("img");
	img0.src ="http://www.cs.washington.edu/homes/eastebry/hack/coral.png";
	img0.style.position = "fixed";
	img0.style.bottom=0;
	img0.style.left=0;
	img0.style.zIndex = "300";
	document.body.appendChild(img0);	
	
	var img1 = document.createElement("img");
	img1.src ="http://www.cs.washington.edu/homes/eastebry/hack/side2.png";
	img1.style.position = "fixed";
	img1.style.bottom= 70;
	img1.style.left=400;
	img1.style.zIndex = "300";
	document.body.appendChild(img1);	
	
	var img = document.createElement("img");
	img.src ="http://www.cs.washington.edu/homes/eastebry/hack/side.png";
	img.style.position = "fixed";
	img.style.bottom= 0;
	img.style.right=0;
	img.style.zIndex = "300";
	document.body.appendChild(img);

	makeFish();
}

function makeFish(){
	var fish = new Array("http://www.cs.washington.edu/homes/eastebry/hack/fish_R_1.gif","http://www.cs.washington.edu/homes/eastebry/hack/fish_R_2.gif");
	var fishDiv = document.createElement('div');
	document.body.appendChild(fishDiv);
	for(var i = 0; i < numFish; i++){
		var newFish = document.createElement("img");
		newFish.src = fish[Math.floor(Math.random()*fish.length)];
		newFish.style.position = "fixed";
		newFish.zIndex = 250;
		newFish.setAttribute("class","fish_right");
		newFish.setAttribute("speed",Math.floor(Math.random()*3)+1);
		newFish.style.bottom = Math.random()*(myCanvas.height-100) + 50 + "px";
		fishDiv.appendChild(newFish);	
		fishLoc[i] = 0 - Math.random()*500;	
	}
	fish = new Array("http://www.cs.washington.edu/homes/eastebry/hack/angelfish.gif","http://www.cs.washington.edu/homes/eastebry/hack/Fish2.gif","http://www.cs.washington.edu/homes/eastebry/hack/4.gif");
	for(var j = 0; j< numFish; j++){
		var newFish = document.createElement("img");
		newFish.src = fish[Math.floor(Math.random()*fish.length)];
		newFish.style.position = "fixed";
		newFish.zIndex = 250;
		newFish.setAttribute("class","fish_left");
		newFish.setAttribute("speed",Math.floor(Math.random()*3)+1);
		newFish.style.bottom = Math.random()*(myCanvas.height-100) + 50 + "px";
		fishDiv.appendChild(newFish);	
		fishLoc2[j] = myCanvas.width + Math.random()*500;	
	}
	setInterval(updateFish,1000/10);
}
	

function updateFish(){
	var allFish = document.getElementsByClassName("fish_right");
	for(var i = 0; i<allFish.length; i++){
		allFish[i].style.position = "fixed";
		fishLoc[i] += parseInt(allFish[i].getAttribute("speed"));
		if(fishLoc[i]>myCanvas.width + 300)
			fishLoc[i] = 0 - Math.random()*200 - 100;
		allFish[i].style.left = fishLoc[i] + "px";
		console.log("POS: " + allFish[i].style.left + " " + 
			fishLoc[i]);
	}
	allFish = document.getElementsByClassName("fish_left");
	for(var i = 0; i<allFish.length; i++){
		allFish[i].style.position = "fixed";
		fishLoc2[i] -= parseInt(allFish[i].getAttribute("speed"));
		if(fishLoc2[i]<-300)
			fishLoc2[i] =  myCanvas.width + Math.random()*200 + 100;
		allFish[i].style.left = fishLoc2[i] + "px";	
	}
}
