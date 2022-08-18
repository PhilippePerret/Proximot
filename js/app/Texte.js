'use strict';
/**
 * class Texte
 * -----------
 * Classe pour gérer le texte comme une globalité
 * 
 */
class Texte {

  constructor(content){
    this.content = content
  }

  get analyzer(){
    return this._analyzer || (this._analyzer = new TextAnalyzer(this))
  }

  get motsCount(){
    return this.mots.length
  }

  get mots(){
    return this._mots || (this._mots = this.getMotsFromParagraphs())
  }

  get paragraphs(){
    return this._parags || (this._parags = TextUtils.splitInParagraphs(this.content))
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
