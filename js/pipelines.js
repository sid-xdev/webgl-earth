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
			
			lightDirection: gl.getUniformLocation( this.program, "light_direction" ),
			cameraPosition: gl.getUniformLocation( this.program, "camera_position" )
		}
		
		for( const textureId in this.TEXTURE_IDS )
		{
			this.uniforms[textureId+"_sampler"] = gl.getUniformLocation( this.program, textureId+"_sampler" );
		}
	};
	
	this.setUniformsPerFrame = function ( gl, cameraMatrix, perspectivMatrix ) {
		gl.useProgram( this.program );

		gl.uniformMatrix4fv( this.uniforms.cameraMatrix, false, new Float32Array( cameraMatrix ) );
		gl.uniformMatrix4fv( this.uniforms.perspectivMatrix, false, new Float32Array( perspectivMatrix ) );
		
		for( const textureId in this.TEXTURE_IDS )
		{
			gl.uniform1i( this.uniforms[textureId+"_sampler"], this.TEXTURE_IDS[textureId] );
		}
		
		gl.uniform3fv( this.uniforms.cameraPosition, new Float32Array( new Vec3( cameraMatrix[12], cameraMatrix[13], cameraMatrix[14] ) ) );
	};
		
	this.setUniformsPerObject = function ( 	gl, object, textureList, lightPosition ) {
		
		gl.uniformMatrix4fv( this.uniforms.worldMatrix, false, new Float32Array( object.position ));
		gl.uniform3fv( this.uniforms.lightDirection, new Float32Array( new Vec3( object.position[12], object.position[13], object.position[14] ).sub( lightPosition ).norm() ) );
		
		for( const textureId in this.TEXTURE_IDS )
		{
			if( textureList[object[textureId]].texture )
			{
				gl.activeTexture( gl["TEXTURE"+this.TEXTURE_IDS[textureId]] );
				gl.bindTexture( gl.TEXTURE_2D, textureList[object[textureId]].texture );
			}
		}
	};
};

function Earth( geometryIdx, pipelineIdx, dayTexture = 0, nightTexture = 0, heightTexture = 0, waterTexture = 0, cloudsTexture = 0 )
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



