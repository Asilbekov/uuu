import subprocess
import json
import os
import glob
import concurrent.futures
import sys

# The new images are in the root project directory
DIR = "/home/z/my-project"
OUT = "/home/z/my-project/upload/new_batch_results"
os.makedirs(OUT, exist_ok=True)

# Find all the new test images (17-47-58 and 17-59-55 and 17-47-59 series)
# We need to distinguish them from the already-processed chem2 images (18-21-59 series)
new_images = []
for f in sorted(glob.glob(os.path.join(DIR, "photo_*.jpg"))):
    basename = os.path.basename(f)
    # Only process the new images with timestamps 17-47-58, 17-59-55, 17-47-59
    if "17-47-58" in basename or "17-59-55" in basename or "17-47-59" in basename:
        new_images.append(f)

print(f"Found {len(new_images)} new images to process")

# Group images by their timestamp series
series = {}
for f in new_images:
    basename = os.path.basename(f)
    # Extract the number and timestamp
    parts = basename.replace("photo_", "").replace(".jpg", "").split("_2026-05-16_")
    num = int(parts[0])
    ts = parts[1] if len(parts) > 1 else "unknown"
    if ts not in series:
        series[ts] = []
    series[ts].append((num, f))

for ts, imgs in sorted(series.items()):
    print(f"  Series {ts}: {len(imgs)} images (photos {min(n for n,_ in imgs)}-{max(n for n,_ in imgs)})")

def analyze_image(filepath):
    basename = os.path.basename(filepath)
    # Create a unique output filename
    outfile = os.path.join(OUT, basename.replace(".jpg", ".json"))
    
    # Check if already processed
    if os.path.exists(outfile) and os.path.getsize(outfile) > 100:
        try:
            with open(outfile) as f:
                data = json.load(f)
            content = data['choices'][0]['message']['content']
            return basename, content, "cached"
        except:
            pass
    
    prompt = 'This is a chemistry test question. Extract the question and all answer options (A,B,C,D,E if present). Identify the correct answer if it is marked on the image. Return ONLY valid JSON: {"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A"}. If there are 5 options include E. If correct answer is unknown or not marked, set correct to null. Make sure to capture the complete question text including any chemical formulas or equations.'
    
    try:
        result = subprocess.run(
            ['z-ai', 'vision', '-p', prompt, '-i', filepath, '-o', outfile],
            capture_output=True, text=True, timeout=60
        )
        if os.path.exists(outfile):
            with open(outfile) as f:
                data = json.load(f)
            content = data['choices'][0]['message']['content']
            return basename, content, "success"
        return basename, None, f"No output file. stderr: {result.stderr[:200]}"
    except subprocess.TimeoutExpired:
        return basename, None, "Timeout"
    except Exception as e:
        return basename, None, str(e)

# Process in parallel with limited workers to avoid rate limiting
all_results = {}
total = len(new_images)
completed = 0

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(analyze_image, f): f for f in new_images}
    for future in concurrent.futures.as_completed(futures):
        basename, content, status = future.result()
        all_results[basename] = {'content': content, 'status': status}
        completed += 1
        if completed % 10 == 0 or status not in ('success', 'cached'):
            print(f"[{completed}/{total}] {basename}: {status}")

# Parse and compile results
output = []
errors = []
for basename in sorted(all_results.keys()):
    r = all_results[basename]
    if r['content']:
        try:
            content = r['content']
            # Clean up non-JSON formatting
            if content.startswith('```'):
                content = content.split('\n', 1)[1].rsplit('```', 1)[0]
            parsed = json.loads(content)
            # Extract image number for reference
            parts = basename.replace("photo_", "").replace(".jpg", "").split("_2026-05-16_")
            parsed['image_number'] = int(parts[0])
            parsed['image_series'] = parts[1] if len(parts) > 1 else "unknown"
            parsed['image_file'] = basename
            output.append(parsed)
        except json.JSONDecodeError:
            errors.append({'image_file': basename, 'raw': r['content']})
    else:
        errors.append({'image_file': basename, 'error': r['status']})

# Save all parsed results
with open(os.path.join(OUT, 'all_parsed_questions.json'), 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

# Save errors for review
if errors:
    with open(os.path.join(OUT, 'errors.json'), 'w', encoding='utf-8') as f:
        json.dump(errors, f, indent=2, ensure_ascii=False)

print(f"\n=== RESULTS ===")
print(f"Total processed: {total}")
print(f"Successful: {sum(1 for r in all_results.values() if r['status'] in ('success', 'cached'))}")
print(f"Failed: {sum(1 for r in all_results.values() if r['status'] not in ('success', 'cached'))}")
print(f"Parsed questions: {len(output)}")
print(f"Parse errors: {len(errors)}")
