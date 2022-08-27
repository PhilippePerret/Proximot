'use strict';

class App {

  /* TODO : la remonter du serveur */
  static get APP_VERSION(){ return '0.5.1' }

  /**
   * Méthode au chargement qui reçoit du serveur les données du texte 
   * à analyser. Soit c'est une liste de tokens (avec lemma) d'un
   * texte analysé pour la première fois, soit ce sont les données
   * d'un fichier XML Proximot.
   * 
   * Dans tous les cas, on procède à l'affichage du texte.
   * 
   */
  static onReceiveFromText(data){
    try {    

      // console.log("[onReceiveFromText] Je reçois ces données texte : ", data)
      this.lastOpenDate = new Date()
      const fragment = TextFragment.createFromData(data)
      // console.log("fragment instancié : ",fragment)
      fragment.display()
    
    } catch(err) {
    
      console.error(err)
    
    }
  }

  static get STATE_DATA(){
    if (undefined == this._statedata){
      this._statedata = {
          'created_at'      : {hname:'Date de création de l’analyse'}
        , 'last_open'       : {hname:'Date de dernière ouverture de l’analyse'}
        , 'saved_at'        : {hname:'Date de dernière sauvegarde de l’analyse'} 
        , 'fragment_index'  : {hname:'Index du fragment de texte courant'}
        , 'app_version'     : {hname:'Version de l’application'}
      }
    } return this._statedata
  }
  static get STATE_KEYS(){
    return this._statekeys || ( this._statekeys = Object.keys(this.STATE_DATA) )
  }
  /* Pour retourner les valeurs de l'état de l'application 
      cf. getState 
  */
  static get_created_at()     { return this.State.created_at || hdateFor(new Date()) }
  static get_last_open()      { return hdateFor(this.lastOpenDate || new Date()) }
  static get_saved_at()       { return hdateFor(new Date()) }
  static get_fragment_index() { return TextFragment.current.index }
  static get_app_version()    { return this.APP_VERSION}


  /**
   * @return la table des données d'état à sauvegarder dans le 
   * fichier.
   * 
   */
  static getState(){
    const tbl = {}
    this.STATE_KEYS.forEach( stateKey => {
      Object.assign( tbl, {[stateKey]: this[`get_${stateKey}`].call(this) })
    })
    console.log("Table retournée par App.getState:", tbl)
    return tbl
  }


  static setState(data){
    this.lastOpenDate  = new Date()
    this.State         = data
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
  
  static get State(){ return this._state || {} }
  static set State(state){this._state = state}
}
