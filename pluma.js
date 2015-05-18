function pluma(scaleX, scaleY, scaleZ){

	this.contrapeso 	= null;
	this.barraDerecha	= null;
	this.barraIzquierda = null;
	this.barraAdelante 	= null;


	this.escalaX = scaleX;
	this.escalaY = scaleY;
	this.escalaZ = scaleZ;

	this.initBuffers = function(gl, shaderProgram){

	    this.contrapeso = new cubo(contrapesoX * this.escalaX, contrapesoY * this.escalaY, contrapesoZ * this.escalaZ);
	    this.contrapeso.initBuffers(gl, shaderProgram, "yellow");

	    this.barraDerecha = new cubo(largoPlumaX * this.escalaX, 6.0 * this.escalaY, 6.0 * this.escalaZ);
	    this.barraDerecha.initBuffers(gl, shaderProgram, "yellow");

	    this.barraIzquierda = new cubo(largoPlumaX * this.escalaX, 6.0 * this.escalaY, 6.0 * this.escalaZ);
	    this.barraIzquierda.initBuffers(gl, shaderProgram, "yellow");

	    this.barraAdelante = new cubo(4.0 * this.escalaX, 4.0 * this.escalaY, 15.0 * this.escalaZ);
	    this.barraAdelante.initBuffers(gl, shaderProgram, "yellow");

	}


	this.draw = function(modelMatrix, gl, shaderProgram){

		var matrix_contrapeso = mat4.create();
	    mat4.identity(matrix_contrapeso);
	    mat4.multiply(matrix_contrapeso, matrix_contrapeso, modelMatrix);
	    mat4.translate(matrix_contrapeso, matrix_contrapeso, [-50.0 * this.escalaX, 0.0 , 0.0]);
	    this.contrapeso.draw(matrix_contrapeso, gl, shaderProgram);

	    var matrix_barraDerecha = mat4.create();
	    mat4.identity(matrix_barraDerecha);
	    mat4.multiply(matrix_barraDerecha, matrix_barraDerecha, modelMatrix);
	    mat4.translate(matrix_barraDerecha, matrix_barraDerecha, [25.0 * this.escalaX, 0.0 , 7.0 * this.escalaZ]);
	    this.barraDerecha.draw(matrix_barraDerecha, gl, shaderProgram);

	    var matrix_barraIzquierda = mat4.create();
	    mat4.identity(matrix_barraIzquierda);
	    mat4.multiply(matrix_barraIzquierda, matrix_barraIzquierda, modelMatrix);
	    mat4.translate(matrix_barraIzquierda, matrix_barraIzquierda, [25.0 * this.escalaX, 0.0 , -7.0 * this.escalaZ]);
	    this.barraIzquierda.draw(matrix_barraIzquierda, gl, shaderProgram);

	    var matrix_barraAdelante = mat4.create();
	    mat4.identity(matrix_barraAdelante);
	    mat4.multiply(matrix_barraAdelante, matrix_barraAdelante, modelMatrix);
	    mat4.translate(matrix_barraAdelante, matrix_barraAdelante, [87.0 * this.escalaX, 0.0, 0.0]);
	    this.barraAdelante.draw(matrix_barraAdelante, gl, shaderProgram);

	}
}