    onkeydown = function(evento){
        evento = evento || window.event;
        var teclaAscii = evento.keyCode;
        var tecla = evento.key;

        // Flecha arriba
        if (teclaAscii == '38') {
           rotarCamaraY = rotarCamaraY -  5;
        }
        // Flecha abajo
        else if (teclaAscii == '40') {
            rotarCamaraY = rotarCamaraY -  5;
        }
        // Flecha izquierda
        else if (teclaAscii == '37') {
           rotarCamaraY = rotarCamaraY -  5;
        }
        // Flecha derecha
        else if (teclaAscii == '39') {
           rotarCamaraY = rotarCamaraY -  5;
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
          rotarCamaraX = rotarCamaraX +  5;   // PROVISORIO
        }
        if((tecla == "a") || (tecla == "A")){
          rotarCamaraX = rotarCamaraX +  5;   // PROVISORIO
        }
        if((tecla == "e") || (tecla == "E")){
          rotarCamaraX = rotarCamaraX +  5;   // PROVISORIO
        }
    }