import subprocess
import json
import os
import glob
import concurrent.futures

DIR = "/home/z/my-project/upload/chem2_extracted/chem 2"
OUT = "/home/z/my-project/upload/chem2_extracted"

def analyze_image(i):
    pattern = os.path.join(DIR, f"photo_{i}_*.jpg")
    files = glob.glob(pattern)
    if not files:
        return i, None, "File not found"
    
    filepath = files[0]
    outfile = os.path.join(OUT, f"result_{i}.json")
    
    # Check if already processed
    if os.path.exists(outfile) and os.path.getsize(outfile) > 100:
        try:
            with open(outfile) as f:
                data = json.load(f)
            content = data['choices'][0]['message']['content']
            return i, content, "cached"
        except:
            pass
    
    prompt = 'This is a chemistry test question. Extract the question and all answer options (A,B,C,D). Identify the correct answer if marked. Return ONLY valid JSON: {"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A"}. If correct answer unknown set correct to null.'
    
    try:
        result = subprocess.run(
            ['z-ai', 'vision', '-p', prompt, '-i', filepath, '-o', outfile],
            capture_output=True, text=True, timeout=30
        )
        if os.path.exists(outfile):
            with open(outfile) as f:
                data = json.load(f)
            content = data['choices'][0]['message']['content']
            return i, content, "success"
        return i, None, f"No output file"
    except Exception as e:
        return i, None, str(e)

# Process in parallel with limited workers
all_results = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(analyze_image, i): i for i in range(1, 86)}
    for future in concurrent.futures.as_completed(futures):
        i, content, status = future.result()
        all_results[i] = {'content': content, 'status': status}
        print(f"Image {i}: {status}")

# Save combined results
output = []
for i in sorted(all_results.keys()):
    r = all_results[i]
    if r['content']:
        try:
            # Try to parse the content as JSON
            content = r['content']
            # Clean up non-JSON formatting
            if content.startswith('```'):
                content = content.split('\n', 1)[1].rsplit('```', 1)[0]
            parsed = json.loads(content)
            parsed['image_number'] = i
            output.append(parsed)
        except json.JSONDecodeError:
            output.append({'image_number': i, 'raw': r['content']})
    else:
        output.append({'image_number': i, 'error': r['status']})

with open(os.path.join(OUT, 'all_results.json'), 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\nTotal processed: {len(all_results)}")
print(f"Successful: {sum(1 for r in all_results.values() if r['status'] in ('success', 'cached'))}")
print(f"Failed: {sum(1 for r in all_results.values() if r['status'] not in ('success', 'cached'))}")
