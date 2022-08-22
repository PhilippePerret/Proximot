class App {
  /**
   * Méthode au chargement qui reçoit du serveur les données du texte 
   * à analyser. Soit c'est une liste de tokens (avec lemma) d'un
   * texte analysé pour la première fois, soit ce sont les données
   * d'un fichier XML Proximot.
   * 
   * Dans tous les cas, on procède à l'affichage du texte.
   * 
   */
  static onReceiveText(data){
    const texte = TextUtils.makeTexteFromTokens(data.tokens)
    Editor.display(texte.firstFragment)
  }
}
