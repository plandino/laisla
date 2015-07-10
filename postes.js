function postes(){

	this.posteUno 	= null;
	this.posteDos 	= null;
	this.uvPostes 	= null;
	this.lamparaUno = null;
	this.lamparaDos = null;

	this.initBuffers = function(gl, shaderProgram){

	    var forma = [];
	    var normales = [];
	    var tangentes = [];
	    var radio = 3.0;
	    var pasos = 30;
	    var u = [];
	    for (var i = 0.0; i <= 2*Math.PI + 0.0001; i += 2*Math.PI/pasos){
	        var x = Math.cos(i);
	        var y = Math.sin(i);

	        forma.push(radio*x, radio*y, 0);
	        normales.push(vec3.fromValues(x, y, 0));
	        tangentes.push(vec3.fromValues(-y, x, 0));
	        u.push(i/(2*Math.PI));
	    }
	    
	    var camino = [];
	    var escala = [];
	    this.uvPostes = [];

	    for (var i = 0; i < 8; i++){
	        camino.push([0, 0, i]);
	        escala.push([1.0, 1.0, 1.0]);
            for (var j in u){
                this.uvPostes.push(u[j]);
                this.uvPostes.push(i/2.0);
            }
	    }


	    this.posteUno = new extrusion(forma, camino, escala, tangentes, normales, true);
	    this.posteUno.asignarCoordenadasUV(this.uvPostes);
	    loadTexture(this.posteUno, this.posteUno.textureImage, "textfinales/postes.jpg");
	    this.posteUno.loadCubeMap();
	    this.posteUno.initBuffers(gl, shaderProgram, "orange");

	    this.posteDos = new extrusion(forma, camino, escala, tangentes, normales, true);
	    this.posteDos.asignarCoordenadasUV(this.uvPostes);
	    loadTexture(this.posteDos, this.posteDos.textureImage, "textfinales/postes.jpg");
	    this.posteDos.loadCubeMap();
	    this.posteDos.initBuffers(gl, shaderProgram, "orange");


	    this.lamparaUno = new lampara(10,10);
    	this.lamparaUno.initBuffers(gl, "white");

    	this.lamparaDos = new lampara(10,10);
    	this.lamparaDos.initBuffers(gl, "white");
	}

	this.draw = function(modelMatrix, gl, shaderProgramSimple, shaderProgramReflection, shaderProgramSoloTexturas){
		var ks = 0.0;
		gl.useProgram(shaderProgramReflection);
	    gl.uniformMatrix4fv(gl.shaderProgramReflection.perspectiveMatrixUniform, false, perspectiveMatrix);
	    gl.uniformMatrix4fv(gl.shaderProgramReflection.viewMatrixUniform, false, cameraMatrix );

	    gl.uniform3fv(gl.shaderProgramReflection.worldCameraPosition, worldCameraPosition);

	    setLucesNormal(cameraMatrix, gl, shaderProgramReflection);

	    var matrix_posteUno = mat4.create();
	    mat4.identity(matrix_posteUno);
	    mat4.multiply(matrix_posteUno, matrix_posteUno, modelMatrix);
	    mat4.translate(matrix_posteUno, matrix_posteUno, [lamparasX , 18.3, lamparaZ1]);
	    mat4.scale(matrix_posteUno, matrix_posteUno, [0.3, 3.5, 0.3]);
	    mat4.rotate(matrix_posteUno, matrix_posteUno, degToRad(90.0), [1.0, 0.0, 0.0]);
	    this.posteUno.drawConTextura(matrix_posteUno, gl, shaderProgramReflection, KA, KD, ks, S, shaderProgramSoloTexturas, null);
	    // drawConTextura(modelMatrix, gl, shaderProgram, KA, KD, 0.3, S, shaderProgramSoloTexturas, shaderRelieve)

	   	var matrix_posteDos = mat4.create();
	    mat4.identity(matrix_posteDos);
	    mat4.multiply(matrix_posteDos, matrix_posteDos, modelMatrix);
	    mat4.translate(matrix_posteDos, matrix_posteDos, [lamparasX , 18.3, lamparaZ2]);
	    mat4.scale(matrix_posteDos, matrix_posteDos, [0.3, 3.5, 0.3]);
   	    mat4.rotate(matrix_posteDos, matrix_posteDos, degToRad(90.0), [1.0, 0.0, 0.0]);
	    this.posteDos.drawConTextura(matrix_posteDos, gl, shaderProgramReflection, KA, KD, ks, S, shaderProgramSoloTexturas, null);


	    gl.useProgram(shaderProgramSimple);
		gl.uniformMatrix4fv(gl.shaderProgramSimple.perspectiveMatrixUniform, false, perspectiveMatrix);
		gl.uniformMatrix4fv(gl.shaderProgramSimple.viewMatrixUniform, false, cameraMatrix );

	    var matrix_lamparaUno = mat4.create();
		mat4.identity(matrix_lamparaUno);
		mat4.translate(matrix_lamparaUno, matrix_lamparaUno, [lamparasX, lamparasY, lamparaZ1]);
		this.lamparaUno.draw(matrix_lamparaUno, gl, shaderProgramSimple);

		var matrix_lamparaDos = mat4.create();
		mat4.identity(matrix_lamparaDos);
		mat4.translate(matrix_lamparaDos, matrix_lamparaDos, [lamparasX, lamparasY, lamparaZ2]);
		this.lamparaDos.draw(matrix_lamparaDos, gl, shaderProgramSimple);
	}
}