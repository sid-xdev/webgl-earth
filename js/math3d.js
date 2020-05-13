function Vec3( x, y, z )
{
	this[0] = x;
	this[1] = y;
	this[2] = z;
}

Vec3.prototype = new Array(3);

Vec3.prototype.constructor = Vec3;

Vec3.prototype.count = 3;

Vec3.prototype.scalar = function ( p )
{
	return new Vec3( this[0]*p, this[1]*p, this[2]*p );
};

Vec3.prototype.add = function ( p )
{
	return new Vec3( this[0]+p[0], this[1]+p[1], this[2]+p[2] );
};

Vec3.prototype.sub = function ( p )
{
	return new Vec3( this[0]-p[0], this[1]-p[1], this[2]-p[2] );
};

Vec3.prototype.dot = function ( p )
{
	return ( this[0]*p[0] + this[1]*p[1] + this[2]*p[2] );
};

Vec3.prototype.cross = function ( p )
{
	return new Vec3( this[1]*p[2] - this[2]*p[1], this[2]*p[0] - this[0]*p[2], this[0]*p[1] - this[1]*p[0] );
};

Vec3.prototype.norm = function ()
{
	return this.scalar(  1/Math.sqrt( this[0]*this[0] + this[1]*this[1] + this[2]*this[2] ) );
};

Vec3.prototype.abs = function ()
{
	return Math.sqrt( this[0]*this[0] + this[1]*this[1] + this[2]*this[2] );
};

Vec3.prototype.copy = function( buffer, offset )
{
	buffer[offset + 0] = this[0];
	buffer[offset + 1] = this[1];
	buffer[offset + 2] = this[2];
};

function Vec2( x, y )
{
	this[0] = x;
	this[1] = y;
}

Vec2.prototype = new Array(2);

Vec2.prototype.constructor = Vec2;

Vec2.prototype.count = 2;

Vec2.prototype.scalar = function ( p )
{
	return new Vec2( this[0]*p, this[1]*p );
};

Vec2.prototype.add = function ( p )
{
	return new Vec2( this[0]+p[0], this[1]+p[1] );
};

Vec2.prototype.sub = function ( p )
{
	return new Vec2( this[0]-p[0], this[1]-p[1] );
};

Vec2.prototype.dot = function ( p )
{
	return ( this[0]*p[0] + this[1]*p[1] );
};

Vec2.prototype.norm = function ()
{
	return this.scalar(  1/Math.sqrt( this[0]*this[0] + this[1]*this[1] ) );
};

Vec2.prototype.copy = function( buffer, offset )
{
	buffer[offset + 0] = this[0];
	buffer[offset + 1] = this[1];
};

Vec2.prototype.abs = function ()
{
	return Math.sqrt( this[0]*this[0] + this[1]*this[1] );
};

function Mat4( mat )
{
	if( mat == undefined )
	{
		mat = [];
	}
	
	switch( mat.constructor )
	{
		case Mat4:
			this[0] = mat[0];
			this[1] = mat[1];
			this[2] = mat[2];
			this[3] = mat[3];
			this[4] = mat[4];
			this[5] = mat[5];
			this[6] = mat[6];
			this[7] = mat[7];
			this[8] = mat[8];
			this[9] = mat[9];
			this[10] = mat[10];
			this[11] = mat[11];
			this[12] = mat[12];
			this[13] = mat[13];
			this[14] = mat[14];
			this[15] = mat[15];
			break;
			
		case Mat3:
			this[0] = mat[0];
			this[1] = mat[1];
			this[2] = mat[2];
			this[3] = 0;
			this[4] = mat[3];
			this[5] = mat[4];
			this[6] = mat[5];
			this[7] = 0;
			this[8] = mat[6];
			this[9] = mat[7];
			this[10] = mat[8];
			this[11] = 0;
			this[12] = 0;
			this[13] = 0;
			this[14] = 0;
			this[15] = 1;
			break;
			
		default:
			this[0] = 1;
			this[1] = 0;
			this[2] = 0;
			this[3] = 0;
			this[4] = 0;
			this[5] = 1;
			this[6] = 0;
			this[7] = 0;
			this[8] = 0;
			this[9] = 0;
			this[10] = 1;
			this[11] = 0;
			this[12] = 0;
			this[13] = 0;
			this[14] = 0;
			this[15] = 1;
	}
}

Mat4.prototype = new Array( 16 );

Mat4.prototype.constructor = Mat4;

