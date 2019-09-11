/*Archivo contenedor de la logica del juego*/


const Juego = function() {

  this.mundo    = new Juego.Mundo();//declaracion del mundo

  this.update   = function() { //el bucle de la logica del juego

    this.mundo.update();

  };

};
Juego.prototype = { constructor : Juego };

Juego.Animador = function(frameSet, retraso, modo = "bucle") {
  //animador, framset(conjunto de imagens a  animar), retraso(cuanto tarda en completarse la animacion), modo()
 this.contador       = 0;
 this.retraso       = (retraso >= 1) ? retraso : 1;
 this.frameSet   = frameSet;
 this.IndiceFrame = 0;
 this.valorFrame = frameSet[0];
 this.modo        = modo;

};
Juego.Animador.prototype = {

 constructor:Juego.Animador,

 animar:function() {

   switch(this.modo) {

     case "bucle" : this.bucle(); break;
     case "pausado":              break;

   }

 },

 changeFrameSet(frameSet, modo, retraso = 10, IndiceFrame = 0) {//metodo para cambiar el framset actual

   if (this.frameSet === frameSet) { return; } //si se cambia el frameset y es el mismo al anterior se vuelve pq no hace falta cambiarlo

   this.contador       = 0;
   this.retraso       = retraso;
   this.frameSet   = frameSet;
   this.IndiceFrame = IndiceFrame;
   this.valorFrame = frameSet[IndiceFrame];
   this.modo        = modo;

 },

 bucle:function() {//bucle para animar

   this.contador ++;
   while(this.contador > this.retraso) {

     this.contador -= this.retraso;
     this.IndiceFrame = (this.IndiceFrame < this.frameSet.length - 1) ? this.IndiceFrame + 1 : 0;

     this.valorFrame = this.frameSet[this.IndiceFrame];

   }

 }

};

Juego.Colisionador = function() {
  this.colision = function(valor, objeto, tile_x, tile_y, tamanioTile) {//valor(para detectar que tipo de colision va a ser), objeto(el objeto contra el que va a colisionar)
                                                                        //tamanioTile(el tamaño que va a ocupar el tile en un area cuadrada)

    switch(valor) {
      //los tipos de colisiones
      case  1:     this.colisionarPlataformaSuperior    (objeto, tile_y            ); break;
      case  2:     this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile); break;
      case  3: if (this.colisionarPlataformaSuperior    (objeto, tile_y            )) return;
                   this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile); break;
      case  4:     this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile); break;
      case  5: if (this.colisionarPlataformaSuperior    (objeto, tile_y            )) return;
                   this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile); break;
      case  6: if (this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile)) return;
                   this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile); break;
      case  7: if (this.colisionarPlataformaSuperior    (objeto, tile_y            )) return;
               if (this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile)) return;
                   this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile); break;
      case  8:     this.colisionarPlataformaIzquierda   (objeto, tile_x            ); break;
      case  9: if (this.colisionarPlataformaSuperior    (objeto, tile_y            )) return;
                   this.colisionarPlataformaIzquierda   (objeto, tile_x            ); break;
      case 10: if (this.colisionarPlataformaIzquierda   (objeto, tile_x            )) return;
                   this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile); break;
      case 11: if (this.colisionarPlataformaSuperior    (objeto, tile_y            )) return;
               if (this.colisionarPlataformaIzquierda   (objeto, tile_x            )) return;
                   this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile); break;
      case 12: if (this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile)) return;
                   this.colisionarPlataformaIzquierda   (objeto, tile_x            ); break;
      case 13: if (this.colisionarPlataformaSuperior    (objeto, tile_y            )) return;
               if (this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile)) return;
                   this.colisionarPlataformaIzquierda   (objeto, tile_x            ); break;
      case 14: if (this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile)) return;
               if (this.colisionarPlataformaIzquierda   (objeto, tile_x            )) return;
                   this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile); break;
      case 15: if (this.colisionarPlataformaSuperior    (objeto, tile_y            )) return;
               if (this.colisionarPlataformaInferior (objeto, tile_y + tamanioTile)) return;
               if (this.colisionarPlataformaIzquierda   (objeto, tile_x            )) return;
                   this.colisionarPlataformaDerecha  (objeto, tile_x + tamanioTile); break;

    }

  }

};
Juego.Colisionador.prototype = {//logica de las colisiones de los objetos con el jugador
  constructor: Juego.Colisionador,

  colisionarPlataformaInferior:function(objeto, tileInferior) {

    if (objeto.getSuperior() < tileInferior && objeto.getSuperiorAnterior() >= tileInferior) {
      /*si el jugador esta abajo del objeto y solo si esta abajo, colisiona, porque si no no hay sentido de colisionar, se repita la
      misma logica para los otros tipos*/
      objeto.setSuperior(tileInferior);
      objeto.velocidadY = 0;
      return true;

    } return false;

  },

  colisionarPlataformaIzquierda:function(objeto, tileIzquierda) {

    if (objeto.getDerecha() > tileIzquierda && objeto.getDerechaAnterior() <= tileIzquierda) {

      objeto.setDerecha(tileIzquierda);
      objeto.velocidadX = 0;
      return true;

    } return false;

  },

  colisionarPlataformaDerecha:function(objeto, tileDerecha) {

    if (objeto.getIzquierda() < tileDerecha && objeto.getIzquierdaAnterior() >= tileDerecha) {

      objeto.setIzquierda(tileDerecha);
      objeto.velocidadX = 0;
      return true;

    } return false;

  },

  colisionarPlataformaSuperior:function(objeto, tileSuperior) {

    if (objeto.getInferior() > tileSuperior && objeto.getInferiorAnterior() <= tileSuperior) {

      objeto.setInferior(tileSuperior);
      objeto.velocidadY = 0;
      return true;

    } return false;

  }

 };


