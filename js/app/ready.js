'use strict';

$(document).ready(e => {
  
  // const texte = "Mon tout premier texte.\nAvec des retours chariot.\nC’est l'été ça se sent !"

  const texteComplexe = "Ils sortiront des bocaux plus tard aujourd'hui.\nMais une des étiquettes de bocal est toujours aussi belle. Il faut toujours bel et bien le garder en tête, parce que c'est beau."
  
  TextElement.reset()
  const itexte = new Texte(texteComplexe)
  Editor.display(itexte.firstFragment)

  console.log("Ready !")
})

