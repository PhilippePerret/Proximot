# encoding: UTF-8
module Proximot
class App
class << self

  ##
  # = main point d'entrée =
  #
  # Lance l'application
  # 
  def run
    clear
    # return if test 
    begin
      WAA.goto File.join(APP_FOLDER,'MAIN.HTML')
      WAA.run
    ensure
      WAA.driver.quit
    end
  end

  ##
  # Pour charger le texte à analyser/travailler
  #
  # C'est cette méthode qui est appelée après le lancement de l'app
  # pour charger le texte à analyser (soit en version brut, soit en
  # version déjà analysée).
  # 
  def load_text
    #
    # On cherche un texte valide à proximité…
    # 
    text_path = search_text_path
    #
    # Suivant l'extension, on lit le texte comme un document Proximot
    # ou comme un simple texte.
    # 
    if File.extname(text_path) == '.pxw'
      # 
      # Un fichier XML proximot à charger (.pxw)
      # 
      load_data = {'prox_path'=>text_path, 'loading_step'=>'app_state'}
      IO.load_from_current(load_data)

    else
      # 
      # Un fichier texte normal (.txt)
      # 
      frag_data = analyze_text_path(text_path)

      WAA.send(class:'App',method:'onReceiveFromText',data:frag_data)
    end
  end

  ##
  # Pour sauver le texte en cours
  #
  # (simple raccourci pour la méthode IO.save_)
  def save_text(data)
    # puts "-> App::save_text avec les données : #{data.pretty_inspect}".bleu
    IO.save_current(data)
  end

  ##
  # Procède à l'analyse du texte contenu dans le fichier de chemin
  # +path+
  # 
  # @return L'analyse
  def analyze_text_path(path)
    params = {}
    
    #
    # Dossier du texte
    # 
    text_folder = File.dirname(path)

    # 
    # Existe-t-il un fichier lexicon (mots propres ?)
    # 
    if File.exist?(File.join(text_folder,'lexicon.lex'))
      params.merge!(lexicon: File.join(text_folder,'lexicon.lex'))
    end

    # 
    # Le texte doit-il être fragmenté ?
    # 
    if File.size(path) > 20000 # environ 10 pages
      text_fragment = File.read(path, 20000)
      # Pour avoir juste quelques paragraphes :
      # text_fragment = File.read(path, 400)
      last_space = text_fragment.rindex(/[\. \n]/)
      text_fragment = text_fragment[0..last_space]
    else
      text_fragment = File.read(path)
    end
    #
    # Les données du fragment
    # 
    params.merge!(
      text_path:        path,
      prox_path:        nil,
      fragment_index:   0,
      fragment_offset:  0,
      fragment_length:  text_fragment.length
    )
    # 
    # On procède à l'analyse et on retourne le fragment analysé,
    # sous forme de données fragment telles que Proximot pourra les
    # analyser côté client.
    # 
    TTAnalyzer.new.analyzeAsFragment(text_fragment, params)
  end




  ##
  # Procède à l'analyse du texte +text+ (en général pas très long, 
  # environ 500 mots dont 3000 caractères)
  # C'est la méthode appelée côté client pour analyser les modifica-
  # tions apportées au passage courant, par exemple quand un mot est 
  # remplacé par un autre.
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
  # Retourne le chemin du texte à utiliser
  # On le cherche dans le dossier dans lequel a été ouvert le 
  # Terminal
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
    elsif false && (paths_pxw  = Dir["#{CURRENT_FOLDER}/*.pxw"]).count > 0 # TODO: REMETTRE
      # 
      # Pour le moment on prend le premier fichier pxw (après on 
      # pourra proposer le choix TODO)
      # 
      Object.const_set('CURRENT_FOLDER', paths_pxw.first)
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

end #/<< self
end #/class App
end #/module Proximot
