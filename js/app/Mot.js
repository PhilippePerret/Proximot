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
    console.log(withOk ? 'Confirmation' : 'Annulation')
    /*
    | On remet le span du mot dans son état normal
    */
    this.obj.blur()
    this.obj.contentEditable = false
    this.obj.focus()

    if ( withOk ) {
      /*
      | Contenu actuel du champ
      */
      let newContent = this.obj.innerText.trim()
      /*
      | Si le contenu est le même, on peut s'arrêter là
      */
      if ( newContent == this.content ) {
        console.log("Contenu identique. Je renonce.")
        return false
      }
      console.log("Contenu différent ('%s' ≠ '%s'), je poursuis", newContent, this.content)
      /*
      |   On mémorise le content actuel pour le remettre en cas 
      |   d'annulation
      */
      const oldContent = this.content
      /*
      |   On consigne le nouveau contenu pour qu'il soit pris en 
      |   compte par la relève de l'extrait à checker.
      */
      this.content = newContent
      
      /*
      |   Check de proximité
      |
      | On prend les 250 mots autour (index ± 2500) pour
      | créer un texte qu'on envoie à l'analyse
      |
      | Mais en fait, le plus simple serait d'envoyer le ou les mots
      | à l'analyse de texte pour obtenir leur lemma, puis de voir
      | s'il n'y pas de problème de proximité.
      |
      */
      this.fragment.checkProximityFor(this, {cancelable: true})
      /*
      | Il peut y avoir trois sortes de contenu différents :
      | 1.  Un simple mot comme le mot précédent.
      |     => traitement normal
      | 2.  Plusieurs mots (séparés ou non par des espaces, on le
      |     sait à l'analyse).
      |     => On crée autant de mots que nécessaire
      |     => On actualise toutes les listes
      | 3.  Un nouveau paragraphe (et au moins 2 mots)
      |     => On crée le paragraphe et les mots

      /*
      |   On met le mot à son nouveau contenu (cela met aussi le
      |   mot dans le champ)
      */
      this.content = newContent
      /*
      |   Enregistrement dans l'historique d'annulation
      */
    }
    this.obj.innerText = newContent
    // TODO Changement in CancelingManagement
  }
  get content(){ return this._content}
  set content(v) {
    this._content       = v
    this.obj.innerText  = v
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
