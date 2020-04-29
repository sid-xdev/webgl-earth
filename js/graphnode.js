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
		this.parent;
		this.allPolycount = 0;
	}

	Node.prototype.transformation = function( mat )
	{
		return mat;
	};

	Node.prototype.addChild = function( child )
	{	
		if( child instanceof Node )
		{
			this.childs.push( child );
			child.parent = this;
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
	
	Node.prototype.getRenderables = function( buffer )
	{
		if( this.constructor === GeometryNode && this.show == true )
		{
			buffer.push( this.leaf );
		}
		
		for( var child of this.childs )
		{
			child.getRenderables( buffer );
		}
	}
	
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
	
	// Base Leaf
	function Leaf( geometryIdx, pipelineIdx )
	{
		this.position = new Mat4()
		this.pipelineIndex = pipelineIdx;
		this.geometryIndex = geometryIdx;
	}
	
	// Container-Node for a pLeaf
	function GeometryNode( name, leaf )
	{
		Node.call( this, name );
		
		this.leaf = leaf;
		this.show = true;
	}
	
	GeometryNode.prototype = new Node();
	
	GeometryNode.prototype.constructor = GeometryNode;
	
	GeometryNode.prototype.calcTransformation = function( mat )
	{
		var buffer = new Array();
		var newMat = this.transformation( mat );
		var len = this.childs.length;
			
		if( !newMat )
		{
			newMat = mat;
		}
		
		this.leaf.position = this.ownMat;
		
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
		this.cameras = [];
	}
	
	Scenegraph.prototype.MAIN_CAMERA = 0;

	Scenegraph.prototype.getChilds = function( buffer, index )
	{
		buffer[index] = this.sGraph;
		index++;
		
		return this.sGraph.getChilds( buffer, index );
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
		if( gTopNode instanceof Node )
		{
			this.sGraph = gTopNode;
			gTopNode.parent = this;
			return true
		}
		return false;	
	};
	
	Scenegraph.prototype.getRenderables = function( buffer )
	{
		this.sGraph.getRenderables( buffer );
		buffer.sort( ( first, second ) => 
		{
			return first.pipelineIndex > first.pipelineIndex;
		} );
	}
	
	
