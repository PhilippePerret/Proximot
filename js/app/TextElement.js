'use strict';

/**
 * class TextElement
 * -----------------
 * Classe abstraite de tout élément textuel à commencer
 * par :
 * - les mots (Mot)
 * - les ponctuations (Ponctuation)
 * - les espaces (WhiteSpace)
 * 
 */
class TextElement {

  constructor(content){
    this.content = content
  }

  // --- Public Methods ---

  get span(){
    return this.obj
  }

  get isMot(){ return this.type == 'mot'}

  setSelected(){
    this.obj.classList.add('selected')
  }
  unsetSelected(){
    this.obj.classList.remove('selected')
  }

  // --- /Public Methods ---

  get obj(){
    return this._obj || (this._obj = this.build())
  }

  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
    o.addEventListener('mouseover', this.onMouseOver.bind(this))
  }

  // --- à redéfinir par les classes filles ---
  onClick(e){
    Editor.Selection.toggle(this, e.shiftKey)
    return stopEvent(e)
  }
  onMouseOver(e){
    if ( e.shiftKey ) {
      Editor.Selection.toggle(this,true)
    }
    return stopEvent(e)
  }
}
