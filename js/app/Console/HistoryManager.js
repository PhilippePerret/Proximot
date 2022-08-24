'use strict';
/**
 * class ConsoleHistoryManager
 * ---------------------------
 * Gestion des l'historique de la console
 * 
 */
class ConsoleHistoryManager {

  constructor(owner){
    this.owner = owner // Console
  }

  prepare(){
    this.history = []
  }

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
  forwardCommandHistory(){
    if ( this.historyIndex < this.maxHistoryIndex ) {
      ++ this.historyIndex
      this.setCurrentCommandHistory()
    }
  }
  /**
   * Remettre la commande précédente de l'historique des commandes
   */
  backwardCommandHistory(){
    -- this.historyIndex
    this.setCurrentCommandHistory()
  }

  /**
   * @return les données de l'historique des commandes à enregistrer
   * 
   */
  history2save(){
    console.info("[history2save] this.history = ", this.history)
    return this.history || []
  }

  /*- private -*/ 

  setCurrentCommandHistory(){
    this.value = this.history[this.historyIndex] || ''
  }

}
