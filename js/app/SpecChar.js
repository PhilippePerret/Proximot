'use strict';

class SpecChar extends TextElement {

  constructor(spec){
    super(spec)
    this.type   = 'spec'
    this.Klass  = 'SpecChar'
  }

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué le caractères spécial", this.content)
    return stopEvent(e)
  }


  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel spec', text:this.content})
    this.observe(o)
    return o
  }
  observe(o){
    super.observe(o)

  }

}
