'use strict';
class Mot extends TextElement {

  constructor(mot){
    super(mot)
    this.mot = mot
    this.type = 'mot'
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
    // faire des actions sur cette proximité (l'ignore par exemple)
    this.obj.classList.add('too-close')
  }
  unsetTooClose(){
    this.obj.classList.remove('too-close')
  }

  /** @return le Lemma du mot */
  get lemma(){return this._lemma||(this._lemma = this.getLemma())}

  // --- /Public Methods ---

  // --- Listener Methods ---

  onClick(e){
    super.onClick(e)
    console.log("J'ai cliqué ", this.mot)
    return false
  }
  onMouseOver(e){
    return super.onMouseOver(e)
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

  get nlp(){
    return this._nlp || (this._nlp = new NLP(this.mot))
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
