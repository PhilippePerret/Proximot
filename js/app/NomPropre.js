'use strict';
class NomPropre extends TextElement {

  constructor(dmot){
    super(dmot)
    this.nom    = this.content
    this.type   = 'nom-propre'
    this.Klass  = 'NomPropre'
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

  /** @return le Lemma du mot */
  get lemma(){return this._lemma||(this._lemma = this.getLemma())}

  // --- /Public Methods ---

  // --- Listener Methods ---

  onClick(e){
    super.onClick(e)
    console.log("J'ai cliqué le nom propre ", this.nom)
    return false
  }
  onMouseOver(e){
    super.onMouseOver(e)
    return stopEvent(e)
  }

  // --- /Listener Methods ---


  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel mot'})
    o.innerHTML = this.nom
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
    const o = DCreate('DIV', {text:'Infos sur proximité', class:'prox-tooltip'})
    this.proxTooltip = o
    this.obj.appendChild(o)
  }
  /**
   * Observation du tooltip de proximité
   */
  observeProxTooltip(){
    
  }

  get nlp(){
    return this._nlp || (this._nlp = new NLP(this.nom))
  }

  // --- Private Methods ---

  /**
   * @return le mot canonique du mot (sachant que NLP.lemmatizer()
   * retourne une liste des possibilités)
   * 
   */
  getLemma(){
    const lems = this.nlp.lemmatizer()
    // TODO voir pour certains mots le lem qu'il faut prendre
    const lem = lems[0]
    return lem.lemma
  }
}
