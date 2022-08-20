# encoding: UTF-8
module Proximot
class App
class << self

  ##
  # Pour charger le texte à analyser/travailler
  # 
  def load_texte(data)
    text_path = search_text_path
    if File.extname(text_path) == '.pxw'
      # 
      # Un fichier XML proximot
      # 
      raise "Je ne sais pas encore traiter les fichier .pxw"
    else
      # 
      # Un fichier texte normal
      # 
      tokens = analyze_text_path(text_path)
    end
    WAA.send(class:'App',method:'onReceiveText',data:{tokens:tokens})
  end

  ##
  #
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

  def load
    clear
    WAA.goto File.join(APP_FOLDER,'MAIN.HTML')
    WAA.run
  ensure
    WAA.driver.quit
  end

end #/<< self
end #/class App
end #/module Proximot
