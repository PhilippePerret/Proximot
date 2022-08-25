'use strict';

class Paragraph {

  constructor(index, texels){
    this.index   = index
    this.Klass   = 'Paragraph'
    /*
    |  Les données fournies à l'instanciation sont "brutes", ce sont
    |  juste les trinomes ou les données des mots
    */
    this.content = texels.map( dtexel => { 
      return TextElement.createFromData(dtexel)
    })
  }

  // --- Public Methods ---

  /**
  * @return les données du paragraphe :
  *    {Hash} contenant :
  *       paragData:    données du paragraphe (liste des ID de texels)
  *       texels:       données des mots (csv)
  *       proximities:  données des proximités (csv)
  */  
  getData(){
    const proximities = []
        ;

    const texels = this.texels.map( texel => {
      texel.proxAvant && proximities.push(texel.proxAvant.getData())
      texel.proxApres && proximities.push(texel.proxApres.getData())
      return texel.getData()
    })
    texels.unshift(TextElement.PROPERTIES_KEYS)
    proximities.unshift(Proximity.PROPERTIES_KEYS)

    return {
        paragData: {
            index:          this.index
          , fragmentIndex:  this.fragment.index
        }
      , texels: texels
      , proximities: proximities
    }
  }

  // @return le DIV (DOM Element) du paragraphe
  // @note: alias de this.obj
  get div(){return this.obj || (this.obj = this.build())}


  /**
  * @return la liste des text-elements du paragraph, dans l'ordre
  */
  get texels(){
    return this.content
  }

  /**
   * @return la liste des mots (et uniquement les mots) du 
   * paragraphe
   */
  get mots(){
    return this._mots || (this._mots = this.countMots().mots)
  }

  /**
   * @return nombre de mots du paragraphe
   */
  get motsCount(){
    return this._mcount || (this._mcount = this.countMots().nbm )
  }

  /**
   * @return {Number} La longueur du paragraphe
   */
  get length(){
    return this._length || ( this._length = this.countMots().len )
  }

  // --- /Public Methods ---

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué le paragraphe", this.content)
    // return stopEvent(e)
  }
  onMouseOver(e){return stopEvent(e)}


  build(){
    const o = DCreate('DIV', {class:'paragraph'})
    this.content.forEach(texel => {
      texel.fragment = this.fragment
      o.appendChild( texel.span )
    })
    this.observe(o)
    return o
  }
  
  observe(o){

  }

  get fragment() { return this._fragment }
  set fragment(frag){ this._fragment = frag }

  // --- Private Methods ---

  countMots(){
    var   nombre    = 0
        , longueur  = 0
        , ary_mots  = []
        ;
    this.content.forEach( texel => {
      if ( texel.isMot ){ 
        nombre += 1
        ary_mots.push(texel)
      }
      longueur += texel.length
    })
    // Mettre dans les propriétés
    this._length = longueur
    this._mcount = nombre
    this._mots   = ary_mots
    return {nbm: nombre, len: longueur, mots:ary_mots} // pour renseignement immédiat
  }
}
