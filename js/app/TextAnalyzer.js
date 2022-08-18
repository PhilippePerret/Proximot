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
  constructor(itexte){
    this.itexte = itexte
  }

  /**
   * Méthode principale qui procède à l'analyse du texte
   * à partir des mots fournis.
   */
  proceedWithMots(mots){
    /*
    | Pour benchmarker, pour le moment, on va le faire sous les
    | deux formes de recherche : mot par mot ou texte entier d'un
    | coup
    */
    mots.map(texel => {
      const nlp = new NLP(texel.mot)
      texel.lemmatisation = nlp.lemmatizer()[0]
      console.log("texel '%s', lemmatisation : ", texel.mot, texel.lemmatisation)
    })

    const table_mots_courants = {}
    var cursor = 0
    mots.forEach( mot => {
      /*
      |  On prend le lemma du mot
      */
      const lemma = mot.lemmatisation.lemma
      /*
      | On définit la position du mot (dans le fragment)
      */
      mot.relPos = cursor
      /*
      | Ce mot entre-t-il en proximité avec un des mots courants ?
      */
      if ( undefined != table_mots_courants[lemma] ) {
        // TODO ADD PROXIMITÉ
        // TODO
        console.warn("Je dois apprendre à faire une proximité (%s / %s)", mot.mot, lemma)
        table_mots_courants[lemma].push(mot)
      } else {
        // Sinon, on l'ajoute à la liste
        Object.assign(table_mots_courants, {[lemma]: [mot]})
      }
      /*
      | Nouveau curseur
      */
      cursor += mot.mot.length
      /*
      | Retirer de la table des mots courants les mots qui sont
      | maintenant trop loin.
      */
      for (var clemma in table_mots_courants) {
        const dlemma = table_mots_courants[clemma]
        const newAry = []
        dlemma.forEach( mot => {
          if ( mot.relPos + PROX_MIN > cursor) {
            newAry.push(mot)
          }
        })
        if ( newAry.length ) {
          // Il reste des mots avec ce lemma => on consigne la
          // nouvelle liste de mot en cours
          table_mots_courants[clemma] = newAry
        } else {
          // Il n'y a plus de mots avec ce lemma => on le supprime
          // de la table des mots courants
          delete table_mots_courants[clemma]
        }
      }
    })
    
  }
  proceedWithText(text){
    const nlp = new NLP(text)
    const lemmas = nlp.lemmatizer()
    console.log("Lemmatizer par texte : ", lemmas)
    return lemmas
  }


  /**
   * Tous les mots du texte, dans l'ordre
   * 
   */

}
