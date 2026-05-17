import json
import re

with open('/home/z/my-project/upload/chem2_extracted/all_results_compiled.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Clean up and deduplicate
cleaned = []
seen_questions = set()

for r in data:
    if 'question' not in r:
        continue
    
    q = r['question'].strip()
    # Remove leading numbers like "7)", "21)", "42)" etc
    q = re.sub(r'^\d+\)\s*', '', q)
    q = re.sub(r'^\d+\.\s*', '', q)
    
    # Skip if we've seen this question before
    q_lower = q.lower().strip()[:80]
    if q_lower in seen_questions:
        continue
    seen_questions.add(q_lower)
    
    options = r.get('options', {})
    # Ensure options are A, B, C, D (or E)
    clean_options = {}
    for key in sorted(options.keys()):
        val = str(options[key]).strip()
        # Remove "(Correct one)" markers from option text
        val = re.sub(r'\s*\(Correct\s*one\)\s*', '', val, flags=re.IGNORECASE)
        val = re.sub(r'\s*\(correct\)\s*', '', val, flags=re.IGNORECASE)
        clean_options[key] = val
    
    correct = r.get('correct')
    if correct and correct not in clean_options:
        correct = None
    
    cleaned.append({
        'question': q,
        'options': clean_options,
        'correct': correct,
        'image_number': r.get('image_number')
    })

# Group by topic
topics = {
    'Acid-Base & Equilibrium': [],
    'Electrochemistry': [],
    'Gases & Gas Laws': [],
    'Solutions & Colligative Properties': [],
    'Thermochemistry & Thermodynamics': [],
    'Atomic Structure & Bonding': [],
    'Stoichiometry & Moles': [],
}

# Assign topics based on keywords
for q in cleaned:
    text = q['question'].lower()
    assigned = False
    
    if any(kw in text for kw in ['ph', 'acid', 'base', 'oh-', 'equilibrium', 'ka', 'kb', 'buffer', 'dissociation degree', 'catalyst']):
        topics['Acid-Base & Equilibrium'].append(q)
        assigned = True
    elif any(kw in text for kw in ['electrol', 'cell', 'electrode', 'reduction potential', 'faraday', 'current', 'daniell', 'cathode', 'anode', 'galvanic']):
        topics['Electrochemistry'].append(q)
        assigned = True
    elif any(kw in text for kw in ['gas', 'pressure', 'volume', 'atm', 'effus', 'ideal gas', 'mixture of', 'molar concentration', 'mol of gas']):
        topics['Gases & Gas Laws'].append(q)
        assigned = True
    elif any(kw in text for kw in ['solution', 'osmotic', 'freezing', 'boiling', 'ebullioscopic', 'cryoscopic', 'dilut', 'solv', 'colligative']):
        topics['Solutions & Colligative Properties'].append(q)
        assigned = True
    elif any(kw in text for kw in ['heat', 'enthalpy', 'energy', 'combustion', 'calorim', 'specific heat', 'thermodynamic', 'entropy']):
        topics['Thermochemistry & Thermodynamics'].append(q)
        assigned = True
    elif any(kw in text for kw in ['bond', 'covalent', 'atomic', 'rydberg', 'spectrum', 'wavelength', 'sublimation', 'unit cell', 'cubic', 'crystal']):
        topics['Atomic Structure & Bonding'].append(q)
        assigned = True
    elif any(kw in text for kw in ['mole', 'molar', 'stoichiometr', 'mass', 'chloride ion', 'reaction', 'yield']):
        topics['Stoichiometry & Moles'].append(q)
        assigned = True
    
    if not assigned:
        # Default to Acid-Base & Equilibrium as it's the largest category
        topics['Acid-Base & Equilibrium'].append(q)

# Print summary
for topic, questions in topics.items():
    print(f"{topic}: {len(questions)} questions")

# Save
output = {
    'total_questions': len(cleaned),
    'topics': {k: v for k, v in topics.items() if v}
}

with open('/home/z/my-project/seed_data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\nTotal unique questions: {len(cleaned)}")
