# encoding: UTF-8
module Proximot
class App
class << self

  ##
  # Pour effectuer un check de WAA
  def check(data)
    puts "J'ai bien reçu le message : #{data['msg']}"
    # `cd /Applications/Tree-tagger/;bin/tree-tagger ../lib/french.par -lemma ../essai.txt ../essai-tagged.txt`
    # res = File.read('/Application/Tree-tagger/essai-tagged.txt')
    # --- FONCTIONNE ---
    # res = `cd /Applications/Tree-tagger/;bin/tree-tagger ./lib/french.par -lemma ./essai.txt`
    # puts "res = #{res.inspect}"
    # res = res.gsub(/\t/,':::').split("\\\\n")
    # --- /FONCTIONNE ---

    res = `cd /Applications/Tree-tagger/; echo "#{data['text']}" | bin/tree-tagger ./lib/french.par -lemma`
    res = res.gsub(/\t/,':::')
    WAA.send(class:'TextUtils',method:'receiveLemma', data:{lemma:res})
  end

  def load
    # puts "Je dois apprendre à charger Proximot.".jaune
    clear
    WAA.goto File.join(APP_FOLDER,'MAIN.HTML')
    WAA.run
  ensure
    WAA.driver.quit
  end

end #/<< self
end #/class App
end #/module Proximot
