import json
import os
import re

OUT = "/home/z/my-project/upload/chem2_extracted"
COMPILED = os.path.join(OUT, 'all_results_compiled.json')

with open(COMPILED, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find failed ones
failed_indices = [r['image_number'] for r in data if 'error' in r or 'raw' in r]
print(f"Failed images: {failed_indices}")

# Try to manually parse the raw content for those with 'raw' field
for r in data:
    if 'raw' in r and 'error' in r:
        raw = r['raw']
        # Try to extract question and options manually
        try:
            # Try finding JSON-like structure
            json_match = re.search(r'\{.*\}', raw, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                # Various fixes
                json_str = json_str.replace('\n', ' ')
                # Replace smart quotes
                json_str = json_str.replace('\u201c', '"').replace('\u201d', '"')
                json_str = json_str.replace('\u2018', '"').replace('\u2019', '"')
                # Try parsing
                try:
                    parsed = json.loads(json_str)
                    if 'question' in parsed:
                        r.clear()
                        r.update(parsed)
                        r['image_number'] = len([x for x in data if data.index(x) < data.index(r)])
                except:
                    pass
        except:
            pass

# Save updated
with open(COMPILED, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Print remaining failures
remaining_failed = [r for r in data if 'question' not in r]
print(f"Still failing: {len(remaining_failed)}")
for r in remaining_failed:
    print(f"  Image {r.get('image_number', '?')}: {r.get('error', 'unknown')}")
    if 'raw' in r:
        print(f"    Raw: {r['raw'][:200]}")
