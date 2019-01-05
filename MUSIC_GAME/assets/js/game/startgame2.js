function StartGame2()
{
    WINDOW.Initialize();
	GAME.Initialize( 'canvas-start', 1);
	DISPLAY.Resize( WINDOW.ms_Width, WINDOW.ms_Height );
	//SelectPlayer();
	MainLoop();
}
function SelectPlayer(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 5);　　//相机位置设置
    var renderer = new THREE.WebGLRenderer();
    var div = document.getElementById('canvas-player-1');
    renderer.setSize( 400, 300 );
    document.getElementById('canvas-player-1').appendChild( renderer.domElement );
    var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 2, 3),　　//创建网格，参数一：几何体（立方体）

                        new THREE.MeshBasicMaterial({　　//参数二：材质（网格基础材质）

                            color: 0xff0000　　//设置颜色

                        })

                );

                scene.add(cube);　
                renderer.render(scene, camera);
}
function CheckGameFinished()
{
    var aData = {};
		
	GAME.B2DReadObject( aData, PLAYER.ms_B2DBody );
	//lzw added for detecting game over or finished
	console.log("x" + aData.x);
	console.log("y"+ aData.y);
	if(aData.x > 10.0 && aData.y < 0.076)
	{
		alert("game over!");
		WINDOW.Initialize();
	    GAME.Initialize( 'canvas-3d', 0);
	
	    DISPLAY.Resize( WINDOW.ms_Width, WINDOW.ms_Height );
	}
	if(aData.x > 50)
	{
		alert("finished!\n");
		WINDOW.Initialize();
	    GAME.Initialize( 'canvas-3d', 0);
	
	    DISPLAY.Resize( WINDOW.ms_Width, WINDOW.ms_Height );
	}
}