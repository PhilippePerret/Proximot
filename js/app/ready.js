'use strict';

$(document).ready(e => {
  
  Console.prepare()
  Panel.reset()
  TextElement.reset()

  /*
  | On charge le texte à éditer (à travailler/analyser)
  | Soit celui contenu dans un fichier .txt du dossier courant, soit
  | un fichier .pxw (Proximot).
  */
  if ( not(INSIDE_TESTS) ) {  
    try {
      WAA.send({class:'Proximot::App',method:'load'})
      console.log("Ready!")
    } catch (err) {
      console.error(err)
      console.log("Not Ready…")
    }
  }

  
})

