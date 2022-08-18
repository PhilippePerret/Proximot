'use strict';

class EditorClass {

  /**
   * Méthode principale qui affiche le texte +text+
   * 
   * @param {String} text Le texte absolument brut de décoffrage.
   * 
   */
  display(text) {
    /*
    | Le texte sous forme d'instances de Mots
    */
    this.paragraphs = TextUtils.splitInParagraphs(text)

    this.paragraphs.forEach( paragraph => {
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