Juego.Frame = function(x, y, width, height, offset_x = 0, offset_y = 0) {//almacena los datos necesarios para recortar e dibujar una imagen

  this.x        = x;//posicion x en la imagen
  this.y        = y;//posicion y en la imagen
  this.width    = width;//ancho de la imagen
  this.height   = height;//alto de la imagen
  this.offset_x = offset_x;//cuanto quiero que este corrida en el eje x la imagen, necesario cuando no todos los frames son del mismo tamaño
  this.offset_y = offset_y;//cuanto quiero que este corrida en el eje y la imagen

};
Juego.Frame.prototype = { constructor: Juego.Frame };

Juego.Objeto = function(x, y, width, height) {//datos de las clases del tipo objeto

 this.height = height;//alto
 this.width  = width;//ancho
 this.x      = x;//posicion x
 this.y      = y;//posicion Y

};
Juego.Objeto.prototype = {

  constructor:Juego.Objeto,

  //colisionar objeto indicado con el mundo
  colisionarObjeto:function(objeto) {

    if (this.getDerecha()  < objeto.getIzquierda()  ||
        this.getInferior() < objeto.getSuperior()   ||
        this.getIzquierda()   > objeto.getDerecha() ||
        this.getSuperior()    > objeto.getInferior()) return false;

    return true;

  },


  colisionarObjetoCentro:function(objeto) {//colision con el centro del objeto

    let centro_x = objeto.getCentroX();
    let centro_y = objeto.getCentroY();

    if (centro_x < this.getIzquierda() || centro_x > this.getDerecha() ||
        centro_y < this.getSuperior()  || centro_y > this.getInferior()) return false;

    return true;

  },
  //para obtener la posicion de cada lugar del objeto
  getInferior : function()  { return this.y + this.height;       },
  getCentroX: function()  { return this.x + this.width  * 0.5; },
  getCentroY: function()  { return this.y + this.height * 0.5; },
  getIzquierda   : function()  { return this.x;                     },
  getDerecha  : function()  { return this.x + this.width;        },
  getSuperior    : function()  { return this.y;                     },
  setInferior : function(y) { this.y = y - this.height;          },
  setCentroX: function(x) { this.x = x - this.width  * 0.5;    },
  setCentroY: function(y) { this.y = y - this.height * 0.5;    },
  setIzquierda   : function(x) { this.x = x;                        },
  setDerecha  : function(x) { this.x = x - this.width;           },
  setSuperior    : function(y) { this.y = y;                        }

};

Juego.ObjetoEnMovimiento = function(x, y, width, height, velocidadMaxima = 15) {
  //datos de los objetos en movimiento
  Juego.Objeto.call(this, x, y, width, height);
  this.velocidadMaxima = velocidadMaxima;
  this.velocidadX   = 0;
  this.velocidadY   = 0;
  this.xAnterior       = x;
  this.yAnterior       = y;

};

Juego.ObjetoEnMovimiento.prototype = {
  //se utilizan para las colisiones
  getInferiorAnterior : function()  { return this.yAnterior+ this.height;       },
  geCentroXAnterior: function()  { return this.xAnterior+ this.width  * 0.5; },
  getCentroYAnterior: function()  { return this.yAnterior+ this.height * 0.5; },
  getIzquierdaAnterior   : function()  { return this.xAnterior;                     },
  getDerechaAnterior  : function()  { return this.xAnterior+ this.width;        },
  getSuperiorAnterior    : function()  { return this.yAnterior;                     },
  setInferiorAnterior : function(y) { this.yAnterior= y    - this.height;       },
  setCentroXAnterior: function(x) { this.xAnterior= x    - this.width  * 0.5; },
  setCentroYAnterior: function(y) { this.yAnterior= y    - this.height * 0.5; },
  setIzquierdaAnterior   : function(x) { this.xAnterior= x;                        },
  setDerechaAnterior  : function(x) { this.xAnterior= x    - this.width;        },
  setSuperiorAnterior    : function(y) { this.yAnterior= y;                        }

};
Object.assign(Juego.ObjetoEnMovimiento.prototype, Juego.Objeto.prototype);
Juego.ObjetoEnMovimiento.prototype.constructor = Juego.ObjetoEnMovimiento;

//clase de la trampa con pinchos
Juego.Trampa = function(x, y) {

  Juego.Objeto.call(this, x, y, 7, 14);
  Juego.Animador.call(this, Juego.Trampa.prototype.frameSets["trampaActiva"], 15);//lamma al animador con framesets iniciales

  this.danioRealizado = false;
  this.contadorActiva = 0;
  this.contadorInactiva = 0
  this.activa = true;
  this.base_x     = x;
  this.base_y     = y;
  this.posicionX = 0;
  this.posicionY = 0;

};
Juego.Trampa.prototype = {

  frameSets: { "trampaActiva":[ 33, 34, 35],
                "trampaInactiva": [32]},
  updateTrampa:function() {
    //si la trampa esta activa se muestra los pinchos y se puede realizar daño
    if(this.activa == true) {
      this.contadorInactiva = 0;
      this.contadorActiva += .45;
      this.changeFrameSet(this.frameSets["trampaActiva"], "bucle", 5);
      if(this.contadorActiva >= (this.retraso)) this.activa = false;
    }
    //en caso contrario se resetea que ya realizo daño(para no matar al jugador automaticamente y hacer de poco en poco) y se muestra la animacion de pinchos guardados
    else{

      this.danioRealizado = false;
      this.contadorActiva = 0;
      this.contadorInactiva += .45;
      this.changeFrameSet(this.frameSets["trampaInactiva"], "bucle", 30 );
      if(this.contadorInactiva >= (this.retraso)) this.activa = true;
    }
    //por ultimo se anima
    this.animar();
  },
};
Object.assign(Juego.Trampa.prototype, Juego.Animador.prototype);
Object.assign(Juego.Trampa.prototype, Juego.Objeto.prototype);
Juego.Trampa.prototype.constructor = Juego.Trampa;

