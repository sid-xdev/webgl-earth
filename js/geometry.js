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

function Vec2( x, y )
{
	this[0] = x;
	this[1] = y;
}

Vec2.prototype = new Array(2);

Vec2.prototype.constructor = Vec2;

Vec2.prototype.count = 3;

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

function Tri( p1, p2, p3, uv1, uv2, uv3, n1, n2, n3 )
{
	this[0] = p1;
	this[1] = p2;
	this[2] = p3;
	
	this[3] = uv1;
	this[4] = uv2;
	this[5] = uv3;
	
	if( n1 == undefined || n2 == undefined || n3 == undefined )
	{
		this[6] = this.getNormal().norm();
		this[7] = this.getNormal().norm();
		this[8] = this.getNormal().norm();
	}
	else
	{
		this[6] = n1.norm();
		this[7] = n2.norm();
		this[8] = n3.norm();
	}
}

Tri.prototype = new Array(9);

Tri.prototype.constructor = Tri;

Tri.prototype.count = 3;

Tri.prototype.getNormal = function()
{
	return ( this[1].sub( this[0] ) ).cross( this[2].sub( this[0] ) );
};

function Model3( name )
{
	this.name = name;
	this.vertices = new Array();
	this.normals = new Array();
	this.uvMaps = new Array();
	this.uvMaps[0] = new Array();
	this.polycount = 0;
}

Model3.prototype.addPoly = function( v_a, v_b, v_c, uv_a, uv_b, uv_c, n_a, n_b, n_c )
{
	var index = this.polycount*9;
	
	this.vertices[index]   = v_a[0];
	this.vertices[index+1] = v_a[1];
	this.vertices[index+2] = v_a[2];
	
	this.vertices[index+3] = v_b[0];
	this.vertices[index+4] = v_b[1];
	this.vertices[index+5] = v_b[2];
	
	this.vertices[index+6] = v_c[0];
	this.vertices[index+7] = v_c[1];
	this.vertices[index+8] = v_c[2];
	
	if( n_a == undefined || n_b == undefined || n_c == undefined )
	{
		var norm = ( v_b.sub( v_a ) ).cross( v_c.sub( v_a ) );
		
		this.normals[index]   = norm[0];
		this.normals[index+1] = norm[1];
		this.normals[index+2] = norm[2];
		
		this.normals[index+3] = norm[0];
		this.normals[index+4] = norm[1];
		this.normals[index+5] = norm[2];
		
		this.normals[index+6] = norm[0];
		this.normals[index+7] = norm[1];
		this.normals[index+8] = norm[2];
	}
	else
	{
		this.normals[index]   = n_a[0];
		this.normals[index+1] = n_a[1];
		this.normals[index+2] = n_a[2];
		
		this.normals[index+3] = n_b[0];
		this.normals[index+4] = n_b[1];
		this.normals[index+5] = n_b[2];
		
		this.normals[index+6] = n_c[0];
		this.normals[index+7] = n_c[1];
		this.normals[index+8] = n_c[2];
	}
	
	index = this.polycount*6;
	
	this.uvMaps[0][index]   = uv_a[0];
	this.uvMaps[0][index+1] = uv_a[1];
	
	this.uvMaps[0][index+2] = uv_b[0];
	this.uvMaps[0][index+3] = uv_b[1];
	
	this.uvMaps[0][index+4] = uv_c[0];
	this.uvMaps[0][index+5] = uv_c[1];
	
	this.polycount++;
};

