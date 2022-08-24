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

  /**
  * - main -
  * 
  * Méthode principale qui reçoit toutes les données mots du fichier
  * Proximot (remontées par le serveur) et les dispatche.
  * 
  */
  static setData(data){
    console.log("Data à dispatcher : ", data)
    this.reset()
    var texel ; 
    data.paragraphs.forEach( dparag => {
      const parag_index   = int(dparag.index)
      const parag_texels  = parag.mots.map( dtexel => {
        switch(dtexel.type){
        case 'mot': case '':  texel = new Mot(dtexel);         break;
        case 'ponct':         texel = new Ponctuation(dtexel); break;
        default:
          raise("Je ne connais pas le type ", dtexel.type)
        }
        if ( texel.id > this.lastId ) this.lastId = texel.id
        return texel
      })
      const paragraph = new Paragraph(parag_index, parag_texels)
    })
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

  /** @return les données à sauver, pour tout text-element */
  get data2save(){
    return {
        id:         this.id
      , content:    this.content
      , ttTag:      this.ttTag
      , lemma:      this.lemma
      , selected:   this.isSelected
    }
  }

  get span(){
    return this.obj
  }

  get isMot(){ return this.type == 'mot'}

  get isSelected(){ return this._isselected  }
  set isSelected(v) { this._isselected = v }
  
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
