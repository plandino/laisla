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
    var fragmentShaderText = getShader(gl, "shadertexturas-fs");
    var vertexShaderText = getShader(gl, "shadertexturas-vs");

    shaderProgramTexturas = gl.createProgram();

    gl.attachShader(shaderProgramTexturas, vertexShaderText);
    gl.attachShader(shaderProgramTexturas, fragmentShaderText);

    gl.linkProgram(shaderProgramTexturas);

    if (!gl.getProgramParameter(shaderProgramTexturas, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + 
            gl.getProgramInfoLog(shaderProgramTexturas));
      return null;
    }

    gl.useProgram(shaderProgramTexturas);

    shaderProgramTexturas.vertexPositionAttribute = gl.getAttribLocation(shaderProgramTexturas, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramTexturas.vertexPositionAttribute);
    shaderProgramTexturas.textureCoordAttribute = gl.getAttribLocation(shaderProgramTexturas, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramTexturas.textureCoordAttribute);

    shaderProgramTexturas.vertexNormalAttribute = gl.getAttribLocation(shaderProgramTexturas, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgramTexturas.vertexNormalAttribute);

    shaderProgramTexturas.perspectiveMatrixUniform  = gl.getUniformLocation(shaderProgramTexturas, "uPerspectiveMatrix");
    shaderProgramTexturas.viewMatrixUniform         = gl.getUniformLocation(shaderProgramTexturas, "uViewMatrix");
    shaderProgramTexturas.modelMatrixUniform        = gl.getUniformLocation(shaderProgramTexturas, "uModelMatrix");
    shaderProgramTexturas.texMatrixUniform          = gl.getUniformLocation(shaderProgramTexturas, "uTextureMatrix");

    shaderProgramTexturas.samplerUniform            = gl.getUniformLocation(shaderProgramTexturas, "uSampler");
    
    shaderProgramTexturas.normalMatrixUniform   = gl.getUniformLocation(shaderProgramTexturas, "umNormalMatrix");
    shaderProgramTexturas.MVnormalMatrixUniform = gl.getUniformLocation(shaderProgramTexturas, "umvNormalMatrix");
   
    shaderProgramTexturas.solPositionUniform     = gl.getUniformLocation(shaderProgramTexturas, "uSol.position");
    shaderProgramTexturas.solIntensityUniform    = gl.getUniformLocation(shaderProgramTexturas, "uSol.intensity");
    shaderProgramTexturas.solPersistanceUniform  = gl.getUniformLocation(shaderProgramTexturas, "uSol.persistance");
    
    shaderProgramTexturas.farolAPositionUniform     = gl.getUniformLocation(shaderProgramTexturas, "uFarolA.position");
    shaderProgramTexturas.farolAIntensityUniform    = gl.getUniformLocation(shaderProgramTexturas, "uFarolA.intensity");
    shaderProgramTexturas.farolAPersistanceUniform  = gl.getUniformLocation(shaderProgramTexturas, "uFarolA.persistance");

    shaderProgramTexturas.farolBPositionUniform     = gl.getUniformLocation(shaderProgramTexturas, "uFarolB.position");
    shaderProgramTexturas.farolBIntensityUniform    = gl.getUniformLocation(shaderProgramTexturas, "uFarolB.intensity");
    shaderProgramTexturas.farolBPersistanceUniform  = gl.getUniformLocation(shaderProgramTexturas, "uFarolB.persistance");

    shaderProgramTexturas.farolGruaPositionUniform     = gl.getUniformLocation(shaderProgramTexturas, "uFarolGrua.position");
    shaderProgramTexturas.farolGruaIntensityUniform    = gl.getUniformLocation(shaderProgramTexturas, "uFarolGrua.intensity");
    shaderProgramTexturas.farolGruaPersistanceUniform  = gl.getUniformLocation(shaderProgramTexturas, "uFarolGrua.persistance");

    shaderProgramTexturas.ka = gl.getUniformLocation(shaderProgramTexturas, "ka");
    shaderProgramTexturas.kd = gl.getUniformLocation(shaderProgramTexturas, "kd");
    shaderProgramTexturas.ks = gl.getUniformLocation(shaderProgramTexturas, "ks");
    shaderProgramTexturas.shininess = gl.getUniformLocation(shaderProgramTexturas, "shininess");

    return shaderProgramTexturas;
}

