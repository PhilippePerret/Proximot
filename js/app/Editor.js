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
    | Pour le garder
    */
    this.fragment = fragment
    /*
    | Ensuite on affiche les éléments de texte (dont les mots)
    */
    this.fragment.display(this.content)
    /*
    | Et enfin on marque les proximités
    */
    this.fragment.showProximites()
  }

 /**
   * Sélectionner un élément textuel par son index
   * 
   */
  selectMotByIndex(texelIndex){
    console.log("Mot à sélectionner (index %i) = ", texelIndex, this.mots[texelIndex])
    this.Selection.set(this.mots[texelIndex])
  }

  /**
   * Pour déplacement le mot avant ou après (et en tirer toutes les
   * conséquences au niveau des proximités)
   * 
   * @param texel {TextElement} Le text-element à déplacer (souvent un mot)
   * @param direc {String} La direction ('left' ou 'right')
   * 
   */
  moveTexel(texel, direc){
    const o = texel.obj
    if ( direc == 'left' ) {
      o.parentNode.insertBefore(o, o.previousSibling)
    } else {
      if ( o.nextSibling.nextSibling ) {
        o.parentNode.insertBefore(o, o.nextSibling.nextSibling)
      } else {
        console.warn("Apprendre à traiter le passage au paragraphe suivant.")
      }
    }
    console.warn("Apprendre à traiter les proximités après un déplacement.")
  }

  /** @return le dernier index possible */
  get lastAvailableIndex(){
    return this.mots.length - 1
  }

  get mots(){
    return this.fragment.mots
  }


  get Selection(){
    return this._sel || (this._sel = new SelectionManager(this))
  }
  get content(){
    return this._content || (this._content = DGet('#editor #content'))
  }
}
const Editor = new EditorClass()

