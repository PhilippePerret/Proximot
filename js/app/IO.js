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
   * - les fragments    (le fragment courant seulement ?)
   * - les paragraphes  (index des mots ou id)
   * - les mots
   * - les préférences
   * - les proximités   (même si elles pourraient être recalculées)
   * - l'historique des commandes
   * 
   * La sauvegarde se fait de façon séquentielle pour ne pas
   * surcharger les envois. Elle est reçue et opérée côté serveur
   * par la classe miroir IO.rb
   * 
   */
  static saveAll(data){

    let next_step ;

    if (data.error){
      raise("Une erreur est survenue pendant l'enregistrement : " + data.error)
      return 
    }

    switch(data.saving_step){

    case 'app_state':
      data = App.getState()
      next_step = 'preferences'
      break
    
    case 'preferences':
      data = Preferences.getValues()
      next_step = 'console_history'
      break

    case 'console_history':
      data = Console.HistoryManager.getHistory()
      next_step = 'current_fragment'
      break

    case 'current_fragment':
      data = Texte.current.currentFragment.getData()
      next_step = null
      break

    default:
      message("Enregistrement terminé avec succès.")
    }

    Object.assign(data, {data:data, next_step:next_step })
    WAA.send({class:'Proximot::IO',method:'save_in_current', data:data})
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
