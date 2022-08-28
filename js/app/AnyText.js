'use strict';
/**
* class AnyText < TextElement
* -------------
* Pour tous les éléments textuels inconnus (en dehors des mots, des
* ponctuations, etc.)
*/

class AnyText extends TextElement {
  constructor(fragment, data){
    super(fragment, data)
  }

  get type(){return 'anytexel'}

  get css(){
    return super.getCssClasses(['anytext'])
  }


}