Model3.prototype.tesselation = function( steps )
{
	if( steps > 0 )
	{
		var newPolys = new Array( 36*this.polycount );
		var newUVs = new Array( this.uvMaps.length );
		var newPolycount = 0;
		
		for( var i = 0; i < this.polycount; i++ )
		{
			var vertexPoints = new Array(6);
			var uvPoints = new Array(6);
			var index = 9*i;
			
			vertexPoints[0] = new Vec3( this.vertices[index], this.vertices[index+1], this.vertices[index+2] );
			vertexPoints[2] = new Vec3( this.vertices[index+3], this.vertices[index+4], this.vertices[index+5] );
			vertexPoints[4] = new Vec3( this.vertices[index+6], this.vertices[index+7], this.vertices[index+8] );
			
			vertexPoints[1] = ( ( vertexPoints[2].sub( vertexPoints[0] ) ).scalar( 0.5) ).add( vertexPoints[0] );
			vertexPoints[3] = ( ( vertexPoints[4].sub( vertexPoints[2] ) ).scalar( 0.5) ).add( vertexPoints[2] );
			vertexPoints[5] = ( ( vertexPoints[0].sub( vertexPoints[4] ) ).scalar( 0.5) ).add( vertexPoints[4] );
			
			index *= 4;
			
			newPolys[index] = vertexPoints[0][0];
			newPolys[index+1] = vertexPoints[0][1];
			newPolys[index+2] = vertexPoints[0][2];
			newPolys[index+3] = vertexPoints[1][0];
			newPolys[index+4] = vertexPoints[1][1];
			newPolys[index+5] = vertexPoints[1][2];
			newPolys[index+6] = vertexPoints[5][0];
			newPolys[index+7] = vertexPoints[5][1];
			newPolys[index+8] = vertexPoints[5][2];
			
			newPolys[index+9] = vertexPoints[2][0];
			newPolys[index+10] = vertexPoints[2][1];
			newPolys[index+11] = vertexPoints[2][2];
			newPolys[index+12] = vertexPoints[3][0];
			newPolys[index+13] = vertexPoints[3][1];
			newPolys[index+14] = vertexPoints[3][2];
			newPolys[index+15] = vertexPoints[1][0];
			newPolys[index+16] = vertexPoints[1][1];
			newPolys[index+17] = vertexPoints[1][2];
			
			newPolys[index+18] = vertexPoints[4][0];
			newPolys[index+19] = vertexPoints[4][1];
			newPolys[index+20] = vertexPoints[4][2];
			newPolys[index+21] = vertexPoints[5][0];
			newPolys[index+22] = vertexPoints[5][1];
			newPolys[index+23] = vertexPoints[5][2];
			newPolys[index+24] = vertexPoints[3][0];
			newPolys[index+25] = vertexPoints[3][1];
			newPolys[index+26] = vertexPoints[3][2];
			
			newPolys[index+27] = vertexPoints[1][0];
			newPolys[index+28] = vertexPoints[1][1];
			newPolys[index+29] = vertexPoints[1][2];
			newPolys[index+30] = vertexPoints[3][0];
			newPolys[index+31] = vertexPoints[3][1];
			newPolys[index+32] = vertexPoints[3][2];
			newPolys[index+33] = vertexPoints[5][0];
			newPolys[index+34] = vertexPoints[5][1];
			newPolys[index+35] = vertexPoints[5][2];
			
			index = 6*i;
			
			for( var j = 0; j < this.uvMaps.length; j++ )
			{
				if( newUVs[j] == undefined ) newUVs[j] = new Array( 18*this.polycount );
				
				uvPoints[0] = new Vec2( this.uvMaps[j][index], this.uvMaps[j][index+1] );
				uvPoints[2] = new Vec2( this.uvMaps[j][index+2], this.uvMaps[j][index+3] );
				uvPoints[4] = new Vec2( this.uvMaps[j][index+4], this.uvMaps[j][index+5] );
					
				uvPoints[1] = ( ( uvPoints[2].sub( uvPoints[0] ) ).scalar( 0.5) ).add( uvPoints[0] );
				uvPoints[3] = ( ( uvPoints[4].sub( uvPoints[2] ) ).scalar( 0.5) ).add( uvPoints[2] );
				uvPoints[5] = ( ( uvPoints[0].sub( uvPoints[4] ) ).scalar( 0.5) ).add( uvPoints[4] );
				
				index *= 4;
				
				newUVs[j][index] = uvPoints[0][0];
				newUVs[j][index+1] = uvPoints[0][1];
				newUVs[j][index+2] = uvPoints[1][0];
				newUVs[j][index+3] = uvPoints[1][1];
				newUVs[j][index+4] = uvPoints[5][0];
				newUVs[j][index+5] = uvPoints[5][1];
				
				newUVs[j][index+6] = uvPoints[2][0];
				newUVs[j][index+7] = uvPoints[2][1];
				newUVs[j][index+8] = uvPoints[3][0];
				newUVs[j][index+9] = uvPoints[3][1];
				newUVs[j][index+10] = uvPoints[1][0];
				newUVs[j][index+11] = uvPoints[1][1];
				
				newUVs[j][index+12] = uvPoints[4][0];
				newUVs[j][index+13] = uvPoints[4][1];
				newUVs[j][index+14] = uvPoints[5][0];
				newUVs[j][index+15] = uvPoints[5][1];
				newUVs[j][index+16] = uvPoints[3][0];
				newUVs[j][index+17] = uvPoints[3][1];
				
				newUVs[j][index+18] = uvPoints[1][0];
				newUVs[j][index+19] = uvPoints[1][1];
				
				newUVs[j][index+20] = uvPoints[3][0];
				newUVs[j][index+21] = uvPoints[3][1];
				
				newUVs[j][index+22] = uvPoints[5][0];
				newUVs[j][index+23] = uvPoints[5][1];
			}
			
			newPolycount += 4;
		}
		
		this.vertices = newPolys;
		this.uvMaps = newUVs;
		this.polycount = newPolycount;
		this.tesselation( steps-1 );
	}
};

