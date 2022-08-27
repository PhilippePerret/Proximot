'use strict';
class NomPropre extends MotType {

  constructor(fragment, data){
    super(fragment, data)
    this.nom    = this.content
    this.type   = 'nom-propre'
    this.Klass  = 'NomPropre'
  }

  // --- Public Methods

  // --- Listener Methods ---

  // --- Build Methods ---
  
  build(){
    const o = DCreate('SPAN', {id:this.domId, class:'texel mot'})
    o.innerHTML = this.nom
    this.observe(o)
    return o
  }
  observe(o){
    o.addEventListener('click', this.onClick.bind(this))
  }

  // --- Private Methods ---

}
