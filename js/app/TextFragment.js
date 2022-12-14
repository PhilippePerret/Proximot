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

// Les types principaux qui ne sont pas des textes
const TTTAG_TYPES_NOT_MOT = ['ABR','PUN','SENT']

class TextFragment {

  static resetAll(){
    delete this._current
  }

  static get current(){ return this._current }
  static set current(frg){this._current = frg}
  static setCurrent(fragment) { return (this._current = fragment) }

  /**
  * Méthode principale qui reçoit les données du fragment et retourne
  * une nouvelle instance TextFrament pour le fragment courant (pour
  * le moment c'est le fragment courant, en tout cas).
  * 
  * Noter que cette méthode sert autant pour un texte non encore ana-
  * lysé que pour un texte Proximot.
  * 
  * La méthode inverse (pour récupérer les données) est la méthode
  * d'instance TextFragment#getData
  * 
  * @return Le Fragment {TextFragment} instancié
  */
  static createFromData(data){
    const method = data.metadata ? 'createFromPackageData' : 'createFromTextData'
    return this[method].call(this, data)
  }

  /**
  * Création dun fragment à partir des données d'un package
  * Proximot.
  */
  static createFromPackageData(data){
    Log.in('TextFragment::createFromPackageData')
    Log.debug("CRÉATION DU FRAGMENT À PARTIR DU PACKAGE. DONNÉES : ", data)

    const fragment = new TextFragment(data.metadata)

    /*
    |  Les Text-elements du fragment
    */
    fragment.texels = TextElement.instanciateFromPackage(fragment, data.texels)

    /*
    |  Traitement des paragraphes
    */
    fragment.paragraphs = Paragraph.instanciate(fragment, data.metadata.paragraphs)

    /*
    |  Traitement des proximités
    |
    |  Note : on ne se contente pas, ici, de prendre les données
    |  proximités comme si on les calculait, on prend aussi en 
    |  compte les états définis (ignorance, etc.)
    |
    */
    Proximity.instanciate(fragment, data.proxis)

    /*
    |  On peut instancier le fragment, le mettre en fragment 
    |  courant et le retourner.
    */
    return this.setCurrent(fragment)
  }

  /**
  * Création du fragment à partir de données élaborées à partir d'un
  * texte (pas celles d'un fichier Proximot)
  */
  static createFromTextData(data) {
    Log.in('TextFragment::createFromTextData')
    Log.debug("CRÉATION DU FRAGMENT À PARTIR DU TEXTE. DONNÉES : ", data)

    /*
    |  Instanciation du fragment
    */
    const fragment = new TextFragment({
        text_path   : data.text_path
      , index       : int(data.fragment_index)
      , lexicon     : data.lexicon
      , offset      : data.fragment_offset
    })

    /*
    |  Transformer les données paragraphes en instances {Paragraph}
    |  ainsi que ses text-elements en instances {TextElement}
    */
    var paragIndex  = 0
    var paragOffset = 0
    const texels    = []
    fragment.paragraphs = data.paragraphs.map(

      ary_texels => {
        /*
        |  +ary_texels+ est ici une liste de trinomes renvoyés par 
        |  tree-tagger ([sujet, type, lemme])
        */

        /*
        |  On transforme les trinômes en instances Texel
        */
        var currentMotOffset = 0
        var idx = 0
        const paragTexels = ary_texels.map( dtexel => {
          /*
          |  Pour savoir si c'est un mot
          */
          const isMot = this.isTTTagMot(dtexel[1])
          /*
          |  Ajout de l'offset du texel, si c'est un mot
          */
          if ( isMot ) {
            // dtexel.push(paragOffset + currentMotOffset) // on ne met plus cet offset
            dtexel.push(currentMotOffset)                   // l'offset est maintenant par rapport au paragraph
          } else {
            /*
            |  Note : excommenter cette ligne pour voir tous les texels
            |  qui ne sont pas considérés comme des mots TODO
            */
            // console.log("Pas un mot : ", dtexel)
          }
          /*
          |  Instanciation du texel
          */
          const texel = TextElement.createFromTextData(fragment, dtexel)
          /*
          |  Prochain offset et index
          */
          if ( isMot ) { 
            currentMotOffset += texel.length 
            texel.index = idx++ 
          }

          return texel
        })
        /*
         |  Instanciation du paragraphe
         */        
        const paragraph = new Paragraph(fragment, paragIndex++, paragTexels, paragOffset)
        /*
        |  Offset du prochain paragraphe
        */
        paragOffset += currentMotOffset

        return paragraph    
      }
    )
    /*
    |  On fixe les texels du fragment
    */
    fragment.texels = texels

    /*
    |  Puisque les données viennent d'un texte, il faut précéder
    |  au calcul des proximités
    */
    fragment.analyzeProximities()

    /*
    |  Mettre le fragment en fragment courant et le retourner
    */
    return this.setCurrent(fragment)
  }

