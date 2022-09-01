import { InsideTest, page, mouse } from '../system/InsideTest/inside-test.lib.js'
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
*/

//*
const evalForTexteSimple = function(){
      return ITFactory.load_texte(InsideTest.current, 'texte_simple.txt', {then:'apresChargementTexte'})
    }

function cmd(command){
  Console.value = command
}
function submitCommand(command){
  Console.value = command + "\n"
}

new InsideTest({
    error: 'La suppression du dernier mot fonctionne'
  , eval: evalForTexteSimple
  , apresChargementTexte:function(data){
      /* Pour tester les changements */
      const state = new StateChanger()
      /*
      |  OPÉRATION = Suppression du dernier mot
      */
      submitCommand('s ' + state.get('nb_mots'))
      // cmd('delete' + "\n")

      /*
      |  Vérifications
      */
      state.definePostState()
      state.hasChanged( 'nb_mots', -1 )
      state.hasChanged( 'nb_texels', -1 )
      state.hasChanged( 'nb_displayed_mots', -1)
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

