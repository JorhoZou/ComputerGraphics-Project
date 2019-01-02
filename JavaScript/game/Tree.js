var TREES =
{
    ms_Geometry: null,
    ms_Trees: null,
    ms_Materiel: null,
    
    Initialize: function()
    {
        // Create pyramide
        var aMesh = new THREE.Mesh( new THREE.CylinderGeometry( 0, 4, 10, 4, 1 ), new THREE.MeshNormalMaterial() );
        aMesh.position.set( 0, 6, 0 );
        
        // Merge it width a deformed cube to make the bottom
        this.ms_Geometry = new THREE.CubeGeometry( 0.5, 2, 0.5, 1, 1, 1 );
        THREE.GeometryUtils.merge( this.ms_Geometry, aMesh );
        
        // Initialize the group of trees and material
        this.ms_Trees = new THREE.Object3D();
        this.ms_Material = new THREE.MeshPhongMaterial( { color: 0x006600, ambient: 0x006600, shading: THREE.FlatShading } );
        
        // Generate trees
        this.GenerateTrees( 1000 );
        
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