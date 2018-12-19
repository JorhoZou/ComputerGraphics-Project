$(function() {
	$("#add")[0].onclick = function(){
		$("#loadfile")[0].click();
	}
	
	var MusicLoaded = 0;
	$("#loadfile")[0].onchange = function(){
		var file = this.files[0];
	
		var fr = new FileReader();
		alert("Start Game"); //确认开始
    
		fr.onload = function(e){//加载音乐
			mv.play(e.target.result);
		}
		fr.readAsArrayBuffer(file);//读文件
		draw.type = "column";
		WINDOW.Initialize();
		GAME.Initialize( 'canvas-3d' );
		DISPLAY.Resize( WINDOW.ms_Width, WINDOW.ms_Height );
		MainLoop();
	}
	
} );

function MainLoop()
{
	requestAnimationFrame( MainLoop );
	GAME.Update();
}




