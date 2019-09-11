

const Display = function(canvas) {

  this.buffer  = document.createElement("canvas").getContext("2d"),//el buffer esta por un problema de como se veian las imagenes
  this.contexto = canvas.getContext("2d");

  this.dibujarMapa = function(imagen, columnasImagen, mapa, columnasMapa, tamanioTile) {
    /*imagen (tile set contenedor de los tiles a utilizar), columnasImagen(cuantas columnas de la imagen vamos a reortar), mapa(como se va a dibujar, es un arreglo de enteros común)
    columnasMapa(la cantidad de columnas que tiene el mapa), tamanioTile(el tamaño en pixeles que tiene el tile)*/
    for (let indice = mapa.length - 1; indice > -1; -- indice) {

      let valor         = mapa[indice] -1;
      let origen_x      =           (valor % columnasImagen) * tamanioTile;
      let origen_y      = Math.floor(valor / columnasImagen) * tamanioTile;
      let destino_x =           (indice % columnasMapa  ) * tamanioTile;//para tratar el arreglo como una matriz se utilizan estas cuentas, no utilizo una matriz pq es mas rapido de esta manera
      let destino_y = Math.floor(indice / columnasMapa  ) * tamanioTile;

      this.buffer.drawImage(imagen, origen_x, origen_y, tamanioTile, tamanioTile, destino_x, destino_y, tamanioTile, tamanioTile);

    }

  };
  this.temblar = function(fuerza){
    this.buffer.save();
    this.buffer.clearRect(0, 0, this.buffer.width, this.buffer.height);
    var dx = Math.random() * (fuerza - -fuerza) + -fuerza;
    var dy = Math.random() * (fuerza - -fuerza) + -fuerza;
    this.buffer.translate(dx, dy);
  }
  this.postTemblado = function() {
    this.buffer.restore();
  }
  this.dibujarObjeto = function(imagen, origen_x, origen_y, destino_x, destino_y, width, height) {
    // toma como parametros la imagen, los origenes(donde esta ubicado dentro de la imagen), donde se va a dibujar, y el ancho y la altura
    this.buffer.drawImage(imagen, origen_x, origen_y, width, height, Math.round(destino_x), Math.round(destino_y), width, height);

  };

  this.redimensionar = function(width, height, height_width_ratio) {
    //metodo para redimensionar el canvas cada vez que se cambia el tamaño de la pantalla del navegador
    if (height / width > height_width_ratio) {

      this.contexto.canvas.height = width * height_width_ratio;
      this.contexto.canvas.width  = width;

    } else {

      this.contexto.canvas.height = height;
      this.contexto.canvas.width  = height / height_width_ratio;

    }

    this.contexto.imageSmoothingEnabled = false;

  };

};
Display.prototype = {

  constructor : Display,

  render:function() { this.contexto.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.contexto.canvas.width, this.contexto.canvas.height); },
  //metodo para dibujar todo

};
