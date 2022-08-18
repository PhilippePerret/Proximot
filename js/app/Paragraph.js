'use strict';

class Paragraph extends TextElement {

  constructor(texelList){
    super(texelList)
  }

  // --- Public Methods ---

  // @return le DIV (DOM Element) du paragraphe
  // @note: alias de this.obj
  get div(){return this.obj}

  // --- /Public Methods ---

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué le paragraphe", this.content)
    return stopEvent(e)
  }
  onMouseOver(e){return stopEvent(e)}


  build(){
    const o = DCreate('DIV', {class:'paragraph'})
    this.content.forEach(texel => {
      o.appendChild( texel.span)
    })
    this.observe(o)
    return o
  }
  observe(o){
    super.observe(o)

  }

}
