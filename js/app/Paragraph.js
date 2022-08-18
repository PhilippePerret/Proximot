'use strict';

class Paragraph extends TextElement {

  constructor(texelList){
    super(texelList)
  }

  // --- Public Methods ---

  // @return le DIV (DOM Element) du paragraphe
  // @note: alias de this.obj
  get div(){return this.obj}

  /**
   * @return nombre de mots du paragraphe
   */
  motsCount(){
    return this._mcount || (this._mcount = this.countMots().nbm )
  }

  /**
   * @return {Number} La longueur du paragraphe
   */
  length(){
    return this._length || ( this._length = this.countMots().len )
  }

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

  // --- Private Methods ---

  countMots(){
    var   nombre    = 0
        , longueur  = 0
        ;
    this.content.forEach( texel => {
      if ( texel.isMot ) nombre += 1
      longueur += texel.length
    })
    // Mettre dans les propriétés
    this._length = longueur
    this._mcount = nombre
    return {nbm: nombre, len: longueur} // pour renseignement immédiat
  }
}
