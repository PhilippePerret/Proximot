import { InsideTest, page, mouse } from '../system/InsideTest/inside-test.lib.js'
import {ITFactory} from './utils/ITFactory.js'
/**
* Test du chargement et de l'affichage d'un texte brut
*/

/**
* Essai d'un test avec chargement direct du fichier
*/
new InsideTest({
    error: 'Un texte brut %{doit} pourvoir être chargé et correctement analysé/affiché'
  , eval:() => {
      IT_WAA.send(InsideTest.current, {
          class:'Proximot::App'
        , method:'load'
        , data: {
              filepath: ITFactory.File.textePath('texte_simple.txt')
            , then:     'afterAffichageTexte'
          }
      })
      return true
    }
  , afterAffichageTexte:(data) => {
      console.log("Éditeur contient : ", Editor.content.innerHTML)
      console.log("Data retournée dans afterChargementTexte : ", data)

      return false // pour générer une erreur pour le moment
    }
}).exec()
