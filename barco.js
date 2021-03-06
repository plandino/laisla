function barco(scaleX, scaleY, scaleZ){

    this.forma = null;
    this.camino = null;
    this.escala = null;
    this.tangentes = null;  // De la curva
    this.normales = null;   // De la curva
    this.u = null;          // coord u de textura de la curva

    this.extrusion = null;

    var a = 100.0;
    var b = 100.0;
    var n = 30;

    this._cargarForma = function(){
    	this.forma = [];
        this.tangentes = [];
        this.normales = [];
        this.u = [];

		var P = [];
	    P.push([a/2,	0.0, 	0.0]);	// P0
	    P.push([a/5,	0.0, 	0.0]);	// P1
	    P.push([0.0, 	b/5, 	0.0]);	// P2
	    P.push([0.0,	b/2, 	0.0]);	// P3
    	P.push([0.0,	b, 		0.0]);	// P4
    	P.push([0.0, 	2.8*b, 	0.0]);	// P5
    	P.push([0.1*a,	3*b, 	0.0]);	// P6
    	P.push([0.2*a,  3.2*b, 	0.0]);	// P7
    	P.push([0.31*a, 3.4*b, 	0.0]);	// P8
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
            this.tangentes = this.tangentes.concat(tramos[i].getTangentBuffer());
            this.normales = this.normales.concat(tramos[i].getNormalBuffer());
    	}

        var perimetro = 0.0;
        for (var i = 0; i <= this.forma.length-5; i+=3){
            var actual = vec3.fromValues(this.forma[i], this.forma[i+1], this.forma[i+2]);
            var siguiente = vec3.fromValues(this.forma[i+3], this.forma[i+4], this.forma[i+5]);
            perimetro += vec3.distance(actual, siguiente);
        }

        this.u.push(0);
        var recorrido = 0.0;
        for (var i = 0; i <= (this.forma.length - 5)/2; i+=3){
            var actual = vec3.fromValues(this.forma[i], this.forma[i+1], this.forma[i+2]);
            var siguiente = vec3.fromValues(this.forma[i+3], this.forma[i+4], this.forma[i+5]);
            recorrido += vec3.distance(actual, siguiente);
                this.u.push(2*recorrido/perimetro);
        }
        var aux = this.u.concat([]).reverse();
        this.u = this.u.concat(aux);
        this.u.pop();   //porque repite el 0 inicial sino
    }


    this._cargarForma();

    this.camino = [];
    this.escala = [];
    var pasos = 12;
    var profundidad = 30.0;
    var c = 10.0;
    for (var i = 0; i <= 1.000000001; i += 1.0/pasos){
    	this.camino.push([0, 0, profundidad*i]);
    	this.escala.push([1-i/c, 1-i/c, 1.0])
    }

    this._calcularUV = function(){
        uv_buffer = [];
        for (var i = 0.0; i <= pasos + 0.00000001; i++){
            for (var j in this.u){
                uv_buffer.push(this.u[j]);
                uv_buffer.push(0.55 - 0.12*i/pasos);
            }
        }
        this.extrusion.asignarCoordenadasUV(uv_buffer);
    }

    this.extrusion = new extrusion(this.forma, this.camino, this.escala, this.tangentes, this.normales, this.u);
    loadTexture(this.extrusion, this.extrusion.textureImage, "textfinales/cascoBarco.jpg");
    
    this._calcularUV();

    this.extrusion.agregarTapa(4, true, true, "textfinales/concretoPlataforma.jpg", 100.0, 100.0);
    loadTexture(this.extrusion.tapa1, this.extrusion.tapa1.normalMapTextureImage, "textfinales/concretoPlataformaNomalMap.jpg", true);
    
    this.extrusion.agregarTapa(this.camino.length-1, false, true, null, 100.0, 100.0); //esto le pone fondo negro, je
    loadTexture(this.extrusion.tapa2, this.extrusion.tapa2.normalMapTextureImage, "null", true);
    
    this.extrusion.loadCubeMap();


	this.initBuffers = function(gl, shaderProgram, color){
        this.extrusion.initBuffers(gl, shaderProgram, color);
    }

    this.draw = function(modelMatrix, gl, shaderProgram, shaderProgramSoloTexturas, shaderRelieve){
    	this.extrusion.drawConTextura(modelMatrix, gl, shaderProgram, KA, KD, 0.3, S, shaderProgramSoloTexturas, shaderRelieve);
    }
}