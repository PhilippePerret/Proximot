# Todo list

## En cours

* Pouvoir définir une distance minimale hors proximité pour chaque lemme
  (cf. la méthode Lemma#getDistanceMinimale)
* Calcul des proximités lors d'un chargement depuis un texte
* Autre fonctionnement pour "raccord" : on prend les 500 mots avant et après d'un fragment précédent et suivant
* Changement du travail sur les proximités
  Maintenant :
    - à l'instantiation du mot, on doit connaitre son offset dans le 
      fragment.
      note : plus tard, il faudra faire son absOffset qui sera son
      offset dans le texte entier (calculé par rapport au offset du
      fragment lui-même)
    - on l'ajoute à Lemmas et à son Lemma
    - avant l'affichage, on calcule toutes les proximités, dans les
      Lemmas.
      - on les dispatche dans chaque mot

* Réflexion sur le fait de faire tous les calculs de longueur en direct, c'est-à-dire que dès qu'on change la longueur d'un texel, on calcule la différence avec la longueur précédente et on l'impacte sur le paragraphe et le fragment. Donc inutile de recalculer la longueur.
Le gain de temps en vaut-il l'effort ?

* Pouvoir passer au fragment suivant
* Pouvoir passer d'un paragraphe à l'autre avec les flèches de sélection
  + CMD+flèche Haut/bas permet de passer au paragraphe inférieur/supérieur
* Poursuivre les tooltips de la console
* Mettre en place le système d'annulation
* Quand c'est un long texte (non encore travaillé), ne traiter d'abord qu'une portion (de 2000 mots environ, donc de 15000 signes environ)
* Implémenter le bon traitement de 'est-ce' dans TTAnalyzer
* Les premières proximités sont indiquées de façon grossière. Il faut :
  - pouvoir agir sur la proximité (ignorer)
  - avoir des listes d'exclusion (commencer par mettre les verbes être et avoir)
* 

## Bugs

* Voir les bugs sur Github avec `ghi list -L bug`

## Préférence

* Les mettre en place pour l'édition (en profiter pour implémenter la classe Panneau — ou reprendre une classe identique existant, pour une des dernières applications)

## Fonctionnalités

* Précisément :
  - CMD-Flèche haut pour remonter au paragraphe précédent
  - CMD-Flèche Bas pour descendre au paragraphe suivant
  - CMD-MAJ-Flèche haut => page précédente
  - CMD-MAJ-Flèche bas  => page suivante
  - Pouvoir définir une proximité minimum pour un mot grace à "px Bonjour 200"
  - Pouvoir définir un mot dans le lexicon grâce à "lex Bonjour NAM bonjour"
* Pouvoir obtenir la liste des commandes/raccourcis clavier
* Déplacement d'un mot (Editor.moveMot())
  -> Traitement des proximités à chaque déplacement (pour ce mot et les mots concernés)
* Application intelligente : elle mémorise toutes les substitutions qu'on fait (remplacement d'un mot par un autre) et les repropose à la prochaine modification du même mot.
* après l'édition d'un mot, voir s'il ne s'est pas transformé en plusieurs mots (le repasser par la moulinette de 'TextUtils')
* quand on remplace un mot par un autre, demander si on doit le considérer comme un synonyme (=> machine qui apprend).
  + possibilité d'aller chercher des synonymes sur le web

<a name="reflexions"></a>

## Réflexions

Cf. le fichier [REFLEXION.md](file:///./REFLEXION.md)
