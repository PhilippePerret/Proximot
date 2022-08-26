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
  # @param prox_path {String} Chemin d'accès au fichier
  #
  def load_from_current(data)
    puts "\n\n-> load_from_current(data) avec data: #{data.pretty_inspect}"
    data = IO.send("load_#{data['loading_step']}".to_sym)
    WAA.send(class:'App', method:'onReceiveProximotData', data: data.merge!(data:data))
  rescue Exception => e
    puts e.message.rouge
    puts e.backtrace.join("\n").rouge
    WAA.send(class:'App', method:'onError', data:{message:"[App.rb#load_proximot_file] #{e.message}", backtrace:e.backtrace})
  ensure
    return true # mettre false pour lancer l'application
  end

  ##
  # Sauver séquentiellement les données dans le texte courant
  #
  def save_current(data)
    result = {ok:true, error:nil, saving_step:data['saving_step']}
    # 
    # Le package du texte (qui n'est pas encore forcément prêt)
    # 
    package = PXWPackage.new(prox_path:data['prox_path'], text_path:data['text_path'])
    #
    # Si le package du texte n'est pas encore préparé, il faut le
    # préparer. C'est un dossier qui contiendra tous les fichiers
    # Proximot.
    # 
    unless package.ready?
      puts "* Préparation du package pour le texte #{package.filename}".bleu
      package.prepare
      data.merge!('prox_path' => package.prox_path)
    end

    #
    # On peut maintenant sauver les données (préférences, ou mots,
    # etc.)
    # 
    package.send("save_#{data['saving_step']}".to_sym, data['data'])
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






end #/<< self


end #/class IO
end #/module Proximot