//----------------Enemigo---------------------
Juego.Enemigo = function(x, y) {

  Juego.ObjetoEnMovimiento.call(this, x, y, 7, 12);
  Juego.Animador.call(this, Juego.Enemigo.prototype.frameSets["idle"], 15);
  this.contadorMuerte = 0;
  this.muerto = false;
  this.muerteTerminada = false;
  this.danioRecibido = false;
  this.contadorDanioRecibido = 0;
  this.vida = 100;
  this.vidaActual = 100;
  this.ataqueTerminado = false;
  this.retraso = 5;
  this.contadorAtaque = 0;
  this.contadorArriba = 0;
  this.levantada = true;
  this.atacando = false;
  this.enRangoY = false;
  this.enRangoX = false;
  this.dir = 0;
  this.velocidadX = .8;
  this.velocidadY = .8;
  this.base_x     = x;
  this.base_y     = y;
  this.posicionX = 0;
  this.posicionY = 0;
  

};
Juego.Enemigo.prototype = {

  frameSets: { "idle":[121, 122, 123, 124, 125, 126, 127, 128, 129, 130 ,131, 132],
              "caminarDerecha": [45, 46, 47, 48, 49,50, 51, 52, 53, 54, 55, 56, 57],
              "CaminarIzquierda":[58, 59, 60, 61,62,63, 64, 65, 66, 67, 68, 69, 70],
              "AtaqueDerechaAbajo": [71, 72, 73, 74, 75, 76 ,77,78],
              "AtaqueDerechaArriba": [79, 80, 81, 82, 83, 84, 85, 86, 87, 88],
              "AtaqueIzquierdaAbajo": [89, 90, 91, 92, 93, 94, 95, 96],
              "AtaqueIzquierdaArriba": [97, 98, 99, 100, 101, 102, 103, 104, 105, 106],
              "dañoRecibidoDerecha": [107],
              "dañoRecibidoIzquierda": [108],
              "muerte": [107, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120],
              "calabera": [120]},
  updateEnemigo:function(jugador) {
    //friccion
    this.velocidadY *= .2;
    this.velocidadX *= .2;
    //si el enemigo no esta muerto puede moverse y atacar
    if(!this.muerto){
      console.log("g")
      //si esta en rango de ataque en el eje X
      if((this.x > jugador.x+21 && this.x < jugador.x+24) || (this.x > jugador.x-24 && this.x < jugador.x-21)) this.enRangoX = true;
      else this.enRangoX = false;

      //si esta en rango de ataque en el eje Y
      if((this.y < jugador.y+1) && (this.y > jugador.y-1)) this.enRangoY = true;
      else this.enRangoY = false;

      //si no esta en rango x se mueve hasta estar en rango
      if(this.enRangoX && this.enRangoY && !this.danioRecibido) this.atacando = true;
      if(!this.atacando){
        if(!this.enRangoX && this.atacando == false){
          if(this.x >= jugador.x+24 || (this.x < jugador.x && this.x > jugador.x-21) && this.atacando == false){
            this.dir = -1;
            this.velocidadX += .7;
          }else if(this.x <= jugador.x-24 || (this.x > jugador.x && this.x < jugador.x+21) && this.atacando == false){
            this.dir = 1;
            this.velocidadX -= .7;
          }
        }


        //si no esta en rango y se mueve hasta estar en rango
        if(!this.enRangoY && this.atacando == false && !this.danioRecibido){
          if(this.y > jugador.y+1 && this.atacando == false){
            this.enRangoY = false;
            this.velocidadY += .5;
          }else if(this.y < jugador.y-1 && this.atacando == false){
            this.enRangoY = false;
            this.velocidadY -= .5;
          }
        }

        //se establece la animacion de que lado camina
        if(!this.enRangoX || !this.enRangoY && this.atacando == false && !this.danioRecibido){
          if(this.dir > .5) this.changeFrameSet(this.frameSets["caminarDerecha"], "bucle", 3.5);
          else if(this.dir < -.5) this.changeFrameSet(this.frameSets["CaminarIzquierda"], "bucle", 3.5);
        }
      }
      //esto esta por si el enemigo se acomodo para estar en rango, para una vez estar en rango mire al jugador
      if(this.enRangoX){
        if(this.x > jugador.x) this.dir = -1
        else this.dir = 1;
      }
      //si recibio daño se muestra la animacion
      if(this.danioRecibido == true) {

        this.contadorDanioRecibido+= .45;
        if(this.dir > 0) this.changeFrameSet(this.frameSets["dañoRecibidoDerecha"], "bucle", 3);
        if(this.dir < 0) this.changeFrameSet(this.frameSets["dañoRecibidoIzquierda"], "bucle", 3);

        if(this.contadorDanioRecibido >= (this.retraso)) this.danioRecibido = false;
      }

      //mientras este en rango y no reciba daño puede atacar
      if(this.atacando && !this.danioRecibido){
        if(!jugador.muerteTerminada){
          if(this.dir > .5){
            if(this.ataqueTerminado == false && this.levantada == true) {

              this.contadorArriba = 0.0;
              this.contadorAtaque+= .45;
              this.changeFrameSet(this.frameSets["AtaqueDerechaAbajo"], "bucle", 2.5);
              if(this.contadorAtaque >= 8.5){
                if(jugador.x > this.x && jugador.x < this.x +50 && jugador.y < this.y +15 && jugador.y > this.y - 15) {jugador.recibirDanio(25  ); jugador.knockBack(1)}
                this.ataqueTerminado = true;
                this.levantada = false;
              }
            }else if(this.levantada == false && this.ataqueTerminado == true){
              this.contadorAtaque = 0.0;
              this.contadorArriba+= .45;
              this.changeFrameSet(this.frameSets["AtaqueDerechaArriba"], "bucle", 2.5);
              if(this.contadorArriba >= 8.5){
                this.atacando = false;
                this.ataqueTerminado = false;
                this.levantada = true;
              }
            }
          }else{

              if(this.ataqueTerminado == false && this.levantada == true) {

                this.contadorArriba = 0.0;
                this.contadorAtaque+= .45;
                this.changeFrameSet(this.frameSets["AtaqueIzquierdaAbajo"], "bucle", 2.5);
                if(this.contadorAtaque >= 8.5){
                  if(jugador.x < this.x && jugador.x > this.x - 50 && jugador.y < this.y +15 && jugador.y > this.y - 15) {jugador.recibirDanio(25); jugador.knockBack(-1)}
                  this.ataqueTerminado = true;
                  this.levantada = false;
                }
              }else if(this.levantada == false && this.ataqueTerminado == true){
                this.contadorAtaque = 0.0;
                this.contadorArriba+= .45;
                this.changeFrameSet(this.frameSets["AtaqueIzquierdaArriba"], "bucle", 2.5);
                if(this.contadorArriba >= 8.5){
                  this.atacando = false;
                  this.ataqueTerminado = false;
                  this.levantada = true;
                }
              }
            }
        }else{
           this.changeFrameSet(this.frameSets["idle"], "bucle", 3);
        }
      }else{
        this.contadorAtaque = 0.0;
        this.atacando = false;
        this.ataqueTerminado = false;
        this.levantada = true;
      }
      this.y   -= this.velocidadY;
      this.x    -= this.velocidadX;
    }else{
      //animacion de muerte
      if(this.muerteTerminada == false) {
        this.contadorMuerte+= .45;
        this.changeFrameSet(this.frameSets["muerte"], "bucle", 5);
        if(this.contadorMuerte >= 25) this.muerteTerminada = true;
      }else if(this.muerteTerminada) this.changeFrameSet(this.frameSets["calabera"], "pausado");
    }




    this.animar();
  },
  //metodo para recibir daño
  recibirDanio:function(danio) {
    this.vida -= danio;
  },
  knockBack:function(direccionX, direccionY){
    if(direccionX > 0) this.velocidadX = 50;
    if(direccionX < 0) this.velocidadX = -50;
    if(direccionY > 0) this.velocidadY = 50;
    if(direccionY < 0) this.velocidadY = -50;
  }
};

