'use strict';
/**
* class MotType < TextElement
* ----------------------------
* Pour les text-elements (texels) qui doivent se comporter comme des
* mots. Pour le moment, ce sont Mot et NomPropre.
* 
*/

class MotType extends TextElement {


  /**
   * @return lemma {String} Le lemme du mot +str_mot+
   * Soit il est déjà connu est retourné tout de suite, soit il doit
   * être demandé côté serveur.
   * 
   * @param strMot {String} Le mot dont on veut le lemme
   * @param poursuivre  {Function} La fonction à appeler quand on 
   *                    l'aura obtenu, d'ici ou du serveur
   */
  static getLemmaOf(strMot, poursuivre) {
    let dLemme = this.getCountAndLemma(strMot)
    if ( dLemme ) {
      /*
      | OK il est connu 
      */
      poursuivre.call(null, [ [strMot,dLemme.type, dLemme.lemma] ])
    } else {
      /*
      | Ce mot est inconnu, il faut demander son lemme côté serveur
      */
      TextUtils.analyze(strMot, {poursuivre:poursuivre})
    }
  }

  /**
   * @return la table {:count, :lemma, :type} du mot +str_mot+ 
   * {String}
   * 
   * Cette méthode est fondamentale pour la recherche des nouvelles
   * proximité puisqu'elle permet de ne pas avoir à faire un appel
   * serveur pour obtenir le lemma du mot str_mot quand il est déjà
   * connu du texte.
   * Rappel : appeler la méthode Mot.getLemmaOf(mot) pour obtenir à
   * tous les coups ce lemme.
   */
  static getCountAndLemma(strMot){
    console.info("this.byCountAndLemmas=", this.byCountAndLemmas)
    return this.byCountAndLemmas[strMot]
  }

  /**
   * Ajoute le mot (à l'instanciation). Cela a une double fonction :
   * 1. Ça permet de récupérer le mot par Mot.getById()
   * 2. Mais surtout, ça permet de trouver très vite un lemme lorsqu'on
   *    entre un mot déjà connu. Car la liste Mot.byCountAndLemmas
   *    possède en clé le mot et en valeur une table contenant le
   *    nombre de mots de ce type (count) et le lemme (lemma)
   * 
   * @param mot {Mot} Instance du mot tout juste instancié
   * 
   */
  static addInTableMots(mot){
    if ( undefined == this.tableMots ) {
      this.tableMots = {}
      this.byCountAndLemmas = {}
    }
    Object.assign(this.tableMots, {[mot.id]: mot})
    if ( undefined == this.byCountAndLemmas[mot.mot] ) {
      Object.assign(this.byCountAndLemmas, {[mot.mot]: {
        count: 0, type: mot.ttTag, lemma:mot.lemma
      }})
    }
    /*
    | On compte ce mot
    */
    this.byCountAndLemmas[mot.mot].count ++ 
  }


  constructor(fragment, dmot){
    super(fragment, dmot)
    this.mot    = this.content
    this.Klass  = 'Mot'
    this.constructor.addInTableMots(this)
  }

  // --- Public Methods ---
  get isMot(){ return true }

  /**
  * On ajoute ce text-element de type Mot aux Lemma
  */
  addToLemmas(){
    this.fragment.lemmas.get(this.lemma).addMot(this)
  }

  /**
  * Affiche les proximités du mot dans le texte (avec des flèches)
  */
  showProximities(){
    // console.log("Je dois montrer les proximités de ", this)
    if ( this.hasProximities ) {
      /*
      |  Quand le mot est en proximité
      */
      this.obj.classList.add(...this.cssProximities())
    } else {
      /*
      |  Quand le mot n'est pas en proximité
      */
      this.obj.classList.remove('too-close','pxavant','pxapres')
    }
  }

  cssProximities(){
    const css = ['too-close']
    this.proxAvant && css.push('pxavant', this.proxAvant.eloignement)
    this.proxApres && css.push('pxapres', this.proxApres.eloignement)
    return css
  }

  /**
  * @return true si le mot est en proximité d'un autre
  * 
  */
  get hasProximities(){
    return !!( this.proxAvant || this.proxApres )
  }

  /* --- Affichage des informations du mot ---
  |  + Mise en exergue des mots en proximité if any
  */
  showInfos(){
    var mot, css, dis, elo, den ;
    this.showInfo('content', this.content)
    this.showInfo('occurrences', this.occurrences)
    this.showInfo('lemma', this.lemma)
    this.showInfo('tttag', this.ttTag)
    if ( this.proxAvant ) {
      ;[mot, css] = [this.proxAvant.motAvant.mot    , this.proxAvant.eloignement]
      ;[dis, elo] = [this.proxAvant.distance        , this.proxAvant.eloignement]
      den = this.proxAvant.density
      this.proxAvant.motAvant.setExergue()
    } else {
      [mot, css, dis, elo, den] = ['---', null, null, null, null]
    }
    this.showInfo('lprox-mot'     , mot, css)
    this.showInfo('lprox-dist'    , dis, css)
    this.showInfo('lprox-density' , den, css)
    if ( this.proxApres ) {
      ;[mot, css] = [this.proxApres.motApres.mot,  this.proxApres.eloignement]
      ;[dis, elo] = [this.proxApres.distance,      this.proxApres.eloignement]
      den = this.proxApres.density
      this.proxApres.motApres.setExergue()
    } else {
      [mot, css, dis, elo, den] = ['---', null, null, null, null]
    }
    this.showInfo('rprox-mot'     , mot, css)
    this.showInfo('rprox-dist'    , dis, css)
    this.showInfo('rprox-density' , den, css)

    /* Offset */
    this.showInfo('offset',     this.offset)
  }

  // --- Private Methods ---

  showInfo(key, value, css){
    const td = DGet(`#infos-texel-${key}`)
    td.innerHTML = value || '---'
    td.className = 'info'
    css && td.classList.add(css)
  }

  get occurrences(){
    return this.fragment.getLemma(this.lemma).count
  }

  get motAvant(){ return this.proxAvant ? this.proxAvant.mot : null}
  get motApres(){ return this.proxApres ? this.proxApres.mot : null}

  get css(){
    return super.getCssClasses(['ponct'])
  }

}
