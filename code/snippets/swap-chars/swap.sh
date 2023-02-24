# strategy: replace in series
# using placeholder
function swap_chars() {
    local str="$1"
    local char1="$2"
    local char2="$3"
    local tmp="$4"
    if [[ "$tmp" == "" ]]; then
      tmp="¢"
    fi
    str="${str//${char1}/${tmp}}"
    str="${str//${char2}/${char1}}"
    str="${str//${tmp}/${char2}}"
    echo "$str"
}

# prints @rolling_codes
echo $(swap_chars "@rollind_coges" "d" "g")
# prints 769230 in binary
echo $(swap_chars "1000100001100110001" "0" "1")