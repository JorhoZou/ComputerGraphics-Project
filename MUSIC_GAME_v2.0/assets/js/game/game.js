

var CONV =
{
	ms_WorldRatio: 0.0,
	ms_WorldOffsetX: 0.0,
	ms_WorldOffsetY: 0.0,
	ms_WorldOffsetZ: 0.0,
	
	To3D: function( inCoord )
	{
		inCoord.z = this.ms_WorldOffsetZ - inCoord.x * this.ms_WorldRatio;
		inCoord.y = this.ms_WorldOffsetY + inCoord.y * this.ms_WorldRatio;
		inCoord.x = this.ms_WorldOffsetX;
	},
	
	To3DS: function( inCoord )
	{
		inCoord.z = this.ms_WorldOffsetZ - inCoord.x * this.ms_WorldRatio;
		inCoord.y = inCoord.y * this.ms_WorldRatio;
		inCoord.x = this.ms_WorldOffsetX;
	},
	
	ToVector3D: function( inCoord )
	{
		this.To3D( inCoord );
		return new THREE.Vector3( inCoord.x, inCoord.y, inCoord.z );
	},
	ToVector2D: function( inCoord )
	{
		this.To3D( inCoord );
		return new THREE.Vector2( inCoord.z, inCoord.y );
	},
	
	XTo3D: function( inX ) { return this.ms_WorldOffsetZ - inX * this.ms_WorldRatio; },
	YTo3D: function( inY ) { return this.ms_WorldOffsetY + inY * this.ms_WorldRatio; },
	GetX: function() { return this.ms_WorldOffsetX; },
	
	SizeTo3D: function( inSize ) { return ( inSize || 1 ) * this.ms_WorldRatio }
}

