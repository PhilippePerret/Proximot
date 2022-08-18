import { InsideTest, page, mouse } from '../system/InsideTest/inside-test.lib.js'

var test = new InsideTest({
    error: '%{doit} retourner le bon type'
  , eval(sujet){
      return TextUtils.getTypeOf(sujet)
    } 
})
let tbl = {
    ' ': 'space', "\t": 'space'
  , 'a': 'alphanum'
  , 'é': 'alphanum'
  , 'ô': 'alphanum'
  , 'ï': 'alphanum'
  , '8': 'alphanum'
  , "\n": 'ret'
  , '€':  'spec'
}
for(var k in tbl){
  test.withExpected(k, tbl[k])
}

test = new InsideTest({
    error: 'Devrait bien décomposer le texte'
  , eval(text){
      return TextUtils.splitInParagraphs(text)
    }
})
