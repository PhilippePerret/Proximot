'use strict';
class Mot extends TextElement {

  static getById(mot_id){
    return this.table[mot_id]
  }

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
  static add(mot){
    if ( undefined == this.table ) {
      this.table = {}
      this.byCountAndLemmas = {}
    }
    Object.assign(this.table, {[mot.id]: mot})
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


  constructor(dmot){
    super(dmot)
    this.mot    = this.content
    this.type   = 'mot'
    this.Klass  = 'Mot'
    this.constructor.add(this)
  }

  // --- Public Methods ---

  /**
   * @return {Hash} Table des données à sauvegarder
   * 
   */
  get data2save(){
    const table = super.data2save
    Object.assign(table, {
        type:           'mot'
      , markProximity:  this.markProximity
      , proxAvant:      this.proxAvant && this.proxAvant.id
      , proxApres:      this.proxApres && this.proxApres.id
    })
    return table
  }

  replaceContentWith(newContent){
    /*
    | Si le contenu est le même, on peut s'arrêter là
    */
    if ( newContent == this.content ) {
      console.log("Contenu identique. Je renonce.")
      return false
    }
    console.log("Contenu différent ('%s' ≠ '%s'), je poursuis", newContent, this.content)
    /*
    |   On mémorise le content actuel pour le remettre en cas 
    |   d'annulation
    */
    const oldContent = this.content
    /*
    |   On consigne le nouveau contenu pour qu'il soit pris en 
    |   compte par la relève de l'extrait à checker. Cela actualise
    |   aussi son affichage.
    */
    this.content = newContent
    
    /*
    |   Check de proximité
    |
    | On prend les 250 mots autour (index ± 2500) pour
    | créer un texte qu'on envoie à l'analyse
    |
    | Mais en fait, le plus simple serait d'envoyer le ou les mots
    | à l'analyse de texte pour obtenir leur lemma, puis de voir
    | s'il n'y pas de problème de proximité.
    |
    */
    this.fragment.checkProximityFor(this, {cancelable: true})
    /*
    | Il peut y avoir trois sortes de contenu différents :
    | 1.  Un simple mot comme le mot précédent.
    |     => traitement normal
    | 2.  Plusieurs mots (séparés ou non par des espaces, on le
    |     sait à l'analyse).
    |     => On crée autant de mots que nécessaire
    |     => On actualise toutes les listes
    | 3.  Un nouveau paragraphe (et au moins 2 mots)
    |     => On crée le paragraphe et les mots

    /*
    |   Enregistrement dans l'historique d'annulation
    */
    // TODO Changement in CancelingManagement
  }

  /**
   * Surclasse la méthode TextElement pour écrire le mot dans le
   * texte.
   * 
   */
  get content() { return this._content }
  set content(v) {
    this._content       = v
    this.obj.innerText  = v
  }

  /**
   * @return TRUE si le mot +cmot+ est trop proche du mot courant
   * Note : le lemme doit déjà avoir été checké et il doit être
   * identique.
   *  
   * @param cmot {Mot}
   * 
   */
  toCloseTo(cmot) {
    console.log("[toCloseTo] cmot.relPos (%i) - this.relPos (%i) < Lemma.MinProximityDistance (%i)", cmot.relPos, this.relPos, Lemma.MinProximityDistance)
    return Math.abs(cmot.relPos - this.relPos) < Lemma.MinProximityDistance
  }

  get markProximty(){
    if ( undefined === this._markproxi ) {
      this._markproxi = this.calcMarkProximity(this.fragment)
    }
    return this._markproxi
  }
  set markProximty(v) { this._markproxi = v /* false ou class CSS */  }

  /**
   * @return {String} class CSS de l'éloignement si le mot est en 
   * proximité avec un autre dans le fragment de texte affiché
   * 
   * Si l'étude a déjà été menée (this.markProximty défini), on 
   * prend directement la valeur là. C'est le cas par exemple lorsque
   * l'on recharge un fichier.
   * 
   * @param frag  {TextFragment} L'instance du fragment de
   *              texte. Pour savoir quels mots sont après ou avant.
   */
  isTooClose(frag){
    if ( this.isTooShort ) return false
    this.fragment = frag
    return this.markProximty // false si aucune
  }

  calcMarkProximity(frag){
    const lemma = frag.getLemma(this.lemma)
    if ( lemma.hasOnlyOneMot ) {
      return false
    } else {
      lemma.defineProximitiesOf(this) // => .proxAvant et .proxApres
      if ( this.proxAvant || this.proxApres ) {
        if ( not(this.proxAvant) ) {
          return this.proxApres.eloignement
        } else if ( not(this.proxApres) ) {
          return this.proxAvant.eloignement
        } else if ( this.proxAvant.distance > this.proxApres.distance ) {
          return this.proxApres.eloignement
        } else {
          return this.proxAvant.eloignement
        }
      } else {
        return false
      }
    }
  }

  /**
   * Marque/démarque le mot comme trop proche d'un autre
   * 
   * @param cssEloignement {String} 'far', 'mid' ou 'near'
   */
  setTooClose(cssEloignement){
    this.obj.classList.add('too-close')
    this.obj.classList.add(cssEloignement)
    /*
    | Construire le tooltip des informations et des opérations
    | On le met à l'intérieur, caché.
    */
    // TODO Un tooltip permettant d'avoir des informations et de 
    // faire des actions sur cette proximité (l'ignorer par exemple)
    this.buildProximityTooltip()
  }
  unsetTooClose(){
    this.obj.classList.remove('too-close')
    /*
    | On doit détruire le tootip de proximité
    */
    this.proxTooltip && this.proxTooltip.remove()
  }

  // --- /Public Methods ---

  // --- Listener Methods ---

  onClick(e){
    super.onClick(e)
    console.log("J'ai cliqué ", this.mot)
    return false
  }
  onMouseOver(e){
    super.onMouseOver(e)
    return stopEvent(e)
  }

  // --- /Listener Methods ---


  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel mot'})
    o.innerHTML = this.mot
    this.observe(o)
    return o
  }
  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
  }

  /**
   * Construction, en cas de proximité, d'un div contenant les 
   * informations et les outils de proximité
   */
  buildProximityTooltip(){
    const o = DCreate('span', {text:'Infos sur proximité', class:'prox-tooltip'})
    this.proxTooltip = o
    this.obj.appendChild(o)
  }
  /**
   * Observation du tooltip de proximité
   */
  observeProxTooltip(){
    
  }
  // --- Private Methods ---

  get isTooShort(){
    return this.content.length < Mot.minLengthWord
  }
  static get minLengthWord(){
    return this._minlenword || (this._minlenword = Pref('min_word_length'))
  }
}
