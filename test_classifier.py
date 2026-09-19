import json
import re

with open('src/data/fluentArabicWords.json') as f:
    words = json.load(f)

print(f"Total words: {len(words)}")

# Check POS categories
pos_counts = {}
for w in words:
    pos_counts[w.get('posCategory')] = pos_counts.get(w.get('posCategory'), 0) + 1

print("POS categories:", pos_counts)
