
window.addEventListener("load", function(event) {

  "use strict";
  comenzarContador();
      //////////////////
    /// constantes ///
  //////////////////
  const PREFIJO_ZONA = "js/zone";
  const SUFIJO_ZONA = ".json";
      /////////////////
    //// Clases /////
  /////////////////

  class Particle {
    constructor(x, y, radius, color) {
      this.radius = radius;
      this.reset(x, y, color);
    }
    reset(x, y, color) {
      this.color = color;
      this.x = x;
      this.y = y;
      let dirY = Math.random() < 0.5 ? 3 : -3;
      let dirX = Math.random() < 0.5 ? 3 : -3;
      this.vx = Math.random() * dirX;
      this.vy = Math.random() * + dirY ;
      this.a = .05;
    }
    updatePosition() {
      this.a -= 0.01;
      this.x += this.vx;
      this.y += this.vy;
    }
  }
  const GestorAssets = function() {

    this.imagenTileSet = undefined;//la imagen que contiene los tiles del mapa

  };
  GestorAssets.prototype = {

    constructor: Juego.GestorAssets,
    //con este metodo se obtiene el JSON contenedor del mapa
    solicitarJSON:function(url, callback) {

      let request = new XMLHttpRequest();// se crea un XMLHttpRequest por esta razon el juego solo anda ejecutandolo en un servidor

      request.addEventListener("load", function(event) {
        //pasar de JSON a JS
        callback(JSON.parse(this.responseText));

      }, { once:true });

      request.open("GET", url);//obtiene el JSON indicado
      request.send();// y lo devuelve

    },
    //para obtener la imagen
    solicitarImagen:function(url, callback) {

      let imagen = new Image();

      imagen.addEventListener("load", function(event) {

        callback(imagen);

      }, { once:true });

      imagen.src = url;

    },

  };

      ///////////////////
    //// Funciones ////
  ///////////////////

  function comenzarContador() {
    tiempoDeInicio = new Date();
  };

  function actualizarContador() {
    tiempoFinal = new Date();
    var diferenciaTiempo = tiempoFinal - tiempoDeInicio;//milisegundos 
    diferenciaTiempo /= 1000;//paso a segundos
    return Math.round(diferenciaTiempo * 100) / 100;
  }
  function spawnParticulas(target, color){
    console.log("gg");
    for (let index = 0; index < 3; ++ index) {
      let particle = pool.pop();
      if (particle != undefined) {
        particle.reset(target.x, target.y+5, color);
        particles.push(particle);
      } else {
        particles.push(new Particle(target.x, target.y+5, Math.floor(Math.random() * 5 + 5), color));
      }
    }
  }
  function mostrarBarraDeVida(objeto){
    var color = "#4aff7a";
    //no es importante para le juego pero segun la cantidad de vida el color de la barra va cambiando
    if(objeto.vidaActual >= 75) color = "#4aff7a";
    else if(objeto.vidaActual <75 && objeto.vidaActual >= 50) color = "#deff4a";
    else if(objeto.vidaActual < 50 && objeto.vidaActual >= 25) color = "#ffa84a";
    else if(objeto.vidaActual < 25)color = "#ff4d4a";

    //Barra negra de fondo
    display.buffer.fillStyle="#262523";
    display.buffer.fillRect( Math.floor(objeto.x-4), Math.floor(objeto.y -8),15,2);
    //barra roja que decrese hasta llegar al valor de vida
    display.buffer.fillStyle="#ff4d4a";
    display.buffer.fillRect( Math.floor(objeto.x-4), Math.floor(objeto.y -8),(objeto.vidaActual/100)*15  ,2);
    display.buffer.fillStyle=color;
    //barra que muestra la vida hasta que tiene que llegar la vida actual
    display.buffer.fillRect( Math.floor(objeto.x-4), Math.floor(objeto.y -8),(objeto.vida/100)*15,2);
    display.buffer.fillStyle="#ffffff";
  }

  function volverACargar(){
    motor.parar();

    gestorAssets.solicitarJSON(PREFIJO_ZONA + "00" + SUFIJO_ZONA, (zona) => {

      juego.mundo.preparar(zona);

      motor.comenzar();

    });
    juego.mundo.jugador.resetPropiedades();
  }

  function keyDownUp (event){
    controlador.keyDownUp(event.type, event.keyCode);
  }

  function redimensionar(event){
    display.redimensionar(document.documentElement.clientWidth, document.documentElement.clientHeight, juego.mundo.height / juego.mundo.width);
    display.render();
    var rectangle = display.contexto.canvas.getBoundingClientRect();
  }//funcion para  redimensionar el canvas

  function render(){
    var frame = undefined;

    if(juego.mundo.jugador.danioRecibido && !juego.mundo.jugador.muerto){//si esta recibiendo daño y todavia no se murio
      display.temblar(5);
    } 
    display.dibujarMapa   (gestorAssets.imagenTileSet,
    10, juego.mundo.mapaGrafico, juego.mundo.columnas,  juego.mundo.tile_set.tamanioTile);//dibuja el mapa

    //-------- TRAMPAS ---------------
    for (let indice = juego.mundo.trampas.length - 1; indice > -1; -- indice) {

      let trampa = juego.mundo.trampas[indice];//se obtiene la trampa

      frame = juego.mundo.tile_set.frames[trampa.valorFrame];//las imagenes que se van a dibujar

      display.dibujarObjeto(gestorAssets.imagenTileSet,
      frame.x, frame.y,
      trampa.x + Math.floor(trampa.width * 0.5 - frame.width * 0.5) + frame.offset_x,
      trampa.y + frame.offset_y, frame.width, frame.height);
    }//dibuja las trampas que estan dentro del arreglo

    //-------- ENEMIGOS MUERTOS---------------
    for (let indice = juego.mundo.enemigosMuertos.length - 1; indice > -1; -- indice) {
      
      let enemigo = juego.mundo.enemigosMuertos[indice];
      frame = juego.mundo.tile_set.frames[enemigo.valorFrame];

      display.dibujarObjeto(gestorAssets.imagenTileSet,
      frame.x, frame.y,
      Math.floor(enemigo.x + enemigo.width * 0.5 - frame.width * 0.5) + frame.offset_x,
      Math.floor(enemigo.y + frame.offset_y), frame.width, frame.height);
    }
    //-------- ENEMIGOS VIVOS---------------
    for (let indice = juego.mundo.enemigos.length - 1; indice > -1; -- indice) {

      let enemigo = juego.mundo.enemigos[indice];
      frame = juego.mundo.tile_set.frames[enemigo.valorFrame];

      display.dibujarObjeto(gestorAssets.imagenTileSet,
      frame.x, frame.y,
      Math.floor(enemigo.x + enemigo.width * 0.5 - frame.width * 0.5) + frame.offset_x,
      Math.floor(enemigo.y + frame.offset_y), frame.width, frame.height);
      if(enemigo.danioRecibido) spawnParticulas(enemigo, "#ffffff")
      mostrarBarraDeVida(enemigo);
    }//lo mismo que las trampas

    //-------- JUGADOR ---------------
    frame = juego.mundo.tile_set.frames[juego.mundo.jugador.valorFrame];

    display.dibujarObjeto(gestorAssets.imagenTileSet,
    frame.x, frame.y,
    juego.mundo.jugador.x + Math.floor(juego.mundo.jugador.width * 0.5 - frame.width * 0.5) + frame.offset_x,
    juego.mundo.jugador.y + frame.offset_y, frame.width, frame.height);  

    mostrarBarraDeVida(juego.mundo.jugador);
    //----------- Particulas -------------
    if(juego.mundo.jugador.danioRecibido && !juego.mundo.jugador.muerto){
      spawnParticulas(juego.mundo.jugador, "#fc0f03");
    }
    for (let index = particles.length - 1; index > -1; -- index) {
      let particle = particles[index];
      particle.updatePosition();
      if (particle.a <= 0) pool.push(particles.splice(index, 1)[0]);
      display.buffer.beginPath();
      display.buffer.fillRect(Math.floor(particle.x), Math.floor(particle.y), 3, 3);
      display.buffer.fillStyle = particle.color;
      display.buffer.fill();
      display.buffer.closePath();
    }
    p.innerHTML = "Tiempo: " + tiempoContador;

    if (juego.mundo.juegoTerminado) {
      score.innerHTML = "Has completado el juego en:" + tiempoContador + " segundos";
      document.getElementById("divFinal").style.display = "block";
      musicaPrincipal.pause();
    } 
    display.render();// y se dibuja todo
    display.postTemblado();
  }
  function update(){//bucle del juego
    //segun la accion realizada se invoca la funcion debidas
    if(esChrome){
      if(controlador.pausa.active) {
        musicaPrincipal.pause();
        pausado = !pausado;
        controlador.pausa.active = false;
        var x = document.getElementById("myDIV");
        if (x.style.display === "block") {
          x.style.display = "none";
        } else {
          x.style.display = "block";
        }
      } 
      if(!pausado && !juego.mundo.juegoTerminado){
        musicaPrincipal.play();
        tiempoContador = actualizarContador();
        if(juego.mundo.jugador.muerto == false && !juego.mundo.jugador.atacando ){//reliza las acciones del jugador segun la tecla apretada
          if(juego.mundo.jugador.x <= 0) juego.mundo.jugador.x = 0; //para que no se salga de la pantalla 
          if(juego.mundo.jugador.x >= display.buffer.canvas.width) juego.mundo.jugador.x = display.buffer.canvas.width;
          if (controlador.abajo.active) juego.mundo.jugador.caminarAbajo();
          else if (controlador.arriba.active) juego.mundo.jugador.caminarArriba();
  
          if (controlador.izquierda.active) juego.mundo.jugador.caminarIzquierda ();
          else if (controlador.derecha.active) juego.mundo.jugador.caminarDerecha();
  
          if (controlador.ataque.active && !juego.mundo.jugador.danioRecibido) { hit.playbackRate = Math.random() * 1.2 + .8;hit.play(); juego.mundo.jugador.atacar();controlador.ataque.active = false;}
        }
        if(juego.mundo.jugador.danioRecibido){ hit.volume = 1 ;hit.playbackRate = Math.random() * .7 + .4;hit.play();} 
        console.log(hit.playbackRate);
        //codigo de las puertas, si paso por una puerta se detiene el motor, se carga un json de la sigiente zona, se carga el mundo y se vuelve a iniciar el motor
        if (juego.mundo.puerta) {
  
          motor.parar();
  
          gestorAssets.solicitarJSON(PREFIJO_ZONA + juego.mundo.puerta.zonaDestino + SUFIJO_ZONA, (zona) => {
  
            juego.mundo.preparar(zona);
  
            motor.comenzar();
  
          });
  
          return;
  
        }
        
        if(juego.mundo.jugador.muerteTerminada) volverACargar(); //si el jugador murio, vuelvo a cargar el juego
  
        juego.update();
      }
      
    }else{//si no usa chrome muestra una alerta y no se puede jugar al
      alert("Se necesita usar chrome para jugar");
    }
  }


      /////////////////
    //// objetos ////
  /////////////////
  var tiempoDeInicio, tiempoFinal, tiempoContador;
  var gestorAssets = new GestorAssets();
  var controlador     = new Controlador();
  var display        = new Display(document.querySelector("canvas"));
  var juego           = new Juego();
  var motor         = new Motor(1000/30, update, render);
  var pausado = false;
  var esChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var pool      = new Array();
  var particles = new Array();
  var musicaPrincipal = new Audio("./sonidos/temaPrincipal.mp3");
  musicaPrincipal.volume = 0.25;
  var hit = new Audio( './sonidos/hit.wav');
  hit.loop = false;
  hit.volume = .5;
  var p              = document.createElement("p");
  var score = this.document.getElementById("score");
  p.setAttribute("style", "color:#c07000; font-size:2.0em; position:fixed;");
  p.innerHTML = "Tiempo: 0";
  document.body.appendChild(p);
      //////////////////////
    /// inicialización ///
  //////////////////////
  display.buffer.canvas.height = juego.mundo.height;
  display.buffer.canvas.width  = juego.mundo.width;
  display.buffer.imageSmoothingEnabled = false;

  gestorAssets.solicitarJSON(PREFIJO_ZONA + juego.mundo.zona_id + SUFIJO_ZONA, (zona) => {

    juego.mundo.preparar(zona);

    gestorAssets.solicitarImagen("css/imagenes/TileSet.png", (image) => {

      gestorAssets.imagenTileSet = image;

      redimensionar();
      motor.comenzar();

    });

  });

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup"  , keyDownUp);
  window.addEventListener("resize" , redimensionar);
});
