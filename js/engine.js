function PlanetDemo()
{
	var webGlVersion = 2;
	
	var gl;
	var sceneGraph;
	var input;
	
	var canvas;
	var legend;
	var status;
	
	var textures;
	var geometry;
	var pipelines;

	var deviceVertexBuffer;

	NX_VERTEX_BUFFER_LOCATION = 0;
	NX_NORMAL_BUFFER_LOCATION = 1;
	NX_TANGENT_BUFFER_LOCATION = 2;
	NX_UV_BUFFER_LOCATION = 3;
	

	function createFrustumMat(left, right, bottom, top, near, far) {
		var mat = new Mat4();
		var rl = (right - left);
		var tb = (top - bottom);
		var fn = (far - near);
		mat[0] = (2 * near) / rl;
		mat[1] = 0;
		mat[2] = 0;
		mat[3] = 0;
		mat[4] = 0;
		mat[5] = (2 * near) / tb;
		mat[6] = 0;
		mat[7] = 0;
		mat[8] = 0;
		mat[9] = 0;
		mat[10] = -(far + near) / fn;
		mat[11] = -1;
		mat[12] = (right + left) / rl;
		mat[13] = (top + bottom) / tb;
		mat[14] = -(2 * far * near) / fn;
		mat[15] = 0;
		return mat;
	}

	function createPerspMat(camera) {
		var top = camera.near * Math.tan(camera.angleY * Math.PI / 360.0);
		var right = top * camera.ratio;
		return createFrustumMat(-right, right, -top, top, camera.near, camera.far);
	}

	function createPerspectiveMatrix(fovY, aspect, near, far) {
		return new Float32Array([
			aspect / Math.tan(fovY), 0, 0, 0,
			0, 1 / Math.tan(fovY), 0, 0,
			0, 0, (near + far) / (near - far), -1,
			0, 0, 2 * near * far / (near - far), 0]);
	}
	
	function getTextureIndex( name )
	{
		for( var index = 0; index < textures.length; ++index )
		{
			if( textures[index].identifier === name )
			{
				return index;
			}
		}
		return -1;
	}
	
	function getGeomtryIndex( name )
	{
		for( var index = 0; index < geometry.length; ++index )
		{
			if( geometry[index].model.name === name )
			{
				return index;
			}
		}
		return -1;
	}
	
	function getPipelineIndex( name )
	{
		for( var index = 0; index < pipelines.length; ++index )
		{
			if( pipelines[index].identifier === name )
			{
				return index;
			}
		}
		return -1;
	}
	
	// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
	function isTouchDevice() 
	{
		var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    
		var mq = function (query) 
		{
			return window.matchMedia(query).matches;
		}

		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
		{
			return true;
		}

		// include the 'heartz' as a way to have a non matching MQ to help terminate the join
		// https://git.io/vznFH
		var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
		return mq(query);
	}
	
	function initializeScene() {
		sceneGraph = new Scenegraph();
		sceneGraph.impactPoint = new Vec3( 0.0, 1.0, 0.0 );
		sceneGraph.impactProgress = 0;
		
		var nSun = new GeometryNode( "Sun", new Glow( getGeomtryIndex( "Sphere" ), getPipelineIndex( "ObjectGlow" ), new Array( 1.0, 1.0, 1.0, 1.0 ) ) );
				
		nSun.transformation = function (mat) {
			this.ownMat = Mat4.scale(34.8175, 34.8175, 34.8175);
			this.childMat = mat;
			return mat;
		}


		sceneGraph.cameras[sceneGraph.MAIN_CAMERA] = new cNode("Camera", 35, 1, 1, 10000);
		sceneGraph.cameras[sceneGraph.MAIN_CAMERA].transformation = function (mat) {
			/*
			var pitch = Mat4.rotate(input.mY, new Vec3(1, 0, 0));
			var yaw = Mat4.rotate(input.mX, new Vec3(0, 1, 0));
			var rot = yaw.multiply(pitch);
			var rotY = Mat4.rotate(input.lon, new Vec3(0, 1, 0));
			var rotX = Mat4.rotate(input.lat, new Vec3(1, 0, 0));
			*/
			
			let vectorX = new Vec3( this.localMatrix[0], this.localMatrix[1], this.localMatrix[2] ).norm();
			let vectorY = new Vec3( this.localMatrix[4], this.localMatrix[5], this.localMatrix[6] ).norm();
			let vectorZ = new Vec3( this.localMatrix[8], this.localMatrix[9], this.localMatrix[10] ).norm();
			
			let vector = vectorX.scalar( -input.moveX ).add( vectorY.scalar( input.moveY ) );
			let magnitude = vector.abs();
			if( magnitude )
			{
				let axis = vector.norm().cross( vectorZ );
				this.localMatrix = Mat4.rotate( 90.0*magnitude ,axis ).multiply( this.localMatrix );
			}
			
			vectorZ = new Vec3( this.localMatrix[8], this.localMatrix[9], this.localMatrix[10] ).norm().scalar( -input.dis )
			this.localMatrix = Mat4.translate( vectorZ[0], vectorZ[1], vectorZ[2] ).multiply( this.localMatrix );
			
			this.ownMat = Mat4.translate( mat[12], mat[13], mat[14] ).multiply( this.localMatrix );
			this.childMat = this.ownMat;
			
			input.moveX = 0;
			input.moveY = 0;
			input.dis = 0;
			
			return this.childMat;
		};

		var nEarthGroup = new gNode("EarthGroup");
		nEarthGroup.transformation = function (mat) {
			var time = sceneGraph.timer.gameTime;
			var w = 0.000000001140771161 * time;

			w = w % 360
			w = w * (Math.PI / 180);

			var rot1 = Mat4.rotate(time * 0.00000041667, new Vec3(0, 1, 0));
			var rot2 = Mat4.rotate(23.5, new Vec3(0, 0, 1));
			var rot = rot2.multiply(rot1);
			var x = 3802.5 * Math.cos(w);
			var z = 3677.5 * Math.sin(w);
			var trn = Mat4.translate(x, 0, z);
			this.ownMat = mat.multiply(trn.multiply(rot));
			this.childMat = this.ownMat;

			return this.childMat;
		};

		var nEarth = new GeometryNode("Earth", //Nodename
			new Earth( getGeomtryIndex( "Sphere" ), getPipelineIndex( "Earth" ), 
						getTextureIndex("earth_day"), getTextureIndex("earth_night"), getTextureIndex("earth_alpha") ) );
			
		nEarth.transformation = function (mat) {
			var rot = Mat4.rotate(31.717474, new Vec3(0, 0, 1));
			var scl = Mat4.scale(6.378, 6.378, 6.378);//(6.378)
			var newMat = mat.multiply(rot);

			this.ownMat = newMat.multiply(scl);
			this.childMat = newMat;

			return this.childMat;
		};

		var nMoon = new GeometryNode( "Moon", new Moon( getGeomtryIndex( "Sphere" ), getPipelineIndex( "Moon" ), getTextureIndex("moon") ) );
		nMoon.transformation = function (mat) {
			var time = sceneGraph.timer.gameTime;
			var w = 0.0000000152502257 * time;
			w %= 360;
			var rot = Mat4.rotate(w, new Vec3(0, 1, 0));
			var scl = Mat4.scale(1.738, 1.738, 1.738);
			w = w * (Math.PI / 180);

			var x = 363.3 * Math.cos(w);
			var z = 363.3 * Math.sin(w);
			var trn = Mat4.translate(x + mat[12], mat[13], z + mat[14])
			var newMat = trn.multiply(rot);

			this.ownMat = newMat.multiply(scl);
			this.childMat = newMat;

			return this.childMat;
		};

		var nMark = new gNode("Marker");
		nMark.move = false;
		nMark.click = false;
		nMark.transformation = function (mat) {
			var vec = false;
			var time = sceneGraph.timer.gameTime;

			if( input.fire && !this.click || input.fire_mode )
			{
				vec = collision(this.parent);

				if ( input.fire )
				{
					if( vec )
					{
						sceneGraph.impactPoint = vec;
						sceneGraph.impactProgress = 0;
						sceneGraph.timer.multi = 1;
						this.click = true;
						input.fire_mode = false;
					}
					else
					{
						input.fire = false;
					}
				}
			}

			if (!vec) {
				vec = new Vec3(0, 0, 0);
			}

			if ( this.click ) {
				if (!input.fire) {
					this.click = false;
				}
				else {
					sceneGraph.impactProgress += ( 1.0 + 10.0 * sceneGraph.impactProgress ) * sceneGraph.timer.getDelta() * 0.00002;
					sceneGraph.impactProgress = Math.min( Math.max( sceneGraph.impactProgress, 0.0 ), 1.0 );
					if( sceneGraph.impactProgress === 1.0 )
					{
						this.click = false;
						input.fire = false;
						sceneGraph.timer.multi = sceneGraph.oldTimeMulti;
					}						
				}
			}

			var vC = new Vec3(vec[0] - mat[12], vec[1] - mat[13], vec[2] - mat[14]).norm();
			var vM = new Vec3(0, 1, 0);

			var trn = Mat4.translate(vec[0], vec[1], vec[2]);
			var rot = Mat4.rotate((180 / Math.PI) * Math.acos(vC.dot(vM)), vM.cross(vC).norm()).multiply(Mat4.rotate((time / 1000 * 20) % 360, vM))

			this.move = (0.5 * time / 1000) % 0.6 + 0.2;

			if (this.move > 0.5) {
				this.move = 1 - this.move;
			}

			this.ownMat = trn.multiply(rot);
			this.childMat = this.ownMat;

			return this.childMat;
		}
		
		let arrowIndex = getGeomtryIndex( "Arrow" );
		var markerT = new Glow( arrowIndex, getPipelineIndex( "ObjectGlow" ), new Array( 8.0, 0.0, 0.0, 1.0 ) );
		var markerR = new Glow( arrowIndex, getPipelineIndex( "ObjectGlow" ), new Array( 8.0, 0.0, 0.0, 1.0 ) );
		var markerL = new Glow( arrowIndex, getPipelineIndex( "ObjectGlow" ), new Array( 8.0, 0.0, 0.0, 1.0 ) );
		var markerB = new Glow( arrowIndex, getPipelineIndex( "ObjectGlow" ), new Array( 8.0, 0.0, 0.0, 1.0 ) );
		
		var nMarkTop = new GeometryNode( "MarkTop", markerT );
		nMarkTop.lightState = 0;
		nMarkTop.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(-90, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkLeft = new GeometryNode( "MarkLeft", markerL );
		nMarkLeft.lightState = 0;
		nMarkLeft.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(180, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkRight = new GeometryNode( "MarkRight", markerR );
		nMarkRight.lightState = 0;
		nMarkRight.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(0, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkBottom = new GeometryNode( "MarkBottom", markerB );
		nMarkBottom.lightState = 0;
		nMarkBottom.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(90, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		nEarth.addChild(nMark);
		nMark.addChild(nMarkTop);
		nMark.addChild(nMarkLeft);
		nMark.addChild(nMarkRight);
		nMark.addChild(nMarkBottom);
		nEarthGroup.addChild(nEarth);
		nEarthGroup.addChild(sceneGraph.cameras[sceneGraph.MAIN_CAMERA]);
		nEarthGroup.addChild(nMoon);
		nSun.addChild(nEarthGroup);
		sceneGraph.addGraph(nSun);
	}

	function initializeFramebuffer() {
		
		gl.beautyFramebuffer = gl.createFramebuffer();
		gl.bindFramebuffer( gl.FRAMEBUFFER, gl.beautyFramebuffer );

		gl.beautyRenderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer( gl.RENDERBUFFER, gl.beautyRenderbuffer );
		gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.bufferWidth, gl.bufferHeight );

		gl.beautyPass = gl.createTexture();
		gl.bindTexture( gl.TEXTURE_2D, gl.beautyPass );
		
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.bufferWidth, gl.bufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		
		gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gl.beautyPass, 0 );
		gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.beautyRenderbuffer );
	}

	function initializeGl() {
		function throwOnGLError(err, funcName, args) {
			console.log( WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName );
		}
		
		webGlVersion = 2;
		try {
			gl = canvas.getContext('webgl2'); 
		}
		catch (e) { }
		
		if (!gl) {
			alert('WebGL 2.0 not activiated or supported in this browser!');
			return;
			
			/*
			webGlVersion = 1;
			try {
				gl = canvas.getContext('webgl'); 
			}
			catch (e) { }
			
			if (!gl) {
				webGlVersion = 0;
				alert('webGL not activiated or supported');
				return;
			}
			*/
		}
		
		gl = WebGLDebugUtils.makeDebugContext( gl, throwOnGLError );

		textures = [ 
			{
				identifier : "earth_night",
				source : "img/night.jpg",
			},
			{
				identifier : "moon",
				source : "img/moon.jpg",
			},
			{
				identifier : "earth_day",
				source : "img/world.jpg",
			},
			{
				identifier : "earth_alpha",
				source : "img/earth_alpha.png",
			},
		]
		
		geometry = [
			{
				model : NX_GEOMETRY.createIcosaeder( 1, 3, "Sphere" ),
				offset: 0
			},
			{
				model : NX_GEOMETRY.createBaseCube(),
				offset: 0
			},
			{
				model : NX_GEOMETRY.createArrow(),
				offset: 0
			}
		]
		
		pipelines = [
			NX_EARTH_PIPELINE,
			NX_MOON_PIPELINE,
			NX_SIMPLE_GLOW_PIPELINE,
			NX_FULLSCREEN_PIPELINE
		];
		
		loadShaderSources();
	}
	
	function loadShaderSources()
	{
		var fileEnding = ".txt";
		var prefix = "shader/"
		var finishedShaderCount = 2*pipelines.length;

		function getShaderFile( id_object ) {
			return id_object.pipeline.identifier + '_' + id_object.type + 'Shader' + fileEnding;
		};

		function ErrorHandler(response, object) {
			updateStatus( 'Failed to load fragment shader "' + getShaderFile( object ) + '".', object.type + object.pipeline.identifier );
		}

		function SuccessHandler(response, object) {
			updateStatus( 'Complete loading fragment shader "' + getShaderFile( object ) + '".', object.type + object.pipeline.identifier );

			if (object.type == 'f') {
				object.pipeline.fragmentSource = response;
			}
			else {
				object.pipeline.vertexSource = response;
			}

			--finishedShaderCount
			if( finishedShaderCount === 0 ) {
				if( status )
				{
					status.innerHTML = '';
				}
				loadTextureSources( gl );
			}
		}
		
		function ShaderId( pipeline, type )
		{
			this.pipeline = pipeline;
			this.type = type;
		};
		
		function getSource( pipeline, type ) {
			var shaderId = new ShaderId( pipeline, type );
			var shaderFile = getShaderFile( shaderId );
			appendStatus('Loading vertex shader "' + shaderFile + '" ...', shaderId.type + shaderId.pipeline.identifier );
			NXJS.OpenAsyncGET( prefix + shaderFile, false, SuccessHandler, ErrorHandler, shaderId );
		}
		
		for( var pipeline in pipelines )
		{
			getSource( pipelines[pipeline], 'v' );
			getSource( pipelines[pipeline], 'f' );
		}
	}
	
	function initializeTextures() {
		for( const texture of textures )
		{
			texture.texture = gl.createTexture();
			gl.bindTexture( gl.TEXTURE_2D, texture.texture );
			gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
			
			gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
			
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
			gl.generateMipmap( gl.TEXTURE_2D );
			gl.bindTexture( gl.TEXTURE_2D, null );
		}
		render();
	}
	
	function loadTextureSources( gl ) {
		var textureCount = textures.length;
		
		function onLoad( event ) {
			updateStatus( "Complete loading texture " + this.src + ".", this.src.replace( /^.*[\\\/]/, '' ) );
			--textureCount;
			if ( textureCount === 0 ) {
				initializeTextures();
			}
		}
		
		function onError( event ) {
			updateStatus( "Failed to load texture " + this.src + ". Please reload web page.", this.src.replace( /^.*[\\\/]/, '' ) );
		}
		
		for ( let texture of textures ) {
			texture.image = new Image();

			appendStatus( "Loading texture " + texture.source + "...", texture.source.replace( /^.*[\\\/]/, '' ) );

			texture.image.onerror = onError;
			texture.image.onload = onLoad;
			texture.image.src = texture.source;
		}
	}
	
	function initializePipelines()
	{	
		for( var pipeline of pipelines )
		{			
			var vertexShader = gl.createShader( gl.VERTEX_SHADER );
			var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );

			// Programm-Objekte für die Shader
			pipeline.program = gl.createProgram();
			
			// zuordnen des Quellcodes zu den Shader-Objekten
			gl.shaderSource( vertexShader, pipeline.vertexSource );
			gl.shaderSource( fragmentShader, pipeline.fragmentSource );

			// kompilieren der Shader-Programme
			gl.compileShader( vertexShader );
			gl.compileShader( fragmentShader );

			console.log( pipeline.identifier + "_vShader\n" + gl.getShaderInfoLog( vertexShader ));
			console.log( pipeline.identifier + "_fShader\n" + gl.getShaderInfoLog( fragmentShader ));

			// anhängen der Shaderprogramme an das Träger Programm
			gl.attachShader( pipeline.program, vertexShader );
			gl.attachShader( pipeline.program, fragmentShader );

			// das Trägerprogramm wird abschliessend gelinkt
			gl.linkProgram( pipeline.program );
			
			pipeline.reflect( gl );
		}
	}

	function initializeBuffers() {

		// count polys
		let polycount = 0;
		for( let geometryObject of geometry )
		{
			geometryObject.offset = polycount;
			polycount += geometryObject.model.polycount;
		}
		
		// collect vertieces
		let localBuffer = new Float32Array( 33 * polycount );
		let offset = 0;
		for( var geometryObject of geometry )
		{
			offset = geometryObject.model.getVertexAttributes( localBuffer, offset );
		}
		
		// setup device vertex buffer;
		deviceVertexBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, deviceVertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, localBuffer, gl.STATIC_DRAW );
	}

	function gauß(a, b) {
		var pivot = 0;
		var index = 0;
		var z = [0, 1, 2];

		for (i = 0; i < 3; i++) {
			var p = Math.abs(a[i][0]);
			if (pivot < p) {
				pivot = p;
				index = i;
			}
		}

		var tmp = z[index];
		z[index] = z[0];
		z[0] = tmp;

		pivot = a[z[1]][0] / a[z[0]][0];
		a[z[1]][0] = 0;
		a[z[1]][1] = a[z[1]][1] - a[z[0]][1] * pivot;
		a[z[1]][2] = a[z[1]][2] - a[z[0]][2] * pivot;
		b[z[1]] = b[z[1]] - b[z[0]] * pivot;

		pivot = a[z[2]][0] / a[z[0]][0];
		a[z[2]][0] = 0;
		a[z[2]][1] = a[z[2]][1] - a[z[0]][1] * pivot;
		a[z[2]][2] = a[z[2]][2] - a[z[0]][2] * pivot;
		b[z[2]] = b[z[2]] - b[z[0]] * pivot;

		if (Math.abs(a[z[1]][1]) < Math.abs(a[z[2]][1])) {
			tmp = z[1];
			z[1] = z[2];
			z[2] = tmp;
		}

		pivot = a[z[2]][1] / a[z[1]][1];

		a[z[2]][1] = 0;
		a[z[2]][2] = a[z[2]][2] - a[z[1]][2] * pivot;
		b[z[2]] = b[z[2]] - b[z[1]] * pivot;

		if (a[z[2]][2] == 0) {
			return undefined
		}

		var s = b[z[2]] / a[z[2]][2];
		var r = (b[z[1]] - s * a[z[1]][2]) / a[z[1]][1];
		var t = (b[z[0]] - s * a[z[0]][2] - r * a[z[0]][1]) / a[z[0]][0];

		return [t, r, s];
	}

	function collision( obj ) {
		var collPoint = false;
		var old_abs = false;

		var width = sceneGraph.cameras[sceneGraph.MAIN_CAMERA].width;
		var height = sceneGraph.cameras[sceneGraph.MAIN_CAMERA].height;
		var camMat = sceneGraph.cameras[sceneGraph.MAIN_CAMERA].ownMat;
		var objPly = geometry[obj.leaf.geometryIndex].vertices;
		var objMat = obj.ownMat;

		var p0 = camMat.multiply(new Vec3(0, 0, 0));
		var p1 = camMat.multiply(new Vec3(input.old_clientX / gl.bufferWidth * width - width / 2, -1 * (input.old_clientY / gl.bufferHeight * height - height / 2), -1 * sceneGraph.cameras[sceneGraph.MAIN_CAMERA].near)).sub(p0);

		var pm = new Vec3(objMat[12], objMat[13], objMat[14]);
		var p2 = p0.sub(pm);
		var r = 6.403;
		var a = p1[0] * p1[0] + p1[1] * p1[1] + p1[2] * p1[2];
		var b = 2 * p2[0] * p1[0] + 2 * p2[1] * p1[1] + 2 * p2[2] * p1[2];
		var c = p2[0] * p2[0] + p2[1] * p2[1] + p2[2] * p2[2] - r * r;

		var root = Math.sqrt(b * b - 4 * a * c);

		if (typeof (root) == "number") {
			var t1 = (-b + root) / (2 * a);
			var t2 = (-b - root) / (2 * a);

			if (t1 < t2) {
				collPoint = p0.add(p1.scalar(t1));
			}
			else {
				collPoint = p0.add(p1.scalar(t2));
			}
		}
		if( Number.isNaN( collPoint[0] ) || Number.isNaN( collPoint[1] ) || Number.isNaN( collPoint[2] ) )
		{
			return false;
		}
		return collPoint;
	}

	function tick() {
		var c = new Date();
		sceneGraph.timer.setFrame();
		drawScene();
		
		var m = sceneGraph.cameras[sceneGraph.MAIN_CAMERA].ownMat.reverse();
		
		if( status && status.innerHTML )
		{
			var end = c.getTime();
			if ( end - gl.timer > 1000 ) {
				status.innerHTML = "Polycount: " + sceneGraph.pCount
					+ "<br>FpS: " + gl.fps
					+ '<br>Zeitfaktor: '+ sceneGraph.timer.multi + 'x';
					/*
					+ '<table cellpadding="5" cellspacing="0">'+
					+ '<tr><td align="left">Legend</td><td align="left"></td></tr>'
					+	'<tr><td align="left">'+m[0]+'</td><td align="left">'+m[4]+'</td><td align="left">'+m[8]+'</td><td align="left">'+m[12]+'</td></tr>'
					+	'<tr><td align="left">'+m[1]+'</td><td align="left">'+m[5]+'</td><td align="left">'+m[9]+'</td><td align="left">'+m[13]+'</td></tr>'
					+	'<tr><td align="left">'+m[2]+'</td><td align="left">'+m[6]+'</td><td align="left">'+m[10]+'</td><td align="left">'+m[14]+'</td></tr>'
					+	'<tr><td align="left">'+m[3]+'</td><td align="left">'+m[7]+'</td><td align="left">'+m[11]+'</td><td align="left">'+m[15]+'</td></tr>'
					+'</table>';
					*/
				gl.timer = end;
				gl.fps = 0;
			}
			gl.fps++;
		}
		requestAnimationFrame(tick);
	}
	
	function bindPipeline( pipelineIndex ) {
		let pipeline = pipelines[pipelineIndex];
		pipeline.setUniformsPerFrame( gl, sceneGraph.cameras[sceneGraph.MAIN_CAMERA].ownMat, createPerspMat( sceneGraph.cameras[sceneGraph.MAIN_CAMERA] ) );
	}
	
	function drawObject( pipelineIndex, renderable ) {
		var pipeline = pipelines[pipelineIndex];
		switch( pipeline.identifier )
		{
			case "ObjectGlow":
			{
				pipeline.setUniformsPerObject( gl, renderable );
				break;
			}
			case "Moon":
			{
				let sunPosition = new Vec3( sceneGraph.sGraph.ownMat[12], sceneGraph.sGraph.ownMat[13], sceneGraph.sGraph.ownMat[14] );
				pipeline.setUniformsPerObject( gl, renderable, textures, sunPosition );
				break;
			}
			case "Earth":
			{
				let sunPosition = new Vec3( sceneGraph.sGraph.ownMat[12], sceneGraph.sGraph.ownMat[13], sceneGraph.sGraph.ownMat[14] );
				pipeline.setUniformsPerObject( gl, renderable, textures, sunPosition, sceneGraph.impactPoint, sceneGraph.impactProgress );
				break;
			}
			default:
			{
				console.log( 'unkown pipeline: "' + pipeline.identifier + '"!' );
				break;
			}
		}
		const geometryObject = geometry[renderable.geometryIndex];
		gl.drawArrays( gl.TRIANGLES, 3*geometryObject.offset, 3*geometryObject.model.polycount );
		sceneGraph.pCount = sceneGraph.pCount + geometryObject.model.polycount;
	}
	
	function drawScene() {
		// Lookup the size the browser is displaying the canvas.
		var displayWidth = canvas.clientWidth;
		var displayHeight = canvas.clientHeight;

		// Check if the canvas is not the same size.
		if (canvas.width != displayWidth || canvas.height != displayHeight) {
			canvas.width = displayWidth;
			canvas.height = displayHeight;
		}

		if (gl.bufferWidth != canvas.width || gl.bufferHeight != canvas.height) {
			gl.bufferWidth = canvas.width;
			gl.bufferHeight = canvas.height;
			//initializeFramebuffer();
		}
		
		sceneGraph.cameras[sceneGraph.MAIN_CAMERA].setRatio(canvas.width / canvas.height);
		sceneGraph.calcSceneTransformation();
		
		var renderables = new Array();
		sceneGraph.getRenderables( renderables );
		sceneGraph.pCount = 0;
		
		// beauty render pass
		gl.bindFramebuffer(gl.FRAMEBUFFER, null );
		//gl.bindFramebuffer(gl.FRAMEBUFFER, gl.beautyFramebuffer );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.bindBuffer( gl.ARRAY_BUFFER, deviceVertexBuffer );
		gl.vertexAttribPointer( NX_VERTEX_BUFFER_LOCATION, 3, gl.FLOAT, false, 44, 0 );
		gl.vertexAttribPointer( NX_NORMAL_BUFFER_LOCATION, 3, gl.FLOAT, false, 44, 12 );
		gl.vertexAttribPointer( NX_TANGENT_BUFFER_LOCATION, 3, gl.FLOAT, false, 44, 24 );
		gl.vertexAttribPointer( NX_UV_BUFFER_LOCATION, 2, gl.FLOAT, false, 44, 36 );
		
		gl.enableVertexAttribArray( NX_VERTEX_BUFFER_LOCATION );
		gl.enableVertexAttribArray( NX_NORMAL_BUFFER_LOCATION );
		gl.enableVertexAttribArray( NX_TANGENT_BUFFER_LOCATION );
		gl.enableVertexAttribArray( NX_UV_BUFFER_LOCATION );
		
		var currentPipelineIndex = -1;
		for( const renderable of renderables )
		{
			if( renderable.pipelineIndex != currentPipelineIndex )
			{
				currentPipelineIndex = renderable.pipelineIndex;
				bindPipeline( currentPipelineIndex )
			}
			drawObject( currentPipelineIndex, renderable );
		}
		
		// post redner pass( glow )
		/*
		let postPipeline = pipelines[3]
		
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.useProgram( postPipeline.program );
		
		gl.uniform1i( postPipeline.uniforms.screenSampler, 0 );
		gl.uniform2fv( postPipeline.uniforms.screenSize, new Float32Array([gl.bufferWidth, gl.bufferHeight]));
		
		gl.activeTexture( gl.TEXTURE0 );
		gl.bindTexture( gl.TEXTURE_2D, gl.beautyPass );
		gl.drawArrays( gl.TRIANGLES, 0, 3 );
		*/
	}

	function KeyPress(event) {

		switch (event.keyCode) {
			case 38:	// arrow up
				input.moveY -= 0.05;
				event.preventDefault();
				break;

			case 40:	// arrow down
				input.moveY += 0.05;
				event.preventDefault();
				break;

			case 37:	// arrow left
				input.moveX -= 0.05;
				event.preventDefault();
				break;

			case 39:	// arrow right
				input.moveX += 0.05;
				event.preventDefault();
				break;

			case 33:	// img up
				input.dis += 1;
				event.preventDefault();
				break;

			case 34:	// img down
				input.dis -= 1;
				event.preventDefault();
				break;

			case 32:	//Space 
				resetCamera()

				event.preventDefault();
				break;

			case 107:
				sceneGraph.timer.multi += 10000;
				event.preventDefault();
				break;

			case 109:
				sceneGraph.timer.multi -= 10000;
				if (sceneGraph.timer.multi < 1) sceneGraph.timer.multi = 1;
				event.preventDefault();
				break;

			case 88:
				if ( !sceneGraph.impactProgress )
				{
					input.fire_mode = !input.fire_mode
					if (input.fire_mode) {
						sceneGraph.oldTimeMulti = sceneGraph.timer.multi;
						sceneGraph.timer.multi = 1;
					}
					else
					{
						sceneGraph.timer.multi = sceneGraph.oldTimeMulti;
					}
				}
				event.preventDefault();
				break;
		}
	}
	
	function resetCamera()
	{
		input.dis = -24;
		input.moveX = 90;
		input.moveY = 0;
		input.mX = 0;
		input.mY = 0;

		input.fire = false;
		input.down = false;
		input.fire_mode = false;
		
		sceneGraph.cameras[sceneGraph.MAIN_CAMERA].localMatrix = new Mat4();
		sceneGraph.timer.multi = 10000;
		sceneGraph.impactProgress = 0.0;
	}
	
	function MouseMove(event) {
		if (input.down) {
			input.moveY += ( input.old_clientY - event.clientY )/canvas.height;
			input.moveX += ( input.old_clientX - event.clientX )/canvas.width;
		}
		input.old_clientX = event.clientX;
		input.old_clientY = event.clientY;
	}

	function MouseDown(event) {
		if (input.fire_mode) {
			input.fire = true;
		}
		else {
			input.down = true;
		}
	}

	function MouseUp(event) {
		if (input.down) {
			input.down = false;
		}
	}

	function appendStatus(text, id) {
		if( status && typeof( status.innerHTML ) !== 'undefine' )
		{
			status.innerHTML += '<pre id="' + id + '">' + text + '<\pre>';
		}
	}

	function updateStatus(text, id) {
		var object = document.getElementById(id);
		if (object) {
			object.innerHTML = text;
		}
	}
	
	function onTouchStart( event )
	{
		event.preventDefault();
		if( !canvas.ontouchmove )
		{
			canvas.ontouchmove = onTouchMove;
		}
		input.old_clientX = 0;
		input.old_clientY = 0;
		input.touchDistance = 0;
		
		if( event.touches.length == 1 )
		{
			if( input.doubleTapStart )
			{
				let delta = performance.now() - input.doubleTapStart;
				delete input.doubleTapStart;
				if( delta < 1000 )
				{
					if( sceneGraph.impactProgress )
					{
						resetCamera()
					}
					else
					{
						input.fire = true;
						sceneGraph.oldTimeMulti = sceneGraph.timer.multi;
						input.old_clientX = event.touches[0].clientX;
						input.old_clientY = event.touches[0].clientY;
					}
				}
			}
			else
			{
				input.doubleTapStart = performance.now();
			}
		}
		else
		{
			delete input.doubleTapStart;
		}
	}
	
	function onTouchEnd( event )
	{
	}
	
	function onTouchMove( event )
	{
		event.preventDefault();
		
		if( event.touches.length === 1 )
		{
			if( input.old_clientX > 0 || input.old_clientY > 0 )
			{
				input.moveY += ( input.old_clientY - event.touches[0].clientY )/canvas.height;
				input.moveX += ( input.old_clientX - event.touches[0].clientX )/canvas.width;
			}
			input.old_clientX = event.touches[0].clientX;
			input.old_clientY = event.touches[0].clientY;	
		}
		else if( event.touches.length > 1 )
		{
			let distance = new Vec2( event.touches[0].clientX, event.touches[0].clientY ).sub( new Vec2( event.touches[1].clientX, event.touches[1].clientY ) ).abs();
			if( input.touchDistance > 0 )
			{
				input.dis -= ( input.touchDistance - distance ) / 30.0;
			}
			input.touchDistance = distance;
		}
	}

	function initializeInput() {
		input = [];
		resetCamera();
		document.onkeydown = KeyPress;
		canvas.onmousemove = MouseMove;
		canvas.onmousedown = MouseDown;
		canvas.onmouseup = MouseUp;
		
		//canvas.ontouchmove   = onTouchMove;
		//canvas.ontouchend    = onTouchEnd;
		//canvas.ontouchcancel = onTouchCancel;
		canvas.ontouchstart  = onTouchStart;
	}

	function render() {
		initializeBuffers();
		initializePipelines();
		initializeScene();
		initializeInput();

		gl.timer = new Date().getTime();
		gl.fps = 0;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);

		if( legend && legend.style )
		{
			legend.style.display = '';
			
			if( isTouchDevice() )
			{
				let table = legend.children[0].children[0]
				
				table.innerHTML = 
					'<tr><td align="left">Legend</td><td align="left"></td></tr>' +
				    '<tr><td align="left">Swipe:</td><td align="left">Move camera</td></tr>' +
					'<tr><td align="left">Pinch:</td><td align="left">Zoom camera</td></tr>' +
					'<tr><td align="left">Double tap:</td><td align="left">Transformation/Reset</td></tr>';
			}
		}
		tick();
	}

	this.loadWebGL = function( render_canvas, status_div, legend_div ) {
		if( render_canvas )
		{
			canvas = render_canvas;
			legend = legend_div;
			status = status_div;
			
			initializeGl();
		}
	}
}