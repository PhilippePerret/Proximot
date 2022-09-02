import { itraise, ITClass } from '../../system/InsideTest/inside-test.lib.js'

/**
* Librairie permettant de tester facilement le fragment courant avec
* des méthodes should et should.not comme :
* 
*   haveLength(<x>)
*   haveNombreMots(<x>)
* 
* À faire :
* --------
* 
* 
* @usage
* ------
*     import {ITFragment} from './utils/IT_Mot.js'
*/
class ITFragmentClass extends ITClass {
  constructor(){
    super('Le fragment courant')
    this.frag = TextFragment.current
  }

  haveNombreMots(nb){
    this.estimate(this.frag.mots.length == nb) || this.err('avoir '+nb+' mots (en a '+this.frag.mots.length+')')
  }
  haveLength(len) {
    this.estimate(this.frag.length == len) || this.err('avoir une longueur de '+len+' (sa longueur est '+this.frag.length+')')
  }

}


export function ITFragment(){
  return new ITFragmentClass()
}

