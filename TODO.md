# Todo list

## En cours

### Actualisation de l'offset d'un mot

> Maintenant, l'offset est relatif au paragraphe. Le mot possède donc :
  - offsetInParag
  - offsetInFrag
  - offsetAbs

Quand on actualise un paragraphe, par exemple en supprimant un mot :
  - il faut modifier le offsetInPar de tous les mots suivants du paragraphe
  - il faut modifier le offsetInFra de tous les paragraphes suivants
  - il faut modifier le offsetInTex (offsetAbs) de tous les fragments suivants

La méthode pourrait être une méthode de Paragraph. `Paragraph.updateOffsets` qui
attend en donnée : from: offset, value: <écart souhaité>
  Par exemple, si on a supprimé un mot, on envoie à cette méthode :
  mot.paragraph.updateOffsets(from: mot.offset, diff: (+) mot.length)

Ce que fait la méthode :
  - elle boucle sur ses mots jusqu'à trouver un offset supérieur ou égal à :from
    à partir de là, elle augmente l'offset des mots (mot.addToOffset(diff))
  - elle appelle ensuite son fragment pour faire la même chose avec les 
    paragraphes suivant
    this.fragment.updataOffsets(from: paragIndex + 1, diff: diff)
  - Le fragment boucle sur ses paragraphes à partir de :from
    elle ajoute la valeur paragraph.addToOffset(diff)
  - le fragment appelle l'application pour modifier tous les fragments
    suivant : App.updateOffsets(from: indexFragment + 1, diff: diff)
  - l'application boucle sur tous les fragments à partir de indexFragment
    fragment.addToOffset(diff)

* Poursuivre le lancement des tests sur un texte particulier
  - puis faire les tests de suppression de mots
* Pouvoir définir une distance minimale hors proximité pour chaque lemme
  (cf. la méthode Lemma#getDistanceMinimale)
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

## Aide

* La mettre en place
* Sur :
  - 'aide start' Pour aider à démarrer, quand aucun texte n'est fourni
  

## Fonctionnalités

* Signaler une forte densité du mot dans le passage (passage court) et offrir la possibilité d'afficher toutes les occurrences.
  - La "densité" correspond au nombre d'occurrences sur une zone partant du mot, jusqu'à la distance de proximité avant de après.
  Par exemple, si la distance de proximité est 500, et que la proximité étudiée se trouve à 1200 et 1280, la densité correspond au
  nombre d'occurrence du lemme entre 700 (1200 - 500) et 1780 (1280 + 500). Pour le moment, la densité est égale au nombre d'occurrence.
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
