'use strict';
/**
 * class Lemmas & class Lemma
 * ---------------------------
 * Gestion des lemmas dans les fragments de texte, qui permettront de 
 * trouver les proximités dans ce fragment.
 *
 * Une instance {Lemmas} appartient à un {TextFragment}.
 * Une instance {Lemma} appartient à un {Lemmas}
 */

class Lemmas {

  /**
  * Au dessus de cette distance, deux mots ne peuvent plus être en
  * proximité.
  * Ce qui ne signifie pas que s'ils sont en dessous il le sont, cela
  * dépend ensuite après des mots.
  */
  static get MIN_DIST_FOR_PROX(){
    return this._mindistprox || (this._mindistprox = Pref('min_dist_proximity'))
  }

  /**
  * Longueur minimale que doit avoir le mot (le lemme) pour être
  * traité
  */
  static get MIN_LEMME_LENGTH(){
    return this._minlemmelength || (this._minlemmelength = Pref('min_word_length'))
  }

  constructor(textfrag){
    this.Klass = 'Lemmas'
    this.textfragment = textfrag
    /*
    | Table qui contient en clé le lemma (le mot canonique) et en
    | valeur l'instance {Lemma} de ce mot canonique.
    */
    this.table = {}
  }

  /**
  * Boucler sur toutes les données Lemma
  * 
  * @param method {String ou Function}
  *           La méthode d'instance des Lemma, soit son nom soit la
  *           méthode elle-même.
  */
  forEachLemma(method) {
    if ( 'string' == typeof method ) {
      Object.values(this.table).forEach( lemma => {
        lemma[method].call(lemma)
      })
    } else {    
      Object.values(this.table).forEach(method)
    }
  }

  /**
  * Analyse de proximités de tous les lemmas
  * 
  * Appelée par la méthode homonyme de TextFragment
  */
  analyzeProximites(){
    this.forEachLemma('analyzeProximites')
  }

  /**
   * @return le {Lemma} de lemma +lemma+ ou l'instancie s'il 
   * n'existe pas.
   */
  get(lemma, nePasInstancier = false ){
    if ( undefined == this.table[lemma] ) {
      return nePasInstancier ? null : this.addLemma(lemma)
    } else {
      return this.table[lemma] 
    }
  }

  /**
   * Ajoute un Lemma à la liste des Lemmas du fragment de texte
   * 
   * @return {Lemma} Le nouveau Lemma créé.
   */
  addLemma(lemma){
    Object.assign(this.table, {[lemma]: new Lemma(this, lemma)})
    return this.table[lemma]
  }

}// class Lemmas




class Lemma {
  constructor(lemmas, lemma){
    this.Klass      = 'Lemma'
    this.lemmas     = lemmas
    /*
    | Identifiant de ce Lemma dans la table de la liste Lemmas du
    | fragment de texte courant
    */
    this.id         = lemma
    this.lemma      = lemma
    /*
    | Liste des positions dans le fragment de texte
    | DOIT DEVENIR OBSOLÈTE
    */
    this.positions  = []
    /*
    |  Liste des texels (mots), dans l'ordre
    */
    this.items = []
    /*
    | Table avec en clé la position et en valeur une table contenant
    | :mot et :index
    | Avec :index qui est l'index dans la liste des positions.
    | DOIT DEVENIR OBSOLÈTE
    */
    this.table      = {}
  }

  addMot(mot){
    const offset = mot.offset ;
    if ( not(this.hasMots) || offset > this.lastPosition ) {
      /*
      | Un mot à mettre au bout
      */
      this.items.push(mot)
    } else if ( offset < this.firstPosition ) {
      /*
      | Un mot à mettre au tout début
      */
      this.items.unshift(mot)
    } else {
      /*
      | Un mot à glisser dans la liste
      | 
      | Note : il est forcément "à l'intérieur", ni au début ni à la
      |        fin puisque ça a été traité avant.
      */
      // for (var ipos in this.positions){
      for (var imot in this.items){
        const posMot = this.items[imot].offset 
        if ( offset < posMot ) {
          this.items.slice(imot, 0, mot)
          break
        }
      }
    }
  }

  /**
  * Suppression d'un texel de la liste des lemmas
  */
  removeMot(texel){
    removeFromArray(
        this.items
      , item => { return item.id == texel.id}
      , {inplace: true}
    )
  }

  /**
   * @return true si le mot +mot+ {Mot} est trop prêt de son précédent
   * ou de son suivant
   * 
   * Note : pour le moment, on ne retourne que les proximités directes
   */
  defineProximitiesOf(mot){
    const proximites = []
    var prox ;
    if ( mot.proxAvant === null ) {
      // Rien à faire, la proximité a déjà été éliminée
    } else if ( mot.proxAvant ) {
      proximites.push(mot.proxAvant)
    } else {
      /*
      | Calcul de la proximité avant
      */
      if ( (prox = this.calcProximityAvant(mot)) ) {
        proximites.push(prox)
      }
    }
    if ( mot.proxApres === null ) {
      // Rien à faire proximité déjà calculée
    } else if ( mot.proxApres ) {
      proximites.push(mot.proxApres)
    } else {
      /*
      | Calcul de la proximité après
      */
      if ( (prox = this.calcProximityApres(mot, indexInLemma)) ) {
        proximites.push(prox)
      }
    }
    return proximites;
  }