Mat4.prototype.multiply = function( buf )
{
	if( buf == undefined )
	{
		return 0;
	}
	
	var newMat;
	var type = buf.constructor;
	var mat;
	
	if( type === Vec3 )
	{
		newMat = new Vec3();
		mat = new Array( buf[0], buf[1], buf[2], 1 );
	}
	else
	{
		newMat = new Mat4();
		mat = new Mat4( buf );
	}
	
	newMat[0] = this[0]*mat[0]+this[4]*mat[1]+this[8]*mat[2]+this[12]*mat[3];
	newMat[1] = this[1]*mat[0]+this[5]*mat[1]+this[9]*mat[2]+this[13]*mat[3];
	newMat[2] = this[2]*mat[0]+this[6]*mat[1]+this[10]*mat[2]+this[14]*mat[3];
	
	if( type === Vec3 )
	{
		return newMat;
	}
	
	newMat[3] = this[3]*mat[0]+this[7]*mat[1]+this[11]*mat[2]+this[15]*mat[3];
	newMat[4] = this[0]*mat[4]+this[4]*mat[5]+this[8]*mat[6]+this[12]*mat[7];
	newMat[5] = this[1]*mat[4]+this[5]*mat[5]+this[9]*mat[6]+this[13]*mat[7];
	newMat[6] = this[2]*mat[4]+this[6]*mat[5]+this[10]*mat[6]+this[14]*mat[7];
	newMat[7] = this[3]*mat[4]+this[7]*mat[5]+this[11]*mat[6]+this[15]*mat[7];
	newMat[8] = this[0]*mat[8]+this[4]*mat[9]+this[8]*mat[10]+this[12]*mat[11];
	newMat[9] = this[1]*mat[8]+this[5]*mat[9]+this[9]*mat[10]+this[13]*mat[11];
	newMat[10] = this[2]*mat[8]+this[6]*mat[9]+this[10]*mat[10]+this[14]*mat[11];
	newMat[11] = this[3]*mat[8]+this[7]*mat[9]+this[11]*mat[10]+this[15]*mat[11];
	newMat[12] = this[0]*mat[12]+this[4]*mat[13]+this[8]*mat[14]+this[12]*mat[15];
	newMat[13] = this[1]*mat[12]+this[5]*mat[13]+this[9]*mat[14]+this[13]*mat[15];
	newMat[14] = this[2]*mat[12]+this[6]*mat[13]+this[10]*mat[14]+this[14]*mat[15];
	newMat[15] = this[3]*mat[12]+this[7]*mat[13]+this[11]*mat[14]+this[15]*mat[15];
	
	return newMat;
};

Mat4.prototype.add = function( mat )
{
	var newMat = new Mat4();
	
	newMat[0] = this[0] + mat[0];
	newMat[1] = this[1] + mat[1];
	newMat[2] = this[2] + mat[2];
	newMat[3] = this[3] + mat[3];
	newMat[4] = this[4] + mat[4];
	newMat[5] = this[5] + mat[5];
	newMat[6] = this[6] + mat[6];
	newMat[7] = this[7] + mat[7];
	newMat[8] = this[8] + mat[8];
	newMat[9] = this[9] + mat[9];
	newMat[10] = this[10] + mat[10];
	newMat[11] = this[11] + mat[11];
	newMat[12] = this[12] + mat[12];
	newMat[13] = this[13] + mat[13];
	newMat[14] = this[14] + mat[14];
	newMat[15] = this[15] + mat[15];
	
	return newMat;
};

Mat4.prototype.scalar = function( k )
{
	var newMat = new Mat4();
	
	for( var i=0; i < newMat.length; i++ )
	{
		newMat[i] = this[i]*k;
	}
	
	return newMat;
};

Mat4.prototype.reverse = function()
{					
	var newMat = new Mat4();
	var rot = new Mat3( this ).invert();
	var trn = rot.scalar( -1 ).multiply( new Vec3( this[12], this[13], this[14] ) );
	
	newMat[0] = rot[0];
	newMat[1] = rot[1];
	newMat[2] = rot[2];
	newMat[3] = 0;
	
	newMat[4] = rot[3];
	newMat[5] = rot[4];
	newMat[6] = rot[5];
	newMat[7] = 0;
	
	newMat[8] = rot[6];
	newMat[9] = rot[7];
	newMat[10] = rot[8];
	newMat[11] = 0;
	
	newMat[12] = trn[0];
	newMat[13] = trn[1];
	newMat[14] = trn[2];
	newMat[15] = 1;
	
	return newMat;
}

