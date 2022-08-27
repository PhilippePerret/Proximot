'use strict';
/**
* class MotType < TextElement
* ----------------------------
* Pour les text-elements (texels) qui doivent se comporter comme des
* mots. Pour le moment, ce sont Mot et NomPropre.
* 
*/

class MotType extends TextElement {

  /**
   * @return {String} class CSS de l'éloignement si le mot est en 
   * proximité avec un autre dans le fragment de texte affiché
   * 
   * Si l'étude a déjà été menée (this.markProximty défini), on 
   * prend directement la valeur là. C'est le cas par exemple lorsque
   * l'on recharge un fichier.
   * 
   * @param frag  {TextFragment} L'instance du fragment de
   *              texte. Pour savoir quels mots sont après ou avant.
   */
  isTooClose(frag){
    if ( this.isTooShort ) return false
    this.fragment = frag
    return this.markProximty // false si aucune
  }

  /**
   * Marque/démarque le mot comme trop proche d'un autre
   * 
   * @param cssEloignement {String} 'far', 'mid' ou 'near'
   */
  setTooClose(cssEloignement){
    const css = ['too-close', cssEloignement]
    this.proxAvant && css.push('pxavant')
    this.proxApres && css.push('pxapres')
    this.obj.classList.add(...css)
  }

  unsetTooClose(){
    this.obj.classList.remove('too-close','pxavant','pxapres')
  }


  // --- Affichage des informations du mot ---
  showInfos(){
    this.showInfo('content', this.content)
    this.showInfo('occurrences', this.occurrences)
    this.showInfo('lemma', this.lemma)
    this.showInfo('tttag', this.ttTag)
    this.showInfo('lprox-mot',  this.motAvant && this.motAvant.mot)
    this.showInfo('lprox-dist', this.motAvant && this.motAvant.distanceWith(this))
    this.showInfo('rprox-mot',  this.motApres && this.motApres.mot)
    this.showInfo('rprox-dist', this.motApres && this.motApres.distanceWith(this))
    this.showInfo('offset',     this.offset)
  }

  // --- Private Methods ---

  showInfo(key, value){
    DGet(`#infos-texel-${key}`).innerHTML = value || '---'
  }

  get occurrences(){
    return this.fragment.getLemma(this.lemma).count
  }

}
