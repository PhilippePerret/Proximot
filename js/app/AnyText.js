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

  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel anytext'})
    o.innerHTML = this.content
    this.observe(o)
    return o
  }

  observe(){
    
  }

}
