#!/usr/bin/env python3
"""LA W1-4 — second repair wave (Nov 2026).

Remaining scrambled blocks after patches_la14.py: the Strang §1.6
transposition/inverse exercise cluster (word order scrambled by the stacked
layout of the cfd27c5 source) plus its orphaned continuation fragments.
Reconstructed from the original combined guide (git 0306010)."""

PATCHES_LA14_RU_FIX2 = [
    ('has', '3. Докажите (A^{−1})^{T} (A^{T})^{−1} почему',
     '3. Докажите (A^{−1})^{T} = (A^{T})^{−1} и объясните, почему A^{T} A симметрична с неотрицательной диагональю.'),
    ('has', 'в точности: Симметрия: = A^{T} A; диагональные элементы равны P',
     'в точности: (A^{−1})^{T} — обратная к A^{T}.'),
    ('has', 'матрица A^{T} A симметрична, (A^{T} A)^{T} = A^{T} A, её диагональные элементы',
     '(A^{T})^{-1} = (A^{-1})^{T}; матрица A^{T} A симметрична: (A^{T} A)^{T} = A^{T} A'),
    ('has', 'неотрицательны: a_{ii} = Σ_{k=1}^{n} a_{ki}^{2} ≥ 0 — суммы квадратов — факт. (17)',
     'её диагональные элементы неотрицательны: a_{ii} = Σ_{k=1}^{n} a_{ki}^{2} ≥ 0 — суммы квадратов — факт. (17)'),
    ('drop', 'стоящий за CC^{T} в задачах лекции недели 3.', None),
]

PATCHES_LA14_EN_FIX2 = [
    ('has', '3. Prove (A^{−1})^{T} (A^{T})^{−1} why',
     '3. Prove (A^{−1})^{T} = (A^{T})^{−1} and explain why A^{T} A is symmetric with a nonnegative diagonal.'),
    ('has', 'precisely: Symmetry: = A^{T} A; diagonal elements equal P',
     'precisely: (A^{−1})^{T} is the inverse of A^{T}.'),
    ('has', 'the matrix A^{T} A is symmetric, (A^{T} A)^{T} = A^{T} A, its diagonal elements are nonnegative:',
     '(A^{T})^{-1} = (A^{-1})^{T}; the matrix A^{T} A is symmetric: (A^{T} A)^{T} = A^{T} A'),
    ('has', 'a_{ii} = Σ_{k=1}^{n} a_{ki}^{2} ≥ 0 — sums of squares — a fact. (17)',
     'its diagonal elements are nonnegative: a_{ii} = Σ_{k=1}^{n} a_{ki}^{2} ≥ 0 — sums of squares — a fact. (17)'),
    ('drop', 'behind CC^{T} in the lecture problems of week 3.', None),
]

PATCHES_LA14_UZ_FIX2 = [
    ('has', "3. Isbotlang (A^{−1})^{T} (A^{T})^{−1} va A^{T} A simmetrik",
     "3. Isbotlang: (A^{−1})^{T} = (A^{T})^{−1} va tushuntiring, nima uchun A^{T} A simmetrik va manfiy bo'lmagan diagonalga ega."),
    ('has', 'degani aniq: Simmetriya: = A^{T} A; diagonal elementlari P',
     "degani aniq: (A^{−1})^{T} — A^{T} ning teskarisi."),
    ('has', 'matritsa A^{T} A simmetrik, (A^{T} A)^{T} = A^{T} A, uning diagonal elementlari manfiy',
     '(A^{T})^{-1} = (A^{-1})^{T}; matritsa A^{T} A simmetrik: (A^{T} A)^{T} = A^{T} A'),
    ('has', "bo'lmagan: a_{ii} = Σ_{k=1}^{n} a_{ki}^{2} ≥ 0 — kvadratlar yig'indisi — fakt. (17)",
     "uning diagonal elementlari manfiy emas: a_{ii} = Σ_{k=1}^{n} a_{ki}^{2} ≥ 0 — kvadratlar yig'indisi — fakt. (17)"),
    ('drop', "3-hafta ma'ruzalaridagi CC^{T} bilan bog'liq.", None),
]
