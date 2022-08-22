'use strict';
/**
 * class Preferences
 * -----------------
 * Gestion des préférences
 * 
 * 
 * @usage (le plus court) pour récupérer une valeur de préférence
 * 
 *    const maPreference = Pref(key)
 * 
 */

const BTN_SWITCH = '<button id="btn-%s" class="switch">♺</button>'
const BTN_EDIT   = '<button id="btn-%s" class="edit">✎</button>'
const DATA_SWITCH_BOOLEAN = {'false':{text:'false',next:'true'}, 'true':{text:'true',next:'false'}}


const PREFERENCES_DATA = {
    'min_word_length': {
        text:           "Longueur minimumale des mots traités"
      , defaultValue:   3
      , value:          3
      , typeValue:      'integer'
      , button:         tp(BTN_EDIT,['min_word_length'])
    }
  , 'min_dist_proximity':{
        text:           "Distance minimale d'éloignement"
      , defaultValue:   1000
      , value:          1000
      , typeValue:      'integer'
      , button:         tp(BTN_EDIT,['min_dist_proximity']) 
    }
  , 'nb_mots_around': {
        text:           "Nombre de mots autour à considérer"
      , defaultValue:   250
      , typeValue:      'integer'
      , button:         tp(BTN_EDIT,['nb_mots_around']) 
    }
  // , 'show_timeline_ruler':{
  //       text:           'Afficher la règle graduée de la timeline'
  //     , defaultValue:   true
  //     , typeValue:      'boolean'
  //     , button:         tp(BTN_SWITCH,['show_timeline_ruler'])
  //     , values:         DATA_SWITCH_BOOLEAN
  //     , onChange:       'onToggleTimelineRuler'
  //   }
  // , 'slider_zoom_color':{
  //       text:           "Couleur du slider de zoom <span class=description>(portion visible)</span>"
  //     , defaultValue:   '#9efa9e'
  //     , typeValue:      'string'
  //     , button:         tp(BTN_EDIT,['slider_zoom_color'])
  //     , valueTest:      'checkColor'
  //     , onChange:       'onChangeSliderZoomColor'
  //   }
}

class Preferences {

  static get log(){
    return this._log || (this._log = new LogClass('Preferences'))
  }



  /**
   * @return la préférence de clé +prefId+
   * 
   */
  static get(prefId){
    return PREFERENCES_DATA[prefId].value || PREFERENCES_DATA[prefId].defaultValue
  }

  /**
   * Enregistrement des préférences
   * 
   */
  static save(){
    message("Enregistrement des préférences, merci de patienter…")
    const prefs = this.getValues()
    console.info("= Préférences enregistrées : ", prefs)
    WAA.send({class:'Proximot::App',method:'save_preferences', data:{preferences:prefs}})
  }
  static afterSaved(data){
    if (data.ok){
      message("Préférences enregistrées.")
    } else {
      erreur(data.error)
    }
  }

  static getValues(){
    const values = {}
    for(var prefId in PREFERENCES_DATA){
      if ( not (undefined == PREFERENCES_DATA[prefId].value) ) {
        Object.assign(values, {[prefId]: PREFERENCES_DATA[prefId].value})
      }
    }
    return values
  }

  static setValues(values){
    this.log.debug("Valeurs à appliquer aux préférences : " + JString(values))
    for(var prefId in values){
      PREFERENCES_DATA[prefId].value = values[prefId]
    }
    this.apply()
  }

  /**
   * Pour appliquer les préférences au démarrage
   * 
   */
  static apply(){
    this.log.in('::apply')
    for (var prefId in PREFERENCES_DATA) {    
      const dPref = PREFERENCES_DATA[prefId]
      const value = PREFERENCES_DATA[prefId].value
      if ( dPref.onChange && undefined != value && value != dPref.defaultValue ) {
        console.log("   - Traitement de key '%s' méthode %s(%s)", prefId, dPref.onChange, value)
        this[dPref.onChange](value)
      }
    }
    this.log.out('::apply')
  }

  // --- MÉTHODES D'APPLICATION DES CHOIX ---


  // --- MÉTHODES DE CHECK ---



  // --- FIN DES MÉTHODES DE CHECK ---



  constructor(cadre){
    this.container = cadre
  }

  get log(){ return this.constructor.log }

