'use strict';
class NomPropre extends MotType {

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
  // isTooClose(frag){
  //   const lemma = frag.getLemma(this.lemma)
  //   if ( lemma.hasOnlyOneMot ) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }


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
