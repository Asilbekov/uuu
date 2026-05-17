import subprocess
import json
import os
import glob
import concurrent.futures

DIR = "/home/z/my-project/upload/chem2_extracted/chem 2"
OUT = "/home/z/my-project/upload/chem2_extracted"

failed = [20, 21, 22, 25, 26, 27, 28, 29, 30, 31, 40, 41, 42, 43, 44, 60, 61, 62, 83, 84, 85]

def analyze_image(i):
    pattern = os.path.join(DIR, f"photo_{i}_*.jpg")
    files = glob.glob(pattern)
    if not files:
        return i, None, "File not found"
    
    filepath = files[0]
    outfile = os.path.join(OUT, f"result_{i}.json")
    
    prompt = 'This is a chemistry test question. Extract the question and all answer options (A,B,C,D). Identify the correct answer if marked. Return ONLY valid JSON: {"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A"}. If correct answer unknown set correct to null.'
    
    try:
        result = subprocess.run(
            ['z-ai', 'vision', '-p', prompt, '-i', filepath, '-o', outfile],
            capture_output=True, text=True, timeout=60
        )
        if os.path.exists(outfile) and os.path.getsize(outfile) > 50:
            with open(outfile) as f:
                data = json.load(f)
            content = data['choices'][0]['message']['content']
            return i, content, "success"
        return i, None, f"No output: {result.stderr[:200]}"
    except Exception as e:
        return i, None, str(e)

all_results = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    futures = {executor.submit(analyze_image, i): i for i in failed}
    for future in concurrent.futures.as_completed(futures):
        i, content, status = future.result()
        all_results[i] = {'content': content, 'status': status}
        print(f"Image {i}: {status}")

for i in sorted(all_results.keys()):
    r = all_results[i]
    print(f"  {i}: {r['status']}")
