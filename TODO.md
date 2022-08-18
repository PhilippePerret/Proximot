# Todo list

## En cours

* Réfléchir et définir le format pour enregistrer le fichier proximot.pxw contenant tout le texte ainsi que toutes les corrections apportées et l'indication des ignorés. Cf. [Réflexions](#reflexion)
* Keyboard.js Gestion des touches

## Bugs

* Faire fonctionner les premiers InsideTests

## Fonctionnalités

* après l'édition d'un mot, voir s'il ne s'est pas transformé en plusieurs mots (le repasser par la moulinette de 'TextUtils')

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
