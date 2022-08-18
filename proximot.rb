#!/usr/bin/env ruby
# encoding: UTF-8
begin
  require_relative 'lib/required'
  Proximot::App.load
rescue Exception => e
  puts"\033[0;91m#{e.message + "\n" + e.backtrace.join("\n")}\033[0m"
end
