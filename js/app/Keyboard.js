'use strict';
/**
 * class Keyboard
 * --------------
 * Gestion des touches clavier (observers)
 * 
 * 
 * Principes
 * ----------
 * 
 * Quand la touche 'Effacement arrière' est jouée, on supprime
 *  SOIT : la sélection, quelle qu'elle soit
 *  SOIT : la chose avant le curseur
 * 
 * Quand on tape du texte (lettres seules, sans modifieurs)
 *    SI  on est en édition 
 *        => on ajoute les caractères
 *    SI  on est pas en édition et un mot est sélectionné
 *        => on passe en édition en le remplaçant.
 *    SI  pas en édition + pas de mot sélectionné
 *        => Message d'information
 * 
 * Quand on joue la touche RETURN
 *    SI  on est en édition
 *        => on valide la modification (et on relance l'analyse)
 *            (note : peut-être qu'en édition il faut lancer
 *              l'analyse à chaque touche pressée - trop gourmand ?)
 *    SI  on est en édition et qu'il y a le modifier CMD
 *        => on passe au paragraphe suivant
 *    SI  on est pas en édition et qu'un mot est sélectionné
 *        => on passe le mot en édition
 * 
 * Quand on joue les flèches <-/->
 *    SI  un mot est sélectionné (ou une sélection quelconque)
 *        => on sélectionne le mot suivant (en l'ajoutant si
 *           la touche MAJ est tenue)
 *    SI  Aucune sélection, on passe à la première ou dernière
 * 
 * Quand on joue les flèches <-/-> avec CMD
 *    SI  il y a des proximités
 *        => on se déplace de proximité en proximité
 *    SINON
 *        => on ne fait rien (message)
 */

class Keyboard {
  
}
