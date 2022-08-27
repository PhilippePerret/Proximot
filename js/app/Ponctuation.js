'use strict';

class Ponctuation extends TextElement {

  constructor(fragment, ponct){
    super(fragment, ponct)
    this.type   = 'ponct'
    this.Klass  = 'Ponctuation'
  }

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué la ponctuation", this.content)
    return stopEvent(e)
  }


  build(){
    const o = DCreate('SPAN', {class:this.css, text:this.content})
    this.observe(o)
    return o
  }
  get css(){
    const classesCss = ['texel','ponct']
    this.hasInsecable && classesCss.push('ponct-is')
    return classesCss.join(' ')
  }
  observe(o){
    // super.observe(o)
  }

  get hasInsecable(){
    return this._hasinsec || ( this._hasinsec = this.content.match(/[\!\?\;\:]/))
  }

}
