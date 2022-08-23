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

  # L'instance Proximot::IO gérant l'enregistrement ou la lecture
  attr_reader :io


  def read_fragment(px_path, frag_index)
    
    xml = LibXML::XML::Reader.file(px_path, :options => LibXML::XML::Parser::Options::NOBLANKS)
    # 
    # On cherche le noeud "/proximot/fragments"
    next while xml.read && not(xml.depth == 1 && xml.name == 'fragments')
    current_index = -1 # pour commencer à 0
    next while xml.read && not(xml.depth == 2 && xml.name == 'fragment' && frag_index == (current_index += 1))
    while xml.read
      next if bad_type?(xml)
      table = {}
      puts "J'ai atteint le fragment #{frag_index} du noeud fragments".vert
      fragment_id = xml.node.content
      table.merge!(id: fragment_id, paragraphs: [])
      # xml = get_next_node(xml) # paragraphs
      get_next_node(xml) # paragraphs
      xml.name == 'paragraphs' || raise('On devrait trouver le noeud <paragraphs> à cet endroit.' + " Noeud trouvé : #{xml.name}")
      puts "node #{xml.name} / depth #{xml.depth}"
      while xml.read
        next if bad_type?(xml)
        #
        # Si le noeud est un paragraphe…
        # 
        if xml.depth == 4
          # 
          # On ajoute à la table générale le paragraphe précédent
          # 
          table[:paragraphs]<< @ptable if @ptable&.any?
          # 
          # On prépare une nouvelle table pour le nouveau paragraphe
          # 
          @ptable = {index: xml.node.attributes['index'], mots: []}
          puts "Paragraphe #{xml.name} ##{xml.node.attributes['index']}"
          # 
          # Pour atteindre la balise '<mot>'
          # 
          next while xml.read && xml.name != 'mots'
          # 
          # Tant que le noeud est la balise '<mot>'
          # 
          while xml.read && xml.depth > 4
            next if bad_type?(xml)
            # 
            # Si le noeud est une balise <mot>
            #
            if xml.depth == 6
              # 
              # On enregistre le mot précédent (if any)
              # 
              @ptable[:mots] << @mtable if @mtable&.any?
              # 
              # On instancie une nouvelle table pour le nouveau mot
              # 
              @mtable = {}
              #
              # Tant que c'est la définition du mot
              # 
              while xml.read && xml.depth > 6
                next if bad_type?(xml)
                @mtable.merge!(xml.name => xml.node.content)
              end
            end
          end
          # On ajoute le dernier mot
          @ptable[:mots] << @mtable if @mtable&.any?
        end
      end
      #
      # Le dernier
      # 
      table[:paragraphs]<< @ptable if @ptable&.any?
      # xml = get_next_node(xml)
      # xml = get_next_node(xml)
      # puts "node #{xml.name}"
      return table
    end
    # 
    # On passe ici seulement si on n'a pas pu obtenir le fragment
    # 
    puts "Impossible de trouver le fragment ##{frag_index}".rouge
    return nil
  end

  def get_next_node(xml)
    xml.read
    xml.read while bad_type?(xml)
    # puts "node #{xml.name} (#{xml.node_type}) / #{xml.node.content}"
    return xml
  end
  def bad_type?(node)
    # puts "TYPE_TEXT = #{TYPE_TEXT.inspect} / #{node.node_type.inspect}"    
    BAD_TYPES.include?(node.node_type)
  end

  ##
  # Charge séquentiellement les données du fichier Proximot (.pxw)
  # 
  # @param px_path {String} Chemin d'accès au fichier
  #
  def load_from_current(px_path, xpath, idx = nil)
    @level1_searched, @level2_searched, @level3_searched = xpath.split('/')
    @index = idx

    xml = LibXML::XML::Reader.file(px_path, :options => LibXML::XML::Parser::Options::NOBLANKS)


    # --- Méthodes pour simplifier la compréhension ---


    def match_lev1_searched?(node)
      node.name == @level1_searched
    end

    def match_lev2_searched?(node)
      level1_searched? && node.depth == 2 && node.name == @level2_searched
    end

    def level1_searched?
      @level1 == @level1_searched
    end
    def not_level1_searched?
      return not(level1_searched?)
    end

    def level2_searched?
      level1_searched? && @level2 == @level2_searched
    end

    def not_level2_searched?
      not(level2_searched?)
    end

    def inspect(node)
      puts "Node #{node.name.inspect} / #{node.node.content}"
    end

    def add_table_enfant
      @table.merge!(@level1 => []) unless @table.key?(@level1)
      @table[@level1_searched] << @ctable 
      @ctable = {}
    end

    # 
    # La table finale qui sera retournée
    # 
    @table = {}

    # 
    # On boucle sur tous les noeuds du document
    # 
    begin
      while xml.read
        next if bad_type?(xml)

        # puts "xml: #{xml.name} / #{xml.node.content}"
        # next

        if xml.depth == 0
          xml.name == 'proximot' || raise("Ce n'est pas un document Proximot !")
        end

        # next if xml.node_type == TYPE_TEXT
        # next if xml.node_type == TYPE_END_ELEMENT

        # 
        # Étude d'un noeud de niveau 1 (i.e. juste en dessous de 
        # <proximot>)
        # 
        if xml.depth == 1
          @level1 = xml.name
  
          #
          # Si on change de noeud de niveau 1 et que la table est
          # définie (i.e. qu'on voulait atteindre un noeud level 1
          # avant), on retourne la table des données relevées.
          # 
          if not_level1_searched? && @table.any?
            #
            # Si on change de noeud de niveau 1 et que la table @ctable
            # est définie (table pour un enfant de liste), alors il 
            # faut l'ajouter avant de retourner la table
            # 
            add_table_enfant if @ctable&.any?
            puts "Changement de level1, je retourne la table définie.".jaune
            return @table
          else
            next
          end
        end

        #
        # On ne passe à la suite que si le noeud est un bon noeud
        # de niveau 2
        # 
        if xml.depth == 2 && level1_searched?

          # 
          # Le nouveau niveau 2
          # 
          @level2 = xml.name
          
          #
          # Si le niveau 2 du xpath n'est pas défini, c'est que les
          # données de ce niveau sont à prendre. On les met dans la
          # table.
          # 
          if not(@level2_searched)
            @table.merge!(xml.name => xml.node.content)
            next
          else
            #
            # Début d'un objet de niveau 3
            #
            add_table_enfant if @ctable&.any?
            @ctable = {}
          end
          next
        end

        if xml.depth == 3 && level2_searched?
          #
          # Les objets complexes passe par ici
          # 
          if not(@level3_searched) && not(@index)
            #
            # Une liste de sous objets qu'il faut relever entièrement
            # (sinon, il ne faudrait prendre que l'index fourni)
            # 
            @ctable.merge!(xml.name => xml.node.content)
            puts "Niveau 3 recherché (name: #{xml.name})".bleu
          end
        end

      end

      puts "Personne ne l'a fait, alors je retourne la table".jaune
      return @table # si personne ne l'a fait
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
          # :add_as_array
          :add_as_complex
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
    params = if dname.end_with?('ies')
        params = {sous_element_name: dname[0..-4]+'y'}
      elsif dname.end_with?('s')
        params = {sous_element_name: dname[0..-2]}
      end
    add_as_array(data, indent + 1, params)

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
