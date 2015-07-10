
function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
}


loadTexture = function(object3D, objectImage, texture_file, conRelieve, conElOtro){
    objectImage = new Image();
    objectImage.onload = function () {
           object3D.handleLoadedTexture(objectImage, conRelieve, conElOtro);
    }
    objectImage.src = texture_file;
}
