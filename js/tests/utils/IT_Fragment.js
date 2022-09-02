import { itraise, ITClass } from '../../system/InsideTest/inside-test.lib.js'

/**
* Librairie permettant de tester facilement le fragment courant (ou
* le fragment donné à l'instanciation) avec des méthodes should et 
* should.not comme :
* 
*   haveLength(<x>)
*   haveTextOffset()
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
  constructor(frag){
    const nom = frag ? `Le fragment #${frag.index}` : 'Le fragment courant'
    super(nom)
    this.frag = frag || TextFragment.current
  }

  haveNombreMots(nb){
    this.estimate(this.frag.mots.length == nb) || this.err('avoir '+nb+' mots (en a '+this.frag.mots.length+')')
  }
  haveLength(len) {
    this.estimate(this.frag.length == len) || this.err('avoir une longueur de '+len+' (sa longueur est '+this.frag.length+')')
  }
  haveTextOffset(nb){
    this.estimate(this.frag.offsetInText == nb) || this.err('avoir un offset dans le texte de '+nb+' (son offsetInText vaut ' + this.frag.offsetInText + ').')
  }

}


export function ITFragment(){
  return new ITFragmentClass()
}

