#!/usr/bin/env ruby
# encoding: UTF-8
begin


  # t = ' ANALYSE MUSICALE'
  # puts "trimé : #{t.strip.inspect}"
  # puts t.gsub(/ /u,' ').inspect
  # puts t.split(/ /).inspect
  # puts t.split(/ /).join(' ').split(/ /).inspect
  # exit


  require_relative 'lib/required'
  Proximot::App.run
rescue Exception => e
  puts"\033[0;91m#{e.message + "\n" + e.backtrace.join("\n")}\033[0m"
end
