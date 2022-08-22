# encoding: UTF-8
require 'nokogiri'

require_relative 'required/constants'


def require_folder(path)
  Dir["#{path}/**/*.rb"].each{|m|require(m)}
end

require_folder(File.join(LIB_FOLDER,'required','system'))
require_folder(File.join(LIB_FOLDER,'required','app'))

