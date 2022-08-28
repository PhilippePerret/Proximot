# Proximot - Manuel développeur



## Fichiers Proximot

Un fichier proximot possède l’extension **`.pxw`** (comme “ProXimot Word”) et, en réalité est **un package** qui contient plusieurs fichiers :

~~~bash
fichier.pxw
		|
		|––– app_state.yml 				# Dernière état de l'application
		|
		|––– preferences.yml			# Préférences pour le texte courant
		|
		|––– console_history.yml 	# Historique des commandes en console.
		|
		|––– fragments/
		| 				|
		|					|––– fragment-0/
		|					|					|––– data.yml          	# données du fragment
		|					|					|––– texels.csv  				# text-elements du fragment
		|					|					|––– proximities.csv		# proximités du fragment
~~~



---

## Fragment

Le cœur de l’application, c’est le fragment de texte (**`TextFragment`** en javascript). C’est lui qui permet d’analyser tout un texte. Mais le texte est dépendant de lui et non pas l’inverse.

Ceci s’explique parce que le texte n’existe pas en tant que tel dans l’application. Alors que le fragment si, puisque c’est lui qui est affiché.

### Continuité entre les fragments

Pour gérer la continuité entre les fragments (les premiers mots du fragment X doivent marquer les proximités qu’ils ont avec les derniers mots du fragments X - 1), on charge toujours les 500 premiers mots du fragment suivant (s‘il existe) et les 500 du fragment précédent (s’il existe). 

---

## Synopsis généraux

---

### Affichage du texte

Le texte est [affiché par fragment](#display-fragment)

---

<a name="display-fragment"></a>

### Affichage du fragment

Un fragment contient des paragraphes. Ce sont ces paragraphes qui sont affichés pour afficher le texte. Chaque paragraphe contient des texels (dest “text-elements”) dont les mots font partie (les autres types de texels sont les ponctuations, les retours à la ligne, etc).

Concrètement

* On passe en revue toutes les instances `{Paragraphe}` du fragment (instance `TextFragment`).
* On passe en revue chaque mot (classe fille de `{TextElement}`) pour l’afficher.

Note : avant on calculait les positions (`offset`)  et les proximités et lemmas à ce moment. Maintenant, ils sont calculés dès le départ.



## Table `Lemmas` de fragment

La table `lemmas` du Fragment (`TextFragment@lemmas`)  consiste en une table qui contient en clé le lemma et en valeur une table contenant en clé la position du mot dans le fragment et en valeur le mot.

~~~javascript
TextFragment@lemmas = `<<<Lemmas>>>`{
    '<lemma1>': `<<<Lemma>>>`{
        positions: [10,54,200]
      , 10:   {mot: Mot1, index:0}
      , 54:   {mot: Mot2, index:1} // proximité
      , 200:  {mot: Mot3, index:2}
    }
  , '<lemma2>': {
    }
  , //...
}
~~~

> Noter que puisque la position du mot dans le fragment est unique, la clé `relPos` correspond au mot.

> L'index `index` ajouté permettra de supprimer rapidement le mot dans la liste des positions sans avoir à chercher. Il permet aussi de retrouver rapidement un mot avant ou après, par sa position.

> Noter qu'on pourrait rechercher les proximités dès la création de la table `TextFragment@lemmas` mais que pour le moment, je préfère que le mécanisme soit séparé, car il sera à appeler souvent.

* On affiche chacun de ses paragraphes.
* On passe à l'affichage de chaque mot du paragraphe. 
* En affichant ces mots, on regarde s'ils sont **en proximité**. Pour le voir, on consulte la liste des `lemmas` du fragment
  - Cette liste de  `lemmas` 



## Ajout d’une commande console

* Définir sa lettre/ses lettres (ou utiliser une lettre générique, par exemple “f” pour faire “fx”),
* programmer la commande dans `js/Console/CommandManager.js`
  * l’ajouter au switch de la méthode `onSubmit`,
  * faire sa méthode propre
* rédiger son aide dans `js/Console/TooltipManager.js`, dans la donnée `DATA_COMMANDS`.



---

## Sélection

La sélection est un objet de l’éditeur. On l’obtient de n’importe où avec `Editor.Selection`.

### Sélection courante

On l’obtient avec `Editor.Selection.current`. C’est une instance `{Mot < Texel}` ou `{NomPropre < Texel}`.
