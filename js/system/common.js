'use strict';
/**
 * common.js
 * 
 * Méthode communes
 * 
 * version 2.5
 * 
 * @autotesté
 * 
 * Cette librairie est autotestée. Il faut charger aussi le module
 * MiniTest (avant elle, sans defer)
 */

var test; // la marque qu'un module est autotesté

/**
*   SUPPRIMER DES ÉLÉMENTS D'UNE LISTE
*   ----------------------------------
* 
* Retire de +array+ le ou les éléments qui répondent à la fonction
* condition +condMethod+
* 
* @autotestée
* 
* @exemples
*         var ary = [1,2,3,4,5]
*         ary = removeFromArray(ary, item => {return item > 3})
*         // => [1,2,3]
* 
*         var ary = [obj1, obj2, obj3]
*         ary = removeFromArray(ary, item => {return item.option == true})
* 
* @param options {Hash} Table permettant de spécifier les choses
*           options.onlyOne     
*               Mettre à true s'il n'y a qu'un seul élément à 
*               trouver. Permet d'accélerer les choses.
*           options.fromBeginning
*               Mettre à true pour commencer depuis le départ. Mais
*               attention : s'il y a plus d'un élément à supprimer
*               cela produira un bug. Donc ça n'est à utiliser qu'
*               avec l'option onlyOne
*           options.inplace
*               Si true, c'est la liste fournie qui est modifiée.
*/  
function removeFromArray(arrayInit, condMethod, options){
  console.log("liste reçue par removeFromArray =" , arrayInit)
  var array ;
  options = options || {}
  if ( options.inplace ){
    array = arrayInit
  } else {
    array = JSON.parse(JSON.stringify(arrayInit))
  }
  if ( options.fromBeginning ) options.onlyOne = true
  var i = 0 ;
  const len = array.length
  if ( options.fromBeginning ) {
    /*
    |  À l'endroit : un seul item à supprimer plutôt au début
    */
    for (; i < len ; ++ i) {
      if ( condMethod.call(null, array[i]) === true) {
        array.splice(i, 1)
        break
      }
    }
  } else {
    /*
    |  À l'envers (plusieurs itemps à supprimer)
    */
    for(i = len - 1; i >= 0 ; -- i){
      if ( condMethod.call( null, array[i] ) === true) {
        array.splice(i, 1)
        if ( options.onlyOne ) break
      }
    }
  }
  return array
}


const max = 3
new MiniTest(function(exp, ary, condMethod, options){
  this.expected = exp
  this.actual   = removeFromArray(ary, condMethod, options)
  this.failure_message = `removeFromArray avec les options ${JString(options)} ne retourne pas la bonne valeur.`
}).evaluateValues([
    [[1,2,3]  , [1,2,3,4,5], function(item){return item > max}]
  , [[1,2,3,5], [1,2,3,4,5], function(item){return item > 3}, {fromBeginning:true} ]
  , [[1,2,3,4], [1,2,3,4,5], function(item){return item > 3}, {onlyOne:true} ]
])

const objetTest = [
    {foo:true   , id:12 , str:'un texte long'}
  , {foo:false  , id:5  , str:'des'}
  , {foo:true   , id:45 , str:'court'}
  , {foo:true   , id:2  , str:'as'}
]
new MiniTest(function(exp, ary, condMethod, options){
  this.expected   = exp
  const resultat  = removeFromArray(ary, condMethod, options)
  console.log("résultat = ", resultat)
  this.actual     = resultat.map(ite => {return ite.id})
  this.failure_message = 'removeFromArray avec une liste d’objet ne retourne pas la bonne valeur.'
}).evaluateValues([
    [ [5]       , objetTest , function(item){return item.foo}, null]
  , [ [12,45]   , objetTest , function(item){return item.str.length < 4}]  
  , [ [12,5,45] , objetTest , function(item){return item.str.length < 4}, {onlyOne:true}]
])

// --- /Tests ---

function isDefined(foo){
  return not(undefined === foo)
}
var parVariable = "une variable"
  , varNonDefinie ;

new MiniTest(function(exp, foo){
  this.expected = exp
  this.actual   = isDefined(foo)
  this.failure_message = "isDefined ne retourne pas la bonne valeur…"
}).evaluateValues([
    [true, 'string']
  , [true, parVariable]
  , [true, null]
  , [true, false]
  , [true, 0]
  , [false, undefined]
  , [false, varNonDefinie]
])


/**
* Si la valeur +primValue+ est définie (même si elle est false ou 0,
* même à null) on la renvoie, sinon on prend +elseValue+
* 
*/
function definedOr(primValue, elseValue){
  if ( undefined === primValue ) {
    return elseValue
  } else {
    return primValue
  }
}
test = new MiniTest(function(pvalue, expected){
  this.expected         = expected
  this.actual           = definedOr(pvalue, 'oui')
  this.failure_message  = "definedOr ne retourne pas la bonne valeur"
})
;[
  ['simple','simple'],[undefined,'oui'],[null,null],[false,false]
].forEach( paire => { test.evaluate(...paire) })


function not(v){ return ! v }


/**
 * Pour benchmarker une méthode/opération
 */
function benchmark(method, titre){
  const startTime =  new Date().getTime()
  method.call()
  const endTime =  new Date().getTime()
  console.info("Durée de %s : %f", titre, endTime - startTime)
}

/**
 * Pour écrire en console le backtrace
 * 
 */
function trace(){
  try {
    throw new Error("Trace")
  } catch(err) {
    console.error(err.stack)
  }
}

