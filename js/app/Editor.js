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