Object.assign(Juego.Enemigo.prototype, Juego.Animador.prototype);
Object.assign(Juego.Enemigo.prototype, Juego.ObjetoEnMovimiento.prototype);
Juego.Enemigo.prototype.constructor = Juego.Enemigo;


Juego.Puerta = function(puerta) {

 Juego.Objeto.call(this, puerta.x, puerta.y, puerta.width, puerta.height);

 this.destinoX    = puerta.destinoX;//en que posicion X va a aparecer el jugador -1 para mantener la anterior
 this.destinoY    = puerta.destinoY;//en que posicion Y va a aparecer el jugador -1 para mantener la anterior
 this.zonaDestino = puerta.zonaDestino;//zona guardada en un json de destino

};
Juego.Puerta.prototype = {};
Object.assign(Juego.Puerta.prototype, Juego.Objeto.prototype);
Juego.Puerta.prototype.constructor = Juego.Puerta;


Juego.Jugador = function(x, y) {

  Juego.ObjetoEnMovimiento.call(this, x, y, 7, 12);
  this.spawnpointX = x;
  this.spawnpointY = y;
  Juego.Animador.call(this, Juego.Jugador.prototype.frameSets["idleIzquierda"], 10);
  this.danioRecibidoTerminado = false;
  this.contadorDanioRecibido = 0;
  this.contadorMuerte = 0;
  this.muerteTerminada = false;
  this.danioRecibido = false;
  this.vida = 100;
  this.vidaActual = 100;
  this.ataqueTerminado = false;
  this.retraso = 5;
  this.contadorAtaque = 0;
  this.moviendose     = false;
  this.atacando = true;
  this.muerto = false;
  this.direccionX = -1;
  this.direccionY = -1;
  this.velocidadX  = 0;
  this.velocidadY  = 0;

};
Juego.Jugador.prototype = {

  frameSets: {

    "idleIzquierda" : [4],
    "caminarIzquierda" : [4, 5, 6, 7],
    "idleDerecha": [12],
    "caminarDerecha": [12, 13, 14, 15],
    "idleArriba": [8],
    "caminarArriba": [8, 9, 10, 11],
    "idleAbajo": [0],
    "caminarAbajo": [0, 1, 2, 3],
    "AtaqueArriba": [16, 17, 18, 19],
    "AtaqueAbajo": [20, 21, 22, 23],
    "AtaqueDerecha": [24, 25, 26, 27],
    "AtaqueIzquierda": [28, 29, 30, 31],
    "muerto": [36],
    "dañoRecibidoAbajo": [37],
    "dañoRecibidoArriba": [38],
    "dañoRecibidoIzquierda": [39],
    "dañoRecibidoDerecha": [40],
    "explosionDeSangre": [41, 42, 43, 44],

  },
  knockBack:function(direccionX, direccionY){
    if(!this.muerto){
      if(direccionX > 0) this.velocidadX = 5;
      if(direccionX < 0) this.velocidadX = -5;
      if(direccionY > 0) this.velocidadY = 5;
      if(direccionY < 0) this.velocidadY = -5;
    }
  },
  //metodo para recibir daño
  recibirDanio: function(amount){
    this.danioRecibidoTerminado = false;
    this.contadorDanioRecibido = 0;
    this.danioRecibido = true;
    this.vida -= amount;

  },
  //metodos de movimiento en todas las direcciones
  caminarArriba: function() {

    this.direccionY = -1;
    this.direccionX = 0;
    this.velocidadY -= 0.5;
    this.moviendose = true;

  },

  caminarAbajo: function() {
    this.direccionX = 0;
    this.direccionY = 1;
    this.velocidadY += 0.5;
    this.moviendose = true;

  },
  caminarIzquierda: function() {
    this.direccionY = 0;
    this.direccionX = -1;
    this.velocidadX -= 0.5;
    this.moviendose = true;

  },

  caminarDerecha:function(frameSet) {
    this.direccionY = 0 ;
    this.direccionX = 1;
    this.velocidadX += 0.5;
    this.moviendose = true;

  },
  //metodo para poder atacar
  atacar:function(){
    this.atacando = true;
    this.moviendose = false;
    this.contadorAtaque = 0;
    this.ataqueTerminado = false;
    this.retraso = 5;
  },
  resetPropiedades:function(){
    this.contadorMuerte = 0;
    this.x = this.spawnpointX;
    this.y = this.spawnpointY;
    this.muerteTerminada = false;
    this.muerto = false;
    this.vida = 100;
    this.vidaActual = 100;
  },
  //metodo para ver si el enemigo esta en rango, en caso de estar este recibe daño
  checkEnemigoRangoAtaque:function(enemigo){
    if(this.atacando && this.ataqueTerminado)
      if(enemigo.x < this.x && enemigo.x > this.x - 23 && enemigo.y < this.y +15 && enemigo.y > this.y - 15 && this.direccionX < -.5){
        enemigo.knockBack(1);
        enemigo.recibirDanio(Math.random() * (25 - 1) + 1);
        enemigo.danioRecibido = true;
        enemigo.contadorDanioRecibido = 0;
      }
      else if(enemigo.x > this.x && enemigo.x < this.x +23 && enemigo.y < this.y +15 && enemigo.y > this.y - 15 && this.direccionX > .5){
        enemigo.knockBack(-1);
        enemigo.recibirDanio(Math.random() * (25 - 1) + 1);
        enemigo.danioRecibido = true;
        enemigo.contadorDanioRecibido = 0;
      }
      else if(enemigo.y > this.y && enemigo.y < this.y +23 && enemigo.x < this.x +15 && enemigo.x > this.x - 15 && this.direccionY > .5){
        enemigo.knockBack(0, -1);
        enemigo.recibirDanio(Math.random() * (25 - 1) + 1);
        enemigo.danioRecibido = true;
        enemigo.contadorDanioRecibido = 0;
      }else if(enemigo.y < this.y && enemigo.y > this.y - 23 && enemigo.x < this.x +15 && enemigo.x > this.x - 15 && this.direccionY < -.5){
        enemigo.knockBack(0, 1);
        enemigo.recibirDanio(Math.random() * (25 - 1) + 1);
        enemigo.danioRecibido = true;
        enemigo.contadorDanioRecibido = 0;
      }
  },


  updateAnimation:function() {

    if(!this.muerto && !this.danioRecibido){//si no esta recibiendo daño y no esta muerto puede realizar las acciones
      if(this.moviendose && this.ataqueTerminado && !this.atacando){//si esta moviendose y no esta atacando puede moverse
        //animaciones de movimiendo dependiendo la direccion
        if (this.direccionY < 0) {

          if (this.velocidadY < -0.1) this.changeFrameSet(this.frameSets["caminarArriba"], "bucle", 5);
          else{;
            this.moviendose = false;
          }

        }else if (this.direccionY > 0) {

          if (this.velocidadY > 0.1) this.changeFrameSet(this.frameSets["caminarAbajo"], "bucle", 5);
          else{
            this.moviendose = false;
          }

        }else if (this.direccionX < 0) {

          if (this.velocidadX < -0.1) this.changeFrameSet(this.frameSets["caminarIzquierda"], "bucle", 5);
          else {

            this.moviendose = false;
          }
        } else if (this.direccionX > 0) {

          if (this.velocidadX > 0.1) this.changeFrameSet(this.frameSets["caminarDerecha"], "bucle", 5);
          else {

            this.moviendose = false;
          }
        }
      }else if (this.atacando){
        //animaciones de ataque dependiendo de la direccion que mire el jugador
        if(this.direccionY < 0){
          if(this.ataqueTerminado == false) {
            this.contadorAtaque+= .45;
            this.changeFrameSet(this.frameSets["AtaqueArriba"], "bucle", 2.5);
            if(this.contadorAtaque >= (this.retraso)) this.ataqueTerminado = true;
          }else{
            this.atacando = false;
          }
        }
        else if(this.direccionY > 0){
          if(this.ataqueTerminado == false) {
            this.contadorAtaque+= .45;
            this.changeFrameSet(this.frameSets["AtaqueAbajo"], "bucle", 2.5);
            if(this.contadorAtaque >= (this.retraso)) this.ataqueTerminado = true;
          }else{
            this.atacando = false;
          }
        }
        else if(this.direccionX > 0){
          if(this.ataqueTerminado == false) {
            this.contadorAtaque+= .45;
            this.changeFrameSet(this.frameSets["AtaqueDerecha"], "bucle", 2.5);
            if(this.contadorAtaque >= (this.retraso)) this.ataqueTerminado = true;
          }else{
            this.atacando = false;
          }
        }
        else if(this.direccionX < 0){
          if(this.ataqueTerminado == false) {
            this.contadorAtaque+= .45;
            this.changeFrameSet(this.frameSets["AtaqueIzquierda"], "bucle", 2.5);
            if(this.contadorAtaque >= (this.retraso)) this.ataqueTerminado = true;
          }else{
            this.atacando = false;
          }
        }
      }else{
        //animaciones en caso de que no se este moviendo
        if (this.direccionY < 0) this.changeFrameSet(this.frameSets["idleArriba"], "pausado")
        else if (this.direccionY > 0)this.changeFrameSet(this.frameSets["idleAbajo"], "pausado");
        else if (this.direccionX < 0) this.changeFrameSet(this.frameSets["idleIzquierda"], "pausado");
        else if (this.direccionX > 0)this.changeFrameSet(this.frameSets["idleDerecha"], "pausado");
      }

    }else if(this.muerto){
      //animacion de muerte
      this.velocidadX = 0;
      this.velocidadY = 0;
        if(this.muerteTerminada == false) {
          this.contadorMuerte+= .45;
          this.changeFrameSet(this.frameSets["explosionDeSangre"], "bucle", 5);
          if(this.contadorMuerte >= (this.retraso)) this.muerteTerminada = true;
        }else if(this.muerteTerminada) this.changeFrameSet(this.frameSets["muerto"], "pausado");



    }else{
      //animacion de recibir daño
      if(this.danioRecibidoTerminado == false) {

        this.contadorDanioRecibido+= .45;
        if(this.direccionX > 0) this.changeFrameSet(this.frameSets["dañoRecibidoDerecha"], "bucle", 1);
        if(this.direccionX < 0) this.changeFrameSet(this.frameSets["dañoRecibidoIzquierda"], "bucle", 1);
        if(this.direccionY <  0) this.changeFrameSet(this.frameSets["dañoRecibidoArriba"], "bucle", 1);
        if(this.direccionY > 0) this.changeFrameSet(this.frameSets["dañoRecibidoAbajo"], "bucle", 1);
        if(this.contadorDanioRecibido >= (this.retraso)) this.danioRecibidoTerminado = true;
      }else{
        this.danioRecibido = false;
      }

    }

    // TODO: refactorizar el codigo de jugador y enemigo

    this.animar();

  },
  //actualizar la posicion
  updatePosition:function(friccion) {

    this.xAnterior= this.x;
    this.yAnterior= this.y;

    this.velocidadY *= friccion;
    this.velocidadX *= friccion;


    if (Math.abs(this.velocidadX) > this.velocidadMaxima)
    this.velocidadX = this.velocidadMaxima * Math.sign(this.velocidadX);

    if (Math.abs(this.velocidadY) > this.velocidadMaxima)
    this.velocidadY = this.velocidadMaxima * Math.sign(this.velocidadY);

    this.x    += this.velocidadX;
    this.y    += this.velocidadY;

  }

};
Object.assign(Juego.Jugador.prototype, Juego.ObjetoEnMovimiento.prototype);
Object.assign(Juego.Jugador.prototype, Juego.Animador.prototype);
Juego.Jugador.prototype.constructor = Juego.Jugador;

