function cielo () {
    this.forma = null;
    this.camino = null;
    this.escala = null;
    this.tangentes = null;  // De la curva
    this.normales = null;   // De la curva

    this.extrusion = null;

    var radio = escCielo/2;
    var longBands = cantidadDeMeridianos;
    var latBands = cantidadDeParalelos;

    var epsilon = 0.000000001;

    this._cargarForma = function(){
    	this.forma = [];
    	this.camino = [];
    	this.escala = [];
    	this.tangentes = [];
    	this.normales = [];

		for (var t = 0; t <= 2*Math.PI + epsilon; t+= 2*Math.PI/longBands){
			var x  = Math.cos(t);
			var z  = Math.sin(t);
			this.forma.push(x,0,z);
			this.normales.push(vec3.fromValues(x,0,z));
			this.tangentes.push(vec3.fromValues(-z,0,x));
		}

		for (var y = 0; y <= radio + epsilon; y += radio/latBands){
			this.camino.push([0,y-10,0]);

			var r = Math.sqrt(radio*radio - y*y);
			this.escala.push([r,1,r]);
		}
    }


    this._cargarForma();


    this._calcularUV = function(){
    	uv_buffer = [];
		for (var v = 0.0; v <= 1.0 + epsilon; v += 0.5/latBands){ //El 0.5 porque es una semiesfera, no la esfera completa
			for (var u = 0.0; u <= 1.0 + epsilon; u += 1.0/longBands){
    			uv_buffer.push(u,v);
    		}
    	}
    	this.extrusion.asignarCoordenadasUV(uv_buffer);
    }

    this.extrusion = new extrusion(this.forma, this.camino, this.escala, this.tangentes, this.normales, true, "y");
    this._calcularUV();
    loadTexture(this.extrusion, this.extrusion.textureImage, "textfinales/skyBox.jpg");


	this.initBuffers = function(gl, shaderProgram, color){
        this.extrusion.initBuffers(gl, shaderProgram, color);
    }

    this.draw = function(modelMatrix, gl, shaderProgram){
        // this.extrusion.draw(modelMatrix, gl, shaderProgram);
    	this.extrusion.drawConTextura(modelMatrix, gl, shaderProgram, 0.25, 0.0, 0.0, S);
    }
}