/**
 * @return la date au format humain, sous forme de :
 * "JJ/MM/AAAA H:MM:SS"
 * 
 */
function hdateFor(date){
  return date.toLocaleString()
}

function int(foo){
  return parseInt(foo, 10)
}
function bool(foo){
  return bool === true || bool == 'true'
}

/**
 * Pour pouvoir utiliser par exemple :
 * 
 * try {
 * 
 *   condition || raise("C'est une erreur")
 * 
 *   condition || raise(tp("La valeur devrait être %s", [valeur]), data2console)
 * 
 *   condition || raise(tp("Son nom devrait être %{nom} !", {nom: 'Personne'}))
 *
 * } catch (err) {
 * 
 * }
 */
function raise(foo, data4console) { 
  erreur(foo)
  if ( data4console ) console.error("Données transmises par l'erreur :", data4console)
  throw foo 
}

/**
 * Retourne la version JSON de +foo+
 * Utile car de nombreuses comparaisons, comme celle de Array, ne
 * fonctionnent pas simplement.
 * 
 * @param foo {Any} La chose à stringifier
 * @param noCatch {Boolean} Si true, le traitement dans le catch sera
 *                sauté. Cela est nécessaire pour éviter la boucle 
 *                infinie dans le cas ou App.JStringEpure est utili-
 *                sée.
 */
function JString(foo, noCatch){
  try {
    return JSON.stringify(foo)
  } catch(err) {
    if ( noCatch ) return foo
    if ( 'string' == typeof foo.inspect ) {
      return foo.inspect
    } else if ( 'function' == typeof App.JStringEpure ) {
      return JString(App.JStringEpure(foo), true)
    } else {
      Log.warn("Impossible de jsonner : ", foo)
    }
    return foo
  }  
}

function prettyInspect(foo, output, indent){
  indent = indent || 0
  output = output || 'console'
  switch(typeof foo){
  case 'string':
    return '"' + foo + '"'
  case 'boolean':
    return foo ? 'true' : 'false'
  case 'object':
    if ( undefined !== foo.sticky ) { // expression régulière
      return String(foo)
    } else if ( Array.isArray(foo) ) {
      return prettyInspectArray(foo, output, indent + 1)
    } else { // table de hashage
      return prettyInspectObject(foo, output, indent + 1)
    }
  default :
    return foo
  }
}
/**
 * Pour un affichage d'une table
 * 
 * @param table {Hash} La table à afficher
 * @param output {string} Le format ou la sortie ('console', 'html')
 * @param indent {Number} Indentation (nombre de doubles espaces)
 * 
 */
function prettyInspectObject(table, output, indent){
  indent = indent || 1
  output = output || 'console'
  if (output == 'text') { output = 'console' }
  const alinea = alineaFor(indent)
  const lines = [alinea+'{']
  var val
  for(var key in table) {
    val = prettyInspect(table[key], output, indent + 1)
    var line;
    switch(output){
    case 'console':
      line = alinea + key + ': ' + val + ',' ; break
    default:
      line = '<div style="text-indent:'+indent+'em;"><span class="key">'+key+'</span><span class="value">'+val+'</span></div>'
      break
    }
    lines.push(line)
  }
  lines.push(alinea+'}')
  return lines.join(output == 'console' ? "\n" : '')
}

function prettyInspectArray(ary, output, indent){
  const alinea = alineaFor(indent)
  var lines = [alinea+'[']
  ary.forEach( foo => {
    lines.push(prettyInspect(foo, output, indent + 1 ))
  })
  lines.push(alinea+']')
  switch(output){
    case 'console': case 'text':
      lines = alinea + lines.join("\n" + alinea)
      break
    case 'html':
      lines = lines.join("")
      break
  }
  return lines
}


function alineaFor(nombre, unite){
  unite = unite || '  '
  var a = ''
  ++nombre
  while(--nombre){a += unite}
  return a
}

/**
 * Template string
 *
 *  Par exemple :
 *    tp("Mon %s", ['String']) 
 *      => "Mon String"
 *    tp("Mon %{animal} s'appelle %{nom}", {nom:'Toby', animal:'chien'})
 *      => "Mon chien s'appelle Toby"
 * 
 */
function tp(str, values){
  if ('string' == typeof values) { values = [values] }
  if ( values.length ) {
    while(str.match(/\%s/)){
      str = str.replace(/\%s/, values.shift())
    }
  } else {
    for(var value in values){
      var reg = new RegExp(`\%\{${value}\}`)
      str = str.replace(reg, values[value])
    }
  }
  return str
}
/* TEST DE tp() */
if ( tp("Mon %{animal} s'appelle %{nom}", {nom:'Toby', animal:'chien'}) != "Mon chien s'appelle Toby"){
  console.error("La méthode tp(…) ne fonctionne pas\nAttendu: %s\nObtenu: %s", "Mon animal s'appelle Toby", tp("Mon %{animal} s'appelle %{nom}", {nom:'Toby', animal:'chien'}))
}
if ( tp("Je lis mon %s.", ['journal']) != "Je lis mon journal."){
  console.error("La méthode tp(…) fonctionne mal\nAttendu: %s\nObtenu: %s", "Je lis mon journal.", tp("Je lis mon %s.", ['journal']))
}

function log_rouge(msg){
  console.log("%c" + msg, "color:red;")
}
function log_bleu(msg){
 console.log("%c" + msg, "color:blue;") 
}
function log_vert(msg){
 console.log("%c" + msg, "color:green;")  
}
function log_orange(msg){
 console.log("%c" + msg, "color:orange;") 
}
