'use strict';

$(document).ready(e => {
  
  // const texte = "Mon tout premier texte.\nAvec des retours chariot.\nC’est l'été ça se sent !"

  const texteComplexe = "Ils sortiront des bocaux plus tard aujourd'hui.\nMais les bocaux sont toujours aussi beaux. Il faut toujours bien le garder en tête."
  const itexte = new Texte(texteComplexe)
  Editor.display(itexte)

  console.log("Mots du texte : ", itexte.mots)
  console.log("Nombre de mots: ", itexte.motsCount)

  // const nlp = new NLP(texteComplexe)
  // nlp.corpus = texteComplexe
  // console.log("tokenized", nlp.tokenized)
  // console.log("lemma", nlp.lemmatizer())


  console.log("Ready !")
})

