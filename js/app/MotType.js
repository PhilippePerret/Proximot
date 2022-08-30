'use strict';
/**
* class MotType < TextElement
* ----------------------------
* Pour les text-elements (texels) qui doivent se comporter comme des
* mots. Pour le moment, ce sont Mot et NomPropre.
* 
*/

class MotType extends TextElement {

  /**
  * Méthode appelée quand l'utilisateur veut remplacer le mot
  * sélectionné par newContent. On doit vérifier si c'est possible et
  * si cela génère une nouvelle proximité. Si c'est le cas, on le
  * signale à l'utilisateur qui peut alors décider de le modifier ou
  * pas.
  * 
  * Cette méthode est appelée plusieurs fois avec différentes données
  * sauf si les mots sont connus. La première fois, +data+ est 
  * simplement le string de remplacement. Les autres fois, ça peut 
  * être les remontées du serveur avec les informations sur le ou les
  * mots.
  * 
  */
  checkAndReplaceWithContent(data) {

    let tableMots;

    if ( 'string' == typeof data ) {
      /*
      |  Tout premier appel
      */
      const newContent = data
      /*
      | Si le contenu est le même, on peut s'arrêter là
      */
      if ( newContent == this.content ) {
        message("Contenu identique. Je renonce.")
        return false
      }
      console.log("Contenu différent ('%s' ≠ '%s'), je poursuis", newContent, this.content)
      /*
      |  On fait une première découpe selon les espaces.
      */
      const mots = newContent.split(' ')
      tableMots       = [] // toutes les données des mots dans l'ordre
      const unknownDataMots = [] // Liste des mots inconnus
      /*
      |  Boucle sur les mots (peut-être un seul) pour voir ceux qui
      |  sont connus et ceux qui sont à remonter
      |  Produit la liste Array dataMots dont chaque élément contient
      |  les données du mot, dans l'ordre.
      */
      for( var imot = 0, len = mots.length; imot < len; ++imot){
        const motStr  = mots[imot]
        const dataMot = {index: int(imot), str: motStr}
        const dLemme  = MotType.getCountAndLemma(motStr)
        if ( dLemme ) {
          Object.assign(dataMot, dLemme)
        } else {
          unknownDataMots.push(dataMot)
        }
        tableMots.push(dataMot)
      }
      console.log("tableMots au départ : ", tableMots)
      /*
      |  On peut rechercher si nécessaire les mots non connus.
      |  Mais tant qu'à faire, le plus simple reste d'envoyer tout
      |  le nouveau contenu.
      */
      if ( unknownDataMots.length ) {
        /* Données à envoyer */
        WAA.send({class:'Proximot::TTAnalyzer', method:'findUnknowMots', data: {id:this.id, content:newContent}})
        return 
      }
    } else {
      /*
      |  On revient de la recherche des lemmas des mots
      */
      tableMots = []
      for ( var imot = 0, len = data.tokens.length; imot < len; ++ imot){
        const dtoken = data.tokens[imot]
        tableMots.push({index:int(imot), str:dtoken[0], lemma:dtoken[2], type: dtoken[1]})
      }
      // console.log("tableMots au retour : ", tableMots)
    }

    /*
    |   À partir d'ici, on a une liste, tableMots, qui contient les 
    |   données pour chaque mot (souvent un seul) avec un diction-
    |   naire contenant :
    |      str:     {String} Le mot lui-même, tel qu'il est écrit
    |      lemma:   {String} Le lemme du mot
    |      type:    {String} Le type Tree-tager du mot ('NOM', 'PUN')
    |      index:   {Number} L'index du mot dans la liste
    |
    |   On est donc en mesure de chercher les proximités. En sachant
    |   qu'elle n'existeront que pour les nouveaux lemmes (pas for-
    |   cément les nouveaux mots : le lemme "devoir" peut être très
    |   bien connu, mais le mot "dusse" pas encore employé)
    |
    |   On vérifie pour chaque mot.
    */

    tableMots.forEach( dmot => {
      const {str, lemma} = dmot
      const ilemma = this.fragment.lemmas.get(lemma, true /* ne pas instancier */)
      console.log("ilemma = ", ilemma)
      if ( ilemma ) {
        /*
        |  Le lemma existe, il peut y avoir proximité
        */
        console.log("Recherche de proximité dans : ", ilemma)
      } else {
        /*
        |  Si le Lemma n'existe pas, il ne peut pas y avoir de proximité
        */
      }
    })

    /*
    |  Traiter le cas où le premier mot de la liste des nouveaux
    |  mot est le mot actuel.
    |  (est une liste + premier mot = ce mot => ne pas toucher à cette
    |  instance du tout)
    */

    /*
    |  Réfléchir au fait que plutôt que de modifer cette instance,
    |  peut-être vaut-il mieux approfondir une procédure de destruction
    |  complète (du mot dans le DOM à ses proximités et son appartenance
    |  à son lemma) plutôt que de la modifier.
    |  !!! Ne la garder que lorsque le lemma est le même et que c'est
    |  juste une modification de mot affiché (quand un "s" a été oublié
    |  par exemple.) Donc :
    | 
    |  Si le nouveau premier mot a le même lemma que le mot actuel
    |  => changer juste le contenu (content + mot)
    |  Si le nouveau premier mot n'a pas le même lemma que le mot
    |  actuel.
    |  => Destruction profonde de cette instance et remplacement par
    |     des toutes nouvelles
    |     + Avec calcul des nouvelles longueurs.

    */

    /*
    |  Si la longueur a changé, il faut actualiser tous les offests
    |  suivant ainsi que les longueurs des paragraphes et fragments
    */

    /*
    |  GROS MORCEAU : puisque l'offset de tous les mots suivants
    |  va changer, il faudrait aussi actualiser toutes les données
    |  positions des Lemmas…
    |  Il faudrait une méthode updatePositions qui reprenne les
    |  offset des mots.
    |  Note : la dépense d'énergie me semble énorme et mériterait de
    |  se demander s'il ne faudrait pas mieux se passer de positions
    |  et fonctionner plutôt avec la liste des mots.
    */

    /*
    |  SI longueur différente : recompter les offsets des autres
    |  fragment (App.data_fragments)
    */
  }

