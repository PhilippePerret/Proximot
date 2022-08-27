'use strict';

class SpecChar extends TextElement {

  constructor(fragment, spec){
    super(fragment, spec)
    this.Klass  = 'SpecChar'
  }

  // --- Public Methods ---
  get type(){ return 'spec' }

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
