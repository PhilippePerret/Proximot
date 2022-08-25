class App {

  /**
  * Méthode principale (chargement) qui reçoit les données lorsqu'il
  * existe un fichier Proximot (.pxw).
  * 
  * Les données sont alors envoyées séquentiellement à cette méthode
  * qui les dispatche. Pour ça, elle communique avec la méthode ruby
  * App.load_proximot_file
  */
  static onReceiveProximotData(data){
    // console.log("Je reçois ces données pour le chargement de '%s'", data.loading_step, data)
    var next_step, extra_data ;
    switch(data.loading_step){
    case 'app_state':
      this.State  = data.data
      next_step   = 'preferences'
      break
    case 'preferences':
      Preferences.setValues(data.data)
      next_step   = 'fragment_current'
      extra_data  = {fragment_index: parseInt(this.State.fragmentIndex || 0, 10)}
      break
    case 'fragment_current':
      TextElement.setData(data /* note : tout +data+ ici */)
      next_step = 'console_history'
      break
    case 'console_history':
      Console.HistoryManager.setHistory(data.data)
      next_step = 'proximities'
      break
    case 'proximities':
      Proximity.setData(data.data)
      next_step = null
      break
    }

    if ( next_step ) {
      const ndata = {pxpath: data.pxpath, loading_step: next_step}
      if ( extra_data ) Object.assign(ndata, extra_data)
      WAA.send({class:'Proximot::App',method:'load_proximot_file',data:ndata})
    }
  }

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
  static getState(){
    const texte = Texte.current
    return {
        created_at: this.State.created_at || hdateFor(new Date())
      , last_open: hdateFor(this.lastOpenDate)
      , saved_at:  hdateFor(new Date())
      , fragment_first_parag_index: texte.fragmentFirstParagraphIndex
      , fragment_index: this.State.fragment_index || texte.fragmentIndex
    }
  }

  /**
  * Pour remonter une erreur depuis le serveur avec WAA.
  * (WAA.send(class:'App',method:'onError', data:{:message, :backtrace}))
  */
  static onError(err){
    erreur(err.message + " (voir en console)")
    console.error(err.message)
    console.error(err.backtrace)
  }
  
  get State(){ return this._state || {} }
  set State(state){this._state = state}
}
