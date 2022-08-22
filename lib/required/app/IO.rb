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

  # L'instance Proximot::IO gérant l'enregistrement ou la lecture
  attr_reader :io

  ##
  # Charge séquentiellement les données du fichier Proximot (.pxw)
  # 
  def load_from_current(options = nil)
    
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
          :add_as_list_with_objects
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
