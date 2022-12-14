# Réflexion

# L'interface

La premier réflexion à faire concerne l'interface. Entendu que je veux un truc très pratique mais également très agréable à utiliser, pas l'interface difficile d'Antidote.

Les exigences :

- indication des proximités en direct
- possibilité de modifier totalement une phrase
- mémorisation des proximités à ne pas prendre en compte pour le mot 
- indication des modifications par rapport au tout premier texte entré (pour pouvoir corriger un autre texte)

Le truc qui me paraitrait le plus efficace, ce serait un éditeur de texte très simple comme TextEdit, ou page, couplé à une fenêtre de Terminal pour indiquer les proximités.

Une autre possibilité serait d'avoir une page HTML, avec un champ de saisie et le texte et une visualisation identique avec l'indication des proximités. Les deux ne seraient jamais l'un sur l'autre.

> Note : grâce à ma technologie WAA, on pourrait tout sauvegarder facilement.

Ça donnerait ça :

- on a le texte en .txt
- il est chargé, découpé en mots qui sont mis dans des spans dans la page.
- les proximités sont indiquées (en respectant les préférences)
- en cliquant sur un mot
- SHIFT + DRAG (sans pression) permet de sélectionner plusieurs mots (pour les détruire)
- quand on clique sur l'espace entre deux mots, on peut en ajouter un
- quand on supprime un mot (touche erase) on peut tout de suite en insérer un nouveau. Si on sort sans rien faire, ça supprime le champ.


## Fragment de texte

L'idée, pour accélérer le traitement, serait de fonctionner par Fragment de texte. Un *Fragment* est un texte (instance {TextFragment}) défini par un début et une fin dans le texte complet courant (instance {Texte}).

La base de longueur d'un fragment pourrait être 8 pages, c'est-à-dire 8 * 250 mots = 2000 mots, sachant qu'on ne pourrait pas modifier les 250 premiers et derniers sauf en passant au fragment suivant.

Le traitement serait invisible. Dès qu'on attendrait le bout d'un fragment, on passerait au suivant. Le point courant deviendrait le centre du nouveau fragment (plus compliqué que d'avoir un découpage fixe en fragment, mais plus pratique pour gérer facilement les jointures)

## Première analyse

La première analye consiste à marquer toutes les proximités d'un texte.

Pour se faire, on avance dans les mots en gardant une table des mots en cours d'étude.

Un mot est en cours d'étude lorsqu'on ne s'en est pas encore éloigné d'au moins X caractères.

Si un mot identique est rencontré avant que le mot ne soit plus à l'étude, alors cela s'appelle une proximité et elle est ajoutée au mot. Elle est ajoutée en tant que proximité avant pour le mot avant et en tant que proximité arrière pour le mot après.

Si une nouvelle occurence du mot est trouvé avant la fin de l'étude du premier, les deux sont marqués proches (originalité par rapport à l'ancien application, mais qui permettra de ne pas avoir à calculer le retrait d'une proximité.


