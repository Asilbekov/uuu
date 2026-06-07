#!/usr/bin/env python3
"""
Insert Physics Final questions into Neon DB
Uses the extracted JSON and cleans up option text
"""

import json
import re
import subprocess
import sys

JSON_PATH = '/home/z/my-project/upload/physics_final_questions.json'
DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
CREATOR_ID = 'cmp9z1mqf0000je3dx684zhoq'

def clean_option_text(text):
    """Remove solution fragments from option text."""
    if not text:
        return text
    
    # Common patterns that indicate solution text has leaked into option
    # Cut at these markers
    markers = [
        r'\(cid:\d+\)',  # PDF artifact
        'Apply conservation',
        'Use conservation',
        'Use the angular',
        'From the conservation',
        'Formula for',
        'Key points:',
        'Concept —',
        'Correct interpretation:',
        'Isothermal process:',
        'Entropy variation',
        'While floating,',
        'Only the mass',
        'Use torque',
        'As the temperature drops',
        'Use angular impulse',
        r'⇒',
        r'∴',
        r'≈',
        r'∆[A-Z]',
        r'd[tf]\d*',
        r'MR2',
        r'ln\s',
    ]
    
    for marker in markers:
        match = re.search(marker, text)
        if match and match.start() > 5:  # Don't cut the very beginning
            text = text[:match.start()].strip()
    
    # Remove PDF artifacts
    text = re.sub(r'\(cid:\d+\)', '', text)
    
    # Remove trailing fragments that look like calculations
    # Pattern: numbers with operators like "= 3...." or "⇒ V = ..."
    text = re.sub(r'\s*[=⇒→≈]+.*$', '', text)
    
    # Clean whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Remove trailing punctuation artifacts
    text = text.rstrip('.,;:')
    
    return text

def main():
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"Loaded {len(questions)} questions")
    
    # Clean up options
    cleaned = 0
    for q in questions:
        for opt in ['A', 'B', 'C', 'D', 'E']:
            original = q.get(opt, '')
            if original:
                cleaned_text = clean_option_text(original)
                if cleaned_text != original:
                    q[opt] = cleaned_text
                    cleaned += 1
    
    print(f"Cleaned {cleaned} option texts")
    
    # Validate - check for suspiciously long options
    long_options = []
    for q in questions:
        for opt in ['A', 'B', 'C', 'D']:
            val = q.get(opt, '')
            if len(val) > 150:
                long_options.append(f"Q{q['number']} {opt}: {len(val)} chars - {val[:80]}...")
    
    if long_options:
        print(f"\n⚠️  {len(long_options)} options still > 150 chars:")
        for lo in long_options[:10]:
            print(f"  {lo}")
    
    # Generate Node.js insert script
    questions_js = json.dumps(questions, ensure_ascii=False)
    
    script = f'''const {{ PrismaClient }} = require('@prisma/client');
const prisma = new PrismaClient({{ datasources: {{ db: {{ url: '{DB_URL}' }} }} }});

async function main() {{
  const questions = {questions_js};
  
  const test = await prisma.test.create({{
    data: {{
      title: 'Physics: Final',
      topic: 'Physics',
      description: 'Physics 1 - Mechanics, Fluid Dynamics, Thermodynamics MCQs (from PHY1_BetaMCQs PDF)',
      creatorId: '{CREATOR_ID}'
    }}
  }});
  
  console.log('Created test:', test.id, test.title);
  
  let inserted = 0;
  let skipped = 0;
  for (let i = 0; i < questions.length; i++) {{
    const q = questions[i];
    
    // Skip questions with less than 2 non-empty options
    const validOptions = [q.A, q.B, q.C, q.D, q.E].filter(o => o && o.trim().length > 0);
    if (validOptions.length < 2) {{
      console.log('Skip Q' + q.number + ': only ' + validOptions.length + ' options');
      skipped++;
      continue;
    }}
    
    // Default answer for questions without one
    const correctAnswer = q.correct || 'A';
    
    try {{
      await prisma.question.create({{
        data: {{
          testId: test.id,
          text: q.question || '',
          optionA: q.A || '',
          optionB: q.B || '',
          optionC: q.C || '',
          optionD: q.D || '',
          optionE: q.E || null,
          correctAnswer: correctAnswer,
          orderNum: q.number || i + 1,
        }}
      }});
      inserted++;
      if (inserted % 20 === 0) console.log('Inserted ' + inserted + '...');
    }} catch (e) {{
      console.error('Error Q' + q.number + ':', e.message?.slice(0, 80));
      skipped++;
    }}
  }}
  
  console.log('Done! Inserted: ' + inserted + ', Skipped: ' + skipped + ', Total: ' + questions.length);
  
  const count = await prisma.question.count({{ where: {{ testId: test.id }} }});
  console.log('Questions in test:', count);
  
  // Summary
  const allTests = await prisma.test.findMany({{
    select: {{ id: true, title: true, _count: {{ select: {{ questions: true }} }} }}
  }});
  console.log('\\nAll tests in DB:');
  allTests.forEach(t => console.log('  -', t.title + ':', t._count.questions, 'questions'));
  console.log('Total questions:', await prisma.question.count());
  
  await prisma.$disconnect();
}}

main().catch(e => {{ console.error(e); process.exit(1); }});'''
    
    script_path = '/home/z/my-project/insert-physics-final.cjs'
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script)
    
    print(f"\nInsert script saved to {script_path}")
    print(f"Questions with answers: {sum(1 for q in questions if q.get('correct'))}")
    print(f"Questions without answers: {sum(1 for q in questions if not q.get('correct'))}")
    
    # Run the insert script
    print("\n=== INSERTING INTO DATABASE ===")
    result = subprocess.run(['node', script_path], capture_output=True, text=True, timeout=60)
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr[:500])
    if result.returncode != 0:
        print(f"Exit code: {result.returncode}")
        sys.exit(1)

if __name__ == '__main__':
    main()
