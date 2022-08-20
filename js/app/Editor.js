'use strict';

class EditorClass {

  /**
   * Méthode principale qui affiche le texte +text+
   * 
   * @param {Texte} text Instance texte
   * 
   */
  display(fragment) {
    /*
    | Ensuite on affiche les éléments de texte (dont les mots)
    */
    fragment.paragraphs.forEach( paragraph => {
      // console.log("Paragraphe = ", paragraph)
      // console.log("paragraph.div = ", paragraph.div)
      this.content.appendChild(paragraph.div)
    })
    /*
    | Et enfin on marque les proximités
    */
    fragment.showProximites()
  }

  get Selection(){
    return this._sel || (this._sel = new SelectionManager(this))
  }
  get content(){
    return this._content || (this._content = DGet('#editor #content'))
  }
}
const Editor = new EditorClass()

