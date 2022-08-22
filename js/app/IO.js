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
    console.warn("J'apprends à enregistrer un fichier Proximot.")
    this.stack = []

    /*
    | On boucle sur tous les éléments pour les mettres dans la pile
    */

    this.addToStack('start', null, null)

    this.addToStack('app_state', App.state2save(texte), 'simple_object' )
    
    this.addToStack('preferences', Preferences.getValues(), 'simple_object')

    this.addToStack('console_history', Console.history2save(), 'simple_list')

    // // Enregistrement des proximités
    this.addToStack('proximities', Proximity.getData2save(), 'list_of_objects')

    // this.saveMotsOf(texte)

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

    var firstParagIndex = null
      , lastParagIndex  = null
      , dataParags = [] // les données DES paragraphes
      , dataParag  = [] // les données DU paragraphe
    texte.paragraphs.forEach( paragraph => {
      if ( firstParagIndex === null ) firstParagIndex = paragraph.index
      lastParagIndex = paragraph.index // toujours
      paragraph.mots.forEach( mot => {
        dataParag.push(mot.data2save)
        ++iCountMots
      })
      dataParags.push(dataParag)
      dataParag = []
      if ( iCountMots > 5000 ) {
        this.addToStack(`paragraphs-${firstParagIndex}-${lastParagIndex}`, dataParags)
        dataParags  = []
        iCountMots   = 0
      }
    })
    if ( dataParag.length  ) { dataParags.push(dataParag) }
    if ( dataParags.length ) {
      this.addToStack(`paragraphs-${firstParagIndex}-${lastParagIndex}`, dataParags)
    }
  }



}
