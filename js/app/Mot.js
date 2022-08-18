'use strict';
class Mot extends TextElement {

  constructor(mot){
    super(mot)
    this.mot = mot
    this.type = 'mot'
  }

  // --- Public Methods ---

  // --- /Public Methods ---

  // --- Listener Methods ---

  onClick(e){
    super.onClick(e)
    console.log("J'ai cliqué ", this.mot)
    return false
  }
  onMouseOver(e){
    return super.onMouseOver(e)
  }

  // --- /Listener Methods ---


  build(){
    const o = DCreate('SPAN', {class:'texel mot'})
    o.innerHTML = this.mot
    this.observe(o)
    return o
  }
  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
  }
}
