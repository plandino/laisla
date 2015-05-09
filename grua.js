function grua(scaleX, scaleY, scaleZ){

	this.pataUno 	= null;
	this.pataDos 	= null;
	this.pluma 		= null;

	this.escalaX = scaleX;
	this.escalaY = scaleY;
	this.escalaZ = scaleZ;

	this.initBuffers = function(gl, shaderProgram){

	    this.pataUno = new pataGrua(1.0, 1.0, 1.0);
	    this.pataUno.initBuffers(gl, shaderProgram);

	    this.pataDos = new pataGrua(1.0, 1.0, 1.0);
	    this.pataDos.initBuffers(gl, shaderProgram);

	    this.pluma = new pluma(1.0, 1.0, 1.0);
	    this.pluma.initBuffers(gl, shaderProgram);
	}


	this.draw = function(modelMatrix, gl, shaderProgram){

	    var matrix_pataUno = mat4.create();
	    mat4.identity(matrix_pataUno);
	    mat4.translate(matrix_pataUno, matrix_pataUno, [0.0, 0.0, 25.0 * this.escalaZ]);
	    this.pataUno.draw(matrix_pataUno, gl, shaderProgram);

	    var matrix_pataDos = mat4.create();
	    mat4.identity(matrix_pataDos);
	    mat4.translate(matrix_pataDos, matrix_pataDos, [0.0, 0.0, -25.0 * this.escalaZ]);
	    this.pataDos.draw(matrix_pataDos, gl, shaderProgram);

	    var matrix_pluma = mat4.create();
	    mat4.identity(matrix_pluma);
	    mat4.translate(matrix_pluma, matrix_pluma, [-15.0, 55.0, 0.0 ]);
	    this.pluma.draw(matrix_pluma, gl, shaderProgram);

	}
}