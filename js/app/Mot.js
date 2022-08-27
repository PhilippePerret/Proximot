'use strict';
class Mot extends MotType {

  constructor(fragment, data){
    super(fragment, data)
    this.nom    = this.content
    this.type   = 'mot'
    this.Klass  = 'Mot'
  }

  // --- Public Methods ---

  replaceContentWith(newContent){
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
    |   compte par la relève de l'extrait à checker. Cela actualise
    |   aussi son affichage.
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
    |   Enregistrement dans l'historique d'annulation
    */
    // TODO Changement in CancelingManagement
  }

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
    return Math.abs(cmot.relPos - this.relPos) < Lemma.MinProximityDistance
  }

  get markProximty(){
    if ( undefined === this._markproxi ) {
      this._markproxi = this.calcMarkProximity(this.fragment)
    }
    return this._markproxi
  }
  set markProximty(v) { this._markproxi = v /* false ou class CSS */  }


  calcMarkProximity(frag){
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

  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel mot'})
    o.innerHTML = this.mot
    this.observe(o)
    return o
  }
  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
  }

  // --- Private Methods ---

  get isTooShort(){
    return this.content.length < Mot.minLengthWord
  }

  static get minLengthWord(){
    return this._minlenword || (this._minlenword = Pref('min_word_length'))
  }
}
