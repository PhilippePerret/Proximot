import { itraise } from '../../system/InsideTest/inside-test.lib.js'

/**
* Pour tester les changements opérés dans l'application de façon
* simple
* 

@usage
------

  import {ITAppStateChange} from './utils/StateChange.js'

  // Prendre l'état au départ (avant l'opération à tester)
  const state = new ITAppStateChange()

  // Faire l'opération

  // Prendre le nouvel état
  state.definePostState()

  // Faire les tests de changement à l'aide de la méthode hasChanged
  // hasChanged(<propriété d'état>, <changement> )
  // Changement peut être : 
  //   *  UN NOMBRE. Par exemple, si le nombre de 
  //      mots affichés doit avoir baissé de une valeur :
  //      state.hasChanged('nb_mots', -1)
  //   *  UNE FONCTION. Si on lui envoie la valeur précédente, elle
  //      doit renvoyer la nouvelle valeur. Par exemple, pour obtenir
  //      le même résultat que ci-dessus avec -1 :
  //      (v) => { return v - 1 }
  state.hasChanged(<state prop>, )

  // méthode 'is' 
  state.is(<prop d'état>, <valeur fixe attendue>)
  // Méthode 'was' pour vérifier l'état précédent
  state.was(<prop d'état>, <valeur>)
  // Les deux méthodes peuvent être chainées (sans répéter la propriété)
  state.was(<prop d'état>, <valeur>).is(<valeur>)


*/
export class ITAppStateChange {
  constructor(){
    this.prevState = this.getCurrentState()
  }
  get(what){
    return this.prevState[what]
  }
  equalOrRaise(){
    if ( not(this.expected == this.actual) ) {
      itraise(`La propriété '${this.what}' est incorrecte.\n\tAttendue: ${this.expected}\n\tObtenue : ${this.actual}`)
    }
  }
  was(what, value) {
    this.what = what
    this.expected = value
    this.actual = this.prevState[what]
    this.equalOrRaise()
    return this
  }
  is(what, value){
    if ( undefined === value ) {
      [what, value] = [this.currentWhat, what]
    }
    this.what     = what
    this.expected = value
    this.actual   = this.postState[what]
    this.equalOrRaise()
  }
  /**
  * Pour vérifier un changement
  */
  hasChanged(what, how){
    this.what = what
    const prevValue = this.prevState[what]
    this.actual     = this.postState[what]
    let ok ;
    switch(typeof how){
      case 'number':
        console.log("Test avec un nombre")
        this.expected = prevValue + how
        break
      case 'function':
        console.log("Tests avec une fonction")
        this.expected = how(prevValue)
        break
      default :
        console.log("Test avec un string (?)")
        return erreur("Je ne sais pas traiter le type " + typeof how) 
    }
    this.equalOrRaise()
  }

  /**
  * Pour définir l'état après l'opération
  */
  definePostState(){ this.postState = this.getCurrentState()}

  /**
  * Prend le maximum d'informations sur l'état courant de l'application
  * et du fragment en édition
  */
  getCurrentState(){
    const fragment = TextFragment.current
    return {
        nb_mots           : fragment.mots.length
      , nb_texels         : fragment.texels.length
      , nb_displayed_mots : this.getNombreDisplayedMots()
      , nb_proximities    : Proximity.count()
    }
  }



  // *- Private Methods -*

  /**
  * Retourne le nombre de mots affiché (il s'agit vraiment des mots)
  */
  getNombreDisplayedMots(){
    return DGetAll('.texel.mot', Editor.content).length
  }
}
