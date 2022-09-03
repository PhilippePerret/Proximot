# encoding: UTF-8


text = "PREMIER ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quam massa, elementum a tincidunt auctor, pretium ac lacus. Fusce vitae tortor sit amet nunc tristique vehicula eu vel purus. Nulla id eros quam. Sed malesuada, diam eget suscipit imperdiet, diam orci malesuada ex, ac venenatis mauris urna nec nunc. Vivamus nec sagittis ipsum. Integer scelerisque tristique eleifend. Nulla in pretium velit, et maximus neque. Nunc ut varius ante. Ut sed commodo magna. Integer scelerisque lorem id porta varius. Etiam scelerisque ante et tellus condimentum, vitae accumsan orci bibendum.

"

text_epured = text.gsub(/[^A-Za-z ]/,'')

offset = 0
total  = 0
text_epured.split(' ') do |mot|
  total += mot.length
  puts mot.ljust(20) + mot.length.to_s.ljust(10) + offset.to_s.ljust(10) + total.to_s
  offset = total
end
