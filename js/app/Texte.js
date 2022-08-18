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

  get paragraphs(){
    return this._parags || (this._parags = TextUtils.splitInParagraphs(this.content))
  }

}
