import json
import os
import re

OUT = "/home/z/my-project/upload/chem2_extracted"
output = []

for i in range(1, 86):
    outfile = os.path.join(OUT, f"result_{i}.json")
    try:
        with open(outfile, 'r', encoding='utf-8') as f:
            data = json.load(f)
        content = data['choices'][0]['message']['content'].strip()
        
        # Clean up markdown code blocks
        if content.startswith('```'):
            lines = content.split('\n')
            content = '\n'.join(lines[1:-1]) if len(lines) > 2 else content
        
        # Try to fix common JSON issues
        # Replace single quotes with double quotes
        content_fixed = content.replace("'", '"')
        # Fix unquoted keys
        content_fixed = re.sub(r'(\w+)(?=\s*:)', r'"\1"', content_fixed)
        # Remove trailing commas
        content_fixed = re.sub(r',\s*([}\]])', r'\1', content_fixed)
        
        try:
            parsed = json.loads(content_fixed)
            parsed['image_number'] = i
            output.append(parsed)
        except json.JSONDecodeError:
            # Try more aggressive fixing
            try:
                # Try extracting JSON from the content
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    json_str = json_match.group()
                    json_str = json_str.replace("'", '"')
                    json_str = re.sub(r'(\w+)(?=\s*:)', r'"\1"', json_str)
                    json_str = re.sub(r',\s*([}\]])', r'\1', json_str)
                    parsed = json.loads(json_str)
                    parsed['image_number'] = i
                    output.append(parsed)
                else:
                    output.append({'image_number': i, 'raw': content, 'error': 'no JSON found'})
            except:
                output.append({'image_number': i, 'raw': content, 'error': 'JSON parse failed'})
    except Exception as e:
        output.append({'image_number': i, 'error': str(e)})

with open(os.path.join(OUT, 'all_results_compiled.json'), 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

# Print summary
success = sum(1 for r in output if 'question' in r)
failed = sum(1 for r in output if 'error' in r)
print(f"Total: {len(output)}, Success: {success}, Failed: {failed}")

# Print first 3 for verification
for r in output[:3]:
    print(json.dumps(r, indent=2, ensure_ascii=False))
