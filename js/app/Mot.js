'use strict';
class Mot extends TextElement {

  constructor(dmot){
    super(dmot)
    this.mot    = this.content
    this.type   = 'mot'
    this.Klass  = 'Mot'
  }

  // --- Public Methods ---

  /**
   * Mettre le mot en édition
   * 
   */
  edit(){
    console.log("Je dois mettre " + this.inspect + " en édition")
    this.obj.contentEditable = true
    this.obj.focus()
    Keyboard.setEdition({obj:this.obj, onOk: this.onEndEdit.bind(this)})
  }
  onEndEdit(withOk){
    console.log("Je dois apprendre à finir l'édition")
    console.log("C'est une %s", withOk ? 'confirmation' : 'annulation')
    let newContent = this.obj.innerText.trim()
    console.log("Nouvelle valeur = ", newContent)
    if ( newContent.endsWith("\n") ){
      newContent = newContent.trim()
    }
    this.obj.blur()
    this.obj.contentEditable = false
    this.obj.innerText = newContent
    this.obj.focus()
  }

  /**
   * @return true si le mot est en proximité avec un autre dans le
   * fragment de texte affiché
   * 
   * @param frag  {TextFragment} L'instance du fragment de
   *              texte.
   */
  isTooClose(frag){
    if ( this.isTooShort ) return false
    const lemma = frag.getLemma(this.lemma)
    if ( lemma.hasOnlyOneMot ) {
      return false
    } else {
      lemma.defineProximitiesOf(this) // => .proxAvant et .proxApres
      if ( this.proxAvant || this.proxApres ) {
        if ( not(this.proxAvant) ) {
          return this.proxApres.eloignement
        } else if ( not(this.proxApres) ) {
          return this.proxAvant.eloignement
        } else if ( this.proxAvant.distance > this.proxApres.distance ) {
          return this.proxApres.eloignement
        } else {
          return this.proxAvant.eloignement
        }
      } else {
        return false
      }
    }
  }

  /**
   * Marque/démarque le mot comme trop proche d'un autre
   * 
   * @param cssEloignement {String} 'far', 'mid' ou 'near'
   */
  setTooClose(cssEloignement){
    this.obj.classList.add('too-close')
    this.obj.classList.add(cssEloignement)
    /*
    | Construire le tooltip des informations et des opérations
    | On le met à l'intérieur, caché.
    */
    // TODO Un tooltip permettant d'avoir des informations et de 
    // faire des actions sur cette proximité (l'ignorer par exemple)
    this.buildProximityTooltip()
  }
  unsetTooClose(){
    this.obj.classList.remove('too-close')
    /*
    | On doit détruire le tootip de proximité
    */
    this.proxTooltip && this.proxTooltip.remove()
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
    return stopEvent(e)
  }

  // --- /Listener Methods ---


  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel mot'})
    o.innerHTML = this.mot
    this.observe(o)
    return o
  }
  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
  }

  /**
   * Construction, en cas de proximité, d'un div contenant les 
   * informations et les outils de proximité
   */
  buildProximityTooltip(){
    const o = DCreate('span', {text:'Infos sur proximité', class:'prox-tooltip'})
    this.proxTooltip = o
    this.obj.appendChild(o)
  }
  /**
   * Observation du tooltip de proximité
   */
  observeProxTooltip(){
    
  }
  // --- Private Methods ---

  get isTooShort(){
    return this.content.length < this.constructor.minLengthWord
  }
  static get minLengthWord(){
    return this._minlenword || (this._minlenword = Preferences.get('min_word_length'))
  }
}
