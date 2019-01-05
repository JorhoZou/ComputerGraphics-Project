$(function() {
	$("#add")[0].onclick = function(){
		$("#loadfile")[0].click();
	}
	
	var MusicLoaded = 0;
	$("#loadfile")[0].onchange = function(){
		var file = this.files[0];
	
		var fr = new FileReader();
		//alert(" Start Game"); 
		fr.onload = function(e){
			mv.play(e.target.result);
		}
		fr.readAsArrayBuffer(file);
		draw.type = "column";
		WINDOW.Initialize();
		GAME.Initialize( 'canvas-3d' );
		DISPLAY.Resize( WINDOW.ms_Width, WINDOW.ms_Height );
		MainLoop();d
		
	}

	
	
} );

function MainLoop()
{
	requestAnimationFrame( MainLoop );
	GAME.Update();
}




