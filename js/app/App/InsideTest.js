'use strict';
/**
* Pour le contrôle de l'application par InsideTest
*/
class AppInsideTest {

  // Pour les propriétés à surveiller
  static get Watchables(){
    return {
        nb_mots_fragment    : this.getNbMotsFragment.bind(this)
      , nb_texels_fragment  : this.getNbTexelsFragment.bind(this)
      , fragment_length     : this.getFragmentLength.bind(this)
      , nb_displayed_mots   : this.getNbMotsDisplayed.bind(this)
      , nb_proximites       : this.getNbProximities.bind(this)
      , displayed_texte     : this.getDisplayedTexte.bind(this)
      , last_undo_ref       : this.getLastUndoRef.bind(this)
    }
  }
  
  static getWatchableValues(){
    const frag = TextFragment.current
    return {
        nb_mots_fragment    : frag.mots.length
      , nb_texels_fragment  : frag.texels.length
      , fragment_length     : frag.length
      , nb_displayed_mots   : this.getNbMotsDisplayed()
      , nb_proximites       : this.getNbProximities()
      , displayed_texte     : this.getDisplayedTexte()
      , last_undo_ref       : this.getLastUndoRef()
    }
  }
  static get fragment(){ return TextFragment.current }
  
  static getNbMotsFragment()  {return this.fragment.mots.length   }
  static getNbTexelsFragment(){return this.fragment.texels.length }
  static getFragmentLength()  {return this.fragment.length }
  static getNbMotsDisplayed() {return DGetAll('.texel.mot', Editor.content).length}
  static getNbProximities()   {return Proximity.count() }
  static getDisplayedTexte()  {
    let text = []
    DGetAll('.texel', Editor.content).forEach( span => {
      text.push(span.innerHTML)
    })
    text = text.join(' ')
    // console.log("DisplayedTexte = ", text)
    return text
  }
  static getLastUndoRef(){
    if ( ZManager.last ){ return ZManager.last.ref }
  }

}

App.InsideTest = AppInsideTest;

