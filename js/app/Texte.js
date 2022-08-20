'use strict';
/**
 * class Texte
 * -----------
 * Classe pour gérer le texte comme une globalité
 * 
 */
class Texte {

  constructor(content){
    this.content  = content
    this.Klass    = 'Texte'
  }

  // --- Public Methods ---

  /**
   * @return le premier fragment
   */
  get firstFragment(){
    return this.getFragmentFromParagraph(0)
  }

  get motsCount(){
    return this.mots.length
  }

  get mots(){
    return this._mots || (this._mots = this.getMotsFromParagraphs())
  }

  get paragraphs(){
    return this._parags || (this._parags = this.content)
  }

  // --- Private Methods ---

  /**
   * @return l'instance {TextFragment} du fragment de texte commen-
   * çant à partir du paragraphe d'index +paragIndex+
   *
   */
  getFragmentFromParagraph(paragIndex){
    const fragment = new TextFragment(this, paragIndex, this.getParagraphsFragmentFrom(paragIndex))
    fragment.analyze()
    return fragment
  }
  
  /**
   * @return les x paragraphes du texte depuis le paragraphe d'index
   * +paragIndex+ dans le but de former un nouveau fragment
   *
   * Un fragment est constitué d'au moins 2000 mots ( 8 * 250 donc
   * 8 pages de roman avec une "marge" de 1 page au début et à la 
   * fin)
   */
  getParagraphsFragmentFrom(paragIndex){
    const parags = []
    var   nombreMots = 0
        , parag
    while ( (parag = this.paragraphs[paragIndex++]) && nombreMots < 2000 ){
      parags.push(parag)
      nombreMots += parag.motsCount
      console.info("nombreMots = ", nombreMots)
    }
    return parags
  }

  getMotsFromParagraphs(){
    const ary = []
    this.paragraphs.forEach( parag => {
      parag.content.forEach( texel => {
        texel.isMot && ary.push(texel)
      })
    })
    return ary
  }

}
