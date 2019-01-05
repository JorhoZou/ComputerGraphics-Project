var file = null;
var fr = null;
$(function() {
	StartGame2();
	$("#add")[0].onclick = function(){
		$("#loadfile")[0].click();
	}
	var MusicLoaded = 0;
	$("#loadfile")[0].onchange = function(){
		file = this.files[0];
		fr = new FileReader();
		alert(" Start Game"); 
		
		fr.onload = function(e){
			mv.play(e.target.result);
		}
		fr.readAsArrayBuffer(file);
		MyStart();
	}

	
	
} );

function MainLoop()
{
	requestAnimationFrame( MainLoop );
	GAME.Update();
}
function MyStart()
{
	document.getElementById("start-game").style.display = "none";
	document.getElementById("select-music").style.display = "none";
	WINDOW.Initialize();
	GAME.Initialize( 'canvas-3d', 0);
	
	DISPLAY.Resize( WINDOW.ms_Width, WINDOW.ms_Height );
	
	MainLoop();
}



