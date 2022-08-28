'use strict';
class NomPropre extends MotType {

  constructor(fragment, data){
    super(fragment, data)
    this.nom    = this.content
    this.Klass  = 'NomPropre'
  }

  // --- Public Methods
  get type(){return 'nom-propre'}

  // --- Listener Methods ---

  // --- Build Methods ---
  
  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
  }

  // --- Private Methods ---

  get css(){
    return super.getCssClasses(['mot'])
  }

}
