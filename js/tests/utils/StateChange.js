import { itraise } from '../../system/InsideTest/inside-test.lib.js'

/**
* Pour tester les changements opérés dans l'application de façon
* simple
* 
* 

@todo
-----
  - Transformer en une classe qui puisse servir pour n'importe quelle
    application.
    - l'app doit définir dans App.ITWatchableProperties les 
      propriétés qui sont à surveiller et comment on obtient leurs
      valeurs. Par exemple, pour Proximot :
        {
          nb_mots_fragment: ()=>{return TextFragment.current.mots.length}
          ou :
          nb_mots_fragment: this.getNombreMotsFragment.bind(this)
        }
        getNombreMotsFragment(){
          return TextFragment.current.mots.length
        }

@usage
------

  import {ITAppStateChange as TestChange} from './utils/StateChange.js'

  new TestChange()
    .preCheck(function(){
      // vérifications à faire au départ
    })
    .operate(function(){
      // L'opération à vérifier  
    })
    .postCheck(function(){
      // Les vérifications (hasChanged, is, was, etc.)
    })

  On peut aussi faire (si on ne peut pas mettre l'opération ou 
  les checks dans des méthodes qui seront dans le scope de l'instance)

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

  preCheck(method){ method.call(this); return this }
  operate(method){ method.call(this); return this }
  postCheck(method){ 
    this.postState = this.getCurrentState()
    method.call(this); 
    return this 
  }

  get(what){
    return this.prevState[what]
  }
  equalOrRaise(){
    if ( not(this.expected == this.actual) ) {
      itraise(`La propriété '${this.what}' est incorrecte.\n\tAvant opération : ${this.prevState[this.what]}\n\tAprès opération : ${this.postState[this.what]}\n\tAttendue: ${this.expected}`)
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
        this.expected = prevValue + how
        break
      case 'function':
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
  * OBSOLÈTE, l'état sera pris par propriété sans tout faire à 
  * chaque fois. TODO
  */
  definePostState(){ this.postState = this.getCurrentState()}

  /**
  * Prend le maximum d'informations sur l'état courant de l'application
  * et du fragment en édition
  */
  getCurrentState(){
    const table = {}
    for(var k in this.watchableProperties) {
      Object.assign(table, {[k]: this.watchableProperties[k]() })
    }
    return table
  }

  get watchableProperties(){
    return this._wprops || (this._wprops = App.ITWatchableProperties) 
  }

}
