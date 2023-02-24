// strategy: build new string
// char-by-char
func swapChars(in str: String, swapping char1: Character, with char2: Character) -> String {
  var newStr = ""
  for char in str {
    if char == char1 {
      newStr.append(char2)
    } else if char == char2 {
      newStr.append(char1)
    } else {
      newStr.append(char)
    }
  }
  return newStr
}

// prints @rolling_codes
print(
  swapChars(in: "@roccing_lodes", swapping: "c", with: "l"))
// prints 1618 in binary
print(
  swapChars(in: "1111100110101101", swapping: "0", with: "1"))