Mat4.rotate = function( w , vec )
{
	w = w*( Math.PI/180 );
	
	var newMat = new Mat4();
	var cws = 1 - Math.cos( w );
	
	newMat[0] = vec[0]*vec[0]*cws + Math.cos( w );
	newMat[1] = vec[1]*vec[0]*cws + vec[2]*Math.sin( w );
	newMat[2] = vec[2]*vec[0]*cws - vec[1]*Math.sin( w );
	newMat[3] = 0;
	newMat[4] = vec[0]*vec[1]*cws - vec[2]*Math.sin( w );
	newMat[5] = vec[1]*vec[1]*cws + Math.cos( w );
	newMat[6] = vec[2]*vec[1]*cws + vec[0]*Math.sin( w );
	newMat[7] = 0;
	newMat[8] = vec[0]*vec[2]*cws + vec[1]*Math.sin( w );
	newMat[9] = vec[1]*vec[2]*cws - vec[0]*Math.sin( w );
	newMat[10] = vec[2]*vec[2]*cws + Math.cos( w );
	newMat[11] = 0;
	newMat[12] = 0;
	newMat[13] = 0;
	newMat[14] = 0;
	newMat[15] = 1;
	
	return newMat;
};

Mat4.translate = function( x, y, z )
{
	var newMat = new Mat4();
	
	newMat[12] = x;
	newMat[13] = y;
	newMat[14] = z;
	
	return newMat;
};

Mat4.scale = function( x, y, z )
{
	var newMat = new Mat4();
	
	newMat[0] = x;
	newMat[5] = y;
	newMat[10] = z;
	
	return newMat;
};

function Mat3( mat )
{
	if( mat == undefined )
	{
		mat = [];
	}
	
	switch( mat.constructor )
	{
		case Mat4:
			this[0] = mat[0];
			this[1] = mat[1];
			this[2] = mat[2];
			this[3] = mat[4];
			this[4] = mat[5];
			this[5] = mat[6];
			this[6] = mat[8];
			this[7] = mat[9];
			this[8] = mat[10];
			break;
			
		case Mat3:
			this[0] = mat[0];
			this[1] = mat[1];
			this[2] = mat[2];
			this[3] = mat[3];
			this[4] = mat[4];
			this[5] = mat[5];
			this[6] = mat[6];
			this[7] = mat[7];
			this[8] = mat[8];
			break;
			
		default:
			this[0] = 1;
			this[1] = 0;
			this[2] = 0;
			this[3] = 0;
			this[4] = 1;
			this[5] = 0;
			this[6] = 0;
			this[7] = 0;
			this[8] = 1;	
	}
}

Mat3.prototype = new Array( 9 );

Mat3.prototype.constructor = Mat3;

Mat3.prototype.scalar = function( k )
{
	return new Mat3( new Mat4( this ).scalar( k ) ); 
};

Mat3.prototype.add = function( mat )
{
	return new Mat3( new Mat4( this ).add( new Mat4( mat ) ) ); 
};

Mat3.prototype.multiply = function( mat )
{
	var result = new Mat4( this ).multiply( mat );
	if( result.constructor === Vec3 )
	{
		return result
	}
	else
	{
		return new Mat3( result );
	}
};
					
Mat3.prototype.transpose = function()
{
	var newMat = new Mat3();
	
	newMat[0] = this[0];
	newMat[1] = this[3];
	newMat[2] = this[6];
	
	newMat[3] = this[1];
	newMat[4] = this[4];
	newMat[5] = this[7];
	
	newMat[6] = this[2];
	newMat[7] = this[5];
	newMat[8] = this[8];
	
	return newMat;
};

Mat3.prototype.det = function()
{
	var det = this[0]*this[4]*this[8]
			+ this[3]*this[7]*this[2]
			+ this[6]*this[1]*this[5]
			- this[6]*this[4]*this[2]
			- this[7]*this[2]*this[0]
			- this[8]*this[3]*this[1];
			
	return det;
};

Mat3.prototype.invert = function()
{
	var newMat = new Mat3();
	
	newMat[0] = this[4]*this[8] - this[7]*this[5];
	newMat[1] = this[7]*this[2] - this[1]*this[8];
	newMat[2] = this[1]*this[5] - this[4]*this[2];
	
	newMat[3] = this[6]*this[5] - this[3]*this[8];
	newMat[4] = this[0]*this[8] - this[6]*this[2];
	newMat[5] = this[3]*this[2] - this[0]*this[5];
	
	newMat[6] = this[3]*this[7] - this[6]*this[4];
	newMat[7] = this[6]*this[1] - this[0]*this[7];
	newMat[8] = this[0]*this[4] - this[3]*this[1];
	
	return newMat.scalar( 1/this.det() );
};

