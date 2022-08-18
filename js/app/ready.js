'use strict';

$(document).ready(e => {
  
  const texte = "Mon tout premier texte.\nAvec des retours chariot.\nC’est l'été ça se sent !"
  Editor.display(texte)

  const texteComplexe = "Ils sortiront des bocaux plus tard aujourd'hui."
  const nlp = new NLP(texteComplexe)
  nlp.corpus = texteComplexe
  console.log("tokenized", nlp.tokenized)
  console.log("lemma", nlp.lemmatizer())

  console.log("Ready !")
})

