'use strict';

class Ponctuation extends TextElement {

  constructor(fragment, ponct){
    super(fragment, ponct)
    this.Klass  = 'Ponctuation'
  }

  // --- Public Methods ---

  get type(){return 'ponct'}

  // --- Listener Methods ---

  onClick(e){
    console.log("J'ai cliqué la ponctuation", this.content)
    return stopEvent(e)
  }

  get css(){
    return super.getCssClasses(['ponct'])
  }
}
