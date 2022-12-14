'use strict';
/**
 * class Texte
 * -----------
 * Classe pour gérer le texte comme une globalité
 * Pour le moment, cette classe est inusitée.
 * 
 */
// class Texte {

//   constructor(content){
//     this.content  = content
//     this.Klass    = 'Texte'
//     Texte.current = this
//   }

//   // --- Public Methods ---

//   /**
//    * @return le premier fragment
//    * Mais cette méthode n'est appelée que pour un texte qui n'est pas
//    * encore étudié (.txt au lieu de .pxw). Dans le cas contraire, les
//    * fragments sont définis par setFragment depuis le chargement des
//    * données du texte (App.onReceiveProximotData)
//    */
//   get firstFragment(){
//     this.fragment_index = 0 // TODO LE GÉRER (plutôt que le numéro de paragraphe)
//     return this.getFragmentFromParagraph(0)
//   }

//   /* Alias de getFragment */
//   fragment(fIndex){ return this.getFragment(fIndex)}

//   /**
//   * @return {Fragment} Le fragment d'index +fragmentIndex+
//   * 
//   */
//   getFragment(fragmentIndex){
//     if ( this.fragments[fragmentIndex] == undefined ) {
//       raise("Il faut apprendre à charger un fragment.")
//       // Note : on s'arrangera pour le faire en cours de
//       // travail sur le texte, de façon invisible on chargera
//       // les deux segments autour.
//     }
//     return this.fragments[fragmentIndex] 
//   }

//   /**
//   * Définit le fragment d'index +fragmentIndex+
//   * 
//   * Noter qu'avec le système de lecture, un fragment 12 peut très
//   * bien être chargé seul.
//   */
//   setFragment(fragmentIndex, fragment){
//     if (undefined == this.fragments) { this.fragments = {} }
//     Object.assign(this.fragments, {[fragmentIndex]: fragment})
//   }

//   get motsCount(){
//     return this.mots.length
//   }

//   /**
//    * Pour enregistrer le texte seulement
//    * 
//    * @param withPath {String} Éventuellement, le chemin d'accès précis
//    */
//   saveAsText(withPath){
//     console.warn("Je dois apprendre à enregistrer le texte dans un fichier.")
//   }

//   // --- /Public Methods ---

//   get mots(){
//     return this._mots || (this._mots = this.getMotsFromParagraphs())
//   }

//   get paragraphs(){
//     return this._parags || (this._parags = this.content)
//   }

//   /** @return l'index du premier paragraphe du fragment courant */
//   get fragmentFirstParagraphIndex(){
//     return this._fragfirstparagidx
//   }
//   set fragmentFirstParagraphIndex(v){
//     this._fragfirstparagidx = v
//   }

//   // --- Private Methods ---

//   /**
//    * @return l'instance {TextFragment} du fragment de texte commen-
//    * çant à partir du paragraphe d'index +paragIndex+
//    *
//    */
//   getFragmentFromParagraph(paragIndex){
//     this.fragmentFirstParagraphIndex = paragIndex
//     const fragment = new TextFragment(this, paragIndex, this.getParagraphsFragmentFrom(paragIndex))
//     fragment.analyze()
//     return fragment
//   }
  
//   /**
//    * @return les x paragraphes du texte depuis le paragraphe d'index
//    * +paragIndex+ dans le but de former un nouveau fragment
//    *
//    * Un fragment est constitué d'au moins 2000 mots ( 8 * 250 donc
//    * 8 pages de roman avec une "marge" de 1 page au début et à la 
//    * fin)
//    */
//   getParagraphsFragmentFrom(paragIndex){
//     const parags = []
//     var   nombreMots = 0
//         , parag
//     while ( (parag = this.paragraphs[paragIndex++]) && nombreMots < 2000 ){
//       parags.push(parag)
//       nombreMots += parag.motsCount
//       console.info("nombreMots = ", nombreMots)
//     }
//     return parags
//   }

//   getMotsFromParagraphs(){
//     const ary = []
//     this.paragraphs.forEach( parag => {
//       parag.content.forEach( texel => {
//         texel.isMot && ary.push(texel)
//       })
//     })
//     return ary
//   }

// }
