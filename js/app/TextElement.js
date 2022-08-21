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
    // console.info("Instanciation de text-element avec : ", data)
    this.content = data[0]
    // console.info("this.content = ", this.content)
    this.ttTag   = data[1] // NAM, VER:pres, etc.
    this.lemma   = data[2]
    this.id = this.constructor.getNewId()
  }

  // --- Public Methods ---

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
    return this._len || (this._len = this.content.length)
  }

  // --- /Public Methods ---

  get domId(){
    console.log("[domId] type, id, this = ", this.type, this.id, this)
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
