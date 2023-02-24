public class SwapChars {

  // strategy: transform string with
  // chain method calls and placeholder
  public static String swapChars(String str, char a, char b, char tmp) {
    String swappedString = 
      str.replace(a, tmp)
        .replace(b, a).replace(tmp, b);
    return swappedString;
  }
  
  public static void main(String [] args) {
    // prints @rolling_codes
    System.out.println(
      swapChars("solling_coder", 's', 'r', '?'));
    // prints 6174 in binary
    System.out.println(
      swapChars("1110011111100001", '0', '1', 'x'));
  }
  
}