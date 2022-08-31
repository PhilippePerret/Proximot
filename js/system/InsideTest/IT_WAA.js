'use strict';
/**
 * class IT_WAA
 * -------------
 * Pour une interaction avec le serveur depuis les tests. Cf. le 
 * manuel dans Programmes/InsideTest/Manuel
 * 
 * version 1.2
 * 
 * Pour faire attendre la fin des InsideTest quand il y a des 
 * tests côté serveur et réceptionner les résultats pour les 
 * envoyer à InsideTest
 * 
 * Cf. le manuel dans Programmes/InsideTest/
 * 
 */
const IT_ERRORS = {
    requireCurrentTest      : "Il faut impérativement un test courant pour appeler IT_WAA.send."
  , currentTestFirstArg     : "Le texte courant (InsideTest.current) doit impérativement être mis en premier argument de la méthode IT_WAA.send"  
  , dataInsideTestRequired  : "Les données InsideTest sont requises. Si c'est une méthode régulière qui a été utilisée, ajoutez data['__ITData__'] à son retour." 
  , testIdRequired          : "IT_WAA.receive attend impérativement data.testId."
  , resultServerRequired    : 'IT_WAA.receive attend impérativement le résultat du test serveur ({:ok, :errors}).'

}
class IT_WAA {
  static get working(){
    if ( undefined === this.workers ) return false
    // Nombre de workers en activité
    const workersCount = Object.keys(this.workers).length
    // Nombre de retours de résultats non traités
    const ResultatCount = this.stackServerResultats.length
    // S'il reste des choses à faire, on retourne false
    return not(workersCount == 0 && ResultatCount == 0)

  }

  static send(test, data){
    // console.log("-> IT_WAA.send(test, data) data = ", test, data)
    data || raise(IT_ERRORS.currentTestFirstArg)
    test || raise(IT_ERRORS.requireCurrentTest)
    if ( undefined === this.stackServerResultats ) {
      this.workers = {}
      this.stackServerResultats = []
    }
    /*
    | On consigne ce "worker" (ça donnera aussi la valeur true à
    | this.working)
    */
    Object.assign(this.workers, { [test.id]: test })
    /*
    |  On peut envoyer la requête serveur en ajoutant aux données
    |  l'identifiant du test.
    */
    if ( not(data.data) ) Object.assign(data, {data:{}})
    Object.assign(data.data, { __ITData__: { testId:test.id } })
    if ( data.data.then ) {
      Object.assign(data.data.__ITData__, {then: data.data.then })
    }
    /*
    |  Transmission de la requête au serveur
    */
    console.info("Données envoyées à WAA.send par IT_WAA:", data)
    WAA.send(data)
  }

  /**
   * Méthode qui reçoit la réponse des tests côté serveur
   * 
   * @param data  {Object} Table des résultat
   *              note : elle doit contenir :testId, l'identifiant 
   *              du test.
   */
  static receive(data){
    // console.log("Données reçues par IT_WAA.receive", data)
    data.__ITData__ || raise(IT_ERRORS.dataInsideTestRequired)
    const ITData = data.__ITData__
    console.log("[IT_WAA.receive] ITData = ", ITData)
    const testId = ITData.testId
    isDefined(testId) || raise(IT_ERRORS.testIdRequired)
    // data.result || raise(IT_ERRORS.resultServerRequired)
    /*
    |  On passe les résultats au test
    */
    this.stackServerResultats.push(data)
    /*
    |  On détruit ce worker
    */
    delete this.workers[testId]
  }



}
