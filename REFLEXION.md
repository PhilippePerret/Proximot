# Réflexion

# L'interface

La premier réflexion à faire concerne l'interface. Entendu que je veux un truc très pratique mais également très agréable à utiliser, pas l'interface difficile d'Antidote.

Les exigences :

- indication des proximités en direct
- possibilité de modifier totalement une phrase
- mémorisation des proximités à ne pas prendre en compte pour le mot 
- indication des modifications par rapport au tout premier texte entré (pour pouvoir corriger un autre texte)

Le truc qui me paraitrait le plus efficace, ce serait un éditeur de texte très simple comme TextEdit, ou page, couplé à une fenêtre de Terminal pour indiquer les proximités.

Une autre possibilité serait d'avoir une page HTML, avec un champ de saisie et le texte et une visualisation identique avec l'indication des proximités. Les deux ne seraient jamais l'un sur l'autre.

> Note : grâce à ma technologie WAA, on pourrait tout sauvegarder facilement.

Ça donnerait ça :

- on a le texte en .txt
- il est chargé, découpé en mots qui sont mis dans des spans dans la page.
- les proximités sont indiquées (en respectant les préférences)
- en cliquant sur un mot
- SHIFT + DRAG (sans pression) permet de sélectionner plusieurs mots (pour les détruire)
- quand on clique sur l'espace entre deux mots, on peut en ajouter un
- quand on supprime un mot (touche erase) on peut tout de suite en insérer un nouveau. Si on sort sans rien faire, ça supprime le champ.

## Utilisation des modules nodejs

> Note : on aurait besoin de NPL.js pour traiter le texte.

En se servant de [browserify](https://browserify.org), on peut transformer les modules nodejs en simple fichier javascript.

Pour résumer 

### 1. On fait le script comme dans nodejs

~~~javascript
//in uniq.js

var unique = require('uniq') // le module nodejs

var data = [11,1,1,1,2]

console.log(unique(data))
//=> renvoi [11,1,2] en console
~~~

### 2. On produit le fichier static

~~~bash
$> browserify uniq.js -o bundle.js
~~~

> Note : à faire chaque fois qu'on change le code

### 3. On charge le module dans le code

~~~html
<!DOCTYPE html>
<html>
...
<script type="text/javascript" src="bundle.js"></script>
...
</html>
~~~
