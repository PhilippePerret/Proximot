# Todo list

## En cours

* Poursuivre l'enregistrement (il reste les mots à faire)
* Passer ensuite à la lecture du fichier
* Mettre en place le système d'annulation
* Mémoriser chaque ligne de console (comme le Terminal)
* Quand c'est un long texte (non encore travaillé), ne traiter d'abord qu'une portion (de 2000 mots environ, donc de 15000 signes environ)
* Implémenter le bon traitement de 'est-ce' dans TTAnalyzer
* Les premières proximités sont indiquées de façon grossière. Il faut :
  - faire des tooltips indiquant les informations d'éloignement
  - pouvoir agir sur la proximité (ignorer)
  - avoir des listes d'exclusion (commencer par mettre les verbes être et avoir)
* 
* Réfléchir et définir le format pour enregistrer le fichier proximot.pxw contenant tout le texte ainsi que toutes les corrections apportées et l'indication des ignorés. Cf. [Réflexions](#reflexion)
  - en fait, le mieux est de se servir de l'identifiant unique de chaque mot et de l'utiliser pour l'enregistrement. Tous les texels sont ramassés à la fin, dans l'ordre (pour ceux affichés) si l'ordre n'est pas tenu à jour en direct
* Keyboard.js Gestion des touches

## Bugs

* Voir les bugs sur Github avec `ghi list -L bug`

## Préférence

* Les mettre en place pour l'édition

## Fonctionnalités

* Pouvoir obtenir la liste des commandes/raccourcis clavier
* Déplacement dans mot (Editor.moveMot())
  -> Traitement des proximités à chaque déplacement (pour ce mot et les mots concernés)
* Application intelligente : elle mémorise toutes les substitutions qu'on fait (remplacement d'un mot par un autre) et les repropose à la prochaine modification du même mot.
* après l'édition d'un mot, voir s'il ne s'est pas transformé en plusieurs mots (le repasser par la moulinette de 'TextUtils')
* quand on remplace un mot par un autre, demander si on doit le considérer comme un synonyme (=> machine qui apprend).
  + possibilité d'aller chercher des synonymes sur le web

<a name="reflexions"></a>

## Réflexions

### Enregistrement des données

Les données sont enregistrées dans un fichier `.pxw` (les extensions `pxm` et `prx` sont déjà utilisés). On y place tous les mots (même pour un texte de 30 000 mots) ainsi que :

* leur correction. C'est-à-dire qu'on garde toujours une trace du mot original et on indique :
  - s'il a été supprimé
  - s'il a été corrigé (par quoi)
  - s'il s'est transformé en plus mots (après l'édition)
* leurs proximités, comme une donnée proximité qui peut donc être :
  - considérée ou ignorée
  - mise en exergue pour correction
