'use strict'
/**
 * class ConsoleToolTipsManager
 * ----------------------------
 * Pour gérer les "tooltips" de la console, c'est-à-dire l'affichage
 * qui donne en direct des informations sur la commande courante, à
 * commencer par l'effet de la première lettre.
 * 
 */
class ConsoleToolTipsManager {
  constructor(uiconsole){
    this.uiconsole = uniconsole
  }

  /**
  * Affichage du tooltip pour la commande +cmd+
  */
  displayTooltipFor(cmd){

  }


  get obj(){
    return this._obj || (this._obj = DGet('console-tooltip'))
  }
}
