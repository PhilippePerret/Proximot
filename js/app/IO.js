'use strict';
/**
 * class IO
 * --------
 * Pour entrée et sortie, gestion des fichiers
 * 
 */
class IO {

  /**
   * Méthode principale sauvant tout le fichier courant
   * C'est-à-dire :
   * - les fragments (index des paragraphes)
   * - les paragraphes (index des mots ou id)
   * - les mots
   * - les préférences
   * - l'historique des commandes
   * 
   * La sauvegarde se fait de façon séquentielle pour ne pas
   * surcharger les envois. Elle est reçue et opérée côté serveur
   * par la classe IO.rb
   * 
   */
  static saveAll(texte){
    /*
    |  La pile dans laquelle on va mettre toutes les choses à
    |  faire.
    */
    this.stack = []

    /* Ouverture du fichier */
    this.addToStack('start', null, null)

    /* État de l'application */
    this.addToStack('app_state', App.state2save(texte), 'simple_object' )
    
    /* Préférences */
    this.addToStack('preferences', Preferences.getValues(), 'simple_object')

    /* Historique des commandes de console */
    this.addToStack('console_history', Console.HistoryManager.getHistory(), 'simple_list')

    /* Enregistrement des proximités */
    this.addToStack('proximities', Proximity.getData(), 'list_of_objects')

    /* Le texte et ses modifications */
    this.saveMotsOf(texte)

    /* Fermeture du fichier */
    this.addToStack('end', null, null)

    /*
    | On démarre l'envoi des données de la pile
    */
    this.sendDataInStack()
  }

  static addToStack(name, data, type){
    this.stack.push({dataName: name, data: data, dataType: type})
  }

  /**
   * Pour commencer à envoyer les données dans la pile
   * 
   */
  static sendDataInStack(){
    const data = this.stack.shift()
    if ( undefined == data ) {
      // C'est la fin
      return
    } else {
      console.log("Data envoyées à save_in_current : ", data)
      WAA.send({class:'Proximot::IO',method:'save_in_current', data:data})
    }
  }
  static onReceivedData(data){
    if ( data.ok ) {
      // C'est bon, on poursuit
      this.sendDataInStack()
    } else {
      erreur("Une erreur est survenue lors de l'enregistrement : " + data.error)
    }
  }

// Private Methods

  /*
  | ENREGISTREMENT DES MOTS 
  |
  | Par tranche de 3000 mots
  */
  static saveMotsOf(texte) {
    var iCountMots = 0

    this.addToStack('start_section', 'fragments', null)

    var firstParagIndex = null
      , lastParagIndex  = null
      , dataParags = [] // les données DES paragraphes
      , dataParag  = {id:null, mots:[]} // les données DU paragraphe
    texte.paragraphs.forEach( paragraph => {
      if ( firstParagIndex === null ) firstParagIndex = paragraph.index
      lastParagIndex  = paragraph.index // toujours
      dataParag.id    = paragraph.index
      paragraph.mots.forEach( mot => {
        dataParag.mots.push(mot.data2save)
        ++iCountMots
      })
      dataParags.push(dataParag)
      dataParag = {id: null, mots:[]}
      if ( iCountMots > 5000 ) {
        this.addToStack('fragment', {id: `${firstParagIndex}-${lastParagIndex}`, paragraphs:dataParags}, 'complex')
        dataParags  = []
        iCountMots  = 0
      }
    })
    if ( dataParag.mots.length  ) { dataParags.push(dataParag) }
    if ( dataParags.length ) {
      this.addToStack('fragment', {id:`${firstParagIndex}-${lastParagIndex}`, paragraphs:dataParags}, 'complex')
    }

    this.addToStack('end_section', 'fragments', null)

  }



}
