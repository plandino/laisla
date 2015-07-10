
var t = 0.0;


function drawScene() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Preparamos una matriz de camara(vista).
    mat4.identity(cameraMatrix);
    mat4.identity(camaraAux);

    if(camaraGlobal){
      mat4.lookAt(cameraMatrix, [0.0, 20.0, 150.0 + aumento], [0,0,0], [0,1,0]); 
      mat4.rotateX(cameraMatrix, cameraMatrix, degToRad(rotarCamaraX));
      mat4.rotateY(cameraMatrix, cameraMatrix, degToRad(rotarCamaraY));
    }
    else if(camaraPersona){
      mat4.lookAt(cameraMatrix, [ traslacionPersonaX, 10.0, 10.0 + traslacionPersonaZ], [traslacionPersonaX,10.0, traslacionPersonaZ - 1.0], [0,1,0]);
      mat4.rotateX(camaraAux, camaraAux, degToRad(rotarCamaraX));
      mat4.rotateY(camaraAux, camaraAux, degToRad(rotarCamaraY));
      mat4.multiply(cameraMatrix, camaraAux, cameraMatrix);
    } 
    else if(camaraCabina){
      mat4.lookAt(cameraMatrix, [36.0 + traslacionXCabina, 49.4, trasGruaZ], [1000, 49.4, trasGruaZ], [0,1,0]);
      mat4.rotateX(camaraAux, camaraAux, degToRad(rotarCamaraX));
      mat4.rotateY(camaraAux, camaraAux, degToRad(rotarCamaraY));
      mat4.multiply(cameraMatrix, camaraAux, cameraMatrix);
    }

    var aux = mat4.create();
    mat4.invert(aux, cameraMatrix);
    worldCameraPosition = [ aux[12], aux[13], aux[14] ];  // La posicion de la cámara en coordenadas del mundo

    // Preparamos una matriz de perspectiva.
    if (camaraGlobal) mat4.perspective(perspectiveMatrix, degToRad(80), 640.0/480.0, 0.01, 2000.0);
    else if (camaraPersona) mat4.perspective(perspectiveMatrix, degToRad(60), 640.0/480.0, 0.01, 2000.0); 
    else mat4.perspective(perspectiveMatrix, degToRad(80), 640.0/480.0, 0.01, 2000.0);


    /***** CONTEXTO SIMPLE *****/
    gl.useProgram(shaderProgramSimple);
    gl.uniformMatrix4fv(gl.shaderProgramSimple.perspectiveMatrixUniform, false, perspectiveMatrix);
    gl.uniformMatrix4fv(gl.shaderProgramSimple.viewMatrixUniform, false, cameraMatrix );

    var matrix_grua = mat4.create();
    mat4.identity(matrix_grua);
    mat4.translate(matrix_grua, matrix_grua, [0.0, 0.0, trasGruaZ]);
    gruita.draw(matrix_grua, gl, shaderProgramSimple);

    var matrix_postes = mat4.create();
    mat4.identity(matrix_postes);
    posta.draw(matrix_postes, gl, shaderProgramSimple, shaderProgramReflection, shaderProgramTexturas);


    /***** CONTEXTO TEXTURAS *****/
    gl.useProgram(shaderProgramTexturas);
    gl.uniformMatrix4fv(gl.shaderProgramTexturas.perspectiveMatrixUniform, false, perspectiveMatrix);
    gl.uniformMatrix4fv(gl.shaderProgramTexturas.viewMatrixUniform, false, cameraMatrix );

    setLucesNormal(cameraMatrix, gl, shaderProgramTexturas);

    var matrix_mar = mat4.create();
    mat4.identity(matrix_mar);
    mat4.translate(matrix_mar, matrix_mar, [0.0, -marY, 0.0]);
    mar.drawSoloTextura(matrix_mar, gl, shaderProgramTexturas);

    var matrix_estructPuente = mat4.create();
    mat4.identity(matrix_estructPuente);
    mat4.translate(matrix_estructPuente, matrix_estructPuente, [trasEstructuraPuenteX, trasEstructuraPuenteY, trasEstructuraPuenteZ]);
    estructuraPuenteBarco.drawSoloTextura(matrix_estructPuente, gl, shaderProgramTexturas);

    // Usando la misma matriz subo la cabina de mando del puente del barco
    mat4.translate(matrix_estructPuente, matrix_estructPuente, [0.0, trasCabinaDeMandoBarcoY, 0.0]);
    puenteBarco.drawSoloTextura(matrix_estructPuente, gl, shaderProgramTexturas);

    cielo.draw(mat4.create(), gl, shaderProgramTexturas);


    if (inicio) {
        // Al principio coloco los containers que van en el muelle
        for (var j = 0; j < cantidadContainers * 5 / 6; j++) {
            var matrix_containers = mat4.create();
            mat4.identity(matrix_containers);
            mat4.translate(matrix_containers, matrix_containers, [ - 10.0 + 18.0 * (j % 2), 2.1, ( (j % 5) - 2) * 50.0]);
            posContainersAnterior.push(matrix_containers);
        }

        // Al principio coloco los containers que van en el barco
        for (var j = cantidadContainers * 5 / 6; j < cantidadContainers; j++) {
            var matrix_containers = mat4.create();
            mat4.identity(matrix_containers);
            mat4.translate(matrix_containers, matrix_containers, [ 65.0 + 18.0 * (j % 2), 8.1, ( (j % 5) - 2) * 45.0 - 10.0 ] );
            posContainersAnterior.push(matrix_containers);
        }

        inicio = false;
    } else {
          // Con esto mantengo los containers actualizados con el movimiento de la grua
          for (var j = 0; j < cantidadContainers; j++) {
          matrix_containers = posContainersAnterior[j];
          if (j == containerEnganchado) {
              mat4.identity(matrix_containers);
              mat4.translate(matrix_containers, matrix_containers, [35.0 + traslacionXCabina,  ((1.71 - escaladoPlumaY) * (25.0 / 1) ), trasGruaZ]);
              posContainersAnterior[j] = matrix_containers;
          }
          posContainersAnterior[j] = matrix_containers;
          arrayContainers[j].drawSoloTextura(matrix_containers, gl, shaderProgramTexturas);
          posContainersAnterior[j] = matrix_containers;
        }

    }

    /***** CONTEXTO NORMAL MAP *****/
    gl.useProgram(shaderProgramRelieve);
    gl.uniformMatrix4fv(gl.shaderProgramRelieve.perspectiveMatrixUniform, false, perspectiveMatrix);
    gl.uniformMatrix4fv(gl.shaderProgramRelieve.viewMatrixUniform, false, cameraMatrix );

    setLucesNormal(cameraMatrix, gl, shaderProgramRelieve);

    var matrix_muelle = mat4.create();
    mat4.identity(matrix_muelle);
    mat4.translate(matrix_muelle, matrix_muelle, [-90.0, -8.0, -20.0]);
    muelle.drawSoloTextura(matrix_muelle, gl, shaderProgramRelieve);

    var matrix_islote = mat4.create();
    mat4.identity(matrix_islote);
    mat4.translate(matrix_islote, matrix_islote, [20.0, -8.0, -420.0]);
    mat4.rotateX(matrix_islote, matrix_islote, degToRad(90));
    mat4.scale(matrix_islote, matrix_islote, [4.0, 4.5, 3.5]);
    islote.draw(matrix_islote, gl, shaderProgramRelieve, shaderProgramTexturas);

    /***** CONTEXTO REFLECTION MAP *****/
    gl.useProgram(shaderProgramReflection);
    gl.uniformMatrix4fv(gl.shaderProgramReflection.perspectiveMatrixUniform, false, perspectiveMatrix);
    gl.uniformMatrix4fv(gl.shaderProgramReflection.viewMatrixUniform, false, cameraMatrix );

    gl.uniform3fv(gl.shaderProgramReflection.worldCameraPosition, worldCameraPosition);

    setLucesNormal(cameraMatrix, gl, shaderProgramReflection);

    var matrix_barco = mat4.create();
    mat4.identity(matrix_barco);
    mat4.translate(matrix_barco, matrix_barco, [trasBarcoX, trasBarcoY, trasBarcoZ]);
    mat4.rotateX(matrix_barco, matrix_barco, degToRad(90));
    mat4.scale(matrix_barco, matrix_barco, [escBarcoX, escBarcoY, escBarcoZ]);
    barco.draw(matrix_barco, gl, shaderProgramReflection, shaderProgramTexturas, shaderProgramRelieve);
}

 
  function start() {
    var canvas = document.getElementById("glcanvas");

    // Inicializamos el contexto GL
    gl = initWebGL(canvas);      
    if (!gl)
      return;

     // Compilamos y linkeamos los shaders
    gl.shaderProgramTexturas = initShadersConTexturas();
    if (!gl.shaderProgramTexturas)
      return;

    // Compilamos y linkeamos los shaders
    gl.shaderProgramSimple = initShadersSimple();
    if (!gl.shaderProgramSimple)
      return;

    // Compilamos y linkeamos los shaders
    gl.shaderProgramRelieve = initShadersRelieve();
    if (!gl.shaderProgramRelieve)
      return;

    // Compilamos y linkeamos los shaders
    gl.shaderProgramReflection = initShadersRelefction();
    if (!gl.shaderProgramReflection)
      return;
    
    // Color de fondo para la escena 
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);                              
    gl.depthFunc(gl.LEQUAL); 
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);


    gruita = new grua(1.0, 1.0, 1.0);
    gruita.initBuffers(gl, shaderProgramSimple);
    gruita.asignarShaders(shaderProgramSimple, shaderProgramTexturas, shaderProgramRelieve);

    muelle = new cubo(muelleX, muelleY, muelleZ, false, true, true);
    muelle.initBuffers(gl, null, "gris", coordenadasUVMuelle);
    loadTexture(muelle, muelle.textureImage, "textfinales/concretoPlataforma.jpg");
    loadTexture(muelle, muelle.normalMapTextureImage, "textfinales/concretoPlataformaNomalMap.jpg", true);

    estructuraPuenteBarco = new cubo(estructuraPuenteX, estructuraPuenteY, estructuraPuenteZ, false, true);
    estructuraPuenteBarco.initBuffers(gl, shaderProgramSimple, "gris", coordenadasUVPuenteBarco);
    loadTexture(estructuraPuenteBarco, estructuraPuenteBarco.textureImage, "textfinales/cabinaBarco.jpg");

    puenteBarco = new cubo(cabinaDeMandoX, cabinaDeMandoY, cabinaDeMandoZ, false, true);
    puenteBarco.initBuffers(gl, shaderProgramSimple, "gris", coordenadasUVCabinaBarco);
    loadTexture(puenteBarco, puenteBarco.textureImage, "textfinales/cabinaBarco.jpg");

    mar = new cubo(marX, marY, marZ, false, true);
    mar.initBuffers(gl, shaderProgramSimple, "blue", coordenadasUVMar);
    loadTexture(mar, mar.textureImage, "textfinales/sea-map.jpg");

    for(var i = 0; i < cantidadContainers; i++){
      var container = new cubo(containersX, containersY, containersZ, false, true);
      container.initBuffers(gl, shaderProgramSimple, "purple", coordenadasUVContainer);
      if(i < 4) {
        loadTexture(container, container.textureImage, "textfinales/container_difusemapnaranja.jpg");
      } else if(i < 8){
        loadTexture(container, container.textureImage, "textfinales/container_difusemaprojo.jpg");
      } else if(i < 12){
        loadTexture(container, container.textureImage, "textfinales/container_difusemapceleste.jpg");
      } else if(i < 16){
        loadTexture(container, container.textureImage, "textfinales/container_difusemapverde.jpg");
      } else {
        loadTexture(container, container.textureImage, "textfinales/container_difusemapazul.jpg");
      } 
      arrayContainers.push(container);
    }

    barco = new barco(1.0, 1.0, 1.0);
    barco.initBuffers(gl, shaderProgramSimple, "red");

    islote = new islote();
    islote.initBuffers(gl, shaderProgramSimple, "brown");

    posta = new postes();
    posta.initBuffers(gl, shaderProgramSimple);

    cielo = new cielo();
    cielo.initBuffers(gl, shaderProgramTexturas, "purple");


    setInterval(drawScene, 10);
  }