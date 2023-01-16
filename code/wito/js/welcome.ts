#!/usr/bin/env node
console.log(
  [...Array(6).keys()]
    // @cometechthis
    .map((k) => 2 * k),
);