var PLAYER =
{
	ms_Mesh: null,
	ms_B2DBody: null,
	ms_Group: null,
	ms_GroupHeight: null,
	ms_Speed: 2.18,
	ms_Jump: 3,
	ms_Size: {
		x: 0.25,
		y: 0.12
	},

	Initialize: function(myparam)
	{
		// Load the player model (fox)
	if(myparam == 0){
		MESHES.Load( MESHES.Type.Wolf, function( inGeometry ) {
			var aMesh = MESHES.AddMorph( inGeometry );
			aMesh.rotation.set( 0, Math.PI, 0);
			aMesh.scale.set( 0.01, 0.01, 0.01 );
			aMesh.castShadow = true;
			aMesh.receiveShadow = false;
			PLAYER.ms_Mesh.add( aMesh );
			aMesh.position.y = -0.7;
		} );
	}
		// // Load a companion
		// MESHES.Load( MESHES.Type.Parrot, function( inGeometry ) {
		// 	var aMesh = MESHES.AddMorph( inGeometry );
		// 	aMesh.rotation.set( 0, Math.PI, 0);
		// 	aMesh.scale.set( 0.03, 0.03, 0.03 );
		// 	aMesh.castShadow = true;
		// 	aMesh.receiveShadow = false;
		// 	PLAYER.ms_Group.add( aMesh );
		// 	aMesh.position.x = 4;
		// 	aMesh.position.y = 5;
		// 	aMesh.position.z = 4;
		// } );
		
		// // Load an other companion
		// MESHES.Load( MESHES.Type.Elk, function( inGeometry ) {
		// 	var aMesh = MESHES.AddMorph( inGeometry );
		// 	aMesh.rotation.set( 0, Math.PI, 0);
		// 	aMesh.scale.set( 0.03, 0.03, 0.03 );
		// 	aMesh.castShadow = true;
		// 	aMesh.receiveShadow = false;
		// 	PLAYER.ms_Group.add( aMesh );
		// 	aMesh.position.x = -6;
		// 	aMesh.position.y = -1;
		// 	aMesh.position.z = 8;
		// } );
		
		// Group that define all elements following the player
		this.ms_Group = new THREE.Object3D();
		this.ms_GroupHeight = new THREE.Object3D();
		
		// The player is itself a group (can contains some elements)
		this.ms_Mesh = new THREE.Object3D();
		this.ms_Group.position.x = CONV.GetX();
		this.ms_Group.position.y = CONV.YTo3D( 0 );
	
		// Define the physic of the player
        var aShape = new Box2D.b2PolygonShape();
        aShape.SetAsBox( this.ms_Size.x * 0.5, this.ms_Size.y * 0.5 );
		var aBd = new Box2D.b2BodyDef();
		aBd.set_type( Box2D.b2_dynamicBody );
		aBd.set_position( new Box2D.b2Vec2( 2, this.ms_Size.y ) );
		this.ms_B2DBody = GAME.ms_B2DWorld.CreateBody( aBd );
		this.ms_B2DBody.CreateFixture( aShape, 0.5 );
		this.ms_B2DBody.SetAwake( 1 );
		this.ms_B2DBody.SetActive( 1 );
		
		// Add a cube in the player in order to see the physical box
		/*this.ms_Mesh.add( new THREE.Mesh( 
			new THREE.CubeGeometry( 0.05, CONV.SizeTo3D( this.ms_Size.y+0.02 ), CONV.SizeTo3D( this.ms_Size.x ) ), 
			new THREE.MeshNormalMaterial() ) 
		);*/
		
		// Add all elements to the scene
		this.ms_GroupHeight.add( this.ms_Mesh );
		if(myparam == 0)
			this.ms_GroupHeight.add( DISPLAY.ms_Camera ) ;
		else
			DISPLAY.ms_Camera.position.set(13,200,6);
		this.ms_Group.add( this.ms_GroupHeight ) ;
		DISPLAY.ms_Scene.add( this.ms_Group );
		
		// Shadows follow the player in order to optimize their computing
		this.ms_Group.add( DISPLAY.ms_Light ) ;
		this.ms_Group.add( DISPLAY.ms_Light.target );
		DISPLAY.ms_Light.target.position.set( - 0.8 * GAME.ms_Parameters.heightSegments, 0, - 0.3 * GAME.ms_Parameters.heightSegments );

		// Idem for close light	
		this.ms_Group.add( DISPLAY.ms_CloseLight ) ;
		this.ms_Group.add( DISPLAY.ms_CloseLight.target );
		DISPLAY.ms_CloseLight.target.position.set( 0, 0, -8 );
		//DISPLAY.ms_Light.target.position.set( - 0.8 * GAME.ms_Parameters.heightSegments, 0, - 0.3 * GAME.ms_Parameters.heightSegments );
	},

	Update: function()
	{		
		// Apply constant velocity
		var aVelocity = this.ms_B2DBody.GetLinearVelocity();
		aVelocity.set_x( this.ms_Speed );
		this.ms_B2DBody.SetLinearVelocity( aVelocity );
		
		// Disable the player rotation effect
		this.ms_B2DBody.SetAngularVelocity( this.ms_B2DBody.GetAngularVelocity() * 0.7 );
		
		// Put slowly the up vector of the player to the top
		var aAngle = this.ms_B2DBody.GetAngle();
		this.ms_B2DBody.SetTransform( this.ms_B2DBody.GetPosition(), aAngle * 0.96 );
		
		var aData = {};
		GAME.B2DReadObject( aData, this.ms_B2DBody );
		CONV.To3DS( aData );
		this.ms_Group.position.z = aData.z;
		this.ms_GroupHeight.position.y = aData.y;
		if( this.ms_Mesh != null )
			this.ms_Mesh.rotation.x = aData.angle;
	},
	
	Jump: function()
	{
		var aVelocity = this.ms_B2DBody.GetLinearVelocity();
		aVelocity.set_y( this.ms_Jump );
		this.ms_B2DBody.SetLinearVelocity( aVelocity ); 
	}
}

///////////////////////












