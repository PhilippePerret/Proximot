'use strict';

const AIDE_START = `
## Premiers pas

Pour utiliser l'application Proximot, vous devez partir d'un texte dans un fichier au format \`.txt\` ou \`.text\`. Donc un fichier au format le plus simple possible.

Ouvrir une fenêtre Terminal dans le dossier contenant ce fichier et jouer la commande :

~~~bash
# Dans la fenêtre Terminal
$> prox
~~~

`

// Aide qui s'affiche quand on ne met rien d'autre que "aide", "help"
// ou "h" en console
const AIDE_DEFAULT = `
## Bienvenue dans l'aide de l'application **Proximot**.

**Proximot** est une application qui permet de travailler les proximités dans un texte.

Pour obtenir la liste des commandes :

~~~bash
# Une de ces lignes dans la console de l'application

aide commands
h commands
help commands

### Lancement des tests

Pour lancer les tests InsideTest, ajouter l'option \`--test\` en ligne de commande.

`

const colsWidth = [400,200,200]

const commandsModifications = new DOMTable({css:'listing',colsWidth:colsWidth, rows:[
    ['Operation','Commande','Notes']
  , ['Remplacer la sélection par `<mot>`', '**`r <mot>`**']
  , ['Remplacer tous les mots comme la sélection par `<mot>`', '**`r* <mot>`**']
]})

const commandsSelection = new DOMTable({css:'listing', colsWidth:colsWidth, rows:[
    ['Operation','Commande','Notes']
  , ['Sélection du mot suivant', '**`⌘ →`**']
  , ['Sélection du mot précédent', '**`⌘ ←`**']
  , ['Sélection des proximités', 'cf. <a href="#proximities">Proximités</a>']
  , ['Sélectionne le `X`ième mot', '**`s X`**', '']
  , ['Sélectionne le `X`ième mot APRÈS la sélection', '**`s +X`**']
  , ['Sélectionne le `X`ième mot AVANT la sélection', '**`s -X`**']
  , ['Sélectionne le mot en proximité gauche (avant) avec la sélection', '**`pl`**', 'l = left']
  , ['Sélectionne le mot en proximité droite (après) avec la sélection', '**`pr`**', 'r = right']
  , ['Sélectionne le premier mot matchant `<str>`', '**`/ <str>`**']
  , ['Sélectionne tous les mots matchant `<str>`', '**`/* <str>`**']
]})

const commandsProximites = new DOMTable({css:'listing',colsWidth:colsWidth, rows:[
    ['Operation','Commande','Notes']
  , ['Sélectionner le prochain mot avec proximité', '**`n`**', '"n" comme "next"'] 
  , ['Sélectionner le précédent mot avec proximité', '**`p`**', '"p" comme "previous"']
  , ['Sélectionne le mot en proximité gauche (avant) avec la sélection', '**`pl`**', 'l = left']
  , ['Sélectionne le mot en proximité droite (après) avec la sélection', '**`pr`**', 'r = right']
  , ['Ignorer les proximités de la sélection', '**`ig`**']
  , ['Ignorer tous les proximités du lemme sélectionné', '**`ig*`**']
  , ['Ignorer la proximité avant de la sélection', '**`igl*`**', '"l" pour left']
  , ['Ignorer la proximité après de la sélection', '**`igr*`**', '"r" pour rigth']
]})

const AIDE_COMMANDS = `
## Liste des commandes

> Les commandes sont toujours exprimées par 1 à 3 caractères en début de ligne, suivis par une espace puis des valeurs si nécessaire.

### Édition

${commandsModifications.to_html()}
<a name="selection"></a>

### Sélection

${commandsSelection.to_html()}
<a name="proximities"></a>

### Proximités

${commandsProximites.to_html()}

### Préférences


`

const AIDE_EXPORT = `
## Export

On peut exporter le texte courant sous différentes formes et notamment, simplement, en le reconstituant.

Pour un export simple, jouer en console :

~~~bash
export
~~~

`



const HELP_DATA = {
    metadata: {
        app: 'Proximot'
      , name: 'Manuel_Proximot'
      , panneau: {x: 100, y: 100, movable:true}
    }
  , root: {
        default   : {_content: AIDE_DEFAULT     , options: {}}
      , start     : {_content: AIDE_START       , options: {}}
      , commands  : {_content: AIDE_COMMANDS    , options: {}}
      , export    : {_content: AIDE_EXPORT      , options: {}}
    }
}
