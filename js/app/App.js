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
    this.lastOpenDate = new Date()
    const texte = TextUtils.makeTexteFromTokens(data.tokens)
    Editor.display(texte.firstFragment)
  }

  /**
   * @return la table des données d'état à sauvegarder dans le 
   * fichier.
   * 
   */
  static state2save(texte){
    return {
        last_open: hdateFor(this.lastOpenDate)
      , saved_at:  hdateFor(new Date())
      , fragment_first_parag_index: texte.fragmentFirstParagraphIndex
    }
  }
}
