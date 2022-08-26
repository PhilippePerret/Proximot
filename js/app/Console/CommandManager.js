'use strict'
/**
 * class ConsoleCommandManager
 * ---------------------------
 * Gestionnaire de commandes de la console. C'est d'ici que sont 
 * lancés toutes les commandes tapées en console dès que la touche
 * Entrée est pressée (soumission de la commande.
 * 
 */
class ConsoleCommandManager {

  constructor(conso){
    this.console = conso // Console
  }

  /**
   * Touche Enter => 
   * 
   * Méthode principale appelée quand on soumet la command console à
   * l'aide de la touche Entrée
   * 
   */
  onSubmit(e, command){
    console.info("Soumission de la command '%s'", command)

    var value ;
    const init_command = command

    /*
    |  Décomposition de la commande et sa valeur
    */
    if ( command.match(' ') ) {
      value = command.split(' ')
      command = value.shift()
      value   = value.join(' ')
      if ( value.trim() == '' ){ value = null }
    }

    switch(command){
    // --- COMMANDES GÉNÉRALES ---
    case 'aide': case 'help':
      console.warn("Je dois apprendre à afficher l'aide.")
      break
    // --- COMMANDES FICHIER ---
    case 'f': // Donne des informations sur le fichier
      console.warn("Je dois apprendre à donner des informations sur le fichier.")
      break
    case 'fo': // ouvrir un fichier texte
      console.warn("Je dois apprendre à ouvrir un fichier Proximot (ou autre).")
      break
    case 'fw': case 'w': // enregistrer le fichier courant
      IO.saveAll({save_as: value, saving_step:'app_state'})
      break
    case 'fwt': // enregistrer seulement le texte dans un fichier
      Texte.current.saveAsText(value)
      break

    case 'i': // information
      console.warn("Je dois apprendre à afficher les informations sur le mot.")
      this.currentMot.showInfos()
      break

    case 'ig': case 'ignore': // ignorer les proximités de la sélection
      console.warn("Je dois apprendre à ignorer la proximité courante")
      break

    case 'igl': case 'ignore-left': // ignorer la proximité left (gauche)
      console.warn("Je dois apprendre à ignorer la proximité gauche de la sélection")
      break

    case 'igr': case 'ignore-right': // ignorer la proximité left (gauche)
      console.warn("Je dois apprendre à ignorer la proximité droite de la sélection")
      break

    case 'ig*': case 'ignore*': // ignorer toutes les proximités
      console.warn("Je dois apprendre à ignorer toutes les proximités de même type")
      break
    
    case 'n': // prochaine proximité
      console.warn("Je dois apprendre à afficher la prochaine proximité.")
      break

    case 'nl': // sélectionner le mot en proximité gauche
      if ( this.currentMot.proxAvant ) {
        Editor.Selection.set(this.currentMot.proxAvant)
      } else {
        erreur("La sélection n'a pas de proximité avant.")
      }
      break

    case 'nr': // sélectionner le mot en proximité gauche
      if ( this.currentMot.proxApres ) {
        Editor.Selection.set(this.currentMot.proxApres)
      } else {
        erreur("La sélection n'a pas de proximité après.")
      }
      break

    case 'pref': // générique pour "préférences"
      Preferences.set(...value.split(' '))
      break

    case 'r': // remplacement
      this.currentMot.replaceContentWith(value)
      break

    case 'r*': // remplacer tous
      console.warn("Je dois apprendre à “remplacer tous”")
      break
    
    case 's': // sélection
      const index = parseInt(value,10)
      const indexMotCurrent = this.currentMot ? this.currentMot.index : 0
      let indexMot ;
      if ( value.substring(0,1) == '+' ) {
        indexMot = indexMotCurrent + index
      } else if ( value.substring(0,1) == '-' ) {
        indexMot = indexMotCurrent - index
      } else if ( NaN(index) ) {
        /* Rechercher le premier mot contenant la valeur donnée */
        return Editor.selectFirstWordWith({text:value})
      } else {
        indexMot = index
      }
      Editor.Selection.set( Editor.mots[indexMot] )
      break
    
    case '/': // recherche et sélectionne
      Editor.selectFirstWordWith({text:value})
      break

    case '/*': // recherche tous
      console.warn("Je dois apprendre à sélectionner tous les mots d'une recherche.")
      break

    } // switch(command)

    /*
    | La commande a pu être jouée, on la mémorise et on l'efface
    | dans la console.
    */
    this.nettoieConsole()
    this.hm.addToCommandHistory(init_command)
  }


  get currentMot(){
    return Editor.Selection.current
  }

  //########## COMMANDES SUR L'HISTORIQUE DES COMMANDES ############

  /**
  * Raccourci vers le manager d'historique des commandes
  * (Console.HistoryManager)
  */
  get hm(){
    return this._hm || (this._htm = this.console.HistoryManager)
  }
  /* Raccourcis  */
  forwardCommandHistory(){ return this.hm.forwardCommandHistory()}
  backwardCommandHistory(){return this.hm.backwardCommandHistory()}


  //############ COMMANDES SUR L'OBJET CONSOLE ######################
  /**
  * Nettoyer la console
  */
  nettoieConsole(){
    this.console.value = ''
  }

  /* Sélectionner mot suivant ou premier */
  selectNextWordOrFirst(e){
    e.preventDefault()
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

  /* Sélectionner mot précédent ou premier */
  selectPreviousWordOrFirst(e){
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

  /* Déplacer la sélection vers la gauche */
  moveWordToLeft(e){
    e.preventDefault()
    if ( this.currentMot ) { Editor.moveTexel(this.currentMot, 'left') }
    else { erreur("Il faut choisir le mot à déplacer.") }
    return stopEvent(e)
  }

  /* Déplacer la sélection vers la droite */
  moveWordToRight(e){
    e.preventDefault()
    if ( this.currentMot ) { Editor.moveTexel(this.currentMot, 'right') }
    else { erreur("Il faut choisir le mot à déplacer.") }
    return stopEvent(e)
  }

}
