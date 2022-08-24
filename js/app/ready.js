'use strict';

$(document).ready(e => {
  
  // const texte = "Mon tout premier texte.\nAvec des retours chariot.\nC’est l'été ça se sent !"

  
  Console.prepare()
  TextElement.reset()

  // const texteComplexe = "Ils sortiront des bocaux plus tard aujourd'hui.\nMais une des étiquettes de bocal est toujours aussi belle. Il faut toujours bel et bien le garder en tête, parce que c'est beau."
  // const itexte = new Texte(texteComplexe)
  // Editor.display(itexte.firstFragment)

  // // Test
  // TextUtils.askForLemma()

  /*
  | On charge le texte à éditer (travailler/analyser)
  | Soit celui contenu dans un fichier .txt du dossier courant, soit
  | un fichier .pxw (Proximot).
  */
  WAA.send({class:'Proximot::App',method:'load_texte',data:{premier:true}})

  console.log("Ready !")
  
})

