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
    IO.load_from_current(path, 'proximities/item')
  end
end

class IO

  TYPE_END_ELEMENT  = LibXML::XML::Reader::TYPE_END_ELEMENT
  TYPE_TEXT         = LibXML::XML::Reader::TYPE_TEXT

class << self

  # L'instance Proximot::IO gérant l'enregistrement ou la lecture
  attr_reader :io

  ##
  # Charge séquentiellement les données du fichier Proximot (.pxw)
  # 
  # @param px_path {String} Chemin d'accès au fichier
  #
  def load_from_current(px_path, xpath)
    level1_searched, level2_searched = xpath.split('/')

    xml = LibXML::XML::Reader.file(px_path, :options => LibXML::XML::Parser::Options::NOBLANKS)

    # 
    # La table finale qui sera retournée
    # 
    table = {}

    # 
    # On boucle sur tous les noeuds du document
    # 
    begin
      while xml.read
          # next if xml.node_type == TYPE_TEXT
          # next if xml.node_type == TYPE_END_ELEMENT
          next if xml.node_type == TYPE_END_ELEMENT|TYPE_TEXT

          case xml.depth
          when 0 
            xml.name == 'proximot' || raise("Ce n'est pas un document Proximot !")
          when 1
            @level1 = xml.name # pe 'preferences' in '/proximot/preferences'
            if @level1 == level1_searched
              xml.expand.children.each do |node|
                # puts "Le noeud #{node.name} vaut #{node.content.inspect}"
                if level2_searched.nil?
                  table.merge!(node.name.to_sym => node.content)
                else
                  table.merge!(node.name => [])
                end
              end
            # *- output -*
              return table if level2_searched.nil?
            end
          when 2
            next if @level1 != level1_searched
            @level2 = xml.name
            # *- output -*
            return table if @level2 != level2_searched && table.any?
            next if level2_searched != '*' && @level2 != level2_searched
            table['item'] << xml.expand
          end
          # puts "Node de nom #{xml.name.inspect} et de depth #{xml.depth}"
        # end
      end
    ensure
      xml.close
    end
  end

  ##
  # Sauver séquentiellement les données dans le texte courant
  #
  def save_in_current(data)
    result = {ok:true, error:nil}
    data_name   = data['dataName']
    donnees     = data['data']
    type_donnes = data['dataType']
    if data_name == 'start'
      # TODO Détruire le document actuel (backup)
      @io = IO.new
      @io.start_file
    elsif data_name == 'end'
      # TODO Confirmation du bon enregistrement
      @io.end_file
      @io.close
    elsif data_name == 'start_section'
      @io.start_section(donnees)
    elsif data_name == 'end_section'
      @io.end_section(donnees)
    else
      puts "Data pour la sauvegarde de : #{data_name} (type #{type_donnes}) :\n#{donnees.pretty_inspect}"
      method = case type_donnes
        when 'simple_object'
          :add_as_simple_object
        when 'simple_list'
          :add_as_list
        when 'list_of_objects'
          # :add_as_list_with_objects
          :add_as_array
        when 'complex'
          :add_as_complex
        end
      @io.send(method, data_name, donnees)
    end
  rescue Exception => e
    result = {ok:false, error: e.message}
  ensure
    #
    # On poursuit s'il y en a encore
    # 
    WAA.send(class:'IO', method:'onReceivedData', data:result)
  end

end #/<< self


def initialize
  
end

def start_file
  fref.puts '<?xml version="1.0"?>'+"\n<proximot>"
end

def end_file
  fref.puts '</proximot>'
end

def start_section(section_name)
  fref.puts "\t<#{section_name}>"
  @added_indent = 1
end
def end_section(section_name)
  fref.puts "\t</#{section_name}>"
  @added_indent = 0
end

def close
  fref.close
end

def added_indent
  @added_indent ||= 0
end

##
# Pour l'enregistrement de données complexe
# Note : peut-être que cette méthode sera utilisable pour toutes les
# données.
def add_as_complex(dname, data, indent = 1)
  indent += added_indent
  fref.puts "#{"\t" * indent}<#{dname}>"
  case data
  when Array
    #
    # Liste de données
    #
    add_as_array(data, indent + 1)

  when Hash
    #
    # Objet
    #
    add_as_object(data, indent + 1)

  end
  fref.puts "#{"\t" * indent}</#{dname}>"
end

def add_as_array(data, indent, params = nil)
  params ||= {}
  sous_element_name = if params.key?(:sous_element_name)
      params[:sous_element_name]
    else
      'item'
    end
  data.each_with_index do |sdata, idx|
    fref.puts "#{"\t" * indent}<#{sous_element_name} index=\"#{idx}\">"
    case sdata
    when Hash   then add_as_object(sdata, indent + 1)
    when Array  then add_as_array(sdata, indent + 1)
    else
      puts "Je ne sais pas comment traiter une donnée de type #{sdata.class} dans add_as_array"
    end
    fref.puts "#{"\t" * indent}</#{sous_element_name}>"
  end
end
def add_as_object(data, indent)
  data.each do |key, value|
    case value
    when Hash   then
      fref.puts "#{"\t" * indent}<#{key}>"
      add_as_object(value, indent + 1)
      fref.puts "#{"\t" * indent}</#{key}>"
    when Array  then
      fref.puts "#{"\t" * indent}<#{key}>"
      if key.end_with?('s')
        params = {sous_element_name: key[0..-2]}
      else
        params = nil
      end
      add_as_array(value, indent + 1, params)
      fref.puts "#{"\t" * indent}</#{key}>"
    else add_as_key_value(key, value, indent + 1)
    end
  end
end
def add_as_key_value(key, value, indent)
  fref.puts "#{"\t" * indent}<#{key}>#{value}</#{key}>"
end




##
# Pour l'enregistrement de données à double niveau
def add_as_list_with_objects dname, data
  fref.puts "\t<#{dname}>"
  unless data.nil?
    data.each_with_index do |ditem, idx|
      fref.puts"\t\t<item Index=\"#{idx}\">"
      ditem.each do |k, v|
        fref.puts "\t\t\t<#{k}>#{v}</#{k}>"
      end
      fref.puts"\t\t</item>"
    end
  end
  fref.puts "\t</#{dname}>"
end

def add_as_list dname, data
  fref.puts "\t<#{dname}>"
  unless data.nil?
    data.each_with_index do |v, idx|
      fref.puts "\t\t<item Index=\"#{idx}\">#{v}</item>"
    end
  end
  fref.puts "\t</#{dname}>"  
end
def add_as_simple_object dname, data
  fref.puts "\t<#{dname}>"
  unless data.nil?
    data.each do |k, v|
      fref.puts "\t\t<#{k}>#{v}</#{k}>"
    end
  end
  fref.puts "\t</#{dname}>"
end

def fref
  @fref ||= begin
    p = File.join(CURRENT_FOLDER,'essai_proximot.pxw')
    File.delete(p) if File.exist?(p)
    File.open(p,'a')
  end
end


end #/class IO
end #/module Proximot
