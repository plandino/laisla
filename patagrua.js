function pataGrua(scaleX, scaleY, scaleZ){

	this.pataUno = null;
	this.pataDos = null;
	this.barraDiagonalGrua = null;
	this.barraCruzadaAbajoGrua = null;
	this.barraCruzadaArribaGrua = null;
	this.ruedaUno = null;
	this.ruedaDos = null;

	this.escalaX = scaleX;
	this.escalaY = scaleY;
	this.escalaZ = scaleZ;

	this.initBuffers = function(gl, shaderProgram){

	    this.pataUno = new cubo(4.0 * this.escalaX, gruaY * this.escalaY, 4.0 * this.escalaZ, false, true);
	    this.pataUno.initBuffers(gl, shaderProgram, "yellow", coordenadasUVPatasVerticalesGrua);
	    loadTexture(this.pataUno, this.pataUno.textureImage, "textfinales/texturaGrua.jpg");

	    this.pataDos = new cubo(4.0 * this.escalaX, gruaY * this.escalaY, 4.0 * this.escalaZ, false, true);
	    this.pataDos.initBuffers(gl, shaderProgram, "yellow", coordenadasUVPatasVerticalesGrua);
	    loadTexture(this.pataDos, this.pataDos.textureImage, "textfinales/texturaGrua.jpg");

	    this.barraCruzadaAbajoGrua = new cubo(40.0 * this.escalaX, 6.0 * this.escalaY, 4.0 * this.escalaZ, false, true);
	    this.barraCruzadaAbajoGrua.initBuffers(gl, shaderProgram, "yellow", coordenadasUVPatasHorizontalesGrua);
   	    loadTexture(this.barraCruzadaAbajoGrua, this.barraCruzadaAbajoGrua.textureImage, "textfinales/texturaGrua.jpg");

	    this.barraCruzadaArribaGrua = new cubo(40.0 * this.escalaX, 6.0 * this.escalaY, 4.0 * this.escalaZ, false, true);
	    this.barraCruzadaArribaGrua.initBuffers(gl, shaderProgram, "yellow", coordenadasUVPatasHorizontalesGrua);
	    loadTexture(this.barraCruzadaArribaGrua, this.barraCruzadaArribaGrua.textureImage, "textfinales/texturaGrua.jpg");

	    this.barraDiagonalGrua = new cubo(50.0 * this.escalaX, 6.0 * this.escalaY, 3.9 * this.escalaZ, false, true);
	    this.barraDiagonalGrua.initBuffers(gl, shaderProgram, "yellow", coordenadasUVPatasDiagonalGrua);
	    loadTexture(this.barraDiagonalGrua, this.barraDiagonalGrua.textureImage, "textfinales/texturaGrua.jpg");


	    var forma = [];
	    var tangentes = [];
	    var normales = [];
	    var radio = 3.0;
	    var u = [];
	    for (var i = 0; i <= 2*Math.PI + 0.0001; i += 2*Math.PI/30.0){
	        var x = Math.cos(i);
	        var y = Math.sin(i);

	        forma.push(radio*x, radio*y, 0);
	        normales.push(vec3.fromValues(x, y, 0.0));
	        tangentes.push(vec3.fromValues(-y, x, 0.0));
	        u.push(x,y);
	    }
	    
	    var camino = [];
	    var escala = [];
	    var uv = [];
	    var longitud = 8.0;
	    for (var i = 0; i < longitud; i++){
	        camino.push([0, 0, i]);
	        // if ( longitud/4 < i < 3*longitud/4)
	        // 	escala.push(0.5,0.5,0.5)
	        // else
	        	escala.push([1.0, 1.0, 1.0]);
	        uv = uv.concat(u);
	    }

	    this.ruedaUno = new extrusion(forma, camino, escala, tangentes, normales, true);
	    this.ruedaUno.asignarCoordenadasUV(uv);
	    loadTexture(this.ruedaUno, this.ruedaUno.textureImage, "null");
	    this.ruedaUno.agregarTapa(0, false, true, "null", 10, 10);
	    this.ruedaUno.agregarTapa(camino.length-1, true, true, "null", 10, 10);
	    this.ruedaUno.initBuffers(gl, shaderProgram, "green");

	    this.ruedaDos = new extrusion(forma, camino, escala, tangentes, normales, true);
	    this.ruedaUno.agregarTapa(0, false, true, null, 10, 10);
	    this.ruedaUno.agregarTapa(camino.length-1, true, true, null, 10, 10);
	    this.ruedaUno.initBuffers(gl, shaderProgram, "green");
	}


	this.draw = function(modelMatrix, gl, shaderProgram){

		var matrix_pataUno = mat4.create();
	    mat4.identity(matrix_pataUno);
	    mat4.multiply(matrix_pataUno, matrix_pataUno, modelMatrix);
	    mat4.translate(matrix_pataUno, matrix_pataUno, [-22.0 * this.escalaX, (gruaY / 2) * this.escalaY, 0.0]);
	    this.pataUno.draw(matrix_pataUno, gl, shaderProgram);

	    var matrix_pataDos = mat4.create();
	    mat4.identity(matrix_pataDos);
	    mat4.multiply(matrix_pataDos, matrix_pataDos, modelMatrix);
	    mat4.translate(matrix_pataDos, matrix_pataDos, [22.0 * this.escalaX, (gruaY / 2) * this.escalaY, 0.0]);
	    this.pataDos.draw(matrix_pataDos, gl, shaderProgram);

	    var matrix_barraCruzadaAbajoGrua = mat4.create();
	    mat4.identity(matrix_barraCruzadaAbajoGrua);
	    mat4.multiply(matrix_barraCruzadaAbajoGrua, matrix_barraCruzadaAbajoGrua, modelMatrix);
	    mat4.translate(matrix_barraCruzadaAbajoGrua, matrix_barraCruzadaAbajoGrua, [0.0 , 21.0 * this.escalaY, 0.0]);
	    this.barraCruzadaAbajoGrua.draw(matrix_barraCruzadaAbajoGrua, gl, shaderProgram);

	    var matrix_barraCruzadaArribaGrua = mat4.create();
	    mat4.identity(matrix_barraCruzadaArribaGrua);
	    mat4.multiply(matrix_barraCruzadaArribaGrua, matrix_barraCruzadaArribaGrua, modelMatrix);
	    mat4.translate(matrix_barraCruzadaArribaGrua, matrix_barraCruzadaArribaGrua, [0.0, 57.0 * this.escalaY, 0.0]);
	    this.barraCruzadaArribaGrua.draw(matrix_barraCruzadaArribaGrua, gl, shaderProgram);

	    var matrix_barraDiagonalGrua = mat4.create();
	    mat4.identity(matrix_barraDiagonalGrua);
	   	mat4.multiply(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, modelMatrix);
	    mat4.translate(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, [0.0, 39.0 * this.escalaY, 0.0]);
	    mat4.rotate(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, degToRad(-36.87 * (this.escalaY / this.escalaX)), [0.0, 0.0, 1.0]);
	    this.barraDiagonalGrua.draw(matrix_barraDiagonalGrua, gl, shaderProgram);

	    var matrix_ruedaUno = mat4.create();
	    mat4.identity(matrix_ruedaUno);
	    mat4.multiply(matrix_ruedaUno, matrix_ruedaUno, modelMatrix);
	    mat4.translate(matrix_ruedaUno, matrix_ruedaUno, [24.75 * this.escalaX, 0.0, 0.0]);
	    mat4.rotate(matrix_ruedaUno, matrix_ruedaUno, degToRad(-90.0), [0.0, 1.0, 0.0]);
	    this.ruedaUno.drawConTextura(matrix_ruedaUno, gl, shaderProgram);

	    var matrix_ruedaDos = mat4.create();
	    mat4.identity(matrix_ruedaDos);
	    mat4.multiply(matrix_ruedaDos, matrix_ruedaDos, modelMatrix);
	    mat4.translate(matrix_ruedaDos, matrix_ruedaDos, [-17.75 * this.escalaX, 0.0, 0.0]);
	    mat4.rotate(matrix_ruedaDos, matrix_ruedaDos, degToRad(-90.0), [0.0, 1.0, 0.0]);
	    this.ruedaUno.drawConTextura(matrix_ruedaDos, gl, shaderProgram);
	}
}