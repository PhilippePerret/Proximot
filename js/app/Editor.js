'use strict';

class EditorClass {

  /**
   * Méthode principale qui affiche le texte +text+
   * 
   * @param {Texte} text Instance texte
   * 
   */
  display(fragment) {
    fragment.paragraphs.forEach( paragraph => {
      this.content.appendChild(paragraph.div)
    })
    fragment.analyze()
  }

  get Selection(){
    return this._sel || (this._sel = new SelectionManager(this))
  }
  get content(){
    return this._content || (this._content = DGet('#editor #content'))
  }
}
const Editor = new EditorClass()

