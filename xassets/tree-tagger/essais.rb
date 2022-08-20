#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  
  Pour faire des essais avec Tree-tagger

=end

TREE_TAGGER = File.join('/Applications','Tree-tagger','bin','tree-tagger')
TT_PARAM_FILE = File.join('/Applications','Tree-tagger','lib','french.par') 

TT_COMMAND = "#{TREE_TAGGER} #{TT_PARAM_FILE}"

TEXT = "Mon texte pour voir c'est-à-dire pour aujourd'hui c'est l'été ça va bien !\nMais il faut voir (ou entendre)."

WS = Regexp.new('[[:blank:]]+')

puts `echo "#{TEXT.split(WS).join("\n")}" | #{TT_COMMAND} -token -lemma`
exit 0

# Characters only in the role of splittable prefixes.
SIMPLE_PRE = ['¿', '¡']

SPEC_CHARS = ['@','©']

# Characters only in the role of splittable suffixes.
SIMPLE_POST = ['!', '?', ',', ':', ';', '.']

# Characters as splittable prefixes with an optional matching suffix.
PAIR_PRE = ['(', '{', '[', '<', '«', '„']

# Characters as splittable suffixes with an optional matching prefix.
PAIR_POST = [')', '}', ']', '>', '»', '“']

# Characters which can be both prefixes AND suffixes.
PRE_N_POST = ['"', "'"]

SPLITTABLES = SIMPLE_PRE + PAIR_PRE + PAIR_POST + PRE_N_POST + SPEC_CHARS
SPLITABLES_PATTERN_OUT = Regexp.new("[^#{Regexp.escape(SPLITTABLES.join)}]+")
SPLITABLES_PATTERN = Regexp.new("[#{Regexp.escape(SPLITTABLES.join)}]+")

def tokenize(text)
  tokens = text.chomp.strip.split(WS)
  return [''] if tokens.empty?
  output = []
  tokens.each do |token|
    prefix, stem, suffix = token.partition(SPLIT_PATTERN)
    # output << prefix.split('') unless prefix.empty?
    output << prefix unless prefix.empty?
    output << stem unless stem.empty?
    output << suffix unless suffix.empty?
    # output << suffix.split('') unless suffix.empty?
  end

  output.flatten
end

puts tokenize(TEXT)
