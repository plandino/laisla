function extrusion(forma, camino, escala, tangentes, normales) {
    this.cols = 0;
    this.rows = 0;
    
    this.position_buffer = [];
    this.index_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    this.tangent_buffer = null;
    this.normal_buffer = null;

    this.forma = forma;
    this.camino = camino;
    this.escala = escala;

    this.tangetesCurva = tangentes;
    if (typeof normales === "undefined") console.log("normales INDEFINIDA");    //DEBUG
    this.normalesCurva = normales;

    this.tapa1 = null;
    this.tapa2 = null;

    this._posicion = function(i,j){
        if (i < 0)
            return this._posicion(0,j);
        else if (i >= this.rows)
            return this._posicion(this.rows-1, j);

        var posicion = vec3.create();
        posicion.x = this.position_buffer[3*this.cols*i + j];
        posicion.y = this.position_buffer[3*this.cols*i + j + 1];
        posicion.z = this.position_buffer[3*this.cols*i + j + 2];
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

                this.normal_buffer.push(normalSuperficie.x, normalSuperficie.y, normalSuperficie.z);
            }
        }
    }

    this._createExtrusion = function(forma, camino, escala){
        this.cols = forma.length / 3;
        this.rows = camino.length;

        this.position_buffer = [];

        for (var i = 0; i < this.rows; i++) {
            var traslacion = mat4.create();
            var escalado = mat4.create();
            var modelado = mat4.create();

            mat4.identity(traslacion);
            mat4.translate(traslacion,traslacion, camino[i]);

            mat4.identity(escalado);
            mat4.scale(escalado, escalado, escala[i]);

            mat4.identity(modelado);
            mat4.multiply(modelado, traslacion, escalado);

            for (var j = 0; j < forma.length; j+=3){
                var punto = vec3.fromValues(forma[j], forma[j+1], forma[j+2]);
                // console.log("punto: " + vec3.str(punto));
                var vertice = vec3.create();
                vec3.transformMat4(vertice, punto, modelado);
                this.position_buffer.push(vertice[0], vertice[1], vertice[2]);
            }
        }
    
        this.tangent_buffer = [];
        for (var i = 0; i < this.rows; i++){
            this.tangent_buffer = this.tangent_buffer.concat(this.tangetesCurva);
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


    this._createExtrusion(forma, camino, escala);
    this._createIndexBuffer();  


    this.agregarTapa = function(pasoNro, esSuperior) {
        var centro = [this.camino[pasoNro][0], this.camino[pasoNro][1], this.camino[pasoNro][2]];
        var perimetro = this.position_buffer.slice(3 * this.cols * pasoNro,   3 * this.cols * (pasoNro + 1));

        if (this.tapa1 == null) {
            this.tapa1 = new tapa(centro, perimetro, esSuperior);
        } else {
            this.tapa2 = new tapa(centro, perimetro, esSuperior);
        }
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

        if (this.tapa1) 
            this.tapa1.initBuffers(gl, color);
        if (this.tapa2)
            this.tapa2.initBuffers(gl, color);
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
}
