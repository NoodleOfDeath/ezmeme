#!/usr/bin/env python3
emotes = {
  "poop": "💩",
  "fire": "🔥", 
  "dead": "☠️",
  "gasp": "😱",
  # @cometechthis
  "happy": "☺️",
} 
print("".join([v if len(k) < 5 else k for k, v in emotes.items()]))