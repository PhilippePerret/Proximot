import { InsideTest, page, mouse } from '../system/InsideTest/inside-test.lib.js'

/**
* Module de test pour s'assurer que la suppression de mots est
* fonctionnelle.
*/

new InsideTest({
    error: 'La suppression des mots %{devrait} fonctionner'
  , eval: function(){
      IT_WAA.send(InsideTest.current, {
          class:'Proximot::InsideTest'
        , method:'load_text'
        , data:{
              path:         'texte_simple.txt'
            , classAfter:   'InsideTest.current'
            , methodAfter:  'afterEval'
        }})
      return false
    }
  , afterServerEval:function(data){
      console.log("Données retournée:", data)
      /* TODO : il faut tout resetter ici */
      Panel.reset()
      TextElement.reset()
      Editor.reset()
      if (data.filepath) {
        WAA.send({class:'Proximot::App',method:'load',data:{filepath: data.filepath}})
      }
    }
}).exec()

