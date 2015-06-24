function extrusion(forma, camino, escala) {
    this.cols = 0;
    this.rows = 0;
    
    this.position_buffer = null;
    this.index_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.forma = forma;
    this.camino = camino;
    this.escala = escala;

    this.tapa1 = null;
    this.tapa2 = null;

    this._createExtrusion = function(forma, camino, escala){
        this.cols = forma.length / 3;
        this.rows = camino.length;

        this.position_buffer = [];

        for (var i = 0; i < this.rows; i++) {
            var traslacion = mat4.create();
            var escalado = mat4.create();
            var modelado = mat4.create();

            mat4.identity(traslacion);
            mat4.translate(traslacion,traslacion, camino[i]);

            mat4.identity(escalado);
            mat4.scale(escalado, escalado, escala[i]);

            mat4.identity(modelado);
            mat4.multiply(modelado, traslacion, escalado);


            for (var j = 0; j < forma.length; j+=3){
                var punto = vec3.fromValues(forma[j], forma[j+1], forma[j+2]);
                var vertice = vec3.create();
                vec3.transformMat4(vertice, punto, modelado);
                this.position_buffer.push(vertice[0], vertice[1], vertice[2]);
            }
        }
    }
    


    this._createIndexBuffer = function(){

        this.index_buffer = [];

        for (var i = 0; i < this.rows-1; i++) {
            if (i % 2 == 0) {
                for (var j = 0; j < this.cols; j++) {
                    var primero = i * this.cols  + j;
                    var segundo = primero + this.cols;
                    this.index_buffer.push(primero);
                    this.index_buffer.push(segundo);

                }
            } else {
                for (var j = this.cols-1; j >= 0; j--) {
                    var primero = i * this.cols  + j;
                    var segundo = primero + this.cols;
                    this.index_buffer.push(primero);
                    this.index_buffer.push(segundo);
                }
            }
        }
    }


    this._createExtrusion(forma, camino, escala);
    this._createIndexBuffer();  


    this.agregarTapa = function(pasoNro) {

        var centro = [this.camino[pasoNro][0], this.camino[pasoNro][1], this.camino[pasoNro][2]];
        var perimetro = this.position_buffer.slice(3 * this.cols * pasoNro,   3 * this.cols * (pasoNro + 1));

        if (this.tapa1 == null) {
            this.tapa1 = new tapa(centro, perimetro);
        } else {
            this.tapa2 = new tapa(centro, perimetro);
        }
    	// var centro = this.position_buffer.length/3;
    	// this.position_buffer.push(this.camino[pasoNro][0], this.camino[pasoNro][1], this.camino[pasoNro][2]);	//El centro de la tapa

    	// for (var i = 0; i < this.cols-1; i++){
    	// 	this.index_buffer.push(centro);
    	// 	this.index_buffer.push(pasoNro * this.cols + i);
    	// 	this.index_buffer.push(pasoNro * this.cols + i + 1);
    	// }
    }


    this.initBuffers = function(gl, shaderProgram, color){
        if (this.tapa1) console.log("position_buffer: " + this.tapa1.position_buffer.toString());

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

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
        this.webgl_color_buffer.numItems = this.generatedColors.length / 4;

        if (this.tapa1) 
            this.tapa1.initBuffers(gl, color);
        if (this.tapa2)
            this.tapa2.initBuffers(gl, color);
    }


    this.draw = function(modelMatrix, gl, shaderProgram){

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

        if (this.tapa1){   
            this.tapa1.draw(modelMatrix, gl, shaderProgram)
        }
        if (this.tapa2){
            this.tapa2.draw(modelMatrix, gl, shaderProgram)
        }
    }
}
