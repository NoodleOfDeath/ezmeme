#include <iostream>
#include <string>
using namespace std;

// strategy: mutate string
// in-place using pointers
void swapChars(string& str, char char1, char char2) {
  for (int i = 0; i < str.length(); i++) {
    str[i] = str[i] == char1 ? 
      char2 : (str[i] == char2 ? char1 : 
        str[i]);
  }
}

int main(int argc, char const *argv[]) {
  // prints @rolling_codes
  string str1 = "@rollinc_godes";
  swapChars(str1, 'c', 'g');
  cout << str1 << endl;
  // prints 314 in binary
  string str2 = "1111111011000101";
  swapChars(str2, '0', '1');
  cout << str2 << endl;
  return 0;
}