  /**
  * @return true si le +ttag+ (tag tree-tagger) correspond à un
  * mot.
  */
  static isTTTagMot(ttag){
    if ( ttag.match(':') ) { ttag = ttag.split(':')[0] }
    return not(TTTAG_TYPES_NOT_MOT.includes(ttag))
  }

  /**
   * Instanciation d'un fragment de texte
   * 
   * Rappel : le fragment de texte est l'unité principale dans l'app
   * Proximot.
   * 
   * @param data  {Hash} Toutes les données du fragment, qu'elles 
   *              viennent d'un texte non analysé ou d'un fichier
   *              Proximot.
   *              Contient notamment
   *              - Toujours -
   *              :fragment_index   L'index du fragment dans le texte complet
   *              :text_path        Chemin d'accès absolu au texte original
   *              - Dans certain cas -
   *              :prox_path          Chemin d'accès au package .pxw
   * 
   */
  constructor(data) {
    this.index        = int(definedOr(data.index, data.fragment_index))
    this.lexicon      = data.lexicon
    this.text_path    = data.text_path
    this.prox_path    = data.prox_path || this.defineProxPath(this.text_path)
    this.offsetInText = data.offset || data.offsetInText
    this.Klass        = 'TextFragment'
  }


  // --- Offset Methods ---

  updateOffsets(args){
    const {fromIndex, diff} = args
    /*
    |  Actualisation de tous les paragraphes du fragment à partir
    |  de l'index +fromIndex+
    */
    const len = this.paragraphs.length
    for (var ipara = fromIndex; ipara < len; ++ipara) {
      this.paragraphs[ipara].addToOffsets(diff)
    }
    /*
    |  Actualisation de tous les fragments suivants
    */
    App.updateOffsets({fromIndex: this.index + 1, diff: diff})
  }

  addToOffsets(diff){
    this._offsetintext += diff
  }

  get offsetInText(){return this._offsetintext}
  set offsetInText(o) { this._offsetintext = o }


  // --- Public Methods ---

  get to_json(){ /*- tests -*/
    return JString(this.getData())
  }

  /**
  * Affichage du fragment
  */
  display(){
    Editor.fragment = this
    this.displayIn(Editor.content)
    this.showProximites()
  }

  /**
  * Boucle sur tous les paragraphes
  */
  forEachParagraph(method){
    this.paragraphs.forEach(method)
  }
  /**
  * Boucle sur tous les mots du fragment
  */
  forEachMot(method){
    this.mots.forEach(method)
  }
  /**
  * Boucle sur tous les texels du fragment
  */
  forEachTexel(method){
    this.texels.forEach(method)
  }

  /**
   * Analyse des proximités du fragment
   * ----------------------------------
   * Après un chargement des données d'un texte (versus un package)
   * il faut procéder à l'analyse des proximités. Cela consiste à
   * définir les propriétés proxAvant et proxApres de chaque texel
   * mot du fragment
   * 
   * TODO: Il faut charger les 500 derniers mots du fragment 
   * précédent et les 500 premiers mots du fragment suivant pour
   * pouvoir calculer les proximités des premiers et derniers mots.
   * 
   */
  analyzeProximities(){
    Log.in('TextFragment#analyzeProximities')
    this.lemmas.analyzeProximites()
  }

