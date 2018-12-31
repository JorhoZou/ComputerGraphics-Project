
var PLAYER =
{
	ms_Speed: 2,//画面卷动动速
	ms_Jump: 5,//跳跃高度
  }
	


var GROUND =
{
	ms_Ground : null,
	
	Initialize: function( inParameters )
	{		
        var aEdgeShape = new Box2D.b2EdgeShape();
		var aGroundPoints = [];
		//alert("length is "+mystream.length);

		var j=0;
		var y=0;
		aGroundPoints.push( CONV.ToVector2D( { x: 3, y: -0.1 } ) );
		for( var i = 0; i <mystream.length; i += 1 )
		{
			//var  Resampling = 0;
			//if(mystream[i]>0.2)Resampling=5;
			var x1 = j, x2 = j +0.6;
			y = mystream[i]*3*(1+0.1*RAND_MT.Random());
			j+=0.7609;
			// /alert(y);
			aEdgeShape.Set( new Box2D.b2Vec2( x1, 0 ), new Box2D.b2Vec2( x2, y ) );
			GAME.ms_B2DWorld.CreateBody( new Box2D.b2BodyDef() ).CreateFixture( aEdgeShape, 0.0 );
			
			aGroundPoints.push( CONV.ToVector2D( { x: x1, y: y } ) );
			aGroundPoints.push( CONV.ToVector2D( { x: x2, y: y } ) );
		}
		aGroundPoints.push( CONV.ToVector2D( { x: inParameters.heightSegments, y: -0.1 } ) );
		var aGroundShape = new THREE.Shape( aGroundPoints );
		
		var aExtrusionSettings = {
			bevelEnabled: false,
			material: 0, amount: 1.5
		};
	
		var aGround = new THREE.Mesh( 
			new THREE.ExtrudeGeometry( aGroundShape, aExtrusionSettings ), 
			new THREE.MeshPhongMaterial( { color: 0xA2F5A9, ambient: 0xA2F5A9, specular:0xffffff } ) 
		);
		aGround.rotation.y = - 0.5 * Math.PI;
		aGround.position.x = CONV.GetX() + 0.5;
		aGround.castShadow = true;
		aGround.receiveShadow = true;
		
		this.ms_Ground = new THREE.Object3D();
		this.ms_Ground.add( aGround );
		DISPLAY.ms_Scene.add( this.ms_Ground );
	}
}


//in the game function 
var GAME =
{
	
	Update: function()
	{
		var aDelta = this.ms_Clock.getDelta();
		
		this.ms_B2DWorld.Step(
			aDelta,
			20,			// velocity iterations
			20			// position iterations
		);
		PLAYER.Update( aDelta );
		
		var aSize = DISPLAY.ms_Animals.children.length * 0.8;
		for( var i = 0; i < aSize; ++i )
			DISPLAY.ms_Animals.children[i].lookAt( PLAYER.ms_Group.position );
			
		DISPLAY.Update( aDelta );
	},
	

};


