'use strict';

class App {

  /* TODO : la remonter du serveur */
  static get APP_VERSION(){ return '0.5.1' }

  /**
  * RÉINITIALISATION COMPLÈTE
  * -------------------------
  * Pour tout réinitialiser au chargement d'un nouveau texte par
  * exemple (un texte qui n'est pas le fragment suivant d'un autre)
  * C'est également cette méthode qui est appelée entre les tests.
  * 
  */
  static resetAll(){
    delete this._fragments_data
    delete this._state
    ZManager      .resetAll()
    ConsoleClass  .resetAll()
    AnyText       .resetAll()
    Editor        .resetAll()
    Lemmas        .resetAll()
    MotType       .resetAll()
    Paragraph     .resetAll()
    Proximity     .resetAll()
    TextElement   .resetAll()
    Preferences   .resetAll_andApply()
    TextFragment  .resetAll()
    TextUtils     .resetAll()
  }

  static get STATE_DATA(){
    if (undefined == this._statedata){
      this._statedata = {
          'created_at'      : {hname:'Date de création de l’analyse'}
        , 'last_open'       : {hname:'Date de dernière ouverture de l’analyse'}
        , 'saved_at'        : {hname:'Date de dernière sauvegarde de l’analyse'} 
        , 'fragment_index'  : {hname:'Index du fragment de texte courant'}
        , 'fragments_data'  : {hname:'Données de tous les fragments du texte'}
        , 'app_version'     : {hname:'Version de l’application'}
        , 'last_texel_id'   : {hname:'Dernier ID de texel'}
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
  static get_fragments_data() { return this.fragments_data }
  static get_last_texel_id()  { return TextElement.lastId }

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
  
  static get State(){ 
    return this._state || { /* valeurs par défaut */
        fragments: this.fragments_data
      , last_texel_id: 0
    }
  }
  static set State(state){this._state = state}

  static get fragments_data(){
    if (undefined == this._fragments_data){
      this._fragments_data = {
          count: 1
        , 0: {index: 0, offset: 0, lenInFile: null}
      }
    } return this._fragments_data
  }
  static set fragments_data(data){ 
    this._fragments_data = data
    this.State.fragments = data
  }
  static setFragmentsData(data){ Object.assign(this.fragments_data, data)}

  /**
  * Pour actualiser un fragment
  * 
  * Note : si la longueur du fragment a changé, cela actualise aussi
  * les offsets des fragments suivants
  */
  static setFragment(fragment){
    const lastFragmentLength = this.fragments_data[fragment.index].length
    /*
    |  On actualise la donnée
    */
    Object.assign(this.fragments_data, {[fragment.index]: {
        index   : fragment.index
      , offset  : fragment.offset
      , length  : fragment.length  
    }})
    /*
    |  Si la longueur du fragment a changé, on actualise l'offset de
    |  tous les fragments suivants
    */
    if ( fragment.length != lastFragmentLength ) {
      for (var ifragment = fragment.index + 1; ifragment < fragments_data.count; ++ifragment){
        const prevFramentData = this.fragments_data[ifragment - 1]
        this.fragments_data[ifragment].offset = prevFramentData.offset + prevFramentData.length
      }
    }
  }

  static getDataOtherFragments(text_path){
    Log.in('App::getDataOtherFragments')
    const data = {
        fragments_data  : this.fragments_data
      , from_offset     : this.fragments_data[0].lenInFile
      , text_path       : text_path
    }
    WAA.send({class:'Proximot::App',method:'getDataOtherFragments', data: data})
  }
  static receiveDataOtherFragment(data){
    Log.debug("[App::receiveDataOtherFragment] Données reçues pour les autres fragments", data)
    this.setFragmentsData(data)
  }



  // ########## POUR INSIDE TESTS #############

  // Pour les propriétés à surveiller
  static get ITWatchableProperties(){
    return {
        nb_mots_fragment    : this.getNbMotsFragment.bind(this)
      , nb_texels_fragment  : this.getNbTexelsFragment.bind(this)
      , nb_displayed_mots   : this.getNbMotsDisplayed.bind(this)
      , nb_proximites       : this.getNbProximities.bind(this)
      , displayed_texte     : this.getDisplayedTexte.bind(this)
    }
  }
  static get fragment(){ return TextFragment.current }
  
  static getNbMotsFragment()  {return this.fragment.mots.length }
  static getNbTexelsFragment(){return this.fragment.texels.length}
  static getNbMotsDisplayed() {return DGetAll('.texel.mot', Editor.content).length}
  static getNbProximities()   {return Proximity.count() }
  static getDisplayedTexte()    {console.error("Je dois apprendre à récupérer le texte");return ''}


} // /class App
