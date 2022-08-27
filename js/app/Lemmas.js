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
    this.lemmas     = lemmas
    /*
    | Identifiant de ce Lemma dans la table de la liste Lemmas du
    | fragment de texte courant
    */
    this.id         = lemma
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

  get Klass(){return 'Lemma'}


  addMot(mot){
    var   index = null
        , resetIndexes = true
        ;
    if ( not(this.hasMots) || mot.relPos > this.lastPosition ) {
      /*
      | Un mot à mettre au bout
      */
      index = this.positions.length
      this.positions.push(mot.relPos)
      resetIndexes = false // inutile d'actualiser les indexs
    } else if ( mot.relPos < this.firstPosition ) {
      /*
      | Un mot à mettre au tout début
      */
      index = 0
      this.positions.unshift(mot.relPos)
    } else {
      /*
      | Un mot à glisser dans la liste
      | 
      | Note : il est forcément "à l'intérieur", ni au début ni à la
      |        fin puisque ça a été traité avant.
      */
      for (var ipos in this.positions){
        if ( mot.relPos < this.positions[ipos] ) {
          this.positions.slice(ipos, 0, mot.relPos)
          break
        }
      }
    }
    Object.assign(this.table, {[mot.relPos]: {mot:mot, index:index}})
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
  */
  defineProximities(){
    
  }

  /**
   * @return true si le mot +mot+ {Mot} est trop prêt de son précédent
   * ou de son suivant
   * 
   * Note : pour le moment, on ne retourne que les proximités directes
   */
  defineProximitiesOf(mot){
    const minDist = this.constructor.MinProximityDistance
    const indexInLemma = this.table[mot.relPos].index
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
      if ( previousPos + Lemma.MinProximityDistance > mot.relPos) {
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
      if ( mot.relPos + Lemma.MinProximityDistance > nextPos ) {
        /*
        | Proximité avec le mot d'après
        */
        const nextMot = this.table[nextPos].mot
        return new Proximity({motAvant: mot, motApres: nextMot})
      }
    }    
  }

  static get MinProximityDistance(){
    return this._minproxdist || (this._minproxdist = Preferences.get('min_dist_proximity'))
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