  /**
  * Retour de TTAnalyzer::findUnknowMots appelée ci-dessus
  * 
  * @param data {Hash}
  *           data.id       : ID du mot (texel)
  *           data.tokens   : les mots relevés
  *           data.content  : le contenu initial envoyé.
  */  
  static onFindUnknownMots(data){
    const mot = Texel.getById(int(data.id))
    mot.checkAndReplaceWithContent(data)
  }

  /**
  * Remplace le contenu du mot (c'est-à-dire tout, son content comme 
  * son lemma, etc.) par les nouvelles données
  * 
  * Cette méthode n'est appelée que lorsque la proximité a été 
  * vérifiée et approuvée par l'utilisateur.
  */
  replaceContentWith(newContent){
    /*
    |   On mémorise le content actuel pour le remettre en cas 
    |   d'annulation
    */
    const oldContent = this.content
    /*
    |  TODO : sortir le nouveau mot du lemma s'il n'a pas le même 
    |         lemme.
    */    
    /*
    |   On consigne le nouveau contenu pour qu'il soit pris en 
    |   compte par la relève de l'extrait à checker. Cela actualise
    |   aussi son affichage.
    */
    this.content = newContent
    /*
    | Il peut y avoir trois sortes de contenu différents :
    | 1.  Un simple mot comme le mot précédent.
    |     => traitement normal
    | 2.  Plusieurs mots (séparés ou non par des espaces, on le
    |     sait à l'analyse).
    |     => On crée autant de mots que nécessaire
    |     => On actualise toutes les listes
    | 3.  Un nouveau paragraphe (et au moins 2 mots)
    |     => On crée le paragraphe et les mots

    /*
    |   Enregistrement dans l'historique d'annulation
    */
    // TODO Changement in CancelingManagement
  }


  /**
   * @return lemma {String} Le lemme du mot +str_mot+
   * Soit il est déjà connu est retourné tout de suite, soit il doit
   * être demandé côté serveur.
   * 
   * @param strMot {String} Le mot dont on veut le lemme
   * @param poursuivre  {Function} La fonction à appeler quand on 
   *                    l'aura obtenu, d'ici ou du serveur
   */
  static getLemmaOf(strMot, poursuivre) {
    let dLemme = this.getCountAndLemma(strMot)
    if ( dLemme ) {
      /*
      | OK il est connu 
      */
      poursuivre.call(null, [ [strMot,dLemme.type, dLemme.lemma] ])
    } else {
      /*
      | Ce mot est inconnu, il faut demander son lemme côté serveur
      */
      TextUtils.analyze(strMot, {poursuivre:poursuivre})
    }
  }

  /**
   * @return la table {:count, :lemma, :type} du mot +str_mot+ 
   * {String}
   * 
   * Cette méthode est fondamentale pour la recherche des nouvelles
   * proximité puisqu'elle permet de ne pas avoir à faire un appel
   * serveur pour obtenir le lemma du mot str_mot quand il est déjà
   * connu du texte.
   * Rappel : appeler la méthode Mot.getLemmaOf(mot) pour obtenir à
   * tous les coups ce lemme.
   */
  static getCountAndLemma(strMot){
    // console.info("this.byCountAndLemmas=", this.byCountAndLemmas)
    return this.byCountAndLemmas[strMot]
  }

