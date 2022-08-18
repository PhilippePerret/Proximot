'use strict';

class EditorClass {

  /**
   * Méthode principale qui affiche le texte +text+
   * 
   * @param {Texte} text Instance texte
   * 
   */
  display(text) {
    text.paragraphs.forEach( paragraph => {
      this.content.appendChild(paragraph.div)
    })
  }

  get Selection(){
    return this._sel || (this._sel = new SelectionManager(this))
  }
  get content(){
    return this._content || (this._content = DGet('#editor #content'))
  }
}
const Editor = new EditorClass()

