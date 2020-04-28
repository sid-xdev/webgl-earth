function PlanetDemo()
{
	var webGlVersion = 2;
	
	var gl;
	var sg;
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
	
	function initializeScene() {
		sg = new Scenegraph();
		
		var nSun = new gNode("Sun" );/*, 	//Nodename 
			new pLeaf(sphereGeometryIndex, // geometry-index
				10, // colortex-index 
				0, // uvmap-index 
				10, // trensparent-index
				0, // normal-index 
				0, // spectular-index 
				0, // reflection-index
				10)); // glow-index*/
				
		nSun.transformation = function (mat) {
			this.ownMat = Mat4.scale(34.8175, 34.8175, 34.8175);
			this.childMat = mat;
			return mat;
		}


		sg.cameras[sg.MAIN_CAMERA] = new cNode("Camera", 35, 1, 1, 10000);
		sg.cameras[sg.MAIN_CAMERA].transformation = function (mat) {
			var pitch = Mat4.rotate(input.mY, new Vec3(1, 0, 0));
			var yaw = Mat4.rotate(input.mX, new Vec3(0, 1, 0));
			var rot = yaw.multiply(pitch);
			var rotY = Mat4.rotate(input.lon, new Vec3(0, 1, 0));
			var rotX = Mat4.rotate(input.lat, new Vec3(1, 0, 0));

			rot = rotY.multiply(rotX.multiply(Mat4.translate(0, 0, 12.756 / 2 + input.dis).multiply(rot)));
			this.ownMat = Mat4.translate(mat[12], mat[13], mat[14]).multiply(rot);
			this.childMat = this.ownMat;

			return this.childMat;
		};

		var nEarthGroup = new gNode("EarthGroup");
		nEarthGroup.transformation = function (mat) {
			var time = sg.timer.gameTime;
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

		var nStars = new gNode("Stars");/*, //Nodename
			new pLeaf( 
					cubeGeometryIndex, //geometry-index
				7, // colortex-index 
				0, // uvmap-index 
				10, // trensparent-index
				0, // normal-index 
				0, // spectular-index 
				0, // reflection-index
				0));// glow-index*/
		nStars.transformation = function (mat) {
			var trn = Mat4.translate(mat[12], mat[13], mat[14]);
			var scl = Mat4.scale(8000, 8000, 8000)

			this.ownMat = trn.multiply(scl);
			this.childMat = trn;

			return this.childMat;
		};

		var nEarth = new GeometryNode("Earth", //Nodename
			new Earth( getGeomtryIndex( "Sphere" ), getPipelineIndex( "Earth" ), 
						getTextureIndex("earth_day"), getTextureIndex("earth_night"), getTextureIndex("earth_height"), getTextureIndex("earth_water"), getTextureIndex("earth_clouds"), ) );
			
		nEarth.transformation = function (mat) {
			var rot = Mat4.rotate(31.717474, new Vec3(0, 0, 1));
			var scl = Mat4.scale(6.378, 6.378, 6.378);//(6.378)
			var newMat = mat.multiply(rot);

			this.ownMat = newMat.multiply(scl);
			this.childMat = newMat;

			return this.childMat;
		};

		var nMoon = new gNode( "Moon" );//, new pLeaf(sphereGeometryIndex, 2/*cTex*/, 0/*cUV*/, 10/*tTex*/, 0/*bTex*/, 0/*sTex*/, 0/*rTex*/));
		nMoon.transformation = function (mat) {
			var time = sg.timer.gameTime;
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
			var time = sg.timer.gameTime;

			if (input.fire && !this.click || input.fire_mode) {
				vec = collision(this.parent);

				if (input.fire && vec) {
					gl.earthProgram.impactPoint = vec;
					gl.earthProgram.impactRadius = 0;
					this.click = true;
				}
			}

			if (!vec) {
				vec = new Vec3(0, 0, 0);
			}

			if (this.click) {
				if (!input.fire) {
					gl.earthProgram.impactRadius = 0;
					this.click = false;
				}
				else {
					gl.earthProgram.impactRadius += sg.timer.getDelta() / 1000 * 0.5;
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
		/*
		var markerT = new pLeaf(arrowGeomtryIndex, 10, 0, 10, 0, 0, 0, 10);
		var markerR = new pLeaf(arrowGeomtryIndex, 10, 0, 10, 0, 0, 0, 10);
		var markerL = new pLeaf(arrowGeomtryIndex, 10, 0, 10, 0, 0, 0, 10);
		var markerB = new pLeaf(arrowGeomtryIndex, 10, 0, 10, 0, 0, 0, 10);
		*/
		
		var nMarkTop = new gNode("MarkTop");//, markerT);
		nMarkTop.lightState = 0;
		nMarkTop.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(-90, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkLeft = new gNode( "MarkLeft" );//, markerL);
		nMarkLeft.lightState = 0;
		nMarkLeft.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(180, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkRight = new gNode( "MarkRight" );//, markerR);
		nMarkRight.lightState = 0;
		nMarkRight.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(0, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkBottom = new gNode( "MarkBottom" );//, markerB);
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
		nEarthGroup.addChild(nStars);
		nEarthGroup.addChild(sg.cameras[sg.MAIN_CAMERA]);
		nEarthGroup.addChild(nMoon);
		nSun.addChild(nEarthGroup);
		sg.addGraph(nSun);
	}

	function initializeFramebuffer() {
		
		gl.beautyFramebuffer = gl.createFramebuffer();
		gl.bindFramebuffer( gl.FRAMEBUFFER, gl.beautyFramebuffer );

		gl.beautyRenderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, gl.beautyRenderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.bufferWidth, gl.bufferHeight);

		gl.beautyPass = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, gl.beautyPass);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.bufferWidth, gl.bufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gl.beautyPass, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.beautyRenderbuffer);

		gl.glowFramebuffer = new Array(2);
		gl.glowPass = new Array(2);
		gl.glowRenderbuffer = new Array(2);

		gl.glowFramebuffer[0] = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, gl.glowFramebuffer[0]);

		gl.glowRenderbuffer[0] = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, gl.glowRenderbuffer[0]);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.bufferWidth, gl.bufferHeight);

		gl.glowPass[0] = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, gl.glowPass[0]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.bufferWidth, gl.bufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gl.glowPass[0], 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.glowRenderbuffer[0]);

		gl.glowFramebuffer[1] = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, gl.glowFramebuffer[1]);

		gl.glowRenderbuffer[1] = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, gl.glowRenderbuffer[1]);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.bufferWidth, gl.bufferHeight);

		gl.glowPass[1] = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, gl.glowPass[1]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.bufferWidth, gl.bufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gl.glowPass[1], 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.glowRenderbuffer[1]);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
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
				identifier : "earth_height",
				source : "img/bump.jpg",
			},
			{
				identifier : "earth_water",
				source : "img/spec.jpg",
			},
			{
				identifier : "earth_clouds",
				source : "img/cloud.jpg",
			},
			{
				identifier : "stars",
				source : "img/stars.jpg",
			}
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
			NX_EARTH_PIPELINE
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

	function initUniform() {
		gl.earthProgram.impactPoint = new Vec3(0, 0, 0);
		gl.earthProgram.impactRadius = 0;

		gl.earthProgram.uni =
		{
			perMatPointer: gl.getUniformLocation(gl.earthProgram, "uPerspMat"),
			camMatPointer: gl.getUniformLocation(gl.earthProgram, "uCameraMat"),
			posMatPointer: gl.getUniformLocation(gl.earthProgram, "uModelMat"),

			diffTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexDiffusSampler"),
			tranTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexTransparentSampler"),
			normTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexNormalSampler"),
			specTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexSpecularSampler"),
			darkTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexDarkSampler"),
			glowTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexGlowSampler"),
			burnTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexBurnSampler"),
			ruinTexSampler: gl.getUniformLocation(gl.earthProgram, "uTexRuinSampler"),

			lightStatePointer: gl.getUniformLocation(gl.earthProgram, "uLightState"),
			glowStatePointer: gl.getUniformLocation(gl.earthProgram, "uGlowState"),
			glowColorPointer: gl.getUniformLocation(gl.earthProgram, "uGlowColor"),

			sunPosPointer: gl.getUniformLocation(gl.earthProgram, "uSunPosition"),
			sunColorPointer: gl.getUniformLocation(gl.earthProgram, "uSunColor"),
			inpPosPointer: gl.getUniformLocation(gl.earthProgram, "uImpactPosition"),
			dmgRadPointer: gl.getUniformLocation(gl.earthProgram, "uDamageRadius")
		};

		gl.earthProgram.setUniformsPerFrame = function () {
			gl.useProgram(this);

			gl.uniformMatrix4fv(this.uni.camMatPointer, false, new Float32Array(sg.cameras[sg.MAIN_CAMERA].ownMat));
			gl.uniformMatrix4fv(this.uni.perMatPointer, false, new Float32Array(createPerspMat(sg.cameras[sg.MAIN_CAMERA])));

			gl.uniform1i(this.uni.diffTexSampler, 0);
			gl.uniform1i(this.uni.tranTexSampler, 1);
			gl.uniform1i(this.uni.normTexSampler, 2);
			gl.uniform1i(this.uni.specTexSampler, 3);
			gl.uniform1i(this.uni.darkTexSampler, 4);
			gl.uniform1i(this.uni.glowTexSampler, 5);
			gl.uniform1i(this.uni.burnTexSampler, 6);
			gl.uniform1i(this.uni.ruinTexSampler, 7);

			gl.uniform1f(this.uni.dmgRadPointer, this.impactRadius);
			gl.uniform3fv(this.uni.sunPosPointer, new Float32Array([0, 0, 0]));
			gl.uniform3fv(this.uni.sunColorPointer, new Float32Array([1, 1, 1]));
			gl.uniform3fv(this.uni.inpPosPointer, new Float32Array(this.impactPoint));
		};

		gl.earthProgram.setUniformsPerLeaf = function (leaf) {
			gl.uniformMatrix4fv(this.uni.posMatPointer, false, new Float32Array(leaf.posMat));

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.diffuse]);

			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.transparent]);

			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.normal]);

			gl.activeTexture(gl.TEXTURE3);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.specular]);

			gl.activeTexture(gl.TEXTURE4);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.reflection]);

			gl.activeTexture(gl.TEXTURE5);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.glow]);

			// gl.activeTexture( gl.TEXTURE6 );
			// gl.bindTexture( gl.TEXTURE_2D, gl.texList[leaf.burn] );
			// gl.uniform2fv( this.uni.reflOffsetPointer, new Float32Array( leaf.reflection_offset ) );

			// gl.activeTexture( gl.TEXTURE7 );
			// gl.bindTexture( gl.TEXTURE_2D, gl.texList[leaf.ruin] );
			// gl.uniform2fv( this.uni.reflOffsetPointer, new Float32Array( leaf.reflection_offset ) );
		};

		gl.colorProgram.uni =
		{
			perMatPointer: gl.getUniformLocation(gl.colorProgram, "uPerspMat"),
			camMatPointer: gl.getUniformLocation(gl.colorProgram, "uCameraMat"),
			posMatPointer: gl.getUniformLocation(gl.colorProgram, "uModelMat"),

			diffTexSampler: gl.getUniformLocation(gl.colorProgram, "uTexDiffusSampler"),
			tranTexSampler: gl.getUniformLocation(gl.colorProgram, "uTexTransparentSampler"),
			normTexSampler: gl.getUniformLocation(gl.colorProgram, "uTexNormalSampler"),
			specTexSampler: gl.getUniformLocation(gl.colorProgram, "uTexSpecularSampler"),
			reflTexSampler: gl.getUniformLocation(gl.colorProgram, "uTexReflectionSampler"),
			glowTexSampler: gl.getUniformLocation(gl.colorProgram, "uTexGlowSampler"),

			diffOffsetPointer: gl.getUniformLocation(gl.colorProgram, "uTexDiffusOffset"),
			tranOffsetPointer: gl.getUniformLocation(gl.colorProgram, "uTexTransparentOffset"),
			normOffsetPointer: gl.getUniformLocation(gl.colorProgram, "uTexNormalOffset"),
			specOffsetPointer: gl.getUniformLocation(gl.colorProgram, "uTexSpecularOffset"),
			reflOffsetPointer: gl.getUniformLocation(gl.colorProgram, "uTexReflectionOffset"),

			lightStatePointer: gl.getUniformLocation(gl.colorProgram, "uLightState"),
			glowStatePointer: gl.getUniformLocation(gl.colorProgram, "uGlowState"),
			glowColorPointer: gl.getUniformLocation(gl.colorProgram, "uGlowColor"),

			lightCountPointer: gl.getUniformLocation(gl.colorProgram, "uLightCount"),
			lightColorPointer: gl.getUniformLocation(gl.colorProgram, "uLightColor"),
			lightPosPointer: gl.getUniformLocation(gl.colorProgram, "uLightPosition"),

			amblightColorPointer: gl.getUniformLocation(gl.colorProgram, "uAmbLightColor")
		};
		/*
		gl.colorProgram.setUniformsPerFrame = function () {
			gl.useProgram(this);

			gl.uniformMatrix4fv(this.uni.camMatPointer, false, new Float32Array(sg.cameras[sg.MAIN_CAMERA].ownMat));
			gl.uniformMatrix4fv(this.uni.perMatPointer, false, new Float32Array(createPerspMat(sg.cameras[sg.MAIN_CAMERA])));

			gl.uniform1i(this.uni.diffTexSampler, 0);
			gl.uniform1i(this.uni.tranTexSampler, 1);
			gl.uniform1i(this.uni.normTexSampler, 2);
			gl.uniform1i(this.uni.specTexSampler, 3);
			gl.uniform1i(this.uni.reflTexSampler, 4);
			gl.uniform1i(this.uni.glowTexSampler, 5);

			gl.uniform1i(this.uni.lightCountPointer, 1);

			gl.uniform3fv(this.uni.lightPosPointer, new Float32Array([0, 0, 0]));
			gl.uniform3fv(this.uni.lightColorPointer, new Float32Array([0.95, 0.95, 0.95]));
			gl.uniform3fv(this.uni.amblightColorPointer, new Float32Array([0.05, 0.05, 0.05]));
		};

		gl.colorProgram.setUniformsPerLeaf = function (leaf) {
			gl.uniformMatrix4fv(this.uni.posMatPointer, false, new Float32Array(leaf.posMat));

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.diffuse]);
			gl.uniform2fv(this.uni.diffOffsetPointer, new Float32Array(leaf.diffuse_offset));

			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.transparent]);
			gl.uniform2fv(this.uni.tranOffsetPointer, new Float32Array(leaf.transparent_offset));

			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.normal]);
			gl.uniform2fv(this.uni.normOffsetPointer, new Float32Array(leaf.normal_offset));

			gl.activeTexture(gl.TEXTURE3);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.specular]);
			gl.uniform2fv(this.uni.specOffsetPointer, new Float32Array(leaf.specular_offset));

			gl.activeTexture(gl.TEXTURE4);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.reflection]);
			gl.uniform2fv(this.uni.reflOffsetPointer, new Float32Array(leaf.reflection_offset));

			gl.activeTexture(gl.TEXTURE5);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[leaf.glow]);
		};

		gl.blurProgram.uni =
		{
			blurSamplerPointer: gl.getUniformLocation(gl.blurProgram, "uBlurLayerSampler"),
			resPointer: gl.getUniformLocation(gl.blurProgram, "uResolution")
		};

		gl.compProgram.uni =
		{
			colorSamplerPointer: gl.getUniformLocation(gl.compProgram, "uBeautyLayerSampler"),
			glowSamplerPointer: gl.getUniformLocation(gl.compProgram, "uGlowLayerSampler")
		};
		*/
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

		var width = sg.cameras[sg.MAIN_CAMERA].width;
		var height = sg.cameras[sg.MAIN_CAMERA].height;
		var camMat = sg.cameras[sg.MAIN_CAMERA].ownMat;
		var objPly = geometry[obj.leaf.geometryIndex].vertices;
		var objMat = obj.ownMat;

		var p0 = camMat.multiply(new Vec3(0, 0, 0));
		var p1 = camMat.multiply(new Vec3(input.old_clientX / gl.bufferWidth * width - width / 2, -1 * (input.old_clientY / gl.bufferWidth * height - height / 2), -1 * sg.cameras[sg.MAIN_CAMERA].near)).sub(p0);

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
		return collPoint;
	}

	function tick() {
		var c = new Date();
		sg.timer.setFrame();
		drawScene();
		
		var m = sg.cameras[sg.MAIN_CAMERA].ownMat.reverse();
		
		if( status && status.innerHTML )
		{
			var end = c.getTime();
			if ( end - gl.timer > 1000 ) {
				status.innerHTML = "Polycount: " + sg.pCount
					+ "<br>FpS: " + gl.fps
					+ '<br>Zeitfaktor: '+ sg.timer.multi + 'x';
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

	function drawPerObject(node, index, glow, program) {
		var len = node.childs.length;

		if ( node.constructor === gNode && node.type == "program" ) {
			program = gl[node.name];
			program.setUniformsPerFrame();
		}

		for (var i = 0; i < len; i++) {
			index = drawPerObject(node.childs[i], index, glow, program);
		}

		if ( node.constructor === pNode && node.show ) {
			
			program.setUniformsPerLeaf(node.leaf);
			
			index += 3 * node.ownPolycount;
		}

		return index;
	}

	function drawGlowPerObject(node, index) {
		var len = node.childs.length;
		for (var i = 0; i < len; i++) {
			index = drawGlowPerObject(node.childs[i], index);
		}

		if (node.constructor === pNode) {
			gl.uniformMatrix4fv(gl.colorProgram.uni.posMatPointer, false, new Float32Array(node.leaf.posMat));

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, gl.texList[node.leaf.glow]);

			gl.drawArrays(gl.TRIANGLES, index, 3 * node.ownPolycount);
			index += 3 * node.ownPolycount;
		}
		return index;
	}
	
	function bindPipeline( pipelineIndex ) {
		var pipeline = pipelines[pipelineIndex];
		switch( pipeline.identifier )
		{
			case "Earth":
			{
				//camera matrix, perspectiv matrix
				pipeline.setUniformsPerFrame( gl, sg.cameras[sg.MAIN_CAMERA].ownMat, createPerspMat( sg.cameras[sg.MAIN_CAMERA] ) );
				break;
			}
			default:
			{
				pipeline.setUniformsPerFrame();
				break;
			}
		}
	}
	
	function drawObject( pipelineIndex, renderable ) {
		var pipeline = pipelines[pipelineIndex];
		switch( pipeline.identifier )
		{
			case "Earth":
			{
				//camera matrix, perspectiv matrix
				pipeline.setUniformsPerObject( gl, renderable, textures, new Vec3( sg.sGraph.ownMat[12], sg.sGraph.ownMat[13], sg.sGraph.ownMat[14] ) );
				break;
			}
			default:
			{
				pipeline.setUniformsPerFrame();
				break;
			}
		}
		const geometryObject = geometry[renderable.geometryIndex];
		gl.drawArrays( gl.TRIANGLES, 3*geometryObject.offset, 3*geometryObject.model.polycount );
		sg.pCount = sg.pCount + geometryObject.model.polycount;
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
			initializeFramebuffer();
		}
		
		
		sg.cameras[sg.MAIN_CAMERA].setRatio(canvas.width / canvas.height);
		sg.calcSceneTransformation();
		
		var renderables = new Array();
		sg.getRenderables( renderables );
		sg.pCount = 0;
		
		// Multipass rendering
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
		
		/*
		// Color-Pass
		
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, gl.beautyFramebuffer);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		//drawPerObject(sg.t.sGraph, 0, 0);

		// Glow-Pass
		gl.bindFramebuffer(gl.FRAMEBUFFER, gl.glowFramebuffer[0]);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		//drawPerObject(sg.t.sGraph, 0, 1);

		gl.disable(gl.BLEND);

		// Blur Glow-Pass
		var i = 0;

		gl.useProgram(gl.blurProgram);

		gl.uniform1i(gl.blurProgram.uni.blurSamplerPointer, 0);
		gl.uniform2fv(gl.blurProgram.uni.resPointer, new Float32Array([gl.bufferWidth, gl.bufferHeight]));

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vPosScreenBuffer);
		gl.vertexAttribPointer(NX_POS_I, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vUVScreenBuffer);
		gl.vertexAttribPointer(NX_UV_I, 2, gl.FLOAT, false, 0, 0);


		for (i = 0; i < 20; i++) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, gl.glowFramebuffer[(i + 1) % 2]);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, gl.glowPass[i % 2]);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}

		// Composite-Program
		gl.useProgram(gl.compProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniform1i(gl.compProgram.uni.colorSamplerPointer, 0);
		gl.uniform1i(gl.compProgram.uni.glowSamplerPointer, 1);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, gl.beautyPass);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, gl.glowPass[0]);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
		*/
	}

	function KeyPress(event) {

		switch (event.keyCode) {
			case 38:	// arrow up
				input.lat -= 5;
				input.lat %= 360;
				event.preventDefault();
				break;

			case 40:	// arrow down
				input.lat += 5;
				input.lat %= 360;
				event.preventDefault();
				break;

			case 37:	// arrow left
				input.lon -= 5;
				input.lon %= 360;
				event.preventDefault();
				break;

			case 39:	// arrow right
				input.lon += 5;
				input.lon %= 360;
				event.preventDefault();
				break;

			case 33:	// img up
				input.dis -= 1;
				if (input.dis < 5) input.dis = 5;
				event.preventDefault();
				break;

			case 34:	// img down
				input.dis += 1;
				//if( input.dis > 35 ) input.dis = 35;
				event.preventDefault();
				break;

			case 32:	//Space 
				input.dis = 18;
				input.lon = 180;
				input.lat = 0;
				input.mX = 0;
				input.mY = 0;

				input.fire = false;
				input.down = false;
				input.fire_mode = false;
				sg.timer.multi = 10000;

				event.preventDefault();
				break;

			case 107:
				sg.timer.multi += 10000;
				event.preventDefault();
				break;

			case 109:
				sg.timer.multi -= 10000;
				if (sg.timer.multi < 1) sg.timer.multi = 1;
				event.preventDefault();
				break;

			case 88:
				if (!input.fire) {
					input.fire_mode = !input.fire_mode
					if (input.fire_mode) {
						sg.timer.multi = 1;
					}
				}
				event.preventDefault();
				break;
		}
	}

	function MouseMove(event) {
		if (input.down) {
			input.lat += 0.5 * (input.old_clientY - event.clientY);
			input.lat %= 360;

			input.lon += 0.5 * (input.old_clientX - event.clientX);
			input.lon %= 360;
		}
		input.old_clientX = event.clientX;
		input.old_clientY = event.clientY;
	}

	function MouseDown(event) {
		if (input.fire_mode) {
			input.fire = true;
			input.fire_mode = false;
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

	function initializeInput() {
		input = [];
		input.ctrl = 1;
		input.lon = 180;
		input.lat = 0;
		input.dis = 18;
		input.mY = 0;
		input.mX = 0;

		input.fire_mode = false;
		input.down = false;
		input.fire = false;

		document.onkeydown = KeyPress;
		canvas.onmousemove = MouseMove;
		canvas.onmousedown = MouseDown;
		canvas.onmouseup = MouseUp;
	}

	function render() {
		initializeInput();
		initializeBuffers();
		initializePipelines();
		initializeScene();

		sg.timer.multi = 10000;

		gl.timer = new Date().getTime();
		gl.fps = 0;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);

		if( legend && legend.style )
		{
			legend.style.display = '';
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