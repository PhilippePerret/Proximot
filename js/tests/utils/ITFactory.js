'use strict';
const FILE_DELIMITOR = '/'
/**
* class ITFactory
* ---------------
* Usine pour les tests de Proximot
*/
export class ITFactory {
  static get File(){
    return this._fileclass || ( this._fileclass = new ITFactoryFile() )
  }
}


/**
* Class ITFactoryFile
* -------------------
* Classe d'usine pour tout ce qui concerne les fichiers
* 
* @usage:     ITFactory.File.<method>
*/  
class ITFactoryFile {
  textePath(filename){
    return [APP_FOLDER,'xassets','InsideTest','textes',filename].join(FILE_DELIMITOR)
  }
}
