'use strict';
class Mot extends MotType {

  constructor(fragment, data){
    super(fragment, data)
    this.nom    = this.content
    this.Klass  = 'Mot'
  }

  // --- Public Methods ---

  get type(){return 'mot'}

  /**
   * Surclasse la méthode TextElement pour écrire le mot dans le
   * texte.
   * 
   */
  get content() { return this._content }
  set content(v) {
    this._content       = v
    this.obj.innerText  = v
  }

  /**
   * @return TRUE si le mot +cmot+ est trop proche du mot courant
   * Note : le lemme doit déjà avoir été checké et il doit être
   * identique.
   *  
   * @param cmot {Mot}
   * 
   */
  toCloseTo(cmot) {
    // console.log("[toCloseTo] cmot.relPos (%i) - this.relPos (%i) < Lemma.MinProximityDistance (%i)", cmot.relPos, this.relPos, Lemma.MinProximityDistance)
    return Math.abs(cmot.offset - this.offset) < Lemma.MinProximityDistance
  }

  // --- /Public Methods ---

  // --- Listener Methods ---

  onClick(e){
    super.onClick(e)
    console.log("J'ai cliqué ", this.mot)
    return false
  }
  onMouseOver(e){
    super.onMouseOver(e)
    return false
  }

  // --- /Listener Methods ---

  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
  }


  // --- Private Methods ---

  get isTooShort(){
    return this.content.length < Mot.minLengthWord
  }

  get css(){
    return super.getCssClasses(['mot'])
  }

  static get minLengthWord(){
    return this._minlenword || (this._minlenword = Pref('min_word_length'))
  }
}
