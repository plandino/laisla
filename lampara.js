function lampara(latitude_bands, longitude_bands){

        this.latitudeBands      = latitude_bands;
        this.longitudeBands     = longitude_bands;
        
        this.vertices           = null;
        this.normales           = null;
        this.indices            = null;
        this.generatedColors    = null;

        this.spherePositionBuffer   = null;
        this.sphereNormalBuffer     = null;
        this.sphereIndexBuffer      = null;
        this.sphereColorsBuffer     = null;
        

        this.initBuffers = function(gl, color){

            this.vertices = [];
            this.normales = [];

            var latNumber;
            var longNumber;

            for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
                var theta = latNumber * Math.PI / this.latitudeBands;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

                for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
                    var phi = longNumber * 2 * Math.PI / this.longitudeBands;
                    var sinPhi = Math.sin(phi);
                    var cosPhi = Math.cos(phi);

                    var x = 2 * cosPhi * sinTheta;
                    var y = 2 * cosTheta;
                    var z = 2 * sinPhi * sinTheta;

                    this.normales.push(x);
                    this.normales.push(y);
                    this.normales.push(z);
                    
                    this.vertices.push(x);
                    this.vertices.push(y);
                    this.vertices.push(z);
                }
            }

            this.indices = [];
          
            for (latNumber=0; latNumber < this.latitudeBands; latNumber++) {
                for (longNumber=0; longNumber < this.longitudeBands; longNumber++) {
                    var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                    var second = first + this.longitudeBands + 1;
                    this.indices.push(first);
                    this.indices.push(second);
                    this.indices.push(first + 1);

                    this.indices.push(second);
                    this.indices.push(second + 1);
                    this.indices.push(first + 1);
                }
            }

            this.sphereNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normales), gl.STATIC_DRAW);
            this.sphereNormalBuffer.itemSize = 3;
            this.sphereNormalBuffer.numItems = this.normales.length / 3;

            this.spherePositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.spherePositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            this.spherePositionBuffer.itemSize = 3;
            this.spherePositionBuffer.numItems = this.vertices.length / 3;

            this.sphereIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphereIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            this.sphereIndexBuffer.itemSize = 1;
            this.sphereIndexBuffer.numItems = this.indices.length;


            var colors = getColor(color);
            this.generatedColors = [];
            for (var j=0; j<colors.length; j++) {
              var c = colors[j];
              for (var i=0; i<this.latitudeBands*10; i++) {
                this.generatedColors = this.generatedColors.concat(c);
              }
            }

            this.sphereColorsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereColorsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.generatedColors), gl.STATIC_DRAW);
            this.sphereColorsBuffer.itemSize = 4;
            this.sphereColorsBuffer.numItems = this.generatedColors.length / 4;  

        }

        this.draw = function(modelMatrix, gl, shaderProgram){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.spherePositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.spherePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereColorsBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.sphereColorsBuffer.itemSize, gl.FLOAT, false, 0, 0);  

            gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphereIndexBuffer);

            gl.drawElements(gl.TRIANGLES, this.sphereIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        
    }
