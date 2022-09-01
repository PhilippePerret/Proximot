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

  static resetAll(){
    this.table  = {}
    this.lastId = 0
    delete this._properties
  }

  static reset(){
    this.table  = {} 
    this.lastId = App.State.last_texel_id || 0
  }

  static getById(id){
    return TextElement.table[id]
  }

  static add(texel){
    Object.assign(TextElement.table, {[texel.id]: texel})
  }

  /* Ne surtout pas appeler la méthode texel.destroy depuis ici
     puisqu'elle appelle cette méthode. */
  static destroy(texel){
    delete TextElement.table[texel.id]
  }

  static count(){return Object.keys(TextElement.table).length}

  static getNewId(){
    return TextElement.lastId ++ 
  }

  static instanciateFromPackage(fragment, texelsData){
    /*
    |  On retire la première ligne des labels (plus tard, elle pourra
    |  servir à connaitre l'ordre des données — s'il est modifié)
    */
    texelsData.shift()
    /*
    |  La liste des instances {TextElement} retournée
    */
    const texels = []
    var curoff = 0
    var idx    = 0
    texelsData.forEach(dtexel => {
      dtexel.push(curoff)
      const texel = this.createFromDataPackage(fragment, dtexel)
      if ( texel.isMot ) texel.index = idx++
      texels.push(texel)
      curoff += texel.length
    })
    return texels
  }

  static createFromDataPackage(fragment, data) {
    // console.log("data texel initiales:", data)
    const dInstance = {}
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
      dInstance[kproperty] = value
    }
    /*
    |  En fonction du type, on choisit la classe fille.
    */
    // console.log("dInstance pour l'instancier = ", dInstance)
    const instance = this.instantiateByType(fragment, dInstance)

    return instance
  }

  static createFromTextData(fragment, data){
    // console.log("data texel initiales:", data)
    const dInstance = {}
    /*
    |  Données venant d'un texte non analysé
    */
    const [content, ttTag, lemma, offset] = data
    dInstance._content  = content
    dInstance.ttTag     = ttTag
    dInstance.lemma     = lemma
    dInstance.type      = this.getTypeFromTTaggerType(ttTag, content)
    dInstance.offset    = offset

    /*
    |  En fonction du type, on choisit la classe fille.
    */
    // console.log("dInstance pour l'instancier = ", dInstance)
    const instance = this.instantiateByType(fragment, dInstance)

    return instance
  }

  static instantiateByType(fragment, data){
    switch(data.type){
      case 'mot':         return new Mot(fragment, data)
      case 'ponct':       return new Ponctuation(fragment, data)
      case 'nom-propre':  return new NomPropre(fragment, data)
      default:            return new AnyText(fragment, data)
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

  /**
  * Pour supprimer toutes les exergues courantes
  */
  static unsetExergues(){
    DGetAll('.exergue').forEach( dom => dom.classList.remove('exergue'))
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


  constructor(fragment, data){
    this.fragment = fragment
    this.id = data.id || TextElement.getNewId()
    this.setData(data)
    TextElement.add(this)
    this.isMot && this.addToLemmas()
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
  setData(data){
    for(var prop in data){ if ( prop != 'type' ) this[prop] = data[prop]}
    this.id = int(this.id)
    if ( isDefined(this.offset) ) { this.offset = int(this.offset) }
  }

  // --- Removing Methods ---

  /**
  * 
  *   DESTRUCTION DU TEXEL
  *   --------------------
  * 
  * C'est une opération particulièrement complexe qui joue à beaucoup
  * de niveaux dans l'application.
  * 
  * @param options {Hash} Table des options de destruction
  *           options.ignoreLength    Ne pas tenir compte du changement de longueur des textes
  */
  destroy(options){

    /* par rapport aux longueurs (pour paragraphe, ok ) */

    /*
    |  Influence sur les LEMMAS
    |                    ------
    |   - retrait de son lemma
    |   - mais on le laisse dans la liste par mot qui permet de
    |     retrouver rapidement un lemme de mot (sans interrogation
    |     serveur)
    */
    this.removeFromLemmas()

    /*
    |  Influence sur le DOM
    |                   ---
    |  - suppression de l'affichage du mot
    */
    this.unbuild()

    /*
    |  Influence sur les PROXIMITÉS
    |                    ----------
    |  -  les mots proches ne doivent plus afficher leur proximité
    |     avec ce mot. Mais elles doivent vérifier qu'il n'y est pas
    |     d'autre mot en proximité à la place.
    */
    this.proxAvant && Proximity.remove(this.proxAvant, {ignore: this, update: this.proxAvant.motAvant})
    this.proxApres && Proximity.remove(this.proxApres, {ignore: this, update: this.proxApres.motApres})

    /*
    |  Influence sur la SÉLECTION et les EXERGUES
    |                   --------------------------
    */
    this.unsetExergue()
    this.isSelected && Editor.Selection.remove(this)

    /*
    |  Influence sur le PARAGRAPHE
    |                   ----------
    |   - retire le mot de son paragraphe (toutes les valeurs du
    |     paragraphe sont à recalculer). Cela influence aussi la
    |     longueur.
    */
    this.paragraph.remove(this)

    /*
    |  Influence sur les TEXTELEMENTS
    |                    ------------
    |   - retrait de la liste (table) de classe
    */
    TextElement.destroy(this)


  }

  // --- DOM Building Methods ---

  /**
  * Construction du texel
  */
  buildIn(container){
    container.appendChild(this.obj)
  }

  /**
  * Destruction de l'objet dans le DOM
  */
  unbuild(){
    this.obj.remove()
  }

  /* Raccourci */
  get span(){ return this.obj }

  // get isMot(){ return ['mot','nom-propre'].includes(this.type) }
  get isMot(){ return false }


  get isSelected(){ return this._isselected  || false }
  set isSelected(v) { this._isselected = v }
  
  setSelected(){
    this.obj.classList.add('selected')
    this.isMot && this.showInfos()
  }
  unsetSelected(){
    this.obj.classList.remove('selected')
  }

  setExergue(){
    this.obj.classList.add('exergue')
  }
  unsetExergue(){
    this.obj.classList.remove('exergue')
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


  // --- DOM Methods ---

  build(){
    const o = DCreate('SPAN', {id:this.domId, class:this.css})
    o.innerHTML = this.content
    this.observe(o)
    return o
  }

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

  getCssClasses(classesCss){
    classesCss.push('texel')
    this.hasSpaceBefore   && classesCss.push('space-before')
    this.hasNoSpaceAfter  && classesCss.push('no-space-after')
    return classesCss.join(' ')
  }
  get hasSpaceBefore(){
    return this._hasinsec || ( this._hasinsec = this.content.match(/[\(«»\!\?\;\:]/))
  }
  get hasNoSpaceAfter(){
    return this._hasnospaf || ( this._hasnospaf = this.content.match(/[\(']$/))
  }

}

const Texel = TextElement
