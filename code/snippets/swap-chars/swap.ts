// strategy: use regex with
// js lambda functions 
function swapChars(str: string, a: string, b: string) {
  return str.replace(
    new RegExp(`${a}|${b}`, 'g'), 
    ($0) => $0 === a ? b : a);
}

// prints @rolling_codes
console.log(
  swapChars(swapChars(swapChars(
    '@gillons_cider', 
      's', 'g'), 
        'r', 's'), 
          'o', 'i'));
// prints 69 in binary
console.log(
  swapChars('1111111110111010', '0', '1'));