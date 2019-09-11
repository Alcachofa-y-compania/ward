
const Controlador = function() {
//los controles que se van a usar
  this.izquierda  = new Controlador.ButtonInput();
  this.derecha = new Controlador.ButtonInput();
  this.arriba    = new Controlador.ButtonInput();
  this.abajo    = new Controlador.ButtonInput();
  this.ataque    = new Controlador.ButtonInput();
  this.pausa = new Controlador.ButtonInput();
  this.keyDownUp = function(type, key_code) {
//si se esta presionando alguna tecla
    var down = (type == "keydown") ? true : false;

    switch(key_code) {
      //asignacion ascii para cada tecla
      case 27: this.pausa.getInput(down); break;
      case 37: this.izquierda.getInput(down);  break;
      case 38: this.arriba.getInput(down);    break;
      case 39: this.derecha.getInput(down); break;
      case 40: this.abajo.getInput(down); break;
      case 32: this.ataque.getInput(down);   break;
    }

  };

};
Controlador.prototype = {

  constructor : Controlador

};

Controlador.ButtonInput = function() {

  this.active = this.down = false;

};

Controlador.ButtonInput.prototype = {

  constructor : Controlador.ButtonInput,

  getInput : function(down) {
    /*basicamente si aprieto una tecla y antes no la estaba apretando active es true
      y si no la estoy apretando y antes si active es false, active es la variable que se utiliza
      para checkear cuando estamos apretando alguna tecla */
    if (this.down != down) this.active = down;
    this.down = down;

  }

};
