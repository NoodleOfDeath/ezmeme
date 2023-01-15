-- select.sql
SELECT        
  name,       -- public.people -|
  age         -- name     | age |
FROM          -- ----------------
  people      -- alice    |  10 |
WHERE         -- bob      |   4 |
  age <= 10   -- john     |  12 |
ORDER BY
  age
  -- @cometechthis
ASC;