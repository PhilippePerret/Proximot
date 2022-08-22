'use strict'
/**
 * class TextUtils
 * ---------------
 * Utilitaires pour gérer les textes
 * C'est la classe qui en tout premier lieu permet de spliter
 * le texte donné en mots, ponctuations, etc.
 * 
 */

class TextUtils {

  /**
   * Pour analyser le texte +text+ côté serveur et remonter (dans la
   * méthode suivante) les tokens.
   * 
   * @param options {Hash}
   *            options.poursuivre    Méthode pour suivre.
   */
  static analyze(text, options){
    const data = {text: text}
    this.analyzeOptions = options
    WAA.send({class:'Proximot::App',method:'analyze_text',data:data})
  }
  static receiveAnalyze(data){
    console.log("this.analyzeOptions = ", this.analyzeOptions)
    console.log("[receiveAnalyze] data = ", data)
    this.analyzeOptions.poursuivre(data)
  }

  /**
   * Méthode qui reçoit les tokens +tokens+ (du serveur qui les a
   * envoyés par exemple à App.onReceiveText) et en fait une instance
   * {Texte} avec des paragraphes et des mots.
   *
   * @param tokens {Array} Liste de trinomes [sujet, type, lemme]
   * 
   * Rappel : les délimitations de paragraphe sont des trinomes cons-
   * titués de ['BREAK','BREAK','BREAK'] 
   * 
   * @return {Texte} L'instance de texte instanciée.
   * 
   */
  static makeTexteFromTokens(tokens){
    /*
    | Pour mettre tous les paragraphes
    */
    const paragraphs = []
    /*
    | Le paragraphe courant dans lequel mettre tous les mots
    | et autres text-elements (texel)
    */
    var currentMotsParag = []

    tokens.forEach(trinome => {
      var texel = null
      const [sujet, type, lemme] = trinome
      switch(type){
      case 'SENT': case 'PUN':
        texel = new Ponctuation(trinome)
        break
      case 'NAM':
        texel = new NomPropre(trinome)
        break
      case 'BREAK':
        paragraphs.push(new Paragraph(currentMotsParag))
        currentMotsParag = []
        break
      default:
        texel = new Mot(trinome)
      }
      texel && currentMotsParag.push(texel)
    })// fin de boucle sur les tokens

    /*
    | On traite les mots restants
    */
    if ( currentMotsParag.length ) {
      paragraphs.push(new Paragraph(currentMotsParag))
    }

    /*
    | On instancie le texte
    */
    const texte = new Texte(paragraphs)

    return texte;
  }

}
