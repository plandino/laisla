function grua(scaleX, scaleY, scaleZ){

	this.pataUno 	= null;
	this.pataDos 	= null;
	this.pluma 		= null;
	this.cabina 	= null;
	this.barraSupIzq 		= null;
	this.barraSupDerecha 	= null;


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

	    this.barraSupDerecha = new cubo(6.0, 6.0, 50.0);
	    this.barraSupDerecha.initBuffers(gl, shaderProgram, "yellow");

	    this.barraSupIzq = new cubo(6.0, 6.0, 50.0);
	    this.barraSupIzq.initBuffers(gl, shaderProgram, "yellow");

	    this.cabina = new cabina(1.0, 1.0, 1.0);
	    this.cabina.initBuffers(gl, shaderProgram, "red");
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

	    var matrix_barraSupDer = mat4.create();
	    mat4.identity(matrix_barraSupDer);
	    mat4.translate(matrix_barraSupDer, matrix_barraSupDer, [-10.0, 57.0, 0.0 ]);
	    this.barraSupDerecha.draw(matrix_barraSupDer, gl, shaderProgram);

	    var matrix_barraSupIzq = mat4.create();
	    mat4.identity(matrix_barraSupIzq);
	    mat4.translate(matrix_barraSupIzq, matrix_barraSupIzq, [10.0, 57.0, 0.0 ]);
	    this.barraSupIzq.draw(matrix_barraSupIzq, gl, shaderProgram);

	    var matrix_cabina = mat4.create();
	    mat4.identity(matrix_cabina);
	    mat4.translate(matrix_cabina, matrix_cabina, [0.0, 0.0, 0.0 ]);
	    this.cabina.draw(matrix_cabina, gl, shaderProgram);

	}
}