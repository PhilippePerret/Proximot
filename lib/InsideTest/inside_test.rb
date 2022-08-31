# encoding: UTF-8


module Proximot
class InsideTest
class << self

  ##
  # Méthode générale permettant de charger un texte
  #
  # Note : tous les tests se trouvent dans xassets/InsideTest/textes/
  def load_text(data)
    puts "data reçues : #{data.pretty_inspect}".bleu
    filename = data['path']
    filepath = File.join(folder_textes, filename)

    data.merge!(filepath: filepath, result:{ok:true, error:nil})
    WAA.send(class:'IT_WAA', method:'receive', data:data)
  end


  def folder_textes
    @folder_textes ||= File.join(APP_FOLDER,'xassets','InsideTest','textes')
  end
end #/ << self class InsideTest
end #/ class InsideTest
end #/ module Proximot
