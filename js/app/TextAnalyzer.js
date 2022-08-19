'use strict'
/**
 * class TextAnalyzer
 * -------------------
 * Pour l'analyse proprement dite du texte.
 * 
 */

const PROX_MIN = 100

class TextAnalyzer {

  /**
   * Instanciation à l'aide d'une instance {Texte} du texte courant
   * 
   */
  constructor(textFragment){
    this.textFragment = textFragment
  }

  /**
   * Méthode principale qui procède à l'analyse du texte
   * à partir des mots fournis.
   * 
   * Cette analyse consiste à déterminer le {Lemmas} du fragment de
   * texte (c'est-à-dire l'ensemble de ses lemmas) et chaque Lemma
   * séparément pour pouvoir en tirer les proximités.
   */
  proceed(){
    /*
    |   Boucle sur le mots pour déterminer leur position relative
    |   dans le fragment et l'ajouter aux lemmas du fragment
    */
    var cursor = 0
    this.textFragment.mots.forEach(mot => {
      console.log("Étude du mot '%s'", mot.mot, mot)
      mot.relPos = cursor
      const lemma = this.textFragment.getLemma(mot.lemma)
      lemma.addMot(mot)
      cursor += mot.length
    })    
  }

}