var GROUND =
{
	ms_Ground : null,
	
	Initialize: function( inParameters )
	{		
        var aEdgeShape = new Box2D.b2EdgeShape();
		var aGroundPoints = [];

		var j=0;
		var y=0;
		aGroundPoints.push( CONV.ToVector2D( { x: 3, y: -0.1 } ) );
		for( var i = 0; i <mystream.length; i += 1 )
		{

			//if(i=240)draw.type = "dot";//默认显示效果类型
			//var  Resampling = 0;
			//if(mystream[i]>0.2)Resampling=5;
			var x1 = j, x2 = j +0.255/2;
			y = (mystream[i]+0.1)*2*(1-0.001*RAND_MT.Random())-0.2;
			j+=0.33045/2;
			// var x1 = j, x2 = j +0.6;
			// y = mystream[i]*3*(1+0.1*RAND_MT.Random());
			// j+=0.7609;
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

var sin = Math.sin,
    cos = Math.cos,
    tan = Math.tan,
    rand = Math.random,
    floor = Math.floor,
    round = Math.round,
    PI = Math.PI,
 
    // tree params
    MAX_BRANCHES = 4,
    MIN_BRANCHES = 3,
 
    RADIUS_SHRINK = 0.6,
 
    MIN_LENGTH_FACTOR = 0.5,
    MAX_LENGTH_FACTOR = 0.8,
 
    MIN_OFFSET_FACTOR = 0.7,
 
    MAX_SPREAD_RADIAN = PI / 4,
    MIN_SPREAD_RADIAN = PI / 10,
 
    BASE_LEAF_SCALE = 5;

function drawTree(start_position, direction, length, depth, radius) {
    var cylinder, half_length_offset,
    new_position, new_direction, new_length, new_depth, new_radius,
    new_base_position, offset_vector,
    num_branches, color, num_segs;
    // determine branch color
    // determine branch color
    if (depth < 3) {
        color = 0x008000; // random green color
    } else {
        color = 0x7FFFAA; // random brown color
    }

    num_segs = depth + 2; // min num_segs = 2
    direction = direction.normalize();
    //Euler = new THREE.Euler( 0, Math.atan(direction.x/direction.z), Math.acos(direction.y), 'XYZ' )
    cylinder = new THREE.Mesh(
           new THREE.CylinderGeometry(radius * RADIUS_SHRINK, // botRad
                                      radius,
                                      length, // height
                                      8,
                                      1)/*.applyMatrix( new THREE.Matrix4().makeRotationFromEuler(Euler) )*/,   // botOffset
           new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } ));
    // rotate the cylinder to follow the direction
    console.log("up", cylinder.up);
    // get the offset from start position to cylinder center position
    half_length_offset = direction.clone();
    half_length_offset.setLength(length / 2);
    // calculate center position
    cylinder.position = start_position.clone();

    cylinder.position.add(half_length_offset);
    cylinder.castShadow = true;
    cylinder.receiveShadow = false;
    
    /* var tempx = cylinder.position.x;
    var tempy = cylinder.position.y;
    var tempz = cylinder.position.z;
    cylinder.position.x = tempz;
    cylinder.position.y = tempy;
    cylinder.position.z = tempx; */
    DISPLAY.ms_Scene.add( cylinder );
    /*
    if (this.ms_realtree != null)
        THREE.GeometryUtils.merge(this.ms_realtree, cylinder);
    else
        this.ms_realtree = cylinder;
    */
    
    // stop recursion if depth reached 1
    if (depth == 1)
        return; 
    // calculate the base start position for next branch
    // a random offset will be added to it later
    new_base_position = start_position.clone();
    new_base_position.add(
            half_length_offset.clone().multiplyScalar(2.0 * MIN_OFFSET_FACTOR));

    new_depth = depth - 1;
    new_radius = radius * RADIUS_SHRINK;

    // get a random branch number
    num_branches = round((rand() * (MAX_BRANCHES - MIN_BRANCHES))) 
                   + MIN_BRANCHES;


    // recursively draw the children branches
    for (var i = 0; i < num_branches; ++i) {

        // random spread radian
        var spread_radian = rand() * (MAX_SPREAD_RADIAN - MIN_SPREAD_RADIAN) + 
                            MIN_SPREAD_RADIAN;

        // generate a vector which is prependicular to the original direction
        var perp_vec = (new THREE.Vector3(0, 1, 0)).cross(direction); 
        perp_vec.setLength(direction.length() * tan(spread_radian));
        console.log(direction, perp_vec, depth);
        // the new direction equals to the sum of the perpendicular vector
        // and the original direction
        new_direction = direction.clone().add(perp_vec).normalize();

        // generate a rotation matrix to rotate the new direction with
        // the original direction being the rotation axis
        var rot_mat = new THREE.Matrix4();
        rot_mat.makeRotationAxis(direction, PI * 2 / num_branches * i);
        new_direction.transformDirection( rot_mat )

        // random new length for the next branch
        new_length = (rand() * (MAX_LENGTH_FACTOR - MIN_LENGTH_FACTOR) + 
                     MIN_LENGTH_FACTOR) * length;

        // caculate the position of the new branch
        new_position = new_base_position.clone();
        //offset_vector = half_length_offset.clone();
        //new_position.add(
        //        offset_vector.multiplyScalar(
        //            2.0 * i / (num_branches - 1) * (1 - MIN_OFFSET_FACTOR)));
        
        // using setTimeout to make the drawing procedure non-blocking
        setTimeout((function(a, b, c, d, e) {
            return function() {
                drawTree(a, b, c, d, e);
            };
        })(new_position, new_direction, new_length, new_depth, new_radius), 0); 
        
        //this.drawTree(new_position, new_direction, new_length, new_depth, new_radius);
    }

}
var TREES =
{
	ms_Geometry: null,
	ms_Trees: null,
	ms_Materiel: null,
	
	Initialize: function()
	{
	
		var aMesh = new THREE.Mesh( new THREE.CylinderGeometry( 4, 4,18, 4, 1 ),
					new THREE.MeshNormalMaterial({flatShading: true}) );
		aMesh.position.set( 0, 0, 0 );
		
		// Merge 
		this.ms_Geometry = new THREE.CubeGeometry( 0.5, 2, 0.5, 1, 1, 1 );
		THREE.GeometryUtils.merge( this.ms_Geometry, aMesh );
		

		this.ms_Trees = new THREE.Object3D();
		this.ms_Material = new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } );
		
		// Generate trees
		this.GenerateTrees( 100 );
		
		// Add the final group to the scene
		DISPLAY.ms_Scene.add( this.ms_Trees );
	},
	
	GenerateClosedTrees: function()
	{
	},
	
	GenerateTrees: function( inNbTrees )
	{
		var aTreeGeometry = new THREE.Geometry();
		
		for( var i = 0; i < inNbTrees; ++i )
		{			
			var x = ( 0.2 + RAND_MT.Random() * 0.7 ) * GAME.ms_Parameters.widthSegments - GAME.ms_Parameters.widthSegments / 2;
			var z = ( 0.01 + RAND_MT.Random() * 0.98 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments / 2;
			var y = DISPLAY.GetDepth( Math.floor( GAME.ms_Parameters.widthSegments / 2 + x ), Math.floor( GAME.ms_Parameters.heightSegments / 2 + z ) );
			
			if( y > 15.0 )
			{
				var aTree = new THREE.Mesh(  this.ms_Geometry, this.ms_Material );
				
				aTree.rotation.set( 0, RAND_MT.Random() * Math.PI * 2, 0 );
				
				aTree.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				aTree.position.y = y;
				aTree.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				aTree.scale.set( aScale, aScale, aScale );
				
				THREE.GeometryUtils.merge( aTreeGeometry, aTree );
			}
		}
		
		var aFinalTrees = new THREE.Mesh( aTreeGeometry, this.ms_Material );
		this.ms_Trees.add( aFinalTrees );
		aFinalTrees.castShadow = true;
		aFinalTrees.receiveShadow = false;
	},
	GenerateRealTrees: function( inNbTrees ){
		var aTreeGeometry = new THREE.Geometry();
		
		for( var i = 0; i < inNbTrees; ++i )
		{			
			var x = ( 0.2 + RAND_MT.Random() * 0.7 ) * GAME.ms_Parameters.widthSegments - GAME.ms_Parameters.widthSegments / 2;
			var z = ( 0.01 + RAND_MT.Random() * 0.98 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments / 2;
			var y = DISPLAY.GetDepth( Math.floor( GAME.ms_Parameters.widthSegments / 2 + x ), Math.floor( GAME.ms_Parameters.heightSegments / 2 + z ) );
			
			if( y > 15.0 )
			{
				
				newx = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				newy = y;
				newz = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				//drawTree(new THREE.Vector3(0, 0, 0), new THREE.Vector3( 0, 0, 1), 40*aScale, 2, 2*aScale);
				/*
				if (aTree == null){
					aTree = new THREE.Mesh(  this.ms_Geometry, this.ms_Material );
				} 
				aTree.rotation.set( 0, RAND_MT.Random() * Math.PI * 2, 0 );
				
				aTree.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				aTree.position.y = y;
				aTree.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				aTree.scale.set( aScale, aScale, aScale );
				this.ms_Trees.add( aTree );
				aTree.castShadow = true;
				aTree.receiveShadow = false;
				//THREE.GeometryUtils.merge( aTreeGeometry, aTree );*/
			}
		}
		//var aFinalTrees = new THREE.Mesh( aTreeGeometry, this.ms_Material );
		//this.ms_Trees.add( aFinalTrees );
		//aFinalTrees.castShadow = true;
		//aFinalTrees.receiveShadow = false;
	},
};

var TREES2 =
{
	ms_Geometry: null,
	ms_Trees: null,
	ms_Materiel: null,
	
	Initialize: function()
	{
		// Createpyramide
		var aMesh = new THREE.Mesh( new THREE.CylinderGeometry( 0, 4, 10, 4, 1 ),
					new THREE.MeshNormalMaterial() );
		aMesh.position.set( 0, 6, 0 );	
		// Merge
		this.ms_Geometry = new THREE.CubeGeometry( 0.5, 2, 0.5, 1, 1, 1 );
		THREE.GeometryUtils.merge( this.ms_Geometry, aMesh );
		
		// Initialize the group of trees and material
		this.ms_Trees = new THREE.Object3D();
		this.ms_Material = new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } );
		
		// Generate trees
		this.GenerateTrees( 100 );
		
		// Add the final group to the scene
		DISPLAY.ms_Scene.add( this.ms_Trees );
	},
	
	GenerateClosedTrees: function()
	{
	},
	
	GenerateTrees: function( inNbTrees )
	{
		var aTreeGeometry = new THREE.Geometry();
		
		for( var i = 0; i < inNbTrees; ++i )
		{			
			var x = ( 0.2 + RAND_MT.Random() * 0.7 ) * GAME.ms_Parameters.widthSegments - GAME.ms_Parameters.widthSegments / 2;
			var z = ( 0.01 + RAND_MT.Random() * 0.98 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments / 2;
			var y = DISPLAY.GetDepth( Math.floor( GAME.ms_Parameters.widthSegments / 2 + x ), Math.floor( GAME.ms_Parameters.heightSegments / 2 + z ) );
			
			if( y > 15.0 )
			{
				var aTree = new THREE.Mesh(  this.ms_Geometry, this.ms_Material );
				
				aTree.rotation.set( 0, RAND_MT.Random() * Math.PI * 2, 0 );
				
				aTree.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				aTree.position.y = y;
				aTree.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				aTree.scale.set( aScale, aScale, aScale );
				
				THREE.GeometryUtils.merge( aTreeGeometry, aTree );
			}
		}
		
		var aFinalTrees = new THREE.Mesh( aTreeGeometry, this.ms_Material );
		this.ms_Trees.add( aFinalTrees );
		aFinalTrees.castShadow = true;
		aFinalTrees.receiveShadow = false;
	},
};
var TREES3 =
{
	ms_Geometry: null,
	ms_Trees: null,
	ms_Materiel: null,
	
	Initialize: function()
	{
		// Create pyramide
		var aMesh = new THREE.Mesh( new THREE.SphereGeometry(3, 18, 12), new THREE.MeshNormalMaterial() );
		aMesh.position.set( 0, 3, 0 );	
		// Merge it width a deformed cube to make the bottom
		this.ms_Geometry = new THREE.CubeGeometry( 0.5, 2, 0.5, 1, 1, 1 );
		THREE.GeometryUtils.merge( this.ms_Geometry, aMesh );
		
		// Initialize the group of trees and material
		this.ms_Trees = new THREE.Object3D();
		this.ms_Material = new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } );
		
		// Generate trees
		this.GenerateTrees( 100 );
		
		// Add the final group to the scene
		DISPLAY.ms_Scene.add( this.ms_Trees );
	},
	
	GenerateClosedTrees: function()
	{
	},
	
	GenerateTrees: function( inNbTrees )
	{
		var aTreeGeometry = new THREE.Geometry();
		
		for( var i = 0; i < inNbTrees; ++i )
		{			
			var x = ( 0.2 + RAND_MT.Random() * 0.7 ) * GAME.ms_Parameters.widthSegments - GAME.ms_Parameters.widthSegments / 2;
			var z = ( 0.01 + RAND_MT.Random() * 0.98 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments / 2;
			var y = DISPLAY.GetDepth( Math.floor( GAME.ms_Parameters.widthSegments / 2 + x ), Math.floor( GAME.ms_Parameters.heightSegments / 2 + z ) );
			
			if( y > 15.0 )
			{
				var aTree = new THREE.Mesh(  this.ms_Geometry, this.ms_Material );
				
				aTree.rotation.set( 0, RAND_MT.Random() * Math.PI * 2, 0 );
				
				aTree.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				aTree.position.y = y;
				aTree.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				aTree.scale.set( aScale, aScale, aScale );
				
				THREE.GeometryUtils.merge( aTreeGeometry, aTree );
			}
		}
		
		var aFinalTrees = new THREE.Mesh( aTreeGeometry, this.ms_Material );
		this.ms_Trees.add( aFinalTrees );
		aFinalTrees.castShadow = true;
		aFinalTrees.receiveShadow = false;
	},
};

