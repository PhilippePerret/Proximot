# encoding: UTF-8
=begin

  class Proximot::TTAnalyzer
  --------------------------
  Analyseur de texte.

  auto-testé
  ----------

  Module permettant d'analyser un texte à l'aide de tree-tagger.

  L'opération se fait en deux temps mêlés :

  1.  La TOKENISATION. C'est-à-dire le découpage du texte en unité que
      tree-tagger pourra reconnaitre/analyser.
  2.  La LEMMATISATION qui permet déterminer le lemme (mot canonique)
      d'un mot.

  L'opération se déroule de cette manière :

  1.  On envoie le texte préparé à tree-tagger. Préparé signifie 
      qu'il a été découpé par les "blancs" et tous les éléments ont 
      été mis les uns en dessous des autres.
  2.  Tree-tagger retourne une liste de trinômes où certains mots ont
      été marqués '<unknown>'. C'est par exemple "c'est" ou "l'été"
      ou "(parenthèse ouverte" et "fermée)", etc.
      Ils sont appelés ci-dessous les "inconnus".
      Dans la liste qui sera renvoyée, on remplace ces inconnus par
      des nil (valeur nulle en ruby).
  3.  On rassemble tous ces inconnus pour produire un texte unique
      (qui sera plus vite analysé que chaque inconnu séparément).
  4.  Une fois tous les inconnus détectés/rassemblés, on les traite
      jusqu'à obtenir des éléments textuels qu'on ne peut plus analy-
      ser.
      Cela produit une liste où chaque inconnu
      Par exemple la première liste contient les trinômes du premier 
      inconnu, la seconde liste contient les trinômes du second in-
      connu, etc.
  5.  Fort de cette liste, on peut remplacer chaque nil de la liste à
      renvoyer par sa liste de trinôme. L'indice du nil correspondant
      à l'indice dans la liste des trinômes des inconnus.


