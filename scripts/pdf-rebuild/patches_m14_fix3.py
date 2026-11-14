#!/usr/bin/env python3
"""Math I W1-4 — third repair wave (Nov 2026): the exponential-model cluster.

Battery discharge / population growth / bacteria / rabbits: the cfd27c5
source tears the stacked fractions ln2/0.025 etc. into interleaved marker
runs and splits the solutions across p/f blocks.  Reconstructed from the
original combined guide (git 0306010), arithmetic verified:
  ln2/0.025=27.73, ln10/0.025=92.10, 800*e^1.75=4603, ln2/0.35=1.98,
  ln2/12=0.0578, 12*ln200/ln2=92.06, 2^t=175/6=29.17, log2(29.17)=4.87.
"""

P_RU = [
    ('has', '(2) e^{−0.025t} = ^{1}^{ln2}',
     'Решение. (1) E(10)/E_{0} = e^{−0.25} ≈ 0.7788: около 77.9%. (2) e^{−0.025t} = 1/2 ⇒ t = ln 2/0.025 ≈ 27.7 ч. (3) e^{−0.025t} = 0.1 ⇒ t = ln 10/0.025 ≈ 92.1 ч. (4) Экспонента строго положительна при любом конечном t; она приближается к нулю только в пределе t →∞ — первое знакомство с пределами.'),
    ('drop', 'E(t) = E_{0} e^{-0.025t}', None),
    ('drop', '27.7 ч. (3) e^{−0.025t} = 0.1', None),
    ('drop', 'E_{0} e^{-0.025t} ≈ 92.1 ч.', None),
    ('drop', 'при любом конечном t; она приближается к нулю только в пределе', None),
    ('has', 'Решение._{0}_{ln}_{.35} (1) P (0) = 800',
     'Решение. (1) P (0) = 800. (2) P (5) = 800e^{1.75} ≈ 800 · 5.755 ≈ 4603. (3) T_{d} = ln 2/0.35 ≈ 1.98 ч. (4) Нет: экспоненциальный рост игнорирует истощение питательных веществ и пространство; реально модель работает лишь вблизи старта культуры.'),
    ('has', 'Решение. То же: e^{−0.25} ≈ 77.9% через 10 ч',
     'Решение. То же: e^{−0.25} ≈ 77.9% через 10 ч; 50% при ln 2/0.025 ≈ 27.7 ч; 10% при ln 10/0.025 ≈ 92.1 ч; экспонента не достигает нуля за конечное время.'),
    ('has', 'Решение. a. Удвоение: 2 = e^{12k}',
     'Решение. a. Удвоение: 2 = e^{12k}, значит k = ln 2/12 ≈ 0.0578 в час. b. 200000 = 1000e^{kt}: e^{kt} = 200, t = ln 200/k = 12·ln 200/ln 2 ≈ 92.1 часов.'),
    ('has', 'Решение. a. a = 2 за 6-месячный период',
     'Решение. a. a = 2 за 6-месячный период (или в год: при t в годах a = 4; за 6 месяцев a = 2). b. 3500 = 120 · 2^{t} (при t в 6-месячных единицах): 2^{t} = 175/6 ≈ 29.17, t = log_{2} 29.17 = ln 29.17/ln 2 ≈ 4.87 периодов, т.е. около 2.4 лет.'),
    ('has', 'A(t) = e^{tln1.08}',
     'Решение. (1) Оба основания больше 1, поэтому оба предела равны +∞. (2) A(t) = e^{t·ln 1.08}, причём ln 1.08 ≈ 0.0770, значит A(t) = e^{0.0770t}. (3) A растёт быстрее, так как её постоянная скорости 0.0770 больше 0.03. (4) lim_{t→∞} B(t)/A(t) = e^{(0.03−0.0770)t} → 0: B/A → 0, то есть A доминирует. (5) Экспоненциальные модели с разными скоростями расходятся экспоненциально быстро.'),
]

