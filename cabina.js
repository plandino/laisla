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


        this.barraUnoY = new cubo(0.5, 50.0, 0.5);
        this.barraUnoY.initBuffers(gl, shaderProgram, "orange");
        
        this.barraDosY = new cubo(0.5, 50.0, 0.5);
        this.barraDosY.initBuffers(gl, shaderProgram, "orange");

        this.barraUnoX = new cubo(10.0, 1.0, 1.0);
        this.barraUnoX.initBuffers(gl, shaderProgram, "orange");
        
        this.barraDosX = new cubo(10.0, 1.0, 1.0);
        this.barraDosX.initBuffers(gl, shaderProgram, "orange");

        // Esto auxiliares los uso para construir los vertices del cubo
        var width   = ancho/2.0;
        var height  = alto/2.0;
        var z       = profundo/2.0;

        // Construyo los vertices
        this.vertices = [
          -width, -height,  z,
          -width, -height, -z,
          -width,  height,  z,
          -width,  height, -z,

           width, -height,  z,
           width, -height, -z,
           width,  height,  z,
           width,  height, -z
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
            // Cara de adelante
            0, 4, 6,
            0, 6, 2,

            // Cara izquierda
            1, 0, 2,
            1, 2, 3,

            // Cara arriba
            6, 7, 3,
            6, 3, 2,

            // Cara derecha
            4, 5, 7,
            4, 7, 6,

            // Cara abajo
            4, 1, 0,
            4, 5, 1,

            // Cara atras
            1, 5, 7,
            1, 7, 3
        ];

        // Definimos y cargamos los datos en el buffer WebGL correspondiente.
        // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
        // Notar también que se usa un array de enteros en lugar de floats.
        this.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        this.cubeVertexIndexBuffer.itemSize = 1;
        this.cubeVertexIndexBuffer.numItems = this.indices.length;

        // Definimos los colores de cada cara en un nuevo array Javascript.
        //var colors = [
        //  [1.0,  1.0,  1.0,  1.0],    // Cara frontal: blanco
        //  [1.0,  0.0,  0.0,  1.0],    // Cara de atrás: rojo
        //  [0.0,  1.0,  0.0,  1.0],    // Cara de arriba: verde
        //  [0.0,  0.0,  1.0,  1.0],    // Cara de abajo: azul
        //];

        var colors = getColor(color);
      
        // Replicamos los colores de cada cara dos veces.
        this.generatedColors = [];
        for (var j=0; j<colors.length; j++) {
          var c = colors[j];
          for (var i=0; i<2; i++) {
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
        mat4.translate(matrix_barraUnoY, matrix_barraUnoY, [0.0, 0.0, 5.0 ]);
        this.barraUnoY.draw(matrix_barraUnoY, gl, shaderProgram);

        var matrix_barraDosY = mat4.create();
        mat4.identity(matrix_barraDosY);
        mat4.translate(matrix_barraDosY, matrix_barraDosY, [0.0, 0.0, -5.0 ]);
        this.barraDosY.draw(matrix_barraDosY, gl, shaderProgram);

        var matrix_barraUnoX = mat4.create();
        mat4.identity(matrix_barraUnoX);
        mat4.translate(matrix_barraUnoX, matrix_barraUnoX, [0.0, -25.0, 5.0 ]);
        this.barraUnoX.draw(matrix_barraUnoX, gl, shaderProgram);

        var matrix_barraDosX = mat4.create();
        mat4.identity(matrix_barraDosX);
        mat4.translate(matrix_barraDosX, matrix_barraDosX, [0.0, -25.0, -5.0 ]);
        this.barraDosX.draw(matrix_barraDosX, gl, shaderProgram);

        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.vertexAttribPointer(gl.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        //gl.drawElements(gl.LINE_LOOP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        /////////////////////////////////
    }
  }