  afterBuild(){
    console.log("-> Preferences#onBuilding")
    const options = {
        container: DGet('div.panneau', this.content)
      , header: ['Préférence', 'Valeur', '']
      , widths: ['50%', '300px', 'auto']
      , aligns: ['left','center','center']
    }
    const data = []
    for(var prefId in PREFERENCES_DATA) {
      const dpref = PREFERENCES_DATA[prefId]
      var value, text = null;
      if ( undefined === dpref.value ) { value = dpref.defaultValue }
      else { value = dpref.value }

      if ( dpref.values && not(dpref.values.length) ) {
        text = dpref.values[String(value)].text
      }
      var spanValue = `<span id="pref-${prefId}" data-prefid="${prefId}" data-value="${value}">${text||value}</span>`

      // console.log("dpref.button: ", dpref.button)
      data.push([dpref.text, spanValue, dpref.button])

    }
    const table = new TableDisplay(data, options)
    table.build()
  }

  observe(){
    for ( var prefId in PREFERENCES_DATA ) {
      const dpref = PREFERENCES_DATA[prefId]
      const btnId = `btn-${prefId}`
      const btn = DGet(`button#${btnId}`, this.content)
      if ( btn ) {      
        if ( btn.classList.contains('switch')) {
          btn.addEventListener('click', this.onClickSwitchButton.bind(this, btn, prefId))
        } else if ( btn.classList.contains('edit')){
          btn.addEventListener('click', this.onClickEditButton.bind(this, btn, prefId))
          /*
          |  On observe les span éditable des valeurs éditables 
          */
          const span = DGet(`span#pref-${prefId}`,this.content)
          span.addEventListener('input', this.onSpanValueChange.bind(this, span))
        }
      } else {
        console.error("ERREUR FATALE : le bouton #"+btnId+" est introuvable")
      }
    }
    /*
    |  Observation du bouton "Enregistrer"
    */
    DGet('button.btn-save',this.toolsbar).addEventListener('click', this.onClickSaveButton.bind(this))
  }


  onSpanValueChange(span, e){
    var value = span.innerText // contentText ne renverrait pas les retours chariot
    if ( value.endsWith("\n")){
      span.blur()
      span.contentEditable = false
      value = value.substring(0, value.length - 2)
      // console.log("value = '%s'", value)
      const curValue  = span.dataset.value
      const prefId    = span.dataset.prefid
      const dataPref  = PREFERENCES_DATA[prefId]
      if ( 'string' == typeof dataPref.valueTest ) {
        value = this[dataPref.valueTest](value, curValue)
      } else {
        if ( dataPref.valueTest ){
          if ( not(dataPref.valueTest(value)) ) {
            erreur(dataPref.error)
            value = curValue
          }
        }
      }
      span.innerHTML = value
      /*
      |   Valeur réelle mémorisée dans les préférences
      */
      realValue = this.getRealValueOf(value, dataPref.typeValue)

      console.log("Je mets la préférence '%s' à %s", prefId, realValue)
      PREFERENCES_DATA[prefId].value = realValue
      /*
      | Si une méthode de changement est définie, il faut l'invoquer
      */
      if ( dataPref.onChange ) {
        Preferences[dataPref.onChange].call(Preferences, realValue)
      }
    }
    return stopEvent(e)
  }

  onClickSaveButton(e){
    Preferences.save()
    return stopEvent(e)
  }

  onClickSwitchButton(btn, prefId, e){
    const dataPref = PREFERENCES_DATA[prefId]
    const values = dataPref.values
    const spanValue = DGet(`span#pref-${prefId}`,this.content)
    const curDataValue = values[spanValue.dataset.value]
    const newDataValue = values[curDataValue.next]
    spanValue.dataset.value = curDataValue.next
    spanValue.innerHTML     = newDataValue.text
    const realValue = this.getRealValueOf(newDataValue.text, dataPref.typeValue)
    if ( dataPref.defaultValue != realValue){
      PREFERENCES_DATA[prefId].value = realValue
    }
    if ( dataPref.onChange ) {
      Preferences[dataPref.onChange].call(Preferences, realValue)
    }

    return stopEvent(e)
  }

  getRealValueOf(value, typeValue){
    switch(typeValue){
    case 'integer': 
      return parseInt(value, 10)
    case 'float'  : 
      return parseFloat(value)
    case 'boolean':
      if ( value == 1 || value == 0) return value == 1
      else return value == 'true' || value === true
    default: 
      return value
    }
  }

  onClickEditButton(btn, prefId, e){
    const dataPref = PREFERENCES_DATA[prefId]
    const values = dataPref.values
    const spanValue = DGet(`span#pref-${prefId}`,this.content)
    spanValue.contentEditable = true
    spanValue.focus()
    return stopEvent(e)
  }

} // class Preference

const Pref = Preferences.get.bind(Preferences)
