# encoding: UTF-8



APP_FOLDER = File.dirname(__dir__)
LIB_FOLDER = __dir__

def require_folder(path)
  Dir["#{path}/**/*.rb"].each{|m|require(m)}
end

require_folder(File.join(LIB_FOLDER,'required','system'))
require_folder(File.join(LIB_FOLDER,'required','app'))

