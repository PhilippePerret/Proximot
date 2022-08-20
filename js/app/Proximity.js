'use strict'
class Proximity {

  constructor(motAvant, motApres){
    ;(motAvant && motAvant instanceof Mot) || raise(tp(ERRORS.mustBeMot, ['Le mot avant']))
    ;(motApres && motApres instanceof Mot ) || raise(tp(ERRORS.mustBeMot, ['Le mot après']))
    motApres.relPos > motAvant.relPos || raise(ERRORS.proximity.apresMustBeApres)
    this.motAvant = motAvant
    this.motApres = motApres
    this.setProximityOfEachWord()
  }

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
