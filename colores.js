
	function getColor(color){
		if(color == "red"){
			var colors = [
          		[1.0,  0.0,  0.0,  1.0],    
          		[1.0,  0.0,  0.0,  1.0],    
          		[1.0,  0.0,  0.0,  1.0],    
          		[1.0,  0.0,  0.0,  1.0],    
        	];
        	return colors;
		}

		if(color == "green"){
			var colors = [
          		[0.0,  1.0,  0.0,  1.0],    
          		[0.0,  1.0,  0.0,  1.0],    
          		[0.0,  1.0,  0.0,  1.0],    
          		[0.0,  1.0,  0.0,  1.0],    
        	];
        	return colors;
		}

		if(color == "blue"){
			var colors = [
          		[0.0,  0.0,  1.0,  1.0],    
          		[0.0,  0.0,  1.0,  1.0],    
          		[0.0,  0.0,  1.0,  1.0],    
          		[0.0,  0.0,  1.0,  1.0],    
        	];
        	return colors;
		}

		if(color == "yellow"){
			var colors = [
          		[1.0,  1.0,  0.0,  1.0],   
          		[1.0,  1.0,  0.0,  1.0],   
          		[1.0,  1.0,  0.0,  1.0],   
          		[1.0,  1.0,  0.0,  1.0],    
        	];
        	return colors;
		}

		if(color == "purple"){
			var colors = [
          		[0.5,  0.0,  0.5,  1.0],    
          		[0.5,  0.0,  0.5,  1.0],    
          		[0.5,  0.0,  0.5,  1.0],    
          		[0.5,  0.0,  0.5,  1.0],    
        	];
        	return colors;
		}

		if(color == "orange"){
			var colors = [
          		[1.0,  0.35,  0.0,  1.0],    
          		[1.0,  0.35,  0.0,  1.0],    
          		[1.0,  0.35,  0.0,  1.0],    
          		[1.0,  0.35,  0.0,  1.0],    
        	];
        	return colors;
		} if(color == "gris"){
      var colors = [
              [0.1,  0.1,  0.1,  1.0],    
              [0.1,  0.1,  0.1,  1.0],    
              [0.1,  0.1,  0.1,  1.0],    
              [0.1,  0.1,  0.1,  1.0],    
          ];
          return colors;
    } else {
			// Este es el color flashero con un vertice de cada color
			var colors = [
	          [1.0,  1.0,  1.0,  1.0],    // Cara frontal: blanco
	          [1.0,  0.0,  0.0,  1.0],    // Cara de atrás: rojo
	          [0.0,  1.0,  0.0,  1.0],    // Cara de arriba: verde
	          [0.0,  0.0,  1.0,  1.0],    // Cara de abajo: azul
	        ];
        	return colors;
		}
	}