function initShadersRelieve() {
    var fragmentShader = getShader(gl, "shaderrelieve-fs");
    var vertexShader = getShader(gl, "shaderrelieve-vs");

    shaderProgramRelieve = gl.createProgram();

    gl.attachShader(shaderProgramRelieve, vertexShader);
    gl.attachShader(shaderProgramRelieve, fragmentShader);

    gl.linkProgram(shaderProgramRelieve);

    if (!gl.getProgramParameter(shaderProgramRelieve, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + 
            gl.getProgramInfoLog(shaderProgramRelieve));
      return null;
    }

    gl.useProgram(shaderProgramRelieve);

    shaderProgramRelieve.vertexPositionAttribute = gl.getAttribLocation(shaderProgramRelieve, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramRelieve.vertexPositionAttribute);
    shaderProgramRelieve.textureCoordAttribute = gl.getAttribLocation(shaderProgramRelieve, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramRelieve.textureCoordAttribute);

    shaderProgramRelieve.vertexNormalAttribute = gl.getAttribLocation(shaderProgramRelieve, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgramRelieve.vertexNormalAttribute);

    shaderProgramRelieve.vertexTangentAttribute = gl.getAttribLocation(shaderProgramRelieve, "aVertexTangent");
    gl.enableVertexAttribArray(shaderProgramRelieve.vertexTangentAttribute);

    shaderProgramRelieve.perspectiveMatrixUniform  = gl.getUniformLocation(shaderProgramRelieve, "uPerspectiveMatrix");
    shaderProgramRelieve.viewMatrixUniform         = gl.getUniformLocation(shaderProgramRelieve, "uViewMatrix");
    shaderProgramRelieve.modelMatrixUniform        = gl.getUniformLocation(shaderProgramRelieve, "uModelMatrix");
    shaderProgramRelieve.texMatrixUniform          = gl.getUniformLocation(shaderProgramRelieve, "uTextureMatrix");

    shaderProgramRelieve.samplerUniformNormalMap   = gl.getUniformLocation(shaderProgramRelieve, "uSamplerNormalMap");

    shaderProgramRelieve.samplerUniform            = gl.getUniformLocation(shaderProgramRelieve, "uSampler");

    shaderProgramRelieve.normalMatrixUniform = gl.getUniformLocation(shaderProgramRelieve, "umNormalMatrix");
    shaderProgramRelieve.MVnormalMatrixUniform = gl.getUniformLocation(shaderProgramRelieve, "umvNormalMatrix");
   
    shaderProgramRelieve.solPositionUniform     = gl.getUniformLocation(shaderProgramRelieve, "uSol.position");
    shaderProgramRelieve.solIntensityUniform    = gl.getUniformLocation(shaderProgramRelieve, "uSol.intensity");
    shaderProgramRelieve.solPersistanceUniform    = gl.getUniformLocation(shaderProgramRelieve, "uSol.persistance");
    
    shaderProgramRelieve.farolAPositionUniform     = gl.getUniformLocation(shaderProgramRelieve, "uFarolA.position");
    shaderProgramRelieve.farolAIntensityUniform    = gl.getUniformLocation(shaderProgramRelieve, "uFarolA.intensity");
    shaderProgramRelieve.farolAPersistanceUniform    = gl.getUniformLocation(shaderProgramRelieve, "uFarolA.persistance");

    shaderProgramRelieve.farolBPositionUniform     = gl.getUniformLocation(shaderProgramRelieve, "uFarolB.position");
    shaderProgramRelieve.farolBIntensityUniform    = gl.getUniformLocation(shaderProgramRelieve, "uFarolB.intensity");
    shaderProgramRelieve.farolBPersistanceUniform    = gl.getUniformLocation(shaderProgramRelieve, "uFarolB.persistance");

    shaderProgramRelieve.farolGruaPositionUniform     = gl.getUniformLocation(shaderProgramRelieve, "uFarolGrua.position");
    shaderProgramRelieve.farolGruaIntensityUniform    = gl.getUniformLocation(shaderProgramRelieve, "uFarolGrua.intensity");
    shaderProgramRelieve.farolGruaPersistanceUniform    = gl.getUniformLocation(shaderProgramRelieve, "uFarolGrua.persistance");

    shaderProgramRelieve.ka = gl.getUniformLocation(shaderProgramRelieve, "ka");
    shaderProgramRelieve.kd = gl.getUniformLocation(shaderProgramRelieve, "kd");
    shaderProgramRelieve.ks = gl.getUniformLocation(shaderProgramRelieve, "ks");
    shaderProgramRelieve.shininess = gl.getUniformLocation(shaderProgramRelieve, "shininess");

    return shaderProgramRelieve;
}

