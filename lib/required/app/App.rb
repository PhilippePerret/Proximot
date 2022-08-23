# encoding: UTF-8
module Proximot
class App
class << self

  ##
  # = main point d'entrée =
  #
  def load
    clear
    # return if test 
    begin
      WAA.goto File.join(APP_FOLDER,'MAIN.HTML')
      WAA.run
    ensure
      WAA.driver.quit
    end
  end

  def test
    pxpath = File.join(CURRENT_FOLDER,'essai_proximot.pxw')
    prox = Proximot::Document.new(pxpath)
    puts "App state : #{prox.app_state.pretty_inspect}"
    # puts "Préférences : #{prox.preferences.pretty_inspect}"
    # puts "Console history : #{prox.console_history.pretty_inspect}"
    # puts "Proximités : #{prox.proximities.pretty_inspect}"
    puts "Fragments : #{prox.fragment(prox.app_state['fragment_index'].to_i)}"

  rescue Exception => e
    puts e.message.rouge
    puts e.backtrace.join("\n").rouge  
  ensure
    return true # mettre false pour lancer l'application
  end

  ##
  # Pour charger le texte à analyser/travailler
  # 
  def load_texte(data)
    text_path = search_text_path
    if File.extname(text_path) == '.pxw'
      # 
      # Un fichier XML proximot
      # 
      load_proximot_file(text_path)
    else
      # 
      # Un fichier texte normal
      # 
      tokens = analyze_text_path(text_path)

      WAA.send(class:'App',method:'onReceiveText',data:{tokens:tokens})
    end
  end

  ##
  # Procède à l'envoi du fichier proximot
  # 
  def load_proximot_file(pxpath)
    prox = Proximot::Document.new(pxpath)
    puts "App state : #{prox.app_state.pretty_inspect}"
    WAA.send(class:'App', method:'onReceiveProximotData', data:{type:'app_state', data:prox.app_state})
    # puts "Préférences : #{prox.preferences.pretty_inspect}"
    WAA.send(class:'App', method:'onReceiveProximotData', data:{type:'preferences', data:prox.preferences})
    # puts "Console history : #{prox.console_history.pretty_inspect}"
    # puts "Proximités : #{prox.proximities.pretty_inspect}"
    puts "Fragments : #{prox.fragment(prox.app_state['fragment_index'].to_i)}"
  rescue Exception => e
    puts e.message.rouge
    puts e.backtrace.join("\n").rouge  
  ensure
    return true # mettre false pour lancer l'application
  end

  ##
  # Procède à l'analyse du texte +text+ (en général pas très long, 
  # environ 500 mots dont 3000 caractères)
  #
  # @param data {Hash}
  #             Donnée envoyée par le client, contenant la clé :text
  #             qui définit le texte à analyser.
  def analyze_text(data)
    text = data['text']
    puts "Analyse demandée du texte : #{text.inspect}".bleu
    options = {}
    #
    # S'il existe un fichier lexicon.lex, il faut le prendre en 
    # compte.
    # 
    lexicon_path = File.join(CURRENT_FOLDER,'lexicon.lex')
    if File.exist?(lexicon_path)
      options.merge!(lexicon: lexicon_path)
    end
    # 
    # On procède à l'analyse
    # 
    data = TTAnalyzer.new.analyze(text, options)
    # 
    # On la retourne au client
    # 
    WAA.send(class:'TextUtils', method:'receiveAnalyze', data:data)
  end

  ##
  # Procède à l'analyse du texte contenu dans le fichier de chemin
  # +path+
  # 
  # @return L'analyse
  def analyze_text_path(path)
    options = {}
    #
    # Dossier du texte
    # 
    text_folder = File.dirname(path)
    # 
    # Existe-t-il un fichier lexicon (mots propres ?)
    # 
    if File.exist?(File.join(text_folder,'lexicon.lex'))
      options.merge!(lexicon: File.join(text_folder,'lexicon.lex'))
    end
    # 
    # On procède à l'analyse
    # 
    analyzer = TTAnalyzer.new
    analyzer.analyze(File.read(path), options)
  end

  ##
  # Retourne le chemin du texte à utiliser
  # 
  def search_text_path
    if ARGV[0] && File.exist?(ARGV[0])
      # 
      # Par chemin d'accès absolu
      # 
      return ARGV[0]
    elsif ARGV[0] && File.exist?(File.join(CURRENT_FOLDER,ARGV[0]))
      # 
      # Par chemin relatif dans le dossier courant
      # 
      return File.join(CURRENT_FOLDER,ARGV[0])
    elsif (paths_pxw  = Dir["#{CURRENT_FOLDER}/*.pxw"]).count > 0
      # 
      # Pour le moment on prend le premier fichier pxw
      # 
      return paths_pxw.first
    elsif (paths_text = Dir["#{CURRENT_FOLDER}/*.{text,txt}"]).count == 1
      # 
      # Un seul fichier texte dans le dossier
      # 
      return paths_text.first
    elsif paths_text.count > 1
      # 
      # Il faut choisir parmi plusieurs textes
      # 
      Q.select("Quel fichier choisir ?".bleu) do |q|
        paths_text.each do |path_text|
          q.choice File.basename(path_text), path_text
        end
        q.per_page paths_text.count
      end
    else
      raise "Aucun fichier texte défini dans le dossier courant."
    end
  end

  ##
  # Pour effectuer un check de WAA
  def check(data)
    puts "J'ai bien reçu le message : #{data['msg']}"
    # `cd /Applications/Tree-tagger/;bin/tree-tagger ../lib/french.par -lemma ../essai.txt ../essai-tagged.txt`
    # res = File.read('/Application/Tree-tagger/essai-tagged.txt')
    # --- FONCTIONNE ---
    # res = `cd /Applications/Tree-tagger/;bin/tree-tagger ./lib/french.par -lemma ./essai.txt`
    # puts "res = #{res.inspect}"
    # res = res.gsub(/\t/,':::').split("\\\\n")
    # --- /FONCTIONNE ---

    res = `cd /Applications/Tree-tagger/; echo "#{data['text']}" | bin/tree-tagger ./lib/french.par -lemma`
    res = res.gsub(/\t/,':::')
    WAA.send(class:'TextUtils',method:'receiveLemma', data:{lemma:res})
  end


end #/<< self
end #/class App
end #/module Proximot
