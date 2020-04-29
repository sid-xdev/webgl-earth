var NX_EARTH_PIPELINE = new function() {
	this.TEXTURE_IDS = {
		day : 0,
		night : 1,
		alpha : 2,
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
			earthCenter: gl.getUniformLocation( this.program, "earth_center" ),
			impactVector: gl.getUniformLocation( this.program, "impact_vector" ),
			destructionProgress: gl.getUniformLocation( this.program, "destruction_progress" ),
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
	};
		
	this.setUniformsPerObject = function ( 	gl, object, textureList, lightPosition, impactPosition, destructionProgress ) {
		
		gl.uniformMatrix4fv( this.uniforms.worldMatrix, false, new Float32Array( object.position ));
		
		let worldPosition = new Vec3( object.position[12], object.position[13], object.position[14] );
		
		gl.uniform3fv( this.uniforms.lightDirection, new Float32Array( worldPosition.sub( lightPosition ).norm() ) );
		gl.uniform3fv( this.uniforms.earthCenter, new Float32Array( worldPosition ) );
		gl.uniform3fv( this.uniforms.impactVector, new Float32Array( impactPosition.sub( worldPosition ).norm() ) );
		gl.uniform1f( this.uniforms.destructionProgress, destructionProgress );
		
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

var NX_SIMPLE_GLOW_PIPELINE = new function() {
	this.identifier = "ObjectGlow";
	this.vertexSource = '';
	this.fragmentSource = '';
	this.reflect = function( gl ) {
		this.uniforms = {
			
			perspectivMatrix: gl.getUniformLocation( this.program, "perspectiv_matrix" ),
			cameraMatrix: gl.getUniformLocation( this.program, "camera_matrix" ),
			worldMatrix: gl.getUniformLocation( this.program, "world_position_matrix" ),
			
			lightColor: gl.getUniformLocation( this.program, "light_color" ),
		}
	};
	
	this.setUniformsPerFrame = function ( gl, cameraMatrix, perspectivMatrix ) {
		gl.useProgram( this.program );

		gl.uniformMatrix4fv( this.uniforms.cameraMatrix, false, new Float32Array( cameraMatrix ) );
		gl.uniformMatrix4fv( this.uniforms.perspectivMatrix, false, new Float32Array( perspectivMatrix ) );
	};
		
	this.setUniformsPerObject = function ( 	gl, object ) {
		
		gl.uniformMatrix4fv( this.uniforms.worldMatrix, false, new Float32Array( object.position ) );
		gl.uniform4fv( this.uniforms.lightColor, new Float32Array( object.lightColor ) );
	};
}

function Earth( geometryIdx, pipelineIdx, dayTexture = 0, nightTexture = 0, alphaTexture = 0 )
{
	Leaf.call( this, geometryIdx, pipelineIdx );
	
	this.day = dayTexture;
	this.night = nightTexture;
	this.alpha = alphaTexture;
};

Earth.prototype = new Leaf();
Earth.prototype.constructor = Earth;

function Glow( geometryIdx, pipelineIdx, lightColor )
{
	Leaf.call( this, geometryIdx, pipelineIdx );
	
	this.lightColor = lightColor;
};

Glow.prototype = new Leaf();
Glow.prototype.constructor = Earth;