=end
module Proximot
class TTAnalyzer
  WS = Regexp.new('[[:blank:]]+')
  private_constant :WS
  TREE_TAGGER_BIN = File.join('/Applications','Tree-tagger','bin','tree-tagger')
  private_constant :TREE_TAGGER_BIN
  TT_PARAM_FILE = File.join('/Applications','Tree-tagger','lib','french.par') 
  private_constant :TT_PARAM_FILE

  TT_COMMAND = "#{TREE_TAGGER_BIN} #{TT_PARAM_FILE}"
  private_constant :TT_COMMAND

  def analyze(text, options = nil)
    tokenize(text, options)
  end

  ##
  # @return Une liste de trinome (sujet, type, lemme) du texte
  # +text+ analysé par tree-tagger, avec traitement de toutes les
  # exceptions.
  # 
  # Dans la liste, les retours chariots sont des trinomes :
  # ['BREAK', 'BREAK', 'BREAK']
  # 
  # @param text   {String} Le texte à tokenizer/analyser
  # 
  def tokenize(text, options = nil)
    # 
    # Options par défaut
    # 
    options ||= {lexicon: nil}

    # 
    # Préparation du texte
    # 
    res = tree_taggerize(prepared_text(text), options)
    # 
    # Pour mettre les éléments à retraiter
    # 
    to_retreate = []
    # 
    # Pour les textes non trouvés (à retraiter) dans un premier temps
    # 
    indice_current_unknown = 0
    # 
    # On décompose le string retourné
    # 
    premiere_liste = res.split("\n").map do |line|
      sujet, type, lemme = line.split("\t")
      next [sujet,type,lemme] unless lemme == '<unknown>'
      #
      # Si +lemme+ est <unknown>, c'est que le mot n'a pas été
      # reconnu. C'est quelque chose comme "c'est", "qu'elle", ou
      # encore "(dedans" ou "dehors)"
      # 
      # Pour ne pas traiter tous ces lemmes inconnus séparément (ça
      # prend trop de temps), on les rassemble dans une unique liste
      # traitée d'un coup. Et en attendant, on met une marque indicée
      # dans le résultat actuel
      # 
      indice_current_unknown += 1
      to_retreate << sujet
      #
      # On met nil dans la liste. Son indice (p.e. le 10e nil) per-
      # mettra de le remplacer.
      # 
      nil
    end

    puts "\n\n<<<<< Première liste :\n#{premiere_liste}\n>>>>>>>>>>>>"

    if to_retreate.empty?
      liste_finale = premiere_liste
    else
      tokens_per_unknowns = sous_tokenize(to_retreate, options)
      liste_finale  = []
      index_unknown = 0
      premiere_liste.map do |token|
        if token.nil?
          liste_finale += tokens_per_unknowns[index_unknown]
          index_unknown += 1
        else
          liste_finale << token
        end
      end
    end

    #
    # On remplace les retours chariots par des trinomes BREAK
    # 
    liste_finale = liste_finale.map do |trinome|
      if trinome[0] == RETOUR_CHARIOT
        ['BREAK', 'BREAK', 'BREAK']
      else
        trinome
      end
    end

    puts "\n\n<<<<<< liste_finale:\n#{liste_finale}\n>>>>>>>>>>>>>>"

    return liste_finale
  end

  def tree_taggerize(texte_pret, options = nil)
    options ||= {}
    opts = ['-lemma','-token']
    if options[:lexicon]
      File.exist?(options[:lexicon]) || raise("Impossible de trouver le lexicon #{options[:lexicon].inspect}")
      opts << "-lex \"#{options[:lexicon]}\""
    end
    puts "options : #{opts.join(' ')}"
    `echo "#{texte_pret}" | #{TT_COMMAND} #{opts.join(' ')}`
  end


  def parse_retour_tree_tagger(retour)
    retour.split("\n").map do |line|
      sujet, type, lemme = line.split("\t")
    end    
  end

  ##
  # Méthode qui traite la liste des tokens inconnu du premier 
  # traitement. Un token qui n'a pas été reconnu par tree-tagger
  # c'est par exemple "c'est" ou "l'été" ou "(entre parenthèses" ou
  # "encore)".
  def sous_tokenize(unknown_tokens, options)
    texte_pret = unknown_tokens.map do |unknown|
      "<UNKNOWN>\n" +
      if unknown.match?(/['’]/)
        unknown.split(/['’]/).join("'\n")
      elsif unknown.match?(SPLITABLES_PATTERN)
        split_with_splittable(unknown).join("\n")
      else
        unknown
      end +
      "\n</UNKNOWN>"
    end.join("\n")

    # 
    # Tree-tagger traite le texte préparé
    # 
    res = tree_taggerize(texte_pret, options)
    # 
    # On parse le résultat de tree-tagger pour obtenir une liste
    # de trinomes 'sujet, type, lemme'.
    # Noter qu'ici certains sujet sont des marques pour savoir où
    # commence un inconnu et où il finit
    # 
    res = parse_retour_tree_tagger(res)
    puts "res: #{res.inspect}"
    # 
    # On va faire une table avec en clé l'indice de l'inconnu et
    # en valeur ses tokens (en fait, c'est simplement un array)
    # 
    tokens_per_unknowns = []
    current_unknown     = [] # pour mettre les tokens de l'inconnu
    res.each do |trinome|
      sujet,type,lemme = trinome
      if sujet.start_with?('<UNK')
        # <= début d'un unknown
        current_unknown = []
      elsif sujet.start_with?('</UNK')
        # <= fin d'un unknown
        tokens_per_unknowns << current_unknown
      else
        current_unknown << trinome
      end
    end

    puts "\n\n<<<<< tokens_per_unknowns:\n#{tokens_per_unknowns}\n>>>>>>>>>>>>>>>>>"

    return tokens_per_unknowns
  end

  def prepared_text(text)
    sanitize_text(text).split(WS).join("\n")
  end

  def sanitize_text(text)
    # text.chomp.strip.gsub(/"/,'\\"')
    text.strip.gsub(/"/,'\\"').gsub(/\n/," #{RETOUR_CHARIOT} ")
  end

  ##
  # Pour découper le texte suivant les SPLITTABLES
  # 
  # Méthode récurrente
  #
  # Par exemple, reçoit "(entre)" et retourne ["(","entre",")"]
  # 
  def split_with_splittable(text)
    ary = []
    prefix, stem, suffix = text.partition(SPLITABLES_PATTERN)
    # puts "\n\n-> prefix: #{prefix}\n   stem  : #{stem}\n   suffix: #{suffix}"
    if prefix && prefix.match?(SPLITABLES_PATTERN)
      ary += split_with_splittable(prefix)
    else
      ary << prefix
    end
    ary << stem
    if suffix && suffix.match?(SPLITABLES_PATTERN)
      ary += split_with_splittable(suffix)
    else
      ary << suffix
    end
    return ary
  end

RETOUR_CHARIOT = "__RET#{Time.now.to_i}__"

# Characters only in the role of splittable prefixes.
SIMPLE_PRE = ['¿', '¡']

# Characters only in the role of splittable suffixes.
SIMPLE_POST = ['!', '?', ',', ':', ';', '.']

# Characters as splittable prefixes with an optional matching suffix.
PAIR_PRE = ['(', '{', '[', '<', '«', '„']

# Characters as splittable suffixes with an optional matching prefix.
PAIR_POST = [')', '}', ']', '>', '»', '“']

# Characters which can be both prefixes AND suffixes.
PRE_N_POST = ['"', "'"]

SPEC_CHARS = ['@','©']

SPLITTABLES = SIMPLE_PRE + SIMPLE_POST + PAIR_PRE + PAIR_POST + PRE_N_POST + SPEC_CHARS
# SPLITABLES_PATTERN = Regexp.new("[^#{Regexp.escape(SPLITTABLES.join)}]+")
SPLITABLES_PATTERN = Regexp.new("[#{Regexp.escape(SPLITTABLES.join)}]+")

end #/class TTAnalyzer
end #/module Proximot

if $0 == __FILE__

  require 'minitest/autorun'
  require 'minitest/color'

  puts File.expand_path('.')
  require_relative './../constants'


  class TTAnalyzerTests < MiniTest::Test

    def setup
      @skip_all = true
      @a = Proximot::TTAnalyzer.new
    end

    def test_instance
      skip "test des méthodes d'instance" if @skip_all
      assert(@a.is_a?(Proximot::TTAnalyzer))
      assert(@a.respond_to?(:analyze))
      assert(@a.respond_to?(:tokenize))
      assert(@a.respond_to?(:sanitize_text))
      assert(@a.respond_to?(:sous_tokenize))
    end

    def test_sanitize_text
      skip "test de la sanitisation du texte" if @skip_all
      [
        ['simple', 'simple'],
        ['"guillemets"', '\\"guillemets\\"'],
        ['guillemet " simple', 'guillemet \\" simple'],
        [' espaces  ', 'espaces'],
        ["retour chariot \n", "retour chariot"]
      ].each do |sujet, expected|
        assert_equal(expected, @a.sanitize_text(sujet))
      end
    end

    def test_tokenize
      skip "test divers textes complexes" if @skip_all
      [
        ['Un simple texte', [['Un','DET:ART','un'],['simple','ADJ','simple'],['texte','NOM','texte']]],
        ["C'est l'été", [["C'",'PRO:DEM','ce'],['est','VER:pres','être'],['l\'','DET:ART','le'],['été','NOM','été']]],
        [  "(texte)", [ ['(','PUN','('],['texte','NOM','texte'],[')','PUN',')'] ]  ],
        [ 'est-ce que ?', [  ['est','VER:pres','être'],['ce','PRO:DEM','ce'],['que','PRO:DEM','que'],['?','SENT','?'] ] ],
        [ 'est-elle ?', [  ['est','VER:pres','être'],['elle','PRO:pers','elle'],['?','SENT','?'] ] ],
      ].each do |sujet, expected|
        # puts "\n\n\nTEST - TRAITEMENT SUJET #{sujet.inspect}"
        assert_equal(expected, @a.tokenize(sujet))
      end
    end

    def test_special_characters
      skip "test caractères spéciaux" if @skip_all
      # TODO avec : @, &, ©, ®, €, ¥, $, *, #, £, +, -, tiret moyen, tiret long
      [   
         [   'Philippe.perret@yahoo.fr', [ ['Philippe','NAM','Philippe'],['.','NUM','.'],['perret','NOM','<unknown>'],['@','ABR','<unknown>'],['yahoo','NOM','<unknown>'],['.','SENT','.'],['fr','NOM','<unknown>'] ] ],
         [   'philippe.perret@yahoo.fr', [ ['philippe','NOM','<unknown>'],['.','NUM','.'],['perret','NOM','<unknown>'],['@','ABR','<unknown>'],['yahoo','NOM','<unknown>'],['.','SENT','.'],['fr','NOM','<unknown>'] ] ],
      ].each do |sujet, expected|
        # puts "\n\n\nTEST - TRAITEMENT SUJET #{sujet.inspect}"
        assert_equal(expected, @a.tokenize(sujet))
      end
    end

    def test_paragraphes
      skip "test des paragraphes" if @skip_all
      [
        [   "Premier paragraphe\nDeuxième paragraphe",  [["Premier", "NUM", "premier"], ["paragraphe", "NOM", "paragraphe"], ["BREAK", "BREAK", "BREAK"], ["Deuxième", "NAM", "Deuxième"], ["paragraphe", "NOM", "paragraphe"]]  ]
      ].each do |sujet, expected|
        puts "\n\n\nTEST - TRAITEMENT SUJET #{sujet.inspect}"
        assert_equal(expected, @a.tokenize(sujet))
      end
    end

    ##
    # Tests de l'utilisation d'un lexicon
    # 
    def test_lexicon
      # skip "test du lexicon" if @skip_all
      # Pour éviter les faux négatifs
      texte = "marion michel est-elle connue ?"
      resul = @a.tokenize(texte)
      assert_equal(['marion','NOM','<unknown>'], resul[0])
      resul = @a.tokenize(texte, {lexicon: File.join(lexicons_folder,'noms.lex')})
      assert_equal(['marion','NAM','Marion'], resul[0])
    end

    ##
    # Tests de l'utilisation de plusieurs lexicons
    #
    def test_plusieurs_lexicons
      skip "test de plusieurs lexicons" if @skip_all
    
    end


    # --- path ---
    def lexicons_folder
      @lexicons_folder ||= File.join(APP_FOLDER,'xassets','tree-tagger','tests','lexicons')
    end
  end

end
