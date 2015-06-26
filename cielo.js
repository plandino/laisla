function cielo () {
    this.forma = null;
    this.camino = null;
    this.escala = null;
    this.tangentes = null;  // De la curva
    this.normales = null;   // De la curva

    this.extrusion = null;

    var radio = 750;
    var longBands = 100;
    var latBands = 100;

    var epsilon = 0.000000001;

    this._cargarForma = function(){
    	this.forma = [];
    	this.camino = [];
    	this.escala = [];
    	this.tangentes = [];
    	this.normales = [];

		for (var i = 0; i <= 2*Math.PI + epsilon; i+= 2*Math.PI/longBands){
			var x  = Math.cos(i);
			var y  = Math.sin(i);
			this.forma.push(x,0,y);
			this.normales.push(vec3.fromValues(x,0,y));
			this.tangentes.push(vec3.fromValues(-y,0,x));
		}

		for (var j = 0; j <= radio + epsilon; j += 2*radio/latBands){
			this.camino.push([0,j-10,0]);

			var r = Math.sqrt(radio*radio - j*j);
			this.escala.push([r,1,r]);
		}
    }


    this._cargarForma();


    this._calcularUV = function(){
    	uv_buffer = [];
			for (var j = 0.0; j <= 1.0 + epsilon; j += 1.0/latBands){
		for (var i = 0.0; i <= 1.0 + epsilon; i+= 1.0/longBands){
    			uv_buffer.push(1-j,0.5+i);
    		}
    	}
    	this.extrusion.asignarCoordenadasUV(uv_buffer);
    }


    this.extrusion = new extrusion(this.forma, this.camino, this.escala, this.tangentes, this.normales, true);
    this._calcularUV();
    loadTexture(this.extrusion, this.extrusion.textureImage, "texturas/skyBox.jpg");


	this.initBuffers = function(gl, shaderProgram, color){
        this.extrusion.initBuffers(gl, shaderProgram, color);
    }

    this.draw = function(modelMatrix, gl, shaderProgram){
        // this.extrusion.draw(modelMatrix, gl, shaderProgram);
    	this.extrusion.drawConTextura(modelMatrix, gl, shaderProgram);
    }
}