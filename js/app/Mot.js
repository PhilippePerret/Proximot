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
   * @return true si le mot est en proximité avec un autre dans le
   * fragment de texte affiché
   * 
   * @param frag  {TextFragment} L'instance du fragment de
   *              texte.
   */
  isTooClose(frag){
    const lemma = frag.getLemma(this.lemma)
    if ( lemma.hasOnlyOneMot ) {
      return false
    } else {
      return true
    }
  }

  /**
   * Marque/démarque le mot comme trop proche d'un autre
   * 
   */
  setTooClose(){
    // TODO Un tooltip permettant d'avoir des informations et de 
    // faire des actions sur cette proximité (l'ignorer par exemple)
    this.obj.classList.add('too-close')
    /*
    | Construire le tooltip des informations et des opérations
    | On le met à l'intérieur, caché.
    */
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

}
