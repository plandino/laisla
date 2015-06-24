function curvaBezier(P0, P1, P2, P3, cantPasos) {
	this.P0 = P0;
	this.P1 = P1;
	this.P2 = P2;
	this.P3 = P3;

	this.position_buffer = []
	this.index_buffer = [];

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

	var B0 = function(u) { return (1-u)*(1-u)*(1-u); }
	var B1 = function(u) { return 3*(1-u)*(1-u)*u; }
	var B2 = function(u) { return 3*(1-u)*u*u;}
	var B3 = function(u) { return u*u*u; }

	var B0der = function(u) { return -3*u*u+6*u-3;} 
	var B1der = function(u) { return 9*u*u-12*u+3; } 
	var B2der = function(u) { return -9*u*u+6*u;}
	var B3der = function(u) { return 3*u*u; }

	for(var u = 0.0; u <= 1.0000000001; u += 1.0/cantPasos){
		var x = B0(u)*P0[0] + B1(u)*P1[0] + B2(u)*P2[0] + B3(u)*P3[0];
		var y = B0(u)*P0[1] + B1(u)*P1[1] + B2(u)*P2[1] + B3(u)*P3[1];
		var z = B0(u)*P0[2] + B1(u)*P1[2] + B2(u)*P2[2] + B3(u)*P3[2];
		this.position_buffer.push(x, y, z);
	}

	for(var i = 0; i < cantPasos; i++){
		this.index_buffer.push(i);
	}

	this.getPositionBuffer = function(){
		return this.position_buffer.concat([]);
	}

    this.getCantidadVertices = function(){
        return this.position_buffer.length/3;
    }

	// this.initBuffers = function(gl, shaderProgram, color){
 //        this.webgl_position_buffer = gl.createBuffer();
 //        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
 //        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
 //        this.webgl_position_buffer.itemSize = 3;
 //        this.webgl_position_buffer.numItems = this.position_buffer.length;

 //        this.webgl_index_buffer = gl.createBuffer();
 //        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
 //        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
 //        this.webgl_index_buffer.itemSize = 1;
 //        this.webgl_index_buffer.numItems = this.index_buffer.length;


 //        var colors = getColor(color);

 //        this.generatedColors = [];
 //        for (var j=0; j<colors.length; j++) {
 //            var c = colors[j];
 //            for (var i=0; i<this.position_buffer.length/12; i++) {
 //                this.generatedColors = this.generatedColors.concat(c);
 //            }
 //        }

 //        this.webgl_color_buffer = gl.createBuffer();
 //        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
 //        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.generatedColors), gl.STATIC_DRAW);   
 //        this.webgl_color_buffer.itemSize = 4;
 //        this.webgl_color_buffer.numItems = this.generatedColors.length;
 //    }

 //    this.draw = function(modelMatrix, gl, shaderProgram){

 //        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
 //        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

 //        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
 //        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

 //        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

 //        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

 //        gl.drawElements(gl.LINE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
 //    }
}