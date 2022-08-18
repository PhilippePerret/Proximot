# encoding: UTF-8
module Proximot
class App
class << self

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
