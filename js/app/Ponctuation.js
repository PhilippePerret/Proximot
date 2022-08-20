'use strict';

class Ponctuation extends TextElement {

  constructor(ponct){
    super(ponct)
    this.type   = 'ponct'
    this.Klass  = 'Ponctuation'
  }

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué la ponctuation", this.content)
    return stopEvent(e)
  }


  build(){
    const o = DCreate('SPAN', {class:'texel ponct', text:this.content})
    this.observe(o)
    return o
  }
  observe(o){
    super.observe(o)

  }

}
