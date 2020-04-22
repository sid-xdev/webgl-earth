function PlanetDemo()
{
	var gl;
	var sg;
	var input;
	
	var canvas;
	var legend;
	var status;

	NX_POS_I = 0;
	NX_UV_I = 1;
	NX_NORM_I = 2;

	NX_TEX1_TI = 3;
	NX_TEX2_TI = 4;
	NX_TEX3_TI = 5;
	NX_TEX4_TI = 6;
	NX_TEX5_TI = 7;

	NX_MAT1_MI = 10;

	function cube() {
		var box = new Model3("Cube");

		var a = new Vec3(1, 1, 1);
		var b = new Vec3(1, 1, -1);
		var c = new Vec3(-1, 1, -1);
		var d = new Vec3(-1, 1, 1);

		var e = new Vec3(1, -1, 1);
		var f = new Vec3(1, -1, -1);
		var g = new Vec3(-1, -1, -1);
		var h = new Vec3(-1, -1, 1);

		box.addPoly(a, b, e, new Vec2(1, 1), new Vec2(0, 1), new Vec2(1, 0));
		box.addPoly(e, b, f, new Vec2(1, 0), new Vec2(0, 1), new Vec2(0, 0));

		box.addPoly(b, c, f, new Vec2(1, 1), new Vec2(0, 1), new Vec2(1, 0));
		box.addPoly(f, c, g, new Vec2(1, 0), new Vec2(0, 1), new Vec2(0, 0));

		box.addPoly(c, d, g, new Vec2(1, 1), new Vec2(0, 1), new Vec2(1, 0));
		box.addPoly(g, d, h, new Vec2(1, 0), new Vec2(0, 1), new Vec2(0, 0));

		box.addPoly(d, a, h, new Vec2(1, 1), new Vec2(0, 1), new Vec2(1, 0));
		box.addPoly(h, a, e, new Vec2(1, 0), new Vec2(0, 1), new Vec2(0, 0));

		box.addPoly(a, d, b, new Vec2(1, 1), new Vec2(0, 1), new Vec2(1, 0));
		box.addPoly(b, d, c, new Vec2(1, 0), new Vec2(0, 1), new Vec2(0, 0));

		box.addPoly(e, h, f, new Vec2(1, 1), new Vec2(0, 1), new Vec2(1, 0));
		box.addPoly(f, h, g, new Vec2(1, 0), new Vec2(0, 1), new Vec2(0, 0));

		for (var i = 0; i < box.polycount; i++) {
			var index = i * 9
			var vec1 = new Vec3(box.vertices[index], box.vertices[index + 1], box.vertices[index + 2]).norm().scalar(1);
			var vec2 = new Vec3(box.vertices[index + 3], box.vertices[index + 4], box.vertices[index + 5]).norm().scalar(1);
			var vec3 = new Vec3(box.vertices[index + 6], box.vertices[index + 7], box.vertices[index + 8]).norm().scalar(1);

			box.vertices[index] = vec1[0];
			box.vertices[index + 1] = vec1[1];
			box.vertices[index + 2] = vec1[2];
			box.vertices[index + 3] = vec2[0];
			box.vertices[index + 4] = vec2[1];
			box.vertices[index + 5] = vec2[2];
			box.vertices[index + 6] = vec3[0];
			box.vertices[index + 7] = vec3[1];
			box.vertices[index + 8] = vec3[2];
		}

		return box;
	}

	function arrow() {
		var box = new Model3("Arrow");

		var a = new Vec3(0, 0, 0);
		var b = new Vec3(2, 1, 1);
		var c = new Vec3(2, -1, 1);
		var d = new Vec3(2, 1, -1);
		var e = new Vec3(2, -1, -1);

		box.addPoly(a, b, c, new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1));
		box.addPoly(a, d, b, new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1));
		box.addPoly(a, e, d, new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1));
		box.addPoly(a, c, e, new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1));

		return box;
	}

	function icosa(radius, resolution, name) {
		var pol = new Mat4();
		var box = new Model3(name);
		var phi = 0.5 * (1 + Math.sqrt(5));

		var i = new Vec3(0, 1, phi);
		var l = new Vec3(0, 1, -phi);
		var j = new Vec3(0, -1, phi);

		var k = new Vec3(0, -1, -phi);
		var a = new Vec3(1, phi, 0);
		var d = new Vec3(1, -phi, 0);

		var b = new Vec3(-1, phi, 0);
		var c = new Vec3(-1, -phi, 0);
		var g = new Vec3(phi, 0, 1);

		var f = new Vec3(-phi, 0, 1);
		var h = new Vec3(phi, 0, -1);
		var e = new Vec3(-phi, 0, -1);

		box.lvl = resolution;
		box.radius = radius;
		box.addPoly(b, e, f, new Vec2(10 / 11, 2 / 3), new Vec2(9 / 11, 1 / 3), new Vec2(1, 1 / 3));
		box.addPoly(b, l, e, new Vec2(10 / 11, 2 / 3), new Vec2(8 / 11, 2 / 3), new Vec2(9 / 11, 1 / 3));
		box.addPoly(b, a, l, new Vec2(10 / 11, 2 / 3), new Vec2(9 / 11, 1), new Vec2(8 / 11, 2 / 3));
		box.addPoly(b, i, a, new Vec2(0, 2 / 3), new Vec2(2 / 11, 2 / 3), new Vec2(1 / 11, 1));
		box.addPoly(b, f, i, new Vec2(0, 2 / 3), new Vec2(1 / 11, 1 / 3), new Vec2(2 / 11, 2 / 3));
		box.addPoly(j, i, f, new Vec2(3 / 11, 1 / 3), new Vec2(2 / 11, 2 / 3), new Vec2(1 / 11, 1 / 3));
		box.addPoly(j, g, i, new Vec2(3 / 11, 1 / 3), new Vec2(4 / 11, 2 / 3), new Vec2(2 / 11, 2 / 3));
		box.addPoly(j, d, g, new Vec2(3 / 11, 1 / 3), new Vec2(5 / 11, 1 / 3), new Vec2(4 / 11, 2 / 3));
		box.addPoly(j, c, d, new Vec2(3 / 11, 1 / 3), new Vec2(4 / 11, 0), new Vec2(5 / 11, 1 / 3));
		box.addPoly(j, f, c, new Vec2(3 / 11, 1 / 3), new Vec2(1 / 11, 1 / 3), new Vec2(2 / 11, 0));
		box.addPoly(e, c, f, new Vec2(9 / 11, 1 / 3), new Vec2(10 / 11, 0), new Vec2(1, 1 / 3));
		box.addPoly(e, k, c, new Vec2(9 / 11, 1 / 3), new Vec2(7 / 11, 1 / 3), new Vec2(8 / 11, 0));
		box.addPoly(e, l, k, new Vec2(9 / 11, 1 / 3), new Vec2(8 / 11, 2 / 3), new Vec2(7 / 11, 1 / 3));
		box.addPoly(g, a, i, new Vec2(4 / 11, 2 / 3), new Vec2(3 / 11, 1), new Vec2(2 / 11, 2 / 3));
		box.addPoly(g, h, a, new Vec2(4 / 11, 2 / 3), new Vec2(6 / 11, 2 / 3), new Vec2(5 / 11, 1));
		box.addPoly(g, d, h, new Vec2(4 / 11, 2 / 3), new Vec2(5 / 11, 1 / 3), new Vec2(6 / 11, 2 / 3));
		box.addPoly(d, k, h, new Vec2(5 / 11, 1 / 3), new Vec2(7 / 11, 1 / 3), new Vec2(6 / 11, 2 / 3));
		box.addPoly(d, c, k, new Vec2(5 / 11, 1 / 3), new Vec2(6 / 11, 0), new Vec2(7 / 11, 1 / 3));
		box.addPoly(a, h, l, new Vec2(7 / 11, 1), new Vec2(6 / 11, 2 / 3), new Vec2(8 / 11, 2 / 3));
		box.addPoly(k, l, h, new Vec2(7 / 11, 1 / 3), new Vec2(8 / 11, 2 / 3), new Vec2(6 / 11, 2 / 3));
		box.tesselation(resolution);

		for (var i = 0; i < box.polycount; i++) {
			var index = i * 9
			var vec1 = new Vec3(box.vertices[index], box.vertices[index + 1], box.vertices[index + 2]).norm().scalar(radius);
			var vec2 = new Vec3(box.vertices[index + 3], box.vertices[index + 4], box.vertices[index + 5]).norm().scalar(radius);
			var vec3 = new Vec3(box.vertices[index + 6], box.vertices[index + 7], box.vertices[index + 8]).norm().scalar(radius);

			box.vertices[index] = vec1[0];
			box.vertices[index + 1] = vec1[1];
			box.vertices[index + 2] = vec1[2];
			box.vertices[index + 3] = vec2[0];
			box.vertices[index + 4] = vec2[1];
			box.vertices[index + 5] = vec2[2];
			box.vertices[index + 6] = vec3[0];
			box.vertices[index + 7] = vec3[1];
			box.vertices[index + 8] = vec3[2];
		}

		return box;
	}

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

	function initScene() {
		sg = new Scenegraph();
		sg.oList = new Polylist();

		var planet = icosa(1, 1, "planet");
		var pos = sg.oList.addObj(planet);
		var pos1 = sg.oList.addObj(arrow());

		var nSun = new pNode("Sun", 	//Nodename 
			new pLeaf(pos, // geometry-index
				10, // colortex-index 
				0, // uvmap-index 
				10, // trensparent-index
				0, // normal-index 
				0, // spectular-index 
				0, // reflection-index
				10)); // glow-index
		nSun.lightState = 0;
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

		var nStars = new pNode("Stars", //Nodename
			new pLeaf(sg.oList.addObj(cube()), // geometry-index
				7, // colortex-index 
				0, // uvmap-index 
				10, // trensparent-index
				0, // normal-index 
				0, // spectular-index 
				0, // reflection-index
				0));// glow-index
		nStars.transformation = function (mat) {
			var trn = Mat4.translate(mat[12], mat[13], mat[14]);
			var scl = Mat4.scale(8000, 8000, 8000)

			this.ownMat = trn.multiply(scl);
			this.childMat = trn;

			return this.childMat;
		};
		nStars.leaf.diffuse_offset = [4, 4];
		nStars.lightState = 0;

		var nEarth = new pNode("Earth", //Nodename
			new pLeaf(pos, // geometry-index
				1, // colortex-index 
				0, // uvmap-index 
				10, // trensparent-index
				4, // normal-index 
				5, // spectular-index 
				3, // reflection-index
				0));// glow-index			
		nEarth.transformation = function (mat) {
			var rot = Mat4.rotate(31.717474, new Vec3(0, 0, 1));
			var scl = Mat4.scale(6.378, 6.378, 6.378);//(6.378)
			var newMat = mat.multiply(rot);

			this.ownMat = newMat.multiply(scl);
			this.childMat = newMat;

			return this.childMat;
		};
		nEarth.program = "earth";

		var nCloud = new pNode("Cloud", 	//Nodename 
			new pLeaf(pos, // geometry-index
				10, // colortex-index 
				0, // uvmap-index 
				6, // trensparent-index
				6, // normal-index 
				0, // spectular-index 
				0, // reflection-index
				0)); // glow-index

		nCloud.transformation = function (mat) {
			var scl = Mat4.scale(6.403, 6.403, 6.403);

			this.ownMat = mat.multiply(scl);
			this.childMat = mat;

			return this.childMat;
		};
		nCloud.program = "earth";

		var nMoon = new pNode("Moon", new pLeaf(pos, 2/*cTex*/, 0/*cUV*/, 10/*tTex*/, 0/*bTex*/, 0/*sTex*/, 0/*rTex*/));
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

		var markerT = new pLeaf(pos1, 10, 0, 10, 0, 0, 0, 10);
		var markerR = new pLeaf(pos1, 10, 0, 10, 0, 0, 0, 10);
		var markerL = new pLeaf(pos1, 10, 0, 10, 0, 0, 0, 10);
		var markerB = new pLeaf(pos1, 10, 0, 10, 0, 0, 0, 10);

		var nMarkTop = new pNode("MarkTop", markerT);
		nMarkTop.lightState = 0;
		nMarkTop.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(-90, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkLeft = new pNode("MarkLeft", markerL);
		nMarkLeft.lightState = 0;
		nMarkLeft.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(180, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkRight = new pNode("MarkRight", markerR);
		nMarkRight.lightState = 0;
		nMarkRight.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(0, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		var nMarkBottom = new pNode("MarkBottom", markerB);
		nMarkBottom.lightState = 0;
		nMarkBottom.transformation = function (mat) {
			this.ownMat = mat.multiply(Mat4.rotate(90, new Vec3(0, 1, 0)).multiply(Mat4.translate(this.parent.move, 0, 0).multiply(Mat4.scale(1 / 2, 0.25 / 4, 0.5 / 2))));
			this.childMat = this.ownMat;

			return this.childMat;
		}

		nEarth.addChild(nCloud);
		nCloud.addChild(nMark);
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

		sg.vBuffer = new Float32Array(sg.pCount * 9);
		sg.uvBuffer = new Float32Array(sg.pCount * 6);
	}

	function initTex(gl, list) {
		gl.texList[0] = gl.createTexture();
		var nTextures = 0;
		for (var i = 0; i < list.length; i++) {
			var img = new Image();

			img.index = list[i].index;

			appendStatus("Loading texture " + list[i].src + "...", "img" + img.index);

			img.onerror = function (event) {
				updateStatus("Failed to load texture " + this.src + ". Please reload web page.", "img" + this.index);
			};

			img.onload = function (event) {
				updateStatus("Complete loading texture " + this.src + ".", "img" + this.index);
				gl.texList[this.index] = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, gl.texList[this.index]);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
				gl.generateMipmap(gl.TEXTURE_2D);
				gl.bindTexture(gl.TEXTURE_2D, null);
				++nTextures;
				if (nTextures == list.length) {
					render();
				}
			};

			img.src = list[i].src;
		}
	}

	function initFramebuffer(gl) {
		gl.beautyFramebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, gl.beautyFramebuffer);

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

	function initGl(canvas) {
		try {
			gl = canvas.getContext('webgl'); //WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));			// abrufen des Kontext für WebGL aus dem canvas
		}
		catch (e) { }

		// wenn Kontext nicht vorhanden dann webGL nicht unterstützt oder deaktiviert
		if (!gl) {
			alert('webGL not activiated or supported');
		}

		gl.texList = new Array();
	}

	function initShader(list) {
		var len = list.length;

		for (var i = 0; i < list.length; i++) {
			var name = list[i].name.toLowerCase() + "Program";

			// erstellen der Shader-Objekte
			var vShader = gl.createShader(gl.VERTEX_SHADER);
			var fShader = gl.createShader(gl.FRAGMENT_SHADER);

			// Programm-Objekte für die Shader
			gl[name] = gl.createProgram();
			gl.bindAttribLocation(gl[name], NX_POS_I, "aVertexPos");
			gl.bindAttribLocation(gl[name], NX_UV_I, "aVertexUV");
			gl.bindAttribLocation(gl[name], NX_NORM_I, "aVertexNorm");

			// zuordnen des Quellcodes zu den Shader-Objekten
			gl.shaderSource(vShader, list[i].v);
			gl.shaderSource(fShader, list[i].f);

			// kompilieren der Shader-Programme
			gl.compileShader(vShader);
			gl.compileShader(fShader);

			console.log("v" + name + "Shader\n" + gl.getShaderInfoLog(vShader));
			console.log("f" + name + "Shader\n" + gl.getShaderInfoLog(fShader));

			// anhängen der Shaderprogramme an das Träger Programm
			gl.attachShader(gl[name], vShader);
			gl.attachShader(gl[name], fShader);

			// das Trägerprogramm wird abschliessend gelinkt
			gl.linkProgram(gl[name]);
		}

		return true;
	}

	function initBuffer() {
		sg.t = sg.sort();
		sg.t.getSceneVertexBuffer(sg.vBuffer, 0);
		sg.t.getSceneUVBuffer(sg.uvBuffer, 0);

		gl.vPosBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, sg.vBuffer, gl.STATIC_DRAW);

		gl.vNormBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vNormBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, sg.vBuffer, gl.STATIC_DRAW);

		gl.vUVBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vUVBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, sg.uvBuffer, gl.STATIC_DRAW);

		gl.vPosScreenBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vPosScreenBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0]), gl.STATIC_DRAW);

		gl.vUVScreenBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vUVScreenBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0]), gl.STATIC_DRAW);
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

	function collision(obj) {
		var collPoint = false;
		var old_abs = false;

		var width = sg.cameras[sg.MAIN_CAMERA].width;
		var height = sg.cameras[sg.MAIN_CAMERA].height;
		var camMat = sg.cameras[sg.MAIN_CAMERA].ownMat;
		var objPly = sg.oList[obj.leaf.geometryId].vertices;
		var objMat = obj.ownMat;

		var p0 = camMat.multiply(new Vec3(0, 0, 0));
		var p1 = camMat.multiply(new Vec3(input.old_clientX / gl.bufferWidth * width - width / 2, -1 * (input.old_clientY / gl.bufferWidth * height - height / 2), -1 * sg.cameras[sg.MAIN_CAMERA].near)).sub(p0);

		if (true) {
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
		}
		else //direkter Polygon-Klick-test für lowpoly Icosaeder !!!ungenau noch nicht ausgereift!!! 
		{
			var a = [3];
			var b = [3];

			var lvl = sg.oList[obj.leaf.geometryId].lvl;
			var lastindex = false;
			var count = (obj.ownPolycount * 9) / 20;

			for (var i = 0; i < obj.ownPolycount * 9; i += count) {
				var index = count / 4;
				var p2 = objMat.multiply(new Vec3(objPly[i], objPly[i + 1], objPly[i + 2]).scalar(1));
				var p3 = objMat.multiply(new Vec3(objPly[i + index], objPly[i + index + 1], objPly[i + index + 2]).scalar(1)).sub(p2);
				var p4 = objMat.multiply(new Vec3(objPly[i + 2 * index], objPly[i + 2 * index + 1], objPly[i + 2 * index + 2]).scalar(1)).sub(p2);

				a[0] = [-p1[0], p3[0], p4[0]];
				a[1] = [-p1[1], p3[1], p4[1]];
				a[2] = [-p1[2], p3[2], p4[2]];

				b[0] = p2[0] - p2[0];
				b[1] = p2[1] - p2[1];
				b[2] = p2[2] - p2[2];

				var r = gauß(a, b);

				if ((r[1] + r[2] <= 1) && (r[1] >= 0) && (r[2] >= 0)) {
					var pc = p0.add(p1.scalar(r[0]));
					var abs = pc.sub(p0).abs();

					if (old_abs > abs || !old_abs) {
						old_abs = abs;
						lastindex = i;
					}
				}
			}

			if (lastindex) {
				var newindex = false;

				for (l = 1; l < lvl; l++) {
					count = (obj.ownPolycount * 9) / (20 * Math.pow(4, l));

					for (var j = lastindex; j < (4 * count + lastindex); j += count) {
						var index = count / 4;
						var p2 = objMat.multiply(new Vec3(objPly[j], objPly[j + 1], objPly[j + 2]).scalar(1));
						var p3 = objMat.multiply(new Vec3(objPly[j + index], objPly[j + index + 1], objPly[j + index + 2]).scalar(1)).sub(p2);
						var p4 = objMat.multiply(new Vec3(objPly[j + 2 * index], objPly[j + 2 * index + 1], objPly[j + 2 * index + 2]).scalar(1)).sub(p2);

						a[0] = [-p1[0], p3[0], p4[0]];
						a[1] = [-p1[1], p3[1], p4[1]];
						a[2] = [-p1[2], p3[2], p4[2]];

						b[0] = p2[0] - p2[0];
						b[1] = p2[1] - p2[1];
						b[2] = p2[2] - p2[2];

						var r = gauß(a, b);

						if ((r[1] + r[2] <= 1) && (r[1] >= 0) && (r[2] >= 0)) {
							var pc = p0.add(p1.scalar(r[0]));
							var abs = pc.sub(p0).abs();

							if (old_abs > abs || !old_abs) {
								old_abs = abs;
								newindex = j;
							}
						}
					}

					if (!newindex) {
						lastindex = false;
						break;
					}
					else {
						lastindex = newindex;
					}
				}
			}

			if (lastindex) {
				for (var i = lastindex; i < 9 * 4 + lastindex; i += 9) {
					var p2 = new Vec3(objPly[i], objPly[i + 1], objPly[i + 2]);
					var p3 = new Vec3(objPly[i + 3], objPly[i + 4], objPly[i + 5]);
					var p4 = new Vec3(objPly[i + 6], objPly[i + 7], objPly[i + 8]);
					p2 = objMat.multiply(p2);
					p3 = objMat.multiply(p3).sub(p2);
					p4 = objMat.multiply(p4).sub(p2);

					a[0] = [-p1[0], p3[0], p4[0]];
					a[1] = [-p1[1], p3[1], p4[1]];
					a[2] = [-p1[2], p3[2], p4[2]];

					b[0] = p2[0] - p2[0];
					b[1] = p2[1] - p2[1];
					b[2] = p2[2] - p2[2];

					var r = gauß(a, b);

					if ((r[1] + r[2] <= 1) && (r[1] >= 0) && (r[2] >= 0)) {
						var pc = p0.add(p1.scalar(r[0]));
						var abs = pc.sub(p0).abs();

						if (old_abs > abs || !old_abs) {
							old_abs = abs;
							collPoint = pc;
						}
					}
				}
			}
		}

		return collPoint;
	}

	function tick() {
		var c = new Date();
		sg.timer.setFrame();
		drawScene();
		if( status && status.innerHTML )
		{
			var end = c.getTime();
			if (end - gl.timer > 1000) {
				status.innerHTML = "Polycount: " + sg.pCount
					+ "<br>FpS: " + gl.fps
					+ "<br>Zeitfaktor: " + sg.timer.multi + "x";
				gl.timer = end;
				gl.fps = 0;
			}
			gl.fps++;
		}
		requestAnimationFrame(tick);
	}

	function drawPerObject(node, index, glow, program) {
		var len = node.childs.length;

		if (node.constructor === gNode && node.type == "program") {
			program = gl[node.name];
			program.setUniformsPerFrame();

			gl.uniform1i(program.uni.glowStatePointer, glow);

		}

		for (var i = 0; i < len; i++) {
			index = drawPerObject(node.childs[i], index, glow, program);
		}

		if (node.constructor === pNode && node.show) {
			program.setUniformsPerLeaf(node.leaf);
			gl.uniform1i(program.uni.lightStatePointer, node.lightState);
			gl.drawArrays(gl.TRIANGLES, index, 3 * node.ownPolycount);
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
			initFramebuffer(gl);
		}

		sg.cameras[sg.MAIN_CAMERA].setRatio(canvas.width / canvas.height);
		sg.calcSceneTransformation();
		sg.t.getSceneUVBuffer(sg.uvBuffer, 0);

		// Multipass rendering
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vPosBuffer);
		gl.vertexAttribPointer(NX_POS_I, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(NX_POS_I);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vUVBuffer);
		gl.vertexAttribPointer(NX_UV_I, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(NX_UV_I);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.vNormBuffer);
		gl.vertexAttribPointer(NX_NORM_I, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(NX_NORM_I);

		// Color-Pass

		gl.bindFramebuffer(gl.FRAMEBUFFER, gl.beautyFramebuffer);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.enable(gl.BLEND);

		drawPerObject(sg.t.sGraph, 0, 0);

		// Glow-Pass
		gl.bindFramebuffer(gl.FRAMEBUFFER, gl.glowFramebuffer[0]);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		drawPerObject(sg.t.sGraph, 0, 1);

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

	function webGLStart(slist) {
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

		// erstellen der Textureliste (TODO aus Datei auslesen);
		var list = new Array(8);

		list[0] = new function () {
			this.index = 1;
			this.src = "img/world.jpg";
		};

		list[1] = new function () {
			this.index = 2;
			this.src = "img/moon.jpg";
		};

		list[2] = new function () {
			this.index = 3;
			this.src = "img/night.jpg";
		};

		list[3] = new function () {
			this.index = 4;
			this.src = "img/bump.jpg";
		};

		list[4] = new function () {
			this.index = 5;
			this.src = "img/spec.jpg";
		};

		list[5] = new function () {
			this.index = 10;
			this.src = "img/white.jpg";
		};

		list[6] = new function () {
			this.index = 6;
			this.src = "img/cloud.jpg";
		};

		list[7] = new function () {
			this.index = 7;
			this.src = "img/stars.jpg";
		};

		initGl(canvas);

		initShader(slist);
		initTex(gl, list);

		if( legend && legend.style )
		{
			legend.style.display = '';
		}
	}

	function render() {
		initScene();

		initBuffer();
		initFramebuffer(gl);
		initUniform();

		sg.timer.multi = 10000;

		gl.timer = new Date().getTime();
		gl.fps = 0;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		tick();
	}

	this.loadWebGL = function( render_canvas, status_div, legend_div ) {
		if( render_canvas )
		{
			canvas = render_canvas;
			legend = legend_div;
			status = status_div;
			
			var shaderlist = [];
			
			shaderlist[0] = { name: "Color" };
			shaderlist[1] = { name: "Blur" };
			shaderlist[2] = { name: "Comp" };
			shaderlist[3] = { name: "Earth" };

			var len = shaderlist.length;
			var fileEnding = ".txt";
			var prefix = "shader/"
			var finishedShaderCount = 0;

			function getShaderFile(index, type) {
				return shaderlist[index].name + '_' + type + 'Shader' + fileEnding;
			};

			function ErrorHandler(response, object) {
				updateStatus('Failed to load fragment shader "' + getShaderFile(object.index, object.type) + '".', object.type + 'shader' + object.index);
			}

			function SuccessHandler(response, object) {
				updateStatus('Complete loading fragment shader "' + getShaderFile(object.index, object.type) + '".', object.type + 'shader' + object.index);

				if (object.type == 'f') {
					shaderlist[object.index].f = response;
				}
				else {
					shaderlist[object.index].v = response;
				}

				++finishedShaderCount
				if (finishedShaderCount == 2 * len) {
					if( status )
					{
						status.innerHTML = '';
					}
					webGLStart(shaderlist);
				}
			}
			
			function ShaderId( index, type )
			{
				this.index = index;
				this.type = type;
			};
			
			for (var i = 0; i < len; i++) {
				
				var vShader = new ShaderId( i, 'v' );
				appendStatus('Loading vertex shader "' + getShaderFile(i, vShader.type) + '" ...', vShader.type + 'shader' + i);
				NXJS.OpenAsyncGET(prefix + getShaderFile(i, vShader.type), false, SuccessHandler, ErrorHandler, vShader);


				var fShader = new ShaderId( i, 'f' );
				appendStatus('Loading fragment shader "' + getShaderFile(i, fShader.type) + '" ...', fShader.type + 'shader' + i);
				NXJS.OpenAsyncGET(prefix + getShaderFile(i, fShader.type), false, SuccessHandler, ErrorHandler, fShader);
			}
		}
	}
}