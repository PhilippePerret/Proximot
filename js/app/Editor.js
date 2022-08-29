'use strict';

class EditorClass {

  /**
  * Méthode appelée avant de définir la sélection
  */
  beforeSetSelection(){
    TextElement.unsetExergues()    
  }

 /**
   * Sélectionner un élément textuel par son index
   * 
   */
  selectMotByIndex(texelIndex){
    this.Selection.set(this.mots[texelIndex])
  }

  /**
   * Rechercher et sélectionner le premier mot répondant aux 
   * paramètres +params+
   * 
   * @param params {Hash} Paramètres de la recherche :
   *          params.text     Doit contenir ce texte
   *          params.type     Doit être de ce type (ttTag)
   * 
   */
  selectFirstWordWith(params){
    /*
    | Préparation de la recherche 
    */
    if ( params.text ) {
      if ( 'string' == typeof params.text && params.text.substring(0,1) == '/' && params.text.endsWith('/')){
        params.text = new RegExp(params.text.substring(1, params.text.length - 2))
      }
    }
    /*
    | On procède à la recherche mot à mot
    */
    var index ;
    for (var idx = this.currentIndex; idx < this.maxIndex; ++ idx){
      const mot = this.mots[idx]
      if ( params.text && not(mot.mot.match(params.text)) ) continue ;
      if ( params.type && not(mot.ttTag == params.type) )   continue ;
      /*
      | Le premier mot a été trouvé
      */
      index = parseInt(idx,10)
      break
    }
    not( index == undefined ) && this.selectMotByIndex(index)
  }

  get currentIndex(){
    var indexMot = 0;
    if ( this.Selection.last ) {
      indexMot = this.Selection.last.index
    }
    return indexMot
  }

  /** @return l'index de mot maximal */
  get maxIndex(){
    return this.mots.length - 1
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

