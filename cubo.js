function cubo(ancho, alto, profundo){
    // Estos son los arrays donde defino los valores        
    this.vertices           = null;
    this.indices            = null;
    this.generatedColors    = null;

    // Estos son los buffers que voy a bindear para mandar a los shaders
    this.cubeVertexBuffer       = null;
    this.cubeVertexIndexBuffer  = null;
    this.cubeVertexColorBuffer  = null;

    // Inicio los valores, para los vertices(posicion, color) e indices
    // Luego los bindeo con los buffers
    this.initBuffers = function(gl, shaderProgram, color){

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




// function getColor(color){
//     if(color == "red"){
//         var colors = [
//             [1.0,  0.0,  0.0,  1.0],    
//             [1.0,  0.0,  0.0,  1.0],    
//             [1.0,  0.0,  0.0,  1.0],    
//             [1.0,  0.0,  0.0,  1.0],    
//         ];
//         return colors;
//     }

//     if(color == "green"){
//         var colors = [
//             [0.0,  1.0,  0.0,  1.0],    
//             [0.0,  1.0,  0.0,  1.0],    
//             [0.0,  1.0,  0.0,  1.0],    
//             [0.0,  1.0,  0.0,  1.0],    
//         ];
//         return colors;
//     }

//     if(color == "blue"){
//         var colors = [
//             [0.0,  0.0,  1.0,  1.0],    
//             [0.0,  0.0,  1.0,  1.0],    
//             [0.0,  0.0,  1.0,  1.0],    
//             [0.0,  0.0,  1.0,  1.0],    
//         ];
//         return colors;
//     }

//     if(color == "yellow"){
//         var colors = [
//             [1.0,  1.0,  0.0,  1.0],   
//             [1.0,  1.0,  0.0,  1.0],   
//             [1.0,  1.0,  0.0,  1.0],   
//             [1.0,  1.0,  0.0,  1.0],    
//         ];
//         return colors;
//     }

//     if(color == "purple"){
//         var colors = [
//             [0.5,  0.0,  0.5,  1.0],    
//             [0.5,  0.0,  0.5,  1.0],    
//             [0.5,  0.0,  0.5,  1.0],    
//             [0.5,  0.0,  0.5,  1.0],    
//         ];
//         return colors;
//     }

//     if(color == "orange"){
//         var colors = [
//             [1.0,  0.35,  0.0,  1.0],    
//             [1.0,  0.35,  0.0,  1.0],    
//             [1.0,  0.35,  0.0,  1.0],    
//             [1.0,  0.35,  0.0,  1.0],    
//         ];
//         return colors;
//     } else {
//         // Este es el color flashero con vertices de colores diferentes
//         var colors = [
//           [1.0,  1.0,  1.0,  1.0],    // Cara frontal: blanco
//           [1.0,  0.0,  0.0,  1.0],    // Cara de atrás: rojo
//           [0.0,  1.0,  0.0,  1.0],    // Cara de arriba: verde
//           [0.0,  0.0,  1.0,  1.0],    // Cara de abajo: azul
//         ];
//         return colors;
//     }
// }