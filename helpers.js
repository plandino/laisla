

    function degToRad(degrees) {
        return (degrees * Math.PI) / 180;
    }

    loadTexture = function(object3D, objectImage, texture_file){
            
            
            objectImage = new Image();

            objectImage.onload = function () {
                   object3D.handleLoadedTexture(objectImage)
            }
            objectImage.src = texture_file;
    }