function Model3( name )
{
	this.name = name;
	this.vertices = new Array();
	this.normals = new Array();
	this.tangents = new Array();
	this.uvMaps = new Array();
	this.uvMaps[0] = new Array();
	this.polycount = 0;
}

Model3.prototype.addPoly = function( v_a, v_b, v_c, uv_a, uv_b, uv_c )
{
	var index = this.polycount*3;
	
	this.vertices[index]   = v_a;
	this.vertices[index+1] = v_b;
	this.vertices[index+2] = v_c;
	
	this.uvMaps[0][index]   = uv_a;
	this.uvMaps[0][index+1] = uv_b;
	this.uvMaps[0][index+2] = uv_c;
	
	this.polycount++;
};

Model3.prototype.setupNormals = function()
{	
	for( let index = 0; index < this.polycount; ++index )
	{
		let startIndex = index * 3;
		
		let point1 = this.vertices[startIndex];
		let point2 = this.vertices[startIndex+1];
		let point3 = this.vertices[startIndex+2];
		
		let uv1 = this.uvMaps[0][startIndex];
		let uv2 = this.uvMaps[0][startIndex+1];
		let uv3 = this.uvMaps[0][startIndex+2];
		
		let normal = point2.sub( point1 ).cross( point3.sub( point1 ) ).norm();
		
		let edge1 = point2.sub( point1 );
		let edge2 = point3.sub( point1 );
		let deltaUV1 = uv2.sub( uv1 );
		let deltaUV2 = uv3.sub( uv1 );  
	
		let f = 1.0 / ( deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1] );
	
		let tangent = new Vec3(
			f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
			f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
			f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]) ).norm();
		
		for( let i = 0; i < 3; ++i )	
		{
			this.normals[startIndex+i]  = normal;
			this.tangents[startIndex+i] = tangent;
		}
	}
};

Model3.prototype.smooth = function()
{	
	let bucketList = new Array();
	
	for( let index in this.vertices )
	{
		let currentVector = this.vertices[index]
		let check = function( bucket )
		{
			return bucket.vector[0] == currentVector[0] && bucket.vector[1] == currentVector[1] && bucket.vector[2] == currentVector[2];
		}
		
		let bucketIndex = bucketList.findIndex( check );
		
		//when in bucket list add tangent and normal
		if( bucketIndex >= 0 )
		{
			bucketList[bucketIndex].normal = bucketList[bucketIndex].normal.add( this.normals[index] );
			bucketList[bucketIndex].tangent = bucketList[bucketIndex].tangent.add( this.tangents[index] );
			bucketList[bucketIndex].indices.push( index );
		}
		//when not in bucket list add new entry
		else
		{
			bucketList.push(
			{
				vector : currentVector,
				tangent : this.tangents[index],
				normal : this.normals[index],
				indices : [index]
			} );
		}
	}
	
	for( let bucket of bucketList )
	{
		for( let index of bucket.indices )
		{
			this.tangents[index] = bucket.tangent.norm();
			this.normals[index] = bucket.normal.norm();
		}
	}
};

