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
  * Pour faire une boucle sur tous les mots du paragraphe
  */
  forEachMot(method){
    this.mots.forEach(method)
  }

  /**
  * Pour faire une boucle sur tous les texels du paragraphe
  */
  forEachTexel(method){
    this.texels.forEach(method)
  }

  /**
  * @return les données du paragraphe :
  *    {Hash} contenant :
  *       paragData:    données du paragraphe (liste des ID de texels)
  *       texels:       données des mots (csv)
  *       proximities:  données des proximités (csv)
  */  
  getData(){
    const proximities = []
    const texel_ids   = []
    const texels = this.texels.map( texel => {
      texel.proxAvant && proximities.push(texel.proxAvant.getData())
      texel.proxApres && proximities.push(texel.proxApres.getData())
      console.log("texel.getData() = ", texel.getData())
      /*
      |  On relève les identifiants des texels du paragraph dans 
      |  l'ordre pour les mémoriser dans les données du paragraphe.
      */
      texel_ids.push(texel.id)
      /*
      |  On relève les données du text-element
      */
      return texel.getData()
    })

    // console.log("\nDONNÉES DU PARAGRAPH %i", this.index)
    // console.log("ids texels: ", texel_ids)
    // console.log("texels:", texels)
    // console.log("proxis:", proximities)

    return {
        metadata: {
            index:          this.index
          , fragmentIndex:  this.fragment.index
          , texel_ids:      texel_ids.join(',')
        }
      , texels:  texels
      , proxis:  proximities
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
    this.forEachTexel( texel => {
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
    // console.log("Mots du paragraphe : ", this._mots)
    return {nbm: nombre, len: longueur, mots:ary_mots} // pour renseignement immédiat
  }
}
