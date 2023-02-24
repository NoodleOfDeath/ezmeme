# strategy: use built-in 
# maketrans method
def swap_chars(string, a, b):
  swapped_string = string.translate(
    str.maketrans(a + b, b + a))
  return swapped_string

# prints @rolling_codes
print(
  swap_chars('rossing_codel', 'l', 's'))
# prints 42 in binary
print(
  swap_chars(
    '1111111111010101', '0', '1'))
