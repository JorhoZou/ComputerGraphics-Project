var DISPLAY =
{
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	ms_Controls: null,
	ms_Terrain: null,
	ms_Light: null,
	ms_CloseLight: null,
	ms_Animals: null,
	
	ms_Player: null,
	
	Enable: ( function() 
	{
        try 
		{
			var aCanvas = document.createElement( 'canvas' ); 
			return !! window.WebGLRenderingContext && ( aCanvas.getContext( 'webgl' ) || aCanvas.getContext( 'experimental-webgl' ) ); 
		} 
		catch( e ) { return false; } 
	} )(),
	
	Initialize: function( inIdCanvas )
	{
		this.ms_Clock = new THREE.Clock();
		this.ms_Canvas = $( '#'+inIdCanvas );
		
		// Initialize Renderer, Camera and Scene
		this.ms_Renderer = this.Enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		this.ms_Canvas.html( this.ms_Renderer.domElement );
		this.ms_Scene = new THREE.Scene();
		
		this.ms_Camera = new THREE.PerspectiveCamera( 55.0, Window.ms_Width / Window.ms_Height, 0.01, 20000 );
		this.ms_Camera.position.set( 13, 1.5, 6 );
		// Initialize Orbit control		
		this.ms_Controls = new THREE.OrbitControls( this.ms_Camera, this.ms_Renderer.domElement );
		this.ms_Controls.userPanSpeed = 2.5;
		this.ms_Controls.maxPolarAngle = Math.PI * 0.51;
		this.ms_Controls.maxDistance = 100.0;
	
		// Add lights with shadows
		this.ms_Renderer.shadowMapEnabled = true;
		this.ms_Renderer.shadowMapType = THREE.PCFSoftShadowMap;
		
		this.ms_Light = new THREE.DirectionalLight( 0xffddaa, 1 );
		this.ms_Light.castShadow = true;
		this.ms_Light.position.set( -1100, 800, -250 );
		this.ms_Light.shadowCameraNear = 1150;
		this.ms_Light.shadowCameraFar = 1370;
		this.ms_Light.shadowCameraLeft = -200;
		this.ms_Light.shadowCameraRight = 200;
		this.ms_Light.shadowCameraTop = 200;
		this.ms_Light.shadowCameraBottom = -200;
		this.ms_Light.shadowMapWidth = 512;
		this.ms_Light.shadowMapHeight = 512;
		this.ms_Light.shadowBias = -0.0018;
		this.ms_Light.shadowDarkness = 0.7;
		
		this.ms_CloseLight = new THREE.DirectionalLight( 0xffffff, 0 );
		this.ms_CloseLight.castShadow = true;
		this.ms_CloseLight.onlyShadow = true;
		this.ms_CloseLight.shadowCameraNear = 1;
		this.ms_CloseLight.shadowCameraFar = 40;
		this.ms_CloseLight.shadowCameraLeft = -20;
		this.ms_CloseLight.shadowCameraRight = 20;
		this.ms_CloseLight.shadowCameraTop = 20;
		this.ms_CloseLight.shadowCameraBottom = -20;
		this.ms_CloseLight.shadowMapWidth = 512;
		this.ms_CloseLight.shadowMapHeight = 512;
		this.ms_CloseLight.shadowDarkness = 0.7;
		this.ms_CloseLight.shadowBias = -0.0004;
		this.ms_CloseLight.position.set( -22, 20, -13 );
		
		this.ms_Scene.add( new THREE.AmbientLight( 0x404040 ) );
		
		// Add skybox
		var aSkyDome = new THREE.Mesh(
			new THREE.SphereGeometry( 10000, 15, 15 ),
			new THREE.MeshBasicMaterial( {
				map: THREE.ImageUtils.loadTexture( "assets/img/skydome.jpg" ),
				color: 0xffffff,
				side: THREE.DoubleSide
			} )
		);
		aSkyDome.rotation.y = Math.PI;
		this.ms_Scene.add( aSkyDome );

		this.LoadTerrain();
		this.GenerateAnimals();		
	},
	
	LoadTerrain: function()
	{
		var planeGeometry = new THREE.PlaneGeometry(GAME.ms_Parameters.width, GAME.ms_Parameters.height, GAME.ms_Parameters.widthSegments, GAME.ms_Parameters.heightSegments);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        this.ms_Terrain = new THREE.Mesh(planeGeometry, planeMaterial);
		this.ms_Terrain.rotation.set(-0.5*Math.PI, 0, 0);
		this.ms_Terrain.position.set(0,15,0);
		this.ms_Scene.add( this.ms_Terrain );
		this.ms_Terrain.receiveShadow = true;
		this.ms_Terrain.castShadow = false;
	},

	LoadAnimals: function( inType )
	{
		MESHES.Load( inType, function( inGeometry ) {
			for( var i = 0; i < 100; ++i )
			{
				var x = ( 0.1 + Math.random() * 0.9 ) * GAME.ms_Parameters.widthSegments/2 - GAME.ms_Parameters.widthSegments/8;
				var z = ( 0.005 + Math.random() * 0.99 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments/2;
				var y = 15;
	
				var mesh = MESHES.AddMorph( inGeometry );
				mesh.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				mesh.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				mesh.rotation.set( 0, Math.random() * Math.PI * 2, 0 );
				
				mesh.position.y = y;
				mesh.scale.set( 0.03, 0.03, 0.03 );
				mesh.castShadow = true;
				mesh.receiveShadow = false;
					
				DISPLAY.ms_Animals.add( mesh );
			}
		} );
	},
	
	GenerateAnimals: function()
	{
		this.ms_Animals = new THREE.Object3D();
		this.ms_Scene.add( this.ms_Animals );
		this.LoadAnimals( MESHES.Type.Cow );
		this.LoadAnimals( MESHES.Type.Deer );
		this.LoadAnimals( MESHES.Type.Goat );
	},
	
	Display: function()
	{
		this.ms_Renderer.render( this.ms_Scene, this.ms_Camera );
	},
	
	Update: function( inUpdate )
	{		
		MESHES.Update( inUpdate );
		
		this.ms_Controls.update();
		this.Display();
	},
	
	Resize: function( inWidth, inHeight )
	{
		this.ms_Camera.aspect =  inWidth / inHeight;
		this.ms_Camera.updateProjectionMatrix();
		this.ms_Renderer.setSize( inWidth, inHeight );
		this.ms_Canvas.html( this.ms_Renderer.domElement );
	}
};