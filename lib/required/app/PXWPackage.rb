# encoding: UTF-8
=begin
  
  class PXWPackage
  ----------------
  Gestion du package d'un texte proximo


=end
module Proximot
class PXWPackage

  attr_reader :text_path, :prox_path

  def initialize(data)
    @text_path = data[:text_path]
    @prox_path = data[:prox_path] 
  end

  # --- Public Methods ---

  ##
  # @return true si le package du texte est prêt
  # 
  def ready?
    prox_path && File.exist?(prox_path) && File.directory?(prox_path)
  end

  ##
  # Prépare le dossier du package (le package, donc)
  #
  def prepare
    @prox_path ||= set_prox_path_from_text_path
    mkdir(@prox_path)
    #
    # On fait toujours une copie du texte original dans ce package
    # 
    FileUtils.copy(text_path, File.join(prox_path,'text-origin.txt'))

    return true
  end


  # --- Public Saving/Loading Methods ---

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
    frag_data   = data['data']
    texels      = data['texels']
    proxis      = data['proximities']
    frag_folder = folder_fragment_index(frag_data['fragmentIndex'])
    #
    # Enregistrement des données du fragment
    # 
    File.write(File.join(frag_folder,'data.yml'), frag_data.to_yaml)  
    #
    # Enregistrement des text-elements du fragment
    # 
    puts "texels: #{texels.inspect}::#{texels.class}"
    puts "Premier élément : #{texels.first}::#{texels.first.class}"
    puts "Comme csv : #{texels.first.to_csv.inspect}"
    File.open(File.join(frag_folder,'texels.csv'),'wb') do |f|
      texels.each do |row|
        f << row.to_csv
      end
    end
    # 
    # Enregistrement des proximités du fragment
    # 
    File.write(File.join(frag_folder,'proximities.csv'), proxis.to_csv)
  end

  def load_current_fragment(frag_index)
    frag_folder = folder_fragment_index(frag_data['fragmentIndex'], false)
    File.exist?(frag_folder) || raise("Le dossier du fragment ##{frag_index} est introuvable.")
    
    puts "Je dois apprendre à lire un fragment".jaune
  end

  def filename
    @filename ||= File.basename(text_path || prox_path)
  end

private

  # --- Loading/Saving Private Methods ---

  ##
  # Méthode générique permettant de sauver les données +data+ dans le
  # fichier de nom +filename+ dans le dossier Proximot courant.
  #
  def save_as_yaml_in(data, filename)
    File.write(File.join(prox_path,filename), data.to_yaml)
  end

  ##
  # Méthode générique permettant de lire les données YAML dans le
  # fichier de nom +filename+
  # 
  def load_as_yaml_from(filename)
    YAML.load_file(File.join(prox_path,filename))
  end

  # --- Paths Methods ---

  ##
  # @return {String} Chemin d'accès au dossier de données du fragment
  # d'index +frag_index+ en le créant si nécessaire.
  # 
  # @param frag_index {Integer} Index du fragment de texte
  # @param make_dir   {Boolean} Pour indiquer de fabriquer le dossier
  #                   s'il n'existe pas.
  def folder_fragment_index(frag_index, makedir_if_needed = true)
    fo = File.join(prox_path,'fragments',"fragment-#{frag_index}")
    mkdir(fo) if makedir_if_needed
    return fo
  end

  ##
  # @return {String} Chemin d'accès au package
  def set_prox_path_from_text_path
    return File.join(folder,"#{affixe}.pxw")
  end

  def affixe
    @affixe ||= begin
      File.basename(filename, File.extname(filename))
    end
  end

  def folder
    @folder ||= File.dirname(text_path || prox_path)
  end


end #/class PXWPackage
end #/module Proximot
