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

  static reset(){
    this.lastId = 0
  }

  static getNewId(){
    return this.lastId ++ 
  }

  constructor(data){
    this.id       = this.constructor.getNewId()
    this._content = data[0]
    // console.info("this.content = ", this.content)
    this.ttTag    = data[1] // NAM, VER:pres, etc.
    this.lemma    = data[2]
  }

  // --- Public Methods ---

  get content() { return this._content }
  
  set content(v){ this._content = v    }

  get inspect(){
    return this._inspect || (this._inspect = `<<<${this.type} #${this.id} ${this.content.substring(0,20)}...>>>`)
  }

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

  get length(){
    if ( undefined == this.content ) {
      console.error("Texel sans content : ", this)
      return 4
    }
    return this._len || (this._len = this.content.length)
  }

  // --- /Public Methods ---

  get domId(){
    return this._domid || (this._domid = `${this.type}-${this.id}`)
  }

  get obj(){
    return this._obj || (this._obj = DGet(`#${this.domId}`) || this.build() )
  }

  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
    o.addEventListener('mouseover', this.onMouseOver.bind(this))
  }

  // --- à redéfinir par les classes filles ---
  onClick(e){
    if ( this.isMot ) {
      Editor.Selection.toggle(this, e.shiftKey)
    }
    return stopEvent(e)
  }
  onMouseOver(e){
    if ( e.shiftKey ) {
      Editor.Selection.toggle(this,true)
    }
    return stopEvent(e)
  }
}
