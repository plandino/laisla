function barco(scaleX, scaleY, scaleZ){

	this.position_buffer = null;
    this.index_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.forma = null;
    this.camino = null;
    this.escala = null;

    this.extrusion = null;

    var a = 100.0;
    var b = 100.0;
    var n = 50;

    this._cargarForma = function(){
    	this.forma = [];
    	this.index_buffer = [];

		// var a = 100.0;
		var P = [];
	    var P0  = [a/2,		0.0, 	0.0];
	    var P1  = [a/5,		0.0, 	0.0];
	    var P2  = [0.0, 	b/5, 	0.0];
	    var P3  = [0.0,		b/2, 	0.0];
    	var P4  = [0.0,		b, 		0.0];
    	var P5  = [0.0, 	2.8*b, 	0.0];
    	var P6  = [0.1*a,	3*b, 	0.0];
    	var P7  = [0.22*a, 	3.2*b, 	0.0];
    	var P8  = [0.3*a, 	3.4*b, 	0.0];
    	var P9  = [0.38*a, 	3.5*b, 	0.0];
    	var P10 = [0.45*a,	3.6*b,	0.0];
    	var P11 = P10.concat([]); P11[0] = a - P10[0];
    	var P12 = P9.concat([]); P12[0] = a - P9[0];
    	var P13 = P8.concat([]); P13[0] = a - P8[0];
    	var P14 = P7.concat([]); P14[0] = a - P7[0];
    	var P15 = P6.concat([]); P15[0] = a - P6[0];
    	var P16 = P5.concat([]); P16[0] = a - P5[0];
    	var P17 = P4.concat([]); P17[0] = a - P4[0];
    	var P18 = P3.concat([]); P18[0] = a - P3[0];
    	var P19 = P2.concat([]); P19[0] = a - P2[0];
    	var P20 = P1.concat([]); P20[0] = a - P1[0];

    	var tramo1 = new curvaBezier(P0, P1, P2, P3, 	2*n);
    	var tramo2 = new curvaBezier(P3, P4, P5, P6, 	2*n);
    	var tramo3 = new curvaBezier(P6, P7, P8, P9, 	n);
    	var tramo4 = new curvaBezier(P9, P10, P11, P12, n);
    	var tramo5 = new curvaBezier(P12, P13, P14, P15,n);
    	var tramo6 = new curvaBezier(P15, P16, P17, P18,n);
    	var tramo7 = new curvaBezier(P18, P19, P20, P0, n);

    	this.forma = this.forma.concat(tramo1.getPositionBuffer());
    	this.forma = this.forma.concat(tramo2.getPositionBuffer());
    	this.forma = this.forma.concat(tramo3.getPositionBuffer());
    	this.forma = this.forma.concat(tramo4.getPositionBuffer());
    	this.forma = this.forma.concat(tramo5.getPositionBuffer());
    	this.forma = this.forma.concat(tramo6.getPositionBuffer());
    	this.forma = this.forma.concat(tramo7.getPositionBuffer());

    	var n1 = tramo1.getCantidadVertices();
    	var n2 = tramo2.getCantidadVertices();
    	var n3 = tramo3.getCantidadVertices();
    	var n4 = tramo4.getCantidadVertices();
    	var n5 = tramo5.getCantidadVertices();
    	var n6 = tramo6.getCantidadVertices();
    	var n7 = tramo7.getCantidadVertices();

    	var totalPuntos = n1 + n2 + n3 + n4 + n5 + n6 + n7;

    	for (var i = 0; i < totalPuntos; i++){
    		this.index_buffer.push(i);
    	}
    }

    this._cargarForma();

    this.camino = [];
    this.escala = [];
    var pasos = 20;
    var c = pasos*pasos;
    for (var i = 0; i <= pasos; i++){
    	this.camino.push([a/2, 1.8*a, pasos*i]);
    	this.escala.push([(c-i*i)/c, (c-i*i)/c, 1.0])
    }

    this.extrusion = new extrusion(this.forma, this.camino, this.escala);

	this.initBuffers = function(gl, shaderProgram, color){
        this.extrusion.initBuffers(gl, shaderProgram, color);
    }

    this.draw = function(modelMatrix, gl, shaderProgram){
    	this.extrusion.draw(modelMatrix, gl, shaderProgram);
    }
}