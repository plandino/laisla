function setLuces(mvMatrix, gl, shaderProgram){
		var lightPosition = [10.0,50.0, 3.0];
		// mat4.multiply(lightPosition,mvMatrix, lightPosition);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightPosition);


		// Se inicializan las variables asociadas con la Iluminación
       	gl.uniform3f(shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2 );
		gl.uniform3f(shaderProgram.directionalColorUniform, 0.15, 0.15, 0.15);

		var lighting = true;
		gl.uniform1i(shaderProgram.useLightingUniform, lighting);

		var normalMatrix = mat3.create();
		mat3.identity(normalMatrix);
		mat3.fromMat4(mvMatrix, normalMatrix);
		mat3.invert(normalMatrix, normalMatrix);
        // mat4.toInverseMat3(mvMatrix, normalMatrix);
        // mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);
}