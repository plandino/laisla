function islote() {

	this.position_buffer = null;
    this.index_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.forma = null;
    this.camino = null;
    this.escala = null;
    this.tangentes = null;
    this.normales = null;

    this.extrusion = null;

    var a = 100.0;
    var b = 100.0;
    var n = 20;

    this._cargarForma = function() {
    	this.forma = [];
        this.tangentes = [];
        this.normales = [];
    	this.index_buffer = [];

        var P = [];
	    P.push([0.0,	50.0, 	0.0]);	// P0
	    P.push([20.0,	70.0, 	0.0]);	// P1
	    P.push([50.0, 	65.0, 	0.0]);	// P2
	    P.push([60.0,	60.0, 	0.0]);	// P3
    	P.push([55.0,	80.0,	0.0]);	// P4
    	P.push([80.0, 	92.0, 	0.0]);	// P5
    	P.push([90.0,	80.0, 	0.0]);	// P6
    	P.push([105.0,  60.0, 	0.0]);	// P7
    	P.push([120.0, 	70.0, 	0.0]);	// P8
    	P.push([125.0,  100.0, 	0.0]);	// P9
        P.push([155.0,  90.0,   0.0]);  // P10
        P.push([165.0,  65.0,   0.0]);  // P11
        P.push([180.0,  55.0,   0.0]);  // P12
        P.push([195.0,  70.0,   0.0]);  // P13
        P.push([220.0,  65.0,   0.0]);  // P14
        P.push([210.0,  45.0,   0.0]);  // P15
        P.push([220.0,  27.0,   0.0]);  // P16
        P.push([195.0,  13.0,   0.0]);  // P17
        P.push([175.0,  25.0,   0.0]);  // P18
        P.push([170.0,  15.0,   0.0]);  // P19
        P.push([150.0,  17.0,   0.0]);  // P20
        P.push([140.0,  25.0,   0.0]);  // P21
        P.push([135.0,  12.0,   0.0]);  // P22
        P.push([110.0,  6.0,    0.0]);  // P23
        P.push([95.0,   17.0,   0.0]);  // P24
        P.push([85.0,   30.0,   0.0]);  // P25
        P.push([70.0,   21.0,   0.0]);  // P26
        P.push([50.0,   17.0,   0.0]);  // P27
        P.push([20.0,   25.0,   0.0]);  // P218

    	for (var i in P){		// centrar el barco
    		P[i][0] -= 110.0;
    		P[i][1] -= 30;
    	}

    	var tramos = [];
        var cantPControl = P.length-1;
        for (var i = 0; i < cantPControl - 3; i++){
           tramos.push(new curvaBSpline(P[i], P[i+1], P[i+2], P[i+3],   n));    
        }
        tramos.push(new curvaBSpline(P[cantPControl - 2], P[cantPControl - 1], P[cantPControl], P[0], n));    
        tramos.push(new curvaBSpline(P[cantPControl - 1], P[cantPControl], P[0], P[1], n));    
        tramos.push(new curvaBSpline(P[cantPControl], P[0], P[1], P[2], n));    

        var totalPuntos = 0;
        for (var i in tramos){
            this.forma = this.forma.concat(tramos[i].getPositionBuffer());
            this.tangentes = this.tangentes.concat(tramos[i].getTangentBuffer());
            this.normales = this.normales.concat(tramos[i].getNormalBuffer());
            totalPuntos += tramos[i].getCantidadVertices();
        }

        for (var i = 0; i < totalPuntos; i++){
            this.index_buffer.push(i);
        }
    }



    this._cargarForma();

    this.camino = [];
    this.escala = [];
    var pasos = 9;
    var profundidad = 20.0;
    var c = 100.0;
    for (var i = 0; i <= 1.00000001; i += 1.0/pasos){
        this.camino.push([0, 0, -profundidad*i]);
    }

    var esc = [ 1.00,
                0.95,
                0.70,
                0.66,
                0.64,
                0.63,
                0.62,
                0.61,
                0.59,
                0.55
                ];

    for (var i in esc) {
        this.escala.push([esc[i], esc[i], 1.0]);
    }

    this.extrusion = new extrusion(this.forma, this.camino, this.escala, this.tangentes, this.normales);
    this.extrusion.agregarTapa(this.camino.length-1, true);


    this.initBuffers = function(gl, shaderProgram, color) {
        this.extrusion.initBuffers(gl, shaderProgram, color);
    }

    this.draw = function(modelMatrix, gl, shaderProgram) {
    	this.extrusion.draw(modelMatrix, gl, shaderProgram);
    }
}