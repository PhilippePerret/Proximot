'use strict'
/**
* 
* Class MiniTest
* --------------
* Pour faire des minitests rapide (qui ne testent que l'égalité, pour
* des tests au chargement qui vérifient l'application en direct)
* 
* @usage
* ------
*   miniTest(function(){
*     this.expected = 'mon résultat'
*     this.actual   = resultatDeMaFonction(param)
*     this.failure_message = "Le résultat devrait être bon"
*   })
* 
*   Avec plusieurs valeurs à tester :
* 
*   var test = new MiniTest(function(var1, var2){
*     this.expected = var1
*     this.actual   = fairePasserLeTestA(var1)
*     this.failure_message = "Ça passe pas"
*     this.success_message = "Ça passe" // affiché en vert si succès 
*   })
*   test.evaluate('bon', 'aussi')
*   test.evaluate('mauvais', 'non')
*     // On peut faire passer bien sûr autant de variables qu'on veut
*/


class MiniTest {
  constructor(method){
    this.method = method  
  }
  evaluate(...args){
    if ( args.length ) {
      this.method.call(this, ...args) 
    } else {
      this.method.call(this)
    }
    if ( this.expected != this.actual ) {
      console.error(`[MiniTest] ${this.failure_message} (attendue, obtenue)`, this.expected, this.actual)
    } else if ( this.success_message ) {
      console.log(`[MiniTest] %c${this.success_message}`, 'color:green;')
    }
  }
}

function miniTest(callback){
  new MiniTest(callback).evaluate()
}
