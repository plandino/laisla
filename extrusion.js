function extrusion(forma, camino, escala, tangentes, normales, esTexturada, arriba) {
    this.cols = 0;
    this.rows = 0;
    
    this.position_buffer = null;
    this.index_buffer = null;
    this.tangent_buffer = null;
    this.normal_buffer = null;
    this.uv_buffer = null;
    this.arriba = arriba;

    this.esTexturada = (!!esTexturada);   //casteo a booleano, por si se pasa la textura

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    this.webgl_uv_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_tangent_buffer = null;

    this.texture = null;
    this.textureImage = null;
    this.reflectionTexture = null;
    this.reflectionTextureImage = null;
    this.tieneReflejo = false;

    this.forma = forma;
    this.camino = camino;
    this.escala = escala;

    if (typeof tangentes === "undefined") console.log("tangentes INDEFINIDA");    //DEBUG
    this.tangentesCurva = tangentes;
    if (typeof normales === "undefined") console.log("normales INDEFINIDA");    //DEBUG
    this.normalesCurva = normales;

    this.tapa1 = null;
    this.tapa2 = null;

    this._posicion = function(i,j){
        // if (i < 0 || this.rows <= i)
        //     return vec3.fromValues(0,0,0);
        if (i < 0)
            return this._posicion(0,j);
        if (i >= this.rows)
            return this._posicion(this.rows-1, j);

        var posicion = vec3.create();
        posicion[0] = this.position_buffer[3*this.cols*i + j];
        posicion[1] = this.position_buffer[3*this.cols*i + j + 1];
        posicion[2] = this.position_buffer[3*this.cols*i + j + 2];
        return posicion;
    }

    this._calcularNormales1 = function(){
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
                vec3.normalize(v, v);
                vec3.normalize(w, w);

                var n = vec3.create();
                vec3.lerp(n, v, w, 0.5);
                // vec3.normalize(n, n);

                var arriba;
                if (this.arriba == "x")
                    arriba = vec3.fromValues(1,0,0);
                else if (this.arriba == "y")
                    arriba = vec3.fromValues(0,1,0);
                else
                    arriba = vec3.fromValues(0,0,1);

                var theta = Math.PI/2 - Math.acos(vec3.dot(n,arriba));

                var ejeRotacion = vec3.create();
                vec3.cross(ejeRotacion, n, arriba);

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

    this._calcularNormales2 = function(){
        this.normal_buffer = [];
        for (var i = 0; i < this.rows; i++){
            for (var j = 0; j < this.forma.length-2; j+=3){
                var anterior = this._posicion(i-1, j);
                var siguiente = this._posicion(i+1, j);

                var d = vec3.create();
                vec3.subtract(d, siguiente, anterior);

                var normalSuperficie = vec3.create();
                vec3.cross(normalSuperficie, d, this.tangentesCurva[j/3]);
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

        this._calcularNormales2();
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


    this.handleLoadedTexture = function(objectImage, conReflection) {
        gl.activeTexture(gl.TEXTURE0);

        if(conReflection){
            this.tieneReflejo = true;
            this.reflectionTexture = gl.createTexture();

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            gl.bindTexture(gl.TEXTURE_2D, this.reflectionTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, objectImage);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            this.texture = gl.createTexture();

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            gl.bindTexture(gl.TEXTURE_2D, this.texture);    
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, objectImage);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        

        // gl.bindTexture(gl.TEXTURE_2D, null);
    }

    this.loadCubeMap = function() {
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        var faces = [["textfinales/cubemap/cubemap4.png", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
                     ["textfinales/cubemap/cubemap2.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
                     ["textfinales/cubemap/cubemap5.png", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
                     ["textfinales/cubemap/cubemap6.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
                     ["textfinales/cubemap/cubemap3.png", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
                     ["textfinales/cubemap/cubemap1.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
        for (var i = 0; i < faces.length; i++) {
            var face = faces[i][1];
            var image = new Image();
            image.onload = function(texture, face, image) {
                return function() {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                    gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                }
            } (texture, face, image);
            image.src = faces[i][0];
        }
        this.reflectionTexture = texture;
        this.tieneReflejo = true;
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
            this.webgl_tangent_buffer.itemSize = 3;
            this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;

            if (this.esTexturada){
                this.webgl_uv_buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv_buffer), gl.STATIC_DRAW);
                this.webgl_uv_buffer.itemSize = 2;
                this.webgl_uv_buffer.numItems = this.uv_buffer.length / 2;
            }

        if (this.tapa1) 
            this.tapa1.initBuffers(gl, "black");
        if (this.tapa2)
            this.tapa2.initBuffers(gl, "black");
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

    this.drawConTextura = function(modelMatrix, gl, shaderProgram, ka, kd, ks, shininess, shaderProgramSoloTextura){
        // var mvMatrix = mat4.create();
        // mat4.multiply(mvMatrix, cameraMatrix, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.identity(normalMatrix);
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);

        gl.uniform1f(shaderProgram.ka, ka);
        gl.uniform1f(shaderProgram.kd, kd);
        gl.uniform1f(shaderProgram.ks, ks);
        gl.uniform1f(shaderProgram.shininess, shininess);

        var mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, cameraMatrix, modelMatrix);
        var MVnormalMatrix = mat3.create();
        mat3.identity(MVnormalMatrix);
        mat3.fromMat4(MVnormalMatrix, mvMatrix);
        mat3.invert(MVnormalMatrix, MVnormalMatrix);
        mat3.transpose(MVnormalMatrix, MVnormalMatrix);
        gl.uniformMatrix3fv(shaderProgram.MVnormalMatrixUniform, false, MVnormalMatrix);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        this.modelMatrix = modelMatrix;

       if(this.esTexturada){


            // // TANGENTEEEEES
            // gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
            // gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            var texMatrix = mat3.create();
            mat3.identity(texMatrix);

            gl.uniformMatrix3fv(shaderProgram.texMatrixUniform, false, texMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_uv_buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniformTextureMap, 0);

            if(this.tieneReflejo){
                gl.activeTexture(gl.TEXTURE1);
                // gl.bindTexture(gl.TEXTURE_2D, this.reflectionTexture);
                gl.uniform1i(shaderProgram.samplerUniformReflectionMap, 1);
            }
        } else {    // DEBUG
            console.log("Entra a dibujar colores en extrusion texturada");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);  
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

        if(shaderProgramSoloTextura){
            /***** CONTEXTO TEXTURAS *****/
            gl.useProgram(shaderProgramSoloTextura);
            gl.uniformMatrix4fv(shaderProgramSoloTextura.perspectiveMatrixUniform, false, perspectiveMatrix);
            gl.uniformMatrix4fv(shaderProgramSoloTextura.viewMatrixUniform, false, cameraMatrix );

            setLucesNormal(cameraMatrix, gl, shaderProgramSoloTextura);

            if (this.tapa1){   
                this.tapa1.drawConTextura(modelMatrix, gl, shaderProgramSoloTextura)
            }
            if (this.tapa2){
                this.tapa2.drawConTextura(modelMatrix, gl, shaderProgramSoloTextura)
            }

            /***** CONTEXTO ANTERIOR *****/
            gl.useProgram(shaderProgram);
            gl.uniformMatrix4fv(shaderProgram.perspectiveMatrixUniform, false, perspectiveMatrix);
            gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, cameraMatrix );

            setLucesNormal(cameraMatrix, gl, shaderProgram);
        } else {
            if (this.tapa1){   
                this.tapa1.drawConTextura(modelMatrix, gl, shaderProgram)
            }
            if (this.tapa2){
                this.tapa2.drawConTextura(modelMatrix, gl, shaderProgram)
            }    
        }

        
    }


}
