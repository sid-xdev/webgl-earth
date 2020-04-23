var NX_EARTH_PIPELINE = new function() {
	this.TEXTURE_IDS = {
		day : 0,
		night : 1,
		clouds : 2,
		water : 3,
		height : 4
	};
	this.pipeline;
	this.identifier = "Earth";
	this.vertexSource = '';
	this.fragmentSource = '';
	this.reflect = function( gl ) {
		this.uniforms = {
			
			perspectivMatrix: gl.getUniformLocation( this.program, "uPerspMat" ),
			cmaeraMatrix: gl.getUniformLocation( this.program, "uCameraMat" ),
			worldMatrix: gl.getUniformLocation( this.program, "uModelMat" ),
	/*
			( TextureIds.day + "Sampler" ) : gl.getUniformLocation( this.program, "uTexDiffusSampler" ),
			normal_sampler: gl.getUniformLocation( this.program, "uTexNormalSampler" ),
			specular_sampler: gl.getUniformLocation( this.program, "uTexSpecularSampler" ),
			night_side_sampler: gl.getUniformLocation( this.program, "uTexDarkSampler" ),
			cloud_sampler: gl.getUniformLocation( this.program, "uTexDarkSampler" ),
			*/
			sun_position: gl.getUniformLocation( this.program, "uSunPosition"),
			own_position: gl.getUniformLocation( this.program, "uSunColor"),
			impact_position: gl.getUniformLocation( this.program, "uImpactPosition"),
			impact_distance: gl.getUniformLocation( this.program, "uDamageRadius")
		}
		
		this.attributes = {
			
			uv_coords : gl.getAttribLocation( this.program, "aVertexPos" ),
			vertex_coords : gl.getAttribLocation( this.program, "aVertexUV" ),
			normal : gl.getAttribLocation( this.program, "aVertexNorm" ),
		}
		
		for( var textureId in this.TEXTURE_IDS )
		{
			this.uniforms[textureId+"Sampler"] = gl.getUniformLocation( this.program, textureId+"Sampler" );
		}
	};
	
	this.setUniformsPerFrame = function ( gl, camera_mat, perspectiv_mat ) {
		gl.useProgram( this.pipeline );

		gl.uniformMatrix4fv( this.uniforms.camMatPointer, false, new Float32Array(sg.cameras[sg.MAIN_CAMERA].ownMat));
		gl.uniformMatrix4fv( this.uniforms.perMatPointer, false, new Float32Array(createPerspMat(sg.cameras[sg.MAIN_CAMERA])));
		
		for( var textureId in this.TEXTURE_IDS )
		{
			gl.uniform1i( this.uniforms[textureId+"Sampler"], TEXTURE_IDS[textureId] );
		}

		gl.uniform1f(this.uni.dmgRadPointer, this.impactRadius);
		gl.uniform3fv(this.uni.sunPosPointer, new Float32Array([0, 0, 0]));
		gl.uniform3fv(this.uni.sunColorPointer, new Float32Array([1, 1, 1]));
		gl.uniform3fv(this.uni.inpPosPointer, new Float32Array(this.impactPoint)); 
	};
		
	this.setUniformsPerLeaf = function ( gl, textures, object ) {
		gl.uniformMatrix4fv(this.uni.posMatPointer, false, new Float32Array( object.position ));
		
		for( var textureId in this.TEXTURE_IDS )
		{
			gl.activeTexture( gl["TEXTURE"+TEXTURE_IDS[textureId]] );
			gl.bindTexture( gl.TEXTURE_2D, textures[object[textureId]] );
		}
	};
};

function Earth( geometryIdx, pipelineIdx, dayTexture, nightTexture, heightTexture, waterTexture, cloudsTexture )
{
	Leaf.call( this, geometryIdx, pipelineIdx );
	
	this.day = dayTexture;
	this.night = nightTexture;
	this.clouds = cloudsTexture;
	this.water = waterTexture;
	this.height = heightTexture;
};

Earth.prototype = new Leaf();
Earth.prototype.constructor = Earth;