var TREES4 =
{
	ms_Geometry: null,
	ms_Trees: null,
	ms_Materiel: null,
	
	Initialize: function()
	{
		// Createpyramide
		var aMesh = new THREE.Mesh( new THREE.CylinderGeometry( 4, 4, 10, 20, 1 ),
					new THREE.MeshNormalMaterial() );
		aMesh.position.set( 0, 6, 0 );	
		// Merge
		this.ms_Geometry = new THREE.CubeGeometry( 0.5, 2, 0.5, 1, 1, 1 );
		THREE.GeometryUtils.merge( this.ms_Geometry, aMesh );
		
		// Initialize the group of trees and material
		this.ms_Trees = new THREE.Object3D();
		this.ms_Material = new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } );
		
		// Generate trees
		this.GenerateTrees( 100 );
		
		// Add the final group to the scene
		DISPLAY.ms_Scene.add( this.ms_Trees );
	},
	
	GenerateClosedTrees: function()
	{
	},
	
	GenerateTrees: function( inNbTrees )
	{
		var aTreeGeometry = new THREE.Geometry();
		
		for( var i = 0; i < inNbTrees; ++i )
		{			
			var x = ( 0.2 + RAND_MT.Random() * 0.7 ) * GAME.ms_Parameters.widthSegments - GAME.ms_Parameters.widthSegments / 2;
			var z = ( 0.01 + RAND_MT.Random() * 0.98 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments / 2;
			var y = DISPLAY.GetDepth( Math.floor( GAME.ms_Parameters.widthSegments / 2 + x ), Math.floor( GAME.ms_Parameters.heightSegments / 2 + z ) );
			
			if( y > 15.0 )
			{
				var aTree = new THREE.Mesh(  this.ms_Geometry, this.ms_Material );
				
				aTree.rotation.set( 0, RAND_MT.Random() * Math.PI * 2, 0 );
				
				aTree.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				aTree.position.y = y;
				aTree.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				aTree.scale.set( aScale, aScale, aScale );
				
				THREE.GeometryUtils.merge( aTreeGeometry, aTree );
			}
		}
		
		var aFinalTrees = new THREE.Mesh( aTreeGeometry, this.ms_Material );
		this.ms_Trees.add( aFinalTrees );
		aFinalTrees.castShadow = true;
		aFinalTrees.receiveShadow = false;
	},
};



