function pataGrua(scaleX, scaleY, scaleZ){

	this.pataUno = null;
	this.pataDos = null;
	this.barraDiagonalGrua = null;
	this.barraCruzadaAbajoGrua = null;
	this.barraCruzadaArribaGrua = null;

	this.escalaX = scaleX;
	this.escalaY = scaleY;
	this.escalaZ = scaleZ;

	this.initBuffers = function(gl, shaderProgram){

	    this.pataUno = new cubo(4.0 * this.escalaX, 60.0 * this.escalaY, 4.0 * this.escalaZ);
	    this.pataUno.initBuffers(gl, shaderProgram, "yellow");

	    this.pataDos = new cubo(4.0 * this.escalaX, 60.0 * this.escalaY, 4.0 * this.escalaZ);
	    this.pataDos.initBuffers(gl, shaderProgram, "yellow");

	    this.barraCruzadaAbajoGrua = new cubo(40 * this.escalaX, 4.0 * this.escalaY, 4.0 * this.escalaZ);
	    this.barraCruzadaAbajoGrua.initBuffers(gl, shaderProgram, "yellow");

	    this.barraCruzadaArribaGrua = new cubo(40 * this.escalaX, 4.0 * this.escalaY, 4.0 * this.escalaZ);
	    this.barraCruzadaArribaGrua.initBuffers(gl, shaderProgram, "yellow");

	    this.barraDiagonalGrua = new cubo(49.0 * this.escalaX, 4.0 * this.escalaY, 4.0 * this.escalaZ);
	    this.barraDiagonalGrua.initBuffers(gl, shaderProgram, "yellow");
	}


	this.draw = function(modelMatrix, gl, shaderProgram){

		var matrix_pataUno = mat4.create();
	    mat4.identity(matrix_pataUno);
	    mat4.multiply(matrix_pataUno, matrix_pataUno, modelMatrix);
	    mat4.translate(matrix_pataUno, matrix_pataUno, [-21.25 * this.escalaX, 30.0 * this.escalaY, 0.0]);
	    this.pataUno.draw(matrix_pataUno, gl, shaderProgram);

	    var matrix_pataDos = mat4.create();
	    mat4.identity(matrix_pataDos);
	    mat4.multiply(matrix_pataDos, matrix_pataDos, modelMatrix);
	    mat4.translate(matrix_pataDos, matrix_pataDos, [21.25 * this.escalaX, 30.0 * this.escalaY, 0.0]);
	    this.pataDos.draw(matrix_pataDos, gl, shaderProgram);

	    var matrix_barraCruzadaAbajoGrua = mat4.create();
	    mat4.identity(matrix_barraCruzadaAbajoGrua);
	    mat4.multiply(matrix_barraCruzadaAbajoGrua, matrix_barraCruzadaAbajoGrua, modelMatrix);
	    mat4.translate(matrix_barraCruzadaAbajoGrua, matrix_barraCruzadaAbajoGrua, [0.0 , 22.5 * this.escalaY, 0.0]);
	    this.barraCruzadaAbajoGrua.draw(matrix_barraCruzadaAbajoGrua, gl, shaderProgram);

	    var matrix_barraCruzadaArribaGrua = mat4.create();
	    mat4.identity(matrix_barraCruzadaArribaGrua);
	    mat4.multiply(matrix_barraCruzadaArribaGrua, matrix_barraCruzadaArribaGrua, modelMatrix);
	    mat4.translate(matrix_barraCruzadaArribaGrua, matrix_barraCruzadaArribaGrua, [0.0, 58.0 * this.escalaY, 0.0]);
	    this.barraCruzadaArribaGrua.draw(matrix_barraCruzadaArribaGrua, gl, shaderProgram);

	    var matrix_barraDiagonalGrua = mat4.create();
	    mat4.identity(matrix_barraDiagonalGrua);
	   	mat4.multiply(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, modelMatrix);
	    mat4.translate(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, [0.0, 40.0 * this.escalaY, 0.0]);
	    mat4.rotate(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, degToRad(-38 * (this.escalaY / this.escalaX)), [0.0, 0.0, 1.0]);
	    this.barraDiagonalGrua.draw(matrix_barraDiagonalGrua, gl, shaderProgram);

	}
}