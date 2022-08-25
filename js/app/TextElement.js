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
    this.table  = {} 
    this.lastId = 0
  }

  static getById(id){
    return this.table[id]
  }

  static add(texel){
    Object.assign(this.table, {[texel.id]: texel})
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
    const dataFragment = data.data
    // this.reset() // SURTOUT PAS (on perdrait les fragments chargés avant)
    var texel
    const paragraphs = [];
    dataFragment.paragraphs.forEach( dparag => {
      const parag_index   = int(dparag.index)
      const parag_texels  = dparag.mots.map( dtexel => {
        switch(dtexel.type){
        case 'mot': case '':  texel = new Mot(dtexel);         break;
        case 'nom-propre':    texel = new NomPropre(dtexel);   break;
        case 'ponct':         texel = new Ponctuation(dtexel); break;
        default:
          raise("Je ne connais pas le type ", dtexel.type)
        }
        if ( texel.id > this.lastId ) this.lastId = texel.id
        return texel
      })
      const paragraph = new Paragraph(parag_index, parag_texels)
      paragraphs.push(paragraph)
    })
    /*
    |  On peut instancier le texte courant
    */

    const firstParagraph  = int(dataFragment.id.split('-')[0])
        , texte           = Texte.current || (new Texte(paragraphs))
        , fragmentIndex   = dataFragment.fragment_index
        , fragment        = new TextFragment(texte, firstParagraph, paragraphs)
    texte.setFragment(fragmentIndex, fragment)
    Editor.display(texte.fragment(fragmentIndex))
  }

  static get PROPERTIES(){
    if (undefined == this._properties){
      this._properties = {
          id:         { hname:'Identifiant du text-element', type:'int'}
        , content:    { hname:'Le contenu textuel'}
        , ttTag:      { hname:'Type tree-tagger du text-element'}
        , type:       { hname:'Type Proximot du text-element'}
        , lemma:      { hname:'Lemme du text-element'}
        , selected:   { hname:'Sélection du text-element', type:'bool'}
      }
    }
    return this._properties
  }
  static get PROPERTIES_KEYS(){return Object.keys(this.PROPERITES)}
  
  get PROPERTIES_KEYS(){return this.constructor.PROPERTIES_KEYS}

  constructor(data){
    this.id       = this.constructor.getNewId()
    this._content = data[0]
    // console.info("this.content = ", this.content)
    this.ttTag    = data[1] // NAM, VER:pres, etc.
    this.lemma    = data[2]
    this.constructor.add(this)
  }

  // --- Public Methods ---

  get content() { return this._content }
  set content(v){ this._content = v    }

  get inspect(){
    return this._inspect || (this._inspect = `<<<${this.type} #${this.id} ${this.content.substring(0,20)}...>>>`)
  }

  getData(){
    return this.PROPERTIES_KEYS.map(prop => {return this[prop]})
  }
  setData(){}// utile ?

  /** OBSOLÈTE @return les données à sauver, pour tout text-element */
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
