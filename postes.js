function postes(){

	this.posteUno 	= null;
	this.posteDos 	= null;
	this.lamparaUno = null;
	this.lamparaDos = null;

	this.initBuffers = function(gl, shaderProgram){

	    var forma = [];
	    var normales = [];
	    var tangentes = [];
	    var radio = 3.0;
	    for (var i = 0; i <= 2*Math.PI + 0.0001; i += 2*Math.PI/30.0){
	        var x = Math.cos(i);
	        var y = Math.sin(i);

	        forma.push(radio*x, radio*y, 0);
	        normales.push(vec3.fromValues(x, y, 0));
	        tangentes.push(vec3.fromValues(-y, x, 0));
	    }
	    
	    var camino = [];
	    var escala = [];

	    for (var i = 0; i < 8; i++){
	        camino.push([0, 0, i]);
	        escala.push([1.0, 1.0, 1.0]);
	    }

	    this.posteUno = new extrusion(forma, camino, escala, tangentes, normales, null);
	    this.posteUno.agregarTapa(0, false, false, null, 0, 0);
	    this.posteUno.agregarTapa(camino.length-1, true, false, null, 0, 0);
	    this.posteUno.initBuffers(gl, shaderProgram, "orange");

	    this.posteDos = new extrusion(forma, camino, escala, tangentes, normales, null);
	    this.posteDos.agregarTapa(0, false, false, null, 0, 0);
	    this.posteDos.agregarTapa(camino.length-1, true, false, null, 0, 0);
	    this.posteDos.initBuffers(gl, shaderProgram, "orange");

	    this.lamparaUno = new lampara(10,10);
    	this.lamparaUno.initBuffers(gl, "white");

    	this.lamparaDos = new lampara(10,10);
    	this.lamparaDos.initBuffers(gl, "white");
	}

	this.draw = function(modelMatrix, gl, shaderProgram){
	    var matrix_posteUno = mat4.create();
	    mat4.identity(matrix_posteUno);
	    mat4.multiply(matrix_posteUno, matrix_posteUno, modelMatrix);
	    mat4.translate(matrix_posteUno, matrix_posteUno, [20 , 18.3, 150.0]);
	    mat4.scale(matrix_posteUno, matrix_posteUno, [0.3, 3.5, 0.3]);
	    mat4.rotate(matrix_posteUno, matrix_posteUno, degToRad(90.0), [1.0, 0.0, 0.0]);
	    this.posteUno.draw(matrix_posteUno, gl, shaderProgram);

	   	var matrix_posteDos = mat4.create();
	    mat4.identity(matrix_posteDos);
	    mat4.multiply(matrix_posteDos, matrix_posteDos, modelMatrix);
	    mat4.translate(matrix_posteDos, matrix_posteDos, [20 , 18.3, -70.0]);
	    mat4.scale(matrix_posteDos, matrix_posteDos, [0.3, 3.5, 0.3]);
   	    mat4.rotate(matrix_posteDos, matrix_posteDos, degToRad(90.0), [1.0, 0.0, 0.0]);
	    this.posteDos.draw(matrix_posteDos, gl, shaderProgram);

	    var matrix_lamparaUno = mat4.create();
		mat4.identity(matrix_lamparaUno);
		mat4.translate(matrix_lamparaUno, matrix_lamparaUno, [20.0, 20.0, 150.0]);
		this.lamparaUno.draw(matrix_lamparaUno, gl, shaderProgramSimple);

		var matrix_lamparaDos = mat4.create();
		mat4.identity(matrix_lamparaDos);
		mat4.translate(matrix_lamparaDos, matrix_lamparaDos, [20.0, 20.0, -70.0]);
		this.lamparaDos.draw(matrix_lamparaDos, gl, shaderProgramSimple);
	}
}