# Todo list

## En cours

* Pas d'identifiant pour les paragraphes (pour le moment, ils sont repérés par leur index dans le texte, à voir si c'est tenable même quand on bouge des paragraphes)
* Possibilité de définir la distance minimale de sécurité par la console
  -> pref
* Poursuivre le chargement d'un fichier Proximot
  - il reste seulement les mots/paragraphes/fragments à définir
  - voir le problème avec les ponctuations

* Pouvoir passer d'un paragraphe à l'autre avec les flèches de sélection
  + CMD+flèche Haut/bas permet de passer au paragraphe inférieur/supérieur
* Poursuivre les tooltips de la console
* Mettre en place le système d'annulation
* Quand c'est un long texte (non encore travaillé), ne traiter d'abord qu'une portion (de 2000 mots environ, donc de 15000 signes environ)
* Implémenter le bon traitement de 'est-ce' dans TTAnalyzer
* Les premières proximités sont indiquées de façon grossière. Il faut :
  - faire des tooltips indiquant les informations d'éloignement
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
