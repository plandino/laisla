function tapa(centro, perimetro, esSuperior, esTexturada, escalaX, escalaY) {
    this.centro = centro;
    this.perimetro = perimetro;
    this.esTexturada = esTexturada;
    this.escalaX = escalaX;
    this.escalaY = escalaY;
    
    this.position_buffer = centro.concat(perimetro);

    this.index_buffer = [];
    for (var i = 0; i < this.position_buffer.length/3; i++)
        this.index_buffer.push(i);
    
    this.tangent_buffer = [];
    this.normal_buffer = [];

    var y;
    if (esSuperior) y = 1.0;
    else y = -1.0;
    for (var i = 0; i < this.position_buffer.length-1; i+=3){
        this.tangent_buffer.push(1.0, 0.0, 0.0);
        this.normal_buffer.push(0.0, y, 0.0);
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
    this.normalMapTextureImage = null;


    this._calcularUV = function(){
        this.uv_buffer = [];
        for (var i = 0; i < this.position_buffer.length-1; i+=3){
            this.uv_buffer.push(this.position_buffer[i] / this.escalaX);
            this.uv_buffer.push(this.position_buffer[i+1] / this.escalaY);
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

    }


    this.handleLoadedTexture = function(objectImage, texturaRelieve) {

        if( texturaRelieve){

          gl.activeTexture(gl.TEXTURE1);
          this.normalMapTexture = gl.createTexture();

          gl.bindTexture(gl.TEXTURE_2D, this.normalMapTexture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          this.conRelieve = true;
        } else {

          gl.activeTexture(gl.TEXTURE0);
          this.texture = gl.createTexture();

          gl.bindTexture(gl.TEXTURE_2D, this.texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }

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
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        var normalMatrix = mat3.create();
        mat3.identity(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);

        var MVnormalMatrix = mat3.create();
        mat3.identity(MVnormalMatrix);
        mat3.fromMat4(MVnormalMatrix, cameraMatrix);
        mat3.invert(MVnormalMatrix, MVnormalMatrix);
        mat3.transpose(MVnormalMatrix, MVnormalMatrix);
        gl.uniformMatrix3fv(shaderProgram.MVnormalMatrixUniform, false, MVnormalMatrix);

       if(this.esTexturada){
            gl.uniform1f(shaderProgram.ka, KA);
            gl.uniform1f(shaderProgram.kd, KD);
            gl.uniform1f(shaderProgram.ks, 0.0);
            gl.uniform1f(shaderProgram.shininess, S);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            var texMatrix = mat3.create();
            mat3.identity(texMatrix);

            gl.uniformMatrix3fv(shaderProgram.texMatrixUniform, false, texMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_uv_buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);


            if(this.conRelieve){
              gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
              gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, this.normalMapTexture);
              gl.uniform1i(shaderProgram.samplerUniformNormalMap, 1); 
            }

        } else {
            console.log("Entra a dibujar colores en tapa texturada");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);  
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }


}
