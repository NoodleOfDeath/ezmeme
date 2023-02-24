# strategy: chain method
# calls with placeholder
def swap_chars(str, char1, char2, temp = '¢')
  str.gsub(char1, temp)
    .gsub(char2, char1)
    .gsub(temp, char2)
end

# prints @rolling_codes
puts swap_chars('@lorring_codes', 'l', 'r')
# prints 2520 im binary
puts swap_chars('1111011000100111', '1', '0')