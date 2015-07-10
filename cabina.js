function cabina(scaleX, scaleY, scaleZ, conRelieve){
    // Estos son los arrays donde defino los valores        
    this.vertices           = null;
    this.indices            = null;
    this.generatedColors    = null;

    this.normales = null;
    this.tangentes = null;

    this.barraUnoY = null;
    this.barraDosY = null;

    this.barraUnoX = null;
    this.barraDosX = null;    

    this.conRelieve = conRelieve;

    this.escalaX = scaleX;
    this.escalaY = scaleY;
    this.escalaZ = scaleZ;

    this.tieneRelieve = false;
    this.conTextura = false;

    this.texture = null;
    this.textureImage = null;
    this.relieveTexture = null;
    this.relieveTextureImage = null;

    // Estos son los buffers que voy a bindear para mandar a los shaders
    this.cubeVertexBuffer       = null;
    this.cubeVertexIndexBuffer  = null;
    this.cubeVertexColorBuffer  = null;
    this.cubeVertexNormalBuffer     = null;
    this.cubeVertexTangentBuffer    = null;
    this.cubeuvTextureBuffer      = null;


    // Inicio los valores, para los vertices(posicion, color) e indices
    // Luego los bindeo con los buffers
    this.initBuffers = function(gl, shaderProgram, color){


        this.barraUnoY = new cubo(0.5, 25.0, 0.5);
        this.barraUnoY.initBuffers(gl, shaderProgram, "orange");
        
        this.barraDosY = new cubo(0.5, 25.0, 0.5);
        this.barraDosY.initBuffers(gl, shaderProgram, "orange");

        this.barraUnoX = new cubo(10.0, 1.0, 1.0);
        this.barraUnoX.initBuffers(gl, shaderProgram, "orange");
        
        this.barraDosX = new cubo(10.0, 1.0, 1.0);
        this.barraDosX.initBuffers(gl, shaderProgram, "orange");

        // Construyo los vertices
        this.vertices = [

          // Un costado
          -5.0, -2.0, 5.0,
           5.0, -2.0, 5.0,
           5.0, -1.7, 5.0,
          -1.5, -1.7, 5.0,

          -1.5, 1.7, 5.0,
           2.0, 1.7, 5.0,
           2.3, 2.0, 5.0,
          -5.0, 2.0, 5.0,

          // Otro costado
          -5.0, -2.0, -5.0,
           5.0, -2.0, -5.0,
           5.0, -1.7, -5.0,
          -1.5, -1.7, -5.0,

          -1.5, 1.7, -5.0,
           2.0, 1.7, -5.0,
           2.3, 2.0, -5.0,
          -5.0, 2.0, -5.0,

          // // Atras
          -5.0, -2.0, -5.0,
          -5.0, -2.0,  5.0,
          -5.0,  2.0,  5.0,
          -5.0,  2.0, -5.0, 

          // Adelante
          5.0, -2.0,  5.0,
          5.0, -2.0, -5.0,
          5.0, -1.7, -4.7,
          5.0, -1.7,  4.7,

          2.3,  1.7,  4.7,
          2.3,  1.7, -4.7,
          2.3,  2.0, -5.0,
          2.3,  2.0,  5.0,

          // Techo 
          -5.0, 2.0,  5.0,
           2.3, 2.0,  5.0,
           2.3, 2.0, -5.0,
          -5.0, 2.0, -5.0,

          // Abajo
          -5.0, -2.0,  5.0,
           5.0, -2.0,  5.0,
           4.0, -2.0,  4.7,
          -1.5, -2.0,  4.7,

          -1.5, -2.0, -4.7,
           4.0, -2.0, -4.7,
           5.0, -2.0, -5.0,
          -5.0, -2.0, -5.0,

          ];


        this.cubeVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.cubeVertexBuffer.itemSize = 3;
        this.cubeVertexBuffer.numItems = this.vertices.length;

      this.normales = [
           
           // Normales costado adelante
           0.0,0.0,1.0,
           0.0,0.0,1.0,
           0.0,0.0,1.0,
           0.0,0.0,1.0,

           0.0,0.0,1.0,
           0.0,0.0,1.0,
           0.0,0.0,1.0,
           0.0,0.0,1.0,

           // Normales costado atras
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,

           0.0,0.0,-1.0,
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,
           0.0,0.0,-1.0,

           // Normales atras
          -1.0,0.0,0.0,
          -1.0,0.0,0.0,
          -1.0,0.0,0.0,
          -1.0,0.0,0.0,

          // Normales adelante
           0.8288486741, 0.559472855, 0.0,
           0.8288486741, 0.559472855, 0.0,
           0.8288486741, 0.559472855, 0.0,
           0.8288486741, 0.559472855, 0.0,

           0.8288486741, 0.559472855, 0.0,
           0.8288486741, 0.559472855, 0.0,
           0.8288486741, 0.559472855, 0.0,
           0.8288486741, 0.559472855, 0.0,

           // Normales techo
           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,

          // Normales abajo
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,

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
        this.cubeVertexNormalBuffer.numItems = this.normales.length / 3;

        this.tangentes = [
           
           // tangentes costado adelante
           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,

           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,
           0.0,1.0,0.0,

           // tangentes costado atras
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,

           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,
           0.0,-1.0,0.0,

           // tangentes atras
          0.0,0.0,1.0,
          0.0,0.0,1.0,
          0.0,0.0,1.0,
          0.0,0.0,1.0,

          // tangentes adelante
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,

          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,

           // tangentes techo
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,

          // tangentes abajo
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,

          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,
          0.0,0.0,-1.0,

        ];

        // Asigno el buffer de las tangentes
        this.cubeVertexTangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangentes), gl.STATIC_DRAW);
        this.cubeVertexTangentBuffer.itemSize = 3;
        this.cubeVertexTangentBuffer.numItems = this.tangentes.length / 3;

        this.coordenadasUV = coordenadasUVCabinaGrua;

        // if(this.conTextura){
          this.cubeuvTextureBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeuvTextureBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.coordenadasUV), gl.STATIC_DRAW);
          this.cubeuvTextureBuffer.itemSize = 2;
          this.cubeuvTextureBuffer.numItems = this.coordenadasUV.length / 2;

        this.indices = [
            // Un costado
            0, 4, 7,
            0, 3, 4,

            // 
            0, 2, 3,
            0, 1, 2,

            // 
            1, 5, 2,
            1, 6, 5,

            // 
            5, 6, 7,
            5, 7, 4,

            // Otro costado
            8, 12, 15,
            8, 11, 12,

            // 
            8, 10, 11,
            8, 9,  10,

            // 
            9, 13, 10,
            9, 14, 13,

            // 
            13, 14, 15,
            13, 15, 12,

            // Atras
            16, 17, 18,
            16, 18, 19,

            // Adelante
            20, 23, 24,
            20, 24, 27,
            20, 22, 23,
            20, 21, 22,
            21, 25, 22,
            21, 26, 25,
            26, 27, 25,
            25, 27, 24,

            // // Techo
            28, 29, 30,
            28, 30, 31,

            // Piso
            32, 36, 35,
            32, 39, 36, 
            39, 37, 36, 
            39, 38, 37, 
            38, 34, 37,
            38, 33, 34,
            33, 35, 34,
            33, 32, 35,

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
          for (var i=0; i<20; i++) {
            this.generatedColors = this.generatedColors.concat(c);
          }
        }

        this.cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.generatedColors), gl.STATIC_DRAW);
        this.cubeVertexColorBuffer.itemSize = 4;
        this.cubeVertexColorBuffer.numItems = this.generatedColors.length;
    }

    this.handleLoadedTexture =function(objectImage, texturaRelieve) {
      this.conTextura = true;

        if( texturaRelieve){
          this.tieneRelieve = true;

          gl.activeTexture(gl.TEXTURE1);
          this.relieveTexture = gl.createTexture();

          gl.bindTexture(gl.TEXTURE_2D, this.relieveTexture);
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

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    this.draw = function(modelMatrix, gl, shaderProgram){

        var matrix_barraUnoY = mat4.create();
        mat4.identity(matrix_barraUnoY);
        mat4.multiply(matrix_barraUnoY, matrix_barraUnoY ,modelMatrix);
        mat4.translate(matrix_barraUnoY, matrix_barraUnoY, [0.0, -14.51 + ((1 - escaladoPlumaY) * (25.0 / 2) ), 5.0 ]);
        mat4.scale(matrix_barraUnoY, matrix_barraUnoY, [1.0, escaladoPlumaY, 1.0]);
        this.barraUnoY.drawEspecial(matrix_barraUnoY, gl, shaderProgram);

        var matrix_barraDosY = mat4.create();
        mat4.identity(matrix_barraDosY);
        mat4.multiply(matrix_barraDosY, matrix_barraDosY ,modelMatrix);
        mat4.translate(matrix_barraDosY, matrix_barraDosY, [0.0, -14.51 + ((1 - escaladoPlumaY) * (25.0 / 2) ), -5.0 ]);
        mat4.scale(matrix_barraDosY, matrix_barraDosY, [1.0, escaladoPlumaY, 1.0]);
        this.barraDosY.drawEspecial(matrix_barraDosY, gl, shaderProgram);

        var matrix_barraUnoX = mat4.create();
        mat4.identity(matrix_barraUnoX);
        mat4.multiply(matrix_barraUnoX, matrix_barraUnoX ,modelMatrix);
        mat4.translate(matrix_barraUnoX, matrix_barraUnoX, [0.0, -26.5 + ((1 - escaladoPlumaY) * (25.0 / 1) ), 5.0 ]);
        this.barraUnoX.drawEspecial(matrix_barraUnoX, gl, shaderProgram);

        var matrix_barraDosX = mat4.create();
        mat4.identity(matrix_barraDosX);
        mat4.multiply(matrix_barraDosX, matrix_barraDosX ,modelMatrix);
        mat4.translate(matrix_barraDosX, matrix_barraDosX, [0.0, -26.5 + ((1 - escaladoPlumaY) * (25.0 / 1) ), -5.0 ]);
        this.barraDosX.drawEspecial(matrix_barraDosX, gl, shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

   this.drawConTextura = function(modelMatrix, gl, shaderSimple, shaderRelieve){

        /***** CONTEXTO RELIEVE *****/
        gl.useProgram(shaderRelieve);
        gl.uniformMatrix4fv(shaderRelieve.perspectiveMatrixUniform, false, perspectiveMatrix);
        gl.uniformMatrix4fv(shaderRelieve.viewMatrixUniform, false, cameraMatrix );

        setLucesNormal(cameraMatrix, gl, shaderRelieve);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(shaderRelieve.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(shaderRelieve.modelMatrixUniform, false, modelMatrix);

        this.modelMatrix = modelMatrix;

       if(this.conTextura){
                  gl.uniform1f(shaderRelieve.ka, KA);
                  gl.uniform1f(shaderRelieve.kd, KD);
                  gl.uniform1f(shaderRelieve.ks, 0.0);
                  gl.uniform1f(shaderRelieve.shininess, S);

                  var normalMatrix = mat3.create();
                  mat3.identity(normalMatrix);
                  mat3.fromMat4(normalMatrix, modelMatrix);
                  mat3.invert(normalMatrix, normalMatrix);
                  mat3.transpose(normalMatrix, normalMatrix);
                  gl.uniformMatrix3fv(shaderRelieve.normalMatrixUniform, false, normalMatrix);


                  var mvMatrix = mat4.create();
                  mat4.multiply(mvMatrix, cameraMatrix, modelMatrix);
                  var MVnormalMatrix = mat3.create();
                  mat3.identity(MVnormalMatrix);
                  mat3.fromMat4(MVnormalMatrix, mvMatrix);
                  mat3.invert(MVnormalMatrix, MVnormalMatrix);
                  mat3.transpose(MVnormalMatrix, MVnormalMatrix);
                  gl.uniformMatrix3fv(shaderRelieve.MVnormalMatrixUniform, false, MVnormalMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
            gl.vertexAttribPointer(shaderRelieve.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            var texMatrix = mat3.create();
            mat3.identity(texMatrix);

            gl.uniformMatrix3fv(shaderRelieve.texMatrixUniform, false, texMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeuvTextureBuffer);
            gl.vertexAttribPointer(shaderRelieve.textureCoordAttribute, this.cubeuvTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderRelieve.samplerUniform, 0);

            if(this.conRelieve){


              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, this.relieveTexture);
              gl.uniform1i(shaderRelieve.samplerUniformNormalMap, 1); 

              gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTangentBuffer);
              gl.vertexAttribPointer(shaderRelieve.vertexTangentAttribute, this.cubeVertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);

            }
        } else {
            // Asigno los colores
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
            gl.vertexAttribPointer(shaderRelieve.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);  
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        /***** CONTEXTO SIMPLE *****/
        gl.useProgram(shaderSimple);
        gl.uniformMatrix4fv(shaderSimple.perspectiveMatrixUniform, false, perspectiveMatrix);
        gl.uniformMatrix4fv(shaderSimple.viewMatrixUniform, false, cameraMatrix );

        var matrix_barraUnoY = mat4.create();
        mat4.identity(matrix_barraUnoY);
        mat4.multiply(matrix_barraUnoY, matrix_barraUnoY ,modelMatrix);
        mat4.translate(matrix_barraUnoY, matrix_barraUnoY, [0.0, -14.51 + ((1 - escaladoPlumaY) * (25.0 / 2) ), 5.0 ]);
        mat4.scale(matrix_barraUnoY, matrix_barraUnoY, [1.0, escaladoPlumaY, 1.0]);
        this.barraUnoY.drawEspecial(matrix_barraUnoY, gl, shaderSimple);

        var matrix_barraDosY = mat4.create();
        mat4.identity(matrix_barraDosY);
        mat4.multiply(matrix_barraDosY, matrix_barraDosY ,modelMatrix);
        mat4.translate(matrix_barraDosY, matrix_barraDosY, [0.0, -14.51 + ((1 - escaladoPlumaY) * (25.0 / 2) ), -5.0 ]);
        mat4.scale(matrix_barraDosY, matrix_barraDosY, [1.0, escaladoPlumaY, 1.0]);
        this.barraDosY.drawEspecial(matrix_barraDosY, gl, shaderSimple);

        var matrix_barraUnoX = mat4.create();
        mat4.identity(matrix_barraUnoX);
        mat4.multiply(matrix_barraUnoX, matrix_barraUnoX ,modelMatrix);
        mat4.translate(matrix_barraUnoX, matrix_barraUnoX, [0.0, -26.5 + ((1 - escaladoPlumaY) * (25.0 / 1) ), 5.0 ]);
        this.barraUnoX.drawEspecial(matrix_barraUnoX, gl, shaderSimple);

        var matrix_barraDosX = mat4.create();
        mat4.identity(matrix_barraDosX);
        mat4.multiply(matrix_barraDosX, matrix_barraDosX ,modelMatrix);
        mat4.translate(matrix_barraDosX, matrix_barraDosX, [0.0, -26.5 + ((1 - escaladoPlumaY) * (25.0 / 1) ), -5.0 ]);
        this.barraDosX.drawEspecial(matrix_barraDosX, gl, shaderSimple);
    }


  }
