'use strict';

class Paragraph {

  static instanciate(fragment, paragsData){
    var currentOffset = 0
    return paragsData.map( dparag => { 
      Object.assign(dparag, {offset: currentOffset})
      const paragraph = this.createFromData(fragment, dparag)
      currentOffset += paragraph.length
      return paragraph
    })
  }

  /**
  * Instanciation d'un paragraphe à partir de ses données remontées
  * du package.
  */
  static createFromData(fragment, data){
    let texels = data.texel_ids.split(',').map( id => {
      return TextElement.getById(int(id))
    })
    const paragraph = new Paragraph(fragment, data.index, texels, data.offset)
    return paragraph
  }

  /**
  * Instanciation du paragraph avec
  * 
  * @param fragment {TextFragment} Le fragment de texte contenant le paragraphe
  * @param index    {Integer} Index du paragraphe dans le fragment
  * @param texels   {Array of TextElement} Les texels du paragraphe
  * @param offset   {Integer} Décalage du paragraphe dans le fragment
  */
  constructor(fragment, index, texels, offset){
    this.Klass    = 'Paragraph'
    this.index    = index
    this.offset   = offset
    this.fragment = fragment
    texels.forEach(texel => texel.paragraph = this)
    this.texels = texels
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
  get obj(){return this._obj || (this._obj = DGet(`#${this.domId}`) || this.build())}

  
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

  // --- DOM Methods ---

  build(){
    return DCreate('DIV', {class:'paragraph'})
  }

  buildIn(container){
    const o = this.obj
    container.appendChild(o)
    this.forEachTexel(texel => { texel.buildIn(o)} )
  }
  
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
