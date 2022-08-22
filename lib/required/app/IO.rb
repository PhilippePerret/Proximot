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

  # L'instance Proximot::IO gérant l'enregistrement
  attr_reader :io

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
    else
      puts "Data pour la sauvegarde de : #{data_name} (type #{type_donnes}) :\n#{donnees.pretty_inspect}"
      method = case type_donnes
        when 'simple_object'
          :add_as_simple_object
        when 'simple_list'
          :add_as_list
        when 'list_of_objects'
          :add_as_list_with_objects
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

def close
  fref.close
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
