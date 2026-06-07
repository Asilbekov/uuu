#!/usr/bin/env python3
"""
Extract physics questions from PHY1_BetaMCQs_1_1_1_.pdf
Improved parser that properly separates options from solutions
"""

import re
import json
import pdfplumber

PDF_PATH = '/home/z/my-project/upload/PHY1_BetaMCQs_1_1_1_.pdf'
OUTPUT_PATH = '/home/z/my-project/upload/physics_final_questions.json'

def extract_questions_from_pdf(pdf_path):
    """Extract all questions with options and correct answers from PDF."""
    
    all_questions = []
    
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
    
    # Split by "Question NN" pattern
    question_blocks = re.split(r'(?=Question \d+\n)', full_text)
    
    for block in question_blocks:
        block = block.strip()
        if not block.startswith('Question'):
            continue
        
        # Extract question number
        num_match = re.match(r'Question (\d+)', block)
        if not num_match:
            continue
        num = int(num_match.group(1))
        
        # Remove the "Question NN" line
        block_after_num = re.sub(r'^Question \d+\n', '', block)
        
        # Truncate everything after "Given:" or "Final Answer:" or "Concepts and Laws" for option extraction
        # These are solution sections, not part of the question
        truncated = block_after_num
        for marker in ['\nGiven:', '\nFinal Answer:', '\nConcepts and Laws', '\nConcepts\n']:
            idx = truncated.find(marker)
            if idx > 0:
                truncated = truncated[:idx]
        
        # Now extract question text and options from truncated block
        # Find first option (A)
        option_match = re.search(r'\n\(A\)', truncated)
        if not option_match:
            continue
        
        question_text = block_after_num[:block_after_num.find('\n(A)')].strip() if '\n(A)' in block_after_num else block_after_num[:option_match.start()].strip()
        options_text = truncated[option_match.start():]
        
        # Extract options line by line - each option starts with (X)
        # Options are typically on one or two lines
        options = {}
        lines = options_text.split('\n')
        current_opt = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            opt_match = re.match(r'^\(([A-E])\)\s*(.*)', line)
            if opt_match:
                current_opt = opt_match.group(1)
                option_text = opt_match.group(2).strip()
                if option_text:
                    options[current_opt] = option_text
                else:
                    options[current_opt] = ''
            elif current_opt:
                # Continuation of previous option
                # But stop if it looks like solution text
                if any(kw in line for kw in ['Given:', 'Using', 'pV γ', 'Therefore', 'ΔS', 'Q =', 'W =']):
                    current_opt = None
                    continue
                options[current_opt] = options.get(current_opt, '') + ' ' + line
        
        # Clean option texts
        for key in options:
            options[key] = re.sub(r'\s+', ' ', options[key]).strip()
            # Remove any trailing solution bits
            for stop in ['Given:', 'Using', 'Therefore']:
                stop_idx = options[key].find(stop)
                if stop_idx > 0:
                    options[key] = options[key][:stop_idx].strip()
        
        # Extract correct answer from full block (not truncated)
        correct = None
        # Pattern 1: Final Answer: (X)
        match = re.search(r'Final Answer:\s*\(([A-E])\)', block)
        if match:
            correct = match.group(1)
        else:
            # Pattern 2: Final Answer: X
            match = re.search(r'Final Answer:\s*([A-E])\b', block)
            if match:
                correct = match.group(1)
        
        # Clean up question text
        question_text = re.sub(r'\s+', ' ', question_text).strip()
        
        # Skip if no options found
        if len(options) < 2:
            continue
        
        # Remove empty E option
        e_val = options.get('E', None)
        if e_val and len(e_val.strip()) == 0:
            e_val = None
        
        q = {
            'number': num,
            'question': question_text,
            'A': options.get('A', ''),
            'B': options.get('B', ''),
            'C': options.get('C', ''),
            'D': options.get('D', ''),
            'E': e_val if e_val and len(e_val.strip()) > 0 else None,
            'correct': correct
        }
        
        all_questions.append(q)
    
    # Sort by question number
    all_questions.sort(key=lambda q: q['number'])
    
    return all_questions


def validate_questions(questions):
    """Check for common issues and fix them."""
    issues = []
    
    for q in questions:
        # Check if option text contains solution fragments
        for opt in ['A', 'B', 'C', 'D', 'E']:
            val = q.get(opt, '')
            if not val:
                continue
            # Common solution keywords that shouldn't be in options
            if 'Concepts and Laws' in val:
                q[opt] = val[:val.find('Concepts and Laws')].strip()
                issues.append(f"Q{q['number']}: Removed 'Concepts and Laws' from option {opt}")
            if 'Given:' in val:
                q[opt] = val[:val.find('Given:')].strip()
                issues.append(f"Q{q['number']}: Removed 'Given:' from option {opt}")
            # Check for overly long options (likely include solution)
            if len(val) > 200:
                issues.append(f"Q{q['number']}: Option {opt} is suspiciously long ({len(val)} chars): {val[:60]}...")
    
    return questions, issues


def main():
    print("Extracting questions from PDF...")
    questions = extract_questions_from_pdf(PDF_PATH)
    
    print(f"Extracted {len(questions)} questions")
    
    # Validate
    questions, issues = validate_questions(questions)
    
    if issues:
        print(f"\n=== {len(issues)} issues found and fixed ===")
        for issue in issues[:20]:
            print(f"  {issue}")
    
    # Count stats
    with_answer = sum(1 for q in questions if q['correct'])
    without_answer = sum(1 for q in questions if not q['correct'])
    with_e = sum(1 for q in questions if q.get('E'))
    
    print(f"\nWith correct answer: {with_answer}")
    print(f"Without correct answer: {without_answer}")
    print(f"With option E: {with_e}")
    
    # Show sample
    print("\n=== SAMPLE QUESTIONS ===")
    for q in questions[:3]:
        print(f"\nQ{q['number']}: {q['question'][:100]}...")
        for opt in ['A', 'B', 'C', 'D']:
            print(f"  {opt}: {q[opt][:60]}")
        if q.get('E'):
            print(f"  E: {q['E'][:60]}")
        print(f"  Correct: {q['correct']}")
    
    # Save
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved to {OUTPUT_PATH}")
    
    # Show questions without answers
    if without_answer > 0:
        print(f"\n=== Questions WITHOUT correct answer ({without_answer}) ===")
        for q in questions:
            if not q['correct']:
                print(f"  Q{q['number']}: {q['question'][:60]}...")


if __name__ == '__main__':
    main()
