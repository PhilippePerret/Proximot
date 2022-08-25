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
  * @return la table des données du fragment (rappel : les données
  * du texte proximisé sont enregistrées par fragment d'environ 3000
  * mots)
  * 
  * Les données consistent en :
  * - un fichier data.yml contenant les informations sur le fragment
  *   et notamment les paragraphes avec la liste des identifiants de
  *   texel
  * - un fichier texels.csv contenant tous les mots et autres
  *   text-elements
  * - un fichier proximities.csv contenant les données des proximités
  *   des mots du fragment.
  */
  getData() {
    const texels = []
        , proximities = []
        , paragraphs = []
        ;

    /*
    |  Boucle sur chaque paragraphe pour en récupérer les données
    |  et les agglutiner.
    */
    this.paragraphs.forEach( paragraph => {
      const {paragData, texels, proximities} = paragraph.getData()
      texels      = texels.concat(paragData.texels)
      proximities = proximities.concat(paragData.proximities)
      paragraphs << paragData
    })

    return {
        data: {
            fragmentIndex:  this.index
          , paragraphs:     paragraphs
        }
      , texels: texels
      , proximities: proximities
    }
  }
  
  /**
   * Affichage du fragment dans le conteneur +container+
   * (c'est normalement l'éditeur, mais ça pourrait être aussi une
   *  autre fenêtre quand on veut visualiser une autre partie).
   * 
   * Cette méthode en profite aussi pour définir la propriété @fragment
   * des mots.
   */
  display(container){
    this.paragraphs.forEach( paragraph => {
      paragraph.fragment = this;
      container.appendChild(paragraph.div)
    })    
  }

  /**
   * Méthode qui checke la proximité du +mot+ {Mot}
   *
   * @param mot {Mot} Instance du mot à checker
   *            Noter qu'à ce moment du check, le contenu de ce mot
   *            peut être composé de plusieurs mots et même de 
   *            plusieurs paragraphes. 
   */
  checkProximityFor(mot, options) {
    this.curMot = mot
    Mot.getLemmaOf(mot.content, this.analyzeAround.bind(this) )
  }

  /**
   * Méthode qui procède à l'analyse d'un extrait du fragment (après
   * changement du texte par exemple). Les options permettent de
   * définir différents comportement, par exemple pour savoir s'il
   * faut un bouton pour annuler le changement en cas de proximité.
   * 
   * @params data {Hash} Table de données remontée par le serveur
   *    data.around       Nombre de mots autour à prendre en considération
   *    data.indexMot     Index du mot subissant le check
   *    data.cancelable   Si true, on peut annuler le changement du
   *                      mot.
   */
  analyzeAround( data ) {
    /*
    | Le lemme à rechercher/comparer
    */
    const lemma = data[0][2]
    console.info("Lemme à comparer '%s'", lemma)
    /*
    | Le nombre de mots à checker autour
    */
    const around = Pref('nb_mots_around')
    /*
    | Le mot courant (instance {Mot})
    */
    const mot = this.curMot
    console.log("Le mot : ", mot)
    console.warn("La méthode d'analyse de la proximité est à poursuivre, avec les données : ", data)

    const motsTooClose = []
    /*
    | Les mots avant
    */
    for(var idxMot = mot.index -  1, min = mot.index - around; idxMot > min ; --idxMot){
      const cmot = this.mots[idxMot]
      console.log("cmot = ", cmot)
      if ( undefined == cmot ) break
      if ( lemma == cmot.lemma ) {
        console.log(" Même lemme")
        if ( mot.toCloseTo(cmot) ) {
          console.warn("Mot trop proche de :", cmot)
          motsTooClose.push(cmot)
        } else {
          break; // il ne peut y en avoir de plus près (dans ce sens)
        }
      } 
    }
    /*
    | Les mots après
    */
    const max = mot.index + around ;
    for(idxMot = mot.index + 1; idxMot < max; ++ idxMot ){
      const cmot = this.mots[idxMot]
      console.log("cmot = ", cmot)
      if ( undefined == cmot ) {
        break
      } else if ( lemma == cmot.lemma ) {
        console.log(" Même lemme")
        if ( mot.toCloseTo(cmot) ) {
          console.warn("Mot trop proche de :", cmot)
          motsTooClose.push(cmot)
        } else {
          break; // il ne peut y en avoir de plus près (dans ce sens)
        }
      } 
    }

    if ( motsTooClose.length ) {
      message("Ce mot est trop proche d'autres mots semblables")
      console.info("Ce mot est trop proche d'autres mots semblables")
    } else {
      message("Ce mot est à bonne distance.")
      console.info("Ce mot est à bonne distance.")
    }
  }

  /**
   * Méthode qui retourne les texels (seulement leur contenu) en
   * prenant comme référence l'index +index+ et la marge (avant et
   * arrière) +nombreAutour+
   */
  getEnviron(index, nombreAutour){
    const firstIndex = index - nombreAutour;
    if ( firstIndex < 0 ) { firstIndex == 0 }
    const lastIndex  = index + nombreAutour
    return this.getExtrait({from:firstIndex,to:lastIndex,as:'text'})
  }

  /**
   * @return {Any} Un extrait des mots du fragment dans le format
   *         voulu (un texte, une liste des instances {Mot}s, etc.).
   * 
   * @params params {Hash} Définition de l'extrait
   *    from:     Depuis cet indice
   *    to:       Jusqu'à cet indice
   *    as:       Type du retour ('text' => un text, 'instances' =>
   *              liste d'instances {Mot})
   * 
   */
  getExtrait(params){
    const extrait = this.mots.slice(params.from, params.to + 1)
    switch(params.as){
    case 'text':
      return extrait.map(mot => {return mot.content}).join(' ')
    default:
      return extrait
    }
  }

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
