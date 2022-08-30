'use strict';
/**
* Class Interactif
* ----------------
* 
* Pour gérer notamment les méthodes confirm ou prompt
*/
class InteractiveElement {
  constructor(type, question, params){
    this.type     = type // 'prompt' ou 'confirm'
    this.question = question
    this.params   = params
    this.build()
  }
  onClickOk(e){
    this.hide()
    this.params && this.params.poursuivre && this.params.poursuivre.call(null, true)
    return stopEvent(e)
  }
  onClickCancel(e){
    this.hide()
    this.params && this.params.poursuivre && this.params.poursuivre.call(null, false)
    return stopEvent(e)
  }
  show(){
    this.obj.classList.remove('hidden')
  }
  hide(){
    this.obj.remove()
  }
  build(){
    const o = DCreate('DIV', {class:'hidden', style:this.divStyle})
    this.obj = o
    this.msgField   = DCreate('DIV', {class:'inter-message', text: this.question, style:this.msgFieldStyle})
    const btnsDiv = DCreate('DIV', {style:this.divButtonsStyle})
    this.btnOk      = DCreate('BUTTON',{class:'btn-ok', text: this.btnOkName})
    this.btnCancel  = DCreate('BUTTON',{class:'btn-cancel fleft', text: this.btnCancelName})
    o.appendChild(this.msgField)
    btnsDiv.appendChild(this.btnOk)
    btnsDiv.appendChild(this.btnCancel)
    o.appendChild(btnsDiv)
    document.body.appendChild(o)
  }
  observe(){
    this.btnOk    .addEventListener('click', this.onClickOk.bind(this))
    this.btnCancel.addEventListener('click', this.onClickCancel.bind(this))
  }

  get btnOkName(){
    if ( this.params.buttonOk && this.params.buttonOk.name ) {
      return this.params.buttonOk.name
    } else { return 'OK' }
  }
  get btnCancelName(){
    if ( this.params.buttonCancel && this.params.buttonCancel.name ) {
      return this.params.buttonCancel.name
    } else { return 'Renoncer' }
  }

  get divStyle(){
    return "background-color:#EFEFEF;user-select:none;position:fixed;z-index:1010;bottom:200px;left:calc(50% - 250px);width:500px;box-shadow:25px 26px 50px grey;border:1px solid grey;border-radius:0.5em;padding:1.5em;font-size:18pt;font-family:'Arial Narrow', Arial, Helvetica, Geneva;"
  }
  get msgFieldStyle(){
    return 'padding:2em 1em;border:1px solid #CCC;border-radius:0.5em;margin-bottom:2em;font-size:inherit;font-family:inherit;'
  }
  get divButtonsStyle(){
    return 'text-align:right;'
  }
}

const confirmer = confirm = function(question, params){
  new InteractiveElement('confirm', question, params).show()
}
const demander = function(question, defaultResponse, params){
  console.warn("Il faut que j'apprenne à prompter une valeur")
}