Model3.prototype.getVertexBuffer = function( buffer, index )
{
	for( var i = 0; i < this.polycount; i++ )
	{
		var idx = 9*i;
		
		buffer[index] 	= this.vertices[idx];
		buffer[index+1]	= this.vertices[idx+1];
		buffer[index+2]	= this.vertices[idx+2];
		buffer[index+3]	= this.vertices[idx+3];
		buffer[index+4]	= this.vertices[idx+4];
		buffer[index+5]	= this.vertices[idx+5];
		buffer[index+6]	= this.vertices[idx+6];
		buffer[index+7]	= this.vertices[idx+7];
		buffer[index+8]	= this.vertices[idx+8];
		index += 9;
	}
	return index;
};

Model3.prototype.getUVBuffer = function( buffer, index )
{
	for( var i = 0; i < this.polycount; i++ )
	{
		var idx = 6*i;
		
		buffer[index] 	= this.uvMaps[0][idx];
		buffer[index+1]	= this.uvMaps[0][idx+1];
		buffer[index+2]	= this.uvMaps[0][idx+2];
		buffer[index+3]	= this.uvMaps[0][idx+3];
		buffer[index+4]	= this.uvMaps[0][idx+4];
		buffer[index+5]	= this.uvMaps[0][idx+5];
		index += 6;
	}
	return index;
};

Model3.prototype.getNormalBuffer = function( buffer, index )
{
	for( var i = 0; i < this.polys.length; i++ )
	{
		var norm = this.polys[i].getNormal().norm();
		buffer[index] 	= this.polys[i][6][0];
		buffer[index+1]	= this.polys[i][6][1];
		buffer[index+2]	= this.polys[i][6][2];
		buffer[index+3]	= this.polys[i][7][0];
		buffer[index+4]	= this.polys[i][7][1];
		buffer[index+5]	= this.polys[i][7][2];
		buffer[index+6]	= this.polys[i][8][0];
		buffer[index+7]	= this.polys[i][8][1];
		buffer[index+8]	= this.polys[i][8][2];
		index += 9;
	}
	
	return index;
};



function Polylist(){}

Polylist.prototype = new Array;

Polylist.prototype.addObj = function( obj )
{
	if( obj.constructor === Model3 )
	{
		this.push( obj );
		return this.length - 1;
	}
	
	return -1;
};

Polylist.prototype.getObjByName  = function( name )
{
	for( var i = 0; i < this.length; i++ )
	{
		if( this[i].name == name )
		return this[i];
	}
};

