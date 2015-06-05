    onkeydown = function(evento){
        evento = evento || window.event;
        var teclaAscii = evento.keyCode;
        var tecla = evento.key;

        // Flecha arriba
        if (teclaAscii == '38') {
          if(traslacionXCabina < (largoPlumaX / 2) - (contrapesoX / 2) )  traslacionXCabina = traslacionXCabina + 1;

          if (evento.preventDefault)
              evento.preventDefault();
          evento.returnValue = false;
        }
        // Flecha abajo
        else if (teclaAscii == '40'){
          if (traslacionXCabina > - ( contrapesoX * 1.5 ) )   traslacionXCabina = traslacionXCabina - 1;

          if (evento.preventDefault)
                evento.preventDefault();
          evento.returnValue = false;
        }
        // Flecha izquierda
        else if( (teclaAscii == '37')  && (trasGruaZ > - (muelleZ / 2) + 150.0 ) ){
          trasGruaZ = trasGruaZ - 1;
        }
        // Flecha derecha
        else if ( (teclaAscii == '39') && (trasGruaZ < (muelleZ / 2) - gruaZ ) ) {
          trasGruaZ = trasGruaZ + 1;
        }
        // Numero 1, pone la camara global (aerea)
        else if( (teclaAscii == '97') || (teclaAscii == '49') ) {
           camaraGlobal    = true;
           camaraPersona  = false;
           camaraCabina   = false;
           rotarCamaraY = 0.0;
           rotarCamaraX = 0.0;
        }
        // Numero 2, pone la camara en la persona en el muelle
        else if( (teclaAscii == '98') || (teclaAscii == '50') ) {
           camaraGlobal    = false;
           camaraPersona  = true;
           camaraCabina   = false;
           rotarCamaraY = 0.0;
           rotarCamaraX = 0.0;
        }
        // Numero 3, pone la camara en la cabina
        else if( (teclaAscii == '99') || (teclaAscii == '51') ) {
           camaraGlobal    = false;
           camaraPersona  = false;
           camaraCabina   = true;
           rotarCamaraY = 0.0;
           rotarCamaraX = 0.0;
        }
        // Zoom '+'
        else if( (teclaAscii == '107') || (teclaAscii == '171') ) {
           aumento = aumento + 4;
        }
        // Zoom '-'
        else if( (teclaAscii == '173') || (teclaAscii == '109') ) {
           aumento = aumento - 4;
        }

        if((tecla == "q") || (tecla == "Q")){
          escaladoPlumaY = escaladoPlumaY - 0.01;
        }
        if((tecla == "a") || (tecla == "A")){
          escaladoPlumaY = escaladoPlumaY + 0.01; 

          if(escaladoPlumaY > 1.65){
            escaladoPlumaY = 1.65;
          }
        }

        if((tecla == "e") || (tecla == "E")){
          var enganchar = true;
          if(containerEnganchado >= 0){
            containerEnganchado = -1;
            enganchar = false;  // Esto es para que cuando quiera soltar el container pero todavia este cerca de piso se desenganche bien
          }
          for(var i = 0; i < cantidadContainers, enganchar; i++){
            if( (arrayContainers[i].getPosition()[0] < 35.0 + traslacionXCabina + 4.0) && (arrayContainers[i].getPosition()[0] > 35.0 + traslacionXCabina - 4.0) ){
                if( (arrayContainers[i].getPosition()[1] < gruita.cabina.barraUnoX.getPosition()[1] + 6.0 ) && (arrayContainers[i].getPosition()[1] >  gruita.cabina.barraUnoX.getPosition()[1] - 6.0 ) ) {
                    if( (arrayContainers[i].getPosition()[2] < trasGruaZ + 1.0) && (arrayContainers[i].getPosition()[2] > trasGruaZ - 1.0 ) ){
                      containerEnganchado = i;
                    }
                }
            }
          }          
        }

        // Muevo persona para adelante
        if((tecla == "y") || (tecla == "Y")){
          traslacionPersonaZ = traslacionPersonaZ - Math.cos(-degToRad(rotarCamaraY));   
          traslacionPersonaX = traslacionPersonaX - Math.sin(-degToRad(rotarCamaraY));
        }
        // Muevo persona para atras
        if((tecla == "h") || (tecla == "H")){
          traslacionPersonaZ = traslacionPersonaZ + Math.cos(-degToRad(rotarCamaraY));   
          traslacionPersonaX = traslacionPersonaX + Math.sin(-degToRad(rotarCamaraY));
        }

        // Muevo persona en el muelle para el costado derecho
        if((tecla == "j") || (tecla == "J")){
          traslacionPersonaZ = traslacionPersonaZ + Math.sin(degToRad(rotarCamaraY));   
          traslacionPersonaX = traslacionPersonaX + Math.cos(degToRad(rotarCamaraY));
        }
        // Muevo persona en el muelle para el costado izquierda
        if((tecla == "g") || (tecla == "G")){
          traslacionPersonaZ = traslacionPersonaZ - Math.sin(degToRad(rotarCamaraY)); 
          traslacionPersonaX = traslacionPersonaX - Math.cos(degToRad(rotarCamaraY));
        }

        // console.log(teclaAscii);
    }