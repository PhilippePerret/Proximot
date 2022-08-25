'use strict';

$(document).ready(e => {
  
  // const texte = "Mon tout premier texte.\nAvec des retours chariot.\nC’est l'été ça se sent !"

  
  Console.prepare()
  TextElement.reset()

  /*
  | On charge le texte à éditer (à travailler/analyser)
  | Soit celui contenu dans un fichier .txt du dossier courant, soit
  | un fichier .pxw (Proximot).
  */
  WAA.send({class:'Proximot::App',method:'load_texte'})

  console.log("Ready !")
  
})

