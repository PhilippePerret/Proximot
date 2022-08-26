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

}
