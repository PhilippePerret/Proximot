# encoding: UTF-8
=begin
  
  class PXWPackage
  ----------------
  Gestion du package d'un texte proximo


=end
module Proximot
class PXWPackage

  attr_reader :text_path, :prox_path
  attr_reader :errors

  def initialize(data)
    @text_path = data[:text_path]
    @prox_path = data[:prox_path] 
  end

  # --- Public Methods ---

  def reset_errors
    @errors = []
  end

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
  def load_app_state(data) # data useless (pour simplifier)
    load_as_yaml_from('app_state.yml')
  end

  #
  # Préférence du texte
  #
  def save_preferences(data)
    save_as_yaml_in(data,'preferences.yml')
  end
  def load_preferences(data)  # data useless (pour simplifier)
    load_as_yaml_from('preferences.yml')
  end

  #
  # Historique des commandes console
  # 
  def save_console_history(data)
    save_as_yaml_in(data,'console_history.yml')
  end
  def load_console_history(data)  # data useless (pour simplifier)
   @errors ||= []
   load_as_yaml_from('console_history.yml')
  end

  #
  # Enregistrement des données d'un fragment
  #
  # @param data {Hash} Données du fragment
  #    data['data']        Les métadonnées (index, paragraphes, etc.)
  #    data['texels']      Les text-elements
  #    data['proximities'] Les données des proximités
  # 
  def save_current_fragment(data)
    fg_data  = data['metadata'] # "fg" pour "fragment"
    fg_index = fg_data['fragmentIndex']
    #
    # Enregistrement des données du fragment
    # 
    save_as_yaml_in(fg_data, rfile_in_fragment(fg_index, 'metadata.yml'))
    #
    # Enregistrement des text-elements du fragment
    # 
    save_as_csv_in(data['texels'], rfile_in_fragment(fg_index, 'texels.csv'))
    # 
    # Enregistrement des proximités du fragment
    # 
    save_as_csv_in(data['proxis'], rfile_in_fragment(fg_index, 'proxis.csv'))
  end

  def load_current_fragment(data)
    puts "data: #{data.inspect}".jaune
    fg_index = data['fragment_index']
    return {
      'metadata'=> load_as_yaml_from(rfile_in_fragment(fg_index, 'metadata.yml')),
      'texels'  => load_as_csv_from(rfile_in_fragment(fg_index,  'texels.csv')),
      'proxis'  => load_as_csv_from(rfile_in_fragment(fg_index,  'proxis.csv'))
    }
  end

  def filename
    @filename ||= File.basename(text_path || prox_path)
  end

private

  # --- Loading/Saving Private Methods ---

  def save_as_csv_in(data, filename)
    error_occurs = false
    File.open(File.join(prox_path,filename),'wb') do |f|
      data.each do |row| 
        begin
          f << row.to_csv 
        rescue Exception => e
          error_occurs = true
          @errors << e
          puts "[save_as_csv_in #{filename}] Problème avec la rangée (row) : #{row.inspect}"
          puts "Message d'erreur (line #{e.backtrace.first.split(':')[-2]}) : #{e.message}"
        end
      end
    end
    if error_occurs
      balise = Time.now.to_i.to_s[-4..-1]
      puts "[#{balise}] Une erreur est survenue sur les données suivantes : #{data.pretty_inspect}\n[/#{balise}] #{'#'*40}".rouge
    end
  end
  # @return {Array of Strings}
  def load_as_csv_from(filename)
    CSV.read(File.join(prox_path,filename))
  end

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
  # @return le chemin absolu du fichier de nom +filename+ pour le
  # fragment d'index +fb_index+
  # 
  # Cf. le manuel développeur pour voir la hiérarchie des ficheirs 
  # dans un dossier pxw
  # 
  def rfile_in_fragment(fg_index, filename)
    return File.join(rfolder_fragment_index(fg_index), filename)  
  end

  ##
  # @return {String} Chemin d'accès RELATIF au dossier de données du
  # fragment d'index +fg_index+ en le créant si nécessaire.
  # 
  # @param fg_index {Integer} Index du fragment de texte
  # @param make_dir   {Boolean} Pour indiquer de fabriquer le dossier
  #                   s'il n'existe pas.
  def rfolder_fragment_index(fg_index, makedir_if_needed = true)
    fo = File.join('fragments',"fragment-#{fg_index}")
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
