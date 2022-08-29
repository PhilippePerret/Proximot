'use strict';

const AIDE_START = `
Pour utiliser l'application Proximot, vous devez partir d'un texte dans un fichier au format .txt ou .text. Donc un fichier au format le plus simple possible.
`

const AIDE_DEFAULT = `
Bienvenue dans l'aide de l'application Proximot.

Vous trouverez ci-dessous de **nombreux renseignements**.`

const HELP_DATA = {
    metadata: {
        app: 'Proximot'
      , name: 'Manuel_Proximot'
      , panneau: {x: 100, y: 100, movable:true}
    }
  , root: {
        default   : {content: AIDE_DEFAULT, options:{}}
      , start     : {content: AIDE_START, options: {}}
    }
}
