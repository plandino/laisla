function setLuces(mvMatrix, gl, shaderProgram){

	var intensidadSol = 1.0
    gl.uniform3fv(shaderProgram.solPositionUniform, vec3.fromValues(solX, solY, solZ));
    gl.uniform3fv(shaderProgram.solIntensityUniform, vec3.fromValues(intensidadSol, intensidadSol, intensidadSol));
    gl.uniform1f(shaderProgram.solPersistanceUniform, 2000);

    var intensidadFarolA = 0.6;
    gl.uniform3fv(shaderProgram.farolAPositionUniform, vec3.fromValues(lamparasX, lamparasY, lamparaZ1));
    gl.uniform3fv(shaderProgram.farolAIntensityUniform, vec3.fromValues(intensidadFarolA, intensidadFarolA, intensidadFarolA));
    gl.uniform1f(shaderProgram.farolAPersistanceUniform, 70);

    var intensidadFarolB = intensidadFarolA;
	gl.uniform3fv(shaderProgram.farolBPositionUniform, vec3.fromValues(lamparasX, lamparasY, lamparaZ2));
    gl.uniform3fv(shaderProgram.farolBIntensityUniform, vec3.fromValues(intensidadFarolB, intensidadFarolB, intensidadFarolB));
    gl.uniform1f(shaderProgram.farolBPersistanceUniform, 70);

    var intensidadFarolGrua = 1.0;
    gl.uniform3fv(shaderProgram.farolGruaPositionUniform, vec3.fromValues(lamparaGruaX, lamparaGruaY, lamparaGruaZ));
    gl.uniform3fv(shaderProgram.farolGruaIntensityUniform, vec3.fromValues(intensidadFarolGrua, intensidadFarolGrua, intensidadFarolGrua));
    gl.uniform1f(shaderProgram.farolGruaPersistanceUniform, 70);

}