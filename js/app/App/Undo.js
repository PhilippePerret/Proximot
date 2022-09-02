'use strict';
/**
* Tout ce qui concerne l'annulation
*/
class AppUndo {
  // ###########    MÉTHODES D'ANNULATION     #############
  static destroy_mot(mot){
    console.warn("Je dois apprendre à annuler la destruction d'un mot.")
  }

  // ###########      DATA      ################
  static get Data(){
      return {
      'DESTROY'   : {hname:'Destruction'}
    , 'CREATE'    : {hname:'Création'}
  }

  }
}

App.Undo = AppUndo
