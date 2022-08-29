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

class DOMTable {
  constructor(data){
    this.colsWidth = data.colsWidth
    this.code = [`<table class="${data.css}">`]
    if ( data.rows ){
      this.injectRows(data.rows)
    }
  }
  tr(...cells){
    this.code.push('<tr>')
    const tr = []
    for (var icol = 0, len = this.colsWidth.length; icol < len; ++icol){
      const cell = cells[icol] || ''
      const width = this.colsWidth[icol]
      tr.push(`<td style="width:${width}px;">${marked.parseInline(cell)}</td>`)
    }
    this.code.push(tr.join(''))
    this.code.push('</tr>')
  }
  injectRows(rows){
    rows.forEach(row => {this.tr(...row)})
    return this;//chainage
  }
  to_html(){ 
    this.code.push('</table>')
    return this.code.join('')
  }
}
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
