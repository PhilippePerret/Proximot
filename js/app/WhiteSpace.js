'use strict';

class WhiteSpace extends TextElement {

  constructor(char){
    super(char)
    this.type   = 'wspace'
    this.Klass  = 'WhiteSpace'
  }

  // --- Public Methods ---


  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué une espace")
    return stopEvent(e)
  }


  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel wspace', text:' '})
    this.observe(o)
    return o
  }
  observe(o){
    super.observe(o)

  }

}