  /**
   * Affichage du fragment dans le conteneur +container+
   * (c'est normalement l'éditeur, mais ça pourrait être aussi une
   *  autre fenêtre quand on veut visualiser une autre partie du 
   *  texte dans un cadre volant par exemple).
   * 
   * Noter que ça n'affiche que les "displayedMot" du fragment
   * 
   */
  displayIn(container){
    this.forEachParagraph( paragraph => {
      paragraph.buildIn(container)
    })
  }

  /**
   * Affichage des proximités du fragment
   * 
   * Note : il faut avoir analysé le fragment (this.analyze) avant
   * de pouvoir afficher les proximities
   */
  showProximites(){ this.forEachMot(mot => {mot.showProximities()}) }

  /**
  * @return la table des données du fragment (rappel : les données
  * du texte proximisé sont enregistrées par fragment d'environ 2500
  * mots)
  * 
  * Les données consistent en :
  * - un fichier metadata.yml contenant les informations sur le 
  *   fragment et notamment les paragraphes avec la liste des
  *   identifiants de texel
  * - un fichier texels.csv contenant tous les mots et autres
  *   text-elements
  * - un fichier proxis.csv contenant les données des proximités
  *   des mots du fragment.
  * 
  * La méthode inverse (pour instancier un fragment d'après les
  * données relevées) est la méthode de classe :
  *   TextFragment#createFromData
  */
  getData() {
    let   all_texels = []
        , all_proxis = []
        , paragraphs = []
        ;

    /*
    |  Titre des colonnes de données
    */
    all_texels.push(TextElement.PROPERTIES_KEYS)
    all_proxis.push(Proximity.PROPERTIES_KEYS)

    /*
    |  Boucle sur chaque paragraphe pour en récupérer les données
    |  et les agglutiner.
    */
    this.forEachParagraph( paragraph => {
      const {metadata, texels, proxis} = paragraph.getData()
      all_texels = all_texels.concat(texels)
      all_proxis = all_proxis.concat(proxis)
      paragraphs.push(metadata)
    })

    return {
        metadata: {
            fragmentIndex : this.index
          , paragraphs    : paragraphs
          , text_path     : this.text_path
          , prox_path     : this.prox_path
          , offset        : this.offsetInText
        }
      , texels: all_texels
      , proxis: all_proxis
    }
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
   * @return le groupe de Lemmas {Lemmas} de lemma +lemma+
   * L'instancie si nécessaire.
   */
  getLemma(lemma) {
    return this.lemmas.get(lemma)
  }

  // --- /Public Methods ---

  /* Longueur */
  get length(){ return this.calcLength() }
  
  /**
   * Gestion des Lemmas du fragment de texte
   * (voir les classes Lemmas et Lemma)
   */
  get lemmas(){
    return this._lemmas || (this._lemmas = new Lemmas(this))
  }

  /**
  * Retourne tous les mots du fragment, même les mots cachés
  */
  get mots(){
    return this._mots || (this._mots = this.getMots() )
  }

  /**
  * Retourne le texte du fragment (les espaces, normalement, ont été
  * respectée)
  */
  get text(){
    return this._text || (this._text = this.getText())
  }

  /* Les Texels */
  get texels(){
    return this._texels || (this._texels = this.getTexels() )
  }
  set texels(ary){ if ( ary.length ) this._texels = ary }
  resetTexels(){
    delete this._mots
    delete this._texels
    delete this._text
  }


  // *--- Private Methods ---*

  getMots(){
    const ary_mots = []
    this.paragraphs.forEach(parag => {
      parag.forEachMot(mot => ary_mots.push(mot))
    })
    if (ary_mots.length) return ary_mots
  }

  getTexels(){
    const ary = []
    this.paragraphs.forEach( parag => {
      parag.forEachTexel(texel => { ary.push(texel) } )
    })
    if ( ary.length ) return ary
  }

  getText(){
    this.texels.map(texel => {
      return ('') + texel.content + (texel.hasNoSpaceAfter ? '' : ' ')
    }).join('')
  }

  calcLength(){
    var s = 0;
    this.paragraphs.forEach(p => s += p.length)
    return s
  }

  /**
  * Pour définir le chemin d'accès au package
  */
  defineProxPath(p){
    return p.substring(0, p.lastIndexOf('.')) + '.pxw'
  }
}
