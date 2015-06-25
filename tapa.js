function tapa(centro, perimetro, esSuperior, esTexturada) {
    this.centro = centro;
    this.perimetro = perimetro;
    this.esTexturada = esTexturada;
    
    this.position_buffer = centro.concat(perimetro);

    this.index_buffer = [];
    for (var i = 0; i < this.position_buffer.length/3; i++)
        this.index_buffer.push(i);
    
    this.tangent_buffer = [];
    this.normal_buffer = [];

    var z;
    if (esSuperior) z = 1.0;
    else z = -1.0;
    for (var i = 0; i < this.position_buffer.length-1; i+=3){
        this.tangent_buffer.push(1.0, 0.0, 0.0);
        this.normal_buffer.push(0.0, 0.0, z);
    }

    this.uv_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_uv_buffer = null;

    this.texture = null;
    this.textureImage = null;


    this._calcularUV = function(){
        this.uv_buffer = [];
        // this.uv_buffer.push(0.5, 0.5); // el centro
        for (var i = 0; i < this.position_buffer.length-1; i+=3){
            this.uv_buffer.push(this.position_buffer[i] / 100.0);
            this.uv_buffer.push(this.position_buffer[i+1] / 100.0);
        }
    }

    if (this.esTexturada) this._calcularUV();

    this.initBuffers = function(gl, color){
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

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
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

        // if (this.esTexturada){
        //     // console.log("");
        //     console.log("LONGITUDES TAPA")
        //     console.log("position_buffer: " + this.position_buffer.length);
        //     console.log("index_buffer: " + this.index_buffer.length);
        //     console.log("normal_buffer: " + this.normal_buffer.length);
        //     console.log("tangent_buffer: " + this.tangent_buffer.length);
        //     if(this.esTexturada) console.log("uv_buffer: " + this.uv_buffer.length);
        //     console.log("maximo indice: " + Math.max.apply(Math, this.index_buffer));
        //     // console.log("");
        // }
    }


     this.handleLoadedTexture = function(objectImage) {
        // this.tiene_textura = true;
        this.texture = gl.createTexture();

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // Vinculamos la textura creada con la etapa TEXTURE_2D dentro del pipeline
        // Todas las operaciones sobre esta etapa que se ejecuten a continuación afectan
        // al objeto texture.
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, objectImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        // Desvinculamos la textura de la etapa.
        gl.bindTexture(gl.TEXTURE_2D, null);
    }


    this.draw = function(modelMatrix, gl, shaderProgram){

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    this.drawConTextura = function(modelMatrix, gl, shaderProgram){
       // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        this.modelMatrix = modelMatrix;

       if(this.esTexturada){
            var texMatrix = mat3.create();
            mat3.identity(texMatrix);

            // // Matriz de transformación de las coordenadas de Textura
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
            // Asigno los colores
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);  
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        //gl.drawElements(gl.LINE_LOOP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        /////////////////////////////////
    }


}
