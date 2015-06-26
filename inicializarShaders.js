
// SHADERS FUNCTION
function getShader(gl, id) {
    var shaderScript, src, currentChild, shader;

    // Obtenemos el elemento <script> que contiene el código fuente del shader.
    shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    // Extraemos el contenido de texto del <script>.
    src = "";
    currentChild = shaderScript.firstChild;
    while(currentChild) {
      if (currentChild.nodeType == currentChild.TEXT_NODE) {
        src += currentChild.textContent;
      }
      
      currentChild = currentChild.nextSibling;
    }

    // Creamos un shader WebGL según el atributo type del <script>.
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    // Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
    gl.shaderSource(shader, src);

    // Compilamos el shader.
    gl.compileShader(shader);  
      
    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("An error occurred compiling the shaders: " + 
            gl.getShaderInfoLog(shader));  
      return null;  
    }

    return shader;
}


function initShadersSimple() {
    // Obtenemos los shaders ya compilados
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Creamos un programa de shaders de WebGL.
    shaderProgramSimple = gl.createProgram();

    // Asociamos cada shader compilado al programa.
    gl.attachShader(shaderProgramSimple, vertexShader);
    gl.attachShader(shaderProgramSimple, fragmentShader);

    // Linkeamos los shaders para generar el programa ejecutable.
    gl.linkProgram(shaderProgramSimple);

    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getProgramParameter(shaderProgramSimple, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + 
            gl.getProgramInfoLog(shaderProgramSimple));
      return null;
    }

    // Le decimos a WebGL que de aquí en adelante use el programa generado.
    gl.useProgram(shaderProgramSimple);

    // Tomamos referencias Javascript para acceder a las variables propias 
    // del shader.
    shaderProgramSimple.vertexPositionAttribute = gl.getAttribLocation(shaderProgramSimple, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramSimple.vertexPositionAttribute);

    shaderProgramSimple.vertexColorAttribute = gl.getAttribLocation(shaderProgramSimple, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgramSimple.vertexColorAttribute);

    // Con esto accedo a las matrices uniformes del shader
    shaderProgramSimple.perspectiveMatrixUniform  = gl.getUniformLocation(shaderProgramSimple, "uPerspectiveMatrix");
    shaderProgramSimple.viewMatrixUniform         = gl.getUniformLocation(shaderProgramSimple, "uViewMatrix");
    shaderProgramSimple.modelMatrixUniform        = gl.getUniformLocation(shaderProgramSimple, "uModelMatrix");

    return shaderProgramSimple;
}


function initShadersConTexturas() {
    // Obtenemos los shaders ya compilados
    var fragmentShaderText = getShader(gl, "shadertexturas-fs");
    var vertexShaderText = getShader(gl, "shadertexturas-vs");

    // Creamos un programa de shaders de WebGL.
    shaderProgramTexturas = gl.createProgram();

    // Asociamos cada shader compilado al programa.
    gl.attachShader(shaderProgramTexturas, vertexShaderText);
    gl.attachShader(shaderProgramTexturas, fragmentShaderText);

    // Linkeamos los shaders para generar el programa ejecutable.
    gl.linkProgram(shaderProgramTexturas);

    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getProgramParameter(shaderProgramTexturas, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + 
            gl.getProgramInfoLog(shaderProgramTexturas));
      return null;
    }

    // Le decimos a WebGL que de aquí en adelante use el programa generado.
    gl.useProgram(shaderProgramTexturas);

    // Tomamos referencias Javascript para acceder a las variables propias 
    // del shader.
    shaderProgramTexturas.vertexPositionAttribute = gl.getAttribLocation(shaderProgramTexturas, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramTexturas.vertexPositionAttribute);
    shaderProgramTexturas.textureCoordAttribute = gl.getAttribLocation(shaderProgramTexturas, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramTexturas.textureCoordAttribute);

    shaderProgramTexturas.vertexNormalAttribute = gl.getAttribLocation(shaderProgramTexturas, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgramTexturas.vertexNormalAttribute);

    // Con esto accedo a las matrices uniformes del shader
    shaderProgramTexturas.perspectiveMatrixUniform  = gl.getUniformLocation(shaderProgramTexturas, "uPerspectiveMatrix");
    shaderProgramTexturas.viewMatrixUniform         = gl.getUniformLocation(shaderProgramTexturas, "uViewMatrix");
    shaderProgramTexturas.modelMatrixUniform        = gl.getUniformLocation(shaderProgramTexturas, "uModelMatrix");
    shaderProgramTexturas.texMatrixUniform          = gl.getUniformLocation(shaderProgramTexturas, "uTextureMatrix");

    shaderProgramTexturas.samplerUniform            = gl.getUniformLocation(shaderProgramTexturas, "uSampler");

    // Se hizo la luz!!!

    shaderProgramTexturas.useLightingUniform = gl.getUniformLocation(shaderProgramTexturas, "uUseLighting");
    shaderProgramTexturas.ambientColorUniform = gl.getUniformLocation(shaderProgramTexturas, "uAmbientColor");
    shaderProgramTexturas.lightingDirectionUniform = gl.getUniformLocation(shaderProgramTexturas, "uLightPosition");
    shaderProgramTexturas.directionalColorUniform = gl.getUniformLocation(shaderProgramTexturas, "uDirectionalColor");
    
    shaderProgramTexturas.normalMatrixUniform = gl.getUniformLocation(shaderProgramTexturas, "uNormalMatrix");

    return shaderProgramTexturas;
}