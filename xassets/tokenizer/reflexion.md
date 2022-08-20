# Tokenizer

La première opération à faire sur un texte est de le tokenizer, c'est-à-dire de le segmenter en mots ou signes. En sachant qu'il y a :

* les mots simples, purement ASCII (a-zA-Z),
* les mots avec accents et diacritiques,
* les mots élisés (le "c'" de "c'est", le "qu'" de "qu'elle")
* les mots à apostrophes (aujourd'hui)
* les mots à tirets (auto-tamponneuse)
* les mots à tirets et apostrophes ("c'est-à-dire")
* les ponctuations
* les autres signes (parenthèses, chevrons, etc.)
* les caractères spéciaux (unités, copyright, arobase)

## Synopsis de découpage

* Découper selon les "blanks"
* passer le texte par tree-tagger (-token et -lemma)
* Traitement différent :
  - le mot a été reconnu par Tree-tagger => OK
  - le mot n'a pas été reconnu "<unknown>" => on poursuit son traitement

