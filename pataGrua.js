function pataGrua(ancho, alto, profundo){

	this.pataGrua = null;
	this.pataDosGrua = null;
	this.barraDiagonalGrua = null;
	this.barraCruzadaAbajoGrua = null;
	this.barraCruzadaArribaGrua = null;

	this.initBuffers = function(gl, shaderProgram){

	    this.pataGrua = new cubo(4.0, 60.0, 4.0);
	    this.pataGrua.initBuffers(gl, shaderProgram, "yellow");

	    this.pataDosGrua = new cubo(4.0, 60.0, 4.0);
	    this.pataDosGrua.initBuffers(gl, shaderProgram, "yellow");

	    this.barraCruzadaAbajoGrua = new cubo(40, 4.0, 4.0);
	    this.barraCruzadaAbajoGrua.initBuffers(gl, shaderProgram, "yellow");

	    this.barraCruzadaArribaGrua = new cubo(40, 4.0, 4.0);
	    this.barraCruzadaArribaGrua.initBuffers(gl, shaderProgram, "yellow");

	    this.barraDiagonalGrua = new cubo(50.0, 4.0, 4.0);
	    this.barraDiagonalGrua.initBuffers(gl, shaderProgram, "yellow");
	}


	this.draw = function(modelMatrix, gl, shaderProgram){

		var matrix_pataGrua = mat4.create();
	    mat4.identity(matrix_pataGrua);
	    mat4.translate(matrix_pataGrua, matrix_pataGrua, [-21.25, 30.0, 0.0]);
	    this.pataGrua.draw(matrix_pataGrua, gl, shaderProgram);

	    var matrix_pataDosGrua = mat4.create();
	    mat4.identity(matrix_pataDosGrua);
	    mat4.translate(matrix_pataDosGrua, matrix_pataDosGrua, [21.25, 30.0, 0.0]);
	    this.pataDosGrua.draw(matrix_pataDosGrua, gl, shaderProgram);

	    var matrix_barraCruzadaAbajoGrua = mat4.create();
	    mat4.identity(matrix_barraCruzadaAbajoGrua);
	    mat4.translate(matrix_barraCruzadaAbajoGrua, matrix_barraCruzadaAbajoGrua, [0.0, 22.5, 0.0]);
	    this.barraCruzadaAbajoGrua.draw(matrix_barraCruzadaAbajoGrua, gl, shaderProgram);

	    var matrix_barraCruzadaArribaGrua = mat4.create();
	    mat4.identity(matrix_barraCruzadaArribaGrua);
	    mat4.translate(matrix_barraCruzadaArribaGrua, matrix_barraCruzadaArribaGrua, [0.0, 58, 0.0]);
	    this.barraCruzadaArribaGrua.draw(matrix_barraCruzadaArribaGrua, gl, shaderProgram);

	    var matrix_barraDiagonalGrua = mat4.create();
	    mat4.identity(matrix_barraDiagonalGrua);
	    mat4.translate(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, [0.0, 40.0, 0.0]);
	    mat4.rotate(matrix_barraDiagonalGrua, matrix_barraDiagonalGrua, degToRad(-39), [0.0, 0.0, 1.0]);
	    this.barraDiagonalGrua.draw(matrix_barraDiagonalGrua, gl, shaderProgram);

	}
}