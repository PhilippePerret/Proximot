# encoding: UTF-8
=begin

  class Proximot::IO
  ------------------
  Pour l'enregistrement des données et principalement l'enregistrement
  du texte courant.

=end
module Proximot
class IO
class << self

  ##
  # Charge séquentiellement les données du fichier Proximot (.pxw)
  # 
  # @param data {Hash} Données pour le chargement
  #        data['prox_path'] {String} Chemin d'accès au fichier .pxw
  #
  def load_from_package(data)
    package = PXWPackage.new(
      prox_path:  data['prox_path'], 
      text_path:  data['text_path']
    )
    data.merge!(
      loadData:   package.send("load_#{data['loading_step']}".to_sym, data)
    )
    WAA.send(class:'IO', method:'loadAllFromPackage', data: data)
  rescue Exception => e
    puts e.message.rouge
    puts e.backtrace.join("\n").rouge
    WAA.send(class:'App', method:'onError', data:{message:"[IO.rb#load_from_package] #{e.message}", backtrace:e.backtrace})
  ensure
    return true # mettre false pour lancer l'application
  end

  def load_from_text(data)
    WAA.send(
      class:  'IO',
      method: 'loadAllFromText', 
      data:   get_first_fragment_analyzed(data['text_path'])
    )
  rescue Exception => e
    puts e.message.rouge
    puts e.backtrace.join("\n").rouge
    WAA.send(class:'App', method:'onError', data:{message:"[IO.rb#load_from_text] #{e.message}", backtrace:e.backtrace})
  end

  ##
  # Sauver séquentiellement les données dans le texte courant
  #
  def save_current(data)
    result = {ok:true, error:nil, saving_step:data['saving_step']}
    # puts "save courant avec data #{data.pretty_inspect}"

    # 
    # Le package du texte (qui n'est pas encore forcément prêt)
    # 
    package = PXWPackage.new(prox_path:data['prox_path'], text_path:data['text_path'])
    package.reset_errors
    #
    # Si le package du texte n'est pas encore préparé, il faut le
    # préparer. C'est un dossier qui contiendra tous les fichiers
    # Proximot.
    # 
    unless package.ready?
      puts "* Préparation du package pour le texte #{package.filename}".bleu
      package.prepare
      data.merge!('prox_path' => package.prox_path)
      puts "Préparation du package exécuté avec succès.".vert
    end

    #
    # On peut maintenant sauver les données (préférences, ou mots,
    # etc.)
    # 
    package.send("save_#{data['saving_step']}".to_sym, data['data'])

    #
    # En cas d'erreur
    # 
    if package.errors.any?
      result.merge!(ok:false, message: "Des erreurs sont survenues (voir la console Terminal)")
    end

  rescue Exception => e
    result[:ok] = false
    result[:message] = "#{e.message} (voir la console Terminal)"
    puts e.message.rouge
    puts e.backtrace.join("\n").rouge
  ensure
    #
    # On poursuit (s'il y en a encore et sauf en cas d'erreur)
    # 
    data.merge!(
      'saving_step' => data['next_step'],
      'next_step'   => nil,
      'result'      => result
    )
    WAA.send(class:'IO', method:'saveAll', data:data)
  end


private


  ##
  # Procède à l'analyse du premier fragment de texte contenu dans 
  # le fichier de chemin +path+
  # 
  # @return L'analyse
  def get_first_fragment_analyzed(path)
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
    # Taille du fichier (pour savoir comment il va falloir le
    # découper — ou pas)
    # 
    file_size = File.size(path).freeze

    # 
    # Le texte doit-il être fragmenté ?
    # 
    if file_size > App::MAX_FRAGMENT_SIZE
      # Pour avoir juste quelques paragraphes :
      # text_fragment = File.read(path, 400)

      # 
      # On récupère juste le nombre nécessaire de caractères
      text_fragment = File.read(path, App::MAX_FRAGMENT_SIZE)
      last_break    = text_fragment.rindex(/[\.\n]/)
      text_fragment = text_fragment[0..last_break]

    else

      # 
      # Pour un texte court (< 10 pages)
      # 
      text_fragment = File.read(path)
    
    end
    #
    # Les données du premier fragment
    # 
    params.merge!(
      text_path:        path,
      prox_path:        nil,
      fragment_index:   0,
      fragment_offset:  0,
      fragment_length:  text_fragment.length,
      other_fragments:  text_fragment.length < file_size
    )
    # 
    # On procède à l'analyse et on retourne le fragment analysé,
    # sous forme de données fragment telles que Proximot pourra les
    # utiliser côté client.
    # 
    return TTAnalyzer.new.analyzeAsFragment(text_fragment, params)
  end

end #/<< self


end #/class IO
end #/module Proximot
