'use strict';
/**
 * class TextFragment
 * ------------------
 * Gestion du fragment de texte actuellement en édition
 * 
 */
class TextFragment {

  constructor(itexte, fromMotIndex, toMotIndex) {
    this.itexte = itexte
    this.start  = fromMotIndex
    this.end    = toMotIndex
  }

  get isBeginning(){ return this.start = 0 }
  get isEnding(){ return this.end = this.itexte.motsCount - 1}
}