var TREES5 =
{
	ms_Geometry: null,
	ms_Trees: null,
	ms_Materiel: null,
	
	Initialize: function()
	{
		// Createpyramide
		var aMesh = new THREE.Mesh( new THREE.CylinderGeometry( 0, 4, 10, 20, 1 ),
					new THREE.MeshNormalMaterial() );
		aMesh.position.set( 0, 6, 0 );	
		// Merge
		this.ms_Geometry = new THREE.CubeGeometry( 0.5, 2, 0.5, 1, 1, 1 );
		THREE.GeometryUtils.merge( this.ms_Geometry, aMesh );
		
		// Initialize the group of trees and material
		this.ms_Trees = new THREE.Object3D();
		this.ms_Material = new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } );
		
		// Generate trees
		this.GenerateTrees( 100 );
		
		// Add the final group to the scene
		DISPLAY.ms_Scene.add( this.ms_Trees );
	},
	
	GenerateClosedTrees: function()
	{
	},
	
	GenerateTrees: function( inNbTrees )
	{
		var aTreeGeometry = new THREE.Geometry();
		
		for( var i = 0; i < inNbTrees; ++i )
		{			
			var x = ( 0.2 + RAND_MT.Random() * 0.7 ) * GAME.ms_Parameters.widthSegments - GAME.ms_Parameters.widthSegments / 2;
			var z = ( 0.01 + RAND_MT.Random() * 0.98 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments / 2;
			var y = DISPLAY.GetDepth( Math.floor( GAME.ms_Parameters.widthSegments / 2 + x ), Math.floor( GAME.ms_Parameters.heightSegments / 2 + z ) );
			
			if( y > 15.0 )
			{
				var aTree = new THREE.Mesh(  this.ms_Geometry, this.ms_Material );
				
				aTree.rotation.set( 0, RAND_MT.Random() * Math.PI * 2, 0 );
				
				aTree.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				aTree.position.y = y;
				aTree.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				aTree.scale.set( aScale, aScale, aScale );
				
				THREE.GeometryUtils.merge( aTreeGeometry, aTree );
			}
		}
		
		var aFinalTrees = new THREE.Mesh( aTreeGeometry, this.ms_Material );
		this.ms_Trees.add( aFinalTrees );
		aFinalTrees.castShadow = true;
		aFinalTrees.receiveShadow = false;
	},
};

