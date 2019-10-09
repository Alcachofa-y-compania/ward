
//la parte mas importante del juego, donde se controla el tiempo y los pixeles por segundos
const Motor = function(pasoTiempo, update, render) {
  //si pasoTiempo = 1000/30 significa que el juego va a ir a 30 pixeles por segundo
  this.tiempoAcumulado        = 0; // la cantidad de tiempo acumulado desde el ultimo update.
  this.solicitudFrameAnimacion = undefined, // Referencia al animation frame request
  this.tiempo                    = undefined, //el mas reciente selloTiempo de la ejecucion del loop 
  this.pasoTiempo               = pasoTiempo,

  this.updated = false;//si la funcion update fue llamada desde el ultimo ciclo

  this.update = update;//la funcion update
  this.render = render;//la funcion render

  this.ejecutar = function(selloTiempo) {//esto es un ciclo del bucle del juego

    this.solicitudFrameAnimacion = window.requestAnimationFrame(this.handleRun);

    this.tiempoAcumulado += selloTiempo - this.tiempo;
    this.tiempo = selloTiempo;

    /*Si el dispositivo es muy lento, las actualizaciones toman mas tiempo que el pasoTiempo.
    si este es el caso,  puede congelar el juego y sobrecargar el cpu, para prevenirlo 
    nunca se deja pasar 3 frames completos sin actualizar*/
    if (this.tiempoAcumulado >= this.pasoTiempo * 3) {

      this.tiempoAcumulado = this.pasoTiempo;

    }
     /*desde que solo podemos actualizar cuando la pantalla este lista para dibujar y 
     solicitudFrameAnimacion llama la funcion ejecutar, hay que hacer un seguimiento de 
     cuanto tiempo paso. Se guarda el tiempo acumulado y se prueba si paso lo suficiente para
     una actualizacion. */
    while(this.tiempoAcumulado >= this.pasoTiempo) {

      this.tiempoAcumulado -= this.pasoTiempo;

      this.update(selloTiempo);

      this.updated = true;// si el juego fue actualizado, se necesita dibujar otra vez.

    }
    /* nos permite dibujar solo cuando el juego fue actualizado. */
    if (this.updated) {

      this.updated = false; 
      this.render(selloTiempo);

    }

  };

  this.handleRun = (pasoTiempo) => { this.ejecutar(pasoTiempo); };

};

Motor.prototype = {

  constructor:Motor,

  comenzar:function() {

    this.tiempoAcumulado = this.pasoTiempo;
    this.tiempo = window.performance.now();
    this.solicitudFrameAnimacion = window.requestAnimationFrame(this.handleRun);

  },

  parar:function() { window.cancelAnimationFrame(this.solicitudFrameAnimacion); }

};