Juego.TileSet = function(columnas, tamanioTile) {

  this.columnas    = columnas;
  this.tamanioTile  = tamanioTile;

  let f = Juego.Frame;
  //contenedor de los frames utilizados
  this.frames = [new f(2,  161, 16, 19, 0, -4),  new f(20,  161, 16, 20, 0, -4), new f(37,  161, 16, 19, 0, -4), new f(55,  161, 16, 20, 0, -4),// down
                 new f(2,  181, 14, 19, 0, -4),  new f(21,  181, 14, 18, 0, -4), new f(38,  181, 14, 19, 0, -4), new f(56,  181, 14, 18, 0, -4), //izquierda
                 new f(2,  202, 16, 19, 0, -4),  new f(22,  202, 16, 20, 0, -4), new f(39,  202, 16, 19, 0, -4), new f(57,  202, 16, 20, 0, -4), //up
                 new f(2,  222, 14, 19, 0, -4),  new f(23,  222, 14, 18, 0, -4), new f(40,  222, 14, 19, 0, -4), new f(59,  222, 14, 18, 0, -4), //derecha
                 new f(7, 347,29,24, 4, -8), new f(39, 347,16,24, -2, -8), new f(70, 347,17,24, -3, -8), new f(101, 347,18,24, -3, -8),//attack up
                 new f(3, 264, 29, 28, -7, -4),  new f(34, 264, 18, 30, 1, -4), new f(51, 264, 18, 30, 1, -4), new f(69, 264, 17, 30, 1, -4),//attack down
                 new f(6,  298, 23, 30, 4, -4),  new f(30,  298, 24, 19, 5, -4), new f(55,  298, 25, 19, 5, -4), new f(82,  298, 25, 19, 5, -4),//attack Right
                 new f(1,  381, 25, 28, -5, -13), new f(28,  390, 25, 19, -5, -4),  new f(60,  390, 25, 19, -5, -4), new f(92,  390, 25, 19, -5, -4),//Attack izquierda
                 new f(144, 0 ,16, 16, 0 ,4), new f(128, 0 ,16, 16, 0 ,4),new f(96, 0 ,16, 16, 0 ,4), new f(112, 0 ,16, 16, 0 ,4), //trap
                 new f(85, 227, 16, 16, 0, 0),//muerto
                 new f(84, 162, 16, 19,  0, -4),// damange down
                 new f(84, 202, 16, 20,  0, -4),// damange up
                 new f(101, 181, 14, 18,  0, -4),// damange izquierda
                 new f(102, 223, 14, 18,  0, -4),// damange derecha
                 new f(4, 413, 23, 12, 0, 0), new f(28, 410, 27, 15, 0, -4), new f(63, 413, 29, 24, 0, -4), new f(109, 416, 32, 23, 0, 0),//blood splash
                 new f(1, 445, 18, 32, 0 , -16),new f(23, 445, 18, 32, 0 , -16),new f(45, 445, 18, 32, 0 , -16),new f(66, 444, 20, 33, 0 , -16),new f(88, 444, 21, 33, 0 , -16),new f(110, 444, 22, 33, 0 , -16),
                 new f(0, 477, 22, 32, 0, -16), new f(22, 477, 22, 32, 0, -16), new f(44, 477, 22, 32, 0, -16), new f(66, 477, 22, 32, 0, -16), new f(89, 477, 20, 32, 0, -16), new f(112, 477, 18, 32, 0, -16), new f(134, 477, 17, 32, 0, -16),//Enemy moveRight
                 new f(132, 515, 18, 32, 0, -16), new f(110, 515, 18, 32, 0, -16), new f(88, 515, 18, 32, 0, -16), new f(65, 515, 20, 33, 0, -16), new f(42, 515, 21, 33, 0, -16), new f(19, 514, 22, 33, 0, -16), new f(129, 547, 22, 32, 0, -16),
                 new f(107, 547, 22, 32, 0, -16), new f(85, 547, 22, 32, 0, -16), new f(63, 547, 22, 32, 0, -16), new f(42, 547, 20, 31, 0, -16), new f(21, 547, 18, 32, 0, -16), new f(0, 547, 17, 32, 0, -16),//moveLeft
                 new f(3, 595, 22, 32, 0, -16), new f(46, 595, 22, 32, 0, -16), new f(89, 595, 21, 32, 0, -16), new f(134, 595, 19, 32, 0, -16), new f(8, 634, 18, 37, -1, -21), new f(48, 635, 21, 36,-2, -20), new f(90, 638, 22, 33,-2, -17), new f(9, 677, 39, 36, 10, -20),
                 new f(58, 694, 31, 19, 12, -3), new f(99, 692, 32, 21, 12, -5), new f(11, 724, 32, 22, 11, -6), new f(52, 724, 32, 22, 8, -6), new f(98, 724, 33, 22, 12, -6), new f(11, 761, 32, 22, 12, -6), new f(52, 753, 28, 30, 8, -14), new f(92, 751, 21, 32, 0, -16),
                 new f(11, 795, 21, 32, -1, -16), new f(54, 795, 21, 32, -1, -16),//attack right
                 new f(131, 839, 22, 32, 0, -16), new f(88, 839, 22, 32, 0, -16), new f(46, 839, 21, 32, 0, -16), new f(3, 839, 19, 32, 0, -16), new f(130, 878, 18, 37, 1, -21), new f(87, 879, 21, 36,2, -20), new f(44, 882, 22, 33, 2, -17), new f(108, 921, 39, 36, -10, -20),
                 new f(67, 938, 31, 19, -12, -3), new f(25, 936, 32, 21, -12, -5), new f(113, 968, 32, 22, -11, -6), new f(69, 968, 32, 22, -8, -6), new f(25, 969, 33, 22, -12, -6), new f(113, 1005, 32, 22, -12, -6), new f(76, 997, 28, 30, -8, -14), new f(43, 995, 21, 32, 0, -16),
                 new f(124, 1039, 21, 32, 1, -16), new f(80, 1039, 21, 32, 1, -16),//attack left
                 new f(10, 1039, 22, 32, 0, -16),//daño recibido derecha
                 new f(38, 1039, 22, 32, 0, -16),//daño recibido izquierda
                 new f(20, 1080, 24, 32, 0, -16), new f(53, 1080, 24, 32, 0, -16), new f(86, 1080, 24, 32, 0, -16),  new f(119, 1080, 24, 32, 0, -16), new f(23, 1117, 24, 32, 0, -16), new f(56, 1118, 23, 31, 4, -16),
                 new f(88, 1121, 23, 28, 0, -16),new f(121, 1151, 24, 25, 0, -4), new f(22, 1151, 25, 16, 0, -2), new f(51, 1159, 30, 8, 0, 6), new f(84, 1160, 30, 7, 0, 6), new f(117, 1160, 30, 7, 0, 6), //muerte
                 new f(5, 1190, 22, 32, 0, -16), new f(29, 1190, 22, 32, 0, -16), new f(53, 1190, 22, 32, 0, -16), new f(77, 1190, 22, 32, 0, -16), new f(102, 1190, 22, 32, 0, -16),
                 new f(5, 1227, 22, 32, 0, -16), new f(29, 1227, 22, 32, 0, -16), new f(52, 1227, 22, 32, 0, -16), new f(75, 1227, 22, 32, 0, -16), new f(99, 1227, 22, 32, 0, -16), new f(123, 1227, 22, 32, 0, -16), //Idle Esqueleto
                ];

};
Juego.TileSet.prototype = { constructor: Juego.TileSet };

