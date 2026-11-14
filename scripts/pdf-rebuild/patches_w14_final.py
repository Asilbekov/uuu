#!/usr/bin/env python3
"""Final repair wave (Nov 2026): std-limit solution, UZ scrambled caps,
ee14 option-letter glue. All verified against the original guides."""

M14_RU = [
    ('has', 'Решение. Замена u = 5x (так u → 0 при x → 0)',
     'Решение. Замена u = 5x (так u → 0 при x → 0): sin 5x/x = 5·sin 5x/5x = 5·sin u/u → 5·1 = 5.'),
]

M14_EN = [
    ('has', 'Solution. Let u = 5x (so u → 0 as x → 0)',
     'Solution. Let u = 5x (so u → 0 as x → 0): sin 5x/x = 5·sin 5x/5x = 5·sin u/u → 5·1 = 5.'),
]

M14_UZ = [
    ('has', "Yechim. u = 5x almashtirish (x → 0 bo'lganda u → 0)",
     "Yechim. u = 5x almashtirish (x → 0 bo'lganda u → 0): sin 5x/x = 5·sin 5x/5x = 5·sin u/u → 5·1 = 5."),
    ('has', 'Yechim. a. Parabola shoxi: 9. b. Chiziqli shox: 7. (Ikkala tomonlama chek mavjud emAS.)',
     'Yechim. a. Parabola shoxi: 9. b. Chiziqli shox: 7. (Ikkala tomonlama chek mavjud emas.)'),
    ('has', 'Yechim. a. Kubik shox: b. Doimiy shox: 1.',
     'Yechim. Grafikdan: g(1) = −5 va f(1) = 3: ayirma 8; kubik ildiz: ∛8 = 2. (Ikkala tomonlama chek mavjud emas.)'),
]

EE14 = [
    ('has', 'In geography, a desert is an area which receives afew / little rain',
     'In geography, a desert is an area which receives a a few / little rain and which loses b a few / a lot of its moisture through evaporation. c Many / Much polar regions can be called deserts, but most of us think of a desert as being a sandy, rocky area with d not enough / few water. e Lots / Lot of deserts consist of sand dunes or bare rock, and f many / much are near mountain ranges, which take away the moisture from clouds. Others are far away from the sea or in other water, so receive g few / little moisture. Although we might assume that very h few / lots kinds of life live in deserts, in fact there are i lots / many of plants, animals and insects in these regions. j Lots / Many desert plants store water in their leaves or roots, and some desert plants can live for k lots / many years. Some desert animals live underground. They spend l little / a few time in the sun and only come out at night. There are m enough / lots of insects, scorpions and spiders as well as reptiles, such as snakes, lizards and tortoises, in deserts. They need to spend n much / many hours in the sun to generate body heat, so they have o a few / little difficulty living in high temperatures. However, p few / little of them can bear extreme sunlight, so they tend to move from one area of shade to another.'),
]

M14_RU += [
    ('has', 'Решение. Приводим числитель: ^{a−(a+h)}^{−h}^{−1}',
     'Решение. Приводим числитель: 1/a − 1/(a + h) = (a − (a + h))/(a(a + h)) = −h/(a(a + h)). Делим на h: −1/(a(a + h)) при h ̸= 0.'),
    ('drop', 'lim_{h→0} (a^{a+h} - a^{a})/h', None),
    ('has', 'Предел: − _{a}^{1}_{2} (производная 1/x при a).',
     'Предел: −1/a^{2} (производная 1/x при a).'),
    ('has', 'Решение. При θ ̸= π вблизи π: _{tan}^{sinθ}_{θ}',
     'Решение. При θ ̸= π вблизи π: sin θ/tan θ = sin θ · cos θ/sin θ = cos θ (сокращение законно, так как там sin θ ̸= 0). Предел: cos π = −1.'),
]

M14_EN += [
    ('has', 'Solution. Simplify numerator: ^{a−(a+h)}^{−h}^{−1}',
     'Solution. Simplify numerator: 1/a − 1/(a + h) = (a − (a + h))/(a(a + h)) = −h/(a(a + h)). Divide by h: −1/(a(a + h)) for h ̸= 0.'),
    ('drop', 'lim_{h→0} (a^{a+h} - a^{a})/h', None),
    ('has', 'Limit: − _{a}^{1}_{2} (derivative of 1/x at a).',
     'Limit: −1/a^{2} (derivative of 1/x at a).'),
    ('has', 'Solution. When θ ≠ π near π: _{tan}^{sinθ}_{θ}',
     'Solution. When θ ≠ π near π: sin θ/tan θ = sin θ · cos θ/sin θ = cos θ (cancellation is valid since sin θ ≠ 0 there). Limit: cos π = −1.'),
]

