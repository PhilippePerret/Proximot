'use strict';

class ConsoleClass {

  constructor(){
    /*
    | Historique des commandes
    */
    this.history = []
  }

  /**
   * Préparation de la console
   * 
   *
   */
  prepare(){
    this.field.focus()
    this.observe()
  }

  /**
   * Observation de la console
   * 
   */
  observe(){
    this.field.addEventListener('keyup',    this.onKeyUp.bind(this))
    this.field.addEventListener('keydown',  this.onKeyDown.bind(this))
  }

  /**
   * Méthode appelée quand on joue la touche retour chariot dans la
   * console.
   * Cela, principalement, exécute le code
   * 
   */
  onKeyUp(e){
    if ( e.key == 'Enter') {    
      e.preventDefault()
      this.execCommand(this.field.value.trim())
      return stopEvent(e)
    }
  }
  /* ALT + -> */
  treateAltRightArrow(e){
    e.preventDefault()
    // Sélectionner le mot suivant ou le premier
    // Si dernier : signaler
    // SI touche MAJ => ajouter à la sélection
    // SINON Mettre à la sélection
    if ( Editor.Selection.isEmpty ) {
      // Aucune sélection => sélectionner le premier mot
      Editor.selectMotByIndex(0)
    } else if ( Editor.Selection.last.index < Editor.lastAvailableIndex ) {
      Editor.selectMotByIndex(Editor.Selection.last.index + 1)
    } else {
      message("C'est le dernier mot !")
    }
    return stopEvent(e)
  }
  /* ALT + <- */
  treateAltLeftArrow(e){
    e.preventDefault()
    if ( Editor.Selection.isEmpty ) {
      // Aucune sélection => sélection le premier mot
      Editor.selectMotByIndex(0)
    } else if (Editor.Selection.last.index > 0) {
      // Sélection du mot précédent
      Editor.selectMotByIndex(Editor.Selection.last.index - 1)
    } else {
      // Pas de mot avant
      message("C'est le premier mot !")
    }
    return stopEvent(e)
  }
  /* CMD + <- */
  treateCmdLeftArrow(e){
    e.preventDefault()
    if ( this.curMot ) { Editor.moveTexel(this.curMot, 'left') }
    else { erreur("Il faut choisir le mot à déplacer.") }
    return stopEvent(e)
  }
  /* CMD + -> */
  treateCmdRightArrow(e){
    e.preventDefault()
    if ( this.curMot ) { Editor.moveTexel(this.curMot, 'right') }
    else { erreur("Il faut choisir le mot à déplacer.") }
    return stopEvent(e)
  }

  onKeyDown(e){
    switch(e.key){
    case 'ArrowRight':
      if ( e.altKey ) return this.treateAltRightArrow(e)
      else if ( e.metaKey ) return this.treateCmdRightArrow(e)
    case 'ArrowLeft':
      if ( e.altKey ) return this.treateAltLeftArrow(e) 
      else if ( e.metaKey ) return this.treateCmdLeftArrow(e)
    case 'ArrowTop':
      e.preventDefault()
      this.BackwardCommandHistory()
      return stopEvent(e)
    case 'ArrowDown':
      e.preventDefault()
      this.ForwardCommandHistory()
      return stopEvent(e)
    case 'Backspace':
      if ( e.metaKey ) {
        /*
        | Effacement arrière + Cmd => vider la console
        */
        e.preventDefault()
        this.value = ''
        return stopEvent(e)
      }
      break
    default:
      // console.log("-> onkeydown", {key:e.key, shift:e.shiftKey, alt:e.altKey, cmd:e.metaKey, ctrl:e.ctrlKey})          
    }
  }


  /*
  | ############  TOUTES LES COMMANDES #############
  */
  execCommand(command){
    var value ;

    if ( command.match(' ') ) {
      value = command.split(' ')
      command = value.shift()
      value   = value.join(' ')
    }

    switch(command){
    
    case 'n': // prochaine proximité du mot courant
      Editor.Selection.set(this.curMot.proxAfter.motAfter)
      break
    
    case 'r': // remplacement
      return this.curMot.replaceContentWith(value)
    
    case 's': // sélection
      const index = parseInt(value,10)
      const indexMotCurrent = this.curMot ? this.curMot.index : 0
      let indexMot ;
      if ( value.substring(0,1) == '+' ) {
        indexMot = indexMotCurrent + index
      } else if ( value.substring(0,1) == '-' ) {
        indexMot = indexMotCurrent - index
      } else {
        indexMot = index
      }
      Editor.Selection.set( Editor.mots[indexMot] )
    
    }//switch(command)

    /*
    | La commande a pu être jouée, on la mémorise et on l'efface
    */
    this.value = ''
    this.addToCommandHistory(command)
  }

  /*
  | ############  HISTORIQUE DES COMMANDES #################
  */

  addToCommandHistory(command){
    this.history.push(command)
    if ( this.maxHistoryIndex > 50 ) {
      this.history.shift()
    }
    this.historyIndex     = this.history.length // toujours 1 de plus
    this.maxHistoryIndex  = parseInt(this.history.length,10)
  }

  /**
    * Remettre la commande suivante de l'historique
    */
  ForwardCommandHistory(){
    if ( this.historyIndex < this.maxHistoryIndex ) {
      ++ this.historyIndex
      this.setCurrentCommandHistory()
    }
  }
  /**
   * Remettre la commande précédente de l'historique des commandes
   */
  BackwardCommandHistory(){
    -- this.historyIndex
    this.setCurrentCommandHistory()
  }
  setCurrentCommandHistory(){
    this.value = this.history[this.historyIndex]
  }

  /*
  | ############    TOUTES LES PROPRIÉTÉS #################
  */
  /** @return le contenu de la console ou le définit */
  get value(){ return this.field.value }
  set value(value) { this.field.value = value }

  /** @return le mot courant sélectionné */
  get curMot(){ return Editor.Selection.last }

  /** @return le champ de saisie (aka la console) */
  get field(){
    return this._field || (this._field = DGet('input#console'))
  }
}
const Console = new ConsoleClass()
