'use strict';

class Preferences {

  /**
   * On initialise avec les valeurs par défaut
   * 
   * (TODO plus tard, il faudra que ça dépende de l'application)
   * 
   */
  static init(){
    this.table = {
        prox_max: 1000
      , max_prox: 1000
      , maxProx:  1000
      , proxMax:  1000
    }
  }

}
Preferences.init()
const PREFS = Preferences.table
