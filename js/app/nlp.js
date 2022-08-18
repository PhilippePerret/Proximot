'use strict';

class NLP {

  /**
   * Le module nlp-node-module.js utilise cette méthode pour définir
   * la class NlpClass
   */
  static setClassNlp(nlpClass){
    this.NlpClass = nlpClass
  }
  /**
   * @return une instance du Nlp-fr-tool (pour l'instance NLP)
   */
  static getNlpInstance(texte){
    return new this.NlpClass(texte)
  }

  constructor(corpus){
    this.corpus = corpus
  }
  get tokenized(){return this.nlp.tokenized}
  lemmatizer(){return this.nlp.lemmatizer()}
  posTagger(){return this.nlp.posTagger()}
  stemmer(){return this.nlp.stemmer()}
  wordStemmer(word){return this.nlp.wordStemmer(word)}


  get config(){
    return {
      tagTypes:       ['art', 'ver', 'nom'],
      strictness:     false,
      minimumLength:  3,
      debug:          false
    }
  }

  get nlp(){
    // return this._nlp || (this._nlp = this.constructor.getNlpInstance(this.corpus) )
    return this._nlp || (this._nlp = this.constructor.getNlpInstance(this.corpus, this.config) )
  }
}
