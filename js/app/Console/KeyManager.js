'use strict'
/**
 * class ConsoleKeyManager
 * -----------------------
 * Gestion des touches (évènements) dans la console. Ce sont tous
 * les gestionnaires d'évènements clavier (keyup, keydown, keypress)
 * 
 */

class ConsoleKeyManager {

  constructor(uiconsole){
    this.uiconsole = uiconsole // la console
    console.log("this.uiconsole", this.uiconsole)
  }

  /**
  * Raccourci pour le Console.CommandManager
  */
  get cm(){
    return this._cm || (this._cm = this.uiconsole.CommandManager )
  }

  /**
  * Valeur courante de la commande en console
  */
  get consoleValue(){
    return this.uiconsole.field.value.trim()
  }

  /**
   * Méthode appelée quand on joue la touche retour chariot dans la
   * console.
   * Cela, principalement, exécute le code
   * 
   */
  onKeyUp(e){

    /**
    * Soumission de la commande tapée en console
    */
    if ( e.key == 'Enter') {    
      e.preventDefault()
      this.cm.onSubmit(e, this.consoleValue )
      return stopEvent(e)
    }

    this.uiconsole.TooltipManager.displayTooltipFor(this.consoleValue)
  
  }

  onKeyDown(e){
    switch(e.key){
    case 'ArrowRight':
      if      ( e.ctrlKey ) return this.cm.moveWordToRight(e)
      else if ( e.metaKey ) return this.cm.selectNextWordOrFirst(e)
      break
    case 'ArrowLeft':
      if      ( e.ctrlKey ) return this.cm.moveWordToLeft(e) 
      else if ( e.metaKey ) return this.cm.selectPreviousWordOrFirst(e)
      break
    case 'ArrowTop':
      e.preventDefault()
      this.cm.backwardCommandHistory()
      return stopEvent(e)
    case 'ArrowDown':
      e.preventDefault()
      this.cm.forwardCommandHistory()
      return stopEvent(e)
    case 'Backspace':
      if ( e.metaKey ) {
        /*
        | Effacement arrière + Cmd => vider la console
        */
        e.preventDefault()
        this.cm.nettoieConsole()
        return stopEvent(e)
      }
      break
    default:
      // console.log("-> onkeydown", {key:e.key, shift:e.shiftKey, alt:e.altKey, cmd:e.metaKey, ctrl:e.ctrlKey})          
    }
  }

}
