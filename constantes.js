  // Tamaño del muelle
  var muelleX       = 250.0;
  var muelleY       =  10.0;
  var muelleZ       = 650.0;

  // Tamaño de los containers
  var containersX = 10.0;
  var containersY = 10.0;
  var containersZ = 40.0;

  // Tamaño del contrapeso de la pluma
  var contrapesoX = 30.0;
  var contrapesoY = 20.0;
  var contrapesoZ = 30.0;

  // Tamaño de la grua
  var gruaX = 50.0;
  var gruaY = 60.0;
  var gruaZ = 50.0;

  // Escalado del barco
  var escBarcoX = 0.7;
  var escBarcoY = 0.7;
  var escBarcoZ = 0.7;

  // Tamaño del mar
  var marX = 1500.0;
  var marY = 20.0;
  var marZ = 1500.0;

  // Tamaño del cielo
  var escCielo = Math.min(marX, marZ);  // Debería ser igual al mínimos de marX y marZ
  var cantidadDeMeridianos = 40;
  var cantidadDeParalelos = 40;

  // Tamaño del puente del barco
  var estructuraPuenteX = 50.0;
  var estructuraPuenteY = 25.0;
  var estructuraPuenteZ = 15.0;

  var cabinaDeMandoX = 80.0;
  var cabinaDeMandoY = 10.0;
  var cabinaDeMandoZ = 15.0;

  // Traslaciones del muelle
  var trasMuelleX = 0.0;
  var trasMuelleY = 0.0;
  var trasMuelleZ = 0.0;

  // Traslaciones del barco
  var trasBarcoX = 80.0;
  var trasBarcoY = 10.0;
  var trasBarcoZ = 0.0;

  // Traslaciones de la grua
  var trasGruaX = 0.0;
  var trasGruaY = 0.0;
  var trasGruaZ = 0.0;

  // Traslaciones de la cabina de la grua
  var trasCabinaX    = 0.0;
  var escaladoPlumaY = 0.0;

  // Traslaciones de la estructura del puente del barco
  var trasEstructuraPuenteX = 80.0;
  var trasEstructuraPuenteY = 15.0;
  var trasEstructuraPuenteZ = -80.0;

  // La elevacion de la cabina de mando por sobre la estructura del puente del barco
  var trasCabinaDeMandoBarcoY = 17.5;

  // Largo de la pluma
  var largoPlumaX = 130.0;


  // Posicion Lamparas
    //faroles
    var lamparasX = 28.0;
    var lamparasY = 20.0;
    var lamparaZ1 = -90.0;
    var lamparaZ2 = 130.0;

    //grua
    var lamparaGruaX = 93.0;
    var lamparaGruaY = 49.0;
    var lamparaGruaZ = 0.0;

    //sol
    var t = 0.9;
    var solX = escCielo*Math.cos(t * Math.PI);
    var solY = escCielo/8;
    var solZ = escCielo*Math.sin(t * Math.PI);


  // ILUMINACION
    var KA = 0.15;
    var KD = 0.4;
    var S = 1.0;