draw.type = "dot";

function $(s){
	return document.querySelectorAll(s);
}

var size = 128;

var box = $('.right')[0];
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var line;
var height,width;
var Dots = [];
var list = $("#list li");

var mv = new Musicvisualizer({
	size:size,
	draw:draw
});


function getRandom(m,n){
	return Math.round(Math.random()*(n-m)+m);
}

var vol = 60;
vol.onchange = function(){
	mv.changeVolumn(this.value/this.max);
}

mv.changeVolumn(0.6);
var timer=0;
function draw(arr){
	
}

/*
	setTimeout(function () {

		StageHeight=rectHeight;
		alert(StageHeight);
	
	},10000)*/


	