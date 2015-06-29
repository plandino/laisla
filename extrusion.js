function extrusion(forma, camino, escala, tangentes, normales, u) {
    this.cols = 0;
    this.rows = 0;
    
    this.position_buffer = null;
    this.index_buffer = null;
    this.tangent_buffer = null;
    this.normal_buffer = null;
    this.uv_buffer = null;

    this.esTexturada = (!!u);   //casteo a booleano

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    this.webgl_uv_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_tangent_buffer = null;

    this.texture = null;
    this.textureImage = null;

    this.forma = forma;
    this.camino = camino;
    this.escala = escala;
    // this.u = u;

    this.tangentesCurva = tangentes;
    if (typeof normales === "undefined") console.log("normales INDEFINIDA");    //DEBUG
    this.normalesCurva = normales;

    this.tapa1 = null;
    this.tapa2 = null;

    this._posicion = function(i,j){
        if (i < 0 || this.rows <= i)
            return vec3.fromValues(0,0,0);

        var posicion = vec3.create();
        posicion[0] = this.position_buffer[3*this.cols*i + j];
        posicion[1] = this.position_buffer[3*this.cols*i + j + 1];
        posicion[2] = this.position_buffer[3*this.cols*i + j + 2];
        return posicion;
    }

    this._calcularNormales = function(){
        this.normal_buffer = [];
        for (var i = 0; i < this.rows; i++){
            for (var j = 0; j < this.forma.length-2; j+=3){
                var normalCurva = this.normalesCurva[j/3];
                var posicion = this._posicion(i,j);
                var anterior = this._posicion(i-1, j);
                var siguiente = this._posicion(i+1, j);

                var v = vec3.create();
                var w = vec3.create();
                vec3.subtract(v, siguiente, posicion);
                vec3.subtract(w, anterior, posicion);

                var n = vec3.create();
                vec3.lerp(n, v, w, 0.5);
                vec3.normalize(n, n);

                var z = vec3.fromValues(0,0,1.0);
                var theta = Math.PI/2 - Math.acos(vec3.dot(n,z));

                var ejeRotacion = vec3.create();
                vec3.cross(ejeRotacion, n, z);

                var rotacion = mat4.create();
                mat4.rotate(rotacion, rotacion, theta, ejeRotacion);

                var normalSuperficie = vec3.create();
                if (typeof normalCurva === "undefined"){    // DEBUG
                    console.log("normalCurva[" + j + "]: INDEFINIDA");
                    console.log("Longitud normales: " + this.normalesCurva.length);
                } 
                vec3.transformMat4(normalSuperficie, normalCurva, rotacion);
                vec3.normalize(normalSuperficie, normalSuperficie);

                this.normal_buffer.push(normalSuperficie[0], normalSuperficie[1], normalSuperficie[2]);
            }
        }
    }


    this.asignarCoordenadasUV = function(uv_buffer){
        this.uv_buffer = uv_buffer;
    }

    this._createExtrusion = function(){
        this.cols = this.forma.length / 3;
        this.rows = this.camino.length;

        this.position_buffer = [];

        for (var i = 0; i < this.rows; i++) {
            var traslacion = mat4.create();
            var escalado = mat4.create();
            var modelado = mat4.create();

            mat4.identity(traslacion);
            mat4.translate(traslacion,traslacion, this.camino[i]);

            mat4.identity(escalado);
            mat4.scale(escalado, escalado, this.escala[i]);

            mat4.identity(modelado);
            mat4.multiply(modelado, traslacion, escalado);

            for (var j = 0; j < this.forma.length; j+=3){
                var punto = vec3.fromValues(this.forma[j], this.forma[j+1], this.forma[j+2]);
                var vertice = vec3.create();
                vec3.transformMat4(vertice, punto, modelado);
                this.position_buffer.push(vertice[0], vertice[1], vertice[2]);
            }
        }
    
        this.tangent_buffer = [];
        for (var i = 0; i < this.rows; i++){
            for (var j in this.tangentesCurva){
                var t = this.tangentesCurva[j];
                this.tangent_buffer.push(t[0], t[1], t[2]);
            }
        }

        this._calcularNormales();
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


    this._createExtrusion();
    this._createIndexBuffer();  


    this.agregarTapa = function(pasoNro, esSuperior, esTexturada, textura, escalaX, escalaY) {
        var centro = [this.camino[pasoNro][0], this.camino[pasoNro][1], this.camino[pasoNro][2]];
        var perimetro = this.position_buffer.slice(3 * this.cols * pasoNro,   3 * this.cols * (pasoNro + 1));

        if (!this.tapa1) {
            this.tapa1 = new tapa(centro, perimetro, esSuperior, esTexturada, escalaX, escalaY);
            if (esTexturada) loadTexture(this.tapa1, this.tapa1.textureImage, textura);
        } else {
            this.tapa2 = new tapa(centro, perimetro, esSuperior, esTexturada, escalaX, escalaY);
            if (esTexturada) loadTexture(this.tapa2, this.tapa1.textureImage, textura);
        }
    }


    this.handleLoadedTexture = function(objectImage) {
        this.texture = gl.createTexture();

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, objectImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }


    this.initBuffers = function(gl, shaderProgram, color){
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


            this.generatedColors = [];
            var colors = getColor(color);
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

            this.webgl_normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
            this.webgl_normal_buffer.itemSize = 3;
            this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

            this.webgl_tangent_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_tangent_buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
            this.webgl_tangent_buffer.itemSize = 3;
            this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;

            if (this.esTexturada){
                this.webgl_uv_buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv_buffer), gl.STATIC_DRAW);
                this.webgl_uv_buffer.itemSize = 2;
                this.webgl_uv_buffer.numItems = this.uv_buffer.length / 2;
            }

        // if (this.esTexturada){  //DEBUG
        //     console.log();
        //     console.log("LONGITUDES EXTRUSION")
        //     console.log("position_buffer: " + this.position_buffer.length);
        //     console.log("index_buffer: " + this.index_buffer.length);
        //     console.log("normal_buffer: " + this.normal_buffer.length);
        //     console.log("tangent_buffer: " + this.tangent_buffer.length);
        //     if (this.esTexturada) console.log("uv_buffer: " + this.uv_buffer.length);
        //     console.log("maximo indice: " + Math.max.apply(Math, this.index_buffer));
        //     // console.log("");
        // }

        if (this.tapa1) 
            this.tapa1.initBuffers(gl, "purple");
        if (this.tapa2)
            this.tapa2.initBuffers(gl, "purple");
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

    this.drawConTextura = function(modelMatrix, gl, shaderProgram){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        this.modelMatrix = modelMatrix;

       if(this.esTexturada){

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            var texMatrix = mat3.create();
            mat3.identity(texMatrix);

            // DEJAR POR LAS DUDAS
            // // Matriz de transformación de las coordenadas de Textura ESTO AL FINAL NO ES NECESARIO, LO HAGO CON LAS COORD UV
            // var auxMatrix = mat4.create();
            // mat4.identity(auxMatrix);
            // mat4.scale(texMatrix, texMatrix, [1.0, 1.0, 1.0]);
            // mat3.fromMat4(texMatrix, texMatrix);
            gl.uniformMatrix3fv(shaderProgram.texMatrixUniform, false, texMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_uv_buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);
        } else {
            console.log("Entra a dibujar colores en extrusion texturada");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);  
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

        if (this.tapa1){   
            this.tapa1.drawConTextura(modelMatrix, gl, shaderProgram)
        }
        if (this.tapa2){
            this.tapa2.drawConTextura(modelMatrix, gl, shaderProgram)
        }
    }


}
