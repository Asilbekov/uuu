#!/usr/bin/env python3
"""fix_rawtex.py — make raw LaTeX in TEXT fields engine-safe (v3, env-aware).

Engine renders text fields via mathSplit(): $...$ and \\begin{env}...\\end{env}
fragments are TeXified; bare \\frac/\\cdot in text would show raw and fail the
render-time raw_latex_on_screen check.

v3 rules:
  1. \\begin{env}...\\end{env} fragments are PROTECTED verbatim (\\frac inside
     an env is valid LaTeX — mathSplit ships the whole env to KaTeX).
  2. outside envs: symbol commands → Unicode (\\cdot → ·, ...); structural
     commands (\\frac, \\sqrt) wrapped in $...$.
  3. inside envs: strip stray $-pairs around \\frac/\\sqrt (repairs the v2
     bug that broke envs by injecting $).
"""
import json, re, sys

SYM = {'\\cdot': '·', '\\times': '×', '\\pm': '±', '\\leq': '≤', '\\le': '≤',
       '\\geq': '≥', '\\ge': '≥', '\\approx': '≈', '\\neq': '≠', '\\ne': '≠',
       '\\to': '→', '\\rightarrow': '→', '\\leftarrow': '←', '\\degree': '°',
       '\\in': '∈', '\\notin': '∉', '\\subset': '⊂', '\\subseteq': '⊆',
       '\\supset': '⊃', '\\supseteq': '⊇', '\\forall': '∀', '\\exists': '∃',
       '\\emptyset': '∅', '\\varnothing': '∅', '\\infty': '∞', '\\partial': '∂',
       '\\nabla': '∇', '\\langle': '⟨', '\\rangle': '⟩', '\\cup': '∪', '\\cap': '∩',
       '\\setminus': '∖', '\\circ': '∘', '\\bullet': '•', '\\ldots': '…',
       '\\dots': '…', '\\cdots': '⋯', '\\vdots': '⋮', '\\quad': ' ', '\\qquad': '  ',
       '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ', '\\varepsilon': 'ε',
       '\\epsilon': 'ε', '\\zeta': 'ζ', '\\eta': 'η', '\\theta': 'θ', '\\vartheta': 'ϑ',
       '\\iota': 'ι', '\\kappa': 'κ', '\\lambda': 'λ', '\\mu': 'μ', '\\nu': 'ν',
       '\\xi': 'ξ', '\\pi': 'π', '\\rho': 'ρ', '\\sigma': 'σ', '\\tau': 'τ',
       '\\upsilon': 'υ', '\\phi': 'φ', '\\varphi': 'φ', '\\chi': 'χ', '\\psi': 'ψ',
       '\\omega': 'ω', '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ',
       '\\Xi': 'Ξ', '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Phi': 'Φ', '\\Psi': 'Ψ', '\\Omega': 'Ω',
       '\\;': ' ', '\\,': ' ', '\\!': ''}

BB = {'R': 'ℝ', 'N': 'ℕ', 'Z': 'ℤ', 'Q': 'ℚ', 'C': 'ℂ', 'F': '𝔽', 'E': '𝔼', 'P': 'ℙ'}

def fix_mathbb(s):
    return re.sub(r'\\mathbb\{([A-Za-z])\}', lambda m: BB.get(m.group(1), m.group(1)), s)

ENV_RE = re.compile(r'\\begin\{([a-zA-Z*]+)\}[\s\S]{0,900}?\\end\{\1\}')

def fix_outside(s: str) -> str:
    s = s.replace('\\' + chr(0xFFFD), '≈').replace(chr(0xFFFD), '≈')
    # ремонт сломанных \frac/\sqrt: закрывающая скобка вместо фигурной
    # (?!\}) — не трогаем легитимные \frac{f(t)}{g(t)} где ) закрывает функцию
    s = re.sub(r'(\\frac\{[^{}]*\}\{[^{}]*?)[\)\]](?!\})', r'\1}', s)
    s = re.sub(r'(\\sqrt\{[^{}]*?)[\)\]](?!\})', r'\1}', s)
    # баланс фигурных/круглых скобок ВНУТРИ $...$ (тайпы LLM: {(3x+1}·\ln 2})
    s = re.sub(r'\$[^$]+\$', _balance_span, s)
    # все прочие преобразования — ТОЛЬКО вне $...$ (внутри LaTeX валиден)
    parts = []
    last = 0
    for m in re.finditer(r'\$[^$]+\$', s):
        if m.start() > last:
            parts.append(_convert_bare(s[last:m.start()]))
        parts.append(m.group(0))
        last = m.end()
    if last < len(s):
        parts.append(_convert_bare(s[last:]))
    return ''.join(parts)

def _balance_span(m) -> str:
    s = m.group(0)
    # ( ... } → ( ... ) : скобка-группа закрыта фигурной
    s = re.sub(r'\(([^(){}]+)\}', r'(\1)', s)
    # убираем непарные закрывающие/открывающие фигурные
    out, stack = [], 0
    for ch in s:
        if ch == '{':
            stack += 1; out.append(ch)
        elif ch == '}':
            if stack > 0:
                stack -= 1; out.append(ch)
            # else: непарная закрывающая — выбрасываем
        else:
            out.append(ch)
    if stack > 0:
        res, st = [], stack
        for ch in reversed(out):
            if ch == '{' and st > 0:
                st -= 1; continue
            res.append(ch)
        s = ''.join(reversed(res))
    else:
        s = ''.join(out)
    return s

