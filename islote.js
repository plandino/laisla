function islote() {

    this.forma = null;
    this.camino = null;
    this.escala = null;
    this.tangentes = null;
    this.normales = null;
    this.u = null;

    this.extrusion = null;


    var a = 100.0;
    var b = 100.0;
    var n = 10;

    this._cargarForma = function() {
    	this.forma = [];
        this.tangentes = [];
        this.normales = [];
        this.u = [];

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

    	for (var i in P){		// centrar el islote
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

        var perimetro = 0.0;
        for (var i = 0; i <= this.forma.length-5; i+=3){
            var actual = vec3.fromValues(this.forma[i], this.forma[i+1], this.forma[i+2]);
            var siguiente = vec3.fromValues(this.forma[i+3], this.forma[i+4], this.forma[i+5]);
            perimetro += vec3.distance(actual, siguiente);
        }

        var repeticiones = 15;
        this.u.push(0);
        var recorrido = 0.0;
        for (var i = 0; i <= this.forma.length - 5; i+=3){
            var actual = vec3.fromValues(this.forma[i], this.forma[i+1], this.forma[i+2]);
            var siguiente = vec3.fromValues(this.forma[i+3], this.forma[i+4], this.forma[i+5]);
            recorrido += vec3.distance(actual, siguiente);
            this.u.push(repeticiones*recorrido/perimetro);
        }
    }



    this._cargarForma();

    this.camino = [];
    this.escala = [];
    var pasos = 9;
    var profundidad = 20.0;
    // var c = 100.0;
    for (var i = 0; i <= 1.00000001; i += 1.0/pasos){
        this.camino.push([0, 0, -profundidad*i]);
    }

    var esc = [ 0.90,
                0.85,
                0.70,
                0.66,
                0.64,
                0.63,
                0.62,
                0.61,
                0.59,
                0.55
                ];

    var v = [   0.000,
                0.191,
                0.380,
                0.572,
                0.633,
                0.694,
                0.755,
                0.817,
                0.878,
                0.939,
                1.00
            ];

    for (var i in esc) {
        this.escala.push([esc[i], esc[i], 1.0]);
    }

    this._calcularUV = function(){
        uv_buffer = [];
        for (var i in v){
            for (var j in this.u){
                uv_buffer.push(this.u[j]);
                uv_buffer.push(v[i]);
            }
        }

        this.extrusion.asignarCoordenadasUV(uv_buffer);
    }

    this.extrusion = new extrusion(this.forma, this.camino, this.escala, this.tangentes, this.normales, this.u);
    loadTexture(this.extrusion, this.extrusion.textureImage, "textfinales/isla.jpg");
    loadTexture(this.extrusion, this.extrusion.relieveTextureImage, "textfinales/islaNormalMap.jpg", false, true);

    this._calcularUV();
    this.extrusion.agregarTapa(this.camino.length-1, true, true, "textfinales/pastoIsla.jpg", 15.0, 15.0);


    this.initBuffers = function(gl, shaderProgram, color) {
        this.extrusion.initBuffers(gl, shaderProgram, color);
    }

    this.draw = function(modelMatrix, gl, shaderProgram, shaderProgramSoloTexturas) {
        this.extrusion.drawConTextura(modelMatrix, gl, shaderProgram, KA, KD, 0.0, S, shaderProgramSoloTexturas);
    }


}