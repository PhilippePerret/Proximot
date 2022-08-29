'use strict'
class Proximity {

  static getById(id){ 
    return this.table[id] 
  }

  static getNewId(){
    if ( undefined === this.lastId ) this.lastId = 0
    return ++ this.lastId
  }

  static add(proxi){
    if (undefined == this.items){ 
      this.items = []
      this.table = {}
    }
    this.items.push(proxi)
    Object.assign(this.table, {[proxi.id]: proxi})
  }

  /**
  * Instancie les données remontée d'un package Proximot
  */
  static instanciate(fragment, data){
    if ( data && data[0][0] == "id") {
      /*
      |  Si la première donnée proximité est la rangée de noms de
      |  colonnes, on la retire. Pour le moment on la met simplement
      |  de côté, mais avec les versions suivantes, il pourra être
      |  nécessaire d'y faire référence.
      */
      data.shift()
    }
    data.forEach( dproxi => { new Proximity(dproxi) } )
  }

  static get PROPERTIES(){
    if (undefined == this._properties){
      this._properties = {
          id            : {index:0, hname:'identifiant', type:'int'}
        , state         : {index:1, hname:'Statut de la proximitié', type:'int'}
        , motAvantId    : {index:2, hname:'ID du mot gauche', type:'int'}
        , motApresId    : {index:3, hname:'ID du mot droit', type:'int'}
        , distance      : {index:4, hname:'Distance entre les deux mots (en signes)', type:'int'}
        , eloignement   : {index:5, hname:'Nom humain de l’éloignement (near, mid ou far)'}
        , density       : {index:6, hname:'Densité de la proximité'}
      }
    }; return this._properties;
  }
  static get PROPERTIES_KEYS(){return Object.keys(this.PROPERTIES)}

  /*
  | ################     INSTANCE     #################
  */

  /**
  * Instanciation d'une proximité
  * 
  * @param data {Array} or {Hash}
  *         Données remontées d'un package ({Array})
  *         OU données fournies en cours de travail {:motAvant, :motApres}
  */
  constructor(data){
    this.setData(data)
    this.setProximityOfEachWord()
    this.constructor.add(this)
  }

  getData(){
    return this.PROPERTIES_KEYS.map( prop => { return this[prop] })
  }

  get PROPERTIES_KEYS(){ return Object.keys(this.PROPERTIES) }
  get PROPERTIES(){ return this.constructor.PROPERTIES }

  /**
  * Dispatcher les données remontées du serveur (récoltées dans le
  * fichier Proximot) en réglant certaines valeurs à commencer par
  * l'instance des mots avant et après (if any)
  */
  setData(data){
    if ( data instanceof Array ) {
      /*
      |  Données remontées d'un package
      */
      for (var property in this.PROPERTIES ){
        const dProperty = this.PROPERTIES[property]
        let value = data[dProperty.index]
        switch(dProperty.type){
        case 'int'  : value = int(value); break
        case 'bool' : value = bool(value); break
        }
        this[property] = value
      }
      this.motAvant = TextElement.getById(this.motAvantId) || raise("Le mot avant devrait toujours exister.")
      this.motApres = TextElement.getById(this.motApresId) || raise("Le mot après devrait toujours exister.")
    } else {
      /*
      |  Données fournies par une instanciation en cours de travail
      */
      for(var prop in data){ this[prop] = data[prop] }
      this.motAvant || raise("Le mot avant devrait toujours exister.")
      this.motApres || raise("Le mot après devrait toujours exister.")
      this.motAvantId = data.motAvant.id
      this.motApresId = data.motApres.id
      this.id         = definedOr(data.id, this.constructor.getNewId())
    }
  }

  /**
   * Gestion de l'état
   * -----------------
   * Pour le moment, une proximité peut être active ou ignorée
   * 
   * 1 = proximité active (donc à traiter)
   * 2 = proximité en sursis (aka par encore sûr de la traiter)
   * 4 = proximité ignorée (=> ne plus la faire apparaitre)
   * 8 = toutes les proximités similaires sont ignorées
   * 
   */
  get state(){ return this._state || 1 }
  set state(newState) { this._state = newState }
  
  /**
   * Définit la propriété @proximity de chaque mot
   */
  setProximityOfEachWord(){
    this.motAvant.proxApres = this
    this.motApres.proxAvant = this
  }

  /**
   * @return l'éloignement sous forme de 'near', 'mid' ou 'far' pour
   * spécifier approximativement si la proximité est importante ou 
   * non. Le retour servira de classe CSS
   * Cette valeur est calculée à l'instanciation des proximités dans
   * le Lemma
   */
  get eloignement()     { return this._eloign }
  set eloignement(eloi) { this._eloign = eloi }

  get distance()        { return this._dist }
  set distance(dist)    { this._dist = dist }

  get density()         { return this._density || this.calcDensity() }
  set density(d)        { this._density = d }

  // --- Private Methods ---

  mustBeValidMot(mot, where){
    mot || raise(`Le mot ${where} doit impérativement être défini`)
    mot instanceof Mot || mot instanceof NomPropre || raise(tp(ERRORS.mustBeMot, ['Le mot '+where]), mot)
    return true
  }

  /**
  * Calcul la densité de cette proximité
  * 
  * La densité correspond au nombre d'occurrence du lemme dans un 
  * passage compris entre l'offset du mot d'avant - la distance de 
  * proximité et l'offset du mot d'après + la distance de proximité
  * 
  */
  calcDensity(){
    const lemma     = TextFragment.current.getLemma(this.motAvant.lemma)
    const positions = lemma.positions
    const minOffset = int(this.motAvant.offset) - lemma.distance_minimale
    const maxOffset = int(this.motApres.offset) + lemma.distance_minimale
    var density = 0
    for(var i = 0, len = positions.length; i < len; ++i){
      const position = int(positions[i])
      if ( position < minOffset ) { continue }
      else if ( position > maxOffset ) { break }
      else { density ++ }
    }
    return density
  }
}
