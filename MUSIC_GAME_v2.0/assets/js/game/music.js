draw.type = "dot";//默认显示效果类型

function $(s){
	return document.querySelectorAll(s);
}

var size = 128;//定义的音频数组长度

var box = $('.right')[0];
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var line;//渐变色变量
//box.appendChild(canvas);
var height,width;
var Dots = [];//用于存放点对象数组,点的坐标和颜色信息
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

mv.changeVolumn(0.6);//初始化音频大小
var timer=0;
function draw(arr){
	
}

/*
	setTimeout(function () {

		StageHeight=rectHeight;
		alert(StageHeight);
	
	},10000)*/


	