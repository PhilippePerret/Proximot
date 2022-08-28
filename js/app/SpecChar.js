'use strict';

class SpecChar extends TextElement {

  constructor(fragment, spec){
    super(fragment, spec)
    this.Klass  = 'SpecChar'
  }

  // --- Public Methods ---
  get type(){ return 'spec' }

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué le caractères spécial", this.content)
    return stopEvent(e)
  }

  // --- Private Methods ---

  get css(){
    return super.getCssClasses(['spec'])
  }

}