function initShadersRelefction() {
    var fragmentShader = getShader(gl, "shaderreflection-fs");
    var vertexShader = getShader(gl, "shaderreflection-vs");

    shaderProgramReflection = gl.createProgram();

    gl.attachShader(shaderProgramReflection, vertexShader);
    gl.attachShader(shaderProgramReflection, fragmentShader);

    gl.linkProgram(shaderProgramReflection);

    if (!gl.getProgramParameter(shaderProgramReflection, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + 
            gl.getProgramInfoLog(shaderProgramReflection));
      return null;
    }

    gl.useProgram(shaderProgramReflection);

    shaderProgramReflection.vertexPositionAttribute = gl.getAttribLocation(shaderProgramReflection, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramReflection.vertexPositionAttribute);
    shaderProgramReflection.textureCoordAttribute = gl.getAttribLocation(shaderProgramReflection, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramReflection.textureCoordAttribute);

    shaderProgramReflection.vertexNormalAttribute = gl.getAttribLocation(shaderProgramReflection, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgramReflection.vertexNormalAttribute);

    shaderProgramReflection.perspectiveMatrixUniform  = gl.getUniformLocation(shaderProgramReflection, "uPerspectiveMatrix");
    shaderProgramReflection.viewMatrixUniform         = gl.getUniformLocation(shaderProgramReflection, "uViewMatrix");
    shaderProgramReflection.modelMatrixUniform        = gl.getUniformLocation(shaderProgramReflection, "uModelMatrix");
    shaderProgramReflection.texMatrixUniform          = gl.getUniformLocation(shaderProgramReflection, "uTextureMatrix");

    shaderProgramReflection.samplerUniformReflectionMap   = gl.getUniformLocation(shaderProgramReflection, "uSamplerReflectionMap");

    shaderProgramReflection.samplerUniformTextureMap            = gl.getUniformLocation(shaderProgramReflection, "uSampler");

    shaderProgramReflection.normalMatrixUniform = gl.getUniformLocation(shaderProgramReflection, "umNormalMatrix");
    shaderProgramReflection.MVnormalMatrixUniform = gl.getUniformLocation(shaderProgramReflection, "umvNormalMatrix");
   
    shaderProgramReflection.solPositionUniform     = gl.getUniformLocation(shaderProgramReflection, "uSol.position");
    shaderProgramReflection.solIntensityUniform    = gl.getUniformLocation(shaderProgramReflection, "uSol.intensity");
    shaderProgramReflection.solPersistanceUniform  = gl.getUniformLocation(shaderProgramReflection, "uSol.persistance");
    
    shaderProgramReflection.farolAPositionUniform     = gl.getUniformLocation(shaderProgramReflection, "uFarolA.position");
    shaderProgramReflection.farolAIntensityUniform    = gl.getUniformLocation(shaderProgramReflection, "uFarolA.intensity");
    shaderProgramReflection.farolAPersistanceUniform  = gl.getUniformLocation(shaderProgramReflection, "uFarolA.persistance");

    shaderProgramReflection.farolBPositionUniform     = gl.getUniformLocation(shaderProgramReflection, "uFarolB.position");
    shaderProgramReflection.farolBIntensityUniform    = gl.getUniformLocation(shaderProgramReflection, "uFarolB.intensity");
    shaderProgramReflection.farolBPersistanceUniform  = gl.getUniformLocation(shaderProgramReflection, "uFarolB.persistance");

    shaderProgramReflection.farolGruaPositionUniform     = gl.getUniformLocation(shaderProgramReflection, "uFarolGrua.position");
    shaderProgramReflection.farolGruaIntensityUniform    = gl.getUniformLocation(shaderProgramReflection, "uFarolGrua.intensity");
    shaderProgramReflection.farolGruaPersistanceUniform  = gl.getUniformLocation(shaderProgramReflection, "uFarolGrua.persistance");

    shaderProgramReflection.ka = gl.getUniformLocation(shaderProgramReflection, "ka");
    shaderProgramReflection.kd = gl.getUniformLocation(shaderProgramReflection, "kd");
    shaderProgramReflection.ks = gl.getUniformLocation(shaderProgramReflection, "ks");
    shaderProgramReflection.shininess = gl.getUniformLocation(shaderProgramReflection, "shininess");

    shaderProgramReflection.worldCameraPosition = gl.getUniformLocation(shaderProgramReflection, "worldCameraPosition");

    return shaderProgramReflection;
}