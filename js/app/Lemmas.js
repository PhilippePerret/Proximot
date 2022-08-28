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
  get(lemma){
    if ( undefined == this.table[lemma] ) {
      return this.addLemma(lemma)
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
    */
    this.positions  = []
    /*
    | Table avec en clé la position et en valeur une table contenant
    | :mot et :index
    | Avec :index qui est l'index dans la liste des positions.
    */
    this.table      = {}
  }

  addMot(mot){
    var   index = null
        , resetIndexes = true
        ;
    if ( not(this.hasMots) || mot.offset > this.lastPosition ) {
      /*
      | Un mot à mettre au bout
      */
      index = this.positions.length
      this.positions.push(mot.offset)
      resetIndexes = false // inutile d'actualiser les indexs
    } else if ( mot.offset < this.firstPosition ) {
      /*
      | Un mot à mettre au tout début
      */
      index = 0
      this.positions.unshift(mot.offset)
    } else {
      /*
      | Un mot à glisser dans la liste
      | 
      | Note : il est forcément "à l'intérieur", ni au début ni à la
      |        fin puisque ça a été traité avant.
      */
      for (var ipos in this.positions){
        if ( mot.offset < this.positions[ipos] ) {
          this.positions.slice(ipos, 0, mot.offset)
          break
        }
      }
    }
    Object.assign(this.table, {[mot.offset]: {mot:mot, index:index}})
    /*
    | Actualiser si nécessaire les propriétés index
    |
    */
    if ( resetIndexes ) {
      for(var ipos in this.positions ) {
        this.table[this.positions[ipos]].index = parseInt(ipos,10)
      }
    }
  }

  /**
  * Pour définir toutes les proximités de ce lemme
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
    for (var i = 1, len = this.positions.length; i < len; ++i ){
      const posPrev   = this.positions[i - 1]
      const posCurr   = this.positions[i]
      const distance  = posCurr - posPrev
      /*
      |  Si les deux mots sont suffisamment éloignés dans l'absolu, 
      |  on les passe.
      */
      if ( distance > Lemmas.MIN_DIST_FOR_PROX){ continue }
      /*
      |  Si les deux mots sont suffisamment éloignés dans leur
      |  définition propre, on les passe.
      */
      if ( this.distance_minimale && distance > this.distance_minimale ) { continue }
      /*
      |  Si les deux mots arrivent ici, c'est qu'ils sont en 
      |  proximité
      */
      this.newProximityFor(this.motAt(posPrev), this.motAt(posCurr), distance)
    }
  }

  /**
  * Création d'une proximité entre le mot +motAvant+ et +motApres+
  */
  newProximityFor(motAvant, motApres, distance){
    new Proximity({
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
    const tiersDistance = (this.distance_minimale || Lemmas.MIN_DIST_FOR_PROX) / 3
    if ( distance < tiersDistance ) { return 'near' }
    else if ( distance < 2 * tiersDistance ) { return 'mid' } 
    else { return 'far' }
  }

  /**
  * @return le mot {Mot|NomPropre} à la position +position+
  */
  motAt(position){
    return this.table[position].mot
  }

  /**
   * @return true si le mot +mot+ {Mot} est trop prêt de son précédent
   * ou de son suivant
   * 
   * Note : pour le moment, on ne retourne que les proximités directes
   */
  defineProximitiesOf(mot){
    const minDist = this.constructor.MinProximityDistance
    const indexInLemma = this.table[mot.offset].index
    const proximites = []
    if ( mot.proxAvant || mot.proxAvant === null ) {
      mot.proxAvant && proximites.push(mot.proxAvant)
    } else {
      /*
      | Calcul de la proximité avant
      */
      const prox = this.calcProximityAvant(mot, indexInLemma)
      prox && proximites.push(prox)
    }
    if ( mot.proxApres || mot.proxApres === null ) {
      mot.proxApres && proximites.push(mot.proxApres)
    } else {
      /*
      | Calcul de la proximité après
      */
      const prox = this.calcProximityApres(mot, indexInLemma)
      prox && proximites.push(prox)
    }
    return proximites;
  }

  /**
   * Calcule la proximité avant du mot +mot+ et la retourne
   */
  calcProximityAvant(mot, indexInLemma){
    if ( indexInLemma > 0 ) {
      const previousPos = this.positions[indexInLemma - 1]
      if ( previousPos + Lemma.MinProximityDistance > mot.offset) {
        /*
        | Proximité avec le mot d'avant
        */
        const previousMot = this.table[previousPos].mot
        return new Proximity({motAvant: previousMot, motApres: mot})
      }
    }
  }
  calcProximityApres(mot, indexInLemma){
    this.proxApres = null
    if ( indexInLemma < this.positions.length - 1) {
      const nextPos = this.positions[indexInLemma + 1]
      if ( mot.offset + Lemma.MinProximityDistance > nextPos ) {
        /*
        | Proximité avec le mot d'après
        */
        const nextMot = this.table[nextPos].mot
        return new Proximity({motAvant: mot, motApres: nextMot})
      }
    }    
  }

  get distance_minimale(){
    if ( undefined === this._mindist) {
      this._mindist = this.getDistanceMinimale()
    } return this._mindist
  }
  getDistanceMinimale(){
    return null // TODO: VOIR COMMENT RÉGLER UNE DISTANCE PROPRE PAR LEMME
  }


  /** @return TRUE si le Lemma possède déjà des mots */
  get hasMots(){return this.count > 0}

  get count(){return this.positions.length }

  get hasOnlyOneMot(){return this.positions.length == 1}
  
  /** @return la première position */
  get firstPosition(){ return this.positions[0] }
  
  /** @return la dernière position */
  get lastPosition(){return this.positions[this.positions.length - 1]}

} // class Lemma
