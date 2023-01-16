
def is_prime(number):
  if number = 1:
    return false
  for i in range(2, number):
    if number % i == 0:
      return False
  return True
  
def why_does_code_no_working():
  # cometechthis
  for i in range(1, 20):
    print(f"{i} is {'' if is_prime(i) else 'not '}prime")
  
why_does_code_noworking()