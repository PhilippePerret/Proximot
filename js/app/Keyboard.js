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

  /**
   * Méthode appelée quand un champ est mis en édition (pour le
   * moment, seulement les mots du texte)
   * 
   * @param params {Hash}
   *    obj:    DOM Element en édition
   * 
   */
  static setEdition(params){
    this.editionParams = params
    window.onkeyup    = this.on_Key_Up_Edition.bind(this)
    window.onkeydown  = this.on_Key_Down_Edition.bind(this)
    window.onkeypress = this.on_Keypress_Edition.bind(this)
  }

  static unsetEdition(e, withOk){
    if ( withOk ) {
      // Touche ou bouton OK
      this.editionParams.onOk(true)
    } else {
      // Annulation de l'édition
      const method = this.editionParams.onCancel || this.editionParams.onOk
      method.call(null, false) 
    }
    stopEvent(e)
    window.onkeyup    = this.on_Key_Up_Hors_Edition.bind(this)
    window.onkeydown  = this.on_Key_Down_Hors_Edition.bind(this)
    window.onkeypress = this.on_Keypress_Hors_Edition.bind(this)
    return false
  }


  static on_Key_Down_Hors_Edition(e){
    switch(e.key){
    case 'ArrowRight':
      // Sélectionner le mot suivant ou le premier
      // Si dernier : signaler
      // SI touche MAJ => ajouter à la sélection
      // SINON Mettre à la sélection
      if ( Editor.Selection.isEmpty ) {
        // Aucune sélection => sélectionner le premier mot
        Editor.selectMotByIndex(0)
      } else if ( Editor.Selection.last.index < Editor.lastAvailableIndex ) {
        Editor.selectMotByIndex(Editor.Selection.last.index + 1)
      } else {
        message("C'est le dernier mot !")
      }
      break
    case 'ArrowLeft':
      // Sélectionner le mot précédent ou le dernier
      // Si premier : signaler
      // SI la touche MAJ est appuyée => ajouter à la sélection
      // SINON : mettre la sélection à ce mot
      if ( Editor.Selection.isEmpty ) {
        // Aucune sélection => sélection le premier mot
        Editor.selectMotByIndex(0)
      } else if (Editor.Selection.last.index > 0) {
        Editor.selectMotByIndex(Editor.Selection.last.index - 1)
      } else {
        message("C'est le premier mot !")
      }
      break
    case 'ArrowDown':
      // Faire défiler le texte vers le haut (voir le bas)
      break
    case 'ArrowUp':
      // Faire défiler le texte vers le bas (voir le haut)
      break
    default:
      console.log("-> onkeydown", {key:e.key, shift:e.shiftKey, alt:e.altKey, cmd:e.metaKey, ctrl:e.ctrlKey})
    }
  } 
  static on_Key_Down_Edition(e){
    switch(e.key){
    default:
      console.log("-> onkeydown", {key:e.key, shift:e.shiftKey, alt:e.altKey, cmd:e.metaKey, ctrl:e.ctrlKey})
    }
  }

  static on_Key_Up_Hors_Edition(e){
    switch(e.key){
    case 'Enter':
      // SI sélection unique => mettre le mot en édition
      // SI sélection multiple => mettre le dernier mot en édition (ou tout ?)
      // SI pas de sélection ?
      if ( Editor.Selection.isEmpty ){
        message("Pour éditer un mot, sélecionnez-le")
      } else if ( Editor.Selection.isUniq ) {
        Editor.Selection.get().edit()
      } else {
        Editor.Selection.last.edit()
      }
    default:
      console.log("-> onkeydown", {key:e.key, shift:e.shiftKey, alt:e.altKey, cmd:e.metaKey, ctrl:e.ctrlKey})
    }
  }

  static on_Key_Up_Edition(e){
    switch(e.key){
    case 'Enter': case 'Tab':
      /*
      | Touche Enter pressée en cours d'édition
      */
      if ( e.metaKey ) {
        erreur("Je dois apprendre à créer un nouveau paragraphe.")
      } else {
        // Touche Return seule => finir l'édition
        return this.unsetEdition(e, true)
      }
    case 'Escape':
      // Annuler l'édition
      return this.unsetEdition(e, false)
    case 'Tab':
      // SI édition d'un mot => cf. 'Enter' ci-dessus
      break
    default:
      console.log("-> onkeydown", {key:e.key, shift:e.shiftKey, alt:e.altKey, cmd:e.metaKey, ctrl:e.ctrlKey})
    }
    return true
  }

  static on_Keypress_Hors_Edition(e){
    return true
  }

  static on_Keypress_Edition(e){
    return true
  }

}

/**
 * Les touches modifiers envoient toutes (même la touche Maj et
 * CapsLock) des keyDown et keyUp
 * 
 * Enter          passe par les trois
 * CMD + Enter    ne passe que par onkeydown
 * ALT + Enter    passe par les trois
 * CTRL + Enter   passe par les trois
 * 
 * Les flèches    passent par Down et Up
 *                mais pour les répétitions, il faut utiliser Down
 * 
 * TAB            passe par Down seulement (si ça focus ailleurs)
 * ALT + TAB      passe par Down et Up
 * CTRL + TAB     ne passe que par Up
 * 
 * Backspace        Seulement Down et Up
 * ALT + Backspace  Idem
 * CTRL+ Backspace Idem
 * MAJ + Backspace  Idem
 * 
 * Toutes les
 * touches        passent par les trois.
 * 
 */
window.onkeydown = Keyboard.on_Key_Down_Hors_Edition.bind(Keyboard)

window.onkeyup = Keyboard.on_Key_Up_Hors_Edition.bind(Keyboard)

window.onkeypress = Keyboard.on_Keypress_Hors_Edition.bind(Keyboard)
