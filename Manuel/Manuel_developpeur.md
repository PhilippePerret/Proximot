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

Il existe (pour le moment) deux types de fragment, afin de permettre d’analyser et travailler le texte de façon fluide :

* le fragment réel,
* le fragment intermédiaire. Entre deux fragments réels se trouve un fragment intermédiaire qui permet de travailler les jointures entre fragments réels.

Ceci s’explique car le fragment est composé ainsi :

~~~bash
# Composition des fragments (sauf le premier et le dernier)

	2 pages        6 pages affichables        2 pages
	cachées																		cachées
|__________||___________________________||___________|

														2 pages            6 pages
Fragment intermédiaire   |__________||___________________________||___________|

~~~



Quand on atteint la dernière page d’un fragment (la 6e), l’application charge discrètement le fragment suivant. Dès qu’on passe à la 9e page (en comptant les cachées), l’application instancie le fragment intermédiaire entre le fragment précédente et le fragment suivant.

#### Les pages cachées

Les *pages cachées* permettent simplement de bien gérer les proximités. Si on commençait à la première page, on ne saurait pas si le premier mot est en proximité gauche (arrière) avec un mot précédent du texte au moment où on travaille le fragment. Pareil pour le dernier.

Bien sûr, cela n’est pas valable pour les premières et dernières pages.

---

## Synopsis généraux

---

### Affichage du texte

Le texte est [affiché par fragment](#display-fragment)

---

<a name="display-fragment"></a>

### Affichage du fragment

Un fragment est défini par son paragraphe de début (index).

* On récupère les paragraphes du fragment au moment de l'afficher. C'est une instance `TextFragment`.
* On passe en revue chaque mot de chaque paragraphe pour définir
  - sa position relative (`Mot@posRel`) dans le fragment,
  - la table `lemmas` du Fragment (`TextFragment@lemmas`). Elle  consiste en une table qui contient en clé le lemma et en valeur une table contenant en clé la position du mot dans le fragment et en valeur le mot.
  
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

On l’obtient avec `Editor.Selection.current`. C’est une instance `{Mot < Texel}`.