var TREES6 =
{
	ms_Geometry: null,
	ms_Trees: null,
	ms_Materiel: null,
	
	Initialize: function()
	{
		// Createpyramide
		var aMesh = new THREE.Mesh( new THREE.CylinderGeometry( 2, 4, 10, 20, 1 ),
					new THREE.MeshNormalMaterial() );
		aMesh.position.set( 0, 6, 0 );	
		// Merge
		this.ms_Geometry = new THREE.CubeGeometry( 0.5, 2, 0.5, 1, 1, 1 );
		THREE.GeometryUtils.merge( this.ms_Geometry, aMesh );
		
		// Initialize the group of trees and material
		this.ms_Trees = new THREE.Object3D();
		this.ms_Material = new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } );
		
		// Generate trees
		this.GenerateTrees( 100 );
		
		// Add the final group to the scene
		DISPLAY.ms_Scene.add( this.ms_Trees );
	},
	
	GenerateClosedTrees: function()
	{
	},
	
	GenerateTrees: function( inNbTrees )
	{
		var aTreeGeometry = new THREE.Geometry();
		
		for( var i = 0; i < inNbTrees; ++i )
		{			
			var x = ( 0.2 + RAND_MT.Random() * 0.7 ) * GAME.ms_Parameters.widthSegments - GAME.ms_Parameters.widthSegments / 2;
			var z = ( 0.01 + RAND_MT.Random() * 0.98 ) * GAME.ms_Parameters.heightSegments - GAME.ms_Parameters.heightSegments / 2;
			var y = DISPLAY.GetDepth( Math.floor( GAME.ms_Parameters.widthSegments / 2 + x ), Math.floor( GAME.ms_Parameters.heightSegments / 2 + z ) );
			
			if( y > 15.0 )
			{
				var aTree = new THREE.Mesh(  this.ms_Geometry, this.ms_Material );
				
				aTree.rotation.set( 0, RAND_MT.Random() * Math.PI * 2, 0 );
				
				aTree.position.x = x * GAME.ms_Parameters.width / GAME.ms_Parameters.widthSegments;
				aTree.position.y = y;
				aTree.position.z = z * GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
				
				var aScale = RAND_MT.Random() * 0.5 + 0.75;
				aTree.scale.set( aScale, aScale, aScale );
				
				THREE.GeometryUtils.merge( aTreeGeometry, aTree );
			}
		}
		
		var aFinalTrees = new THREE.Mesh( aTreeGeometry, this.ms_Material );
		this.ms_Trees.add( aFinalTrees );
		aFinalTrees.castShadow = true;
		aFinalTrees.receiveShadow = false;
	},
};