  /**
   * Ajoute le mot (à l'instanciation). Cela a une double fonction :
   * 1. Ça permet de récupérer le mot par Mot.getById()
   * 2. Mais surtout, ça permet de trouver très vite un lemme lorsqu'on
   *    entre un mot déjà connu. Car la liste Mot.byCountAndLemmas
   *    possède en clé le mot et en valeur une table contenant le
   *    nombre de mots de ce type (count) et le lemme (lemma)
   * 
   * @param mot {Mot} Instance du mot tout juste instancié
   * 
   */
  static addInTableMots(mot){
    if ( undefined == this.tableMots ) {
      this.tableMots = {}
      this.byCountAndLemmas = {}
    }
    Object.assign(this.tableMots, {[mot.id]: mot})
    if ( undefined == this.byCountAndLemmas[mot.mot] ) {
      Object.assign(this.byCountAndLemmas, {[mot.mot]: {
        count: 0, type: mot.ttTag, lemma:mot.lemma
      }})
    }
    /*
    | On compte ce mot
    */
    this.byCountAndLemmas[mot.mot].count ++ 
  }


  constructor(fragment, dmot){
    super(fragment, dmot)
    this.mot = this.content
    MotType.addInTableMots(this)
  }

  // --- Public Methods ---
  get isMot(){ return true }

  /**
  * On ajoute ce text-element de type Mot aux Lemma
  */
  addToLemmas(){
    this.lemmaInstance.addMot(this)
  }
  /**
  * On retire ce texel des lemmas (destruction)
  */
  removeFromLemmas(){
    this.lemmaInstance.removeMot(this)
  }

  get lemmaInstance(){
    return this._ilemma || (this._ilemma = this.fragment.lemmas.get(this.lemma))
  }

  /**
  * Actualise les proximités du mot en les calculant
  * 
  * Cette méthode est appelée après une suppression de mot qui a 
  * supprimé une proximité ou qui peut en créer de nouvelles.
  */
  updateProximities(){
    this.lemmaInstance.defineProximitiesOf(this)
    this.showProximities()
  }

  /**
  * Affiche les proximités du mot dans le texte (avec des flèches)
  */
  showProximities(){
    // console.log("Je dois montrer les proximités de ", this)
    if ( this.hasProximities ) {
      /*
      |  Quand le mot est en proximité
      */
      this.obj.classList.add(...this.cssProximities())
    } else {
      /*
      |  Quand le mot n'est pas en proximité
      */
      this.obj.classList.remove('too-close','pxavant','pxapres')
    }
  }

  cssProximities(){
    const css = ['too-close']
    this.proxAvant && css.push('pxavant', this.proxAvant.eloignement)
    this.proxApres && css.push('pxapres', this.proxApres.eloignement)
    return css
  }

  /**
  * @return true si le mot est en proximité d'un autre
  * 
  */
  get hasProximities(){
    return !!( this.proxAvant || this.proxApres )
  }

  /* --- Affichage des informations du mot ---
  |  + Mise en exergue des mots en proximité if any
  */
  showInfos(){
    var mot, css, dis, elo, den ;
    this.showInfo('content', this.content)
    this.showInfo('occurrences', this.occurrences)
    this.showInfo('lemma', this.lemma)
    this.showInfo('tttag', this.ttTag)
    if ( this.proxAvant ) {
      ;[mot, css] = [this.proxAvant.motAvant.mot    , this.proxAvant.eloignement]
      ;[dis, elo] = [this.proxAvant.distance        , this.proxAvant.eloignement]
      den = this.proxAvant.density
      this.proxAvant.motAvant.setExergue()
    } else {
      [mot, css, dis, elo, den] = ['---', null, null, null, null]
    }
    this.showInfo('lprox-mot'     , mot, css)
    this.showInfo('lprox-dist'    , dis, css)
    this.showInfo('lprox-density' , den, css)
    if ( this.proxApres ) {
      ;[mot, css] = [this.proxApres.motApres.mot,  this.proxApres.eloignement]
      ;[dis, elo] = [this.proxApres.distance,      this.proxApres.eloignement]
      den = this.proxApres.density
      this.proxApres.motApres.setExergue()
    } else {
      [mot, css, dis, elo, den] = ['---', null, null, null, null]
    }
    this.showInfo('rprox-mot'     , mot, css)
    this.showInfo('rprox-dist'    , dis, css)
    this.showInfo('rprox-density' , den, css)

    /* Offset */
    this.showInfo('offset',     this.offset)
  }

  // --- Private Methods ---

  showInfo(key, value, css){
    const td = DGet(`#infos-texel-${key}`)
    td.innerHTML = value || '---'
    td.className = 'info'
    css && td.classList.add(css)
  }

  get occurrences(){
    return this.fragment.getLemma(this.lemma).count
  }

  get motAvant(){ return this.proxAvant ? this.proxAvant.mot : null}
  get motApres(){ return this.proxApres ? this.proxApres.mot : null}

  get css(){
    return super.getCssClasses(['ponct'])
  }

}