P_EN = [
    ('has', '(2) e^{−0.025t} = ^{1}^{ln2}',
     'Solution. (1) E(10)/E_{0} = e^{−0.25} ≈ 0.7788: about 77.9%. (2) e^{−0.025t} = 1/2 ⇒ t = ln 2/0.025 ≈ 27.7 h. (3) e^{−0.025t} = 0.1 ⇒ t = ln 10/0.025 ≈ 92.1 h. (4) The exponential is strictly positive for any finite t; it approaches zero only as t →∞ — first introduction to limits.'),
    ('drop', 'E(t) = E_{0} e^{-0.025t}', None),
    ('drop', '27.7 h. (3) e^{−0.025t} = 0.1', None),
    ('drop', 'E_{0} e^{-0.025t} ≈ 92.1 h.', None),
    ('drop', 'for any finite t; it approaches zero only as t →∞', None),
    ('has', 'Solution._{0}_{ln}_{.35} (1) P (0) = 800',
     'Solution. (1) P (0) = 800. (2) P (5) = 800e^{1.75} ≈ 800 · 5.755 ≈ 4603. (3) T_{d} = ln 2/0.35 ≈ 1.98 h. (4) No: exponential growth ignores nutrient depletion and space; realistically, the model works only near the start of the culture.'),
    ('has', 'Solution._{0}_{ln}_{0.025} Same:',
     'Solution. Same: e^{−0.25} ≈ 77.9% after 10 h; 50% at ln 2/0.025 ≈ 27.7 h; 10% at ln 10/0.025 ≈ 92.1 h; the exponential never reaches zero in finite time.'),
    ('has', 'Solution. a. Doubling: 2 = e^{12k}',
     'Solution. a. Doubling: 2 = e^{12k}, so k = ln 2/12 ≈ 0.0578 per hour. b. 200000 = 1000e^{kt}: e^{kt} = 200, t = ln 200/k = 12·ln 200/ln 2 ≈ 92.1 hours.'),
    ('has', 'Solution. a. a = 2 for a 6-month period',
     'Solution. a. a = 2 for a 6-month period (or per year: with t in years a = 4; for 6 months a = 2). b. 3500 = 120 · 2^{t} (with t in 6-month units): 2^{t} = 175/6 ≈ 29.17, t = log_{2} 29.17 = ln 29.17/ln 2 ≈ 4.87 periods, i.e. about 2.4 years.'),
    ('has', 'A(t) = e^{tln1.08}',
     'Solution. (1) Both bases are greater than 1, so both limits equal +∞. (2) A(t) = e^{t·ln 1.08}, and ln 1.08 ≈ 0.0770, so A(t) = e^{0.0770t}. (3) A grows faster, since its rate constant 0.0770 exceeds 0.03. (4) lim_{t→∞} B(t)/A(t) = e^{(0.03−0.0770)t} → 0: A dominates. (5) Exponential models with different rates diverge exponentially fast.'),
]

P_UZ = [
    ('has', "(2) e^{−0.025t} = ^{1}^{ln2}",
     "Yechim. (1) E(10)/E_{0} = e^{−0.25} ≈ 0.7788: taxminan 77.9%. (2) e^{−0.025t} = 1/2 ⇒ t = ln 2/0.025 ≈ 27.7 soat. (3) e^{−0.025t} = 0.1 ⇒ t = ln 10/0.025 ≈ 92.1 soat. (4) Eksponenta har qanday chekli t uchun qat'iy musbat; u faqat t →∞ chekligida nolga yaqinlashadi — limit tushunchasi bilan birinchi tanishuv."),
    ('drop', 'E(t) = E_{0} e^{-0.025t}', None),
    ('drop', '27.7 soat. (3) e^{−0.025t} = 0.1', None),
    ('drop', "E_{0} e^{-0.025t} ≈ 92.1 soat.", None),
    ('drop', "; ular faqat t →∞ chekligida nolga yaqinlashadi", None),
    ('has', "Yechim._{0}_{ln}_{.35} (1) P (0) = 800",
     "Yechim. (1) P (0) = 800. (2) P (5) = 800e^{1.75} ≈ 800 · 5.755 ≈ 4603. (3) T_{d} = ln 2/0.35 ≈ 1.98 soat. (4) Yo'q: eksponensial o'sish ozuqa moddalari tugashi va joy cheklanishini e'tiborsiz qoldiradi; model haqiqatan faqat madaniyat boshlanishiga yaqin ishlaydi."),
    ('has', 'Yechim. Xuddi shu: e^{−0.25} ≈ 77.9% 10 soatdan keyin',
     'Yechim. Xuddi shu: e^{−0.25} ≈ 77.9% 10 soatdan keyin; 50% ln 2/0.025 ≈ 27.7 soatda; 10% ln 10/0.025 ≈ 92.1 soatda; eksponensiya chekli vaqtda nolga yetmaydi.'),
    ('has', 'Yechim. a. Ikkilash: 2 = e^{12k}',
     "Yechim. a. Ikkilash: 2 = e^{12k}, demak k = ln 2/12 ≈ 0.0578 soatda. b. 200000 = 1000e^{kt}: e^{kt} = 200, t = ln 200/k = 12·ln 200/ln 2 ≈ 92.1 soat."),
    ('has', 'Yechim. a. a = 6 oylik davrda',
     "Yechim. a. a = 6 oylik davr uchun 2 (yiliga: t yillarda boʻlsa a = 4; 6 oylik a = 2). b. 3500 = 120 · 2^{t} (t 6 oylik birliklarda): 2^{t} = 175/6 ≈ 29.17, t = log_{2} 29.17 = ln 29.17/ln 2 ≈ 4.87 davr, yaʼni taxminan 2.4 yil."),
    ('has', 'A(t) = e^{tln1.08}',
     "Yechim. (1) Ikkala asos ham 1 dan katta, shuning uchun ikkala limit ham +∞. (2) A(t) = e^{t·ln 1.08}, bunda ln 1.08 ≈ 0.0770, demak A(t) = e^{0.0770t}. (3) A tezroq o'sadi, chunki uning tezlik doimiysi 0.0770 > 0.03. (4) lim_{t→∞} B(t)/A(t) = e^{(0.03−0.0770)t} → 0: A ustunlik qiladi. (5) Turli tezlikdagi eksponensial modellar eksponensial ravishda uzoqlashadi."),
]
