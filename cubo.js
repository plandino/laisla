function cubo(ancho, alto, profundo, escalarTextura, conTextura, conRelieve){
    // Estos son los arrays donde defino los valores        
    this.vertices           = null;
    this.indices            = null;
    this.generatedColors    = null;
    this.coordenadasUV      = null;
    this.normales           = null;
    this.tangentes          = null;

    this.conTextura = conTextura;
    this.conRelieve = conRelieve;

    // Estos son los buffers que voy a bindear para mandar a los shaders
    this.cubeVertexBuffer         = null;
    this.cubeVertexIndexBuffer    = null;
    this.cubeVertexColorBuffer    = null;
    this.cubeVertexNormalBuffer   = null;
    this.cubeVertexTangentBuffer  = null;
    this.cubeuvTextureBuffer      = null;

    this.modelMatrix            = null;   // Esto es para guardar y devolver la posicion, lo uso para la traslaciones

    this.texture      = null;
    this.textureImage = null;
    this.normalMapTexture      = null;
    this.normalMapTextureImage = null;


    this.initBuffers = function(gl, shaderProgram, color, coordUV){
        // Esto auxiliares los uso para construir los vertices del cubo
        var width   = ancho/2.0;
        var height  = alto/2.0;
        var z       = profundo/2.0;

        // Construyo los vertices
        this.vertices = [

        // Cara adelante
          -width, -height,  z,
           width, -height,  z,
           width,  height,  z,
          -width,  height,  z,

        // Cara atras
          -width, -height, -z,
           width, -height, -z,
           width,  height, -z,
          -width,  height, -z,

        // Cara izquierda
          -width, -height, -z,
          -width, -height,  z,
          -width,  height,  z,
          -width,  height, -z,

        // Cara derecha
           width, -height, -z,
           width, -height,  z,
           width,  height,  z,
           width,  height, -z,

        // Cara arriba
          -width,  height,  z,
           width,  height,  z,
           width,  height, -z,
          -width,  height, -z,

        // Cara abajo
          -width, -height,  z,
           width, -height,  z,
           width, -height, -z,
          -width, -height, -z
        ];

        this.normales = [
           
           // Normales adelante
           0.0,0.0,1.0,
           0.0,0.0,1.0,
           0.0,0.0,1.0,
           0.0,0.0,1.0,

           // Normales atras
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,

           // Normales izquierda
          -1.0,0.0,0.0,
          -1.0,0.0,0.0,
          -1.0,0.0,0.0,
          -1.0,0.0,0.0,

          // Normales derecha
           1.0,0.0,0.0,
           1.0,0.0,0.0,
           1.0,0.0,0.0,
           1.0,0.0,0.0,

           // Normales arriba
           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,

           // Normales abajo
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,

        ];

        // Asigno el buffer de las normales
        this.cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normales), gl.STATIC_DRAW);
        this.cubeVertexNormalBuffer.itemSize = 3;
        this.cubeVertexNormalBuffer.numItems = this.vertices.length / 3;


        this.tangentes = [
           
           // Tangentes adelante
           1.0,0.0,0.0,
           1.0,0.0,0.0,
           1.0,0.0,0.0,
           1.0,0.0,0.0,

           // Tangentes atras
           -1.0,0.0,0.0,
           -1.0,0.0,0.0,
           -1.0,0.0,0.0,
           -1.0,0.0,0.0,

           // Tangentes izquierda
            0.0,0.0,1.0,
            0.0,0.0,1.0,
            0.0,0.0,1.0,
            0.0,0.0,1.0,

          // Tangentes derecha
            0.0,0.0,-1.0,
            0.0,0.0,-1.0,
            0.0,0.0,-1.0,
            0.0,0.0,-1.0,

           // Tangentes arriba
           1.0,0.0,0.0,
           1.0,0.0,0.0,
           1.0,0.0,0.0,
           1.0,0.0,0.0,

           // Tangentes abajo
           -1.0,0.0,0.0,
           -1.0,0.0,0.0,
           -1.0,0.0,0.0,
           -1.0,0.0,0.0,
        ];

        // Asigno el buffer de las normales
        this.cubeVertexTangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangentes), gl.STATIC_DRAW);
        this.cubeVertexTangentBuffer.itemSize = 3;
        this.cubeVertexTangentBuffer.numItems = this.tangentes.length / 3;


        this.cubeVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.cubeVertexBuffer.itemSize = 3;
        this.cubeVertexBuffer.numItems = this.vertices.length / 3;

        if(coordUV){
          this.coordenadasUV = coordUV;
        } else {
          this.coordenadasUV = coordenadasUVContainer;
        }

        this.indices = [

            // Cara de adelante
            0, 1, 2,
            0, 2, 3,

            // Cara atras
            4, 5, 6,
            4, 6, 7,

            // Cara izquierda
            8,  9, 10,
            8, 10, 11,

            // Cara derecha
            12, 14, 13,
            12, 15, 14,

            // Cara arriba
            16, 17, 18,
            16, 18, 19,

            // Cara abajo
            20, 21, 22,
            20, 22, 23

        ];


        this.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        this.cubeVertexIndexBuffer.itemSize = 1;
        this.cubeVertexIndexBuffer.numItems = this.indices.length;

        var colors = getColor(color);
      
        this.generatedColors = [];
        for (var j=0; j<colors.length; j++) {
          var c = colors[j];
          for (var i=0; i<10; i++) {
            this.generatedColors = this.generatedColors.concat(c);
          }
        }

        if(this.conTextura){
          this.cubeuvTextureBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeuvTextureBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.coordenadasUV), gl.STATIC_DRAW);
          this.cubeuvTextureBuffer.itemSize = 2;
          this.cubeuvTextureBuffer.numItems = this.coordenadasUV.length / 2;
        } else {
          this.cubeVertexColorBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.generatedColors), gl.STATIC_DRAW);
          this.cubeVertexColorBuffer.itemSize = 4;
          this.cubeVertexColorBuffer.numItems = this.generatedColors.length / 4;  
        }
    }


    this.handleLoadedTexture =function(objectImage, texturaRelieve) {

        if( texturaRelieve){

          gl.activeTexture(gl.TEXTURE1);
          this.normalMapTexture = gl.createTexture();

          gl.bindTexture(gl.TEXTURE_2D, this.normalMapTexture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
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

    this.drawSoloTextura = function(modelMatrix, gl, shaderProgram){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        this.modelMatrix = modelMatrix;

       if(this.conTextura){
                  gl.uniform1f(shaderProgram.ka, KA);
                  gl.uniform1f(shaderProgram.kd, KD);
                  gl.uniform1f(shaderProgram.ks, 0.0);
                  gl.uniform1f(shaderProgram.shininess, S);

                  var normalMatrix = mat3.create();
                  mat3.identity(normalMatrix);
                  mat3.fromMat4(normalMatrix, modelMatrix);
                  mat3.invert(normalMatrix, normalMatrix);
                  mat3.transpose(normalMatrix, normalMatrix);
                  gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);


                  var mvMatrix = mat4.create();
                  mat4.multiply(mvMatrix, cameraMatrix, modelMatrix);
                  var MVnormalMatrix = mat3.create();
                  mat3.identity(MVnormalMatrix);
                  mat3.fromMat4(MVnormalMatrix, mvMatrix);
                  mat3.invert(MVnormalMatrix, MVnormalMatrix);
                  mat3.transpose(MVnormalMatrix, MVnormalMatrix);
                  gl.uniformMatrix3fv(shaderProgram.MVnormalMatrixUniform, false, MVnormalMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            var texMatrix = mat3.create();
            mat3.identity(texMatrix);

            gl.uniformMatrix3fv(shaderProgram.texMatrixUniform, false, texMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeuvTextureBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeuvTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);

            if(this.conRelieve){


              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, this.normalMapTexture);
              gl.uniform1i(shaderProgram.samplerUniformNormalMap, 1); 

              gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTangentBuffer);
              gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.cubeVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);

            }
        } else {
            // Asigno los colores
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);  
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    this.drawEspecial = function(modelMatrix, gl, shaderProgram){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        this.modelMatrix = modelMatrix;

       if(this.conTextura){
                  gl.uniform1f(shaderProgram.ka, KA);
                  gl.uniform1f(shaderProgram.kd, KD);
                  gl.uniform1f(shaderProgram.ks, 0.0);
                  gl.uniform1f(shaderProgram.shininess, S);

                  var normalMatrix = mat3.create();
                  mat3.identity(normalMatrix);
                  mat3.fromMat4(normalMatrix, modelMatrix);
                  mat3.invert(normalMatrix, normalMatrix);
                  mat3.transpose(normalMatrix, normalMatrix);
                  gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);


                  var mvMatrix = mat4.create();
                  mat4.multiply(mvMatrix, cameraMatrix, modelMatrix);
                  var MVnormalMatrix = mat3.create();
                  mat3.identity(MVnormalMatrix);
                  mat3.fromMat4(MVnormalMatrix, mvMatrix);
                  mat3.invert(MVnormalMatrix, MVnormalMatrix);
                  mat3.transpose(MVnormalMatrix, MVnormalMatrix);
                  gl.uniformMatrix3fv(shaderProgram.MVnormalMatrixUniform, false, MVnormalMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            var texMatrix = mat3.create();
            mat3.identity(texMatrix);

            gl.uniformMatrix3fv(shaderProgram.texMatrixUniform, false, texMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeuvTextureBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeuvTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);


            if(this.conRelieve){
              gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTangentBuffer);
              gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.cubeVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
            }


            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniformTextureMap, 0);

            if(this.conRelieve){
              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, this.normalMapTexture);
              gl.uniform1i(shaderProgram.samplerUniformNormalMap, 1); 
            }


        } else {
            // Asigno los colores
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);  
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    this.getPosition = function(){
        return [this.modelMatrix[12], this.modelMatrix[13], this.modelMatrix[14] ];
    }
  }