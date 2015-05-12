    onkeydown = function(evento){
        evento = evento || window.event;
        var teclaAscii = evento.keyCode;
        var tecla = evento.key;

        // Flecha arriba
        if (teclaAscii == '38') {
          if(camaraGlobal){
            rotarCamaraY = rotarCamaraY -  5;
          } 
          if(camaraPersona){
            traslacionPersonaX = traslacionPersonaX + 1;
          }
          if(camaraCabina){

          }
        }
        // Flecha abajo
        else if (teclaAscii == '40') {
          if(camaraGlobal){
            rotarCamaraY = rotarCamaraY -  5;
          } 
          if(camaraPersona){
            traslacionPersonaX = traslacionPersonaX - 1;
          }
          if(camaraCabina){
            
          }
        }
        // Flecha izquierda
        else if (teclaAscii == '37') {
          if(camaraGlobal){
            rotarCamaraY = rotarCamaraY -  5;
          } 
          if(camaraPersona){
            traslacionPersonaZ = traslacionPersonaZ + 1;
          }
          if(camaraCabina){

          }
        }
        // Flecha derecha
        else if (teclaAscii == '39') {
          if(camaraGlobal){
            rotarCamaraY = rotarCamaraY -  5;
          } 
          if(camaraPersona){
            traslacionPersonaZ = traslacionPersonaZ - 1;
          }
          if(camaraCabina){
            
          }
        }
        // Numero 1, pone la camara global (aerea)
        else if( (teclaAscii == '97') || (teclaAscii == '49') ) {
           camaraGlobal    = true;
           camaraPersona  = false;
           camaraCabina   = false;
        }
        // Numero 2, pone la camara en la persona en el muelle
        else if( (teclaAscii == '98') || (teclaAscii == '50') ) {
           camaraGlobal    = false;
           camaraPersona  = true;
           camaraCabina   = false;
        }
        // Numero 3, pone la camara en la cabina
        else if( (teclaAscii == '99') || (teclaAscii == '51') ) {
           camaraGlobal    = false;
           camaraPersona  = false;
           camaraCabina   = true;
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
          traslacionYPluma = traslacionYPluma +  5;   // PROVISORIO
        }
        if((tecla == "a") || (tecla == "A")){
          traslacionYPluma = traslacionYPluma +  5;   // PROVISORIO
        }
        if((tecla == "e") || (tecla == "E")){
          rotarCamaraX = rotarCamaraX +  5;   // PROVISORIO
        }

        console.log(teclaAscii);
    }