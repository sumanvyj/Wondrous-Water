var myCanvas;
var fish = new Array();
var fishSpeeds = new Array();
var numFish = 10;
var fishLoc = new Array();
var fishLoc2 = new Array();
var scoobaLoc = 0;
var scooba;
drawWater();
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
	//setInterval(updateFish,1000/10);

	scooba = document.createElement("img");
	scooba.src = "http://www.cs.washington.edu/homes/eastebry/hack/sub.png";
	scooba.style.position = "fixed";
	scooba.zIndex = 250;
	scooba.setAttribute("class","sub");
	scooba.setAttribute("speed", 3);
	scooba.style.bottom = Math.random()*(myCanvas.height-100) + 50 + "px";
	fishDiv.appendChild(scooba);
}
	

function updateFish(){
	var allFish = document.getElementsByClassName("fish_right");
	for(var i = 0; i<allFish.length; i++){
		allFish[i].style.position = "fixed";
		fishLoc[i] += parseInt(allFish[i].getAttribute("speed"));
		if(fishLoc[i]>myCanvas.width + 300)
			fishLoc[i] = 0 - Math.random()*200 - 100;
		allFish[i].style.left = fishLoc[i] + "px";
	}
	allFish = document.getElementsByClassName("fish_left");
	for(var i = 0; i<allFish.length; i++){
		allFish[i].style.position = "fixed";
		fishLoc2[i] -= parseInt(allFish[i].getAttribute("speed"));
		if(fishLoc2[i]<-300)
			fishLoc2[i] =  myCanvas.width + Math.random()*200 + 100;
		allFish[i].style.left = fishLoc2[i] + "px";	
	}

	if (typeof scooba !== "undefined")
	{
		scooba.style.position = "fixed";
		scoobaLoc -= parseInt(scooba.getAttribute("speed"));
		if(scoobaLoc<-1000)
			scoobaLoc =  myCanvas.width + Math.random()*200 + 1000;
		scooba.style.left = scoobaLoc + "px";	
	}
}

