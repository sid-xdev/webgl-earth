
	// Structur for the 3D-Geometry
	function pLeaf( gId, dTex, dUV, tTex, bTex, sTex, rTex, gTex ) 
	{	
		this.geometryId = gId;
		this.program = "default"
		
		this.diffuse = dTex;
		this.diffus_uvId = dUV;
		this.diffuse_offset = [1,1];
		
		this.transparent = tTex;
		this.transparent_uvId = dUV;
		this.transparent_offset = [1,1];
		
		this.normal = bTex;
		this.normal_uvId = dUV;
		this.normal_offset = [1,1];
		
		this.specular = sTex;
		this.specular_uvId = dUV;
		this.specular_offset = [1,1];
		
		this.reflection = rTex;
		this.reflection_uvId = dUV;
		this.reflection_offset = [1,1];
		
		this.glow = gTex;
		this.glow_uvId = dUV;
		this.glow_offset = [1,1];
		
		this.posMat;
	}
	
	// Base Class for all Treenodes
	function Node( name )
	{
		if( name == undefined )
		{
			this.name = 'defaultNode';
		}
		else
		{
			this.name = name;
		}
		
		this.ownMat = new Mat4();
		this.childMat = new Mat4();
		this.childs = new Array();
		this.parent = new function() 
						{ 
							this.change = function()
							{ 
								return false; 
							} 
						};
		this.allPolycount = 0;
		this.changed = true;
	}

	Node.prototype.transformation = function( mat )
	{
		return mat;
	};

	Node.prototype.change = function()
	{
		this.changed = true;
		if( this.parent.change() ) return true;
		return false;
	};

	Node.prototype.addChild = function( child )
	{	
		if( child instanceof Node )
		{
			this.childs.push( child );
			child.changed = true;
			child.parent = this;
			this.change();
			return this.childs.length-1;
		}
		return -1;
	};
	
	Node.prototype.getChilds = function( buffer, index )
	{
		var len = this.childs.length;
		
		for( var i = 0; i < len; i++ )
		{
			buffer[index] = this.childs[i];
			index++;
			index = this.childs[i].getChilds( buffer, index );
		}
		
		return index;
	}

	Node.prototype.getPolyCounts = function( list )
	{
		if( this.changed )
		{
			var pCount = 0;
			var	len = this.childs.length;
			
			for( var i = 0; i < len; i++ )
			{
				pCount += this.childs[i].getPolyCounts( list );
			}
			
			this.allPolycount = pCount;
			this.changed = false;
		}
		return this.allPolycount;
	};

	Node.prototype.getVertexBuffer = function( buffer, index, list )
	{
		var len = this.childs.length;

		for( var i = 0; i < len; i++ )
		{
			index = this.childs[i].getVertexBuffer( buffer, index, list );
		}
		
		return index;
	};

	Node.prototype.calcTransformation = function( mat )
	{
		var buffer = new Array();
		var newMat = this.transformation( mat );
		var len = this.childs.length;
		
		if( !newMat )
		{
			newMat = mat;
		}
		
		for( var i = 0; i < len; i++ )
		{
			this.childs[i].calcTransformation( new Mat4( newMat ) );
		}
		
	};
		
	Node.prototype.getTransformationBuffer = function( buffer, index )
	{
		var	len = this.childs.length;
		
		for( var i = 0; i < len; i++ )
		{
			index = this.childs[i].getTransformationBuffer( buffer, index );
		}
		
		if( this.type == 1 )
		{
			for( var i = 0; i < 3*this.ownPolycount; i++ )
			{
				buffer[index+0] = this.ownMat[0];
				buffer[index+1] = this.ownMat[1];
				buffer[index+2] = this.ownMat[2];
				
				buffer[index+3] = this.ownMat[4];
				buffer[index+4] = this.ownMat[5];
				buffer[index+5] = this.ownMat[6];
				
				buffer[index+6] = this.ownMat[8];
				buffer[index+7] = this.ownMat[9];
				buffer[index+8] = this.ownMat[10];
				
				buffer[index+9] = this.ownMat[12];
				buffer[index+10] = this.ownMat[13];
				buffer[index+11] = this.ownMat[14];
				index += 12;
			}
		}
		
		return index;
	};
	
	Node.prototype.getUVBuffer = function( buffer, index, list )
	{
		var len = this.childs.length;

		for( var i = 0; i < len; i++ )
		{
			index = this.childs[i].getUVBuffer( buffer, index, list );
		}
		
		return index;
	};
	
	function cNode( p_name, p_angle, p_ratio, p_near, p_far ) //Camera-Node
	{
		Node.call( this, p_name );
		
		this.angleY = p_angle;
		this.ratio = p_ratio;
		this.near = p_near;
		this.far = p_far;
		
		this.height = 2*this.near*Math.tan( this.angleY*Math.PI/360.0 );
		this.width = this.height*this.ratio;
	}
	
	cNode.prototype = new Node();
	
	cNode.prototype.constructor = cNode;
	
	cNode.prototype.setClipping = function( p_near, p_far )
	{
		this.near = p_near;
		this.far = p_far;
		
		this.height = 2*this.near*Math.tan( this.angleY*Math.PI/360.0 );
		this.width = this.height*this.ratio;
	}
	
	cNode.prototype.setRatio = function( p_ratio )
	{
		this.ratio = p_ratio;
		
		this.height = 2*this.near*Math.tan( this.angleY*Math.PI/360.0 );
		this.width = this.height*this.ratio;
	}
	
	cNode.prototype.setYAngle = function( p_angle )
	{
		this.angleY = p_angle;
		
		this.height = 2*this.near*Math.tan( this.angleY*Math.PI/360.0 );
		this.width = this.height*this.ratio;
	}
	
	// Container-Node for a pLeaf
	function pNode( name, leaf )
	{
		Node.call( this, name );
		
		this.leaf = leaf;
		this.ownPolycount = 0;
		this.show = true;
		this.lightState = 1;
	}
	
	pNode.prototype = new Node();
	
	pNode.prototype.constructor = pNode;
	
	pNode.prototype.getUVBuffer = function( buffer, index, list )
	{
		var len = this.childs.length;
		
		index = list[this.leaf.geometryId].getUVBuffer( buffer, index );
		
		for( var i = 0; i < len; i++ )
		{
			index = this.childs[i].getUVBuffer( buffer, index, list );
		}
				
		return index;
	};
	
	pNode.prototype.getVertexBuffer = function( buffer, index, list )
	{
		var len = this.childs.length;
		
		index = list[this.leaf.geometryId].getVertexBuffer( buffer, index );
		
		for( var i = 0; i < len; i++ )
		{
			index = this.childs[i].getVertexBuffer( buffer, index, list );
		}
		
		return index;
	};
	
	pNode.prototype.getPolyCounts = function( list )
	{
		if( this.changed )
		{
			var pCount = 0;
			var	len = this.childs.length;
			
			this.ownPolycount = list[this.leaf.geometryId].polycount;
			
			for( var i = 0; i < len; i++ )
			{
				pCount += this.childs[i].getPolyCounts( list );
			}
			
			this.allPolycount = pCount + this.ownPolycount;
			this.changed = false;
		}
		return this.allPolycount;
	};
	
	pNode.prototype.calcTransformation = function( mat )
	{
		var buffer = new Array();
		var newMat = this.transformation( mat );
		var len = this.childs.length;
			
		if( !newMat )
		{
			newMat = mat;
		}
		
		this.leaf.posMat = this.ownMat;
		
		for( var i = 0; i < len; i++ )
		{
			this.childs[i].calcTransformation( new Mat4( newMat ) );
		}
	};
	
	// Group-Node for grouping Geometry
	function gNode( name )
	{
		Node.call( this, name );
	}
	
	gNode.prototype = new Node();
	
	gNode.prototype.constructor = gNode;
	
	function Timer( start )
	{	
		if( start == undefined )
		{
			this.timeStamp = new Date().getTime();
			this.gameTime = new Date().getTime();
		}
		else
		{
			this.timestamp = start;
			this.gameTime = start;
		}
		
		this.delta = 0;
		this.multi = 1;
	}
	
	Timer.prototype.getDelta = function( k )
	{
		if( k == undefined )
		{
			return this.delta * this.multi;
		}
		return k*this.delta;
	};
	
	Timer.prototype.setFrame = function()
	{
		var now = new Date().getTime();
		this.delta = now - this.timeStamp;
		this.gameTime += this.getDelta();
		this.timeStamp = now;
	};

	function Scenegraph()
	{
		this.timer = new Timer();
		this.sGraph = new gNode( "TopNode" );
		this.pCount = 0;
		this.changed = true;
		this.oList = false;
		this.cameras = [];
	}
	
	Scenegraph.prototype.MAIN_CAMERA = 0;

	Scenegraph.prototype.change = function()
	{
		this.pCount = this.sGraph.getPolyCounts( this.oList );
		this.changed = false;
	};

	Scenegraph.prototype.getChilds = function( buffer, index )
	{
		buffer[index] = this.sGraph;
		index++;
		
		return this.sGraph.getChilds( buffer, index );
	};

	Scenegraph.prototype.getSceneVertexBuffer = function( buffer, index )
	{
		return this.sGraph.getVertexBuffer( buffer, index, this.oList );
	};
	
	Scenegraph.prototype.getSceneUVBuffer = function( buffer, index )
	{
		return this.sGraph.getUVBuffer( buffer, index, this.oList );
	};

	Scenegraph.prototype.calcSceneTransformation = function( mat )
	{
		if( mat == undefined || mat.constructor !== Mat4 )
		{
			this.sGraph.calcTransformation( new Mat4() );
		}
		else
		{
			this.sGraph.calcTransformation( mat );
		}
	};

	Scenegraph.prototype.addGraph = function( gTopNode )
	{
		if( gTopNode instanceof Node && this.oList )
		{
			this.sGraph = gTopNode;
			gTopNode.parent = this;
			this.change();
			return true
		}
		return false;	
	};
	
	Scenegraph.prototype.sort = function()
	{
		
		var childs = [];
		var childcount = this.getChilds( childs, 0 );
		
		var sort_sg = new Scenegraph();
		var nTop = new gNode( "Top" );
		var def = new gNode( "colorProgram" );
		var earth = new gNode( "earthProgram" );
		var n1 = new gNode( "1." );
		var n2 = new gNode( "2." );
		
		def.type = "program";
		earth.type = "program";
		
		nTop.addChild( def );
		nTop.addChild( earth );
		earth.addChild( n1 );
		earth.addChild( n2 );
		
		sort_sg.oList = this.oList;
		sort_sg.addGraph( nTop );
		
		for( var i = 0; i < childcount; i++ )
		{
			if( childs[i].constructor === pNode )
			{
				var newnode = new pNode( childs[i].name, childs[i].leaf );
				newnode.lightState = childs[i].lightState;
				
				switch( childs[i].program )
				{
				case "earth":
					{
						if( childs[i].leaf.transparent == 10 )
						{			
							n1.addChild( newnode );
						}
						else
						{
							n2.addChild( newnode );
						}
						break;
					}
				default:
					{
						def.addChild( newnode );
					}
				}
			}
		}
		
		return sort_sg;
	}
	
	
