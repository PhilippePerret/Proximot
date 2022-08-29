'use strict';
/**
* Class Help
* ----------
* Gestion de l'aide d'une application.
* 
* Pour apporter une aide directement dans l'application ET en même
* temps pouvoir produire un document PDF.
* 
* Les deux méthodes de base :
* 
*   Help.display(<what>)        Afficher l'aide pour <what>
* 
*   Help.export()               Exporter le fichier md de l'aide
*   
* 
* Le module fonctionne avec la définition, par l'application, de la
* constante DATA_HELP qui va fournir toutes les informations sur
* l'aide.
* 
* REQUIS
* ------
*   * fichier 'help.css'
*   * donnée HELP_DATA définissant l'aide propre à l'application
*   * Librairie jQuery
* 
*/
class Help {

  // --- Public Methods ---

  /**
  * Affichage de l'aide sans autre indication (texte par défaut)
  */
  static show(){
    this.display('default')
  }

  /**
  * Affichage de l'aide pour +what+
  * 
  * @param what {String} Chemin d'aide composé de sujets séparés par
  *             des "/". Par exemple "raccourcis/affichage"
  */
  static display(what, options) {
    what = what.split('/')
    var node, nodeName ;
    node = HELP_DATA.root
    while ( nodeName = what.shift() ) {
      node = node[nodeName]
    }
    this.panel.display(marked.parse(node.content))
  }

  /**
  * Permet d'exporter l'aide sous forme de fichier Markdown qui 
  * pourra être exporter ensuite en fichier PDF.
  * 
  * @param options {Hash} Inutilisé pour le moment.
  * 
  */
  static export(options){

  }




  // --- Private Methods ---

  /**
  * Les métadonnées transmises (HELP_DATA.metadata)
  */
  static get metadata(){ return HELP_DATA.metadata}

  /**
  * Panneau pour contenir l'aide (Instance {Panel})
  * 
  */
  static get panel(){
    return this._panel || (this._panel = new Panel(this.dataPanel) )
  }
  /* @return données pour le panneau */
  static get dataPanel(){
    return {
        id: 'help'
      , mainTitle: `Aide de ${this.metadata.app}`
      , options: {
            movable: true
          , position_x: 'center'
        }
    }
  }
}
