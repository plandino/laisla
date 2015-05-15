    onkeydown = function(evento){
        evento = evento || window.event;
        var teclaAscii = evento.keyCode;
        var tecla = evento.key;

        // Flecha arriba
        if (teclaAscii == '38') {
          traslacionXCabina = traslacionXCabina + 1;
          if(traslacionXCabina > 15)  traslacionXCabina = 15;
          // if(camaraGlobal){
          //   rotarCamaraY = rotarCamaraY -  5;
          // } 
          // if(camaraPersona){
          //   traslacionPersonaX = traslacionPersonaX + 1;
          // }
          // if(camaraCabina){

          // }
          if (evento.preventDefault)
              evento.preventDefault();
          evento.returnValue = false;
        }
        // Flecha abajo
        else if (teclaAscii == '40') {
          traslacionXCabina = traslacionXCabina - 1;
          if(traslacionXCabina < -45)  traslacionXCabina = -15;
          // if(camaraGlobal){
          //   rotarCamaraY = rotarCamaraY -  5;
          // } 
          // if(camaraPersona){
          //   traslacionPersonaX = traslacionPersonaX - 1;
          // }
          // if(camaraCabina){
            
          // }
          if (evento.preventDefault)
                evento.preventDefault();
         evento.returnValue = false;
        }
        // Flecha izquierda
        else if (teclaAscii == '37') {
          traslacionZGrua = traslacionZGrua - 2;
          // if(camaraGlobal){
          //   rotarCamaraY = rotarCamaraY -  5;
          // } 
          // if(camaraPersona){
          //   traslacionPersonaZ = traslacionPersonaZ + 1;
          // }
          // if(camaraCabina){

          // }
        }
        // Flecha derecha
        else if (teclaAscii == '39') {
          traslacionZGrua = traslacionZGrua + 2;
          // if(camaraGlobal){
          //   rotarCamaraY = rotarCamaraY -  5;
          // } 
          // if(camaraPersona){
          //   traslacionPersonaZ = traslacionPersonaZ - 1;
          // }
          // if(camaraCabina){
            
          // }
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
          if(escaladoPlumaY < 0.4){
            escaladoPlumaY = 0.4;
          }
        }
        if((tecla == "a") || (tecla == "A")){
          escaladoPlumaY = escaladoPlumaY + 0.01;
          if(escaladoPlumaY > 1.71){
            escaladoPlumaY = 1.71;
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
              if( (arrayContainers[i].getPosition()[1] < 0.0 + 4.0 ) && (arrayContainers[i].getPosition()[1] >  0.0 - 4.0 ) && (escaladoPlumaY > 1.70)){
                if( (arrayContainers[i].getPosition()[2] < traslacionZGrua + 1.0) && (arrayContainers[i].getPosition()[2] > traslacionZGrua - 1.0 ) ){
                  containerEnganchado = i;
                }
              }
              
            }
              
          }
          
        }

        // Muevo persona para adelante
        if((tecla == "t") || (tecla == "T")){
          traslacionPersonaZ = traslacionPersonaZ +  5;   // PROVISORIO
        }
        // Muevo persona para atras
        if((tecla == "g") || (tecla == "G")){
          traslacionPersonaZ = traslacionPersonaZ -  5;   // PROVISORIO
        }


        // console.log(teclaAscii);
    }