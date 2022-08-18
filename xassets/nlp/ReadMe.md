# Module Nodejs `nlp-js-tools-french`

Ce dossier permet de produire le fichier `npl-node-module.js` qui permet d'utiliser les outils de lemmatisation, etc. de la librairie Nodejs `NLP.js`.

Voir [nlp-js-tools-french](https://npm.io/package/nlp-js-tools-french) pour le détail.

## Actualiser `npl-node-module.js`

> Note : cette actualisation est nécessaire dès que le code de `for-nlp-bundle.js` a dû être modifié.

* Ouvrir une fenêtre Terminal à ce dossier,
* jouer la commande :
  
  ~~~bash
  $> browserify for-nlp-bundle.js -o nlp-node-module.js
  ~~~
* déplacer le fichier `nlp-node-module.js` dans le dossier `./js/app/` (en demandant de remplacer le précédent).

Cette commande va produire le fichier `nlp-node-module.js` qui permet d'utiliser dans le browser le module nodejs `nlp-js-tools-french` (qui permet tous les traitements sur les textes).

C'est grâce à ce module qu'on peut utiliser :

~~~javascript

const nlp = new NLP("Mon texte à analyser")

~~~

## Actualisation de `nlp-js-tools-french`

> (ou si on vient de cloner le code — les modules nodejs ne sont pas déposés).

* Ouvrir un Terminal à ce dossier,
* jouer la commande :
    ~~~bash
    npm update nlp-js-tools-french
    ~~~


## Browserify

S'il n'est pas encore chargé dans la machine (nodejs/npm doit être installé) :

~~~bash

sudo npm install -g browserify

~~~
