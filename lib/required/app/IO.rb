# encoding: UTF-8
=begin

  class Proximot::IO
  ------------------
  Pour l'enregistrement des données et principalement l'enregistrement
  du texte courant.

=end
module Proximot
class Document
  attr_reader :path
  def initialize(path)
    @path = path
  end

  def app_state
    IO.load_from_current(path, 'app_state')
  end

  def preferences
    IO.load_from_current(path, 'preferences')
  end

  def console_history
    IO.load_from_current(path, 'console_history').values
  end

  def proximities
    IO.load_from_current(path, 'proximities/proximity')['proximities']
  end

  def fragment(fragIndex)
    IO.read_fragment(path, fragIndex)
  end
end

class IO

  TYPE_END_ELEMENT  = LibXML::XML::Reader::TYPE_END_ELEMENT
  private_constant :TYPE_END_ELEMENT
  TYPE_TEXT         = LibXML::XML::Reader::TYPE_TEXT
  private_constant :TYPE_TEXT
  TYPE_END_ELEMENT  = LibXML::XML::Reader::TYPE_END_ELEMENT
  BAD_TYPES = [TYPE_END_ELEMENT, TYPE_TEXT, TYPE_END_ELEMENT]
  private_constant :BAD_TYPES


class << self

  ##
  # Charge séquentiellement les données du fichier Proximot (.pxw)
  # 
  # @param px_path {String} Chemin d'accès au fichier
  #
  def load_from_current(px_path, xpath, idx = nil)

  end

  ##
  # Sauver séquentiellement les données dans le texte courant
  #
  def save_in_current(data)
    result = {ok:true, error:nil}
    self.send("save_#{data['saving_step']}".to_sym, data['data'])
  rescue Exception => e
    result = {ok:false, error: e.message}
  ensure
    #
    # On poursuit (s'il y en a encore)
    # 
    data.merge!(result.merge(saving_step: data['next_step']))
    WAA.send(class:'IO', method:'saveAll', data:data)
  end


  #
  # État de l'application
  #
  def save_app_state(data)
    save_as_yaml_in(data,'app_state.yml')
  end
  def load_app_state
    load_as_yaml_from('app_state.yml')
  end

  #
  # Préférence du texte
  #
  def save_preferences(data)
    save_as_yaml_in(data,'preferences.yml')
  end
  def load_preferences
    load_as_yaml_from('preferences.yml')
  end

  #
  # Historique des commandes console
  # 
  def save_console_history(data)
    save_as_yaml_in(data,'console_history.yml')
  end
  def load_console_history
    load_as_yaml_from('console_history.yml')
  end

  #
  # Fragment courant
  #
  def save_current_fragment(data)
    frag_data = data['data']
    texels    = data['texels']
    proxis    = data['proximities']
    frag_folder = mkdir(File.join(CURRENT_FOLDER,'fragments',"fragment-#{frag_data['fragmentIndex']}"))
    #
    # Enregistrement des données du fragment
    # 
    File.write(File.join(frag_folder,'data.yml'), frag_data.to_yaml)  
    #
    # Enregistrement des text-elements du fragment
    # 
    File.write(File.join(frag_folder,'texels.csv'), texels.to_csv)
    # 
    # Enregistremetn des proximités du fragment
    # 
    File.write(File.join(frag_folder,'proximities.csv'), proxis.to_csv)
  end

  def load_current_fragment(frag_index)
    frag_folder = mkdir(File.join(CURRENT_FOLDER,'fragments',"fragment-#{frag_data['fragmentIndex']}"))
    File.exist?(frag_folder) || raise("Le dossier du fragment ##{frag_index} est introuvable.")
    
    puts "Je dois apprendre à lire un fragment".jaune
  end



  ##
  # Méthode générique permettant de sauver les données +data+ dans le
  # fichier de nom +filename+ dans le dossier Proximot courant.
  #
  def save_as_yaml_in(data, filename)
    File.write(File.join(CURRENT_FOLDER,filename), data.to_yaml)
  end


  ##
  # Méthode générique permettant de lire les données YAML dans le
  # fichier de nom +filename+
  # 
  def load_as_yaml_from(filename)
    YAML.load_file(File.join(CURRENT_FOLDER,filename))
  end

end #/<< self


end #/class IO
end #/module Proximot
