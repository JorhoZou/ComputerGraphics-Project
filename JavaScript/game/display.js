var DISPLAY = {
    ms_Canvas: null,
    ms_Renderer: null,
    ms_Camera: null,
    ms_Camera2: null,
    ms_Scene: null,

    Enable: (function() {
        try {
            var aCanvas = document.createElement('canvas');
            return !!window.WebGLRenderingContext && (aCanvas.getContext('webgl') || aCanvas.getContext('experimental-webgl'));
        } catch (e) { return false; }
    })(),

    Initialize: function(inIdCanvas) {
        this.ms_Clock = new THREE.Clock();
        this.ms_Canvas = $('#' + inIdCanvas);

        // Initialize Renderer, Camera and Scene
        this.ms_Renderer = this.Enable ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.ms_Canvas.html(this.ms_Renderer.domElement);
        this.ms_Scene = new THREE.Scene();




        this.ms_Camera = new THREE.PerspectiveCamera(55.0, Window.ms_Width / Window.ms_Height, 0.01, 20000);
        this.ms_Camera.position.set(13, 1.5, 4);
        this.ms_Camera.up.x = 0; //相机以哪个方向为上方
        this.ms_Camera.up.y = 0;
        this.ms_Camera.up.z = 0;
        this.ms_Camera.lookAt(this.ms_Scene.position);


        this.ms_Camera2 = new THREE.PerspectiveCamera(55.0, Window.ms_Width / Window.ms_Height, 0.01, 20000);
        this.ms_Camera2.position.set(13, 1.5, 4);
        this.ms_Camera2.up.x = 0; //相机以哪个方向为上方
        this.ms_Camera2.up.y = 0;
        this.ms_Camera2.up.z = 0;
        this.ms_Camera2.lookAt(new THREE.Vector3(0, 0, 0));




    },


};