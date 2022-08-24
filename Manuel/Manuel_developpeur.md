# Proximot - Manuel développeur

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
