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

	this.shaderSimple 	= null;
	this.shaderTexturas = null;

	this.asignarShaders = function(shaderProgSimple, shaderProgTexturas){
		this.shaderSimple 	= shaderProgSimple;
		this.shaderTexturas = shaderProgTexturas;
	}

	this.initBuffers = function(gl, shaderProgram){

	    this.pataUno = new pataGrua(this.escalaX, this.escalaY, this.escalaY);
	    this.pataUno.initBuffers(gl, shaderProgram);

	    this.pataDos = new pataGrua(this.escalaX, this.escalaY, this.escalaZ);
	    this.pataDos.initBuffers(gl, shaderProgram);

	    this.pluma = new pluma(this.escalaX, this.escalaY, this.escalaZ);
	    this.pluma.initBuffers(gl, shaderProgram);

	    this.barraSupDerecha = new cubo(6.0 * this.escalaX, 6.0 * this.escalaY, 45.0 * this.escalaZ, false, true);
	    this.barraSupDerecha.initBuffers(gl, shaderProgram, "yellow");
	    loadTexture(this.barraSupDerecha, this.barraSupDerecha.textureImage, "textfinales/texturaGrua.jpg");

	    this.barraSupIzq = new cubo(6.0 * this.escalaX, 6.0 * this.escalaY, 45.0 * this.escalaZ, false, true);
	    this.barraSupIzq.initBuffers(gl, shaderProgram, "yellow");
	   	loadTexture(this.barraSupIzq, this.barraSupIzq.textureImage, "textfinales/texturaGrua.jpg");

	    this.cabina = new cabina(this.escalaX, this.escalaY, this.escalaZ);
	    this.cabina.initBuffers(gl, shaderProgram, "rojoOpaco");

	    lamparaCabezaGrua = new lampara(10,10);
    	lamparaCabezaGrua.initBuffers(gl, "white");
	}


	this.draw = function(modelMatrix, gl, shaderProgram){

		/***** CONTEXTO TEXTURAS *****/
	    gl.useProgram(this.shaderTexturas);
  		gl.uniformMatrix4fv(this.shaderTexturas.perspectiveMatrixUniform, false, perspectiveMatrix);
  		gl.uniformMatrix4fv(this.shaderTexturas.viewMatrixUniform, false, cameraMatrix );

  		setLuces(cameraMatrix, gl, this.shaderTexturas);

	    var matrix_pluma = mat4.create();
	    mat4.identity(matrix_pluma);
	    mat4.multiply(matrix_pluma, matrix_pluma, modelMatrix);
	    mat4.translate(matrix_pluma, matrix_pluma, [0.0, 55.0 * this.escalaY, 0.0 ]);
	    this.pluma.draw(matrix_pluma, gl, this.shaderTexturas);

	   	var matrix_barraSupDer = mat4.create();
	    mat4.identity(matrix_barraSupDer);
	    mat4.multiply(matrix_barraSupDer, matrix_barraSupDer, modelMatrix);
	    mat4.translate(matrix_barraSupDer, matrix_barraSupDer, [-10.0 * this.escalaX, 57.0 * this.escalaY, 0.0 ]);
	    this.barraSupDerecha.draw(matrix_barraSupDer, gl, this.shaderTexturas);

	    var matrix_barraSupIzq = mat4.create();
	    mat4.identity(matrix_barraSupIzq);
	    mat4.multiply(matrix_barraSupIzq, matrix_barraSupIzq, modelMatrix);
	    mat4.translate(matrix_barraSupIzq, matrix_barraSupIzq, [10.0 * this.escalaX, 57.0 * this.escalaY, 0.0 ]);
	    this.barraSupIzq.draw(matrix_barraSupIzq, gl, this.shaderTexturas);

	    /***** CONTEXTO SIMPLE *****/
		gl.useProgram(shaderProgramSimple);
		gl.uniformMatrix4fv(gl.shaderProgramSimple.perspectiveMatrixUniform, false, perspectiveMatrix);
		gl.uniformMatrix4fv(gl.shaderProgramSimple.viewMatrixUniform, false, cameraMatrix );

	    var matrix_pataUno = mat4.create();
	    mat4.identity(matrix_pataUno);
	    mat4.multiply(matrix_pataUno, matrix_pataUno, modelMatrix);
	    mat4.translate(matrix_pataUno, matrix_pataUno, [0.0, 0.0, 25.0 * this.escalaZ]);
	    this.pataUno.draw(matrix_pataUno, gl, shaderProgram);

	    var matrix_pataDos = mat4.create();
	    mat4.identity(matrix_pataDos);
	    mat4.multiply(matrix_pataDos, matrix_pataDos, modelMatrix);
	    mat4.translate(matrix_pataDos, matrix_pataDos, [0.0, 0.0, -25.0 * this.escalaZ]);
	    this.pataDos.draw(matrix_pataDos, gl, shaderProgram);

	    // var matrix_barraSupDer = mat4.create();
	    // mat4.identity(matrix_barraSupDer);
	    // mat4.multiply(matrix_barraSupDer, matrix_barraSupDer, modelMatrix);
	    // mat4.translate(matrix_barraSupDer, matrix_barraSupDer, [-10.0 * this.escalaX, 57.0 * this.escalaY, 0.0 ]);
	    // this.barraSupDerecha.draw(matrix_barraSupDer, gl, shaderProgram);

	    // var matrix_barraSupIzq = mat4.create();
	    // mat4.identity(matrix_barraSupIzq);
	    // mat4.multiply(matrix_barraSupIzq, matrix_barraSupIzq, modelMatrix);
	    // mat4.translate(matrix_barraSupIzq, matrix_barraSupIzq, [10.0 * this.escalaX, 57.0 * this.escalaY, 0.0 ]);
	    // this.barraSupIzq.draw(matrix_barraSupIzq, gl, shaderProgram);

	    var matrix_cabina = mat4.create();
	    mat4.identity(matrix_cabina);
	    mat4.multiply(matrix_cabina, matrix_cabina, modelMatrix);
	    mat4.scale(matrix_cabina, matrix_cabina, [this.escalaX, this.escalaY, this.escalaZ]);
	    mat4.translate(matrix_cabina, matrix_cabina, [35.0 + traslacionXCabina , 49.9, 0.0 ]);
	    this.cabina.draw(matrix_cabina, gl, shaderProgram);

	    var matrix_lamparaCabeza = mat4.create();
		mat4.identity(matrix_lamparaCabeza);
		mat4.multiply(matrix_lamparaCabeza, matrix_lamparaCabeza, modelMatrix);
		mat4.translate(matrix_lamparaCabeza, matrix_lamparaCabeza, [93.0, 50.0, 0.0]);
		lamparaCabezaGrua.draw(matrix_lamparaCabeza, gl, shaderProgram);

	}

}