  /**
  * Pour définir toutes les proximités de ce lemme en une seule
  * opération.
  * 
  * On passe en revue tous les mots dans l'ordre des positions si
  * elles sont inférieures au minimum de proximité
  */
  analyzeProximites(){
    /*
    |  Si le lemme est trop court pour être traité, on en fait rien
    */
    if ( this.lemma.length < Lemmas.MIN_LEMME_LENGTH ) { return }
    /*
    |  Sinon on boucle sur toutes les positions
    */
    for (var i = 1, len = this.items.length; i < len; ++i ){
      const itemCur  = this.items[i]
      const itemPre  = this.items[i - 1]
      const posCur   = itemCur.offset
      const posPre   = itemPre.offset
      const distance = posCur - posPre
      /*
      |  Si les deux mots sont suffisamment éloignés dans leur
      |  définition propre, on les passe.
      */
      if ( distance > this.distance_minimale ) { continue }
      /*
      |  Si les deux mots arrivent ici, c'est qu'ils sont en 
      |  proximité
      */
      this.newProximityFor(itemPre, itemCur, distance)
    }
  }

  /**
  * Création d'une proximité entre le mot +motAvant+ et +motApres+
  * 
  * @return {Proximity} La proximité créée.
  */
  newProximityFor(motAvant, motApres, distance){
    distance = distance || motApres.offset - motAvant.offset
    return new Proximity({
        motAvant    : motAvant
      , motApres    : motApres
      , state       : 1
      , distance    : distance
      , eloignement : this.eloignementPerDistance(distance)
    })
  }

  /**
  * @return 'far', 'mid' ou 'near' pour la distance +distance+
  * Note : la méthode tient compte de la distance minimal hors
  * proximité du lemme propre.
  */
  eloignementPerDistance(distance) {
    const tiersDistance = this.distance_minimale / 3
    if ( distance < tiersDistance ) { return 'near' }
    else if ( distance < 2 * tiersDistance ) { return 'mid' } 
    else { return 'far' }
  }

  /**
  * @return true si le mot +motavant+ est trop prêt de +motapres+
  * en fonction de la distance propre au lemme.
  */
  areTooClose(motavant, motapres){
    return motavant.offset + this.distance_minimale > motapres.offset
  }

  /**
   * Calcule la proximité avant du mot +mot+ et l'instancie et la 
   * retourne si nécessaire (si elle existe)
   */
  calcProximityAvant(mot){
    const motAvant = this.getMotBefore(mot)
    if ( motAvant && this.areTooClose(motAvant, mot) ) {
      return this.newProximityFor(motAvant, mot)
    }
  }

  /**
  * Calcule la proximité éventuelle du mot +mot+ avec le mot après,
  * l'instancie et la retourne le cas échéant
  */
  calcProximityApres(mot){
    const motApres = this.getMotAfter(mot)
    if ( motApres && this.areTooClose(mot, motApres) ) {
      return this.newProximityFor(mot, motApres)
    }
  }

  /**
  * Retourne le mot avant +mot+ dans le Lemma (ou null si mot est le
  * premier mot)
  */
  getMotBefore(mot){
    for(var imot = 1, len = this.items.length; imot < len; ++ imot) {
      if ( this.items[imot].id == mot.id ) { return this.items[imot - 1] }
    }
    return null
  }
  
  /**
  * Retourne le mot après +mot+ dans le Lemma (ou null si +mot+ est
  * le dernier mot)
  */
  getMotAfter(mot){
    for(var imot = 0, len = this.items.length - 1; imot < len; ++ imot) {
      if ( this.items[imot].id == mot.id ) { return this.items[imot + 1] }
    }
    return null
  }

  get distance_minimale(){
    if ( undefined === this._mindist) {
      this._mindist = this.getDistanceMinimale() || Lemmas.MIN_DIST_FOR_PROX
    } return this._mindist
  }
  getDistanceMinimale(){
    return null // TODO: VOIR COMMENT RÉGLER UNE DISTANCE PROPRE PAR LEMME
  }

  /**
  * @return {Number} Le nombre de mots dans ce Lemme
  */
  get count(){return this.items.length }

  /** @return TRUE si le Lemma possède déjà des mots */
  get hasMots(){return this.count > 0}


  get hasOnlyOneMot(){return this.count == 1}
  
  /** @return la première position */
  get firstPosition(){ return this.items[0].offset }
  
  /** @return la dernière position */
  get lastPosition(){return this.items[this.count - 1].offset}

} // class Lemma
