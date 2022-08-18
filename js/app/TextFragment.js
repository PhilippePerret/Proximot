'use strict';
/**
 * class TextFragment
 * ------------------
 * Gestion du fragment de texte actuellement en édition
 * 
 * Portion de 2000 mots pour ne jamais avoir à traiter des textes
 * trop longs.
 * 
 * Composition d'un fragment :
 *    8 pages = 8 x 250 mots
 *    1 page (250 mots) de marge au début et à la fin
 */
class TextFragment {

  /**
   * Instanciation d'un fragment de texte
   * 
   * @param itexte {Texte} Le texte en édition, complet
   * @param paragIndex  {Number} Index 0-start du premier paragraphe
   *                    du fragment (index dans le texte complet)
   * @param paragraphs  {Array of Paragraphs} Instance des paragraphs
   *                    relevés dans le texte.
   */
  constructor(itexte, paragIndex, paragraphs) {
    this.itexte     = itexte
    this.pIndex     = paragIndex
    this.paragraphs = paragraphs
  }

  // get isTextBeginning() { return this.pIndex == 0 }
  // get isTextEnding()    { return this.pIndex == this.itexte.paragraphs.length - 1}
}
