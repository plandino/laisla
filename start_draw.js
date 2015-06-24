// DRAW 
var t = 0.0;
function drawScene() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Preparamos una matriz de camara(vista).
  mat4.identity(cameraMatrix);
  mat4.identity(camaraAux);

  if(camaraGlobal){
    mat4.lookAt(cameraMatrix, [0.0, 20.0, 150.0 + aumento], [0,0,0], [0,1,0]); // This is the key line
    mat4.rotateX(cameraMatrix, cameraMatrix, degToRad(rotarCamaraX));
    mat4.rotateY(cameraMatrix, cameraMatrix, degToRad(rotarCamaraY));
  }

  if(camaraPersona){
    mat4.lookAt(cameraMatrix, [ traslacionPersonaX, 10.0, 10.0 + traslacionPersonaZ], [traslacionPersonaX,10.0, traslacionPersonaZ - 1.0], [0,1,0]);
    mat4.rotateX(camaraAux, camaraAux, degToRad(rotarCamaraX));
    mat4.rotateY(camaraAux, camaraAux, degToRad(rotarCamaraY));
    mat4.multiply(cameraMatrix, camaraAux, cameraMatrix);
  } 

  if(camaraCabina){

    mat4.lookAt(cameraMatrix, [36.5 + traslacionXCabina, 51.4, trasGruaZ], [1000, 51.4, trasGruaZ], [0,1,0]);
    mat4.rotateX(camaraAux, camaraAux, degToRad(rotarCamaraX));
    mat4.rotateY(camaraAux, camaraAux, degToRad(rotarCamaraY));
    mat4.multiply(cameraMatrix, camaraAux, cameraMatrix);
  }


  // Preparamos una matriz de perspectiva.
  mat4.perspective(perspectiveMatrix, degToRad(88), 640.0/480.0, 0.01, 2000.0);

  /***** CONTEXTO SIMPLE *****/
  gl.useProgram(shaderProgramSimple);
  gl.uniformMatrix4fv(gl.shaderProgramSimple.perspectiveMatrixUniform, false, perspectiveMatrix);
  gl.uniformMatrix4fv(gl.shaderProgramSimple.viewMatrixUniform, false, cameraMatrix );

  var matrix_muelle = mat4.create();
  mat4.identity(matrix_muelle);
  mat4.translate(matrix_muelle, matrix_muelle, [-90.0, -8.0, -20.0]);
  muelle.draw(matrix_muelle, gl, shaderProgramSimple);

  var matrix_grua = mat4.create();
  mat4.identity(matrix_grua);
  mat4.translate(matrix_grua, matrix_grua, [0.0, 0.0, trasGruaZ]);
  gruita.draw(matrix_grua, gl, shaderProgramSimple);

  var matrix_estructPuente = mat4.create();
  mat4.identity(matrix_estructPuente);
  mat4.translate(matrix_estructPuente, matrix_estructPuente, [trasEstructuraPuenteX, trasEstructuraPuenteY, trasEstructuraPuenteZ]);
  estructuraPuenteBarco.draw(matrix_estructPuente, gl, shaderProgramSimple);

  // Usando la misma matriz subo la cabina de mando del puente del barco
  mat4.translate(matrix_estructPuente, matrix_estructPuente, [0.0, trasCabinaDeMandoBarcoY, 0.0]);
  puenteBarco.draw(matrix_estructPuente, gl, shaderProgramSimple);

  var matrix_barco = mat4.create();
  mat4.identity(matrix_barco);
  mat4.translate(matrix_barco, matrix_barco, [trasBarcoX, trasBarcoY, trasBarcoZ]);
  mat4.rotateX(matrix_barco, matrix_barco, degToRad(90));
  mat4.scale(matrix_barco, matrix_barco, [escBarcoX, escBarcoY, escBarcoZ]);
  barco.draw(matrix_barco, gl, shaderProgramSimple);

  var matrix_islote = mat4.create();
  mat4.identity(matrix_islote);
  mat4.translate(matrix_islote, matrix_islote, [20.0, -8.0, -400.0]);
  mat4.rotateX(matrix_islote, matrix_islote, degToRad(90));
  mat4.scale(matrix_islote, matrix_islote, [4.0, 3.0, 3.0]);
  islote.draw(matrix_islote, gl, shaderProgramSimple);

  var matrix_postes = mat4.create();
  mat4.identity(matrix_postes);
  posta.draw(matrix_postes, gl, shaderProgramSimple);


  /***** CONTEXTO TEXTURAS *****/

  gl.useProgram(shaderProgramTexturas);
  gl.uniformMatrix4fv(gl.shaderProgramTexturas.perspectiveMatrixUniform, false, perspectiveMatrix);
  gl.uniformMatrix4fv(gl.shaderProgramTexturas.viewMatrixUniform, false, cameraMatrix );

  setLuces(cameraMatrix, gl, shaderProgramTexturas);

  var matrix_mar = mat4.create();
  mat4.identity(matrix_mar);
  mat4.translate(matrix_mar, matrix_mar, [0.0, -10.0, 0.0]);
  mar.draw(matrix_mar, gl, shaderProgramTexturas);


  if (inicio){
      for(var j = 0; j < cantidadContainers * 5 / 6; j++){
        var matrix_containers = mat4.create();
        mat4.identity(matrix_containers);
        mat4.translate(matrix_containers, matrix_containers, [ - 10.0 + 18.0 * (j % 2), 2.0, ( (j % 5) - 2) * 50.0]);
        // mat4.translate(matrix_containers, matrix_containers, [ 15.0 * j , 0.0,  50.0]);
        posContainersAnterior.push(matrix_containers);
      }

      for(var j = cantidadContainers * 5 / 6; j < cantidadContainers; j++){
        var matrix_containers = mat4.create();
        mat4.identity(matrix_containers);
        mat4.translate(matrix_containers, matrix_containers, [ 65.0 + 18.0 * (j % 2), 8.1, ( (j % 5) - 2) * 45.0 - 10.0 ] );
        // mat4.translate(matrix_containers, matrix_containers, [ 15.0 * j , 0.0,  50.0]);
        posContainersAnterior.push(matrix_containers);
      }

      inicio = false;
  } else {
        for(var j = 0; j < cantidadContainers; j++){
        matrix_containers = posContainersAnterior[j];
        if(j == containerEnganchado){
          mat4.identity(matrix_containers);
          mat4.translate(matrix_containers, matrix_containers, [35.0 + traslacionXCabina,  ((1.71 - escaladoPlumaY) * (25.0 / 1) ), trasGruaZ]);
          posContainersAnterior[j] = matrix_containers;
        }
        posContainersAnterior[j] = matrix_containers;
        arrayContainers[j].draw(matrix_containers, gl, shaderProgramTexturas);
        posContainersAnterior[j] = matrix_containers;
      }

  }

  /* Avanza el tiempo */
  t = t + 0.01;
}

  // INIT
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
    
    // Color de fondo para la escena 
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);                              
    gl.depthFunc(gl.LEQUAL); 
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);


    gruita = new grua(1.0, 1.0, 1.0);
    gruita.initBuffers(gl, shaderProgramSimple);

    muelle = new cubo(muelleX, muelleY, muelleZ, false);
    muelle.initBuffers(gl, null, "gris");
    loadTexture(muelle, muelle.textureImage, "uvgrid.jpg");


    estructuraPuenteBarco = new cubo(estructuraPuenteX, estructuraPuenteY, estructuraPuenteZ);
    estructuraPuenteBarco.initBuffers(gl, shaderProgramSimple, "gris");

    puenteBarco = new cubo(cabinaDeMandoX, cabinaDeMandoY, cabinaDeMandoZ);
    puenteBarco.initBuffers(gl, shaderProgramSimple, "gris");

    mar = new cubo(marX, marY, marZ, false, true);
    mar.initBuffers(gl, shaderProgramSimple, "blue");
    loadTexture(mar, mar.textureImage, "texturas/sea-map.jpg");

    for(var i = 0; i < cantidadContainers; i++){
      var container = new cubo(containersX, containersY, containersZ, false, true);
      container.initBuffers(gl, shaderProgramSimple, "purple");
      loadTexture(container, container.textureImage, "uvgrid.jpg");
      arrayContainers.push(container);
    }

    barco = new barco(1.0, 1.0, 1.0);
    barco.initBuffers(gl, shaderProgramSimple, "red");

    islote = new islote();
    islote.initBuffers(gl, shaderProgramSimple, "brown");

    posta = new postes();
    posta.initBuffers(gl, shaderProgramSimple);


    setInterval(drawScene, 10);
  }