Juego.Mundo = function(friccion = 0.79) {

  this.Colisionador     = new Juego.Colisionador();

  this.friccion     = friccion;

  this.columnas      = 12;
  this.filas         = 9;

  this.tile_set     = new Juego.TileSet(8, 16);
  this.jugador       = new Juego.Jugador(20, 60);

  this.zona_id      = "00";

  this.trampas      = [];
  this.enemigos      = [];
  this.puertas        = [];
  this.puerta         = undefined;

  this.height       = this.tile_set.tamanioTile * this.filas;
  this.width        = this.tile_set.tamanioTile * this.columnas;

};
Juego.Mundo.prototype = {

  constructor: Juego.Mundo,
  //colisionar un objeto con el mundo
  colisionarObjeto:function(objeto) {


    var inferior, izquierda, derecha, superior, value;

    superior    = Math.floor(objeto.getSuperior()    / this.tile_set.tamanioTile);
    izquierda   = Math.floor(objeto.getIzquierda()   / this.tile_set.tamanioTile);
    value  = this.mapaColisiones[superior * this.columnas + izquierda];
    this.Colisionador.colision(value, objeto, izquierda * this.tile_set.tamanioTile, superior * this.tile_set.tamanioTile, this.tile_set.tamanioTile);

    superior    = Math.floor(objeto.getSuperior()    / this.tile_set.tamanioTile);
    derecha  = Math.floor(objeto.getDerecha()  / this.tile_set.tamanioTile);
    value  = this.mapaColisiones[superior * this.columnas + derecha];
    this.Colisionador.colision(value, objeto, derecha * this.tile_set.tamanioTile, superior * this.tile_set.tamanioTile, this.tile_set.tamanioTile);

    inferior = Math.floor(objeto.getInferior() / this.tile_set.tamanioTile);
    izquierda   = Math.floor(objeto.getIzquierda()   / this.tile_set.tamanioTile);
    value  = this.mapaColisiones[inferior * this.columnas + izquierda];
    this.Colisionador.colision(value, objeto, izquierda * this.tile_set.tamanioTile, inferior * this.tile_set.tamanioTile, this.tile_set.tamanioTile);

    inferior = Math.floor(objeto.getInferior() / this.tile_set.tamanioTile);
    derecha  = Math.floor(objeto.getDerecha()  / this.tile_set.tamanioTile);
    value  = this.mapaColisiones[inferior * this.columnas + derecha];
    this.Colisionador.colision(value, objeto, derecha * this.tile_set.tamanioTile, inferior * this.tile_set.tamanioTile, this.tile_set.tamanioTile);

  },
  //setup del mundo
  preparar:function(zona) {

    this.trampas            = new Array();
    this.enemigos            = new Array();
    this.enemigosMuertos            = new Array();
    this.puertas              = new Array();
    this.mapaColisiones      = zona.mapaColisiones;
    this.mapaGrafico      = zona.mapaGrafico;
    this.columnas            = zona.columnas;
    this.filas               = zona.filas;
    this.zona_id            = zona.id;
    for (let indice = zona.enemigos.length - 1; indice > -1; -- indice) {

      let enemigo = zona.enemigos[indice];
      this.enemigos[indice] = new Juego.Enemigo((enemigo[0]-1) * this.tile_set.tamanioTile +5, (enemigo[1]-1) * this.tile_set.tamanioTile + 12);

    }

    for (let indice = zona.trampas.length - 1; indice > -1; -- indice) {

      let trampa = zona.trampas[indice];
      this.trampas[indice] = new Juego.Trampa((trampa[0]-1) * this.tile_set.tamanioTile +5, (trampa[1]-1) * this.tile_set.tamanioTile + 12);

    }
    for (let indice = zona.puertas.length - 1; indice > -1; -- indice) {

      let puerta = zona.puertas[indice];
      this.puertas[indice] = new Juego.Puerta(puerta);

    }

    if (this.puerta) {

      if (this.puerta.destinoX != -1) {

        this.jugador.setCentroX   (this.puerta.destinoX);
        this.jugador.setCentroXAnterior(this.puerta.destinoX);

      }

      if (this.puerta.destinoY != -1) {

        this.jugador.setCentroY   (this.puerta.destinoY);
        this.jugador.setCentroYAnterior(this.puerta.destinoY);

      }

      this.puerta = undefined;

    }

  },

  update:function() {




    for (let indice = this.trampas.length - 1; indice > -1; -- indice) {

      let trampa = this.trampas[indice];
      trampa.updateTrampa();
      if (trampa.colisionarObjeto(this.jugador) && trampa.activa && trampa.danioRealizado == false) {
        trampa.danioRealizado = true;
        if(this.jugador.x > trampa.x) this.jugador.knockBack(1);
        if(this.jugador.x < trampa.x) this.jugador.knockBack(-1);
        this.jugador.recibirDanio(25);

      }

    }

    for (let indice = this.enemigos.length - 1; indice > -1; -- indice) {

      let enemigo = this.enemigos[indice];
      enemigo.updateEnemigo(this.jugador);
      this.colisionarObjeto(enemigo);
      this.jugador.checkEnemigoRangoAtaque(enemigo);
      if(enemigo.vida <= 0) {//mientras este vivo se mqantiene en el arreglo el enemigo, en caso de no estarlo cambia a otro, solo por cuestiones esteticas
        enemigo.muerto = true;
        enemigo.updateEnemigo(this.jugador);
        this.enemigosMuertos.push(this.enemigos[indice]);
        this.enemigos.splice(this.enemigos.indexOf(enemigo), 1);
      }
      if(enemigo.vidaActual > enemigo.vida) enemigo.vidaActual -=1;
    }

    for (let indice = this.enemigosMuertos.length - 1; indice > -1; -- indice) {
      let enemigo = this.enemigosMuertos[indice];
      enemigo.updateEnemigo(this.jugador);
    }

    for(let indice = this.puertas.length - 1; indice > -1; -- indice) {

      let puerta = this.puertas[indice];

      if (puerta.colisionarObjetoCentro(this.jugador)) {

        this.puerta = puerta;

      };

    }
    this.jugador.updatePosition(this.friccion, this.friccion);

    this.colisionarObjeto(this.jugador);
    if(this.jugador.vida <= 0){
      this.jugador.muerto = true;
      this.jugador.vida = 0;


    }
    if(this.jugador.vidaActual > this.jugador.vida) this.jugador.vidaActual -=1;
    this.jugador.updateAnimation();
  }

};
