#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""splice_w57.py — rebuild the per-subject W5-7 guide JSONs from the CLEAN v1
combined guides (Study_Guide_Weeks_5-7_{lang}.pdf) instead of the degraded
per-subject re-render.

The v1 combined guides extract with correct word order, intact parentheses and
real sub/sup markers; the per-subject PDFs (cfd27c5) were a damaged re-render
(scrambled emphasis words, dropped '(' before Cyrillic, mangled tables).

Splice per subject guide:
  * chapter 1 (course map) from the CURRENT guide JSON (subject-adapted prose
    + clean 2-column table that the v1 extraction mangles),
  * chapters 2..4 from v1, keeping only the subject's h2 sections,
  * chapter 5 (Midterm, unmarked sections) from v1 into the Math guide only,
  * h1 titles from the current guide (already subject-adapted),
  * drops v1 artifacts: 'Упражнение_{131}_{132}_...' label-list mangles.

Usage: splice_w57.py <ru|en|uz>
"""
import json, re, sys

WORK = '/home/z/my-project/work'

MATH_MARKERS = ('Math I:', 'Matematika I:')
LA_MARKERS = ('Линейная алгебра', 'Linear Algebra', 'Chiziqli algebra',
              'Lineal algebra', 'Linear algebra')


def subject_of_h2(title):
    for m in MATH_MARKERS:
        if m in title:
            return 'math'
    for m in LA_MARKERS:
        if m in title:
            return 'la'
    return None


def is_mangled_labellist(b):
    return (b['k'] == 'p' and
            re.match(r'^(Упражнение|Exercise|Mashq)\s*_\{?\d', b.get('t', '') or ''))


def splice(lang):
    v1 = json.load(open(f'{WORK}/v1_w57_{lang}.json'))
    cur_m = json.load(open(f'{WORK}/m57_{lang}.json'))
    cur_l = json.load(open(f'{WORK}/la57_{lang}.json'))

    v1_blocks = [b for b in v1['blocks'] if not is_mangled_labellist(b)]

    # split v1 into chapters by h1
    chapters = []          # list of {'h1': block, 'blocks': [...]}
    for b in v1_blocks:
        if b['k'] == 'h1':
            chapters.append({'h1': b, 'blocks': []})
        elif chapters:
            chapters[-1]['blocks'].append(b)
    # ch1 = course map; ch2..ch4 weeks; ch5 midterm (math only)
    weeks = chapters[1:-1] if len(chapters) == 5 else chapters[1:]
    midterm = chapters[-1] if len(chapters) == 5 else None

    def current_ch1(cur):
        out, started = [], False
        for b in cur['blocks']:
            if b['k'] == 'h1':
                if started:
                    break
                started = True
            if started:
                out.append(b)
        return out

    def current_h1_titles(cur):
        return [b['t'] for b in cur['blocks'] if b['k'] == 'h1']

    def chapter_sections(ch, want):
        """h2 sections of chapter ch belonging to subject want (or None-marked
        sections when want == 'any')."""
        out = []
        cur_subj = None
        include = False
        for b in ch['blocks']:
            if b['k'] == 'h2':
                cur_subj = subject_of_h2(b['t'])
                include = (cur_subj == want)
            elif include:
                out.append(b)
            elif b['k'] == 'h2':
                pass
        return out

    def build_guide(cur, want, include_midterm):
        blocks = list(current_ch1(cur))
        titles = current_h1_titles(cur)
        # titles[0] = ch1 course map; the rest map onto the emitted chapters
        ti = 1
        for ch in weeks:
            secs = chapter_sections(ch, want)
            if not secs:
                continue
            blocks.append({'k': 'h1', 't': titles[ti] if ti < len(titles)
                           else re.sub(r'^\d+\s+', '', ch['h1']['t'])})
            ti += 1
            blocks.extend(secs)
        if include_midterm and midterm is not None:
            blocks.append({'k': 'h1', 't': titles[ti] if ti < len(titles)
                           else re.sub(r'^\d+\s+', '', midterm['h1']['t'])})
            blocks.extend(midterm['blocks'])
        return {'cover': cur['cover'], 'header': cur['header'], 'blocks': blocks}

    m57 = build_guide(cur_m, 'math', True)
    la57 = build_guide(cur_l, 'la', False)

    for key, data in (('m57', m57), ('la57', la57)):
        out = f'{WORK}/{key}_{lang}.json'
        with open(out, 'w') as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        nq = sum(1 for b in data['blocks'] if b['k'] == 'q')
        ntab = sum(1 for b in data['blocks'] if b['k'] == 'table')
        print(f"{key}_{lang}: {len(data['blocks'])} blocks, {nq} q, {ntab} tables -> {out}")


if __name__ == '__main__':
    splice(sys.argv[1] if len(sys.argv) > 1 else 'ru')
