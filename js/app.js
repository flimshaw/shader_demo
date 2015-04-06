var APP = {} || APP;
APP.time = 0;
$(document).ready(function() {

	// variables related to the rendering context
	var container, camera, cameraContainer, renderer, meshes = [], wrapper, light; 
	var clearColor = 0x000000;

	container = document.createElement( 'div' );	
	document.body.appendChild( container );	 		

	// this is a static perlin noise texture for initial seeding
	APP.noiseTex = THREE.ImageUtils.loadTexture("textures/rgb-perlin-seamless-512.png", THREE.UVMapping, function() {
		APP.ready = true;
	});
	APP.noiseTex.wrapS = APP.noiseTex.wrapT = THREE.RepeatWrapping;

	scene = new THREE.Scene();	

	renderer = new THREE.WebGLRenderer({
	  devicePixelRatio: window.devicePixelRatio || 1
	});  	
	renderer.setPixelRatio( window.devicePixelRatio ? window.devicePixelRatio : 1 );		
	renderer.setSize( window.innerWidth, window.innerHeight);
	
	renderer.setClearColor(clearColor, 1 );			
	renderer.autoClear = true; 						
	container.appendChild( renderer.domElement ); 	

	cameraContainer = new THREE.Object3D();
	scene.add(cameraContainer);

	camera = new THREE.PerspectiveCamera( 28, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
	camera.position.z = 5;						
	camera.setLens(8, 7.49); 					
	camera.lookAt(new THREE.Vector3(0, 0, 0)); 	
	cameraContainer.add(camera); 							

	wrapper = new THREE.Object3D(); 
									
	scene.add(wrapper);

	// this is the shader material we'll use for our simulation, it will
	// be rendered alternately to the front or back render targets
	APP.cloudShader = new THREE.ShaderMaterial( {
		uniforms: {
			"uTime": { type: "f", value: 0.0 },
			"tDiffuse": { type: "t", value: APP.noiseTex }
		},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	} );

	APP.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(3, 3), APP.cloudShader);
	scene.add(APP.plane);

	animate();

	function animate() {

		APP.time++;

		APP.cloudShader.uniforms['uTime'].value = APP.time;
		
		renderer.render( scene, camera ); 

		requestAnimationFrame(animate);

	}


});