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
    var n = 100;

    this._cargarForma = function(){
    	this.forma = [];
    	this.index_buffer = [];

		var P = [];
	    P.push([a/2,	0.0, 	0.0]);	// P0
	    P.push([a/5,	0.0, 	0.0]);	// P1
	    P.push([0.0, 	b/5, 	0.0]);	// P2
	    P.push([0.0,	b/2, 	0.0]);	// P3
    	P.push([0.0,	b, 		0.0]);	// P4
    	P.push([0.0, 	2.8*b, 	0.0]);	// P5
    	P.push([0.1*a,	3*b, 	0.0]);	// P6
    	P.push([0.22*a, 3.2*b, 	0.0]);	// P7
    	P.push([0.3*a, 	3.4*b, 	0.0]);	// P8
    	P.push([0.38*a, 3.5*b, 	0.0]);	// P9
    	P.push([0.45*a,	3.6*b,	0.0]);	// P10

    	for (var i in P){		// centrar el barco
    		P[i][0] -= a/2;
    		P[i][1] -= 3.6*b/2;
    	}

    	for (var i = 1; i <= 10; i++){	// La otra mitad, simetrica
    		P.push(P[11-i].concat([]));
    		P[10+i][0] = -P[11-i][0];
    	}


    	var tramos = [];
    	tramos.push(new curvaBezier(P[0], P[1], P[2], P[3], 	n));
    	tramos.push(new curvaBezier(P[3], P[4], P[5], P[6], 	n));
    	tramos.push(new curvaBezier(P[6], P[7], P[8], P[9], 	n));
    	tramos.push(new curvaBezier(P[9], P[10], P[11], P[12], 	n));
    	tramos.push(new curvaBezier(P[12], P[13], P[14], P[15],	n));
    	tramos.push(new curvaBezier(P[15], P[16], P[17], P[18],	n));
    	tramos.push(new curvaBezier(P[18], P[19], P[20], P[0], 	n));

    	var totalPuntos = 0;
    	for (var i in tramos){
    		this.forma = this.forma.concat(tramos[i].getPositionBuffer());
    		totalPuntos += tramos[i].getCantidadVertices();
    	}

    	for (var i = 0; i <= totalPuntos; i++){
    		this.index_buffer.push(i);
    	}
    }


    this._cargarForma();

    this.camino = [];
    this.escala = [];
    var pasos = 3;
    var profundidad = 30.0;
    var c = 100.0;
    for (var i = 0; i <= 1.000000001; i += 1.0/pasos){
    	this.camino.push([0, 0, profundidad*i]);
    	this.escala.push([1-i*i/c, 1-i*i/c, 1.0])
    }

    this.extrusion = new extrusion(this.forma, this.camino, this.escala);
    this.extrusion.agregarTapa(1);
    this.extrusion.agregarTapa(this.camino.length-1);


	this.initBuffers = function(gl, shaderProgram, color){
        this.extrusion.initBuffers(gl, shaderProgram, color);
    }

    this.draw = function(modelMatrix, gl, shaderProgram){
    	this.extrusion.draw(modelMatrix, gl, shaderProgram);
    }
}