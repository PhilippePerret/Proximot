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
    this.type   = 'mot'
    this.Klass  = 'Mot'
    this.constructor.addInTableMots(this)
  }

  /**
  * On ajoute ce text-element de type Mot aux Lemma
  */
  addToLemmas(){
    this.fragment.lemmas.get(this.lemma).addMot(this)
  }

  /**
  * Affiche les proximités du mot
  */
  showProximities(){
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
    const css = []
    this.proxAvant && css.push('pxavant',this.proxAvant.eloignement)
    this.proxApres && css.push('pxapres',this.proxApres.eloignement)
    return css
  }

  /**
  * @return true si le mot est en proximité d'un autre
  * 
  */
  get hasProximities(){
    return !!( this.proxAvant || this.proxApres )
  }

  // --- Affichage des informations du mot ---
  showInfos(){
    this.showInfo('content', this.content)
    this.showInfo('occurrences', this.occurrences)
    this.showInfo('lemma', this.lemma)
    this.showInfo('tttag', this.ttTag)
    this.showInfo('lprox-mot',  this.motAvant && this.motAvant.mot)
    this.showInfo('lprox-dist', this.motAvant && this.motAvant.distanceWith(this))
    this.showInfo('rprox-mot',  this.motApres && this.motApres.mot)
    this.showInfo('rprox-dist', this.motApres && this.motApres.distanceWith(this))
    this.showInfo('offset',     this.offset)
  }

  // --- Private Methods ---

  showInfo(key, value){
    DGet(`#infos-texel-${key}`).innerHTML = value || '---'
  }

  get occurrences(){
    return this.fragment.getLemma(this.lemma).count
  }

  get motAvant(){ return this.proxAvant ? this.proxAvant.mot : null}
  get motApres(){ return this.proxApres ? this.proxApres.mot : null}

}