M14_UZ += [
    ('has', "Yechim. Numeratorni bir xil ko'paytuvchiga keltiramiz: ^{a−(a+h)}^{−h}^{−1}",
     "Yechim. Suratni bir xil ko'paytuvchiga keltiramiz: 1/a − 1/(a + h) = (a − (a + h))/(a(a + h)) = −h/(a(a + h)). h ga bo'lamiz: h ̸= 0 da −1/(a(a + h))."),
    ('drop', "lim_{h→0} (a^{a+h} - a^{a})/h", None),
    ('has', 'Limit: − _{a}^{1}_{2} (1/x ning hosilasi a da).',
     'Limit: −1/a^{2} (1/x ning hosilasi a da).'),
    ('has', 'Yechim. θ ̸= π yaqinida π da: _{tan}^{sinθ}_{θ}',
     'Yechim. θ ̸= π yaqinida π da: sin θ/tan θ = sin θ · cos θ/sin θ = cos θ (qisqartish qonuniy, chunki u yerda sin θ ̸= 0). Limit: cos π = −1.'),
]

LA14_UZ = [
    ('has', 'L(x) Ax formulasi bilan aniqlanadi',
     'L(x) = Ax formulasi bilan aniqlanadi'),
]

M14_RU += [
    ('drop', 'Решение. = x → 0: На бесконечности =', None),
]
M14_EN += [
    ('drop', 'Solution. = x → 0: At infinity =', None),
]

LA14_RU = [
    ('drop', '[] [] 1 = (2, −1, 4)_{T} и A 0 = (3, 2, 0)_{T}. Запишите A', None),
    ('has', '20. A имеет размер 3 × 2, причём A 0 1',
     '20. A имеет размер 3 × 2, причём A·[1; 0] = (2, −1, 4)^{T} и A·[0; 1] = (3, 2, 0)^{T}. Запишите A и вычислите A·[−2; 5] без скалярных произведений строк.'),
    ('drop', 'A = [2 3; -1 2; 5 4]', None),
    ('has', 'Решение. Два образа — это столбцы A: A =',
     'Решение. Два образа — это столбцы A: A = [2 3; −1 2; 4 0]. Линейность: A·[−2; 5] = −2Ae_{1} + 5Ae_{2} = −2·[2; −1; 4] + 5·[3; 2; 0] = [11; 12; −8].'),
    ('drop', '[2 3; 5 11]', None),
]

LA14_EN = [
    ('drop', '[] [] 1 = (2, −1, 4)_{T} and A 0 = (3, 2, 0)_{T}. Write A', None),
    ('has', '20. A has size 3 × 2, with A 0 1',
     '20. A has size 3 × 2, with A·[1; 0] = (2, −1, 4)^{T} and A·[0; 1] = (3, 2, 0)^{T}. Write A and compute A·[−2; 5] without scalar products of rows.'),
    ('drop', 'A = [2 3; -1 2; 5 4]', None),
    ('has', 'Solution. The two images are the columns of A: A =',
     'Solution. The two images are the columns of A: A = [2 3; −1 2; 4 0]. Linearity: A·[−2; 5] = −2Ae_{1} + 5Ae_{2} = −2·[2; −1; 4] + 5·[3; 2; 0] = [11; 12; −8].'),
    ('drop', '[2 3; 5 11]', None),
]

LA14_UZ += [
    ('drop', '[] [] 1 = (2, −1, 4)_{T} va A 0 = (3, 2, 0)_{T}. A ni yozing', None),
    ('has', "20. A matritsasi 3 × 2 o'lchamda, A 0",
     "20. A matritsasi 3 × 2 o'lchamda, A·[1; 0] = (2, −1, 4)^{T} va A·[0; 1] = (3, 2, 0)^{T}. A ni yozing va A·[−2; 5] ni qatorlar skalyar ko'paytmalarisiz hisoblang."),
    ('drop', 'A = [2 3; -1 2; 5 4]', None),
    ('has', 'Yechim. Ikkita tasvir — bu A ning ustunlari: A =',
     'Yechim. Ikkita tasvir — bu A ning ustunlari: A = [2 3; −1 2; 4 0]. Chiziqlilik: A·[−2; 5] = −2Ae_{1} + 5Ae_{2} = −2·[2; −1; 4] + 5·[3; 2; 0] = [11; 12; −8].'),
    ('drop', '[2 3; 5 11]', None),
]

# torn exercise-6 tail fragments (duplicated by the patched solutions)
M14_RU += [('drop', 'x^{2} = o(x) при x → 0. (16)', None)]
M14_EN += [('drop', 'x^{2} = o(x) as x → 0. (16)', None)]
M14_UZ += [('drop', 'x^{2} = o(x) x → 0 da. (16)', None)]
