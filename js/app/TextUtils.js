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
   */
  static analyze(text){
    WAA.send({class:'Proximot::App',method:'analyze_text',data:{text:text}})
  }
  static receiveLemma(data){
    console.log("[receiveLemma] data = ", data)
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


  /**
   * Prend le texte +text+ {String} et en fait 
   * des instances {Paragraphs} qui contient les sous-classes
   * de {TextElements} ({Mot}, {WhiteSpace}, etc.)
   * 
   */
  static splitInParagraphs(text){
    text = text.replace(/\r/g,'')
    /*
    | On passe en revue l'intégralité des caractères un par
    | un afin d'obtenir toutes les informations possibles sur
    | le texte et faire la distinction entre lettres, ponctuation
    | et paragraphe.
    */

    var paragraphs = []
    var currentPar = []
    var currentMot = []
    text.split('').forEach(char => {
      const charType = this.getTypeOf(char)
      // console.log("Avec '%s' de type '%s' ", char, charType)

      if ( charType != 'alphanum' ) {
        if ( currentMot.length ) {
          currentPar.push( new Mot(currentMot.join('')))
          currentMot = []
        }
      }
      switch(charType){
        case 'alphanum': 
          currentMot.push(char)
          break
        case 'ponct':
          currentPar.push(new Ponctuation(char))
          break
        case 'ret':
          paragraphs.push(new Paragraph(currentPar))
          currentPar  = []
          break
        case 'spec':
          currentPar.push(new SpecChar(char))
          break
        case 'space':
          currentPar.push(new WhiteSpace(char))
          break
      }
    })
    currentMot.length && currentPar.push(new Mot(currentMot.join('')))
    currentPar.length && paragraphs.push(new Paragraph(currentPar))

    // console.log("Paragraphes : ", paragraphs)
    return paragraphs    
  }

  /**
   * @return le type du charactère quelconque +char+
   * 
   */
  static getTypeOf(char){
    if (char.match(/[a-zA-Z0-9]/)){
      // Lettre ou chiffre
      return 'alphanum'
    } else if (char.match(/[\.\!\?\;\:…]/)) {
      // Ponctuation
      return 'ponct'
    } else if ( char == "\n" ){
      // retourn chariot
      return 'ret'
    } else if ( char.match(/[’\'\"\“\”«»©¢®$€¥#\+\-\=]/) ){
      // Caractères spéciaux et opérateurs
      return 'spec'
    } else if ( char.match(/[ \t]/) ){
      // Espaces
      return 'space'
    } else {
      // Tout ce qui reste est considéré comme 
      // des lettres
      return 'alphanum'
    }
  }

}
