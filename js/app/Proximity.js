'use strict'
class Proximity {

  static getById(id){ return this.table[id] }

  /**
   * @retourne toutes les données Proximités à enregistrer
   * 
   */
  static getData(){
    if ( undefined == this.items ) return null;
    return this.items.map( proxi => {
      return proxi.data2save
    })
  }

  static setData(data){
    console.log("Données proximité à dispacher :", data)
    data.forEach( dproximity => new Proximity(dproximity) )
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

  /*
  | ################     INSTANCE     #################
  */

  constructor(data){
    if ( data.motAvant || data.motApres ) {
      /*
      |  Instanciation en cours de programme (pas en remontée des
      |  données initiales)
      */
      ;(motAvant && motAvant instanceof Mot) || raise(tp(ERRORS.mustBeMot, ['Le mot avant']))
      ;(motApres && motApres instanceof Mot ) || raise(tp(ERRORS.mustBeMot, ['Le mot après']))
      motApres.relPos > motAvant.relPos || raise(ERRORS.proximity.apresMustBeApres)
      this.id       = this.constructor.getNewId()
      this.motAvant = motAvant
      this.motApres = motApres
    } else {
      /*
      |  Instanciation à partir de données remontées d'un fichier
      |  proximot (.pxw)
      */
      this.dispatch(data)
    }
    this.setProximityOfEachWord()
    this.constructor.add(this)
  }

  get data2save(){
    return {
        id:           this.id
      , motAvantId:   this.motAvant.id
      , motApresId:   this.motApres.id
      , distance:     this.distance
      , eloignement:  this.eloignement
      , state:        this.state
    }
  }

  /**
  * Dispatcher les données remontées du serveur (récoltées dans le
  * fichier Proximot) en réglant certaines valeurs à commencer par
  * l'instance des mots avant et après (if any)
  */
  dispatch(data){
    this.id         = int(data.id)
    this._dist      = int(data.distance)
    this.motApresId = data.motApresId && int(data.motApresId)
    if (this.motApresId) { this.motApres = Mot.get(this.motApresId) }
    this.motAvantId = data.motAvantId && int(data.motAvantId) 
    if (this.motAvantId) { this.motAvant = Mot.get(this.motAvantId) }
    this._state     = int(data.state)
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
   */
  get eloignement(){
    return this._eloign || ( this._eloign = this.calcEloignement())
  }

  get distance(){
    return this._dist || (this._dist = this.motApres.relPos - this.motAvant.relPos)
  }

  calcEloignement(){
    if ( this.distance > 2 * Proximity.tiersDistance ) {
      return 'far'
    } else if (this.distance > Proximity.tiersDistance ) {
      return 'mid'
    } else {
      return 'near'
    }
  }
  static get tiersDistance(){
    return this._tiersdist || (this._tiersdist = Preferences.get('min_dist_proximity') / 3)
  }
}