def _convert_bare(s: str) -> str:
    """Преобразования вне $...$: Unicode-замены, TeXify \frac/\sqrt, стрип."""
    s = fix_mathbb(s)
    for k in sorted(SYM, key=len, reverse=True):
        s = s.replace(k, SYM[k])
    s = re.sub(r'(?<!\$)\\frac((?:\{(?:[^{}]|\{[^{}]*\})*\})+)(?!\$)',
               lambda m: '$\\frac' + m.group(1) + '$', s)
    s = re.sub(r'(?<!\$)\\sqrt\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}(?!\$)',
               lambda m: '$\\sqrt{' + m.group(1) + '}$', s)
    s = re.sub(r'\\vec\{([^{}]{1,12})\}', lambda m: m.group(1) + '\u20D7', s)
    s = re.sub(r'\\overline\{([^{}]{1,12})\}', lambda m: m.group(1) + '\u0304', s)
    s = re.sub(r'\\bar\{([^{}]{1,12})\}', lambda m: m.group(1) + '\u0304', s)
    s = re.sub(r'\\hat\{([^{}]{1,12})\}', lambda m: m.group(1) + '\u0302', s)
    s = re.sub(r'\\tilde\{([^{}]{1,12})\}', lambda m: m.group(1) + '\u0303', s)
    s = re.sub(r'\\mathbf\{([^{}]{1,12})\}', r'\1', s)
    # последний рубеж: неизвестные bare-команды — слэш-стриппинг
    s = re.sub(r'\\([a-zA-Z]+)\{([^{}]*)\}', r'\2', s)
    s = re.sub(r'\\([a-zA-Z]+)', r'\1', s)
    return s

def _strip_cmds(s: str) -> str:
    s = re.sub(r'\\([a-zA-Z]+)\{([^{}]*)\}', r'\2', s)
    s = re.sub(r'\\([a-zA-Z]+)', r'\1', s)
    return s

def fix_inside_env(s: str) -> str:
    # repair v2 damage: $...$ pairs injected around \frac/\sqrt inside envs
    s = re.sub(r'\$(\\(?:frac|sqrt)(?:\{[^{}]*\})+)\$', r'\1', s)
    # stray $ right after \begin{env} or right before \end{env}
    s = re.sub(r'(\\begin\{[a-zA-Z*]+\})\s*\$', r'\1', s)
    s = re.sub(r'\$\s*(\\end\{[a-zA-Z]*\})', r'\1', s)
    s = re.sub(r'(?:\\\\|\$)?\s*\\(\\)\s*(\\end\{[a-zA-Z]*\})', r'\2', s)
    s = re.sub(r'\\\\\s*(\\end\{[a-zA-Z]*\})', r'\1', s)
    return s

def fix_text(s: str) -> str:
    if not isinstance(s, str):
        return s
    if chr(0xFFFD) in s:
        s = s.replace('\\' + chr(0xFFFD), '≈').replace(chr(0xFFFD), '≈')
    if '\\' not in s:
        return s
    # опечатка LLM: \\begin{...} / \\end{...} (двойной бэкслэш) → одинарный,
    # иначе env не закрывается и KaTeX падает на "Expected \end"
    s = re.sub(r'\\\\(begin|end)\{', r'\\\1{', s)
    parts = []
    last = 0
    for m in ENV_RE.finditer(s):
        if m.start() > last:
            parts.append(fix_outside(s[last:m.start()]))
        parts.append(fix_inside_env(m.group(0)))
        last = m.end()
    if last < len(s):
        parts.append(fix_outside(s[last:]))
    return ''.join(parts)

TEXT_KEYS = {'heading', 'text', 'problem', 'result', 'note', 'who', 'subtitle',
             'title', 'year', 'label'}

def walk(o):
    if isinstance(o, dict):
        for k, v in list(o.items()):
            if k in TEXT_KEYS and isinstance(v, str):
                o[k] = fix_text(v)
            elif k in ('bullets', 'items', 'narr', 'caption') and isinstance(v, list):
                o[k] = [fix_text(x) if isinstance(x, str) else x for x in v]
            elif isinstance(v, (dict, list)):
                walk(v)
        return o
    elif isinstance(o, list):
        for x in o:
            walk(x)
        return o
    return o

def main(spec_path):
    d = json.load(open(spec_path))
    before = json.dumps(d, ensure_ascii=False)
    walk(d.get('chapters', []))
    after = json.dumps(d, ensure_ascii=False)
    if before != after:
        json.dump(d, open(spec_path, 'w'), ensure_ascii=False, indent=1)
        print(f'{spec_path}: FIXED')
    else:
        print(f'{spec_path}: clean')

if __name__ == '__main__':
    for p in sys.argv[1:]:
        main(p)
