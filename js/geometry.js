var NX_GEOMETRY = new function(){ 
	this.createBaseCube = function() {
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

	this.createArrow = function() {
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

	this.createIcosaeder = function(radius, resolution, name) {
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
			
			var vec1 = new Vec3(box.vertices[index], box.vertices[index + 1], box.vertices[index + 2]).norm();
			var vec2 = new Vec3(box.vertices[index + 3], box.vertices[index + 4], box.vertices[index + 5]).norm();
			var vec3 = new Vec3(box.vertices[index + 6], box.vertices[index + 7], box.vertices[index + 8]).norm();
			
			box.normals[index] = vec1[0];
			box.normals[index + 1] = vec1[1];
			box.normals[index + 2] = vec1[2];
			box.normals[index + 3] = vec2[0];
			box.normals[index + 4] = vec2[1];
			box.normals[index + 5] = vec2[2];
			box.normals[index + 6] = vec3[0];
			box.normals[index + 7] = vec3[1];
			box.normals[index + 8] = vec3[2];
			
			vec1 = vec1.scalar(radius);
			vec2 = vec2.scalar(radius);
			vec3 = vec3.scalar(radius);
			
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
}