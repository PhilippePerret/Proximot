<style type="text/css">
  .inlineb {display:inline-block;}
  span.warning {color: red; font-weight: bold;}
</style>

# Proximot - Manuel utilisateur

**Proximot** est une application pour travailler les proximités dans un texte. Partant du principe qu’en bon français les répétitions détruisent le style, cette application permet de traquer les répétitions et de les supprimer.

---

## Principes

* Tout clavier
* Sélection par mot. Entendu que ce sont des mots qui doivent être modifiés, la sélection se fait toujours par mot entier (les modifications aussi). La console, à la manière de Vim, permet une grande agilité dans les déplacements et les sélections.

### Tout clavier

On gère entièrement le texte au clavier, à la façon de Vim, avec une console en bas de page qui permet d’entrer toutes les commandes.

---

## Commandes console

* L’étoile à la fin d’une commande signifie toujours “ALL”, donc “Tous”.

### Commandes Éditions

| <span style="width:280px;display:inline-block;">Opération</span> | <span style="display:inline-block;width:120px;">Com</span> | Mnémo                | Commandes et paramètres                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------- | -------------------- | ------------------------------------------------------------ |
| Remplacement la sélection par ce mot (en faisant tous les checks nécessaires) | **`r <remp>`**                                             | [R]emplace           | Remplace la sélection par le mot donné (et recalculé tout)   |
| Remplacer tous les mots identiques par le mot donné          | **`r* <remp>`**                                            | [R]emplace [*] = all | Remplace tous les mots identiques à la sélection par le mot donné. |
|                                                              |                                                            |                      |                                                              |
|                                                              |                                                            |                      |                                                              |

### Commandes Fichiers

| <span style="width:280px;display:inline-block;">Opération</span> | <span style="display:inline-block;width:120px;">Com</span> | Mnémo                 | Commandes et paramètres                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| Affiche les informations sur le fichier courant.             | **`f`**                                                    | [F]ile                |                                                              |
| Ouvre un fichier proximot ou texte                           | **`fo <path/to>`**                                         | [F]ile [O]pen         |                                                              |
| Enregistrer le fichier courant                               | **`fw [path/to>]`**<br />**`w`**                           | [F]ile [W]rite        | Si le chemin n’est pas fourni, c’est le chemin normal. Avec `w` seul, on peut aussi spécifier un chemin |
| Enregistre le texte du fichier courant                       | **`fwt [path/to>]`**<br />**`wt`**                         | [F]ile [W]rite [T]ext | Il sera enregistré dans un fichier `.txt`                    |



### Commandes Déplacements

| <span style="width:280px;display:inline-block;">Opération</span> | <span style="display:inline-block;width:120px;">Com</span> | Mnémo | Commandes et paramètres |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ----- | ----------------------- |
| Déplacer la sélection vers la droite                         | ⌃ ➡️                                                        |       |                         |
| Déplacer la sélection vers la gauche                         | ⌃ ⬅️                                                        |       |                         |
|                                                              |                                                            |       |                         |
|                                                              |                                                            |       |                         |

### Commandes Proximités

| <span style="width:280px;display:inline-block;">Opération</span> | <span style="display:inline-block;width:120px;">Com</span> | Mnémo               | Commandes et paramètres                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ------------------- | ------------------------------------------------------------ |
| Aller à la prochaine proximité                               | **`np`**                                                   | next proximity      | Sélectionne la proximité suivante dans le texte, ou la première |
| Prochaine proximité de la sélection                          | **`n`**                                                    | next                |                                                              |
| Précédente proximité de la sélection                         | **`p`**                                                    | previous            |                                                              |
| Information sur sélection                                    | **`i`**                                                    | information         | Affiche à l’écran les informations sur la sélection (à commencer par les proximités) |
| Ignorer la proximité courante                                | **`ig[nore]`**                                             |                     |                                                              |
| Ignorer toutes les proximités de ce type                     | **`ig[nore]*`**                                            | `ig*<br />`ignore*` | Donc soit `ig a` soit `ignore all`.                          |




### Commandes Sélection

| <span style="width:280px;display:inline-block;">Opération</span> | <span style="display:inline-block;width:120px;">Com</span> | Mnémo          | Commandes et paramètres                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------- | -------------- | ------------------------------------------------------------ |
| Sélectionner le mot suivant (ou le premier)                  | ⌘ ➡️                                                        |                | On peut aussi l’obtenir en jouant la command `s <index mot>`, par exemple `s 1` pour sélectionner le premier mot. |
| Sélectionner le mot précédent (ou le premier)                | ⌘ ⬅️                                                        |                |                                                              |
| Aller à la prochaine proximité                               | **`np`**                                                   | next proximité | Sélectionne la proximité suivante dans le texte, ou la première |
| Prochaine proximité de la sélection                          | **`n`**                                                    | next           |                                                              |
| Précédente proximité de la sélection                         | **`p`**                                                    | previous       |                                                              |
| Information sur sélection                                    | **`i`**                                                    | information    | Affiche à l’écran les informations sur la sélection (à commencer par les proximités) |
| Sélectionner le nième mot du fragment                        | **`s <index>`**                                            | “S”élection    | L’index est un entier 1-start (premier mot = 1)              |
| Sélectionner les mots de `n`à `m`                            | **`s <n-m>`**                                              | Idem           | Les index sont des entiers 1-start (premier mot = 1)         |
| Sélectionne le nième mot après la sélection                  | **`s +<n>`**                                               | Idem           | `n` est un entier.                                           |
| Sélectionne le nième mot avant la sélection                  | **`s -<n>`**                                               | Idem           | `n` est un entier.                                           |
| Sélectionner par recherche                                   | **`/ <texte>`**                                            |                | Sélectionne le premier mot matchant avec `<texte>`. Si c’est une expression régulière, ajouter `/` au début et à la fin du texte. |
|                                                              |                                                            |                |                                                              |



---

<a name="run-text-analysis"></a>

## Lancer l'analyse du texte

Pour forcer l'analyse du texte (par exemple après la [définition d'une nouvelle liste de mots propres](#listes-mots-propres)), il faut \[À DÉFINIR\].

---

<a name="listes-mots-propres"></a>

## Listes propres

On peut créer ses propres listes de mots (*lexicons*) que l'analyseur de texte pourra reconnaitre (en [lui faisant connaitre](#define-lexicon).

Une liste de mots est un fichier texte simple qui contient :

~~~text

mot1[TAB]tag[SPACE]lemma[TAB]tag[SPACE]lemma
mot2[TAB]tag[SPACE]lemma
etc.
~~~

> <span class="warning">ATTENTION</span> : si le fichier est réalisé dans Sublime Text ou un autre IDE, il faut s'assurer que les tabulations ne soient pas remplacés par des espaces.

### Définir le lexique propre d'un texte en particulier (`lexicon.lex`)

Pour définir une liste de mots propres pour un texte particulier, il suffit de créer un fichier s'appelant exactement `lexicon.      options.merge!(lexicon: File.join(text_folder,'lexicon.lex'))
` à la racine du dossier contenant le texte. Ce lexicon sera chargé automatiquement.

<a name="define-lexicon"></a>

### Définir le lexique propre

Pour faire savoir que l'analyseur de texte doit utiliser un lexicon, se rendre dans les préférences du texte et choisir un des cinq champs pour définir les lexicons.

Enregistrer et [relancer l'analyse du texte](#run-text-analysis).
