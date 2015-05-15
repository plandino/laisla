function cabina(ancho, alto, profundo){
    // Estos son los arrays donde defino los valores        
    this.vertices           = null;
    this.indices            = null;
    this.generatedColors    = null;

    this.barraUnoY = null;
    this.barraDosY = null;

    this.barraUnoX = null;
    this.barraDosX = null;    

    // Estos son los buffers que voy a bindear para mandar a los shaders
    this.cubeVertexBuffer       = null;
    this.cubeVertexIndexBuffer  = null;
    this.cubeVertexColorBuffer  = null;

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
           4.0, -1.7, 5.0,
          -1.5, -1.7, 5.0,

          -1.5, 1.7, 5.0,
           2.0, 1.7, 5.0,
           2.3, 2.0, 5.0,
          -4.0, 2.0, 5.0,

          // Otro costado
          -5.0, -2.0, -5.0,
           5.0, -2.0, -5.0,
           4.0, -1.7, -5.0,
          -1.5, -1.7, -5.0,

          -1.5, 1.7, -5.0,
           2.0, 1.7, -5.0,
           2.3, 2.0, -5.0,
          -4.0, 2.0, -5.0,

          // La ventana de adelante
          5.0, -1.7,  4.7,
          2.3,  1.7,  4.7,
          5.0, -1.7, -4.7,
          2.3,  1.7, -4.7,

          // El piso
          -1.5, -2.0,  4.7,
           4.0, -2.0,  4.7,
          -1.5, -2.0, -4.7,
           4.0, -2.0, -4.7

          ];


        // Creamos un buffer de vertices para WebGL.
        this.cubeVertexBuffer = gl.createBuffer();
        // Le decimos a WebGL que las siguientes funciones se relacionan con ese buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        // Cargamos datos de posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.cubeVertexBuffer.itemSize = 3;
        this.cubeVertexBuffer.numItems = this.vertices.length;

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

            // El plano de atras
            0,  7, 15,
            0, 15, 8,

            // El techo
            7,  6, 14,
            7, 14, 15,

            // La parte de adelante
            1, 16, 17,
            1, 17,  6,
            1,  9, 18,
            1, 18, 16,
            9, 14, 19,
            9, 19, 18,
            14, 6, 19,
            19, 6, 17,

            // El piso
            0, 22, 20,
            0,  8, 22,
            8, 23, 22,
            8,  9, 23,
            9,  1, 21,
            9, 21, 23,
            1, 20, 21,
            1,  0, 20


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
          for (var i=0; i<6; i++) {
            this.generatedColors = this.generatedColors.concat(c);
          }
        }

        // Cargamos los datos de los colores en un nuevo buffer igual que con las posiciones
        this.cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.generatedColors), gl.STATIC_DRAW);
        this.cubeVertexColorBuffer.itemSize = 4;
        this.cubeVertexColorBuffer.numItems = this.generatedColors.length;
    }

    this.draw = function(modelMatrix, gl, shaderProgram){

        var matrix_barraUnoY = mat4.create();
        mat4.identity(matrix_barraUnoY);
        mat4.multiply(matrix_barraUnoY, matrix_barraUnoY ,modelMatrix);
        mat4.translate(matrix_barraUnoY, matrix_barraUnoY, [0.0, -14.51 + ((1 - escaladoPlumaY) * (25.0 / 2) ), 5.0 ]);
        mat4.scale(matrix_barraUnoY, matrix_barraUnoY, [1.0, escaladoPlumaY, 1.0]);
        this.barraUnoY.draw(matrix_barraUnoY, gl, shaderProgram);

        var matrix_barraDosY = mat4.create();
        mat4.identity(matrix_barraDosY);
        mat4.multiply(matrix_barraDosY, matrix_barraDosY ,modelMatrix);
        mat4.translate(matrix_barraDosY, matrix_barraDosY, [0.0, -14.51 + ((1 - escaladoPlumaY) * (25.0 / 2) ), -5.0 ]);
        mat4.scale(matrix_barraDosY, matrix_barraDosY, [1.0, escaladoPlumaY, 1.0]);
        this.barraDosY.draw(matrix_barraDosY, gl, shaderProgram);

        var matrix_barraUnoX = mat4.create();
        mat4.identity(matrix_barraUnoX);
        mat4.multiply(matrix_barraUnoX, matrix_barraUnoX ,modelMatrix);
        mat4.translate(matrix_barraUnoX, matrix_barraUnoX, [0.0, -26.5 + ((1 - escaladoPlumaY) * (25.0 / 1) ), 5.0 ]);
        this.barraUnoX.draw(matrix_barraUnoX, gl, shaderProgram);

        var matrix_barraDosX = mat4.create();
        mat4.identity(matrix_barraDosX);
        mat4.multiply(matrix_barraDosX, matrix_barraDosX ,modelMatrix);
        mat4.translate(matrix_barraDosX, matrix_barraDosX, [0.0, -26.5 + ((1 - escaladoPlumaY) * (25.0 / 1) ), -5.0 ]);
        this.barraDosX.draw(matrix_barraDosX, gl, shaderProgram);

        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.vertexAttribPointer(gl.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        // gl.drawElements(gl.LINE_LOOP, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        /////////////////////////////////
    }
  }