'use strict';
/**
 * class TextFragment
 * ------------------
 * Gestion du fragment de texte actuellement en édition
 * 
 * Portion de 2000 mots pour ne jamais avoir à traiter des textes
 * trop longs.
 * 
 * Composition d'un fragment :
 *    8 pages = 8 x 250 mots
 *    1 page (250 mots) de marge au début et à la fin
 */
class TextFragment {

  /**
   * Instanciation d'un fragment de texte
   * 
   * @param itexte {Texte} Le texte en édition, complet
   * @param paragIndex  {Number} Index 0-start du premier paragraphe
   *                    du fragment (index dans le texte complet)
   * @param paragraphs  {Array of Paragraphs} Instance des paragraphs
   *                    relevés dans le texte.
   */
  constructor(itexte, paragIndex, paragraphs) {
    this.itexte     = itexte
    this.pIndex     = paragIndex
    this.paragraphs = paragraphs
    this.Klass      = 'TextFragment'
  }


  // --- Public Methods ---
  
  /**
   * Affichage des proximités du fragment
   * 
   */
  showProximites(){
    this.mots.forEach( mot => {
      // console.log("[showProximites] Étude du mot ", mot)
      const css = mot.isTooClose.call(mot, this)
      if ( css ) {
        mot.setTooClose(css)
      } else {
        mot.unsetTooClose()
      }
    })
  }

  /**
   * Analyse du fragment
   * -------------------
   * Cela consiste principalement à définir la propriété @lemmas qui
   * contient les @{lemma}s du fragment qui permettron de définir les
   * proximité.
   * 
   */
  analyze(){
    // console.info("Preferences.get('min_word_length') = ", Preferences.get('min_word_length'), typeof Preferences.get('min_word_length'))
    delete this._lemma
    var cursor    = 0
    var indexMot  = 0
    this.mots.forEach( mot => {
      mot.relPos = cursor
      mot.index  = indexMot++
      /*
      | Le mot doit être assez long pour être analysé
      */
      if ( mot.length >= Preferences.get('min_word_length') ) {
        /*
        | Le fragment a-t-il déjà un lemma pour ce mot ? Si ce n'est 
        | pas le cas, on le crée
        */
        this.lemmas.get(mot.lemma).addMot(mot)
      }
      cursor += mot.length
    })
  }

  /**
   * @return le groupe de Lemmas {Lemmas} de lemma +lemma+
   * L'instancie si nécessaire.
   */
  getLemma(lemma) {
    return this.lemmas.get(lemma)
  }

  // --- /Public Methods ---


  /**
   * Gestion des Lemmas du fragment de texte
   * (voir les classes Lemmas et Lemma)
   */
  get lemmas(){
    return this._lemmas || (this._lemmas = new Lemmas(this))
  }

  get mots(){
    return this._mots || (this._mots = this.getMots() )
  }

  get text(){
    return this._text || (this._text = this.getText() )
  }


  // --- Private Methods ---

  getMots(){
    const ary_mots = []
    this.paragraphs.forEach(parag => {
      parag.mots.forEach(mot => ary_mots.push(mot))
    })
    return ary_mots
  }
  getText(){
    const ary = []
    this.paragraphs.forEach(parag => {
      parag.content.forEach(texel => ary.push(texel.content))
    })
    return ary.join('')
  }
}
