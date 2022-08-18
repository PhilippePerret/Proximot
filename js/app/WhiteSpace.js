'use strict';

class WhiteSpace extends TextElement {

  constructor(char){
    super(char)

  }

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué une espace")
    return stopEvent(e)
  }


  build(){
    const o = DCreate('SPAN', {class:'texel wspace', text:' '})
    this.observe(o)
    return o
  }
  observe(o){
    super.observe(o)

  }

}
