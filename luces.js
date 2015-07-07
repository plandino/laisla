function setLucesNormal(mvMatrix, gl, shaderProgram){

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

function setLucesEspeciales(mvMatrix, gl, shaderProgram){

    var lightPosition = vec3.create();
    vec3.set(lightPosition,0.0,0.0, -1.0);
    // mat4.multiply(lightPosition, mvMatrix, lightPosition);
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightPosition);

      // Se inicializan las variables asociadas con la Iluminación
    gl.uniform3f(shaderProgram.ambientColorUniform, 0.3, 0.3, 0.3 );
    gl.uniform3f(shaderProgram.directionalColorUniform, 0.2, 0.2, 0.2);

    var lighting = true;
    gl.uniform1i(shaderProgram.useLightingUniform, lighting);

    var normalMatrix = mat3.create();
    mat3.identity(normalMatrix);
    mat3.fromMat4(normalMatrix, mvMatrix);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    // mat3.scale(normalMatrix, normalMatrix, [0.0,0.0,0.0]);
    gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);














    // var lightPosition = vec3.create();
    // vec3.set(lightPosition,10.0,80.0, 100.0);

    //  // console.log("Light position: ");
   //  //       console.log(lightPosition[0],lightPosition[1],lightPosition[2]);
    //  // mat4.multiply(lightPosition,mvMatrix, lightPosition);
    // gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightPosition);

    //  // console.log("Light position: ");
   //  //       console.log(lightPosition[0],lightPosition[1],lightPosition[2]);


    //  // Se inicializan las variables asociadas con la Iluminación
   //  gl.uniform3f(shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2 );
    // gl.uniform3f(shaderProgram.directionalColorUniform, 0.15, 0.15, 0.15);

    // var lighting = true;
    // gl.uniform1i(shaderProgram.useLightingUniform, lighting);

    // var normalMatrix = mat3.create();
    // mat3.identity(normalMatrix);
    //  // console.log("model view: " );
   //  //       console.log(mvMatrix[0],mvMatrix[1],mvMatrix[2],mvMatrix[3]);
   //  //       console.log(mvMatrix[4],mvMatrix[5],mvMatrix[6],mvMatrix[7]);
   //  //       console.log(mvMatrix[8],mvMatrix[9],mvMatrix[10],mvMatrix[11]);
   //  //       console.log(mvMatrix[12],mvMatrix[13],mvMatrix[14],mvMatrix[15]);
    // mat3.fromMat4(normalMatrix, mvMatrix);

    //  // console.log("normal acortada: ");
   //  //       console.log(normalMatrix[0],normalMatrix[1],normalMatrix[2]);
   //  //       console.log(normalMatrix[3],normalMatrix[4],normalMatrix[5]);
   //  //       console.log(normalMatrix[6],normalMatrix[7],normalMatrix[8]);

    // mat3.invert(normalMatrix, normalMatrix);

    //  // console.log("normal inversa: ");
   //  //       console.log(normalMatrix[0],normalMatrix[1],normalMatrix[2]);
   //  //       console.log(normalMatrix[3],normalMatrix[4],normalMatrix[5]);
   //  //       console.log(normalMatrix[6],normalMatrix[7],normalMatrix[8]);
   //        // mat4.toInverseMat3(mvMatrix, normalMatrix);
   //  mat3.transpose(normalMatrix, normalMatrix);

   //        // console.log("normal transpuesta: ");
   //        // console.log(normalMatrix[0],normalMatrix[1],normalMatrix[2]);
   //        // console.log(normalMatrix[3],normalMatrix[4],normalMatrix[5]);
   //        // console.log(normalMatrix[6],normalMatrix[7],normalMatrix[8]);

   //  gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);
}