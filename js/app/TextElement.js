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
    return TextElement.table[id]
  }

  static add(texel){
    Object.assign(TextElement.table, {[texel.id]: texel})
  }

  static getNewId(){
    return TextElement.lastId ++ 
  }

  static instanciate(texelsData){
    var curoff = 0
    texelsData.forEach(dtexel => {
      dtexel.push(curoff)
      const texel = this.createFromData(dtexel)
      curoff += texel.length
    })
  }

  static createFromData(data){
    // console.log("data texel:", data)
    const instance_data = {}
    if ( data.length == 3 ) {
      /*
      |  Données venant d'un texte non analysé
      */
      const [content, ttTag, lemma] = data
      instance_data._content  = content
      instance_data.ttTag     = ttTag
      instance_data.lemma     = lemma
      instance_data.type      = this.getTypeFromTTaggerType(ttTag, content)
    } else {
      /*
      |  Données Proximot complète
      */
      for (var kproperty in this.PROPERTIES) {
        const dproperty = this.PROPERTIES[kproperty]
        let value       = data[dproperty.index]
        /*
        |  Suivant le donnée, on peut avoir à rectifier son type
        */
        switch(dproperty.type) {
        case 'int'  : 
          value = int(value)
          if ( value > this.lastId ) { this.lastId = value}
          break
        case 'bool' : 
          value = bool(value)
          break
        }
        instance_data[kproperty] = value
      }
    }

    /*
    |  En fonction du type, on choisit la classe fille.
    */
    console.log("instance_data = ", instance_data)
    switch(instance_data.type){
      case 'mot':         return new Mot(instance_data)
      case 'ponct':       return new Ponctuation(instance_data)
      case 'nom-propre':  return new NomPropre(instance_data)
      default:            return new AnyText(instance_data)
    }
  }

  /**
  * Retourne le type Proximot ('mot', 'ponct', etc.) en fonction du
  * tag tree-tagger ('MOT', 'NAME', 'PUN', etc.)
  * 
  * [1] Les abréviations (ABR) peuvent être des choses comme une 
  *     suite de tirets ou d'étoiles. Donc tout ce qui est sans une
  *     seule lettre ne sera pas considéré comme un mot ({Mot}) mais
  *     comme un type {AnyText}
  */
  static getTypeFromTTaggerType(ttTag, sujet){
    const [mainTag, subTag] = ttTag.split(':')
    switch(mainTag){
    case 'PUN': case 'SENT':  
      return 'ponct';
    case 'NAM':
      return 'nom-propre';
    case 'ABR': /* [1] */
      if ( sujet.match(/[a-zA-Z0-9]/) ) {
        return 'mot'
      } else {
        return 'any'
      }
    default:      
      return 'mot';
    }
  }

  static get PROPERTIES(){
    if (undefined == this._properties){
      /*
      |  :index correspond à l'index de la donnée dans le fichier CSV
      |  où sont enregistrés les mots.
      */
      this._properties = {
          id          :{ name:'id'         , index:0, hname:'Identifiant du text-element', type:'int'}
        , content     :{ name:'_content'   , index:1, hname:'Le contenu textuel'}
        , ttTag       :{ name:'ttTag'      , index:2, hname:'Type tree-tagger du text-element'}
        , type        :{ name:'type'       , index:3, hname:'Type Proximot du text-element'}
        , lemma       :{ name:'lemma'      , index:4, hname:'Lemme du text-element'}
        , isSelected  :{ name:'isSelected' , index:5, hname:'Sélection du text-element', type:'bool'}
        , offset      :{ name:'offset'     , index:6, hname:'Offset du mot dans le fragment'}
      }
    }
    return this._properties
  }
  static get PROPERTIES_KEYS(){return Object.keys(this.PROPERTIES)}
  
  get PROPERTIES_KEYS(){return this.constructor.PROPERTIES_KEYS}



  // ############     INSTANCE     ##########


  constructor(data){
    this.id = data.id || TextElement.getNewId()
    this.dispatch(data)
    TextElement.add(this)
  }

  /**
  * Pour dispatcher les données dans l'instance, à l'instanciation
  */
  dispatch(data){
    for(var prop in data){ this[prop] = data[prop]}
  }


  // --- Public Methods ---

  get content() { return this._content }
  set content(v){ this._content = v    }

  get inspect(){
    return this._inspect || (this._inspect = `<<<${this.type} #${this.id} ${this.content.substring(0,20)}...>>>`)
  }

  getData(){
    return this.constructor.PROPERTIES_KEYS.map(prop => {return this[prop]})
  }
  setData(){}// utile ?

  get span(){
    return this.obj
  }

  get isMot(){ return ['mot','nom-propre'].includes(this.type) }

  get isSelected(){ return this._isselected  || false }
  set isSelected(v) { this._isselected = v }
  
  setSelected(){
    this.obj.classList.add('selected')
    this.isMot && this.showInfos()
  }
  unsetSelected(){
    this.obj.classList.remove('selected')
  }

  /**
  * @return la distance absolue du text-element avec +texel+
  */
  distanceWith(texel){
    return Math.abs(texel.offset - this.offset)
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
    return stopEvent(e)
  }
  onMouseOver(e){
    return stopEvent(e)
  }
}
