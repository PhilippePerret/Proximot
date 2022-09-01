import { InsideTest, assert, page, mouse, itraise } from '../system/InsideTest/inside-test.lib.js'
import {ITFactory} from './utils/ITFactory.js'
import {ITAppStateChange as StateChanger} from './utils/StateChange.js'

/**
* Module de test pour s'assurer que la suppression de mots est
* fonctionnelle.
* 
* Tous les cas à traiter
* ----------------------
*   - Suppression du premier mot (sans proximité)
*       Répercussions sur les longueurs, les index, les offsets…
*   - Suppression du dernier mot (sans proximité)
*       Aucune répercussion autre que sur le dernier mot
*   - Suppression d'un mot avec proximité (supprimant la proximité)
*   - Suppression d'un mot avec proximité (initiant une nouvelle proximité)
*   - Suppression d'un mot sans proximité mais répété
*       Répercussions sur le nombre de mots du lemme
*   - Suppression du dernier mot d'un paragraphe qui n'en contient qu'un seul
*       Le paragraphe doit être supprimé
*   - Suppression de tous les mots (et texels) d'un paragraphe
*       Le paragraphe doit être supprimé
*/

//*
const evalForTexteSimple = function(){
      return ITFactory.load_texte(InsideTest.current, 'texte_simple.txt', {then:'apresChargementTexte'})
    }

function command(command){
  const len = command.length
  if ( command.substring(len - 1, len) == "\n"){
    submitCommand(command.substring(0, len - 1))
  } else {
    Console.value = command
  }
}
function submitCommand(command){
  Console.value = command // + "\n"
  simulateEnterOn(Console.field)
}

function simulateEnterOn(field){
  const e = document.createEvent('Event')
  e.initEvent('keyup')
  e.which = e.keyCode = 13
  e.key = 'Enter'
  field.dispatchEvent(e)
}

new InsideTest({
    error: 'La suppression du dernier mot fonctionne'
  , eval: evalForTexteSimple
  , apresChargementTexte:function(data){
      new StateChanger()
        .preCheck(function(){
          this.lastMot = App.fragment.mots[App.fragment.mots.length - 1]
          this.nbMotsParagInit = int(this.lastMot.paragraph.mots.length)
        })
        .operate(function(){
          /* Suppression du dernier mot */
          submitCommand('s ' + this.get('nb_mots_fragment'))
          submitCommand('delete')
        })
        .postCheck(function(){
          console.log("Le dernier mot était : ", this.lastMot)
          console.log("Les mots du fragment actuel : ", App.fragment.mots)
          const nb_mots_paragraph_end = int(this.lastMot.paragraph.mots.length)
          assert(this.nbMotsParagInit - 1, nb_mots_paragraph_end, 'nombre de mots du paragraphe')
          this.hasChanged( 'nb_mots_fragment', -1 )
          this.hasChanged( 'nb_mots_fragment', -1 )
          this.hasChanged( 'nb_displayed_mots', -1)
          /* TODO Le mot ne doit plus exister */
          /* TODO Le ZManager doit avoir consigné la chose */
        })

      return true
    }
}).exec()
//*/

/*
new InsideTest({
    error: 'La suppression du premier mot fonctionne bien'
  , eval: evalForTexteSimple
  , apresChargementTexte:function(data){
      console.warn('le premier')
      message("Je reviens d'entre les morts pour le premier")
  }
}).exec()
//*/

