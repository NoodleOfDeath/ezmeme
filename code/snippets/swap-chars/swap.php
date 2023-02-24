<?php
# strategy: use built-in 
# strtr php function
function swapChars($str, $a, $b = null) {
  $swappedString = strtr($str, 
    $b === null ? $a : 
      (strlen($a) === 1 ? $a . $b : $a), 
    $b === null ?
      (strlen($a) === 2 ? 
      strrev($a) :
      str_shuffle($a)) : 
      (strlen($b) === 1 ? $b . $a : $b)
  );
  return $swappedString;
}

# prints @rolling_codes
echo swapChars('@rodding_coles', 'dl');
# prints 666 in binary
echo swapChars('1111110101100101', 
               '0', '1');
?>

