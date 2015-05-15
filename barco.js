function barco(scaleX, scaleY, scaleZ){

	this.position_buffer = null;
    this.index_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.forma = null;

    this._cargarForma = function(){
    	this.position_buffer = [];
    	this.index_buffer = [];

		var a = 100.0;

	    var P0  = [a/2,		0.0, 	0.0];
	    var P1  = [a/5,		0.0, 	0.0];
	    var P2  = [0.0, 	a/5, 	0.0];
	    var P3  = [0.0,		a/2, 	0.0];
    	var P4  = [0.0,		a, 		0.0];
    	var P5  = [0.0, 	2.8*a, 	0.0];
    	var P6  = [0.1*a,	3*a, 	0.0];
    	var P7  = [0.2*a, 	3.2*a, 	0.0];
    	var P8  = [0.45*a, 	3.6*a, 	0.0];
    	var P9  = [a/2, 	3.6*a, 	0.0];
    	var P10 = P8.concat([]); P10[0] = a - P8[0];
    	var P11 = P7.concat([]); P11[0] = a - P7[0];
    	var P12 = P6.concat([]); P12[0] = a - P6[0];
    	var P13 = P5.concat([]); P13[0] = a - P5[0];
    	var P14 = P4.concat([]); P14[0] = a - P4[0];
    	var P15 = P3.concat([]); P15[0] = a - P3[0];
    	var P16 = P2.concat([]); P16[0] = a - P2[0];
    	var P17 = P1.concat([]); P17[0] = a - P1[0];
    	// var P18 = P1.concat([]); P17[0] = a - P1[0];
    	// var P19 = P1.concat([]); P17[0] = a - P1[0];
    	// var P20 = P1.concat([]); P17[0] = a - P1[0];

    	var tramo1 = new curvaBezier(P0, P1, P2, P3, 	100);
    	var tramo2 = new curvaBezier(P3, P4, P5, P6, 	100);
    	var tramo3 = new curvaBezier(P6, P7, P8, P9, 	100);
    	var tramo4 = new curvaBezier(P9, P10, P11, P12, 100);
    	var tramo5 = new curvaBezier(P12, P13, P14, P15,100);
    	var tramo6 = new curvaBezier(P15, P16, P17, P0, 100);//18, 100);
    	// var tramo7 = new curvaBezier(P18, P19, P20, P0, 100);

    	this.position_buffer = this.position_buffer.concat(tramo1.getPositionBuffer());
    	this.position_buffer = this.position_buffer.concat(tramo2.getPositionBuffer());
    	this.position_buffer = this.position_buffer.concat(tramo3.getPositionBuffer());
    	this.position_buffer = this.position_buffer.concat(tramo4.getPositionBuffer());
    	this.position_buffer = this.position_buffer.concat(tramo5.getPositionBuffer());
    	this.position_buffer = this.position_buffer.concat(tramo6.getPositionBuffer());
    	// this.position_buffer = this.position_buffer.concat(tramo7.getPositionBuffer());

    	var n1 = tramo1.getCantidadVertices();
    	var n2 = tramo2.getCantidadVertices();
    	var n3 = tramo3.getCantidadVertices();
    	var n4 = tramo4.getCantidadVertices();
    	var n5 = tramo5.getCantidadVertices();
    	var n6 = tramo6.getCantidadVertices();
    	// var n7 = tramo7.getCantidadVertices();

    	var totalPuntos = n1 + n2 + n3 + n4 + n5 + n6;// + n7;

    	for (var i = 0; i < totalPuntos; i++){
    		this.index_buffer.push(i);
    	}
    }

    this._cargarForma();

	this.initBuffers = function(gl, shaderProgram, color){
        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;


        var colors = getColor(color);

        this.generatedColors = [];
        for (var j=0; j<colors.length; j++) {
            var c = colors[j];
            for (var i=0; i<this.position_buffer.length/12; i++) {
                this.generatedColors = this.generatedColors.concat(c);
            }
        }

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.generatedColors), gl.STATIC_DRAW);   
        this.webgl_color_buffer.itemSize = 4;
        this.webgl_color_buffer.numItems = this.generatedColors.length;
    }

    this.draw = function(modelMatrix, gl, shaderProgram){

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        gl.drawElements(gl.LINE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}