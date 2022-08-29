'use strict';

const AIDE_START = `
## Premiers pas

Pour utiliser l'application Proximot, vous devez partir d'un texte dans un fichier au format \`.txt\` ou \`.text\`. Donc un fichier au format le plus simple possible.

Ouvrir une fenêtre Terminal dans le dossier contenant ce fichier et jouer la commande :

~~~bash
$> prox
~~~

`

const AIDE_DEFAULT = `
## Bienvenue dans l'aide de l'application Proximot.

Vous trouverez ci-dessous de **nombreux renseignements**.

**Proximot** est une application qui permet de travailler les proximités dans un texte.
`
const colsWidth = [400,200,200]

const commandsModifications = new DOMTable({css:'listing',colsWidth:colsWidth, rows:[
    ['Operation','Commande','Notes']
  , ['Remplacer la sélection par `<mot>`', '**`r <mot>`**']
  , ['Remplacer tous les mots comme la sélection par `<mot>`', '**`r* <mot>`**']
]})

const commandsSelection = new DOMTable({css:'listing', colsWidth:colsWidth, rows:[
    ['Operation','Commande','Notes']
  , ['Sélectionne le `X`ième mot', '**`s X`**', '']
  , ['Sélectionne le `X`ième mot APRÈS la sélection', '**`s +X`**']
  , ['Sélectionne le `X`ième mot AVANT la sélection', '**`s -X`**']
  , ['Sélectionne le mot en proximité gauche (avant) avec la sélection', '**`pl`**', 'l = left']
  , ['Sélectionne le mot en proximité droite (après) avec la sélection', '**`pr`**', 'r = right']
]})

const commandsProximites = new DOMTable({css:'listing',colsWidth:colsWidth, rows:[
    ['Operation','Commande','Notes']
  , ['Sélectionne le mot en proximité gauche (avant) avec la sélection', '**`pl`**', 'l = left']
  , ['Sélectionne le mot en proximité droite (après) avec la sélection', '**`pr`**', 'r = right']
]})

const AIDE_COMMANDS = `
## Liste des commandes

> Les commandes sont toujours exprimées par 1 à 3 caractères en début de ligne, suivis par une espace puis des valeurs si nécessaire.

### Modifications de la sélection

${commandsModifications.to_html()}

### Sélection

${commandsSelection.to_html()}

### Proximités

${commandsProximites.to_html()}

`
const HELP_DATA = {
    metadata: {
        app: 'Proximot'
      , name: 'Manuel_Proximot'
      , panneau: {x: 100, y: 100, movable:true}
    }
  , root: {
        default   : {_content: AIDE_DEFAULT, options:{}}
      , start     : {_content: AIDE_START,   options: {}}
      , commands  : {_content: AIDE_COMMANDS, options: {}}
    }
}