var GAME =
{
	ms_B2DWorld: null,
	ms_B2DShape: null,
	ms_Parameters: null,
	ms_HeightMap: null,
	ms_Clock: null,
	
	Initialize: function( inIdCanvas, myparam)
	{
		this.ms_HeightMap = TERRAINGEN.CreateCanvas( 0, 0 );
		this.ms_Parameters = {
			alea: RAND_MT,
			generator: PN_GENERATOR,
			width: 500,
			height: 2000,
			widthSegments: 50,
			heightSegments: 200,
			depth: 220,
			param: 3,
			filterparam: 1,
			filter: [ GAMETERRAIN_FILTER ],
			canvas: this.ms_HeightMap
		};
		this.ms_Clock = new THREE.Clock();
		
		CONV.ms_WorldRatio = GAME.ms_Parameters.height / GAME.ms_Parameters.heightSegments;
		CONV.ms_WorldOffsetZ = GAME.ms_Parameters.height * 0.5;
		CONV.ms_WorldOffsetY = GAME.ms_Parameters.depth * 0.10;
		CONV.ms_WorldOffsetX = GAME.ms_Parameters.width * 0.42;
	
		MESHES.Initialize();
		DISPLAY.Initialize( inIdCanvas );
		this.B2DInitialize( this.ms_Parameters );
		PLAYER.Initialize(myparam);
		if(myparam == 0)
			GROUND.Initialize( this.ms_Parameters );
		TREES.Initialize();
		TREES2.Initialize();
		TREES3.Initialize();
		TREES4.Initialize();
		TREES5.Initialize();
		TREES6.Initialize();
	},
	//////////////////////////////////////////////////////////////////////








	B2DInitialize: function( inParameters )
	{	
		var aGravity = new Box2D.b2Vec2( 0.0, -10.5 );///////////////////
		this.ms_B2DWorld = new Box2D.b2World( aGravity, true );
		
        var aEdgeShape = new Box2D.b2EdgeShape();
        aEdgeShape.Set( new Box2D.b2Vec2( 0, 0 ), new Box2D.b2Vec2( inParameters.heightSegments, 0 ) );
        this.ms_B2DWorld.CreateBody( new Box2D.b2BodyDef() ).CreateFixture( aEdgeShape, 0.0 );
	},
	
	B2DReadObject: function( inData, inBody )
	{
		var aPos = inBody.GetPosition();
		inData.x = aPos.get_x();
		inData.y = aPos.get_y();
		inData.angle = inBody.GetAngle();
	},
	
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
	
	Jump: function()
	{
		PLAYER.Jump();
	},
};


























