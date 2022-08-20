<style type="text/css">
  span.warning {color: red; font-weight: bold;}
</style>
# Proximot - Manuel utilisateur

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
