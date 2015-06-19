function cubo(ancho, alto, profundo, escalarTextura){
    // Estos son los arrays donde defino los valores        
    this.vertices           = null;
    this.indices            = null;
    this.generatedColors    = null;
    this.coordenadasUV      = null;

    // Estos son los buffers que voy a bindear para mandar a los shaders
    this.cubeVertexBuffer       = null;
    this.cubeVertexIndexBuffer  = null;
    this.cubeVertexColorBuffer  = null;
    this.cubeuvTextureBuffer        = null;

    this.modelMatrix            = null;

    this.texture = null;

    this.textureImage = null;

    // Inicio los valores, para los vertices(posicion, color) e indices
    // Luego los bindeo con los buffers
    this.initBuffers = function(gl, shaderProgram, color){

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


        // Creamos un buffer de vertices para WebGL.
        this.cubeVertexBuffer = gl.createBuffer();
        // Le decimos a WebGL que las siguientes funciones se relacionan con ese buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        // Cargamos datos de posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.cubeVertexBuffer.itemSize = 3;
        this.cubeVertexBuffer.numItems = this.vertices.length / 3;

        this.coordenadasUV = [

        // Cara adelante
          1, 0,
          1, 1,
          0, 1,
          0, 0,

        // Cara atras
          1, 0,
          1, 1,
          0, 1,
          0, 0,

        // Cara izquierda
          1, 0,
          1, 1,
          0, 1,
          0, 0,

        // Cara derecha
          1, 0,
          1, 1,
          0, 1,
          0, 0,

        // Cara arriba
          1, 0,
          1, 1,
          0, 1,
          0, 0,

        // Cara abajo
          1, 0,
          1, 1,
          0, 1,
          0, 0
        ];

        // Cargamos los datos de las texturas
        this.cubeuvTextureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeuvTextureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.coordenadasUV), gl.STATIC_DRAW);
        this.cubeuvTextureBuffer.itemSize = 2;
        this.cubeuvTextureBuffer.numItems = this.coordenadasUV.length / 2;

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

        // Definimos y cargamos los datos en el buffer WebGL correspondiente.
        // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
        // Notar también que se usa un array de enteros en lugar de floats.
        this.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        this.cubeVertexIndexBuffer.itemSize = 1;
        this.cubeVertexIndexBuffer.numItems = this.indices.length;

        var colors = getColor(color);
      
        // Replicamos los colores de cada cara dos veces.
        this.generatedColors = [];
        for (var j=0; j<colors.length; j++) {
          var c = colors[j];
          for (var i=0; i<10; i++) {
            this.generatedColors = this.generatedColors.concat(c);
          }
        }

        // Cargamos los datos de los colores en un nuevo buffer igual que con las posiciones
        this.cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.generatedColors), gl.STATIC_DRAW);
        this.cubeVertexColorBuffer.itemSize = 4;
        this.cubeVertexColorBuffer.numItems = this.generatedColors.length / 4;

        loadTexture(this, this.textureImage, "uvgrid.jpg");
    }

    // Método del objeto texturado, que es llamado de manera asincrónica
    // cuando es cargado un archivo de imagen en un objeto Image de JavaScript
    // Dentro de este método se crea el objeto texture a nivel del driver de WebGL
    // y se iniciliza y carga con la información del archivo de imagen.
    this.handleLoadedTexture =function(objectImage) {

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

        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

        this.modelMatrix = modelMatrix;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeuvTextureBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeuvTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);

        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        //gl.drawElements(gl.LINE_LOOP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        /////////////////////////////////
    }

    this.getPosition = function(){
        // return this.modelMatrix;
        return [this.modelMatrix[12], this.modelMatrix[13], this.modelMatrix[14] ];
    }
  }