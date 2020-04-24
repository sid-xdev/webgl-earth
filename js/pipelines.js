var NX_EARTH_PIPELINE = new function() {
	this.TEXTURE_IDS = {
		day : 0,
		night : 1,
		clouds : 2,
		water : 3,
		height : 4
	};
	this.identifier = "Earth";
	this.vertexSource = '';
	this.fragmentSource = '';
	this.reflect = function( gl ) {
		this.uniforms = {
			
			perspectivMatrix: gl.getUniformLocation( this.program, "perspectiv_matrix" ),
			cameraMatrix: gl.getUniformLocation( this.program, "camera_matrix" ),
			worldMatrix: gl.getUniformLocation( this.program, "world_position_matrix" ),
	/*
			( TextureIds.day + "Sampler" ) : gl.getUniformLocation( this.program, "uTexDiffusSampler" ),
			normal_sampler: gl.getUniformLocation( this.program, "uTexNormalSampler" ),
			specular_sampler: gl.getUniformLocation( this.program, "uTexSpecularSampler" ),
			night_side_sampler: gl.getUniformLocation( this.program, "uTexDarkSampler" ),
			cloud_sampler: gl.getUniformLocation( this.program, "uTexDarkSampler" ),
			*/
			//sun_position: gl.getUniformLocation( this.program, "uSunPosition"),
			//own_position: gl.getUniformLocation( this.program, "uSunColor"),
			//impact_position: gl.getUniformLocation( this.program, "uImpactPosition"),
			//impact_distance: gl.getUniformLocation( this.program, "uDamageRadius")
		}
		
		for( const textureId in this.TEXTURE_IDS )
		{
			this.uniforms[textureId+"Sampler"] = gl.getUniformLocation( this.program, textureId+"Sampler" );
		}
	};
	
	this.setUniformsPerFrame = function ( gl, cameraMatrix, perspectivMatrix ) {
		gl.useProgram( this.program );

		gl.uniformMatrix4fv( this.uniforms.cameraMatrix, false, new Float32Array( cameraMatrix ) );
		gl.uniformMatrix4fv( this.uniforms.perspectivMatrix, false, new Float32Array( perspectivMatrix ) );
		
		/*
		for( const textureId in this.TEXTURE_IDS )
		{
			gl.uniform1i( this.uniforms[textureId+"Sampler"], TEXTURE_IDS[textureId] );
		}
		*/
		
		//gl.uniform1f(this.uni.dmgRadPointer, this.impactRadius);
		//gl.uniform3fv(this.uni.sunPosPointer, new Float32Array([0, 0, 0]));
		//gl.uniform3fv(this.uni.sunColorPointer, new Float32Array([1, 1, 1]));
		//gl.uniform3fv(this.uni.inpPosPointer, new Float32Array(this.impactPoint)); 
	};
		
	this.setUniformsPerObject = function ( gl, object, textureList ) {
		
		gl.uniformMatrix4fv( this.uniforms.worldMatrix, false, new Float32Array( object.position ));
		
		for( const textureId in this.TEXTURE_IDS )
		{
			gl.activeTexture( gl["TEXTURE"+this.TEXTURE_IDS[textureId]] );
			gl.bindTexture( gl.TEXTURE_2D, textureList[object[textureId]] );
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