Model3.prototype.tesselation = function( steps )
{
	if( steps > 0 )
	{
		var newPolys = new Array( 12*this.polycount );
		var newUVs = new Array( this.uvMaps.length );
		var newPolycount = 0;
		
		for( let i = 0; i < this.polycount; i++ )
		{
			let vertexPoints = new Array(6);
			let uvPoints = new Array(6);
			let index = 3*i;
			
			vertexPoints[0] = this.vertices[index];
			vertexPoints[2] = this.vertices[index+1];
			vertexPoints[4] = this.vertices[index+2];
			
			vertexPoints[1] = ( ( vertexPoints[2].sub( vertexPoints[0] ) ).scalar( 0.5) ).add( vertexPoints[0] );
			vertexPoints[3] = ( ( vertexPoints[4].sub( vertexPoints[2] ) ).scalar( 0.5) ).add( vertexPoints[2] );
			vertexPoints[5] = ( ( vertexPoints[0].sub( vertexPoints[4] ) ).scalar( 0.5) ).add( vertexPoints[4] );
			
			index *= 4;
			
			newPolys[index]   = vertexPoints[0];
			newPolys[index+1] = vertexPoints[1];
			newPolys[index+2] = vertexPoints[5];
			
			newPolys[index+3] = vertexPoints[2];
			newPolys[index+4] = vertexPoints[3];
			newPolys[index+5] = vertexPoints[1];
			
			newPolys[index+6] = vertexPoints[4];
			newPolys[index+7] = vertexPoints[5];
			newPolys[index+8] = vertexPoints[3];
			
			newPolys[index+9]  = vertexPoints[1];
			newPolys[index+10] = vertexPoints[3];
			newPolys[index+11] = vertexPoints[5];
			
			index = 3*i;
			
			for( var j = 0; j < this.uvMaps.length; j++ )
			{
				if( newUVs[j] == undefined ) newUVs[j] = new Array( 18*this.polycount );
				
				uvPoints[0] = this.uvMaps[j][index];
				uvPoints[2] = this.uvMaps[j][index+1];
				uvPoints[4] = this.uvMaps[j][index+2];
					
				uvPoints[1] = ( ( uvPoints[2].sub( uvPoints[0] ) ).scalar( 0.5) ).add( uvPoints[0] );
				uvPoints[3] = ( ( uvPoints[4].sub( uvPoints[2] ) ).scalar( 0.5) ).add( uvPoints[2] );
				uvPoints[5] = ( ( uvPoints[0].sub( uvPoints[4] ) ).scalar( 0.5) ).add( uvPoints[4] );
				
				index *= 4;
				
				newUVs[j][index]   = uvPoints[0];
				newUVs[j][index+1] = uvPoints[1];
				newUVs[j][index+2] = uvPoints[5];
				
				newUVs[j][index+3] = uvPoints[2];
				newUVs[j][index+4] = uvPoints[3];
				newUVs[j][index+5] = uvPoints[1];
				
				newUVs[j][index+6] = uvPoints[4];
				newUVs[j][index+7] = uvPoints[5];
				newUVs[j][index+8] = uvPoints[3];
				
				newUVs[j][index+9]  = uvPoints[1];
				newUVs[j][index+10] = uvPoints[3];
				newUVs[j][index+11] = uvPoints[5];
			}
			
			newPolycount += 4;
		}
		
		this.vertices = newPolys;
		this.uvMaps = newUVs;
		this.polycount = newPolycount;
		this.tesselation( steps-1 );
	}
};

Model3.prototype.getVertexAttributes = function( buffer, offset )
{
	
	const VERTICES_PER_POLYGON = 3;
	
	const FLOAT32_PER_POSITION = 3;
	const FLOAT32_PER_NORMAL = 3;
	const FLOAT32_PER_TANGENT = 3;
	const FLOAT32_PER_UV = 2;
	
	const FLOAT32_PER_VERTEX = FLOAT32_PER_POSITION + FLOAT32_PER_NORMAL + FLOAT32_PER_TANGENT + FLOAT32_PER_UV;
	
	for( let polygon_index = 0; polygon_index < this.polycount; polygon_index++ )
	{	
		for( let vertex_index = 0; vertex_index < VERTICES_PER_POLYGON; ++vertex_index )
		{
			const current_buffer_index = offset + polygon_index * VERTICES_PER_POLYGON * FLOAT32_PER_VERTEX  + vertex_index * FLOAT32_PER_VERTEX;
			const pointIndex = polygon_index*VERTICES_PER_POLYGON + vertex_index;
			//vertex coords
			buffer[current_buffer_index] 	= this.vertices[pointIndex][0];
			buffer[current_buffer_index+1]	= this.vertices[pointIndex][1];
			buffer[current_buffer_index+2]	= this.vertices[pointIndex][2];
			
			//vertex normal
			buffer[current_buffer_index+3] 	= this.normals[pointIndex][0];
			buffer[current_buffer_index+4]	= this.normals[pointIndex][1];
			buffer[current_buffer_index+5]	= this.normals[pointIndex][2];
			
			//vertex tangent
			buffer[current_buffer_index+6] 	= this.tangents[pointIndex][0];
			buffer[current_buffer_index+7]	= this.tangents[pointIndex][1];
			buffer[current_buffer_index+8]	= this.tangents[pointIndex][2];
			
			//uv coords
			buffer[current_buffer_index+9] 	= this.uvMaps[0][pointIndex][0];
			buffer[current_buffer_index+10]	= this.uvMaps[0][pointIndex][1];
		}
	}
	
	return offset + this.polycount * VERTICES_PER_POLYGON * FLOAT32_PER_VERTEX;
};

