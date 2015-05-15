function extrusion(forma, camino, escala) {
    this.cols = 0;
    this.rows = 0;
    this.index_buffer = null;

    this.position_buffer = null;
    this.color_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.forma = forma;
    this.camino = camino;
    this.escala = escala;

    this._createExtrusion = function(forma, camino, escala){
        this.cols = forma.length / 3;
        this.rows = camino.length;

        this.position_buffer = [];
        // this.color_buffer = []; 

        console.log("longitud forma: " + forma.length);
        
        for (var i = 0; i < this.rows; i++) {
            var traslacion = mat4.create();
            var escalado = mat4.create();
            var modelView = mat4.create();
        
            mat4.identity(traslacion);
            mat4.translate(traslacion,traslacion, camino[i]);

            mat4.identity(escalado);
            mat4.scale(escalado, escalado, escala[i]);

            mat4.identity(modelView);
            mat4.multiply(modelView, traslacion, escalado);


            for (var j = 0; j < forma.length; j+=3){
                // console.log('forma += ' + forma[j] + " " + forma[j+1] + " " + forma[j+2]);
                var punto = vec3.fromValues(forma[j], forma[j+1], forma[j+2]);
                // console.log("punto: " + vec3.str(punto));
                var fila = vec3.create();
                vec3.transformMat4(fila, punto, modelView);
                // console.log("fila transormada: " + vec3.str(fila));
                // this.position_buffer = this.position_buffer.concat(fila);
                this.position_buffer.push(fila[0], fila[1], fila[2]);
               //  this.color_buffer.push(1.0/this.cols * i);
               // this.color_buffer.push(0.2);
               // this.color_buffer.push(1.0/this.rows * j);
            }
        }
    }
    


    this._createIndexBuffer = function(){
        console.log("createIndexBuffer");

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

        // console.log("position_buffer length: " + this.position_buffer.length);
        // console.log("index_buffer length: " + this.index_buffer.length);
        // console.log("index_buffer: " + this.index_buffer.toString());
    }

     this._createExtrusion(forma, camino, escala);
    this._createIndexBuffer();  

    this.agregarTapa = function(pasoNro) {
    	var centro = this.position_buffer.length/3;
    	this.position_buffer.push(this.camino[pasoNro][0], this.camino[pasoNro][1], this.camino[pasoNro][2]);	//El centro de la tapa
    	console.log("centro: " + centro);
    	for (var i = 0; i < this.cols-1; i++){
    		this.index_buffer.push(centro);
    		this.index_buffer.push(pasoNro * this.cols + i);
    		this.index_buffer.push(pasoNro * this.cols + i + 1);
    		// this.color_buffer.push(1.0);
      //    	this.color_buffer.push(1.0);
      //      	this.color_buffer.push(1.0/this.rows * i);
    	}
    }


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
      
        // Replicamos los colores de cada cara dos veces.
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

        console.log("#posiciones: " + this.position_buffer.length/3);
        console.log("#index_buffer: " + this.index_buffer.length);
        console.log("index_buffer: " + this.index_buffer.toString());
    }


    this.draw = function(modelMatrix, gl, shaderProgram){

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

////////////////////////////////////////////
        //  // Se configuran los buffers que alimentarán el pipeline
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        // gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        // gl.vertexAttribPointer(gl.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
        
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        // //gl.drawElements(gl.LINE_LOOP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        // gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        /////////////////////////////////
    }
}
