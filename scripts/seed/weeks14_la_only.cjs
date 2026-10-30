module.exports = {
 "title": "Linear Algebra I: Weeks 1-4 Complete Test",
 "description": "Weeks 1-4 of Linear Algebra I in one test: vectors, linear combinations, span and independence; dot and cross products, projections; matrices, matrix algebra, determinants and mixed products; rank, inverse matrices and Gauss-Jordan elimination. The full study-guide PDFs (RU/EN/UZ) are attached.",
 "topic": "Mathematics",
 "attachments": [
  {
   "title": "Study Guide (RU) — Линейная алгебра I, недели 1–4",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Linear_Algebra_I_Weeks_1-4_RU.pdf",
   "size": null
  },
  {
   "title": "Study Guide (EN) — Linear Algebra I, Weeks 1-4",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Linear_Algebra_I_Weeks_1-4_EN.pdf",
   "size": null
  },
  {
   "title": "Study Guide (UZ) — Chiziqli algebra I, 1–4 haftalar",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Linear_Algebra_I_Weeks_1-4_UZ.pdf",
   "size": null
  }
 ],
 "questions": [
  {
   "t": "Let $u = (-1, -2)$ and $v = (-3, 5)$. Calculate u + v, u - v, 2u, -3v, and 2u - 3v.",
   "o": [
    "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (-9, 15)$, $2u - 3v = (7, -19)$",
    "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (9, -15)$, $2u - 3v = (-7, -19)$",
    "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (-9, 15)$, $2u - 3v = (-7, -19)$",
    "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (9, -15)$, $2u - 3v = (7, -19)$"
   ],
   "e": "The calculations are performed component-wise: $u + v = (-1 + (-3), -2 + 5) = (-4, 3)$; $u - v = (-1 - (-3), -2 - 5) = (2, -7)$; $2u = (2(-1), 2(-2)) = (-2, -4)$; $-3v = (-3(-3), -3(5)) = (9, -15)$; $2u - 3v = (-2 + 9, -4 + (-15)) = (7, -19)$.",
   "ru": {
    "t": "Пусть $u = (-1, -2)$ и $v = (-3, 5)$. Вычислите u + v, u - v, 2u, -3v и 2u - 3v.",
    "o": [
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (-9, 15)$, $2u - 3v = (7, -19)$",
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (9, -15)$, $2u - 3v = (-7, -19)$",
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (-9, 15)$, $2u - 3v = (-7, -19)$",
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (9, -15)$, $2u - 3v = (7, -19)$"
    ],
    "e": "Вычисления выполняются покомпонентно: $u + v = (-1 + (-3), -2 + 5) = (-4, 3)$; $u - v = (-1 - (-3), -2 - 5) = (2, -7)$; $2u = (2(-1), 2(-2)) = (-2, -4)$; $-3v = (-3(-3), -3(5)) = (9, -15)$; $2u - 3v = (-2 + 9, -4 + (-15)) = (7, -19)$."
   },
   "uz": {
    "t": "$u = (-1, -2)$ va $v = (-3, 5)$ boʻlsin. u + v, u - v, 2u, -3v va 2u - 3v ni hisoblang.",
    "o": [
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (-9, 15)$, $2u - 3v = (7, -19)$",
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (9, -15)$, $2u - 3v = (-7, -19)$",
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (-9, 15)$, $2u - 3v = (-7, -19)$",
     "$u + v = (-4, 3)$, $u - v = (2, -7)$, $2u = (-2, -4)$, $-3v = (9, -15)$, $2u - 3v = (7, -19)$"
    ],
    "e": "Hisoblar komponentma-komponent bajariladi: $u + v = (-1 + (-3), -2 + 5) = (-4, 3)$; $u - v = (-1 - (-3), -2 - 5) = (2, -7)$; $2u = (2(-1), 2(-2)) = (-2, -4)$; $-3v = (-3(-3), -3(5)) = (9, -15)$; $2u - 3v = (-2 + 9, -4 + (-15)) = (7, -19)$."
   }
  },
  {
   "t": "Given $a = (2, -1, 4)$ and $b = (3, 2, -2)$, find a + b, a - b, and 3a + 2b.",
   "o": [
    "$a + b = (5, 1, 2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, 1, 8)$",
    "$a + b = (5, 1, 2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, -1, 4)$",
    "$a + b = (1, -1, -2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, 1, 8)$",
    "$a + b = (5, 1, 2)$, $a - b = (1, 3, -6)$, $3a + 2b = (0, 1, 8)$"
   ],
   "e": "Componentwise: $a + b = (2+3, -1+2, 4-2) = (5, 1, 2)$; $a - b = (2-3, -1-2, 4+2) = (-1, -3, 6)$; $3a + 2b = (6+6, -3+4, 12-4) = (12, 1, 8)$.",
   "ru": {
    "t": "Дано $a = (2, -1, 4)$ и $b = (3, 2, -2)$. Найдите a + b, a - b и 3a + 2b.",
    "o": [
     "$a + b = (5, 1, 2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, 1, 8)$",
     "$a + b = (5, 1, 2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, -1, 4)$",
     "$a + b = (1, -1, -2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, 1, 8)$",
     "$a + b = (5, 1, 2)$, $a - b = (1, 3, -6)$, $3a + 2b = (0, 1, 8)$"
    ],
    "e": "Покомпонентно: $a + b = (2+3, -1+2, 4-2) = (5, 1, 2)$; $a - b = (2-3, -1-2, 4+2) = (-1, -3, 6)$; $3a + 2b = (6+6, -3+4, 12-4) = (12, 1, 8)$."
   },
   "uz": {
    "t": "$a = (2, -1, 4)$ va $b = (3, 2, -2)$ berilgan. a + b, a - b va 3a + 2b ni toping.",
    "o": [
     "$a + b = (5, 1, 2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, 1, 8)$",
     "$a + b = (5, 1, 2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, -1, 4)$",
     "$a + b = (1, -1, -2)$, $a - b = (-1, -3, 6)$, $3a + 2b = (12, 1, 8)$",
     "$a + b = (5, 1, 2)$, $a - b = (1, 3, -6)$, $3a + 2b = (0, 1, 8)$"
    ],
    "e": "Komponentma-komponent: $a + b = (2+3, -1+2, 4-2) = (5, 1, 2)$; $a - b = (2-3, -1-2, 4+2) = (-1, -3, 6)$; $3a + 2b = (6+6, -3+4, 12-4) = (12, 1, 8)$."
   }
  },
  {
   "t": "Find x if $x + (2, -4, 1) = (7, 3, -2)$.",
   "o": [
    "$x = (5, 7, -3)$",
    "$x = (5, -7, 3)$",
    "$x = (9, -1, -3)$",
    "$x = (9, 1, 1)$"
   ],
   "e": "Subtract componentwise: $x = (7-2, 3-(-4), -2-1) = (5, 7, -3)$.",
   "ru": {
    "t": "Найдите x, если $x + (2, -4, 1) = (7, 3, -2)$.",
    "o": [
     "$x = (5, 7, -3)$",
     "$x = (5, -7, 3)$",
     "$x = (9, -1, -3)$",
     "$x = (9, 1, 1)$"
    ],
    "e": "Вычтем покомпонентно: $x = (7-2, 3-(-4), -2-1) = (5, 7, -3)$."
   },
   "uz": {
    "t": "Agar $x + (2, -4, 1) = (7, 3, -2)$ boʻlsa, x ni toping.",
    "o": [
     "$x = (5, 7, -3)$",
     "$x = (5, -7, 3)$",
     "$x = (9, -1, -3)$",
     "$x = (9, 1, 1)$"
    ],
    "e": "Komponentma-komponent ayiramiz: $x = (7-2, 3-(-4), -2-1) = (5, 7, -3)$."
   }
  },
  {
   "t": "Find x if $3x - 2u = v$, where $u = (2, 2)$ and $v = (4, 2)$.",
   "o": [
    "x = ($4/3$, $2$)",
    "x = ($8/3$, $2$)",
    "x = ($4/3$, $1$)",
    "x = ($8/3$, $1$)"
   ],
   "e": "Isolate x: $3x = v + 2u = (4, 2) + 2(2, 2) = (8, 6)$. Then divide by 3: $x = (8/3, 6/3) = (8/3, 2)$.",
   "ru": {
    "t": "Найдите x, если $3x - 2u = v$, где $u = (2, 2)$ и $v = (4, 2)$.",
    "o": [
     "x = ($4/3$, $2$)",
     "x = ($8/3$, $2$)",
     "x = ($4/3$, $1$)",
     "x = ($8/3$, $1$)"
    ],
    "e": "Выразим x: $3x = v + 2u = (4, 2) + 2(2, 2) = (8, 6)$. Затем разделим на 3: $x = (8/3, 6/3) = (8/3, 2)$."
   },
   "uz": {
    "t": "Agar $3x - 2u = v$, bunda $u = (2, 2)$ va $v = (4, 2)$ boʻlsa, x ni toping.",
    "o": [
     "x = ($4/3$, $2$)",
     "x = ($8/3$, $2$)",
     "x = ($4/3$, $1$)",
     "x = ($8/3$, $1$)"
    ],
    "e": "x ni ajratamiz: $3x = v + 2u = (4, 2) + 2(2, 2) = (8, 6)$. Soʻngra 3 ga boʻlamiz: $x = (8/3, 6/3) = (8/3, 2)$."
   }
  },
  {
   "t": "Calculate the Euclidean length of $u = (3, 4)$, $v = (-3, 0)$, and $w = (0, 0, 0)$.",
   "o": [
    "kuk = 5, kvk = 3, kwk = 0",
    "kuk = 5, kvk = 3, kwk = 1",
    "kuk = 7, kvk = 3, kwk = 0",
    "kuk = 7, kvk = 0, kwk = 0"
   ],
   "e": "kuk = $\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$, kvk = $\\sqrt{(-3)^2 + 0^2} = \\sqrt{9} = 3$, and kwk = 0 since it's the zero vector.",
   "ru": {
    "t": "Вычислите евклидову длину $u = (3, 4)$, $v = (-3, 0)$ и $w = (0, 0, 0)$.",
    "o": [
     "kuk = 5, kvk = 3, kwk = 0",
     "kuk = 5, kvk = 3, kwk = 1",
     "kuk = 7, kvk = 3, kwk = 0",
     "kuk = 7, kvk = 0, kwk = 0"
    ],
    "e": "kuk = $\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$, kvk = $\\sqrt{(-3)^2 + 0^2} = \\sqrt{9} = 3$, а kwk = 0, так как это нулевой вектор."
   },
   "uz": {
    "t": "$u = (3, 4)$, $v = (-3, 0)$ va $w = (0, 0, 0)$ vektorlarning evklid uzunligini hisoblang.",
    "o": [
     "kuk = 5, kvk = 3, kwk = 0",
     "kuk = 5, kvk = 3, kwk = 1",
     "kuk = 7, kvk = 3, kwk = 0",
     "kuk = 7, kvk = 0, kwk = 0"
    ],
    "e": "kuk = $\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$, kvk = $\\sqrt{(-3)^2 + 0^2} = \\sqrt{9} = 3$, kwk esa 0, chunki bu nol vektor."
   }
  },
  {
   "t": "Find a unit vector in the same direction as $v = (-3, 4)$ and verify that it has length 1.",
   "o": [
    "$(-\\frac{3}{5}, \\frac{4}{5})$, length = 1",
    "$(-\\frac{3}{7}, \\frac{4}{7})$, length = 1",
    "$(-\\frac{3}{5}, \\frac{4}{5})$, length = $\\frac{5}{7}$",
    "$(-\\frac{3}{7}, \\frac{4}{7})$, length = $\\frac{5}{7}$"
   ],
   "e": "The unit vector is v divided by its norm: $(-\\frac{3}{5}, \\frac{4}{5})$. Its length is $\\sqrt((-\\frac{3}{5})^{2} + (\\frac{4}{5})^{2}) = \\sqrt(\\frac{9}{25} +\\frac{16}{25}) = \\sqrt(\\frac{25}{25}) = 1$.",
   "ru": {
    "t": "Найдите единичный вектор в том же направлении, что и $v = (-3, 4)$, и проверьте, что его длина равна 1.",
    "o": [
     "$(-\\frac{3}{5}, \\frac{4}{5})$, длина = 1",
     "$(-\\frac{3}{7}, \\frac{4}{7})$, длина = 1",
     "$(-\\frac{3}{5}, \\frac{4}{5})$, длина = $\\frac{5}{7}$",
     "$(-\\frac{3}{7}, \\frac{4}{7})$, длина = $\\frac{5}{7}$"
    ],
    "e": "Единичный вектор — это v, деленный на его норму: $(-\\frac{3}{5}, \\frac{4}{5})$. Его длина равна $\\sqrt((-\\frac{3}{5})^{2} + (\\frac{4}{5})^{2}) = \\sqrt(\\frac{9}{25} +\\frac{16}{25}) = \\sqrt(\\frac{25}{25}) = 1$."
   },
   "uz": {
    "t": "$v = (-3, 4)$ bilan bir xil yoʻnalishdagi birlik vektorni toping va uning uzunligi 1 ekanini tekshiring.",
    "o": [
     "$(-\\frac{3}{5}, \\frac{4}{5})$, uzunlik = 1",
     "$(-\\frac{3}{7}, \\frac{4}{7})$, uzunlik = 1",
     "$(-\\frac{3}{5}, \\frac{4}{5})$, uzunlik = $\\frac{5}{7}$",
     "$(-\\frac{3}{7}, \\frac{4}{7})$, uzunlik = $\\frac{5}{7}$"
    ],
    "e": "Birlik vektor — v ning normasiga boʻlinmasi: $(-\\frac{3}{5}, \\frac{4}{5})$. Uning uzunligi $\\sqrt((-\\frac{3}{5})^{2} + (\\frac{4}{5})^{2}) = \\sqrt(\\frac{9}{25} +\\frac{16}{25}) = \\sqrt(\\frac{25}{25}) = 1$."
   }
  },
  {
   "t": "Find a vector of length 10 pointing in the same direction as $v = (-4, -3)$.",
   "o": [
    "(-8, -6)",
    "(-40, -30)",
    "(-4, -3)",
    "(-2, -1.5)"
   ],
   "e": "The norm of v is 5, so scaling by $\\frac{10}{5} = 2$ gives the vector $2v = (-8, -6)$, which has length $2 \\times 5 = 10$.",
   "ru": {
    "t": "Найдите вектор длины 10, направленный так же, как $v = (-4, -3)$.",
    "o": [
     "(-8, -6)",
     "(-40, -30)",
     "(-4, -3)",
     "(-2, -1.5)"
    ],
    "e": "Норма v равна 5, поэтому умножение на $\\frac{10}{5} = 2$ дает вектор $2v = (-8, -6)$, длина которого $2 \\times 5 = 10$."
   },
   "uz": {
    "t": "$v = (-4, -3)$ bilan bir xil yoʻnalishga yoʻnalgan uzunligi 10 boʻlgan vektorni toping.",
    "o": [
     "(-8, -6)",
     "(-40, -30)",
     "(-4, -3)",
     "(-2, -1.5)"
    ],
    "e": "v ning normasi 5, shuning uchun $\\frac{10}{5} = 2$ ga koʻpaytirish $2v = (-8, -6)$ vektorni beradi, uning uzunligi $2 \\times 5 = 10$."
   }
  },
  {
   "t": "Using vector subtraction and length, find the distance between $P = (1, -2, 3)$ and $Q = (5, 1, -3)$.",
   "o": [
    "$\\sqrt{61}$",
    "$\\sqrt{31}$",
    "$\\sqrt{59}$",
    "$\\sqrt{41}$"
   ],
   "e": "The vector $PQ = Q - P = (4, 3, -6)$, so the distance is $\\sqrt{4^2 + 3^2 + (-6)^2} = \\sqrt{16 + 9 + 36} = \\sqrt{61}$.",
   "ru": {
    "t": "Используя вычитание векторов и длину, найдите расстояние между $P = (1, -2, 3)$ и $Q = (5, 1, -3)$.",
    "o": [
     "$\\sqrt{61}$",
     "$\\sqrt{31}$",
     "$\\sqrt{59}$",
     "$\\sqrt{41}$"
    ],
    "e": "Вектор $PQ = Q - P = (4, 3, -6)$, поэтому расстояние равно $\\sqrt{4^2 + 3^2 + (-6)^2} = \\sqrt{16 + 9 + 36} = \\sqrt{61}$."
   },
   "uz": {
    "t": "Vektorlarni ayirish va uzunlik yordamida $P = (1, -2, 3)$ va $Q = (5, 1, -3)$ nuqtalar orasidagi masofani toping.",
    "o": [
     "$\\sqrt{61}$",
     "$\\sqrt{31}$",
     "$\\sqrt{59}$",
     "$\\sqrt{41}$"
    ],
    "e": "$PQ = Q - P = (4, 3, -6)$ vektor, demak masofa $\\sqrt{4^2 + 3^2 + (-6)^2} = \\sqrt{16 + 9 + 36} = \\sqrt{61}$ ga teng."
   }
  },
  {
   "t": "Let $v_1 = (-1, -2)$ and $v_2 = (4, 5)$. Calculate $2v_1 + v_2$, $-v_1 + 3v_2$, $4v_1 - 2v_2$, and $0v_1 + 5v_2$.",
   "o": [
    "$2v_{1} + v_{2} = (2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
    "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
    "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, -13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
    "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, 18)$, $0v_{1} + 5v_{2} = (0, 0)$"
   ],
   "e": "$2v_{1} + v_{2} = 2(-1, -2) + (4, 5) = (-2 + 4, -4 + 5) = (2, 1)$, $-v_{1} + 3v_{2} = -(-1, -2) + 3(4, 5) = (1 + 12, 2 + 15) = (13, 17)$, $4v_{1} - 2v_{2} = 4(-1, -2) - 2(4, 5) = (-4 - 8, -8 - 10) = (-12, -18)$, $0v_{1} + 5v_{2} = 0(-1, -2) + 5(4, 5) = (0 + 20, 0 + 25) = (20, 25)$. The correct option is B.",
   "ru": {
    "t": "Пусть $v_1 = (-1, -2)$ и $v_2 = (4, 5)$. Вычислите $2v_1 + v_2$, $-v_1 + 3v_2$, $4v_1 - 2v_2$ и $0v_1 + 5v_2$.",
    "o": [
     "$2v_{1} + v_{2} = (2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
     "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
     "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, -13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
     "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, 18)$, $0v_{1} + 5v_{2} = (0, 0)$"
    ],
    "e": "$2v_{1} + v_{2} = 2(-1, -2) + (4, 5) = (-2 + 4, -4 + 5) = (2, 1)$, $-v_{1} + 3v_{2} = -(-1, -2) + 3(4, 5) = (1 + 12, 2 + 15) = (13, 17)$, $4v_{1} - 2v_{2} = 4(-1, -2) - 2(4, 5) = (-4 - 8, -8 - 10) = (-12, -18)$, $0v_{1} + 5v_{2} = 0(-1, -2) + 5(4, 5) = (0 + 20, 0 + 25) = (20, 25)$. Правильный вариант — B."
   },
   "uz": {
    "t": "$v_1 = (-1, -2)$ va $v_2 = (4, 5)$ boʻlsin. $2v_1 + v_2$, $-v_1 + 3v_2$, $4v_1 - 2v_2$ va $0v_1 + 5v_2$ ni hisoblang.",
    "o": [
     "$2v_{1} + v_{2} = (2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
     "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
     "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, -13)$, $4v_{1} - 2v_{2} = (-12, -18)$, $0v_{1} + 5v_{2} = (0, 0)$",
     "$2v_{1} + v_{2} = (-2, 7)$, $-v_{1} + 3v_{2} = (11, 13)$, $4v_{1} - 2v_{2} = (-12, 18)$, $0v_{1} + 5v_{2} = (0, 0)$"
    ],
    "e": "$2v_{1} + v_{2} = 2(-1, -2) + (4, 5) = (-2 + 4, -4 + 5) = (2, 1)$, $-v_{1} + 3v_{2} = -(-1, -2) + 3(4, 5) = (1 + 12, 2 + 15) = (13, 17)$, $4v_{1} - 2v_{2} = 4(-1, -2) - 2(4, 5) = (-4 - 8, -8 - 10) = (-12, -18)$, $0v_{1} + 5v_{2} = 0(-1, -2) + 5(4, 5) = (0 + 20, 0 + 25) = (20, 25)$. Toʻgʻri variant — B."
   }
  },
  {
   "t": "Determine c1, c2 such that $c_{1} \\cdot [1, 1] + c_{2} \\cdot [1, -1] = [7, 1]$. Verify by substitution.",
   "o": [
    "$c_{1} = 5$, $c_{2} = -2$",
    "$c_{1} = -2$, $c_{2} = 5$",
    "$c_{1} = 4$, $c_{2} = 3$",
    "$c_{1} = 3$, $c_{2} = 4$"
   ],
   "e": "The component equations are $c_{1} + c_{2} = 7$ and $c_{1} - c_{2} = 1$. Adding these equations gives $2c_{1} = 8$, so $c_{1} = 4$. Substituting back gives $4 + c_{2} = 7$, so $c_{2} = 3$. Verification: $4 \\cdot [1, 1] + 3 \\cdot [1, -1] = [4+3, 4-3] = [7, 1]$. The correct option is A.",
   "ru": {
    "t": "Определите c1, c2 такие, что $c_{1} \\cdot [1, 1] + c_{2} \\cdot [1, -1] = [7, 1]$. Проверьте подстановкой.",
    "o": [
     "$c_{1} = 5$, $c_{2} = -2$",
     "$c_{1} = -2$, $c_{2} = 5$",
     "$c_{1} = 4$, $c_{2} = 3$",
     "$c_{1} = 3$, $c_{2} = 4$"
    ],
    "e": "Покомпонентные уравнения: $c_{1} + c_{2} = 7$ и $c_{1} - c_{2} = 1$. Складывая их, получаем $2c_{1} = 8$, откуда $c_{1} = 4$. Обратная подстановка даёт $4 + c_{2} = 7$, значит $c_{2} = 3$. Проверка: $4 \\cdot [1, 1] + 3 \\cdot [1, -1] = [4+3, 4-3] = [7, 1]$. Правильный вариант — A."
   },
   "uz": {
    "t": "c1, c2 ni shunday aniqlangki, $c_{1} \\cdot [1, 1] + c_{2} \\cdot [1, -1] = [7, 1]$ boʻlsin. Qoʻyib tekshiring.",
    "o": [
     "$c_{1} = 5$, $c_{2} = -2$",
     "$c_{1} = -2$, $c_{2} = 5$",
     "$c_{1} = 4$, $c_{2} = 3$",
     "$c_{1} = 3$, $c_{2} = 4$"
    ],
    "e": "Komponentalar tenglamalari: $c_{1} + c_{2} = 7$ va $c_{1} - c_{2} = 1$. Ularni qoʻshsak, $2c_{1} = 8$ boʻladi, demak $c_{1} = 4$. Qayta qoʻyish $4 + c_{2} = 7$ beradi, demak $c_{2} = 3$. Tekshirish: $4 \\cdot [1, 1] + 3 \\cdot [1, -1] = [4+3, 4-3] = [7, 1]$. Toʻgʻri variant — A."
   }
  },
  {
   "t": "Determine whether $b = [1, 4, 5]$ can be written as $b = c_{1} \\cdot v_{1} + c_{2} \\cdot v_{2} + c_{3} \\cdot v_{3}$ where $v_{1} = [1, 0, 1]$, $v_{2} = [0, 1, 1]$, and $v_{3} = [1, 1, 0]$.",
   "o": [
    "Yes, with $c_{1} = 4$, $c_{2} = 0$, $c_{3} = 1$",
    "Yes, with $c_{1} = 1$, $c_{2} = 2$, $c_{3} = 3$",
    "Yes, with $c_{1} = 0$, $c_{2} = 4$, $c_{3} = 1$",
    "No, it cannot be written as a linear combination of these vectors"
   ],
   "e": "The component equations are $c_{1} + c_{3} = 1$, $c_{2} + c_{3} = 4$, and $c_{1} + c_{2} = 5$. Solving this system gives $c_{1} = 4$, $c_{2} = 0$, $c_{3} = 1$. Verification: $4 \\cdot [1, 0, 1] + 0 \\cdot [0, 1, 1] + 1 \\cdot [1, 1, 0] = [4+0+1, 0+0+1, 4+0+0] = [5, 1, 4]$. The correct option is B.",
   "ru": {
    "t": "Определите, можно ли представить $b = [1, 4, 5]$ в виде $b = c_{1} \\cdot v_{1} + c_{2} \\cdot v_{2} + c_{3} \\cdot v_{3}$, где $v_{1} = [1, 0, 1]$, $v_{2} = [0, 1, 1]$, $v_{3} = [1, 1, 0]$.",
    "o": [
     "Да, с $c_{1} = 4$, $c_{2} = 0$, $c_{3} = 1$",
     "Да, с $c_{1} = 1$, $c_{2} = 2$, $c_{3} = 3$",
     "Да, с $c_{1} = 0$, $c_{2} = 4$, $c_{3} = 1$",
     "Нет, его нельзя представить в виде линейной комбинации этих векторов"
    ],
    "e": "Покомпонентные уравнения: $c_{1} + c_{3} = 1$, $c_{2} + c_{3} = 4$ и $c_{1} + c_{2} = 5$. Решение этой системы: $c_{1} = 4$, $c_{2} = 0$, $c_{3} = 1$. Проверка: $4 \\cdot [1, 0, 1] + 0 \\cdot [0, 1, 1] + 1 \\cdot [1, 1, 0] = [4+0+1, 0+0+1, 4+0+0] = [5, 1, 4]$. Правильный вариант — B."
   },
   "uz": {
    "t": "$b = [1, 4, 5]$ ni $b = c_{1} \\cdot v_{1} + c_{2} \\cdot v_{2} + c_{3} \\cdot v_{3}$ koʻrinishida yozish mumkinmi — aniqlang, bunda $v_{1} = [1, 0, 1]$, $v_{2} = [0, 1, 1]$, $v_{3} = [1, 1, 0]$.",
    "o": [
     "Ha, $c_{1} = 4$, $c_{2} = 0$, $c_{3} = 1$ bilan",
     "Ha, $c_{1} = 1$, $c_{2} = 2$, $c_{3} = 3$ bilan",
     "Ha, $c_{1} = 0$, $c_{2} = 4$, $c_{3} = 1$ bilan",
     "Yoʻq, uni bu vektorlarning chiziqli kombinatsiyasi koʻrinishida yozib boʻlmaydi"
    ],
    "e": "Komponentalar tenglamalari: $c_{1} + c_{3} = 1$, $c_{2} + c_{3} = 4$ va $c_{1} + c_{2} = 5$. Tizimning yechimi: $c_{1} = 4$, $c_{2} = 0$, $c_{3} = 1$. Tekshirish: $4 \\cdot [1, 0, 1] + 0 \\cdot [0, 1, 1] + 1 \\cdot [1, 1, 0] = [4+0+1, 0+0+1, 4+0+0] = [5, 1, 4]$. Toʻgʻri variant — B."
   }
  },
  {
   "t": "Describe geometrically all vectors in the span of $[-2, 3]$. Does $[-6, -8]$ belong to this span?",
   "o": [
    "The span is the line through the origin in the direction $(-2, 3)$. $[-6, -8]$ does not belong to this span.",
    "The span is just the origin. $[-6, -8]$ does not belong to this span.",
    "The span is the line through the origin in the direction $(-2, 3)$. $[-6, -8]$ belongs to this span.",
    "The span is the entire $\\mathbb{R}^2$ plane. $[-6, -8]$ belongs to this span."
   ],
   "e": "The span of $[-2, 3]$ is all scalar multiples of this vector, which forms a line through the origin in the direction $(-2, 3)$. For $[-6, -8]$ to be in this span, we would need $-2c = -6$ and $3c = -8$, which gives $c = 3$ and $c = -\\frac{8}{3}$, a contradiction. The correct option is A.",
   "ru": {
    "t": "Опишите геометрически все векторы линейной оболочки вектора $[-2, 3]$. Принадлежит ли $[-6, -8]$ этой оболочке?",
    "o": [
     "Оболочка — прямая, проходящая через начало координат в направлении $(-2, 3)$. $[-6, -8]$ не принадлежит этой оболочке.",
     "Оболочка — только начало координат. $[-6, -8]$ не принадлежит этой оболочке.",
     "Оболочка — прямая, проходящая через начало координат в направлении $(-2, 3)$. $[-6, -8]$ принадлежит этой оболочке.",
     "Оболочка — вся плоскость $\\mathbb{R}^2$. $[-6, -8]$ принадлежит этой оболочке."
    ],
    "e": "Линейная оболочка вектора $[-2, 3]$ состоит из всех скалярных кратных этого вектора и представляет собой прямую, проходящую через начало координат в направлении $(-2, 3)$. Чтобы $[-6, -8]$ принадлежал этой оболочке, требовалось бы $-2c = -6$ и $3c = -8$, откуда $c = 3$ и $c = -\\frac{8}{3}$ — противоречие. Правильный вариант — A."
   },
   "uz": {
    "t": "$[-2, 3]$ vektorning chiziqli qobigʻidagi barcha vektorlarni geometrik tasvirlang. $[-6, -8]$ ushbu qobiqqa tegishlimi?",
    "o": [
     "Qobiq — koordinatalar boshidan $(-2, 3)$ yoʻnalishida oʻtuvchi toʻgʻri chiziq. $[-6, -8]$ ushbu qobiqqa tegishli emas.",
     "Qobiq — faqat koordinatalar boshi. $[-6, -8]$ ushbu qobiqqa tegishli emas.",
     "Qobiq — koordinatalar boshidan $(-2, 3)$ yoʻnalishida oʻtuvchi toʻgʻri chiziq. $[-6, -8]$ ushbu qobiqqa tegishli.",
     "Qobiq — butun $\\mathbb{R}^2$ tekisligi. $[-6, -8]$ ushbu qobiqqa tegishli."
    ],
    "e": "$[-2, 3]$ vektorning chiziqli qobigʻi shu vektorning barcha skalyar karralilaridan iborat boʻlib, koordinatalar boshidan $(-2, 3)$ yoʻnalishida oʻtuvchi toʻgʻri chiziq hosil qiladi. $[-6, -8]$ ushbu qobiqqa kirishi uchun $-2c = -6$ va $3c = -8$ boʻlishi kerak edi, bundan $c = 3$ va $c = -\\frac{8}{3}$ kelib chiqadi — zidlik. Toʻgʻri variant — A."
   }
  },
  {
   "t": "Are $v_{1} = (1, 2)$ and $v_{2} = (3, 6)$ linearly independent? If not, find nonzero c1, c2 with $c_{1} v_{1} + c_{2} v_{2} = 0$ and explain geometrically.",
   "o": [
    "Dependent; $c_{1} = 3$, $c_{2} = -1$. Geometrically, both vectors lie on the same line through the origin.",
    "Independent; no such c1, c2 exist. Geometrically, the vectors are perpendicular.",
    "Independent; no such c1, c2 exist. Geometrically, the vectors point in different directions.",
    "Dependent; $c_{1} = -1$, $c_{2} = 3$. Geometrically, both vectors lie on the same line through the origin."
   ],
   "e": "$v_{2} = 3v_{1}$, so $3v_{1} - v_{2} = 0$ is a nontrivial relation. The vectors are dependent and lie on the same line through the origin.",
   "ru": {
    "t": "Линейно независимы ли $v_{1} = (1, 2)$ и $v_{2} = (3, 6)$? Если нет, найдите ненулевые c1, c2 с $c_{1} v_{1} + c_{2} v_{2} = 0$ и объясните геометрически.",
    "o": [
     "Зависимы; $c_{1} = 3$, $c_{2} = -1$. Геометрически оба вектора лежат на одной прямой, проходящей через начало координат.",
     "Независимы; таких c1, c2 не существует. Геометрически векторы перпендикулярны.",
     "Независимы; таких c1, c2 не существует. Геометрически векторы имеют разные направления.",
     "Зависимы; $c_{1} = -1$, $c_{2} = 3$. Геометрически оба вектора лежат на одной прямой, проходящей через начало координат."
    ],
    "e": "$v_{2} = 3v_{1}$, поэтому $3v_{1} - v_{2} = 0$ — нетривиальное соотношение. Векторы зависимы и лежат на одной прямой, проходящей через начало координат."
   },
   "uz": {
    "t": "$v_{1} = (1, 2)$ va $v_{2} = (3, 6)$ chiziqli mustaqilmi? Agar mustaqil boʻlmasa, $c_{1} v_{1} + c_{2} v_{2} = 0$ shartni qanoatlantiruvchi nolga teng boʻlmagan c1, c2 ni toping va geometrik tushuntiring.",
    "o": [
     "Bogʻliq; $c_{1} = 3$, $c_{2} = -1$. Geometrik jihatdan ikkala vektor ham koordinatalar boshidan oʻtuvchi bir xil toʻgʻri chiziqda yotadi.",
     "Mustaqil; bunday c1, c2 mavjud emas. Geometrik jihatdan vektorlar perpendikulyar.",
     "Mustaqil; bunday c1, c2 mavjud emas. Geometrik jihatdan vektorlar har xil yoʻnalishga qaratilgan.",
     "Bogʻliq; $c_{1} = -1$, $c_{2} = 3$. Geometrik jihatdan ikkala vektor ham koordinatalar boshidan oʻtuvchi bir xil toʻgʻri chiziqda yotadi."
    ],
    "e": "$v_{2} = 3v_{1}$, shuning uchun $3v_{1} - v_{2} = 0$ — trivial boʻlmagan bogʻlanish. Vektorlar bogʻliq va koordinatalar boshidan oʻtuvchi bir xil toʻgʻri chiziqda yotadi."
   }
  },
  {
   "t": "Are $v_1 = (0, 1, 1)$, $v_2 = (1, 0, 1)$, $v_3 = (1, 1, 1)$ linearly independent? If dependent, express one as a combination of the others.",
   "o": [
    "Dependent; $v_3 = v_1 + v_2$.",
    "Independent; no vector can be expressed as a combination of the others.",
    "Dependent; $v_2 = v_1 + v_3$.",
    "Dependent; $v_1 = v_2 + v_3$."
   ],
   "e": "$v_3 = v_1 + v_2$, which is a nontrivial relation. The vectors are dependent, and $v_3$ can be expressed as the sum of $v_1$ and $v_2$.",
   "ru": {
    "t": "Линейно независимы ли $v_1 = (0, 1, 1)$, $v_2 = (1, 0, 1)$, $v_3 = (1, 1, 1)$? Если зависимы, выразите один из них как комбинацию остальных.",
    "o": [
     "Зависимы; $v_3 = v_1 + v_2$.",
     "Независимы; ни один вектор нельзя выразить как комбинацию остальных.",
     "Зависимы; $v_2 = v_1 + v_3$.",
     "Зависимы; $v_1 = v_2 + v_3$."
    ],
    "e": "$v_3 = v_1 + v_2$ — нетривиальное соотношение. Векторы линейно зависимы, и $v_3$ можно выразить как сумму $v_1$ и $v_2$."
   },
   "uz": {
    "t": "$v_1 = (0, 1, 1)$, $v_2 = (1, 0, 1)$, $v_3 = (1, 1, 1)$ chiziqli mustaqilmi? Agar bogʻliq boʻlsa, bittasini qolganlarning kombinatsiyasi sifatida ifodalang.",
    "o": [
     "Bogʻliq; $v_3 = v_1 + v_2$.",
     "Mustaqil; hech bir vektorni qolganlarning kombinatsiyasi sifatida ifodalab boʻlmaydi.",
     "Bogʻliq; $v_2 = v_1 + v_3$.",
     "Bogʻliq; $v_1 = v_2 + v_3$."
    ],
    "e": "$v_3 = v_1 + v_2$ — trivial boʻlmagan bogʻlanish. Vektorlar chiziqli bogʻliq, va $v_3$ ni $v_1$ va $v_2$ yigʻindisi sifatida ifodalash mumkin."
   }
  },
  {
   "t": "Let v1 = (1, 2), v2 = (3, 1). (1) Do they span $\\mathbb{R}^2$? (2) For b = (-7, -6), find c1, c2 with c1 v1 + c2 v2 = b. (3) Express b using the formula.",
   "o": [
    "(1) Yes; $(2) c_{1} = 1$, $c_{2} = 2$; $(3) b = v_{1} + 2v_{2}$.",
    "(1) Yes; $(2) c_{1} = -2$, $c_{2} = 1$; $(3) b = -2v_{1} + v_{2}$.",
    "(1) No; $(2) c_{1} = -1$, $c_{2} = 2$; $(3) b = -v_{1} + 2v_{2}$.",
    "(1) No; $(2) c_{1} = 2$, $c_{2} = -1$; $(3) b = 2v_{1} - v_{2}$."
   ],
   "e": "The vectors span $\\mathbb{R}^2$ since the system has a solution for any b. For b = (-7, -6), c1 = 1 and c2 = 2, so b = v1 + 2v2.",
   "ru": {
    "t": "Пусть v1 = (1, 2), v2 = (3, 1). (1) Образуют ли они линейную оболочку $\\mathbb{R}^2$? (2) Для b = (-7, -6) найдите c1, c2 с c1 v1 + c2 v2 = b. (3) Выразите b по формуле.",
    "o": [
     "(1) Да; $(2) c_{1} = 1$, $c_{2} = 2$; $(3) b = v_{1} + 2v_{2}$.",
     "(1) Да; $(2) c_{1} = -2$, $c_{2} = 1$; $(3) b = -2v_{1} + v_{2}$.",
     "(1) Нет; $(2) c_{1} = -1$, $c_{2} = 2$; $(3) b = -v_{1} + 2v_{2}$.",
     "(1) Нет; $(2) c_{1} = 2$, $c_{2} = -1$; $(3) b = 2v_{1} - v_{2}$."
    ],
    "e": "Векторы образуют линейную оболочку $\\mathbb{R}^2$, так как система имеет решение при любом b. Для b = (-7, -6) имеем c1 = 1 и c2 = 2, откуда b = v1 + 2v2."
   },
   "uz": {
    "t": "v1 = (1, 2), v2 = (3, 1) boʻlsin. (1) Ular $\\mathbb{R}^2$ ni qamrab oladimi? (2) b = (-7, -6) uchun c1 v1 + c2 v2 = b boʻladigan c1, c2 ni toping. (3) b ni formula boʻyicha ifodalang.",
    "o": [
     "(1) Ha; $(2) c_{1} = 1$, $c_{2} = 2$; $(3) b = v_{1} + 2v_{2}$.",
     "(1) Ha; $(2) c_{1} = -2$, $c_{2} = 1$; $(3) b = -2v_{1} + v_{2}$.",
     "(1) Yoʻq; $(2) c_{1} = -1$, $c_{2} = 2$; $(3) b = -v_{1} + 2v_{2}$.",
     "(1) Yoʻq; $(2) c_{1} = 2$, $c_{2} = -1$; $(3) b = 2v_{1} - v_{2}$."
    ],
    "e": "Vektorlar $\\mathbb{R}^2$ ni qamrab oladi, chunki tizim har qanday b uchun yechimga ega. b = (-7, -6) uchun c1 = 1 va c2 = 2 boʻladi, demak b = v1 + 2v2."
   }
  },
  {
   "t": "Let $u_{1} = (-1, 2)$, $u_{2} = (-3, 6)$. (1) Show they do not spanℝ². (2) Describe span{u₁, u₂} geometrically. (3) Do (1, -4) and (2, 4) belong to this span?",
   "o": [
    "(1) They don't span ℝ²; (2) A line through origin with slope -2; (3) (1, -4) no, (2, 4) no.",
    "(1) They don't span ℝ²; (2) A line through origin with slope -2; (3) (1, -4) yes, (2, 4) no.",
    "(1) They don't spanℝ²; (2) A line through origin with slope $-\\frac{1}{2}$; (3) (1, -4) no, (2, 4) yes.",
    "(1) They don't spanℝ²; (2) A line through origin with slope $-\\frac{1}{2}$; (3) (1, -4) yes, (2, 4) yes."
   ],
   "e": "$u_{2} = 3u_{1}$, so they are collinear and span only a line. The line has equation $y = -2x$. Neither (1, -4) nor (2, 4) satisfy this equation.",
   "ru": {
    "t": "Пусть $u_{1} = (-1, 2)$, $u_{2} = (-3, 6)$. (1) Покажите, что они не натягивают всю плоскость ℝ². (2) Дайте геометрическое описание span{u₁, u₂}. (3) Принадлежат ли этой линейной оболочке (1, -4) и (2, 4)?",
    "o": [
     "(1) Они не образуют линейную оболочку ℝ²; (2) прямая, проходящая через начало координат с угловым коэффициентом -2; (3) (1, -4) — нет, (2, 4) — нет.",
     "(1) Они не образуют линейную оболочку ℝ²; (2) прямая, проходящая через начало координат с угловым коэффициентом -2; (3) (1, -4) — да, (2, 4) — нет.",
     "(1) Они не образуют линейную оболочку ℝ²; (2) прямая, проходящая через начало координат с угловым коэффициентом $-\\frac{1}{2}$; (3) (1, -4) — нет, (2, 4) — да.",
     "(1) Они не образуют линейную оболочку ℝ²; (2) прямая, проходящая через начало координат с угловым коэффициентом $-\\frac{1}{2}$; (3) (1, -4) — да, (2, 4) — да."
    ],
    "e": "$u_{2} = 3u_{1}$, поэтому векторы коллинеарны и натягивают лишь прямую. Прямая задаётся уравнением $y = -2x$. Ни (1, -4), ни (2, 4) не удовлетворяют этому уравнению."
   },
   "uz": {
    "t": "$u_{1} = (-1, 2)$, $u_{2} = (-3, 6)$ boʻlsin. (1) Ular butun ℝ² ni qamrab olmasligini koʻrsating. (2) span{u₁, u₂} ni geometrik tasvirlang. (3) (1, -4) va (2, 4) ushbu qobiqqa tegishlimi?",
    "o": [
     "(1) Ular ℝ² ni qamrab olmaydi; (2) koordinatalar boshidan -2 qiyalik bilan oʻtuvchi toʻgʻri chiziq; (3) (1, -4) — yoʻq, (2, 4) — yoʻq.",
     "(1) Ular ℝ² ni qamrab olmaydi; (2) koordinatalar boshidan -2 qiyalik bilan oʻtuvchi toʻgʻri chiziq; (3) (1, -4) — ha, (2, 4) — yoʻq.",
     "(1) Ular ℝ² ni qamrab olmaydi; (2) koordinatalar boshidan $-\\frac{1}{2}$ qiyalik bilan oʻtuvchi toʻgʻri chiziq; (3) (1, -4) — yoʻq, (2, 4) — ha.",
     "(1) Ular ℝ² ni qamrab olmaydi; (2) koordinatalar boshidan $-\\frac{1}{2}$ qiyalik bilan oʻtuvchi toʻgʻri chiziq; (3) (1, -4) — ha, (2, 4) — ha."
    ],
    "e": "$u_{2} = 3u_{1}$, demak vektorlar kollinear va faqat toʻgʻri chiziqni qamrab oladi. Toʻgʻri chiziq tenglamasi $y = -2x$. Na (1, -4), na (2, 4) bu tenglamani qanoatlantirmaydi."
   }
  },
  {
   "t": "Let $v_1 = (0, 1, 1)$, $v_2 = (1, 0, 1)$, $v_3 = (1, 1, 0)$. (1) Solve $c_1 v_1 + c_2 v_2 + c_3 v_3 = b$ for arbitrary $b = (b_1, b_2, b_3)$. (2) Explain why the three vectors span $\\mathbb{R}^3$. (3) Express $(2, -5, 6)$ as a linear combination of these vectors.",
   "o": [
    "(1) $c_1 = b_1 - (b_2+b_3)/2$, $c_2 = -b_1 + (b_2+b_3)/2$, $c_3 = (b_1+b_2)/2 - b_3$; (2) The solution exists and is unique for every right-hand side; (3) $4v_1 + 2v_2$",
    "(1) $c_1 = (b_2+b_3)/2 - b_1$, $c_2 = b_1 - (b_2+b_3)/2$, $c_3 = b_3 - (b_1+b_2)/2$; (2) The vectors are linearly independent; (3) $2v_1 + 4v_2$",
    "(1) $c_1 = b_1 + (b_2+b_3)/2$, $c_2 = b_1 - (b_2+b_3)/2$, $c_3 = (b_1+b_2)/2 + b_3$; (2) The three vectors form a basis for $\\mathbb{R}^3$; (3) $2v_1 + 4v_3$",
    "(1) $c_1 = (b_1+b_2)/2 - b_3$, $c_2 = (b_1+b_3)/2 - b_2$, $c_3 = (b_2+b_3)/2 - b_1$; (2) The span of the vectors is all of $\\mathbb{R}^3$; (3) $4v_1 + 2v_3$"
   ],
   "e": "The solution is found by solving the system of equations derived from the vector equation. The vectors span $\\mathbb{R}^3$ because the system has a unique solution for any vector $b$. For the specific vector $(2, -5, 6)$, we get $c_1 = 4$, $c_2 = 2$, $c_3 = 0$.",
   "ru": {
    "t": "Пусть $v_1 = (0, 1, 1)$, $v_2 = (1, 0, 1)$, $v_3 = (1, 1, 0)$. (1) Решите $c_1 v_1 + c_2 v_2 + c_3 v_3 = b$ для произвольного $b = (b_1, b_2, b_3)$. (2) Объясните, почему три вектора образуют линейную оболочку $\\mathbb{R}^3$. (3) Выразите $(2, -5, 6)$ в виде линейной комбинации этих векторов.",
    "o": [
     "(1) $c_1 = b_1 - (b_2+b_3)/2$, $c_2 = -b_1 + (b_2+b_3)/2$, $c_3 = (b_1+b_2)/2 - b_3$; (2) решение существует и единственно для любой правой части; (3) $4v_1 + 2v_2$",
     "(1) $c_1 = (b_2+b_3)/2 - b_1$, $c_2 = b_1 - (b_2+b_3)/2$, $c_3 = b_3 - (b_1+b_2)/2$; (2) векторы линейно независимы; (3) $2v_1 + 4v_2$",
     "(1) $c_1 = b_1 + (b_2+b_3)/2$, $c_2 = b_1 - (b_2+b_3)/2$, $c_3 = (b_1+b_2)/2 + b_3$; (2) три вектора образуют базис $\\mathbb{R}^3$; (3) $2v_1 + 4v_3$",
     "(1) $c_1 = (b_1+b_2)/2 - b_3$, $c_2 = (b_1+b_3)/2 - b_2$, $c_3 = (b_2+b_3)/2 - b_1$; (2) линейная оболочка векторов — всё $\\mathbb{R}^3$; (3) $4v_1 + 2v_3$"
    ],
    "e": "Решение находится из системы уравнений, полученной из векторного равенства. Векторы образуют линейную оболочку $\\mathbb{R}^3$, потому что система имеет единственное решение для любого вектора $b$. Для конкретного вектора $(2, -5, 6)$ получаем $c_1 = 4$, $c_2 = 2$, $c_3 = 0$."
   },
   "uz": {
    "t": "$v_1 = (0, 1, 1)$, $v_2 = (1, 0, 1)$, $v_3 = (1, 1, 0)$ boʻlsin. (1) Istalgan $b = (b_1, b_2, b_3)$ uchun $c_1 v_1 + c_2 v_2 + c_3 v_3 = b$ tenglamani yeching. (2) Uch vektor nima uchun $\\mathbb{R}^3$ ni qamrab olishini tushuntiring. (3) $(2, -5, 6)$ ni bu vektorlarning chiziqli kombinatsiyasi sifatida ifodalang.",
    "o": [
     "(1) $c_1 = b_1 - (b_2+b_3)/2$, $c_2 = -b_1 + (b_2+b_3)/2$, $c_3 = (b_1+b_2)/2 - b_3$; (2) yechim har qanday oʻng qism uchun mavjud va yagona; (3) $4v_1 + 2v_2$",
     "(1) $c_1 = (b_2+b_3)/2 - b_1$, $c_2 = b_1 - (b_2+b_3)/2$, $c_3 = b_3 - (b_1+b_2)/2$; (2) vektorlar chiziqli mustaqil; (3) $2v_1 + 4v_2$",
     "(1) $c_1 = b_1 + (b_2+b_3)/2$, $c_2 = b_1 - (b_2+b_3)/2$, $c_3 = (b_1+b_2)/2 + b_3$; (2) uch vektor $\\mathbb{R}^3$ uchun bazis hosil qiladi; (3) $2v_1 + 4v_3$",
     "(1) $c_1 = (b_1+b_2)/2 - b_3$, $c_2 = (b_1+b_3)/2 - b_2$, $c_3 = (b_2+b_3)/2 - b_1$; (2) vektorlarning chiziqli qobigʻi — butun $\\mathbb{R}^3$; (3) $4v_1 + 2v_3$"
    ],
    "e": "Yechim vektor tenglamadan olingan tenglamalar tizimini yechish orqali topiladi. Vektorlar $\\mathbb{R}^3$ ni qamrab oladi, chunki tizim istalgan $b$ vektor uchun yagona yechimga ega. Aniq $(2, -5, 6)$ vektori uchun $c_1 = 4$, $c_2 = 2$, $c_3 = 0$ boʻladi."
   }
  },
  {
   "t": "Three forces act on a component: $F_{1} = (40, 10) N$, $F_{2} = (-15, 25) N$, $F_{3} = (-20, -5) N$. (1) Find the resultant force; (2) Find F4 that places the component in equilibrium: $F_{1} + F_{2} + F_{3} + F_{4} = 0$.",
   "o": [
    "(1) (5, 30) N; (2) (-5, -30) N",
    "(1) (5, 30) N; (2) (5, 30) N",
    "(1) (-5, -30) N; (2) (5, 30) N",
    "(1) (-5, -30) N; (2) (-5, -30) N"
   ],
   "e": "The resultant force is found by adding the vectors componentwise. For equilibrium, F4 must be the negative of the resultant force.",
   "ru": {
    "t": "На деталь действуют три силы: $F_{1} = (40, 10) N$, $F_{2} = (-15, 25) N$, $F_{3} = (-20, -5) N$. (1) Найдите равнодействующую силу; (2) найдите силу F4, при которой деталь находится в равновесии: $F_{1} + F_{2} + F_{3} + F_{4} = 0$.",
    "o": [
     "(1) (5, 30) Н; (2) (-5, -30) Н",
     "(1) (5, 30) Н; (2) (5, 30) Н",
     "(1) (-5, -30) Н; (2) (5, 30) Н",
     "(1) (-5, -30) Н; (2) (-5, -30) Н"
    ],
    "e": "Равнодействующая находится покомпонентным сложением векторов. Для равновесия сила F4 должна быть противоположна равнодействующей."
   },
   "uz": {
    "t": "Detalga uch kuch taʼsir qiladi: $F_{1} = (40, 10) N$, $F_{2} = (-15, 25) N$, $F_{3} = (-20, -5) N$. (1) Natijaviy kuchni toping; (2) detalni muvozanatga keltiruvchi F4 kuchini toping: $F_{1} + F_{2} + F_{3} + F_{4} = 0$.",
    "o": [
     "(1) (5, 30) N; (2) (-5, -30) N",
     "(1) (5, 30) N; (2) (5, 30) N",
     "(1) (-5, -30) N; (2) (5, 30) N",
     "(1) (-5, -30) N; (2) (-5, -30) N"
    ],
    "e": "Natijaviy kuch vektorlarni komponentalar boʻyicha qoʻshish orqali topiladi. Muvozanat uchun F4 kuchi natijaviy kuchga qarama-qarshi boʻlishi kerak."
   }
  },
  {
   "t": "Let $a = (-1, 3, 2)$, $b = (4, 0, -2)$. Compute $a + b$ and $3a - b$; find the midpoint between $a$ and $b$.",
   "o": [
    "$a + b = (3, 3, 0); 3a - b = (-7, 9, 8); midpoint = (1.5, 1.5, 0)$",
    "$a + b = (-5, 3, 0); 3a - b = (-7, 9, 8); midpoint = (1.5, 1.5, 0)$",
    "$a + b = (3, 3, 0); 3a - b = (-7, 9, 8); midpoint = (3, 3, 0)$",
    "$a + b = (3, 3, 0); 3a - b = (7, -9, -8); midpoint = (1.5, 1.5, 0)$"
   ],
   "e": "Vector addition and scalar multiplication are performed componentwise. The midpoint is found by averaging the corresponding components of $a$ and $b$.",
   "ru": {
    "t": "Пусть $a = (-1, 3, 2)$, $b = (4, 0, -2)$. Вычислите $a + b$ и $3a - b$; найдите середину отрезка между $a$ и $b$.",
    "o": [
     "$a + b = (3, 3, 0); 3a - b = (-7, 9, 8); midpoint = (1.5, 1.5, 0)$",
     "$a + b = (-5, 3, 0); 3a - b = (-7, 9, 8); midpoint = (1.5, 1.5, 0)$",
     "$a + b = (3, 3, 0); 3a - b = (-7, 9, 8); midpoint = (3, 3, 0)$",
     "$a + b = (3, 3, 0); 3a - b = (7, -9, -8); midpoint = (1.5, 1.5, 0)$"
    ],
    "e": "Сложение векторов и умножение на скаляр выполняются покомпонентно. Середина находится усреднением соответствующих компонент векторов $a$ и $b$."
   },
   "uz": {
    "t": "$a = (-1, 3, 2)$, $b = (4, 0, -2)$ boʻlsin. $a + b$ va $3a - b$ ni hisoblang; $a$ va $b$ orasidagi oʻrta nuqtani toping.",
    "o": [
     "$a + b = (3, 3, 0); 3a - b = (-7, 9, 8); midpoint = (1.5, 1.5, 0)$",
     "$a + b = (-5, 3, 0); 3a - b = (-7, 9, 8); midpoint = (1.5, 1.5, 0)$",
     "$a + b = (3, 3, 0); 3a - b = (-7, 9, 8); midpoint = (3, 3, 0)$",
     "$a + b = (3, 3, 0); 3a - b = (7, -9, -8); midpoint = (1.5, 1.5, 0)$"
    ],
    "e": "Vektorlarni qoʻshish va skalyarga koʻpaytirish komponentalar boʻyicha bajariladi. Oʻrta nuqta $a$ va $b$ vektorlarining mos komponentalarini oʻrtacha arifmetigini olish orqali topiladi."
   }
  },
  {
   "t": "Given $p + q = (5, 7)$ and $p - q = (-1, 3)$, find p and q.",
   "o": [
    "$p = (2, 5)$, $q = (3, 2)$",
    "$p = (6, 4)$, $q = (4, 10)$",
    "$p = (3, 2)$, $q = (2, 5)$",
    "$p = (4, 10)$, $q = (6, 4)$"
   ],
   "e": "Adding the two equations gives $2p = (4, 10)$, so $p = (2, 5)$. Subtracting the second equation from the first gives $2q = (6, 4)$, so $q = (3, 2)$.",
   "ru": {
    "t": "Дано $p + q = (5, 7)$ и $p - q = (-1, 3)$; найдите p и q.",
    "o": [
     "$p = (2, 5)$, $q = (3, 2)$",
     "$p = (6, 4)$, $q = (4, 10)$",
     "$p = (3, 2)$, $q = (2, 5)$",
     "$p = (4, 10)$, $q = (6, 4)$"
    ],
    "e": "Складывая оба уравнения, получаем $2p = (4, 10)$, откуда $p = (2, 5)$. Вычитая второе уравнение из первого, получаем $2q = (6, 4)$, откуда $q = (3, 2)$."
   },
   "uz": {
    "t": "$p + q = (5, 7)$ va $p - q = (-1, 3)$ berilgan; p va q ni toping.",
    "o": [
     "$p = (2, 5)$, $q = (3, 2)$",
     "$p = (6, 4)$, $q = (4, 10)$",
     "$p = (3, 2)$, $q = (2, 5)$",
     "$p = (4, 10)$, $q = (6, 4)$"
    ],
    "e": "Ikkala tenglamani qoʻshsak, $2p = (4, 10)$ boʻladi, demak $p = (2, 5)$. Ikkinchi tenglamani birinchisidan ayirsak, $2q = (6, 4)$ boʻladi, demak $q = (3, 2)$."
   }
  },
  {
   "t": "Let $u = (1, 2, -1)$, $v = (2, -1, 0)$. Compute -u + 3v; write cu + dv componentwise; can cu + dv equal (5, 0, -1)?",
   "o": [
    "$-u + 3v = (5, -5, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; yes, with $c = 1$, $d = 2$",
    "$-u + 3v = (5, -5, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; no, because $2c - d \\ne 0$",
    "$-u + 3v = (-1, -2, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; yes, with $c = 1$, $d = 2$",
    "$-u + 3v = (5, -5, 1)$; $cu + dv = (c - 2d, 2c + d, -c)$; no, because $c \\ne 1$"
   ],
   "e": "The calculation $-u + 3v = (-1, -2, 1) + (6, -3, 0) = (5, -5, 1)$. Componentwise, $cu + dv = (c + 2d, 2c - d, -c)$. Setting this equal to (5, 0, -1) gives $c = 1$ from the third component, then $d = 2$ from the first component, and $2c - d = 0$ is satisfied.",
   "ru": {
    "t": "Пусть $u = (1, 2, -1)$, $v = (2, -1, 0)$. Вычислите -u + 3v; запишите cu + dv покомпонентно; может ли cu + dv равняться (5, 0, -1)?",
    "o": [
     "$-u + 3v = (5, -5, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; да, при $c = 1$, $d = 2$",
     "$-u + 3v = (5, -5, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; нет, так как $2c - d \\ne 0$",
     "$-u + 3v = (-1, -2, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; да, при $c = 1$, $d = 2$",
     "$-u + 3v = (5, -5, 1)$; $cu + dv = (c - 2d, 2c + d, -c)$; нет, так как $c \\ne 1$"
    ],
    "e": "Вычисление: $-u + 3v = (-1, -2, 1) + (6, -3, 0) = (5, -5, 1)$. Покомпонентно $cu + dv = (c + 2d, 2c - d, -c)$. Приравнивая это к (5, 0, -1), из третьей компоненты получаем $c = 1$, затем из первой компоненты $d = 2$, и условие $2c - d = 0$ выполняется."
   },
   "uz": {
    "t": "$u = (1, 2, -1)$, $v = (2, -1, 0)$ boʻlsin. -u + 3v ni hisoblang; cu + dv ni komponentalar boʻyicha yozing; cu + dv = (5, 0, -1) boʻlishi mumkinmi?",
    "o": [
     "$-u + 3v = (5, -5, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; ha, $c = 1$, $d = 2$ bilan",
     "$-u + 3v = (5, -5, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; yoʻq, chunki $2c - d \\ne 0$",
     "$-u + 3v = (-1, -2, 1)$; $cu + dv = (c + 2d, 2c - d, -c)$; ha, $c = 1$, $d = 2$ bilan",
     "$-u + 3v = (5, -5, 1)$; $cu + dv = (c - 2d, 2c + d, -c)$; yoʻq, chunki $c \\ne 1$"
    ],
    "e": "Hisob: $-u + 3v = (-1, -2, 1) + (6, -3, 0) = (5, -5, 1)$. Komponentalar boʻyicha $cu + dv = (c + 2d, 2c - d, -c)$. Buni (5, 0, -1) ga tenglashtirsak, uchinchi komponentadan $c = 1$, soʻng birinchi komponentadan $d = 2$ boʻladi va $2c - d = 0$ sharti bajariladi."
   }
  },
  {
   "t": "Let $r = (2, -1)$, $s = (-6, 3)$. Describe all combinations cr + ds; do the vectors span R2? Find a dependence relation.",
   "o": [
    "All combinations are multiples of r; they do not span R2; dependence relation: $3r + s = 0$",
    "All combinations are multiples of r; they span R2; dependence relation: $r - 3s = 0$",
    "All combinations are multiples of s; they span R2; dependence relation: $2r + s = 0$",
    "All combinations are multiples of s; they do not span R2; dependence relation: $r + 3s = 0$"
   ],
   "e": "Since $s = -3r$, every combination $cr + ds = (c - 3d)r$ is a multiple of r, so the span is only the line through r, not the entire plane R2. The vectors are dependent with the relation $3r + s = 0$.",
   "ru": {
    "t": "Пусть $r = (2, -1)$, $s = (-6, 3)$. Опишите все комбинации cr + ds; образуют ли векторы линейную оболочку R2? Найдите соотношение зависимости.",
    "o": [
     "Все комбинации кратны r; они не образуют линейную оболочку R2; соотношение зависимости: $3r + s = 0$",
     "Все комбинации кратны r; они образуют линейную оболочку R2; соотношение зависимости: $r - 3s = 0$",
     "Все комбинации кратны s; они образуют линейную оболочку R2; соотношение зависимости: $2r + s = 0$",
     "Все комбинации кратны s; они не образуют линейную оболочку R2; соотношение зависимости: $r + 3s = 0$"
    ],
    "e": "Поскольку $s = -3r$, каждая комбинация $cr + ds = (c - 3d)r$ кратна r, поэтому оболочка — лишь прямая, проходящая через r, а не вся плоскость R2. Векторы зависимы, соотношение: $3r + s = 0$."
   },
   "uz": {
    "t": "$r = (2, -1)$, $s = (-6, 3)$ boʻlsin. cr + ds kombinatsiyalarining barchasini tasvirlang; vektorlar R2 ni qamrab oladimi? Bogʻlanish munosabatini toping.",
    "o": [
     "Barcha kombinatsiyalar r ga karrali; ular R2 ni qamrab olmaydi; bogʻlanish munosabati: $3r + s = 0$",
     "Barcha kombinatsiyalar r ga karrali; ular R2 ni qamrab oladi; bogʻlanish munosabati: $r - 3s = 0$",
     "Barcha kombinatsiyalar s ga karrali; ular R2 ni qamrab oladi; bogʻlanish munosabati: $2r + s = 0$",
     "Barcha kombinatsiyalar s ga karrali; ular R2 ni qamrab olmaydi; bogʻlanish munosabati: $r + 3s = 0$"
    ],
    "e": "$s = -3r$ boʻlgani uchun har bir $cr + ds = (c - 3d)r$ kombinatsiyasi r ga karrali, demak qobiq faqat r dan oʻtuvchi toʻgʻri chiziq, butun R2 tekisligi emas. Vektorlar bogʻliq, munosabat: $3r + s = 0$."
   }
  },
  {
   "t": "Let $v = (1, 0, 1)$, $w = (1, 2, 0)$. Write $cv + dw = (x, y, z)$; find one equation connecting x, y, z; test $b = (4, 6, 1)$.",
   "o": [
    "cv + dw = ($c + d$, $2d$, $c$); equation: $x = z + \\frac{y}{2}$; b lies in the plane",
    "cv + dw = ($c + d$, $2d$, $c$); equation: $x = z - \\frac{y}{2}$; b lies in the plane",
    "cv + dw = ($c + d$, $2d$, $c$); equation: $x = z + 2y$; b does not lie in the plane",
    "cv + dw = ($c + d$, $2d$, $c$); equation: $x = z + 2y$; b lies in the plane"
   ],
   "e": "cv + dw = ($c + d$, $2d$, $c$) = ($x$, $y$, $z$). From the components, we have $z = c$ and $y = 2d$, so $x = c + d = z + \\frac{y}{2}$. For b = (4, 6, 1), we check if $4 = 1 + \\frac{6}{2}$, which is true, so b lies in the plane.",
   "ru": {
    "t": "Пусть $v = (1, 0, 1)$, $w = (1, 2, 0)$. Запишите $cv + dw = (x, y, z)$; найдите одно уравнение, связывающее x, y, z; проверьте $b = (4, 6, 1)$.",
    "o": [
     "cv + dw = ($c + d$, $2d$, $c$); уравнение: $x = z + \\frac{y}{2}$; b лежит в этой плоскости",
     "cv + dw = ($c + d$, $2d$, $c$); уравнение: $x = z - \\frac{y}{2}$; b лежит в этой плоскости",
     "cv + dw = ($c + d$, $2d$, $c$); уравнение: $x = z + 2y$; b не лежит в этой плоскости",
     "cv + dw = ($c + d$, $2d$, $c$); уравнение: $x = z + 2y$; b лежит в этой плоскости"
    ],
    "e": "cv + dw = ($c + d$, $2d$, $c$) = ($x$, $y$, $z$). Из компонент имеем $z = c$ и $y = 2d$, поэтому $x = c + d = z + \\frac{y}{2}$. Для b = (4, 6, 1) проверяем $4 = 1 + \\frac{6}{2}$ — верно, значит b лежит в плоскости."
   },
   "uz": {
    "t": "$v = (1, 0, 1)$, $w = (1, 2, 0)$ boʻlsin. $cv + dw = (x, y, z)$ koʻrinishida yozing; x, y, z ni bogʻlovchi bitta tenglama toping; $b = (4, 6, 1)$ ni tekshiring.",
    "o": [
     "cv + dw = ($c + d$, $2d$, $c$); tenglama: $x = z + \\frac{y}{2}$; b shu tekislikda yotadi",
     "cv + dw = ($c + d$, $2d$, $c$); tenglama: $x = z - \\frac{y}{2}$; b shu tekislikda yotadi",
     "cv + dw = ($c + d$, $2d$, $c$); tenglama: $x = z + 2y$; b shu tekislikda yotmaydi",
     "cv + dw = ($c + d$, $2d$, $c$); tenglama: $x = z + 2y$; b shu tekislikda yotadi"
    ],
    "e": "cv + dw = ($c + d$, $2d$, $c$) = ($x$, $y$, $z$). Komponentalardan $z = c$ va $y = 2d$ boʻladi, demak $x = c + d = z + \\frac{y}{2}$. b = (4, 6, 1) uchun $4 = 1 + \\frac{6}{2}$ ekanini tekshiramiz — toʻgʻri, demak b tekislikda yotadi."
   }
  },
  {
   "t": "Find c, d so that $c(1, 2) + d(3, -1) = (7, 3)$; write and solve the component equations.",
   "o": [
    "$c + 3d = 7$, $2c - d = 3$; $c = \\frac{16}{7}$, $d = \\frac{5}{7}$",
    "$c + 3d = 7$, $2c - d = 3$; $c = \\frac{16}{7}$, $d = \\frac{19}{7}$",
    "$c + 3d = 7$, $2c - d = 3$; $c = 3$, $d = \\frac{4}{3}$",
    "$c + 3d = 7$, $2c - d = 3$; $c = 2$, $d = \\frac{5}{3}$"
   ],
   "e": "The component equations are $c + 3d = 7$ and $2c - d = 3$. Solving the second equation for d gives $d = 2c - 3$. Substituting into the first equation gives $c + 6c - 9 = 7$, so $7c = 16$, $c = \\frac{16}{7}$, and $d = 2(\\frac{16}{7}) - 3 = \\frac{32}{7} - \\frac{21}{7} = \\frac{11}{7}$.",
   "ru": {
    "t": "Найдите c, d такие, что $c(1, 2) + d(3, -1) = (7, 3)$; запишите и решите покомпонентные уравнения.",
    "o": [
     "$c + 3d = 7$, $2c - d = 3$; $c = \\frac{16}{7}$, $d = \\frac{5}{7}$",
     "$c + 3d = 7$, $2c - d = 3$; $c = \\frac{16}{7}$, $d = \\frac{19}{7}$",
     "$c + 3d = 7$, $2c - d = 3$; $c = 3$, $d = \\frac{4}{3}$",
     "$c + 3d = 7$, $2c - d = 3$; $c = 2$, $d = \\frac{5}{3}$"
    ],
    "e": "Покомпонентные уравнения: $c + 3d = 7$ и $2c - d = 3$. Выражая d из второго уравнения, получаем $d = 2c - 3$. Подстановка в первое уравнение даёт $c + 6c - 9 = 7$, откуда $7c = 16$, $c = \\frac{16}{7}$ и $d = 2(\\frac{16}{7}) - 3 = \\frac{32}{7} - \\frac{21}{7} = \\frac{11}{7}$."
   },
   "uz": {
    "t": "$c(1, 2) + d(3, -1) = (7, 3)$ boʻladigan c, d ni toping; komponentalar tenglamalarini yozib, yeching.",
    "o": [
     "$c + 3d = 7$, $2c - d = 3$; $c = \\frac{16}{7}$, $d = \\frac{5}{7}$",
     "$c + 3d = 7$, $2c - d = 3$; $c = \\frac{16}{7}$, $d = \\frac{19}{7}$",
     "$c + 3d = 7$, $2c - d = 3$; $c = 3$, $d = \\frac{4}{3}$",
     "$c + 3d = 7$, $2c - d = 3$; $c = 2$, $d = \\frac{5}{3}$"
    ],
    "e": "Komponentalar tenglamalari: $c + 3d = 7$ va $2c - d = 3$. Ikkinchi tenglamadan d ni ifodasak, $d = 2c - 3$ boʻladi. Birinchisiga qoʻysak, $c + 6c - 9 = 7$ boʻladi, demak $7c = 16$, $c = \\frac{16}{7}$ va $d = 2(\\frac{16}{7}) - 3 = \\frac{32}{7} - \\frac{21}{7} = \\frac{11}{7}$."
   }
  },
  {
   "t": "Let $u = (1, 1, 0)$, $v = (0, 1, 1)$, $w = (1, 2, 1)$. Does w add a new direction? Describe span{u, v, w}; give a relation equal to zero.",
   "o": [
    "No, w adds no new direction; span is a plane; relation: $u + v - w = 0$",
    "Yes, w adds a new direction; span is all of R3; relation: $u + v - w = 0$",
    "Yes, w adds a new direction; span is a plane; relation: $u - v + w = 0$",
    "No, w adds no new direction; span is a line; relation: $u + v + w = 0$"
   ],
   "e": "$w = u + v$, so w is redundant and adds no new direction. The vectors are dependent with relation $u + v - w = 0$, and they span the plane formed by u and v.",
   "ru": {
    "t": "Пусть $u = (1, 1, 0)$, $v = (0, 1, 1)$, $w = (1, 2, 1)$. Добавляет ли w новое направление? Опишите span{u, v, w}; приведите соотношение, равное нулю.",
    "o": [
     "Нет, w не добавляет нового направления; оболочка — плоскость; соотношение: $u + v - w = 0$",
     "Да, w добавляет новое направление; оболочка — всё R3; соотношение: $u + v - w = 0$",
     "Да, w добавляет новое направление; оболочка — плоскость; соотношение: $u - v + w = 0$",
     "Нет, w не добавляет нового направления; оболочка — прямая; соотношение: $u + v + w = 0$"
    ],
    "e": "$w = u + v$, поэтому w избыточен и не добавляет нового направления. Векторы зависимы с соотношением $u + v - w = 0$, и они образуют плоскость, натянутую на u и v."
   },
   "uz": {
    "t": "$u = (1, 1, 0)$, $v = (0, 1, 1)$, $w = (1, 2, 1)$ boʻlsin. w yangi yoʻnalish qoʻshadimi? span{u, v, w} ni tasvirlang; nolga teng bogʻlanishni keltiring.",
    "o": [
     "Yoʻq, w yangi yoʻnalish qoʻshmaydi; qobiq — tekislik; bogʻlanish: $u + v - w = 0$",
     "Ha, w yangi yoʻnalish qoʻshadi; qobiq — butun R3; bogʻlanish: $u + v - w = 0$",
     "Ha, w yangi yoʻnalish qoʻshadi; qobiq — tekislik; bogʻlanish: $u - v + w = 0$",
     "Yoʻq, w yangi yoʻnalish qoʻshmaydi; qobiq — toʻgʻri chiziq; bogʻlanish: $u + v + w = 0$"
    ],
    "e": "$w = u + v$, demak w ortiqcha va yangi yoʻnalish qoʻshmaydi. Vektorlar $u + v - w = 0$ bogʻlanishi bilan bogʻliq va ular u hamda v ustidagi tekislikni qamrab oladi."
   }
  },
  {
   "t": "In R3, can two vectors span all of R3? Can three vectors span R3 and still be dependent? Explain using 'new directions'.",
   "o": [
    "Two vectors cannot span R3; three dependent vectors cannot span R3 because they only have at most two directions",
    "Two vectors can span R3; three dependent vectors cannot span R3 because they only have two directions",
    "Two vectors can span R3; three dependent vectors can span R3 if they have three directions",
    "Two vectors cannot span R3; three dependent vectors can span R3 if they have three directions"
   ],
   "e": "Two vectors can contribute at most two directions, insufficient for R3. Three dependent vectors have at most two independent directions, so they also cannot span R3.",
   "ru": {
    "t": "В R3 могут ли два вектора образовать линейную оболочку всего R3? Могут ли три вектора образовывать R3 и при этом быть зависимыми? Объясните с помощью «новых направлений».",
    "o": [
     "Два вектора не могут образовать R3; три зависимых вектора не могут образовать R3, так как имеют не более двух направлений",
     "Два вектора могут образовать R3; три зависимых вектора не могут образовать R3, так как имеют лишь два направления",
     "Два вектора могут образовать R3; три зависимых вектора могут образовать R3, если имеют три направления",
     "Два вектора не могут образовать R3; три зависимых вектора могут образовать R3, если имеют три направления"
    ],
    "e": "Два вектора дают не более двух направлений — этого недостаточно для R3. Три зависимых вектора имеют не более двух независимых направлений, поэтому они тоже не могут образовать R3."
   },
   "uz": {
    "t": "R3 da ikki vektor butun R3 ni qamrab olishi mumkinmi? Uch vektor R3 ni qamrab olib, ayni paytda bogʻliq boʻlishi mumkinmi? «Yangi yoʻnalishlar» tushunchasi yordamida tushuntiring.",
    "o": [
     "Ikki vektor R3 ni qamrab ololmaydi; uch bogʻliq vektor R3 ni qamrab ololmaydi, chunki ularning koʻpi bilan ikkita yoʻnalishi bor",
     "Ikki vektor R3 ni qamrab olishi mumkin; uch bogʻliq vektor R3 ni qamrab ololmaydi, chunki ularning faqat ikkita yoʻnalishi bor",
     "Ikki vektor R3 ni qamrab olishi mumkin; uch bogʻliq vektor uchta yoʻnalishga ega boʻlsa, R3 ni qamrab olishi mumkin",
     "Ikki vektor R3 ni qamrab ololmaydi; uch bogʻliq vektor uchta yoʻnalishga ega boʻlsa, R3 ni qamrab olishi mumkin"
    ],
    "e": "Ikki vektor koʻpi bilan ikkita yoʻnalish beradi — bu R3 uchun yetarli emas. Uch bogʻliq vektorning koʻpi bilan ikkita mustaqil yoʻnalishi bor, shuning uchun ular ham R3 ni qamrab ololmaydi."
   }
  },
  {
   "t": "Let $u = (3, -2)$ and $v = (4, 5)$. Compute the dot product u · v and classify the angle between them.",
   "o": [
    "$u \\cdot v = 2$, angle is acute",
    "$u \\cdot v = 2$, angle is right",
    "$u \\cdot v = -2$, angle is obtuse",
    "$u \\cdot v = 38$, angle is acute"
   ],
   "e": "The dot product is calculated as $3\\cdot 4 + (-2)\\cdot 5 = 12 - 10 = 2$. Since the dot product is positive, the angle between the vectors is acute.",
   "ru": {
    "t": "Пусть $u = (3, -2)$ и $v = (4, 5)$. Вычислите скалярное произведение u · v и классифицируйте угол между ними.",
    "o": [
     "$u \\cdot v = 2$, угол острый",
     "$u \\cdot v = 2$, угол прямой",
     "$u \\cdot v = -2$, угол тупой",
     "$u \\cdot v = 38$, угол острый"
    ],
    "e": "Скалярное произведение вычисляется как $3\\cdot 4 + (-2)\\cdot 5 = 12 - 10 = 2$. Поскольку скалярное произведение положительно, угол между векторами острый."
   },
   "uz": {
    "t": "$u = (3, -2)$ va $v = (4, 5)$ boʻlsin. u · v skalyar koʻpaytmasini hisoblang va ular orasidagi burchakni tasniflang.",
    "o": [
     "$u \\cdot v = 2$, burchak oʻtkir",
     "$u \\cdot v = 2$, burchak toʻgʻri",
     "$u \\cdot v = -2$, burchak oʻtmas",
     "$u \\cdot v = 38$, burchak oʻtkir"
    ],
    "e": "Skalyar koʻpaytma $3\\cdot 4 + (-2)\\cdot 5 = 12 - 10 = 2$ deb hisoblanadi. Skalyar koʻpaytma musbat boʻlgani uchun vektorlar orasidagi burchak oʻtkir."
   }
  },
  {
   "t": "With $u = (-1, 2, -1)$ and $v = (3, -1, 2)$, find the magnitude of u (||u||) and the distance between u and v.",
   "o": [
    "$||u|| = 3$, dist(u, v) = $\\sqrt{29}$",
    "$||u|| = \\sqrt{6}$, dist(u, v) = 29",
    "$||u|| = \\sqrt{6}$, dist(u, v) = $\\sqrt{29}$",
    "$||u|| = 3$, dist(u, v) = 29"
   ],
   "e": "The magnitude of u is calculated as $\\sqrt{(-1)^{2} + 2^{2} + (-1)^{2}} = \\sqrt{6}$ ≈ 3. The distance between u and v is $||u - v|| = \\sqrt{(-4)^{2} + 3^{2} + (-3)^{2}} = \\sqrt{29}$.",
   "ru": {
    "t": "Для $u = (-1, 2, -1)$ и $v = (3, -1, 2)$ найдите длину u (||u||) и расстояние между u и v.",
    "o": [
     "$||u|| = 3$, dist(u, v) = $\\sqrt{29}$",
     "$||u|| = \\sqrt{6}$, dist(u, v) = 29",
     "$||u|| = \\sqrt{6}$, dist(u, v) = $\\sqrt{29}$",
     "$||u|| = 3$, dist(u, v) = 29"
    ],
    "e": "Длина u вычисляется как $\\sqrt{(-1)^{2} + 2^{2} + (-1)^{2}} = \\sqrt{6}$ ≈ 3. Расстояние между u и v равно $||u - v|| = \\sqrt{(-4)^{2} + 3^{2} + (-3)^{2}} = \\sqrt{29}$."
   },
   "uz": {
    "t": "$u = (-1, 2, -1)$ va $v = (3, -1, 2)$ uchun u ning uzunligini (||u||) hamda u va v orasidagi masofani toping.",
    "o": [
     "$||u|| = 3$, dist(u, v) = $\\sqrt{29}$",
     "$||u|| = \\sqrt{6}$, dist(u, v) = 29",
     "$||u|| = \\sqrt{6}$, dist(u, v) = $\\sqrt{29}$",
     "$||u|| = 3$, dist(u, v) = 29"
    ],
    "e": "u ning uzunligi $\\sqrt{(-1)^{2} + 2^{2} + (-1)^{2}} = \\sqrt{6}$ ≈ 3 deb hisoblanadi. u va v orasidagi masofa esa $||u - v|| = \\sqrt{(-4)^{2} + 3^{2} + (-3)^{2}} = \\sqrt{29}$ ga teng."
   }
  },
  {
   "t": "Find k so that u = [$k$, 6] is orthogonal to v = [1, -1, √(4)].",
   "o": [
    "$k = -2$",
    "$k = 2$",
    "$k = -4$",
    "$k = 4$"
   ],
   "e": "For orthogonality, u · v = 0: $k(1) + 6(-1) + \\sqrt{4}(0) = k - 6 = 0$, so $k = -2$.",
   "ru": {
    "t": "Найдите k так, чтобы u = [$k$, 6] был ортогонален v = [1, -1, √(4)].",
    "o": [
     "$k = -2$",
     "$k = 2$",
     "$k = -4$",
     "$k = 4$"
    ],
    "e": "Для ортогональности u · v = 0: $k(1) + 6(-1) + \\sqrt{4}(0) = k - 6 = 0$, откуда $k = -2$."
   },
   "uz": {
    "t": "u = [$k$, 6] vektori v = [1, -1, √(4)] vektorga ortogonal boʻlishi uchun k ni toping.",
    "o": [
     "$k = -2$",
     "$k = 2$",
     "$k = -4$",
     "$k = 4$"
    ],
    "e": "Ortogonallik uchun u · v = 0 boʻlishi kerak: $k(1) + 6(-1) + \\sqrt{4}(0) = k - 6 = 0$, bundan $k = -2$."
   }
  },
  {
   "t": "Find the angle between $u = [1, 1]$ and $v = [1, -1]$.",
   "o": [
    "90 degrees",
    "0 degrees",
    "45 degrees",
    "180 degrees"
   ],
   "e": "$u \\cdot v = 1(1) + 1(-1) = 0$. When the dot product is zero, the vectors are perpendicular, so $θ = 90$ degrees.",
   "ru": {
    "t": "Найдите угол между $u = [1, 1]$ и $v = [1, -1]$.",
    "o": [
     "90 градусов",
     "0 градусов",
     "45 градусов",
     "180 градусов"
    ],
    "e": "$u \\cdot v = 1(1) + 1(-1) = 0$. Когда скалярное произведение равно нулю, векторы перпендикулярны, поэтому $θ = 90$ градусов."
   },
   "uz": {
    "t": "$u = [1, 1]$ va $v = [1, -1]$ vektorlar orasidagi burchakni toping.",
    "o": [
     "90 daraja",
     "0 daraja",
     "45 daraja",
     "180 daraja"
    ],
    "e": "$u \\cdot v = 1(1) + 1(-1) = 0$. Skalyar koʻpaytma nol boʻlganda vektorlar perpendikulyar boʻladi, shuning uchun $θ = 90$ daraja."
   }
  },
  {
   "t": "Project $u = [4, 1]$ onto $v = [1, 1]$.",
   "o": [
    "$proj_{v} u = [3, 3]$",
    "$proj_{v} u = [2, 2]$",
    "$proj_{v} u = [1, 1]$",
    "$proj_{v} u = [4, 4]$"
   ],
   "e": "proj_v u = ((u · v)/(v · v))v = ((4+1)/(1+1))v = ($5/2$)v = [$5/2$, $5/2$]. The remainder $u - (5/2)v = [-3/2$, $-3/2$] is orthogonal to $v$.",
   "ru": {
    "t": "Спроецируйте $u = [4, 1]$ на $v = [1, 1]$.",
    "o": [
     "$proj_{v} u = [3, 3]$",
     "$proj_{v} u = [2, 2]$",
     "$proj_{v} u = [1, 1]$",
     "$proj_{v} u = [4, 4]$"
    ],
    "e": "proj_v u = ((u · v)/(v · v))v = ((4+1)/(1+1))v = ($5/2$)v = [$5/2$, $5/2$]. Остаток $u - (5/2)v = [-3/2$, $-3/2$] ортогонален $v$."
   },
   "uz": {
    "t": "$u = [4, 1]$ vektorini $v = [1, 1]$ vektorga proyeksiyalang.",
    "o": [
     "$proj_{v} u = [3, 3]$",
     "$proj_{v} u = [2, 2]$",
     "$proj_{v} u = [1, 1]$",
     "$proj_{v} u = [4, 4]$"
    ],
    "e": "proj_v u = ((u · v)/(v · v))v = ((4+1)/(1+1))v = ($5/2$)v = [$5/2$, $5/2$]. Qoldiq $u - (5/2)v = [-3/2$, $-3/2$] esa $v$ ga ortogonal."
   }
  },
  {
   "t": "Compute $u \\times v$ for $u = (3, 1, 0)$ and $v = (1, 3, 1)$, and verify orthogonality.",
   "o": [
    "$u \\times v = (1, -3, 8)$",
    "$u \\times v = (1, -3, -8)$",
    "$u \\times v = (-1, 3, -8)$",
    "$u \\times v = (1, 3, 8)$"
   ],
   "e": "By the determinant formula: ($u_2v_3-u_3v_2$, $u_3v_1-u_1v_3$, $u_1v_2-u_2v_1$) = ($1\\cdot1-0\\cdot3$, $0\\cdot1-3\\cdot1$, $3\\cdot3-1\\cdot1$) = ($1$, $-3$, $8$). Check: $u\\cdot(u\\times v) = 3-3+0 = 0$ and $v\\cdot(u\\times v) = 1-9+8 = 0$.",
   "ru": {
    "t": "Вычислите $u \\times v$ для $u = (3, 1, 0)$ и $v = (1, 3, 1)$ и проверьте ортогональность.",
    "o": [
     "$u \\times v = (1, -3, 8)$",
     "$u \\times v = (1, -3, -8)$",
     "$u \\times v = (-1, 3, -8)$",
     "$u \\times v = (1, 3, 8)$"
    ],
    "e": "По формуле определителя: ($u_2v_3-u_3v_2$, $u_3v_1-u_1v_3$, $u_1v_2-u_2v_1$) = ($1\\cdot1-0\\cdot3$, $0\\cdot1-3\\cdot1$, $3\\cdot3-1\\cdot1$) = ($1$, $-3$, $8$). Проверка: $u\\cdot(u\\times v) = 3-3+0 = 0$ и $v\\cdot(u\\times v) = 1-9+8 = 0$."
   },
   "uz": {
    "t": "$u = (3, 1, 0)$ va $v = (1, 3, 1)$ uchun $u \\times v$ ni hisoblang va ortogonallikni tekshiring.",
    "o": [
     "$u \\times v = (1, -3, 8)$",
     "$u \\times v = (1, -3, -8)$",
     "$u \\times v = (-1, 3, -8)$",
     "$u \\times v = (1, 3, 8)$"
    ],
    "e": "Determinant formulasi boʻyicha: ($u_2v_3-u_3v_2$, $u_3v_1-u_1v_3$, $u_1v_2-u_2v_1$) = ($1\\cdot1-0\\cdot3$, $0\\cdot1-3\\cdot1$, $3\\cdot3-1\\cdot1$) = ($1$, $-3$, $8$). Tekshirish: $u\\cdot(u\\times v) = 3-3+0 = 0$ va $v\\cdot(u\\times v) = 1-9+8 = 0$."
   }
  },
  {
   "t": "Find the area of the parallelogram with adjacent sides $a = (0, -1, 2)$ and $b = (3, -1, 1)$.",
   "o": [
    "$\\sqrt{54}$",
    "$\\sqrt{45}$",
    "$\\sqrt{63}$",
    "$\\sqrt{36}$"
   ],
   "e": "The cross product a × b = (-3, 5, 3), and its magnitude is $\\sqrt{((-3)^{2} + 5^{2} + 3^{2})} = \\sqrt{54}$.",
   "ru": {
    "t": "Найдите площадь параллелограмма со смежными сторонами $a = (0, -1, 2)$ и $b = (3, -1, 1)$.",
    "o": [
     "$\\sqrt{54}$",
     "$\\sqrt{45}$",
     "$\\sqrt{63}$",
     "$\\sqrt{36}$"
    ],
    "e": "Векторное произведение a × b = (-3, 5, 3), а его длина равна $\\sqrt{((-3)^{2} + 5^{2} + 3^{2})} = \\sqrt{54}$."
   },
   "uz": {
    "t": "$a = (0, -1, 2)$ va $b = (3, -1, 1)$ qoʻshni tomonlarga ega parallelogrammning yuzasini toping.",
    "o": [
     "$\\sqrt{54}$",
     "$\\sqrt{45}$",
     "$\\sqrt{63}$",
     "$\\sqrt{36}$"
    ],
    "e": "Vektor koʻpaytma a × b = (-3, 5, 3), uning uzunligi esa $\\sqrt{((-3)^{2} + 5^{2} + 3^{2})} = \\sqrt{54}$ ga teng."
   }
  },
  {
   "t": "For A = $\\begin{pmatrix}1 & 2 & -2 \\ 0 & 3 & 4\\end{pmatrix}$, state its size, find a13, a22, and write columns a1 and a3.",
   "o": [
    "$2\\times 3$, a13=-2, a22=3, $a_{1}=[1,0]$, $a_{3}=[-2,4]$",
    "$2\\times 3$, a13=2, a22=3, $a_{1}=[1,0]$, $a_{3}=[2,4]$",
    "$3\\times 2$, a13=-2, a22=3, $a_{1}=[1,0]$, $a_{3}=[-2,4]$",
    "$2\\times 3$, a13=-2, a22=0, $a_{1}=[1,0]$, $a_{3}=[-2,4]$"
   ],
   "e": "Matrix A has 2 rows and 3 columns. a13 is the element in row 1, column 3 ($-2$), and a22 is the element in row 2, column 2 ($3$). Column a1 is [1, 0] and a3 is [-2, 4].",
   "ru": {
    "t": "Для A = $\\begin{pmatrix}1 & 2 & -2 \\ 0 & 3 & 4\\end{pmatrix}$ укажите её размер, найдите a13, a22 и запишите столбцы a1 и a3.",
    "o": [
     "$2\\times 3$, a13=-2, a22=3, $a_{1}=[1,0]$, $a_{3}=[-2,4]$",
     "$2\\times 3$, a13=2, a22=3, $a_{1}=[1,0]$, $a_{3}=[2,4]$",
     "$3\\times 2$, a13=-2, a22=3, $a_{1}=[1,0]$, $a_{3}=[-2,4]$",
     "$2\\times 3$, a13=-2, a22=0, $a_{1}=[1,0]$, $a_{3}=[-2,4]$"
    ],
    "e": "Матрица A имеет 2 строки и 3 столбца. a13 — элемент в строке 1, столбце 3 ($-2$), а a22 — элемент в строке 2, столбце 2 ($3$). Столбец a1 — [1, 0], а a3 — [-2, 4]."
   },
   "uz": {
    "t": "A = $\\begin{pmatrix}1 & 2 & -2 \\ 0 & 3 & 4\\end{pmatrix}$ matritsasi uchun oʻlchamini koʻrsating, a13, a22 ni toping va a1, a3 ustunlarini yozing.",
    "o": [
     "$2\\times 3$, a13=-2, a22=3, $a_{1}=[1,0]$, $a_{3}=[-2,4]$",
     "$2\\times 3$, a13=2, a22=3, $a_{1}=[1,0]$, $a_{3}=[2,4]$",
     "$3\\times 2$, a13=-2, a22=3, $a_{1}=[1,0]$, $a_{3}=[-2,4]$",
     "$2\\times 3$, a13=-2, a22=0, $a_{1}=[1,0]$, $a_{3}=[-2,4]$"
    ],
    "e": "A matritsada 2 qator va 3 ustun bor. a13 — 1-qator, 3-ustundagi element ($-2$), a22 esa 2-qator, 2-ustundagi element ($3$). a1 ustuni [1, 0], a3 esa [-2, 4]."
   }
  },
  {
   "t": "Let A = $\\begin{pmatrix}2&3\\\\-1&0\\end{pmatrix}$ and B = $\\begin{pmatrix}-4&5\\\\6&-1\\end{pmatrix}$. Find 2A - B.",
   "o": [
    "$\\begin{pmatrix}0&11\\\\-8&-1\\end{pmatrix}$",
    "$\\begin{pmatrix}8&1\\\\-8&-1\\end{pmatrix}$",
    "$\\begin{pmatrix}8&1\\\\-8&1\\end{pmatrix}$",
    "$\\begin{pmatrix}0&11\\\\8&-1\\end{pmatrix}$"
   ],
   "e": "2A = $\\begin{pmatrix}4&6\\\\-2&0\\end{pmatrix}$. Subtracting B entrywise gives 2A - B = $\\begin{pmatrix}4-(-4)&6-5\\\\-2-6&0-(-1)\\end{pmatrix}$ = $\\begin{pmatrix}8&1\\\\-8&-1\\end{pmatrix}$.",
   "ru": {
    "t": "Пусть A = $\\begin{pmatrix}2&3\\\\-1&0\\end{pmatrix}$ и B = $\\begin{pmatrix}-4&5\\\\6&-1\\end{pmatrix}$. Найдите 2A - B.",
    "o": [
     "$\\begin{pmatrix}0&11\\\\-8&-1\\end{pmatrix}$",
     "$\\begin{pmatrix}8&1\\\\-8&-1\\end{pmatrix}$",
     "$\\begin{pmatrix}8&1\\\\-8&1\\end{pmatrix}$",
     "$\\begin{pmatrix}0&11\\\\8&-1\\end{pmatrix}$"
    ],
    "e": "2A = $\\begin{pmatrix}4&6\\\\-2&0\\end{pmatrix}$. Вычитая B поэлементно, получаем 2A - B = $\\begin{pmatrix}4-(-4)&6-5\\\\-2-6&0-(-1)\\end{pmatrix}$ = $\\begin{pmatrix}8&1\\\\-8&-1\\end{pmatrix}$."
   },
   "uz": {
    "t": "A = $\\begin{pmatrix}2&3\\\\-1&0\\end{pmatrix}$ va B = $\\begin{pmatrix}-4&5\\\\6&-1\\end{pmatrix}$ boʻlsin. 2A - B ni toping.",
    "o": [
     "$\\begin{pmatrix}0&11\\\\-8&-1\\end{pmatrix}$",
     "$\\begin{pmatrix}8&1\\\\-8&-1\\end{pmatrix}$",
     "$\\begin{pmatrix}8&1\\\\-8&1\\end{pmatrix}$",
     "$\\begin{pmatrix}0&11\\\\8&-1\\end{pmatrix}$"
    ],
    "e": "2A = $\\begin{pmatrix}4&6\\\\-2&0\\end{pmatrix}$. B ni elementma-element ayirgan holda 2A - B = $\\begin{pmatrix}4-(-4)&6-5\\\\-2-6&0-(-1)\\end{pmatrix}$ = $\\begin{pmatrix}8&1\\\\-8&-1\\end{pmatrix}$ boʻladi."
   }
  },
  {
   "t": "A is $3\\times2$, B is $2\\times3$, $x \\in \\mathbb{R}^2$, $y \\in \\mathbb{R}^3$. Which of Ax, Ay, Bx, By are defined?",
   "o": [
    "Ax and By are defined",
    "Ay and Bx are defined",
    "Ax and Bx are defined",
    "Ay and By are defined"
   ],
   "e": "Ax is defined because the inner dimensions match ($2=2$), resulting in a $3\\times1$ vector. By is defined because the inner dimensions match ($3=3$), resulting in a $2\\times1$ vector. Ay and Bx have mismatched inner dimensions and are undefined.",
   "ru": {
    "t": "A имеет размер $3\\times2$, B — $2\\times3$, $x \\in \\mathbb{R}^2$, $y \\in \\mathbb{R}^3$. Какие из произведений Ax, Ay, Bx, By определены?",
    "o": [
     "Ax и By определены",
     "Ay и Bx определены",
     "Ax и Bx определены",
     "Ay и By определены"
    ],
    "e": "Ax определено, поскольку внутренние размерности совпадают ($2=2$), в результате получается вектор $3\\times1$. By определено, поскольку внутренние размерности совпадают ($3=3$), в результате получается вектор $2\\times1$. У Ay и Bx внутренние размерности не совпадают, и они не определены."
   },
   "uz": {
    "t": "A — $3\\times2$, B — $2\\times3$, $x \\in \\mathbb{R}^2$, $y \\in \\mathbb{R}^3$. Ax, Ay, Bx, By dan qaysilari aniqlangan?",
    "o": [
     "Ax va By aniqlangan",
     "Ay va Bx aniqlangan",
     "Ax va Bx aniqlangan",
     "Ay va By aniqlangan"
    ],
    "e": "Ax aniqlangan, chunki ichki oʻlchamlar mos keladi ($2=2$), natijada $3\\times1$ vektor hosil boʻladi. By aniqlangan, chunki ichki oʻlchamlar mos keladi ($3=3$), natijada $2\\times1$ vektor hosil boʻladi. Ay va Bx da ichki oʻlchamlar mos kelmaydi va ular aniqlanmagan."
   }
  },
  {
   "t": "Let $D = \\text{diag}(2, -1, 3)$, $x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$. Find Dx and $I_3x$.",
   "o": [
    "$Dx = \\begin{pmatrix}10 \\\\ -5 \\\\ -6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
    "$Dx = \\begin{pmatrix}10 \\\\ -4 \\\\ -6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
    "$Dx = \\begin{pmatrix}10 \\\\ -5 \\\\ 6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
    "$Dx = \\begin{pmatrix}10 \\\\ -4 \\\\ 6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$"
   ],
   "e": "$Dx$ scales each coordinate by the matching diagonal entry: $2\\cdot5=10$, $-1\\cdot4=-4$, $3\\cdot(-2)=-6$. $I_3x$ is the identity matrix times $x$, which equals $x$.",
   "ru": {
    "t": "Пусть $D = \\text{diag}(2, -1, 3)$, $x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$. Найдите Dx и $I_3x$.",
    "o": [
     "$Dx = \\begin{pmatrix}10 \\\\ -5 \\\\ -6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
     "$Dx = \\begin{pmatrix}10 \\\\ -4 \\\\ -6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
     "$Dx = \\begin{pmatrix}10 \\\\ -5 \\\\ 6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
     "$Dx = \\begin{pmatrix}10 \\\\ -4 \\\\ 6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$"
    ],
    "e": "$Dx$ масштабирует каждую координату на соответствующий диагональный элемент: $2\\cdot5=10$, $-1\\cdot4=-4$, $3\\cdot(-2)=-6$. $I_3x$ — это единичная матрица, умноженная на $x$, что равно $x$."
   },
   "uz": {
    "t": "$D = \\text{diag}(2, -1, 3)$, $x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$ boʻlsin. Dx va $I_3x$ ni toping.",
    "o": [
     "$Dx = \\begin{pmatrix}10 \\\\ -5 \\\\ -6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
     "$Dx = \\begin{pmatrix}10 \\\\ -4 \\\\ -6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
     "$Dx = \\begin{pmatrix}10 \\\\ -5 \\\\ 6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$",
     "$Dx = \\begin{pmatrix}10 \\\\ -4 \\\\ 6\\end{pmatrix}$, $I_3x = \\begin{pmatrix}5 \\\\ 4 \\\\ -2\\end{pmatrix}$"
    ],
    "e": "$Dx$ har bir koordinatani mos diagonal elementga koʻpaytiradi: $2\\cdot5=10$, $-1\\cdot4=-4$, $3\\cdot(-2)=-6$. $I_3x$ — bu $x$ ga koʻpaytirilgan birlik matritsa, natija $x$ ga teng."
   }
  },
  {
   "t": "Let $A = \\begin{pmatrix}1 & 2 \\ -1 & 3 \\ 4 & 0\\end{pmatrix}$, $x = \\begin{pmatrix}0 \\ -1\\end{pmatrix}^T$. Compute $Ax$ by the column picture and by row dot products.",
   "o": [
    "$Ax = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$ by columns, $\\begin{pmatrix}0 \\ -5 \\ 8\\end{pmatrix}^T$ by rows",
    "$Ax = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$ by columns, $\\begin{pmatrix}0 \\ -5 \\ 0\\end{pmatrix}^T$ by rows",
    "$Ax = \\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T$ by columns, $\\begin{pmatrix}0 \\ -5 \\ 0\\end{pmatrix}^T$ by rows",
    "$Ax = \\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T$ by columns, $\\begin{pmatrix}0 \\ -5 \\ 8\\end{pmatrix}^T$ by rows"
   ],
   "e": "Column picture: $0\\cdot\\begin{pmatrix}1 \\ -1 \\ 4\\end{pmatrix}^T + (-1)\\cdot\\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$. Row dot products: $[1, 2]\\cdot[0, -1] = -2$, $[-1, 3]\\cdot[0, -1] = -3$, $[4, 0]\\cdot[0, -1] = 0$. The correct result is $\\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$.",
   "ru": {
    "t": "Пусть $A = \\begin{pmatrix}1 & 2 \\ -1 & 3 \\ 4 & 0\\end{pmatrix}$, $x = \\begin{pmatrix}0 \\ -1\\end{pmatrix}^T$. Вычислите $Ax$ через столбцовое представление и через скалярные произведения строк.",
    "o": [
     "$Ax = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$ по столбцам, $\\begin{pmatrix}0 \\ -5 \\ 8\\end{pmatrix}^T$ по строкам",
     "$Ax = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$ по столбцам, $\\begin{pmatrix}0 \\ -5 \\ 0\\end{pmatrix}^T$ по строкам",
     "$Ax = \\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T$ по столбцам, $\\begin{pmatrix}0 \\ -5 \\ 0\\end{pmatrix}^T$ по строкам",
     "$Ax = \\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T$ по столбцам, $\\begin{pmatrix}0 \\ -5 \\ 8\\end{pmatrix}^T$ по строкам"
    ],
    "e": "Столбцовое представление: $0\\cdot\\begin{pmatrix}1 \\ -1 \\ 4\\end{pmatrix}^T + (-1)\\cdot\\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$. Скалярные произведения строк: $[1, 2]\\cdot[0, -1] = -2$, $[-1, 3]\\cdot[0, -1] = -3$, $[4, 0]\\cdot[0, -1] = 0$. Правильный результат — $\\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2 \\ -1 & 3 \\ 4 & 0\\end{pmatrix}$, $x = \\begin{pmatrix}0 \\ -1\\end{pmatrix}^T$ boʻlsin. $Ax$ ni ustunlar tasviri orqali va qatorlar skalyar koʻpaytmalari orqali hisoblang.",
    "o": [
     "$Ax = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$ ustunlar boʻyicha, $\\begin{pmatrix}0 \\ -5 \\ 8\\end{pmatrix}^T$ qatorlar boʻyicha",
     "$Ax = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$ ustunlar boʻyicha, $\\begin{pmatrix}0 \\ -5 \\ 0\\end{pmatrix}^T$ qatorlar boʻyicha",
     "$Ax = \\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T$ ustunlar boʻyicha, $\\begin{pmatrix}0 \\ -5 \\ 0\\end{pmatrix}^T$ qatorlar boʻyicha",
     "$Ax = \\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T$ ustunlar boʻyicha, $\\begin{pmatrix}0 \\ -5 \\ 8\\end{pmatrix}^T$ qatorlar boʻyicha"
    ],
    "e": "Ustunlar tasviri: $0\\cdot\\begin{pmatrix}1 \\ -1 \\ 4\\end{pmatrix}^T + (-1)\\cdot\\begin{pmatrix}2 \\ 3 \\ 0\\end{pmatrix}^T = \\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$. Qatorlar skalyar koʻpaytmalari: $[1, 2]\\cdot[0, -1] = -2$, $[-1, 3]\\cdot[0, -1] = -3$, $[4, 0]\\cdot[0, -1] = 0$. Toʻgʻri natija — $\\begin{pmatrix}-2 \\ -3 \\ 0\\end{pmatrix}^T$."
   }
  },
  {
   "t": "Given A = $\\begin{pmatrix}1&2\\\\3&-1\\end{pmatrix}$ and Ax = $\\begin{pmatrix}7\\\\5\\end{pmatrix}^T$, find x.",
   "o": [
    "x = $\\begin{pmatrix}17/7\\\\16/7\\end{pmatrix}^T$",
    "x = $\\begin{pmatrix}-17/7\\\\16/7\\end{pmatrix}^T$",
    "x = $\\begin{pmatrix}17/7\\\\-16/7\\end{pmatrix}^T$",
    "x = $\\begin{pmatrix}-17/7\\\\-16/7\\end{pmatrix}^T$"
   ],
   "e": "Solving the system: $x_1 + 2x_2 = 7$ and $3x_1 - x_2 = 5$ gives $x_1 = \\frac{17}{7}$ and $x_2 = \\frac{16}{7}$.",
   "ru": {
    "t": "Дано A = $\\begin{pmatrix}1&2\\\\3&-1\\end{pmatrix}$ и Ax = $\\begin{pmatrix}7\\\\5\\end{pmatrix}^T$. Найдите x.",
    "o": [
     "x = $\\begin{pmatrix}17/7\\\\16/7\\end{pmatrix}^T$",
     "x = $\\begin{pmatrix}-17/7\\\\16/7\\end{pmatrix}^T$",
     "x = $\\begin{pmatrix}17/7\\\\-16/7\\end{pmatrix}^T$",
     "x = $\\begin{pmatrix}-17/7\\\\-16/7\\end{pmatrix}^T$"
    ],
    "e": "Решая систему $x_1 + 2x_2 = 7$ и $3x_1 - x_2 = 5$, получаем $x_1 = \\frac{17}{7}$ и $x_2 = \\frac{16}{7}$."
   },
   "uz": {
    "t": "A = $\\begin{pmatrix}1&2\\\\3&-1\\end{pmatrix}$ va Ax = $\\begin{pmatrix}7\\\\5\\end{pmatrix}^T$ boʻlsa, x ni toping.",
    "o": [
     "x = $\\begin{pmatrix}17/7\\\\16/7\\end{pmatrix}^T$",
     "x = $\\begin{pmatrix}-17/7\\\\16/7\\end{pmatrix}^T$",
     "x = $\\begin{pmatrix}17/7\\\\-16/7\\end{pmatrix}^T$",
     "x = $\\begin{pmatrix}-17/7\\\\-16/7\\end{pmatrix}^T$"
    ],
    "e": "$x_1 + 2x_2 = 7$ va $3x_1 - x_2 = 5$ tizimni yechib, $x_1 = \\frac{17}{7}$ va $x_2 = \\frac{16}{7}$ olamiz."
   }
  },
  {
   "t": "Nonzero vectors u + v and u − v are orthogonal. What follows about ||u|| and ||v||?",
   "o": [
    "||$u|| = ||v||$",
    "||u|| > ||v||",
    "||u|| < ||v||",
    "No relationship can be determined"
   ],
   "e": "Orthogonality gives $0 = (u + v)·(u - v) = ||u||^2 - ||v||^2$, hence $||u|| = ||v||$.",
   "ru": {
    "t": "Ненулевые векторы u + v и u − v ортогональны. Что из этого следует о соотношении между ||u|| и ||v||?",
    "o": [
     "||$u|| = ||v||$",
     "||u|| > ||v||",
     "||u|| < ||v||",
     "Определить соотношение нельзя"
    ],
    "e": "Из ортогональности следует $0 = (u + v)·(u - v) = ||u||^2 - ||v||^2$, откуда $||u|| = ||v||$."
   },
   "uz": {
    "t": "Nolga teng boʻlmagan u + v va u − v vektorlari ortogonal. Bundan ||u|| va ||v|| oʻrtasidagi munosabat haqida nima kelib chiqadi?",
    "o": [
     "||$u|| = ||v||$",
     "||u|| > ||v||",
     "||u|| < ||v||",
     "Munosabatni aniqlash mumkin emas"
    ],
    "e": "Ortogonallikdan $0 = (u + v)·(u - v) = ||u||^2 - ||v||^2$ kelib chiqadi, demak $||u|| = ||v||$."
   }
  },
  {
   "t": "Let $u = (-3, 2)^T$, $v = (4, 5)^T$. Compute $u · v$; is the angle acute, right or obtuse?",
   "o": [
    "$u \\cdot v = -2$, angle is obtuse",
    "$u \\cdot v = -2$, angle is acute",
    "$u \\cdot v = 2$, angle is obtuse",
    "$u \\cdot v = 2$, angle is acute"
   ],
   "e": "The dot product $u · v = (-3)(4) + (2)(5) = -12 + 10 = -2$. Since the dot product is negative, the angle is obtuse.",
   "ru": {
    "t": "Пусть $u = (-3, 2)^T$, $v = (4, 5)^T$. Вычислите $u · v$; угол острый, прямой или тупой?",
    "o": [
     "$u \\cdot v = -2$, угол тупой",
     "$u \\cdot v = -2$, угол острый",
     "$u \\cdot v = 2$, угол тупой",
     "$u \\cdot v = 2$, угол острый"
    ],
    "e": "Скалярное произведение $u · v = (-3)(4) + (2)(5) = -12 + 10 = -2$. Поскольку скалярное произведение отрицательно, угол тупой."
   },
   "uz": {
    "t": "Berilgan $u = (-3, 2)^T$, $v = (4, 5)^T$. $u · v$ ni hisoblang; burchak oʻtkir, toʻgʻri yoki oʻtmasmi?",
    "o": [
     "$u \\cdot v = -2$, burchak oʻtmas",
     "$u \\cdot v = -2$, burchak oʻtkir",
     "$u \\cdot v = 2$, burchak oʻtmas",
     "$u \\cdot v = 2$, burchak oʻtkir"
    ],
    "e": "Skalyar koʻpaytma $u · v = (-3)(4) + (2)(5) = -12 + 10 = -2$. Skalyar koʻpaytma manfiy boʻlgani uchun burchak oʻtmas boʻladi."
   }
  },
  {
   "t": "Let $a = (1, -2, 4)^{T}$, $b = (3, 0, -1)^{T}$. Find $a \\cdot b$, $||a||$, $||b||$, $||a - b||$.",
   "o": [
    "$a \\cdot b = -1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{33}$",
    "$a \\cdot b = -1$, $||a|| = \\sqrt{10}$, $||b|| = \\sqrt{21}$, $||a - b|| = \\sqrt{33}$",
    "$a \\cdot b = 1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{33}$",
    "$a \\cdot b = -1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{43}$"
   ],
   "e": "$a \\cdot b = (1)(3) + (-2)(0) + (4)(-1) = 3 - 4 = -1$. $||a|| = \\sqrt{1^2 + (-2)^2 + 4^2} = \\sqrt{21}$. $||b|| = \\sqrt{3^2 + 0^2 + (-1)^2} = \\sqrt{10}$. $a - b = (-2, -2, 5)^{T}$, $||a - b|| = \\sqrt{(-2)^2 + (-2)^2 + 5^2} = \\sqrt{33}$.",
   "ru": {
    "t": "Пусть $a = (1, -2, 4)^{T}$, $b = (3, 0, -1)^{T}$. Найдите $a \\cdot b$, $||a||$, $||b||$, $||a - b||$.",
    "o": [
     "$a \\cdot b = -1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{33}$",
     "$a \\cdot b = -1$, $||a|| = \\sqrt{10}$, $||b|| = \\sqrt{21}$, $||a - b|| = \\sqrt{33}$",
     "$a \\cdot b = 1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{33}$",
     "$a \\cdot b = -1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{43}$"
    ],
    "e": "$a \\cdot b = (1)(3) + (-2)(0) + (4)(-1) = 3 - 4 = -1$. $||a|| = \\sqrt{1^2 + (-2)^2 + 4^2} = \\sqrt{21}$. $||b|| = \\sqrt{3^2 + 0^2 + (-1)^2} = \\sqrt{10}$. $a - b = (-2, -2, 5)^{T}$, $||a - b|| = \\sqrt{(-2)^2 + (-2)^2 + 5^2} = \\sqrt{33}$."
   },
   "uz": {
    "t": "Berilgan $a = (1, -2, 4)^{T}$, $b = (3, 0, -1)^{T}$. $a \\cdot b$, $||a||$, $||b||$, $||a - b||$ ni toping.",
    "o": [
     "$a \\cdot b = -1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{33}$",
     "$a \\cdot b = -1$, $||a|| = \\sqrt{10}$, $||b|| = \\sqrt{21}$, $||a - b|| = \\sqrt{33}$",
     "$a \\cdot b = 1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{33}$",
     "$a \\cdot b = -1$, $||a|| = \\sqrt{21}$, $||b|| = \\sqrt{10}$, $||a - b|| = \\sqrt{43}$"
    ],
    "e": "$a \\cdot b = (1)(3) + (-2)(0) + (4)(-1) = 3 - 4 = -1$. $||a|| = \\sqrt{1^2 + (-2)^2 + 4^2} = \\sqrt{21}$. $||b|| = \\sqrt{3^2 + 0^2 + (-1)^2} = \\sqrt{10}$. $a - b = (-2, -2, 5)^{T}$, $||a - b|| = \\sqrt{(-2)^2 + (-2)^2 + 5^2} = \\sqrt{33}$."
   }
  },
  {
   "t": "Find $k$ so that $u = (2, k, 3)^T$ is orthogonal to $v = (−1, 4, 2)^T$.",
   "o": [
    "$k = −1$",
    "$k = 2$",
    "$k = 1$",
    "$k = −2$"
   ],
   "e": "For $u$ and $v$ to be orthogonal, their dot product must be zero: $u \\cdot v = (2)(−1) + (k)(4) + (3)(2) = −2 + 4k + 6 = 0$. Solving for $k$ gives $4k = -4$, so $k = -1$.",
   "ru": {
    "t": "Найдите $k$ так, чтобы $u = (2, k, 3)^T$ был ортогонален $v = (−1, 4, 2)^T$.",
    "o": [
     "$k = −1$",
     "$k = 2$",
     "$k = 1$",
     "$k = −2$"
    ],
    "e": "Чтобы $u$ и $v$ были ортогональны, их скалярное произведение должно равняться нулю: $u \\cdot v = (2)(−1) + (k)(4) + (3)(2) = −2 + 4k + 6 = 0$. Решая относительно $k$, получаем $4k = -4$, откуда $k = -1$."
   },
   "uz": {
    "t": "$u = (2, k, 3)^T$ vektori $v = (−1, 4, 2)^T$ vektorga ortogonal boʻlishi uchun $k$ ni toping.",
    "o": [
     "$k = −1$",
     "$k = 2$",
     "$k = 1$",
     "$k = −2$"
    ],
    "e": "$u$ va $v$ ortogonal boʻlishi uchun ularning skalyar koʻpaytmasi nolga teng boʻlishi kerak: $u \\cdot v = (2)(−1) + (k)(4) + (3)(2) = −2 + 4k + 6 = 0$. $k$ ga nisbatan yechsak, $4k = -4$ boʻladi, demak $k = -1$."
   }
  },
  {
   "t": "Find the exact $\\cos \\theta$ and then $\\theta$ to the nearest degree for $u = (3, 1)^T$, $v = (−2, 4)^T$.",
   "o": [
    "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 116°$",
    "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 82°$",
    "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 98°$",
    "$\\cos \\theta = \\frac{1}{\\sqrt{5}}$; $\\theta \\approx 98°$"
   ],
   "e": "$u \\cdot v = (3)(−2) + (1)(4) = −6 + 4 = −2$. $||u|| = \\sqrt{3^2 + 1^2} = \\sqrt{10}$; $||v|| = \\sqrt{(-2)^2 + 4^2} = 2\\sqrt{5}$. $\\cos \\theta = \\frac{u \\cdot v}{||u|| ||v||} = -\\frac{2}{\\sqrt{10} \\cdot 2\\sqrt{5}} = -\\frac{1}{\\sqrt{5}}$. $\\theta \\approx 98°$.",
   "ru": {
    "t": "Для $u = (3, 1)^T$, $v = (−2, 4)^T$ найдите точное значение $\\cos \\theta$, а затем $\\theta$ с округлением до градуса.",
    "o": [
     "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 116°$",
     "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 82°$",
     "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 98°$",
     "$\\cos \\theta = \\frac{1}{\\sqrt{5}}$; $\\theta \\approx 98°$"
    ],
    "e": "$u \\cdot v = (3)(−2) + (1)(4) = −6 + 4 = −2$. $||u|| = \\sqrt{3^2 + 1^2} = \\sqrt{10}$; $||v|| = \\sqrt{(-2)^2 + 4^2} = 2\\sqrt{5}$. $\\cos \\theta = \\frac{u \\cdot v}{||u|| ||v||} = -\\frac{2}{\\sqrt{10} \\cdot 2\\sqrt{5}} = -\\frac{1}{\\sqrt{5}}$. $\\theta \\approx 98°$."
   },
   "uz": {
    "t": "$u = (3, 1)^T$, $v = (−2, 4)^T$ uchun aniq $\\cos \\theta$ qiymatini, soʻngra $\\theta$ ni gradusgacha yaxlitlab toping.",
    "o": [
     "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 116°$",
     "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 82°$",
     "$\\cos \\theta = -\\frac{1}{\\sqrt{5}}$; $\\theta \\approx 98°$",
     "$\\cos \\theta = \\frac{1}{\\sqrt{5}}$; $\\theta \\approx 98°$"
    ],
    "e": "$u \\cdot v = (3)(−2) + (1)(4) = −6 + 4 = −2$. $||u|| = \\sqrt{3^2 + 1^2} = \\sqrt{10}$; $||v|| = \\sqrt{(-2)^2 + 4^2} = 2\\sqrt{5}$. $\\cos \\theta = \\frac{u \\cdot v}{||u|| ||v||} = -\\frac{2}{\\sqrt{10} \\cdot 2\\sqrt{5}} = -\\frac{1}{\\sqrt{5}}$. $\\theta \\approx 98°$."
   }
  },
  {
   "t": "Find the projection of u = (6, 1)$^T$ onto v = (2, −1)$^T$; verify u − proj is orthogonal to v.",
   "o": [
    "$proj_{v} u = (\\frac{11}{5}, -\\frac{11}{5})$, u − proj is orthogonal to v",
    "$proj_{v} u = (\\frac{22}{5}, -\\frac{11}{5})$, u − proj is orthogonal to v",
    "$proj_{v} u = (\\frac{11}{5}, -\\frac{11}{5})$, u − proj is not orthogonal to v",
    "$proj_{v} u = (\\frac{22}{5}, -\\frac{11}{5})$, u − proj is not orthogonal to v"
   ],
   "e": "The projection is calculated as proj_v u = $\\frac{(u\\cdot v)}{(v\\cdot v)} \\cdot v = \\frac{11}{5} \\cdot (2, -1) = \\left(\\frac{22}{5}, -\\frac{11}{5}\\right)$. The remainder u - proj = $\\left(\\frac{8}{5}, \\frac{16}{5}\\right)$ is orthogonal to v since their dot product is 0.",
   "ru": {
    "t": "Найдите проекцию u = (6, 1)$^T$ на v = (2, −1)$^T$; проверьте, что u − proj ортогонален v.",
    "o": [
     "$proj_{v} u = (\\frac{11}{5}, -\\frac{11}{5})$, u − proj ортогонален v",
     "$proj_{v} u = (\\frac{22}{5}, -\\frac{11}{5})$, u − proj ортогонален v",
     "$proj_{v} u = (\\frac{11}{5}, -\\frac{11}{5})$, u − proj не ортогонален v",
     "$proj_{v} u = (\\frac{22}{5}, -\\frac{11}{5})$, u − proj не ортогонален v"
    ],
    "e": "Проекция вычисляется как proj_v u = $\\frac{(u\\cdot v)}{(v\\cdot v)} \\cdot v = \\frac{11}{5} \\cdot (2, -1) = \\left(\\frac{22}{5}, -\\frac{11}{5}\\right)$. Остаток u - proj = $\\left(\\frac{8}{5}, \\frac{16}{5}\\right)$ ортогонален v, поскольку их скалярное произведение равно 0."
   },
   "uz": {
    "t": "u = (6, 1)$^T$ vektorni v = (2, −1)$^T$ vektorga proyeksiyalang; u − proj vektori v ga ortogonal ekanini tekshiring.",
    "o": [
     "$proj_{v} u = (\\frac{11}{5}, -\\frac{11}{5})$, u − proj v ga ortogonal",
     "$proj_{v} u = (\\frac{22}{5}, -\\frac{11}{5})$, u − proj v ga ortogonal",
     "$proj_{v} u = (\\frac{11}{5}, -\\frac{11}{5})$, u − proj v ga ortogonal emas",
     "$proj_{v} u = (\\frac{22}{5}, -\\frac{11}{5})$, u − proj v ga ortogonal emas"
    ],
    "e": "Proyeksiya quyidagicha hisoblanadi: proj_v u = $\\frac{(u\\cdot v)}{(v\\cdot v)} \\cdot v = \\frac{11}{5} \\cdot (2, -1) = \\left(\\frac{22}{5}, -\\frac{11}{5}\\right)$. Qoldiq u - proj = $\\left(\\frac{8}{5}, \\frac{16}{5}\\right)$ v ga ortogonal, chunki ularning skalyar koʻpaytmasi 0 ga teng."
   }
  },
  {
   "t": "Nonzero p, q satisfy $p \\cdot q = ||p|| ||q||$. What can you conclude about their directions?",
   "o": [
    "The vectors point in exactly the same direction",
    "The vectors point in exactly opposite directions",
    "The vectors are orthogonal to each other",
    "The vectors are perpendicular to each other"
   ],
   "e": "The equation p · q = ||p|| ||q|| implies cos θ = 1, where θ is the angle between the vectors. This means θ = $0^{\\circ}$, so the vectors point in exactly the same direction.",
   "ru": {
    "t": "Ненулевые p, q удовлетворяют условию $p \\cdot q = ||p|| ||q||$. Какой вывод можно сделать об их направлениях?",
    "o": [
     "Векторы направлены в одну и ту же сторону",
     "Векторы направлены ровно в противоположные стороны",
     "Векторы ортогональны друг другу",
     "Векторы перпендикулярны друг другу"
    ],
    "e": "Равенство p · q = ||p|| ||q|| означает, что cos θ = 1, где θ — угол между векторами. Это значит, что θ = $0^{\\circ}$, то есть векторы направлены в одну и ту же сторону."
   },
   "uz": {
    "t": "Nolga teng boʻlmagan p va q vektorlari $p \\cdot q = ||p|| ||q||$ shartni qanoatlantiradi. Ularning yoʻnalishlari haqida qanday xulosa qilish mumkin?",
    "o": [
     "Vektorlar aynan bir xil yoʻnalishda yoʻnalgan",
     "Vektorlar aynan qarama-qarshi yoʻnalgan",
     "Vektorlar bir-biriga ortogonal",
     "Vektorlar bir-biriga perpendikulyar"
    ],
    "e": "p · q = ||p|| ||q|| tengligi cos θ = 1 ekanini bildiradi, bu yerda θ — vektorlar orasidagi burchak. Demak, θ = $0^{\\circ}$, yaʼni vektorlar aynan bir xil yoʻnalishda yoʻnalgan."
   }
  },
  {
   "t": "For a = (2, 1, −1)$^{T}$, b = (0, 3, 2)$^{T}$ compute a × b and b × a; verify the sign relation.",
   "o": [
    "a × b = (5, 4, −6)$^{T}$, b × a = (−5, −4, 6)$^{T}$, b × a = −(a × b)",
    "a × b = (−5, −4, 6)$^{T}$, b × a = (5, 4, −6)$^{T}$, b × a = −(a × b)",
    "a × b = (−5, −4, 6)$^{T}$, b × a = (5, 4, −6)$^{T}$, b × a = a × b",
    "a × b = (5, 4, −6)$^{T}$, b × a = (−5, −4, 6)$^{T}$, b × a = a × b"
   ],
   "e": "a × b = ($1·2 - (−1)·3$, (−1)·0 − 2·2$, 2·3 − 1·0$)T = (5, −4, 6)T. b × a = ($3·(−1) − 2·1$, $2·2 − 0·(−1)$, $0·1 − 3·2$)T = (−5, 4, −6)T. Thus, b × a = −(a × b).",
   "ru": {
    "t": "Для a = (2, 1, −1)$^{T}$, b = (0, 3, 2)$^{T}$ вычислите a × b и b × a; проверьте соотношение знаков.",
    "o": [
     "a × b = (5, 4, −6)$^{T}$, b × a = (−5, −4, 6)$^{T}$, b × a = −(a × b)",
     "a × b = (−5, −4, 6)$^{T}$, b × a = (5, 4, −6)$^{T}$, b × a = −(a × b)",
     "a × b = (−5, −4, 6)$^{T}$, b × a = (5, 4, −6)$^{T}$, b × a = a × b",
     "a × b = (5, 4, −6)$^{T}$, b × a = (−5, −4, 6)$^{T}$, b × a = a × b"
    ],
    "e": "a × b = ($1·2 - (−1)·3$, (−1)·0 − 2·2$, 2·3 − 1·0$)T = (5, −4, 6)T. b × a = ($3·(−1) − 2·1$, $2·2 − 0·(−1)$, $0·1 − 3·2$)T = (−5, 4, −6)T. Таким образом, b × a = −(a × b)."
   },
   "uz": {
    "t": "a = (2, 1, −1)$^{T}$ va b = (0, 3, 2)$^{T}$ uchun a × b va b × a ni hisoblang; ishoralar munosabatini tekshiring.",
    "o": [
     "a × b = (5, 4, −6)$^{T}$, b × a = (−5, −4, 6)$^{T}$, b × a = −(a × b)",
     "a × b = (−5, −4, 6)$^{T}$, b × a = (5, 4, −6)$^{T}$, b × a = −(a × b)",
     "a × b = (−5, −4, 6)$^{T}$, b × a = (5, 4, −6)$^{T}$, b × a = a × b",
     "a × b = (5, 4, −6)$^{T}$, b × a = (−5, −4, 6)$^{T}$, b × a = a × b"
    ],
    "e": "a × b = ($1·2 - (−1)·3$, (−1)·0 − 2·2$, 2·3 − 1·0$)T = (5, −4, 6)T. b × a = ($3·(−1) − 2·1$, $2·2 − 0·(−1)$, $0·1 − 3·2$)T = (−5, 4, −6)T. Demak, b × a = −(a × b)."
   }
  },
  {
   "t": "Verify that a × b from Exercise 7 is orthogonal to both a and b.",
   "o": [
    "$a \\cdot (a \\times b) = 0$, $b \\cdot (a \\times b) = 0$, so it is orthogonal to both",
    "$a \\cdot (a \\times b) = 1$, $b \\cdot (a \\times b) = 1$, so it is not orthogonal to either",
    "$a \\cdot (a \\times b) = 0$, $b \\cdot (a \\times b) = 1$, so it is orthogonal to a but not to b",
    "$a \\cdot (a \\times b) = 1$, $b \\cdot (a \\times b) = 0$, so it is orthogonal to b but not to a"
   ],
   "e": "a · (a × b) = $2\\cdot5 + 1\\cdot(-4) + (-1)\\cdot6 = 10 - 4 - 6 = 0$. b · (a × b) = $0\\cdot5 + 3\\cdot(-4) + 2\\cdot6 = -12 + 12 = 0$. Both dot products are zero, confirming orthogonality.",
   "ru": {
    "t": "Проверьте, что a × b из упражнения 7 ортогонален обоим векторам a и b.",
    "o": [
     "$a \\cdot (a \\times b) = 0$, $b \\cdot (a \\times b) = 0$, поэтому он ортогонален обоим",
     "$a \\cdot (a \\times b) = 1$, $b \\cdot (a \\times b) = 1$, поэтому он не ортогонален ни одному из них",
     "$a \\cdot (a \\times b) = 0$, $b \\cdot (a \\times b) = 1$, поэтому он ортогонален a, но не b",
     "$a \\cdot (a \\times b) = 1$, $b \\cdot (a \\times b) = 0$, поэтому он ортогонален b, но не a"
    ],
    "e": "a · (a × b) = $2\\cdot5 + 1\\cdot(-4) + (-1)\\cdot6 = 10 - 4 - 6 = 0$. b · (a × b) = $0\\cdot5 + 3\\cdot(-4) + 2\\cdot6 = -12 + 12 = 0$. Оба скалярных произведения равны нулю, что подтверждает ортогональность."
   },
   "uz": {
    "t": "7-mashqdagi a × b vektorining a va b vektorlarining ikkalasiga ham ortogonal ekanini tekshiring.",
    "o": [
     "$a \\cdot (a \\times b) = 0$, $b \\cdot (a \\times b) = 0$, demak u ikkalasiga ham ortogonal",
     "$a \\cdot (a \\times b) = 1$, $b \\cdot (a \\times b) = 1$, demak u ikkalasiga ham ortogonal emas",
     "$a \\cdot (a \\times b) = 0$, $b \\cdot (a \\times b) = 1$, demak u a ga ortogonal, lekin b ga emas",
     "$a \\cdot (a \\times b) = 1$, $b \\cdot (a \\times b) = 0$, demak u b ga ortogonal, lekin a ga emas"
    ],
    "e": "a · (a × b) = $2\\cdot5 + 1\\cdot(-4) + (-1)\\cdot6 = 10 - 4 - 6 = 0$. b · (a × b) = $0\\cdot5 + 3\\cdot(-4) + 2\\cdot6 = -12 + 12 = 0$. Ikkala skalyar koʻpaytma ham nolga teng, bu ortogonallikni tasdiqlaydi."
   }
  },
  {
   "t": "Find the area of the parallelogram with adjacent sides u = (1, 2, 2)$^T$ and v = (3, -1, 0)$^T$.",
   "o": [
    "√89",
    "√75",
    "89",
    "75"
   ],
   "e": "The cross product u × v = (-2, 6, -7)$^T$ has a magnitude of √((-2)² + 6² + (-7)²) = √89.",
   "ru": {
    "t": "Найдите площадь параллелограмма со смежными сторонами u = (1, 2, 2)$^T$ и v = (3, -1, 0)$^T$.",
    "o": [
     "√89",
     "√75",
     "89",
     "75"
    ],
    "e": "Векторное произведение u × v = (-2, 6, -7)$^T$ имеет модуль √((-2)² + 6² + (-7)²) = √89."
   },
   "uz": {
    "t": "Qoʻshni tomonlari u = (1, 2, 2)$^T$ va v = (3, -1, 0)$^T$ boʻlgan parallelogramm yuzasini toping.",
    "o": [
     "√89",
     "√75",
     "89",
     "75"
    ],
    "e": "u × v = (-2, 6, -7)$^T$ vektor koʻpaytmaning moduli √((-2)² + 6² + (-7)²) = √89 ga teng."
   }
  },
  {
   "t": "Given points P = (1, 0, 1), Q = (3, 1, 0), R = (0, 2, 4), find the area of triangle PQR.",
   "o": [
    "$5\\sqrt{3}$",
    "√75",
    "$\\sqrt{3}$",
    "15"
   ],
   "e": "The cross product of vectors PQ and PR is (−5, −5, 5)$^T$ with magnitude √75 = 5√3. The triangle area is half of this value.",
   "ru": {
    "t": "Для точек P = (1, 0, 1), Q = (3, 1, 0), R = (0, 2, 4) найдите площадь треугольника PQR.",
    "o": [
     "$5\\sqrt{3}$",
     "√75",
     "$\\sqrt{3}$",
     "15"
    ],
    "e": "Векторное произведение векторов PQ и PR равно (−5, −5, 5)$^T$ с модулем √75 = 5√3. Площадь треугольника равна половине этой величины."
   },
   "uz": {
    "t": "P = (1, 0, 1), Q = (3, 1, 0), R = (0, 2, 4) nuqtalar berilgan. PQR uchburchak yuzasini toping.",
    "o": [
     "$5\\sqrt{3}$",
     "√75",
     "$\\sqrt{3}$",
     "15"
    ],
    "e": "PQ va PR vektorlarining vektor koʻpaytmasi (−5, −5, 5)$^T$ boʻlib, uning moduli √75 = 5√3 ga teng. Uchburchak yuzasi shu qiymatning yarmiga teng."
   }
  },
  {
   "t": "Find all real values of t for which vectors a = (1, t, 2)$^{T}$ and b = (3, 6, 6)$^{T}$ satisfy a × b = 0.",
   "o": [
    "$t = 2$",
    "$t = 1$",
    "$t = 3$",
    "No such t exists"
   ],
   "e": "For the cross product to be zero, the vectors must be parallel. Setting $a = cb$ gives $t = 2$ as the unique solution.",
   "ru": {
    "t": "Найдите все действительные значения t, при которых векторы a = (1, t, 2)$^{T}$ и b = (3, 6, 6)$^{T}$ удовлетворяют условию a × b = 0.",
    "o": [
     "$t = 2$",
     "$t = 1$",
     "$t = 3$",
     "Такого t не существует"
    ],
    "e": "Чтобы векторное произведение равнялось нулю, векторы должны быть параллельны. Условие $a = cb$ даёт $t = 2$ — единственное решение."
   },
   "uz": {
    "t": "a = (1, t, 2)$^{T}$ va b = (3, 6, 6)$^{T}$ vektorlar a × b = 0 shartni qanoatlantiradigan barcha haqiqiy t qiymatlarini toping.",
    "o": [
     "$t = 2$",
     "$t = 1$",
     "$t = 3$",
     "Bunday t mavjud emas"
    ],
    "e": "Vektor koʻpaytma nolga teng boʻlishi uchun vektorlar parallel boʻlishi kerak. $a = cb$ sharti $t = 2$ yagona yechimni beradi."
   }
  },
  {
   "t": "Let a = (1, 0, 2)$^{T}$, b = (2, 1, −1)$^{T}$, c = (0, 3, 1)$^{T}$. Compute a · (b × c) and interpret a zero value.",
   "o": [
    "16; represents the volume of the parallelepiped",
    "16; the vectors are coplanar",
    "16; the vectors are orthogonal",
    "0; the vectors are coplanar"
   ],
   "e": "The scalar triple product $a \\cdot (b \\times c) = 16$, which represents the signed volume of the parallelepiped spanned by the three vectors.",
   "ru": {
    "t": "Пусть a = (1, 0, 2)$^{T}$, b = (2, 1, −1)$^{T}$, c = (0, 3, 1)$^{T}$. Вычислите a · (b × c) и объясните, что означает нулевое значение.",
    "o": [
     "16; представляет собой объём параллелепипеда",
     "16; векторы компланарны",
     "16; векторы ортогональны",
     "0; векторы компланарны"
    ],
    "e": "Смешанное произведение $a \\cdot (b \\times c) = 16$ представляет собой объём со знаком параллелепипеда, натянутого на три вектора."
   },
   "uz": {
    "t": "Berilgan a = (1, 0, 2)$^{T}$, b = (2, 1, −1)$^{T}$, c = (0, 3, 1)$^{T}$. a · (b × c) ni hisoblang va nol qiymat nimani anglatishini tushuntiring.",
    "o": [
     "16; parallelepiped hajmini ifodalaydi",
     "16; vektorlar komplanar",
     "16; vektorlar ortogonal",
     "0; vektorlar komplanar"
    ],
    "e": "Skalyar uchlik koʻpaytma $a \\cdot (b \\times c) = 16$ — bu uch vektorda qurilgan parallelepipedning ishorali hajmi."
   }
  },
  {
   "t": "Let A = $\\begin{pmatrix}2 & -1 & 0 \\\\ 4 & 3 & 5 \\end{pmatrix}$. State its size; find a12, a23; write every row and column as a vector.",
   "o": [
    "Size $2\\times 3$; a12 = -1, a23 = 5; rows: [2, -1, 0], [4, 3, 5]; columns: [2, 4], [-1, 3], [0, 5]",
    "Size $2\\times 3$; a12 = 2, a23 = 3; rows: [2, -1, 0], [4, 3, 5]; columns: [2, 4], [-1, 3], [0, 5]",
    "Size $3\\times 2$; a12 = -1, a23 = 5; rows: [2, 4], [-1, 3], [0, 5]; columns: [2, -1, 0], [4, 3, 5]",
    "Size $2\\times 3$; a12 = -1, a23 = 5; rows: [2, 4], [-1, 3], [0, 5]; columns: [2, -1, 0], [4, 3, 5]"
   ],
   "e": "The matrix has 2 rows and 3 columns. a12 is the element in row 1, column 2, which is -1. a23 is the element in row 2, column 3, which is 5.",
   "ru": {
    "t": "Пусть A = $\\begin{pmatrix}2 & -1 & 0 \\\\ 4 & 3 & 5 \\end{pmatrix}$. Укажите её размер; найдите a12, a23; запишите каждую строку и каждый столбец в виде вектора.",
    "o": [
     "Размер $2\\times 3$; a12 = -1, a23 = 5; строки: [2, -1, 0], [4, 3, 5]; столбцы: [2, 4], [-1, 3], [0, 5]",
     "Размер $2\\times 3$; a12 = 2, a23 = 3; строки: [2, -1, 0], [4, 3, 5]; столбцы: [2, 4], [-1, 3], [0, 5]",
     "Размер $3\\times 2$; a12 = -1, a23 = 5; строки: [2, 4], [-1, 3], [0, 5]; столбцы: [2, -1, 0], [4, 3, 5]",
     "Размер $2\\times 3$; a12 = -1, a23 = 5; строки: [2, 4], [-1, 3], [0, 5]; столбцы: [2, -1, 0], [4, 3, 5]"
    ],
    "e": "Матрица имеет 2 строки и 3 столбца. a12 — это элемент в строке 1, столбце 2, равный -1. a23 — это элемент в строке 2, столбце 3, равный 5."
   },
   "uz": {
    "t": "Berilgan A = $\\begin{pmatrix}2 & -1 & 0 \\\\ 4 & 3 & 5 \\end{pmatrix}$. Matritsa oʻlchamini aniqlang; a12, a23 ni toping; har bir qator va ustunni vektor koʻrinishida yozing.",
    "o": [
     "Oʻlcham $2\\times 3$; a12 = -1, a23 = 5; qatorlar: [2, -1, 0], [4, 3, 5]; ustunlar: [2, 4], [-1, 3], [0, 5]",
     "Oʻlcham $2\\times 3$; a12 = 2, a23 = 3; qatorlar: [2, -1, 0], [4, 3, 5]; ustunlar: [2, 4], [-1, 3], [0, 5]",
     "Oʻlcham $3\\times 2$; a12 = -1, a23 = 5; qatorlar: [2, 4], [-1, 3], [0, 5]; ustunlar: [2, -1, 0], [4, 3, 5]",
     "Oʻlcham $2\\times 3$; a12 = -1, a23 = 5; qatorlar: [2, 4], [-1, 3], [0, 5]; ustunlar: [2, -1, 0], [4, 3, 5]"
    ],
    "e": "Matritsada 2 qator va 3 ustun bor. a12 — 1-qator, 2-ustundagi element, u -1 ga teng. a23 — 2-qator, 3-ustundagi element, u 5 ga teng."
   }
  },
  {
   "t": "Let A = $\\begin{pmatrix}-2 & 4 \\\\ 0 & 2 \\end{pmatrix}$, B = $\\begin{pmatrix}1 & 3 \\\\ 5 & -1 \\end{pmatrix}$. Compute A + B, A - B, -2A, 3A - 2B.",
   "o": [
    "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}4 & -8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 8 \\end{pmatrix}$",
    "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}4 & -8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-4 & 6 \\\\ -10 & 4 \\end{pmatrix}$",
    "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}-4 & 8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 8 \\end{pmatrix}$",
    "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}-4 & 8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 4 \\end{pmatrix}$"
   ],
   "e": "$A + B = [[-1, 7], [5, 1]]$; $A - B = [[-3, 1], [-5, 3]]$; $-2A = [[4, -8], [0, -4]]$; $3A - 2B = [[-6-2, 12-6], [0-10, 6+2]] = [[-8, 6], [-10, 8]]$.",
   "ru": {
    "t": "Пусть A = $\\begin{pmatrix}-2 & 4 \\\\ 0 & 2 \\end{pmatrix}$, B = $\\begin{pmatrix}1 & 3 \\\\ 5 & -1 \\end{pmatrix}$. Вычислите A + B, A - B, -2A, 3A - 2B.",
    "o": [
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}4 & -8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 8 \\end{pmatrix}$",
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}4 & -8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-4 & 6 \\\\ -10 & 4 \\end{pmatrix}$",
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}-4 & 8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 8 \\end{pmatrix}$",
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}-4 & 8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 4 \\end{pmatrix}$"
    ],
    "e": "$A + B = [[-1, 7], [5, 1]]$; $A - B = [[-3, 1], [-5, 3]]$; $-2A = [[4, -8], [0, -4]]$; $3A - 2B = [[-6-2, 12-6], [0-10, 6+2]] = [[-8, 6], [-10, 8]]$."
   },
   "uz": {
    "t": "Berilgan A = $\\begin{pmatrix}-2 & 4 \\\\ 0 & 2 \\end{pmatrix}$, B = $\\begin{pmatrix}1 & 3 \\\\ 5 & -1 \\end{pmatrix}$. A + B, A - B, -2A, 3A - 2B ni hisoblang.",
    "o": [
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}4 & -8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 8 \\end{pmatrix}$",
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}4 & -8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-4 & 6 \\\\ -10 & 4 \\end{pmatrix}$",
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}-4 & 8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 8 \\end{pmatrix}$",
     "A + B = $\\begin{pmatrix}-1 & 7 \\\\ 5 & 1 \\end{pmatrix}$, A - B = $\\begin{pmatrix}-3 & 1 \\\\ -5 & 3 \\end{pmatrix}$, -2A = $\\begin{pmatrix}-4 & 8 \\\\ 0 & -4 \\end{pmatrix}$, 3A - 2B = $\\begin{pmatrix}-8 & 6 \\\\ -10 & 4 \\end{pmatrix}$"
    ],
    "e": "$A + B = [[-1, 7], [5, 1]]$; $A - B = [[-3, 1], [-5, 3]]$; $-2A = [[4, -8], [0, -4]]$; $3A - 2B = [[-6-2, 12-6], [0-10, 6+2]] = [[-8, 6], [-10, 8]]$."
   }
  },
  {
   "t": "A is $4 \\times 3$, B is $3 \\times 2$, $x \\in \\mathbb{R}^2$, $y \\in \\mathbb{R}^3$, $z \\in \\mathbb{R}^4$. Which of Ax, Ay, Az, Bx, By, Bz are defined, and with what output sizes?",
   "o": [
    "Ay: defined, output $\\mathbb{R}^4$; Bx: defined, output $\\mathbb{R}^3$; others undefined",
    "Ay: defined, output $\\mathbb{R}^4$; Bx: defined, output $\\mathbb{R}^3$; By: defined, output $\\mathbb{R}^2$; others undefined",
    "Ax: defined, output $\\mathbb{R}^3$; Bx: defined, output $\\mathbb{R}^3$; others undefined",
    "Ax: defined, output $\\mathbb{R}^4$; Bz: defined, output $\\mathbb{R}^2$; others undefined"
   ],
   "e": "Matrix multiplication requires the number of columns in the first matrix to match the number of rows in the second. Only Ay ($4 \\times 3$ times $3 \\times 1$) and Bx ($3 \\times 2$ times $2 \\times 1$) satisfy this condition.",
   "ru": {
    "t": "A имеет размер $4 \\times 3$, B — $3 \\times 2$, $x \\in \\mathbb{R}^2$, $y \\in \\mathbb{R}^3$, $z \\in \\mathbb{R}^4$. Какие из произведений Ax, Ay, Az, Bx, By, Bz определены и каковы размеры результата?",
    "o": [
     "Ay: определено, результат $\\mathbb{R}^4$; Bx: определено, результат $\\mathbb{R}^3$; остальные не определены",
     "Ay: определено, результат $\\mathbb{R}^4$; Bx: определено, результат $\\mathbb{R}^3$; By: определено, результат $\\mathbb{R}^2$; остальные не определены",
     "Ax: определено, результат $\\mathbb{R}^3$; Bx: определено, результат $\\mathbb{R}^3$; остальные не определены",
     "Ax: определено, результат $\\mathbb{R}^4$; Bz: определено, результат $\\mathbb{R}^2$; остальные не определены"
    ],
    "e": "Для умножения матриц число столбцов первой матрицы должно совпадать с числом строк второй. Только Ay ($4 \\times 3$ на $3 \\times 1$) и Bx ($3 \\times 2$ на $2 \\times 1$) удовлетворяют этому условию."
   },
   "uz": {
    "t": "A matritsasi $4 \\times 3$, B esa $3 \\times 2$, $x \\in \\mathbb{R}^2$, $y \\in \\mathbb{R}^3$, $z \\in \\mathbb{R}^4$. Ax, Ay, Az, Bx, By, Bz dan qaysilari aniqlangan va natija oʻlchamlari qanday boʻladi?",
    "o": [
     "Ay: aniqlangan, natija $\\mathbb{R}^4$; Bx: aniqlangan, natija $\\mathbb{R}^3$; qolganlari aniqlanmagan",
     "Ay: aniqlangan, natija $\\mathbb{R}^4$; Bx: aniqlangan, natija $\\mathbb{R}^3$; By: aniqlangan, natija $\\mathbb{R}^2$; qolganlari aniqlanmagan",
     "Ax: aniqlangan, natija $\\mathbb{R}^3$; Bx: aniqlangan, natija $\\mathbb{R}^3$; qolganlari aniqlanmagan",
     "Ax: aniqlangan, natija $\\mathbb{R}^4$; Bz: aniqlangan, natija $\\mathbb{R}^2$; qolganlari aniqlanmagan"
    ],
    "e": "Matritsalarni koʻpaytirish uchun birinchi matritsaning ustunlar soni ikkinchi matritsaning qatorlar soniga teng boʻlishi kerak. Faqat Ay ($4 \\times 3$ va $3 \\times 1$) hamda Bx ($3 \\times 2$ va $2 \\times 1$) shu shartni qanoatlantiradi."
   }
  },
  {
   "t": "Let D = diag($-2$, $3$, $1$), x = ($4$, $-1$, $5$)ᵀ. Compute Dx; describe what D does to each coordinate.",
   "o": [
    "Dx = ($-8$, $3$, $5$)ᵀ; D scales first coordinate by $-2$, second by $3$, third by $1$",
    "Dx = ($8$, $-3$, $5$)ᵀ; D scales first coordinate by $-2$, second by $3$, third by $1$",
    "Dx = ($-8$, $-3$, $5$)ᵀ; D scales first coordinate by $-2$, second by $3$, third by $1$",
    "Dx = ($-8$, $3$, $5$)ᵀ; D scales first coordinate by $2$, second by $-3$, third by $1$"
   ],
   "e": "Multiplying a diagonal matrix by a vector scales each component by the corresponding diagonal element. Thus, Dx = ($-2 \\times 4$, $3 \\times (-1)$, $1 \\times 5$)ᵀ = ($-8$, $3$, $5$)ᵀ.",
   "ru": {
    "t": "Пусть D = diag($-2$, $3$, $1$), x = ($4$, $-1$, $5$)ᵀ. Вычислите Dx; опишите, что D делает с каждой координатой.",
    "o": [
     "Dx = ($-8$, $3$, $5$)ᵀ; D масштабирует первую координату на $-2$, вторую на $3$, третью на $1$",
     "Dx = ($8$, $-3$, $5$)ᵀ; D масштабирует первую координату на $-2$, вторую на $3$, третью на $1$",
     "Dx = ($-8$, $-3$, $5$)ᵀ; D масштабирует первую координату на $-2$, вторую на $3$, третью на $1$",
     "Dx = ($-8$, $3$, $5$)ᵀ; D масштабирует первую координату на $2$, вторую на $-3$, третью на $1$"
    ],
    "e": "Умножение диагональной матрицы на вектор масштабирует каждую компоненту на соответствующий диагональный элемент. Таким образом, Dx = ($-2 \\times 4$, $3 \\times (-1)$, $1 \\times 5$)ᵀ = ($-8$, $3$, $5$)ᵀ."
   },
   "uz": {
    "t": "Berilgan D = diag($-2$, $3$, $1$), x = ($4$, $-1$, $5$)ᵀ. Dx ni hisoblang; D har bir koordinataga nima qilishini tavsiflang.",
    "o": [
     "Dx = ($-8$, $3$, $5$)ᵀ; D birinchi koordinatani $-2$ ga, ikkinchisini $3$ ga, uchinchisini $1$ ga koʻpaytiradi",
     "Dx = ($8$, $-3$, $5$)ᵀ; D birinchi koordinatani $-2$ ga, ikkinchisini $3$ ga, uchinchisini $1$ ga koʻpaytiradi",
     "Dx = ($-8$, $-3$, $5$)ᵀ; D birinchi koordinatani $-2$ ga, ikkinchisini $3$ ga, uchinchisini $1$ ga koʻpaytiradi",
     "Dx = ($-8$, $3$, $5$)ᵀ; D birinchi koordinatani $2$ ga, ikkinchisini $-3$ ga, uchinchisini $1$ ga koʻpaytiradi"
    ],
    "e": "Diagonal matritsani vektorga koʻpaytirish har bir komponentni mos diagonal elementga koʻpaytiradi. Demak, Dx = ($-2 \\times 4$, $3 \\times (-1)$, $1 \\times 5$)ᵀ = ($-8$, $3$, $5$)ᵀ."
   }
  },
  {
   "t": "Let $A = \\begin{pmatrix}1 & -2 \\ 4 & 0 \\ -1 & 0\\end{pmatrix}$, $x = (2, -1, 3)^{T}$. Compute $Ax$ (a) as a combination of columns, (b) by row dot products.",
   "o": [
    "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (5,1)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$",
    "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (1,5)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (5,13)$",
    "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (5,1)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (5,13)$",
    "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (2+2-3, 8+0-3) = (1,5)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$"
   ],
   "e": "The combination of columns gives $(2*1 + (-1)*(-2) + 3*(-1), 2*4 + (-1)*0 + 3*(-1)) = (1,5)$. Row dot products give $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$.",
   "ru": {
    "t": "Пусть $A = \\begin{pmatrix}1 & -2 \\ 4 & 0 \\ -1 & 0\\end{pmatrix}$, $x = (2, -1, 3)^{T}$. Вычислите $Ax$ (a) как комбинацию столбцов, (b) через скалярные произведения строк.",
    "o": [
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (5,1)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$",
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (1,5)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (5,13)$",
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (5,1)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (5,13)$",
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (2+2-3, 8+0-3) = (1,5)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$"
    ],
    "e": "Комбинация столбцов даёт $(2*1 + (-1)*(-2) + 3*(-1), 2*4 + (-1)*0 + 3*(-1)) = (1,5)$. Скалярные произведения строк дают $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$."
   },
   "uz": {
    "t": "Berilgan $A = \\begin{pmatrix}1 & -2 \\ 4 & 0 \\ -1 & 0\\end{pmatrix}$, $x = (2, -1, 3)^{T}$. $Ax$ ni hisoblang: (a) ustunlar kombinatsiyasi sifatida, (b) qatorlar skalyar koʻpaytmalari orqali.",
    "o": [
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (5,1)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$",
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (1,5)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (5,13)$",
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (5,1)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (5,13)$",
     "(a) $2*(1,4) + (-1)*(-2,0) + 3*(-1,-1) = (2+2-3, 8+0-3) = (1,5)$, (b) $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$"
    ],
    "e": "Ustunlar kombinatsiyasi $(2*1 + (-1)*(-2) + 3*(-1), 2*4 + (-1)*0 + 3*(-1)) = (1,5)$ ni beradi. Qatorlar skalyar koʻpaytmalari esa $(1*2 + (-2)*(-1) + 3*(-1), 4*2 + 0*(-1) + (-1)*3) = (13,5)$ ni beradi."
   }
  },
  {
   "t": "Let a₁ = $(1, 2)^T$, a₂ = $(3, -1)^T$. Find x = $(x₁, x₂)^T$ with $x₁a₁ + x₂a₂ = (11, 1)^T$.",
   "o": [
    "$x_{1} = 2$, $x_{2} = 3$",
    "$x_{1} = 1$, $x_{2} = 3$",
    "$x_{1} = 3$, $x_{2} = 2$",
    "$x_{1} = 3$, $x_{2} = 1$"
   ],
   "e": "Solving the system $x₁ + 3x₂ = 11$ and $2x₁ - x₂ = 1$ gives $x₁ = 2$ and $x₂ = 3.$",
   "ru": {
    "t": "Пусть a₁ = $(1, 2)^T$, a₂ = $(3, -1)^T$. Найдите x = $(x₁, x₂)^T$ такой, что $x₁a₁ + x₂a₂ = (11, 1)^T$.",
    "o": [
     "$x_{1} = 2$, $x_{2} = 3$",
     "$x_{1} = 1$, $x_{2} = 3$",
     "$x_{1} = 3$, $x_{2} = 2$",
     "$x_{1} = 3$, $x_{2} = 1$"
    ],
    "e": "Решение системы $x₁ + 3x₂ = 11$ и $2x₁ - x₂ = 1$ даёт $x₁ = 2$ и $x₂ = 3.$"
   },
   "uz": {
    "t": "a₁ = $(1, 2)^T$, a₂ = $(3, -1)^T$ boʻlsin. $x₁a₁ + x₂a₂ = (11, 1)^T$ boʻladigan x = $(x₁, x₂)^T$ ni toping.",
    "o": [
     "$x_{1} = 2$, $x_{2} = 3$",
     "$x_{1} = 1$, $x_{2} = 3$",
     "$x_{1} = 3$, $x_{2} = 2$",
     "$x_{1} = 3$, $x_{2} = 1$"
    ],
    "e": "$x₁ + 3x₂ = 11$ va $2x₁ - x₂ = 1$ sistemasini yechish $x₁ = 2$ va $x₂ = 3.$ ni beradi."
   }
  },
  {
   "t": "Let $A = [2, 4$; -1, -2]. Describe all x with $Ax = 0$; why are the columns dependent?",
   "o": [
    "$x = t(1,-2)$, columns are dependent because there exists a nontrivial combination that gives zero",
    "$x = t(1,2)$, columns are dependent because one is a multiple of the other",
    "$x = t(2,1)$, columns are dependent because one is a multiple of the other",
    "$x = t(-2,1)$, columns are dependent because there exists a nontrivial combination that gives zero"
   ],
   "e": "The equation $Ax = 0$ reduces to $x_{1} = -2x_{2}$, so solutions are $x = t(-2,1)$. Columns are dependent because $-2a_{1} + 1a_{2} = 0$ is a nontrivial combination.",
   "ru": {
    "t": "Пусть $A = [2, 4$; -1, -2]. Опишите все x, для которых $Ax = 0$; почему столбцы линейно зависимы?",
    "o": [
     "$x = t(1,-2)$, столбцы зависимы, потому что существует нетривиальная комбинация, дающая ноль",
     "$x = t(1,2)$, столбцы зависимы, потому что один из них кратен другому",
     "$x = t(2,1)$, столбцы зависимы, потому что один из них кратен другому",
     "$x = t(-2,1)$, столбцы зависимы, потому что существует нетривиальная комбинация, дающая ноль"
    ],
    "e": "Уравнение $Ax = 0$ сводится к $x_{1} = -2x_{2}$, поэтому решения имеют вид $x = t(-2,1)$. Столбцы зависимы, поскольку $-2a_{1} + 1a_{2} = 0$ — нетривиальная комбинация."
   },
   "uz": {
    "t": "Berilgan $A = [2, 4$; -1, -2]. $Ax = 0$ boʻladigan barcha x ni tasvirlang; ustunlar nima uchun chiziqli bogʻliq?",
    "o": [
     "$x = t(1,-2)$, ustunlar chiziqli bogʻliq, chunki nol beruvchi notrivial kombinatsiya mavjud",
     "$x = t(1,2)$, ustunlar chiziqli bogʻliq, chunki biri ikkinchisining koʻpaytmasi",
     "$x = t(2,1)$, ustunlar chiziqli bogʻliq, chunki biri ikkinchisining koʻpaytmasi",
     "$x = t(-2,1)$, ustunlar chiziqli bogʻliq, chunki nol beruvchi notrivial kombinatsiya mavjud"
    ],
    "e": "$Ax = 0$ tenglama $x_{1} = -2x_{2}$ ga kamayadi, shuning uchun yechimlar $x = t(-2,1)$ koʻrinishida. Ustunlar chiziqli bogʻliq, chunki $-2a_{1} + 1a_{2} = 0$ — notrivial kombinatsiya."
   }
  },
  {
   "t": "A is $3\\times2$ with $A = \\begin{pmatrix}2 & 3 \\ -1 & 2 \\ 4 & 0\\end{pmatrix}$. Compute $A\\begin{bmatrix}-2 \\ 5\\end{bmatrix}$ without row dot products.",
   "o": [
    "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (-4+15, 2+10, -8+0) = (11,12,-8)$",
    "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (4-15, -2-10, 8-0) = (-11,-12,8)$",
    "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (-4-15, 2-10, -8-0) = (-19,-8,-8)$",
    "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (4+15, -2+10, 8+0) = (19,8,8)$"
   ],
   "e": "Using linearity, $A\\begin{bmatrix}-2 \\ 5\\end{bmatrix} = -2Ae_1 + 5Ae_2 = -2*(2,-1,4) + 5*(3,2,0) = (-4+15, 2+10, -8+0) = (11,12,-8)$.",
   "ru": {
    "t": "Матрица A имеет размер $3\\times2$, $A = \\begin{pmatrix}2 & 3 \\ -1 & 2 \\ 4 & 0\\end{pmatrix}$. Вычислите $A\\begin{bmatrix}-2 \\ 5\\end{bmatrix}$ без скалярных произведений строк.",
    "o": [
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (-4+15, 2+10, -8+0) = (11,12,-8)$",
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (4-15, -2-10, 8-0) = (-11,-12,8)$",
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (-4-15, 2-10, -8-0) = (-19,-8,-8)$",
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (4+15, -2+10, 8+0) = (19,8,8)$"
    ],
    "e": "Используя линейность, $A\\begin{bmatrix}-2 \\ 5\\end{bmatrix} = -2Ae_1 + 5Ae_2 = -2*(2,-1,4) + 5*(3,2,0) = (-4+15, 2+10, -8+0) = (11,12,-8)$."
   },
   "uz": {
    "t": "A matritsa $3\\times2$ oʻlchamga ega: $A = \\begin{pmatrix}2 & 3 \\ -1 & 2 \\ 4 & 0\\end{pmatrix}$. $A\\begin{bmatrix}-2 \\ 5\\end{bmatrix}$ ni qatorlar skalyar koʻpaytmalarisiz hisoblang.",
    "o": [
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (-4+15, 2+10, -8+0) = (11,12,-8)$",
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (4-15, -2-10, 8-0) = (-11,-12,8)$",
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (-4-15, 2-10, -8-0) = (-19,-8,-8)$",
     "$-2 \\cdot (2,-1,4) + 5 \\cdot (3,2,0) = (4+15, -2+10, 8+0) = (19,8,8)$"
    ],
    "e": "Chiziqlikdan foydalanib, $A\\begin{bmatrix}-2 \\ 5\\end{bmatrix} = -2Ae_1 + 5Ae_2 = -2*(2,-1,4) + 5*(3,2,0) = (-4+15, 2+10, -8+0) = (11,12,-8)$."
   }
  },
  {
   "t": "Expand $(u + v) · (u − v)$ for same-dimension vectors. What condition must be satisfied for $u + v$ to be orthogonal to $u − v$?",
   "o": [
    "$||u||^{2} - ||v||^{2} = 0$",
    "$||u||^{2} + ||v||^{2} = 0$",
    "$u · v = 0$",
    "$u + v = 0$"
   ],
   "e": "The expansion simplifies to $||u||^{2} - ||v||^{2}$, which equals zero when $||u|| = ||v||$.",
   "ru": {
    "t": "Раскройте $(u + v) · (u − v)$ для векторов одинаковой размерности. Какое условие должно выполняться, чтобы $u + v$ был ортогонален $u − v$?",
    "o": [
     "$||u||^{2} - ||v||^{2} = 0$",
     "$||u||^{2} + ||v||^{2} = 0$",
     "$u · v = 0$",
     "$u + v = 0$"
    ],
    "e": "После раскрытия получается $||u||^{2} - ||v||^{2}$, что равно нулю при $||u|| = ||v||$."
   },
   "uz": {
    "t": "Bir xil oʻlchamli vektorlar uchun $(u + v) · (u − v)$ ni yoyib oching. $u + v$ vektor $u − v$ vektorga ortogonal boʻlishi uchun qanday shart bajarilishi kerak?",
    "o": [
     "$||u||^{2} - ||v||^{2} = 0$",
     "$||u||^{2} + ||v||^{2} = 0$",
     "$u · v = 0$",
     "$u + v = 0$"
    ],
    "e": "Yoyib ochilganda $||u||^{2} - ||v||^{2}$ hosil boʻladi, bu esa $||u|| = ||v||$ boʻlganda nolga teng."
   }
  },
  {
   "t": "Which of the following correctly describes the outputs of dot and cross products, the sign classification of angles, matrix-vector multiplication requirements, and dimension-specific operations?",
   "o": [
    "Dot product: scalar, Cross product: vector; Positive: acute, Zero: right; Matrix-vector requires matching outer dimensions; Addition and subtraction need equal dimensions, cross product only in $\\mathbb{R}^3$",
    "Dot product: vector, Cross product: scalar; Positive: obtuse, Zero: acute; Matrix-vector requires matching inner dimensions; Dot product and cross product need equal dimensions",
    "Dot product: vector, Cross product: scalar; Positive: right, Zero: obtuse; Matrix-vector requires vectors in $\\mathbb{R}^2$; All operations need equal dimensions",
    "Dot product: scalar, Cross product: vector; Positive: obtuse, Zero: acute; Matrix-vector requires vectors in $\\mathbb{R}^3$; Only cross product needs equal dimensions"
   ],
   "e": "Dot product produces a scalar and cross product a vector; positive dot product indicates acute angle, zero indicates right angle; matrix-vector multiplication requires inner dimensions to match; addition/subtraction need equal dimensions while cross product is specific to $\\mathbb{R}^3$.",
   "ru": {
    "t": "Какой из следующих вариантов верно описывает результаты скалярного и векторного произведений, классификацию углов по знаку, требования к умножению матрицы на вектор и операции, зависящие от размерности?",
    "o": [
     "Скалярное произведение: скаляр, векторное произведение: вектор; положительный: острый, нулевой: прямой; умножение матрицы на вектор требует совпадения внешних размерностей; сложение и вычитание требуют равных размерностей, векторное произведение — только в $\\mathbb{R}^3$",
     "Скалярное произведение: вектор, векторное произведение: скаляр; положительный: тупой, нулевой: острый; умножение матрицы на вектор требует совпадения внутренних размерностей; скалярное и векторное произведения требуют равных размерностей",
     "Скалярное произведение: вектор, векторное произведение: скаляр; положительный: прямой, нулевой: тупой; умножение матрицы на вектор требует векторов из $\\mathbb{R}^2$; все операции требуют равных размерностей",
     "Скалярное произведение: скаляр, векторное произведение: вектор; положительный: тупой, нулевой: острый; умножение матрицы на вектор требует векторов из $\\mathbb{R}^3$; только векторное произведение требует равных размерностей"
    ],
    "e": "Скалярное произведение даёт скаляр, а векторное — вектор; положительное скалярное произведение означает острый угол, нулевое — прямой; умножение матрицы на вектор требует совпадения внутренних размерностей; сложение/вычитание требуют равных размерностей, а векторное произведение определено только в $\\mathbb{R}^3$."
   },
   "uz": {
    "t": "Quyidagilardan qaysi biri skalyar va vektor koʻpaytmalarning natijalarini, burchaklarni belgi boʻyicha tasnifini, matritsa-vektor koʻpaytmasi talablarini hamda oʻlchamga bogʻliq amallarni toʻgʻri tasvirlaydi?",
    "o": [
     "Skalyar koʻpaytma: skalyar, vektor koʻpaytma: vektor; musbat: oʻtkir, nol: toʻgʻri; matritsa-vektor koʻpaytmasi tashqi oʻlchamlar mosligini talab qiladi; qoʻshish va ayirish teng oʻlchamlarni talab qiladi, vektor koʻpaytma faqat $\\mathbb{R}^3$ da",
     "Skalyar koʻpaytma: vektor, vektor koʻpaytma: skalyar; musbat: oʻtmas, nol: oʻtkir; matritsa-vektor koʻpaytmasi ichki oʻlchamlar mosligini talab qiladi; skalyar va vektor koʻpaytmalar teng oʻlchamlarni talab qiladi",
     "Skalyar koʻpaytma: vektor, vektor koʻpaytma: skalyar; musbat: toʻgʻri, nol: oʻtmas; matritsa-vektor koʻpaytmasi $\\mathbb{R}^2$ dagi vektorlarni talab qiladi; barcha amallar teng oʻlchamlarni talab qiladi",
     "Skalyar koʻpaytma: skalyar, vektor koʻpaytma: vektor; musbat: oʻtmas, nol: oʻtkir; matritsa-vektor koʻpaytmasi $\\mathbb{R}^3$ dagi vektorlarni talab qiladi; faqat vektor koʻpaytma teng oʻlchamlarni talab qiladi"
    ],
    "e": "Skalyar koʻpaytma skalyar, vektor koʻpaytma esa vektor hosil qiladi; musbat skalyar koʻpaytma oʻtkir burchakni, nol esa toʻgʻri burchakni bildiradi; matritsa-vektor koʻpaytmasi ichki oʻlchamlar mosligini talab qiladi; qoʻshish/ayirish teng oʻlchamlarni talab qiladi, vektor koʻpaytma esa faqat $\\mathbb{R}^3$ ga xos."
   }
  },
  {
   "t": "Given vectors $a = [-2, 5]$ and $b = [5, -2]$, compute their dot product and classify the angle between them.",
   "o": [
    "$a \\cdot b = -6$; obtuse angle",
    "$a \\cdot b = 0$; right angle",
    "$a \\cdot b = 15$; acute angle",
    "$a \\cdot b = 4$; acute angle"
   ],
   "e": "The dot product is $(-2)(5) + (5)(-2) = -10 - 10 = -20$, which is negative, indicating an obtuse angle.",
   "ru": {
    "t": "Для векторов $a = [-2, 5]$ и $b = [5, -2]$ вычислите их скалярное произведение и определите тип угла между ними.",
    "o": [
     "$a \\cdot b = -6$; тупой угол",
     "$a \\cdot b = 0$; прямой угол",
     "$a \\cdot b = 15$; острый угол",
     "$a \\cdot b = 4$; острый угол"
    ],
    "e": "Скалярное произведение равно $(-2)(5) + (5)(-2) = -10 - 10 = -20$ — оно отрицательно, что указывает на тупой угол."
   },
   "uz": {
    "t": "$a = [-2, 5]$ va $b = [5, -2]$ vektorlar uchun skalyar koʻpaytmanni hisoblang va ular orasidagi burchakni tasniflang.",
    "o": [
     "$a \\cdot b = -6$; oʻtmas burchak",
     "$a \\cdot b = 0$; toʻgʻri burchak",
     "$a \\cdot b = 15$; oʻtkir burchak",
     "$a \\cdot b = 4$; oʻtkir burchak"
    ],
    "e": "Skalyar koʻpaytma $(-2)(5) + (5)(-2) = -10 - 10 = -20$ ga teng; u manfiy, bu esa oʻtmas burchakni bildiradi."
   }
  },
  {
   "t": "Find the norm and a unit vector in the direction of $v = [-2, 1, 2]$.",
   "o": [
    "||v|| = $3$, unit vector = [$−2/3$, $1/3$, $2/3$]",
    "||v|| = $3$, unit vector = [$2/3$, $-1/3$, $-2/3$]",
    "||v|| = $9$, unit vector = [$−2/9$, $1/9$, $2/9$]",
    "||v|| = $√3$, unit vector = [$−2/√3$, $1/√3$, $2/√3$]"
   ],
   "e": "The norm is $√((−2)^2 + 1^2 + 2^2) = √(4 + 1 + 4) = 3$, and the unit vector is each component divided by $3$.",
   "ru": {
    "t": "Найдите норму и единичный вектор направления $v = [-2, 1, 2]$.",
    "o": [
     "||v|| = $3$, единичный вектор = [$−2/3$, $1/3$, $2/3$]",
     "||v|| = $3$, единичный вектор = [$2/3$, $-1/3$, $-2/3$]",
     "||v|| = $9$, единичный вектор = [$−2/9$, $1/9$, $2/9$]",
     "||v|| = $√3$, единичный вектор = [$−2/√3$, $1/√3$, $2/√3$]"
    ],
    "e": "Норма равна $√((−2)^2 + 1^2 + 2^2) = √(4 + 1 + 4) = 3$, а единичный вектор получается делением каждой компоненты на $3$."
   },
   "uz": {
    "t": "$v = [-2, 1, 2]$ vektorning normasi va yoʻnalishi boʻyicha birlik vektorni toping.",
    "o": [
     "||v|| = $3$, birlik vektor = [$−2/3$, $1/3$, $2/3$]",
     "||v|| = $3$, birlik vektor = [$2/3$, $-1/3$, $-2/3$]",
     "||v|| = $9$, birlik vektor = [$−2/9$, $1/9$, $2/9$]",
     "||v|| = $√3$, birlik vektor = [$−2/√3$, $1/√3$, $2/√3$]"
    ],
    "e": "Norma $√((−2)^2 + 1^2 + 2^2) = √(4 + 1 + 4) = 3$ ga teng, birlik vektor esa har bir komponentni $3$ ga boʻlishdan hosil boʻladi."
   }
  },
  {
   "t": "Find the distance between $p = \\begin{bmatrix}-2 \\ 1 \\ -2\\end{bmatrix}$ and $q = \\begin{bmatrix}2 \\ -1 \\ 2\\end{bmatrix}$.",
   "o": [
    "$\\sqrt{34}$",
    "$\\sqrt{38}$",
    "6",
    "$\\sqrt{30}$"
   ],
   "e": "The distance is calculated as the norm of $p - q = \\begin{bmatrix}-4 \\ 2 \\ -4\\end{bmatrix}$, which equals $\\sqrt{(-4)^{2} + 2^{2} + (-4)^{2}} = \\sqrt{16 + 4 + 16} = \\sqrt{34}$.",
   "ru": {
    "t": "Найдите расстояние между $p = \\begin{bmatrix}-2 \\ 1 \\ -2\\end{bmatrix}$ и $q = \\begin{bmatrix}2 \\ -1 \\ 2\\end{bmatrix}$.",
    "o": [
     "$\\sqrt{34}$",
     "$\\sqrt{38}$",
     "6",
     "$\\sqrt{30}$"
    ],
    "e": "Расстояние вычисляется как норма $p - q = \\begin{bmatrix}-4 \\ 2 \\ -4\\end{bmatrix}$, то есть $\\sqrt{(-4)^{2} + 2^{2} + (-4)^{2}} = \\sqrt{16 + 4 + 16} = \\sqrt{34}$."
   },
   "uz": {
    "t": "$p = \\begin{bmatrix}-2 \\ 1 \\ -2\\end{bmatrix}$ va $q = \\begin{bmatrix}2 \\ -1 \\ 2\\end{bmatrix}$ orasidagi masofani toping.",
    "o": [
     "$\\sqrt{34}$",
     "$\\sqrt{38}$",
     "6",
     "$\\sqrt{30}$"
    ],
    "e": "Masofa $p - q = \\begin{bmatrix}-4 \\ 2 \\ -4\\end{bmatrix}$ normasi sifatida hisoblanadi: $\\sqrt{(-4)^{2} + 2^{2} + (-4)^{2}} = \\sqrt{16 + 4 + 16} = \\sqrt{34}$."
   }
  },
  {
   "t": "Find $t$ if $\\begin{bmatrix}-1 \\ t \\ 2\\end{bmatrix}$ is orthogonal to $\\begin{bmatrix}-3 \\ -3 \\ 8\\end{bmatrix}$.",
   "o": [
    "$\\frac{10}{3}$",
    "$\\frac{3}{10}$",
    "$-\\frac{10}{3}$",
    "$\\frac{2}{3}$"
   ],
   "e": "For orthogonality, the dot product must be zero: $(-1)(-3) + t(-3) + 2(8) = 0 \\Rightarrow 3 - 3t + 16 = 0 \\Rightarrow t = \\frac{19}{3}$.",
   "ru": {
    "t": "Найдите $t$, если $\\begin{bmatrix}-1 \\ t \\ 2\\end{bmatrix}$ ортогонален $\\begin{bmatrix}-3 \\ -3 \\ 8\\end{bmatrix}$.",
    "o": [
     "$\\frac{10}{3}$",
     "$\\frac{3}{10}$",
     "$-\\frac{10}{3}$",
     "$\\frac{2}{3}$"
    ],
    "e": "Для ортогональности скалярное произведение должно быть нулевым: $(-1)(-3) + t(-3) + 2(8) = 0 \\Rightarrow 3 - 3t + 16 = 0 \\Rightarrow t = \\frac{19}{3}$."
   },
   "uz": {
    "t": "$\\begin{bmatrix}-1 \\ t \\ 2\\end{bmatrix}$ vektori $\\begin{bmatrix}-3 \\ -3 \\ 8\\end{bmatrix}$ vektorga ortogonal boʻlsa, $t$ ni toping.",
    "o": [
     "$\\frac{10}{3}$",
     "$\\frac{3}{10}$",
     "$-\\frac{10}{3}$",
     "$\\frac{2}{3}$"
    ],
    "e": "Ortogonallik uchun skalyar koʻpaytma nol boʻlishi kerak: $(-1)(-3) + t(-3) + 2(8) = 0 \\Rightarrow 3 - 3t + 16 = 0 \\Rightarrow t = \\frac{19}{3}$."
   }
  },
  {
   "t": "Find cos θ for $u = [1, 2]^{T}$ and $v = [2, 4]^{T}$.",
   "o": [
    "1",
    "$\\frac{1}{\\sqrt{5}}$",
    "$\\frac{2}{\\sqrt{5}}$",
    "$\\frac{\\sqrt{5}}{2}$"
   ],
   "e": "u · v = 1(2) + 2(4) = $10$, ||u|| = $\\sqrt{5}$, ||v|| = $\\sqrt{20}$ = $2\\sqrt{5}$. Thus cos θ = $\\frac{10}{\\sqrt{5}·2\\sqrt{5}} = \\frac{10}{10} = 1$.",
   "ru": {
    "t": "Найдите cos θ для $u = [1, 2]^{T}$ и $v = [2, 4]^{T}$.",
    "o": [
     "1",
     "$\\frac{1}{\\sqrt{5}}$",
     "$\\frac{2}{\\sqrt{5}}$",
     "$\\frac{\\sqrt{5}}{2}$"
    ],
    "e": "u · v = 1(2) + 2(4) = $10$, ||u|| = $\\sqrt{5}$, ||v|| = $\\sqrt{20}$ = $2\\sqrt{5}$. Следовательно, cos θ = $\\frac{10}{\\sqrt{5}·2\\sqrt{5}} = \\frac{10}{10} = 1$."
   },
   "uz": {
    "t": "$u = [1, 2]^{T}$ va $v = [2, 4]^{T}$ uchun cos θ ni toping.",
    "o": [
     "1",
     "$\\frac{1}{\\sqrt{5}}$",
     "$\\frac{2}{\\sqrt{5}}$",
     "$\\frac{\\sqrt{5}}{2}$"
    ],
    "e": "u · v = 1(2) + 2(4) = $10$, ||u|| = $\\sqrt{5}$, ||v|| = $\\sqrt{20}$ = $2\\sqrt{5}$. Demak, cos θ = $\\frac{10}{\\sqrt{5}·2\\sqrt{5}} = \\frac{10}{10} = 1$."
   }
  },
  {
   "t": "Project $u = (5, -1)^{T}$ onto $v = (2, 1)^{T}$; write u as parallel + orthogonal parts.",
   "o": [
    "Parallel: ($\\frac{18}{5}$, $\\frac{9}{5}$)^T, Orthogonal: ($\\frac{7}{5}$, $-\\frac{14}{5}$)^T",
    "Parallel: ($\\frac{9}{5}$, $\\frac{18}{5}$)^T, Orthogonal: ($-\\frac{16}{5}$, $\\frac{23}{5}$)^T",
    "Parallel: ($\\frac{9}{5}$, $\\frac{18}{5}$)^T, Orthogonal: ($\\frac{16}{5}$, $-\\frac{23}{5}$)^T",
    "Parallel: ($\\frac{18}{5}$, $\\frac{9}{5}$)^T, Orthogonal: ($-\\frac{7}{5}$, $\\frac{14}{5}$)^T"
   ],
   "e": "The projection is ($u·v$)/($v·v$) * v = $\\frac{9}{5}$ * ($2$,$1$)^T = ($\\frac{18}{5}$, $\\frac{9}{5}$)^T. The orthogonal part is u - projection = ($5$-$\\frac{18}{5}$, $-1$-$\\frac{9}{5}$)^T = ($\\frac{7}{5}$, $-\\frac{14}{5}$)^T.",
   "ru": {
    "t": "Спроецируйте $u = (5, -1)^{T}$ на $v = (2, 1)^{T}$; представьте u в виде суммы параллельной и ортогональной частей.",
    "o": [
     "Параллельная: ($\\frac{18}{5}$, $\\frac{9}{5}$)^T, ортогональная: ($\\frac{7}{5}$, $-\\frac{14}{5}$)^T",
     "Параллельная: ($\\frac{9}{5}$, $\\frac{18}{5}$)^T, ортогональная: ($-\\frac{16}{5}$, $\\frac{23}{5}$)^T",
     "Параллельная: ($\\frac{9}{5}$, $\\frac{18}{5}$)^T, ортогональная: ($\\frac{16}{5}$, $-\\frac{23}{5}$)^T",
     "Параллельная: ($\\frac{18}{5}$, $\\frac{9}{5}$)^T, ортогональная: ($-\\frac{7}{5}$, $\\frac{14}{5}$)^T"
    ],
    "e": "Проекция равна ($u·v$)/($v·v$) * v = $\\frac{9}{5}$ * ($2$,$1$)^T = ($\\frac{18}{5}$, $\\frac{9}{5}$)^T. Ортогональная часть: u - проекция = ($5$-$\\frac{18}{5}$, $-1$-$\\frac{9}{5}$)^T = ($\\frac{7}{5}$, $-\\frac{14}{5}$)^T."
   },
   "uz": {
    "t": "$u = (5, -1)^{T}$ vektorni $v = (2, 1)^{T}$ vektorga proyeksiyalang; u vektorni parallel + ortogonal qismlar koʻrinishida yozing.",
    "o": [
     "Parallel: ($\\frac{18}{5}$, $\\frac{9}{5}$)^T, ortogonal: ($\\frac{7}{5}$, $-\\frac{14}{5}$)^T",
     "Parallel: ($\\frac{9}{5}$, $\\frac{18}{5}$)^T, ortogonal: ($-\\frac{16}{5}$, $\\frac{23}{5}$)^T",
     "Parallel: ($\\frac{9}{5}$, $\\frac{18}{5}$)^T, ortogonal: ($\\frac{16}{5}$, $-\\frac{23}{5}$)^T",
     "Parallel: ($\\frac{18}{5}$, $\\frac{9}{5}$)^T, ortogonal: ($-\\frac{7}{5}$, $\\frac{14}{5}$)^T"
    ],
    "e": "Proyeksiya ($u·v$)/($v·v$) * v = $\\frac{9}{5}$ * ($2$,$1$)^T = ($\\frac{18}{5}$, $\\frac{9}{5}$)^T ga teng. Ortogonal qism esa u - proyeksiya = ($5$-$\\frac{18}{5}$, $-1$-$\\frac{9}{5}$)^T = ($\\frac{7}{5}$, $-\\frac{14}{5}$)^T ga teng."
   }
  },
  {
   "t": "Compute a × b for $a = [-1, 0, 2]$ and $b = [1, 3, 4]$.",
   "o": [
    "[-13, -2, 4]",
    "[-13, 2, -4]",
    "[13, -2, -4]",
    "[-13, -2, -4]"
   ],
   "e": "The cross product is calculated as $[(-1)·1 - 3·4, 3·0 - 2·1, 2·4 - (-1)·0] = [-13, -2, 4]$.",
   "ru": {
    "t": "Вычислите a × b для $a = [-1, 0, 2]$ и $b = [1, 3, 4]$.",
    "o": [
     "[-13, -2, 4]",
     "[-13, 2, -4]",
     "[13, -2, -4]",
     "[-13, -2, -4]"
    ],
    "e": "Векторное произведение вычисляется как $[(-1)·1 - 3·4, 3·0 - 2·1, 2·4 - (-1)·0] = [-13, -2, 4]$."
   },
   "uz": {
    "t": "$a = [-1, 0, 2]$ va $b = [1, 3, 4]$ uchun a × b ni hisoblang.",
    "o": [
     "[-13, -2, 4]",
     "[-13, 2, -4]",
     "[13, -2, -4]",
     "[-13, -2, -4]"
    ],
    "e": "Vektor koʻpaytma quyidagicha hisoblanadi: $[(-1)·1 - 3·4, 3·0 - 2·1, 2·4 - (-1)·0] = [-13, -2, 4]$."
   }
  },
  {
   "t": "Given points A = (0, 0, 0), B = (2, 1, 0), and C = (1, 0, 3), find the area of triangle ABC.",
   "o": [
    "$\\frac{\\sqrt{46}}{2}$",
    "$\\sqrt{46}$",
    "$\\sqrt{23}$",
    "$\\sqrt{92}$"
   ],
   "e": "The cross product of AB and AC is $[-6, -1, -1]$, whose norm is $\\sqrt{38}$. The area is half of this norm, which is $\\frac{\\sqrt{46}}{2}$.",
   "ru": {
    "t": "Даны точки A = (0, 0, 0), B = (2, 1, 0) и C = (1, 0, 3); найдите площадь треугольника ABC.",
    "o": [
     "$\\frac{\\sqrt{46}}{2}$",
     "$\\sqrt{46}$",
     "$\\sqrt{23}$",
     "$\\sqrt{92}$"
    ],
    "e": "Векторное произведение AB и AC равно $[-6, -1, -1]$, его норма равна $\\sqrt{38}$. Площадь равна половине этой нормы, то есть $\\frac{\\sqrt{46}}{2}$."
   },
   "uz": {
    "t": "A = (0, 0, 0), B = (2, 1, 0) va C = (1, 0, 3) nuqtalar berilgan; ABC uchburchakning yuzasini toping.",
    "o": [
     "$\\frac{\\sqrt{46}}{2}$",
     "$\\sqrt{46}$",
     "$\\sqrt{23}$",
     "$\\sqrt{92}$"
    ],
    "e": "AB va AC vektorlarining vektor koʻpaytmasi $[-6, -1, -1]$ ga teng, uning normasi $\\sqrt{38}$. Yuzalar bu normaning yarmiga teng, yaʼni $\\frac{\\sqrt{46}}{2}$."
   }
  },
  {
   "t": "For matrix $M = \\begin{pmatrix}1 & 0 & -2 \\ 4 & 3 & 5\\end{pmatrix}$, determine its size, element $m_{21}$, and all columns.",
   "o": [
    "$2\\times 3$, 4, [1; 4], [0; 3], [-2; 5]",
    "$2\\times 3$, 3, [1, 4], [0, 3], [-2, 5]",
    "$3\\times 2$, 3, [1, 0, -2], [4, 3, 5]",
    "$3\\times 2$, 4, [1; 4], [0; 3], [-2; 5]"
   ],
   "e": "The matrix has 2 rows and 3 columns ($2\\times 3$). The element $m_{21}$ is in row 2, column 1, which is 4. The columns are $\\begin{pmatrix}1 \\ 4\\end{pmatrix}$, $\\begin{pmatrix}0 \\ 3\\end{pmatrix}$, and $\\begin{pmatrix}-2 \\ 5\\end{pmatrix}$.",
   "ru": {
    "t": "Для матрицы $M = \\begin{pmatrix}1 & 0 & -2 \\ 4 & 3 & 5\\end{pmatrix}$ определите её размер, элемент $m_{21}$ и все столбцы.",
    "o": [
     "$2\\times 3$, 4, [1; 4], [0; 3], [-2; 5]",
     "$2\\times 3$, 3, [1, 4], [0, 3], [-2, 5]",
     "$3\\times 2$, 3, [1, 0, -2], [4, 3, 5]",
     "$3\\times 2$, 4, [1; 4], [0; 3], [-2; 5]"
    ],
    "e": "Матрица имеет 2 строки и 3 столбца ($2\\times 3$). Элемент $m_{21}$ находится в строке 2, столбце 1, он равен 4. Столбцы: $\\begin{pmatrix}1 \\ 4\\end{pmatrix}$, $\\begin{pmatrix}0 \\ 3\\end{pmatrix}$ и $\\begin{pmatrix}-2 \\ 5\\end{pmatrix}$."
   },
   "uz": {
    "t": "$M = \\begin{pmatrix}1 & 0 & -2 \\ 4 & 3 & 5\\end{pmatrix}$ matritsa uchun uning oʻlchamini, $m_{21}$ elementini va barcha ustunlarini aniqlang.",
    "o": [
     "$2\\times 3$, 4, [1; 4], [0; 3], [-2; 5]",
     "$2\\times 3$, 3, [1, 4], [0, 3], [-2, 5]",
     "$3\\times 2$, 3, [1, 0, -2], [4, 3, 5]",
     "$3\\times 2$, 4, [1; 4], [0; 3], [-2; 5]"
    ],
    "e": "Matritsada 2 qator va 3 ustun bor ($2\\times 3$). $m_{21}$ elementi 2-qator, 1-ustunda joylashgan, u 4 ga teng. Ustunlar: $\\begin{pmatrix}1 \\ 4\\end{pmatrix}$, $\\begin{pmatrix}0 \\ 3\\end{pmatrix}$ va $\\begin{pmatrix}-2 \\ 5\\end{pmatrix}$."
   }
  },
  {
   "t": "Let $A = [2, -1$; -2, 3] and $B = [0, 2$; 1, 1]. Find 3A + 2B.",
   "o": [
    "[6, 1; -4, 11]",
    "[6, 1; -2, 11]",
    "[6, -3; -6, 9]",
    "[0, 4; 2, 2]"
   ],
   "e": "$3A = [6, -3$; -6, 9] and $2B = [0, 4$; 2, 2]; adding gives $3A + 2B = [6, 1$; -4, 11].",
   "ru": {
    "t": "Пусть $A = [2, -1$; -2, 3] и $B = [0, 2$; 1, 1]. Найдите 3A + 2B.",
    "o": [
     "[6, 1; -4, 11]",
     "[6, 1; -2, 11]",
     "[6, -3; -6, 9]",
     "[0, 4; 2, 2]"
    ],
    "e": "$3A = [6, -3$; -6, 9] и $2B = [0, 4$; 2, 2]; сложение даёт $3A + 2B = [6, 1$; -4, 11]."
   },
   "uz": {
    "t": "Berilgan $A = [2, -1$; -2, 3] va $B = [0, 2$; 1, 1]. 3A + 2B ni toping.",
    "o": [
     "[6, 1; -4, 11]",
     "[6, 1; -2, 11]",
     "[6, -3; -6, 9]",
     "[0, 4; 2, 2]"
    ],
    "e": "$3A = [6, -3$; -6, 9] va $2B = [0, 4$; 2, 2]; qoʻshish natijasida $3A + 2B = [6, 1$; -4, 11] hosil boʻladi."
   }
  },
  {
   "t": "Let A = $\\begin{pmatrix}1 & 2 \\ -1 & 3 \\ 4 & 0 \\ \\end{pmatrix}$ and x = $(2, -1)^{T}$. Compute Ax as a linear combination of the columns of A.",
   "o": [
    "$Ax = 2\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (0, -5, 8)$",
    "$Ax = 2\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (0, 5, 8)$",
    "$Ax = 2\\cdot (1, -1, 4) + 1\\cdot (2, 3, 0) = (4, 1, 8)$",
    "$Ax = 1\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (-1, -4, 4)$"
   ],
   "e": "Column picture: Ax = 2·col1 - 1·col2 = 2·(1, -1, 4) - (2, 3, 0) = (0, -5, 8). Row check: ($1\\cdot 2 + 2\\cdot (-1)$, $-1\\cdot 2 + 3\\cdot (-1)$, $4\\cdot 2 + 0\\cdot (-1)$) = (0, -5, 8).",
   "ru": {
    "t": "Пусть A = $\\begin{pmatrix}1 & 2 \\ -1 & 3 \\ 4 & 0 \\ \\end{pmatrix}$ и x = $(2, -1)^{T}$. Вычислите Ax как линейную комбинацию столбцов матрицы A.",
    "o": [
     "$Ax = 2\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (0, -5, 8)$",
     "$Ax = 2\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (0, 5, 8)$",
     "$Ax = 2\\cdot (1, -1, 4) + 1\\cdot (2, 3, 0) = (4, 1, 8)$",
     "$Ax = 1\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (-1, -4, 4)$"
    ],
    "e": "Столбцовое представление: Ax = 2·col1 - 1·col2 = 2·(1, -1, 4) - (2, 3, 0) = (0, -5, 8). Проверка по строкам: ($1\\cdot 2 + 2\\cdot (-1)$, $-1\\cdot 2 + 3\\cdot (-1)$, $4\\cdot 2 + 0\\cdot (-1)$) = (0, -5, 8)."
   },
   "uz": {
    "t": "Berilgan A = $\\begin{pmatrix}1 & 2 \\ -1 & 3 \\ 4 & 0 \\ \\end{pmatrix}$ va x = $(2, -1)^{T}$. Ax ni A ustunlarining chiziqli kombiniatsiyasi sifatida hisoblang.",
    "o": [
     "$Ax = 2\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (0, -5, 8)$",
     "$Ax = 2\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (0, 5, 8)$",
     "$Ax = 2\\cdot (1, -1, 4) + 1\\cdot (2, 3, 0) = (4, 1, 8)$",
     "$Ax = 1\\cdot (1, -1, 4) - 1\\cdot (2, 3, 0) = (-1, -4, 4)$"
    ],
    "e": "Ustunlar tilida: Ax = 2·col1 - 1·col2 = 2·(1, -1, 4) - (2, 3, 0) = (0, -5, 8). Qatorlar orqali tekshirish: ($1\\cdot 2 + 2\\cdot (-1)$, $-1\\cdot 2 + 3\\cdot (-1)$, $4\\cdot 2 + 0\\cdot (-1)$) = (0, -5, 8)."
   }
  },
  {
   "t": "Let $a_{1} = [1, 2]$, $a_{2} = [2, 4]$, $b = [3, 6]$. Find all x with $[a_{1} a_{2}]x = b$.",
   "o": [
    "[[3-2t], [t]] for t ∈ ℝ",
    "[[3], [0]]",
    "[[0], [3]]",
    "[[t], [3-2t]] for t ∈ ℝ"
   ],
   "e": "The system reduces to $x_1 + 2x_2 = 3$, giving the general solution $x = [3-2t, t]$ for $t ∈ ℝ$.",
   "ru": {
    "t": "Пусть $a_{1} = [1, 2]$, $a_{2} = [2, 4]$, $b = [3, 6]$. Найдите все x, для которых $[a_{1} a_{2}]x = b$.",
    "o": [
     "[[3-2t], [t]], где t ∈ ℝ",
     "[[3], [0]]",
     "[[0], [3]]",
     "[[t], [3-2t]], где t ∈ ℝ"
    ],
    "e": "Система сводится к $x_1 + 2x_2 = 3$, откуда общее решение $x = [3-2t, t]$ при $t ∈ ℝ$."
   },
   "uz": {
    "t": "$a_{1} = [1, 2]$, $a_{2} = [2, 4]$, $b = [3, 6]$ boʻlsin. $[a_{1} a_{2}]x = b$ boʻladigan barcha x ni toping.",
    "o": [
     "[[3-2t], [t]], t ∈ ℝ boʻlganda",
     "[[3], [0]]",
     "[[0], [3]]",
     "[[t], [3-2t]], t ∈ ℝ boʻlganda"
    ],
    "e": "Sistema $x_1 + 2x_2 = 3$ ga kamayadi, umumiy yechim $x = [3-2t, t]$ koʻrinishida, $t ∈ ℝ$."
   }
  },
  {
   "t": "Without expanding coordinates, explain why $(u × v) · (u + v) = 0$.",
   "o": [
    "The cross product is orthogonal to both $u$ and $v$, so $(u × v) · u = 0$ and $(u × v) · v = 0$, making their sum 0.",
    "The cross product is commutative, so $(u × v) · (u + v) = (v × u) · (u + v) = -(u × v) · (u + v)$, which implies it equals 0.",
    "The cross product is distributive over addition, so $(u × v) · (u + v) = (u × v) · u + (u × v) · v = 0 + 0 = 0$.",
    "The cross product $u × v$ has magnitude $|u||v|\\sin(\\theta)$, which is 0 when $u$ and $v$ are parallel, making the dot product 0."
   ],
   "e": "The cross product $u × v$ is orthogonal to both $u$ and $v$, so $(u × v) · u = 0$ and $(u × v) · v = 0$. Adding these gives $(u × v) · (u + v) = 0$.",
   "ru": {
    "t": "Не раскрывая координаты, объясните, почему $(u × v) · (u + v) = 0$.",
    "o": [
     "Векторное произведение ортогонально обоим векторам $u$ и $v$, поэтому $(u × v) · u = 0$ и $(u × v) · v = 0$, а значит, их сумма равна 0.",
     "Векторное произведение коммутативно, поэтому $(u × v) · (u + v) = (v × u) · (u + v) = -(u × v) · (u + v)$, откуда следует, что оно равно 0.",
     "Векторное произведение дистрибутивно относительно сложения, поэтому $(u × v) · (u + v) = (u × v) · u + (u × v) · v = 0 + 0 = 0$.",
     "Векторное произведение $u × v$ имеет модуль $|u||v|\\sin(\\theta)$, который равен 0, когда $u$ и $v$ параллельны, что делает скалярное произведение равным 0."
    ],
    "e": "Векторное произведение $u × v$ ортогонально обоим векторам $u$ и $v$, поэтому $(u × v) · u = 0$ и $(u × v) · v = 0$. Складывая, получаем $(u × v) · (u + v) = 0$."
   },
   "uz": {
    "t": "Koordinatalarni yoyib ochmasdan, nima uchun $(u × v) · (u + v) = 0$ ekanini tushuntiring.",
    "o": [
     "Vektor koʻpaytma ham $u$, ham $v$ vektorlariga ortogonal, shuning uchun $(u × v) · u = 0$ va $(u × v) · v = 0$, demak ularning yigʻindisi 0 ga teng.",
     "Vektor koʻpaytma kommutativ, shuning uchun $(u × v) · (u + v) = (v × u) · (u + v) = -(u × v) · (u + v)$, bundan uning 0 ga tengligi kelib chiqadi.",
     "Vektor koʻpaytma qoʻshishga nisbatan distributiv, shuning uchun $(u × v) · (u + v) = (u × v) · u + (u × v) · v = 0 + 0 = 0$.",
     "$u × v$ vektor koʻpaytmaning moduli $|u||v|\\sin(\\theta)$ ga teng; $u$ va $v$ parallel boʻlganda u 0 ga teng boʻladi, bu esa skalyar koʻpaytmanni 0 qiladi."
    ],
    "e": "$u × v$ vektor koʻpaytma ham $u$, ham $v$ ga ortogonal, shuning uchun $(u × v) · u = 0$ va $(u × v) · v = 0$. Ularni qoʻshsak, $(u × v) · (u + v) = 0$ boʻladi."
   }
  },
  {
   "t": "A is a $2 \\times 2$ matrix with $A[1] = [-1, 2]$ and $A[2] = [-2, -1]$. Find $A^2$.",
   "o": [
    "[[-3, -4], [4, -3]]",
    "[[-3, 4], [-4, -3]]",
    "[[3, 4], [-4, 3]]",
    "[[-3, -4], [-4, -3]]"
   ],
   "e": "$A^2$ means $A \\cdot A$ with rows $[-1, 2]$ and $[-2, -1]$: entry $(1,1) = (-1)(-1)+2(-2) = -3$; $(1,2) = (-1)(2)+2(-1) = -4$; $(2,1) = (-2)(-1)+(-1)(-2) = 4$; $(2,2) = (-2)(2)+(-1)(-1) = -3$. So $A^2 = \\begin{pmatrix}-3 & -4 \\\\ 4 & -3\\end{pmatrix}$.",
   "ru": {
    "t": "A — матрица размера $2 \\times 2$, где $A[1] = [-1, 2]$ и $A[2] = [-2, -1]$. Найдите $A^2$.",
    "o": [
     "[[-3, -4], [4, -3]]",
     "[[-3, 4], [-4, -3]]",
     "[[3, 4], [-4, 3]]",
     "[[-3, -4], [-4, -3]]"
    ],
    "e": "$A^2$ означает $A \\cdot A$ со строками $[-1, 2]$ и $[-2, -1]$: элемент $(1,1) = (-1)(-1)+2(-2) = -3$; $(1,2) = (-1)(2)+2(-1) = -4$; $(2,1) = (-2)(-1)+(-1)(-2) = 4$; $(2,2) = (-2)(2)+(-1)(-1) = -3$. Итак, $A^2 = \\begin{pmatrix}-3 & -4 \\\\ 4 & -3\\end{pmatrix}$."
   },
   "uz": {
    "t": "A — $2 \\times 2$ oʻlchamli matritsa, bu yerda $A[1] = [-1, 2]$ va $A[2] = [-2, -1]$. $A^2$ ni toping.",
    "o": [
     "[[-3, -4], [4, -3]]",
     "[[-3, 4], [-4, -3]]",
     "[[3, 4], [-4, 3]]",
     "[[-3, -4], [-4, -3]]"
    ],
    "e": "$A^2$ — bu $[-1, 2]$ va $[-2, -1]$ qatorlarga ega $A \\cdot A$ koʻpaytmasi: elementlar $(1,1) = (-1)(-1)+2(-2) = -3$; $(1,2) = (-1)(2)+2(-1) = -4$; $(2,1) = (-2)(-1)+(-1)(-2) = 4$; $(2,2) = (-2)(2)+(-1)(-1) = -3$. Demak, $A^2 = \\begin{pmatrix}-3 & -4 \\\\ 4 & -3\\end{pmatrix}$."
   }
  },
  {
   "t": "Let A = $\\begin{pmatrix}3&0\\\\-1&4\\end{pmatrix}$, B = $\\begin{pmatrix}0&-5\\\\7&-4\\end{pmatrix}$. Compute 2A − B and identify its (2, 1) entry; can A be added to a 2 × 3 matrix?",
   "o": [
    "(2,1) entry is 7, addition is undefined",
    "(2,1) entry is 7, addition is defined",
    "(2,1) entry is 2, addition is defined",
    "(2,1) entry is -2, addition is undefined"
   ],
   "e": "2A - B = $\\begin{pmatrix}6&0\\\\7&0\\end{pmatrix}$ - $\\begin{pmatrix}0&-5\\\\7&-4\\end{pmatrix}$ = $\\begin{pmatrix}6&5\\\\0&4\\end{pmatrix}$, so the (2,1) entry is 0. Matrix addition requires matching dimensions, so A cannot be added to a 2×3 matrix.",
   "ru": {
    "t": "Пусть A = $\\begin{pmatrix}3&0\\\\-1&4\\end{pmatrix}$, B = $\\begin{pmatrix}0&-5\\\\7&-4\\end{pmatrix}$. Вычислите 2A − B и укажите его элемент (2, 1); можно ли прибавить A к матрице 2 × 3?",
    "o": [
     "элемент (2,1) равен 7, сложение не определено",
     "элемент (2,1) равен 7, сложение определено",
     "элемент (2,1) равен 2, сложение определено",
     "элемент (2,1) равен -2, сложение не определено"
    ],
    "e": "2A - B = $\\begin{pmatrix}6&0\\\\7&0\\end{pmatrix}$ - $\\begin{pmatrix}0&-5\\\\7&-4\\end{pmatrix}$ = $\\begin{pmatrix}6&5\\\\0&4\\end{pmatrix}$, поэтому элемент (2,1) равен 0. Сложение матриц требует совпадения размерностей, поэтому A нельзя прибавить к матрице 2×3."
   },
   "uz": {
    "t": "Berilgan A = $\\begin{pmatrix}3&0\\\\-1&4\\end{pmatrix}$, B = $\\begin{pmatrix}0&-5\\\\7&-4\\end{pmatrix}$. 2A − B ni hisoblang va uning (2, 1) elementini koʻrsating; A ni 2 × 3 matritsaga qoʻshish mumkinmi?",
    "o": [
     "(2,1) elementi 7 ga teng, qoʻshish aniqlanmagan",
     "(2,1) elementi 7 ga teng, qoʻshish aniqlangan",
     "(2,1) elementi 2 ga teng, qoʻshish aniqlangan",
     "(2,1) elementi -2 ga teng, qoʻshish aniqlanmagan"
    ],
    "e": "2A - B = $\\begin{pmatrix}6&0\\\\7&0\\end{pmatrix}$ - $\\begin{pmatrix}0&-5\\\\7&-4\\end{pmatrix}$ = $\\begin{pmatrix}6&5\\\\0&4\\end{pmatrix}$, demak (2,1) elementi 0 ga teng. Matritsalarni qoʻshish oʻlchamlar mosligini talab qiladi, shuning uchun A ni 2×3 matritsaga qoʻshib boʻlmaydi."
   }
  },
  {
   "t": "Let C = $\\begin{pmatrix}1&2&-1\\\\0&3&2\\end{pmatrix}$. Write C^T with its size; compute CC^T; is it symmetric?",
   "o": [
    "C^T is 3×2, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, yes it is symmetric",
    "C^T is 2×3, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, yes it is symmetric",
    "C^T is 3×2, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, no it is not symmetric",
    "C^T is 2×3, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, no it is not symmetric"
   ],
   "e": "C^T is 3×2, CC^T = $\\begin{pmatrix}1&0\\\\2&3\\\\-1&2\\end{pmatrix}$ × $\\begin{pmatrix}1&2&-1\\\\0&3&2\\end{pmatrix}$ = $\\begin{pmatrix}6&4\\\\4&13\\\\-1&1\\end{pmatrix}$ (corrected calculation). The original explanation had an error in CC^T calculation. The result is not symmetric.",
   "ru": {
    "t": "Пусть C = $\\begin{pmatrix}1&2&-1\\\\0&3&2\\end{pmatrix}$. Запишите C^T с указанием её размера; вычислите CC^T; симметрична ли она?",
    "o": [
     "C^T имеет размер 3×2, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, да, она симметрична",
     "C^T имеет размер 2×3, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, да, она симметрична",
     "C^T имеет размер 3×2, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, нет, она не симметрична",
     "C^T имеет размер 2×3, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, нет, она не симметрична"
    ],
    "e": "C^T имеет размер 3×2, CC^T = $\\begin{pmatrix}1&0\\\\2&3\\\\-1&2\\end{pmatrix}$ × $\\begin{pmatrix}1&2&-1\\\\0&3&2\\end{pmatrix}$ = $\\begin{pmatrix}6&4\\\\4&13\\\\-1&1\\end{pmatrix}$ (исправленное вычисление). В исходном объяснении была ошибка в вычислении CC^T. Результат не симметричен."
   },
   "uz": {
    "t": "Berilgan C = $\\begin{pmatrix}1&2&-1\\\\0&3&2\\end{pmatrix}$. C^T ni oʻlchami bilan yozing; CC^T ni hisoblang; u simmetrikmi?",
    "o": [
     "C^T 3×2 oʻlchamda, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, ha, u simmetrik",
     "C^T 2×3 oʻlchamda, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, ha, u simmetrik",
     "C^T 3×2 oʻlchamda, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, yoʻq, u simmetrik emas",
     "C^T 2×3 oʻlchamda, CC^T = $\\begin{pmatrix}6&4\\\\4&13\\end{pmatrix}$, yoʻq, u simmetrik emas"
    ],
    "e": "C^T 3×2 oʻlchamda, CC^T = $\\begin{pmatrix}1&0\\\\2&3\\\\-1&2\\end{pmatrix}$ × $\\begin{pmatrix}1&2&-1\\\\0&3&2\\end{pmatrix}$ = $\\begin{pmatrix}6&4\\\\4&13\\\\-1&1\\end{pmatrix}$ (tuzatilgan hisob). Boshlangʻich tushuntirishda CC^T hisobida xatolik boʻlgan. Natija simmetrik emas."
   }
  },
  {
   "t": "For matrix C = $\\begin{pmatrix}1 & 2 & -1 \\\\ 0 & 3 & 2 \\end{pmatrix}$ and vector x = [-1, 1, -1], compute Cx using both the row method and the column method.",
   "o": [
    "Row method: -1, -1; Column method: -1, -1",
    "Row method: 0, 0; Column method: 0, 0",
    "Row method: -1, -1; Column method: 0, 0",
    "Row method: 0, 0; Column method: -1, -1"
   ],
   "e": "Using the row method: first row gives $1·(-1) + 2·1 + (-1)·(-1) = -1$, second row gives $0·(-1) + 3·1 + 2·(-1) = -1$. Using the column method: $(-1)·[1,0] + 1·[2,3] + (-1)·[-1,2] = [-1,-1]$.",
   "ru": {
    "t": "Для матрицы C = $\\begin{pmatrix}1 & 2 & -1 \\\\ 0 & 3 & 2 \\end{pmatrix}$ и вектора x = [-1, 1, -1] вычислите Cx и строчным, и столбцовым методом.",
    "o": [
     "Строчный метод: -1, -1; столбцовый метод: -1, -1",
     "Строчный метод: 0, 0; столбцовый метод: 0, 0",
     "Строчный метод: -1, -1; столбцовый метод: 0, 0",
     "Строчный метод: 0, 0; столбцовый метод: -1, -1"
    ],
    "e": "Строчным методом: первая строка даёт $1·(-1) + 2·1 + (-1)·(-1) = -1$, вторая строка даёт $0·(-1) + 3·1 + 2·(-1) = -1$. Столбцовым методом: $(-1)·[1,0] + 1·[2,3] + (-1)·[-1,2] = [-1,-1]$."
   },
   "uz": {
    "t": "C = $\\begin{pmatrix}1 & 2 & -1 \\\\ 0 & 3 & 2 \\end{pmatrix}$ matritsa va x = [-1, 1, -1] vektor uchun Cx ni ham qator usuli, ham ustun usuli bilan hisoblang.",
    "o": [
     "Qator usuli: -1, -1; ustun usuli: -1, -1",
     "Qator usuli: 0, 0; ustun usuli: 0, 0",
     "Qator usuli: -1, -1; ustun usuli: 0, 0",
     "Qator usuli: 0, 0; ustun usuli: -1, -1"
    ],
    "e": "Qator usuli bilan: birinchi qator $1·(-1) + 2·1 + (-1)·(-1) = -1$ ni beradi, ikkinchi qator $0·(-1) + 3·1 + 2·(-1) = -1$ ni beradi. Ustun usuli bilan: $(-1)·[1,0] + 1·[2,3] + (-1)·[-1,2] = [-1,-1]$."
   }
  },
  {
   "t": "With matrices A = $\\begin{pmatrix}1 & -2 \\\\ 3 & 0 \\end{pmatrix}$ and B = $\\begin{pmatrix}2 & 1 \\\\ -1 & 4 \\end{pmatrix}$, compute AB and BA. Are they equal?",
   "o": [
    "AB = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, BA = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, Not equal",
    "AB = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, BA = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, Equal",
    "AB = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, BA = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, Equal",
    "AB = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, BA = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, Not equal"
   ],
   "e": "AB = $\\begin{pmatrix}1·2 + (-2)(-1) & 1·1 + (-2)·4 \\\\ 3·2 + 0·(-1) & 3·1 + 0·4 \\end{pmatrix}$ = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$. BA = $\\begin{pmatrix}2·1 + 1·3 & 2·(-2) + 1·0 \\\\ -1·1 + 4·3 & -1·(-2) + 4·0 \\end{pmatrix}$ = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$. The products are different.",
   "ru": {
    "t": "Для матриц A = $\\begin{pmatrix}1 & -2 \\\\ 3 & 0 \\end{pmatrix}$ и B = $\\begin{pmatrix}2 & 1 \\\\ -1 & 4 \\end{pmatrix}$ вычислите AB и BA. Равны ли они?",
    "o": [
     "AB = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, BA = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, не равны",
     "AB = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, BA = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, равны",
     "AB = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, BA = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, равны",
     "AB = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, BA = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, не равны"
    ],
    "e": "AB = $\\begin{pmatrix}1·2 + (-2)(-1) & 1·1 + (-2)·4 \\\\ 3·2 + 0·(-1) & 3·1 + 0·4 \\end{pmatrix}$ = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$. BA = $\\begin{pmatrix}2·1 + 1·3 & 2·(-2) + 1·0 \\\\ -1·1 + 4·3 & -1·(-2) + 4·0 \\end{pmatrix}$ = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$. Произведения различны."
   },
   "uz": {
    "t": "A = $\\begin{pmatrix}1 & -2 \\\\ 3 & 0 \\end{pmatrix}$ va B = $\\begin{pmatrix}2 & 1 \\\\ -1 & 4 \\end{pmatrix}$ matritsalar uchun AB va BA ni hisoblang. Ular tengmi?",
    "o": [
     "AB = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, BA = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, teng emas",
     "AB = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, BA = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, teng",
     "AB = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, BA = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, teng",
     "AB = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$, BA = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$, teng emas"
    ],
    "e": "AB = $\\begin{pmatrix}1·2 + (-2)(-1) & 1·1 + (-2)·4 \\\\ 3·2 + 0·(-1) & 3·1 + 0·4 \\end{pmatrix}$ = $\\begin{pmatrix}4 & -7 \\\\ 6 & 3 \\end{pmatrix}$. BA = $\\begin{pmatrix}2·1 + 1·3 & 2·(-2) + 1·0 \\\\ -1·1 + 4·3 & -1·(-2) + 4·0 \\end{pmatrix}$ = $\\begin{pmatrix}5 & -4 \\\\ 11 & 2 \\end{pmatrix}$. Koʻpaytmalar har xil."
   }
  },
  {
   "t": "Let C = $\\begin{pmatrix}1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ and D = $\\begin{pmatrix}2 & 0 & 1 \\\\ 1 & -1 & 2 \\\\ 3 & 2 & 3 \\end{pmatrix}$. Predict the sizes of CD and DC, then compute both products.",
   "o": [
    "CD: 2×3, $\\begin{pmatrix}1 & -4 & 5 \\\\ 9 & 1 & 11 \\end{pmatrix}$; DC: 3×2, $\\begin{pmatrix}2 & 4 \\\\ 1 & -1 \\\\ 3 & 12 \\end{pmatrix}$",
    "CD: 2×2, $\\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$; DC: 3×3, $\\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$",
    "CD: 3×3, $\\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$; DC: 2×2, $\\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$",
    "CD: 3×2, $\\begin{pmatrix}2 & 4 \\\\ 1 & -1 \\\\ 3 & 12 \\end{pmatrix}$; DC: 2×3, $\\begin{pmatrix}1 & -4 & 5 \\\\ 9 & 1 & 11 \\end{pmatrix}$"
   ],
   "e": "CD has size $(2×3)(3×2) = 2×2$ and equals $\\begin{pmatrix}1·2+2·1+0·3 & 1·0+2·(-1)+0·2 \\\\ 0·2+3·1+2·3 & 0·0+3·(-1)+2·2 \\end{pmatrix} = \\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$. DC has size $(3×2)(2×3) = 3×3$ and equals $\\begin{pmatrix}2·1+0·0 & 2·2+0·3 & 2·1+0·2 \\\\ 1·1+(-1)·0 & 1·2+(-1)·3 & 1·1+(-1)·2 \\\\ 3·1+2·0 & 3·2+2·3 & 3·1+2·2 \\end{pmatrix} = \\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$.",
   "ru": {
    "t": "Пусть C = $\\begin{pmatrix}1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ и D = $\\begin{pmatrix}2 & 0 & 1 \\\\ 1 & -1 & 2 \\\\ 3 & 2 & 3 \\end{pmatrix}$. Предскажите размеры CD и DC, затем вычислите оба произведения.",
    "o": [
     "CD: 2×3, $\\begin{pmatrix}1 & -4 & 5 \\\\ 9 & 1 & 11 \\end{pmatrix}$; DC: 3×2, $\\begin{pmatrix}2 & 4 \\\\ 1 & -1 \\\\ 3 & 12 \\end{pmatrix}$",
     "CD: 2×2, $\\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$; DC: 3×3, $\\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$",
     "CD: 3×3, $\\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$; DC: 2×2, $\\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$",
     "CD: 3×2, $\\begin{pmatrix}2 & 4 \\\\ 1 & -1 \\\\ 3 & 12 \\end{pmatrix}$; DC: 2×3, $\\begin{pmatrix}1 & -4 & 5 \\\\ 9 & 1 & 11 \\end{pmatrix}$"
    ],
    "e": "CD имеет размер $(2×3)(3×2) = 2×2$ и равна $\\begin{pmatrix}1·2+2·1+0·3 & 1·0+2·(-1)+0·2 \\\\ 0·2+3·1+2·3 & 0·0+3·(-1)+2·2 \\end{pmatrix} = \\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$. DC имеет размер $(3×2)(2×3) = 3×3$ и равна $\\begin{pmatrix}2·1+0·0 & 2·2+0·3 & 2·1+0·2 \\\\ 1·1+(-1)·0 & 1·2+(-1)·3 & 1·1+(-1)·2 \\\\ 3·1+2·0 & 3·2+2·3 & 3·1+2·2 \\end{pmatrix} = \\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$."
   },
   "uz": {
    "t": "C = $\\begin{pmatrix}1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ va D = $\\begin{pmatrix}2 & 0 & 1 \\\\ 1 & -1 & 2 \\\\ 3 & 2 & 3 \\end{pmatrix}$ boʻlsin. CD va DC oʻlchamlarini oldindan ayting, soʻngra ikkala koʻpaytmani hisoblang.",
    "o": [
     "CD: 2×3, $\\begin{pmatrix}1 & -4 & 5 \\\\ 9 & 1 & 11 \\end{pmatrix}$; DC: 3×2, $\\begin{pmatrix}2 & 4 \\\\ 1 & -1 \\\\ 3 & 12 \\end{pmatrix}$",
     "CD: 2×2, $\\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$; DC: 3×3, $\\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$",
     "CD: 3×3, $\\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$; DC: 2×2, $\\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$",
     "CD: 3×2, $\\begin{pmatrix}2 & 4 \\\\ 1 & -1 \\\\ 3 & 12 \\end{pmatrix}$; DC: 2×3, $\\begin{pmatrix}1 & -4 & 5 \\\\ 9 & 1 & 11 \\end{pmatrix}$"
    ],
    "e": "CD matritsaning oʻchami $(2×3)(3×2) = 2×2$ va u $\\begin{pmatrix}1·2+2·1+0·3 & 1·0+2·(-1)+0·2 \\\\ 0·2+3·1+2·3 & 0·0+3·(-1)+2·2 \\end{pmatrix} = \\begin{pmatrix}1 & -4 \\\\ 9 & 1 \\end{pmatrix}$ ga teng. DC oʻchami $(3×2)(2×3) = 3×3$ va u $\\begin{pmatrix}2·1+0·0 & 2·2+0·3 & 2·1+0·2 \\\\ 1·1+(-1)·0 & 1·2+(-1)·3 & 1·1+(-1)·2 \\\\ 3·1+2·0 & 3·2+2·3 & 3·1+2·2 \\end{pmatrix} = \\begin{pmatrix}2 & 4 & 2 \\\\ 1 & -1 & -3 \\\\ 3 & 12 & 1 \\end{pmatrix}$ ga teng."
   }
  },
  {
   "t": "Let S = $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ (shear transformation), H = $\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$ (stretch transformation), and x = $\\begin{pmatrix}1\\\\0\\end{pmatrix}$. Compute HSx and SHx, and describe each transformation.",
   "o": [
    "HSx = [2, 0], SHx = [2, 1]; HS shears then stretches, SH stretches then shears",
    "HSx = [2, 0], SHx = [2, 0]; Both transformations result in the same vector",
    "HSx = [2, 1], SHx = [2, 0]; HS stretches then shears, SH shears then stretches",
    "HSx = [1, 1], SHx = [1, 0]; HS is a shear, SH is a stretch"
   ],
   "e": "Sx = $\\begin{pmatrix}1·1+1·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}1\\\\0\\end{pmatrix}$, then HSx = $\\begin{pmatrix}2·1+0·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\0\\end{pmatrix}$. Hx = $\\begin{pmatrix}2·1+0·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, then SHx = $\\begin{pmatrix}1·2+1·0\\\\0·2+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\1\\end{pmatrix}$. In HS, the shear is applied first and then the result is stretched; in SH, the stretch happens first and then the shear is applied.",
   "ru": {
    "t": "Пусть S = $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ (преобразование сдвига), H = $\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$ (преобразование растяжения) и x = $\\begin{pmatrix}1\\\\0\\end{pmatrix}$. Вычислите HSx и SHx и опишите каждое преобразование.",
    "o": [
     "HSx = [2, 0], SHx = [2, 1]; HS сначала сдвигает, затем растягивает, SH сначала растягивает, затем сдвигает",
     "HSx = [2, 0], SHx = [2, 0]; оба преобразования приводят к одному и тому же вектору",
     "HSx = [2, 1], SHx = [2, 0]; HS сначала растягивает, затем сдвигает, SH сначала сдвигает, затем растягивает",
     "HSx = [1, 1], SHx = [1, 0]; HS — сдвиг, SH — растяжение"
    ],
    "e": "Sx = $\\begin{pmatrix}1·1+1·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}1\\\\0\\end{pmatrix}$, затем HSx = $\\begin{pmatrix}2·1+0·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\0\\end{pmatrix}$. Hx = $\\begin{pmatrix}2·1+0·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, затем SHx = $\\begin{pmatrix}1·2+1·0\\\\0·2+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\1\\end{pmatrix}$. В HS сначала применяется сдвиг, а затем результат растягивается; в SH сначала происходит растяжение, а затем применяется сдвиг."
   },
   "uz": {
    "t": "S = $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ (surish transformatsiyasi), H = $\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$ (choʻzish transformatsiyasi) va x = $\\begin{pmatrix}1\\\\0\\end{pmatrix}$ boʻlsin. HSx va SHx ni hisoblang va har bir transformatsiyani tasvirlang.",
    "o": [
     "HSx = [2, 0], SHx = [2, 1]; HS avval suradi, keyin choʻzadi, SH avval choʻzadi, keyin suradi",
     "HSx = [2, 0], SHx = [2, 0]; ikkala transformatsiya ham bir xil vektorni beradi",
     "HSx = [2, 1], SHx = [2, 0]; HS avval choʻzadi, keyin suradi, SH avval suradi, keyin choʻzadi",
     "HSx = [1, 1], SHx = [1, 0]; HS — surish, SH — choʻzish"
    ],
    "e": "Sx = $\\begin{pmatrix}1·1+1·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}1\\\\0\\end{pmatrix}$, soʻngra HSx = $\\begin{pmatrix}2·1+0·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\0\\end{pmatrix}$. Hx = $\\begin{pmatrix}2·1+0·0\\\\0·1+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, soʻngra SHx = $\\begin{pmatrix}1·2+1·0\\\\0·2+1·0\\end{pmatrix}$ = $\\begin{pmatrix}2\\\\1\\end{pmatrix}$. HS da avval surish qoʻllanadi, soʻngra natija choʻziladi; SH da avval choʻzish bajariladi, soʻngra surish qoʻllanadi."
   }
  },
  {
   "t": "For u = $\\begin{pmatrix}2\\\\0\\\\-3\\end{pmatrix}$ and v = $\\begin{pmatrix}2\\\\-1\\\\3\\end{pmatrix}$: compute u^T v and uv^T; verify (uv^T)^T = vu^T.",
   "o": [
    "u^T v = -1 (scalar), uv^T = $\\begin{pmatrix}4&0&-6\\\\-2&0&3\\\\6&0&-9\\end{pmatrix}$, (uv^T)^T = vu^T",
    "u^T v = -1 (scalar), uv^T = $\\begin{pmatrix}4&0&-6\\\\-2&0&3\\\\6&0&-9\\end{pmatrix}$, (uv^T)^T ≠ vu^T",
    "u^T v = 1 (scalar), uv^T = $\\begin{pmatrix}4&-2&6\\\\0&0&0\\\\-6&3&-9\\end{pmatrix}$, (uv^T)^T = vu^T",
    "u^T v = -1 (scalar), uv^T = $\\begin{pmatrix}4&-2&6\\\\0&0&0\\\\-6&3&-9\\end{pmatrix}$, (uv^T)^T = vu^T"
   ],
   "e": "The inner product $u^{T} v = 2\\cdot 2 + 0\\cdot (-1) + (-3)\\cdot 3 = -1$. The outer product uv^T is $a 3\\times 3$ matrix, and its transpose equals vu^T, confirming the matrix transpose property.",
   "ru": {
    "t": "Для u = $\\begin{pmatrix}2\\\\0\\\\-3\\end{pmatrix}$ и v = $\\begin{pmatrix}2\\\\-1\\\\3\\end{pmatrix}$: вычислите u^T v и uv^T; проверьте, что (uv^T)^T = vu^T.",
    "o": [
     "u^T v = -1 (скаляр), uv^T = $\\begin{pmatrix}4&0&-6\\\\-2&0&3\\\\6&0&-9\\end{pmatrix}$, (uv^T)^T = vu^T",
     "u^T v = -1 (скаляр), uv^T = $\\begin{pmatrix}4&0&-6\\\\-2&0&3\\\\6&0&-9\\end{pmatrix}$, (uv^T)^T ≠ vu^T",
     "u^T v = 1 (скаляр), uv^T = $\\begin{pmatrix}4&-2&6\\\\0&0&0\\\\-6&3&-9\\end{pmatrix}$, (uv^T)^T = vu^T",
     "u^T v = -1 (скаляр), uv^T = $\\begin{pmatrix}4&-2&6\\\\0&0&0\\\\-6&3&-9\\end{pmatrix}$, (uv^T)^T = vu^T"
    ],
    "e": "Внутреннее произведение $u^{T} v = 2\\cdot 2 + 0\\cdot (-1) + (-3)\\cdot 3 = -1$. Внешнее произведение uv^T — матрица размера $a 3\\times 3$, и её транспонирование равно vu^T, что подтверждает свойство транспонирования матриц."
   },
   "uz": {
    "t": "u = $\\begin{pmatrix}2\\\\0\\\\-3\\end{pmatrix}$ va v = $\\begin{pmatrix}2\\\\-1\\\\3\\end{pmatrix}$ uchun: u^T v va uv^T ni hisoblang; (uv^T)^T = vu^T ekanini tekshiring.",
    "o": [
     "u^T v = -1 (skalyar), uv^T = $\\begin{pmatrix}4&0&-6\\\\-2&0&3\\\\6&0&-9\\end{pmatrix}$, (uv^T)^T = vu^T",
     "u^T v = -1 (skalyar), uv^T = $\\begin{pmatrix}4&0&-6\\\\-2&0&3\\\\6&0&-9\\end{pmatrix}$, (uv^T)^T ≠ vu^T",
     "u^T v = 1 (skalyar), uv^T = $\\begin{pmatrix}4&-2&6\\\\0&0&0\\\\-6&3&-9\\end{pmatrix}$, (uv^T)^T = vu^T",
     "u^T v = -1 (skalyar), uv^T = $\\begin{pmatrix}4&-2&6\\\\0&0&0\\\\-6&3&-9\\end{pmatrix}$, (uv^T)^T = vu^T"
    ],
    "e": "Ichki koʻpaytma $u^{T} v = 2\\cdot 2 + 0\\cdot (-1) + (-3)\\cdot 3 = -1$. Tashqi koʻpaytma uv^T — $a 3\\times 3$ oʻlchamli matritsa boʻlib, uning transpozasi vu^T ga teng; bu matritsa transpozasi xossasini tasdiqlaydi."
   }
  },
  {
   "t": "Using A = $\\begin{pmatrix}1&3\\\\-2&0\\end{pmatrix}$ and B = $\\begin{pmatrix}2&-1\\\\1&4\\end{pmatrix}$ from Problem 1, compute $(AB)^T$ and $B^T A^T$ independently; does $A^T B^T$ agree?",
   "o": [
    "$(AB)^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ disagrees",
    "$(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $A^T B^T$ agrees",
    "$(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ disagrees",
    "$(AB)^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $A^T B^T$ agrees"
   ],
   "e": "First, $AB = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, so $(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$. Computing transposes separately, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, which matches $(AB)^T$. However, $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ does not agree, showing the order matters in matrix multiplication.",
   "ru": {
    "t": "Используя A = $\\begin{pmatrix}1&3\\\\-2&0\\end{pmatrix}$ и B = $\\begin{pmatrix}2&-1\\\\1&4\\end{pmatrix}$ из задачи 1, вычислите $(AB)^T$ и $B^T A^T$ независимо; совпадает ли $A^T B^T$?",
    "o": [
     "$(AB)^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ не совпадает",
     "$(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $A^T B^T$ совпадает",
     "$(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ не совпадает",
     "$(AB)^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $A^T B^T$ совпадает"
    ],
    "e": "Сначала $AB = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, поэтому $(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$. Вычисляя транспонированные матрицы отдельно, получаем $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, что совпадает с $(AB)^T$. Однако $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ не совпадает, что показывает: порядок при умножении матриц важен."
   },
   "uz": {
    "t": "1-masaladan olingan A = $\\begin{pmatrix}1&3\\\\-2&0\\end{pmatrix}$ va B = $\\begin{pmatrix}2&-1\\\\1&4\\end{pmatrix}$ dan foydalanib, $(AB)^T$ va $B^T A^T$ ni mustaqil ravishda hisoblang; $A^T B^T$ mos keladimi?",
    "o": [
     "$(AB)^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ mos kelmaydi",
     "$(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $A^T B^T$ mos keladi",
     "$(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$, $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ mos kelmaydi",
     "$(AB)^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $B^T A^T = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, $A^T B^T$ mos keladi"
    ],
    "e": "Avval $AB = \\begin{pmatrix}4&-7\\\\6&3\\end{pmatrix}$, shuning uchun $(AB)^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$. Transpozalarni alohida hisoblasak, $B^T A^T = \\begin{pmatrix}4&6\\\\-7&3\\end{pmatrix}$ boʻlib, bu $(AB)^T$ ga mos keladi. Biroq $A^T B^T = \\begin{pmatrix}-1&3\\\\-2&-6\\end{pmatrix}$ mos kelmaydi, bu esa matritsalarni koʻpaytirishda tartib muhimligini koʻrsatadi."
   }
  },
  {
   "t": "Let $E = \\begin{pmatrix}3&1\\\\1&2\\end{pmatrix}$. Compute det $E$; find the parallelogram and triangle areas of its columns; is orientation preserved?",
   "o": [
    "det $E = 5$, parallelogram area = 5, triangle area = 2.5, orientation preserved",
    "det $E = 5$, parallelogram area = 5, triangle area = 2.5, orientation not preserved",
    "det $E = 5$, parallelogram area = 5, triangle area = 5, orientation preserved",
    "det $E = -5$, parallelogram area = 5, triangle area = 2.5, orientation not preserved"
   ],
   "e": "The determinant det $E = 3·2 - 1·1 = 5$. The parallelogram area is |det $E$| = 5, and the triangle area is half of that, 2.5. Since det $E > 0$, orientation is preserved.",
   "ru": {
    "t": "Пусть $E = \\begin{pmatrix}3&1\\\\1&2\\end{pmatrix}$. Вычислите det $E$; найдите площади параллелограмма и треугольника, построенных на её столбцах; сохраняется ли ориентация?",
    "o": [
     "det $E = 5$, площадь параллелограмма = 5, площадь треугольника = 2.5, ориентация сохраняется",
     "det $E = 5$, площадь параллелограмма = 5, площадь треугольника = 2.5, ориентация не сохраняется",
     "det $E = 5$, площадь параллелограмма = 5, площадь треугольника = 5, ориентация сохраняется",
     "det $E = -5$, площадь параллелограмма = 5, площадь треугольника = 2.5, ориентация не сохраняется"
    ],
    "e": "Определитель det $E = 3·2 - 1·1 = 5$. Площадь параллелограмма равна |det $E$| = 5, а площадь треугольника — половина этого, 2.5. Поскольку det $E > 0$, ориентация сохраняется."
   },
   "uz": {
    "t": "$E = \\begin{pmatrix}3&1\\\\1&2\\end{pmatrix}$ boʻlsin. det $E$ ni hisoblang; uning ustunlaridagi parallelogram va uchburchak yuzalarini toping; orientatsiya saqlanadimi?",
    "o": [
     "det $E = 5$, parallelogram yuzasi = 5, uchburchak yuzasi = 2.5, orientatsiya saqlanadi",
     "det $E = 5$, parallelogram yuzasi = 5, uchburchak yuzasi = 2.5, orientatsiya saqlanmaydi",
     "det $E = 5$, parallelogram yuzasi = 5, uchburchak yuzasi = 5, orientatsiya saqlanadi",
     "det $E = -5$, parallelogram yuzasi = 5, uchburchak yuzasi = 2.5, orientatsiya saqlanmaydi"
    ],
    "e": "det $E = 3·2 - 1·1 = 5$ determinanti. Parallelogram yuzasi |det $E$| = 5 ga, uchburchak yuzasi esa uning yarmiga, 2.5 ga teng. det $E > 0$ boʻlgani uchun orientatsiya saqlanadi."
   }
  },
  {
   "t": "Compute $\\det F$ for $F = \\begin{pmatrix}2&1&0\\\\0&3&1\\\\1&0&2\\end{pmatrix}$ by first-row cofactors; check along the first column.",
   "o": [
    "$\\det F = 13$ using first row, $\\det F = 13$ using first column",
    "$\\det F = 13$ using first row, $\\det F = 12$ using first column",
    "$\\det F = 13$ using first row, $\\det F = 11$ using first column",
    "$\\det F = 11$ using first row, $\\det F = 13$ using first column"
   ],
   "e": "Using first-row cofactors: $\\det F = 2\\cdot\\det\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix} - 1\\cdot\\det\\begin{pmatrix}0&1\\\\1&2\\end{pmatrix} + 0 = 2\\cdot6 - 1\\cdot(-1) = 13$. Using first column: $2\\cdot\\det\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix} + 1\\cdot\\det\\begin{pmatrix}1&0\\\\3&1\\end{pmatrix} = 2\\cdot6 + 1\\cdot1 = 13$, confirming the determinant is 13.",
   "ru": {
    "t": "Вычислите $\\det F$ для $F = \\begin{pmatrix}2&1&0\\\\0&3&1\\\\1&0&2\\end{pmatrix}$ через алгебраические дополнения первой строки; выполните проверку по первому столбцу.",
    "o": [
     "$\\det F = 13$ по первой строке, $\\det F = 13$ по первому столбцу",
     "$\\det F = 13$ по первой строке, $\\det F = 12$ по первому столбцу",
     "$\\det F = 13$ по первой строке, $\\det F = 11$ по первому столбцу",
     "$\\det F = 11$ по первой строке, $\\det F = 13$ по первому столбцу"
    ],
    "e": "Через алгебраические дополнения первой строки: $\\det F = 2\\cdot\\det\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix} - 1\\cdot\\det\\begin{pmatrix}0&1\\\\1&2\\end{pmatrix} + 0 = 2\\cdot6 - 1\\cdot(-1) = 13$. По первому столбцу: $2\\cdot\\det\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix} + 1\\cdot\\det\\begin{pmatrix}1&0\\\\3&1\\end{pmatrix} = 2\\cdot6 + 1\\cdot1 = 13$, что подтверждает: определитель равен 13."
   },
   "uz": {
    "t": "$F = \\begin{pmatrix}2&1&0\\\\0&3&1\\\\1&0&2\\end{pmatrix}$ uchun $\\det F$ ni birinchi qator kofaktorlari orqali hisoblang; birinchi ustun boʻyicha tekshirib koʻring.",
    "o": [
     "$\\det F = 13$ birinchi qator boʻyicha, $\\det F = 13$ birinchi ustun boʻyicha",
     "$\\det F = 13$ birinchi qator boʻyicha, $\\det F = 12$ birinchi ustun boʻyicha",
     "$\\det F = 13$ birinchi qator boʻyicha, $\\det F = 11$ birinchi ustun boʻyicha",
     "$\\det F = 11$ birinchi qator boʻyicha, $\\det F = 13$ birinchi ustun boʻyicha"
    ],
    "e": "Birinchi qator kofaktorlari orqali: $\\det F = 2\\cdot\\det\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix} - 1\\cdot\\det\\begin{pmatrix}0&1\\\\1&2\\end{pmatrix} + 0 = 2\\cdot6 - 1\\cdot(-1) = 13$. Birinchi ustun boʻyicha: $2\\cdot\\det\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix} + 1\\cdot\\det\\begin{pmatrix}1&0\\\\3&1\\end{pmatrix} = 2\\cdot6 + 1\\cdot1 = 13$, bu determinantning 13 ga tengligini tasdiqlaydi."
   }
  },
  {
   "t": "A $3 \\times 3$ matrix $M$ has $\\det M = 5$. Form $N$ by swapping rows 1 and 2, multiplying row 3 by 2, and adding 3 times the new row 1 to row 2. Find $\\det N$, $\\det(2M)$, and $\\det(M^{T} M)$.",
   "o": [
    "$\\det N = -10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 25$",
    "$\\det N = 10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 25$",
    "$\\det N = -10$, $\\det(2M) = 8$, $\\det(M^{T} M) = 25$",
    "$\\det N = -10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 10$"
   ],
   "e": "Swapping rows changes the sign of the determinant, scaling a row multiplies the determinant by that scalar, and adding a multiple of one row to another doesn’t change it. Scaling the entire matrix by 2 multiplies the determinant by $2^{3}$. The determinant of a product is the product of determinants, and $\\det(M^{T}) = \\det(M)$.",
   "ru": {
    "t": "Матрица $M$ размера $3 \\times 3$ имеет $\\det M = 5$. Постройте $N$, поменяв местами строки 1 и 2, умножив строку 3 на 2 и прибавив 3 раза новую строку 1 к строке 2. Найдите $\\det N$, $\\det(2M)$ и $\\det(M^{T} M)$.",
    "o": [
     "$\\det N = -10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 25$",
     "$\\det N = 10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 25$",
     "$\\det N = -10$, $\\det(2M) = 8$, $\\det(M^{T} M) = 25$",
     "$\\det N = -10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 10$"
    ],
    "e": "Перестановка строк меняет знак определителя, умножение строки на число умножает определитель на это число, а прибавление кратной строки к другой не меняет его. Умножение всей матрицы на 2 умножает определитель на $2^{3}$. Определитель произведения равен произведению определителей, и $\\det(M^{T}) = \\det(M)$."
   },
   "uz": {
    "t": "$3 \\times 3$ oʻlchamli $M$ matritsada $\\det M = 5$. 1 va 2 qatorlarni almashtirib, 3-qatorni 2 ga koʻpaytirib va yangi 1-qatorni 3 marta 2-qatorga qoʻshib $N$ hosil qiling. $\\det N$, $\\det(2M)$ va $\\det(M^{T} M)$ ni toping.",
    "o": [
     "$\\det N = -10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 25$",
     "$\\det N = 10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 25$",
     "$\\det N = -10$, $\\det(2M) = 8$, $\\det(M^{T} M) = 25$",
     "$\\det N = -10$, $\\det(2M) = 40$, $\\det(M^{T} M) = 10$"
    ],
    "e": "Qatorlarni almashtirish determinant belgisini oʻzgartiradi, qatorni songa koʻpaytirish determinantni shu songa koʻpaytiradi, bir qatorning koʻpaytmasini boshqasiga qoʻshish esa uni oʻzgartirmaydi. Butun matritsani 2 ga koʻpaytirish determinantni $2^{3}$ ga koʻpaytiradi. Koʻpaytma determinanti determinantlar koʻpaytmasiga teng va $\\det(M^{T}) = \\det(M)$."
   }
  },
  {
   "t": "Let $u = \\begin{bmatrix}0\\\\0\\\\1\\end{bmatrix}^{T}$, $v = \\begin{bmatrix}0\\\\2\\\\0\\end{bmatrix}^{T}$, $w = \\begin{bmatrix}2\\\\1\\\\2\\end{bmatrix}^{T}$. Compute $(u \\times v) \\cdot w$, the parallelepiped volume, and the tetrahedron volume. What happens to these quantities if $u$ and $v$ are exchanged?",
   "o": [
    "$(u \\times v) \\cdot w = 13$, parallelepiped = 13, tetrahedron = $\\frac{13}{6}$; exchanging u,v changes sign but volumes stay the same",
    "$(u \\times v) \\cdot w = 11$, parallelepiped = 11, tetrahedron = $\\frac{11}{6}$; exchanging u,v changes sign but volumes stay the same",
    "$(u \\times v) \\cdot w = 13$, parallelepiped = 13, tetrahedron = $\\frac{13}{6}$; exchanging u,v changes both sign and volumes",
    "$(u \\times v) \\cdot w = 13$, parallelepiped = 13, tetrahedron = $\\frac{13}{6}$; exchanging u,v doesn't change anything"
   ],
   "e": "The cross product $u \\times v$ is $\\begin{bmatrix}-2\\\\1\\\\0\\end{bmatrix}^{T}$, and its dot product with $w$ is 13. This value represents the parallelepiped volume. The tetrahedron volume is $\\frac{1}{6}$ of this. Exchanging $u$ and $v$ changes the sign of the cross product, but volumes are absolute values.",
   "ru": {
    "t": "Пусть $u = \\begin{bmatrix}0\\\\0\\\\1\\end{bmatrix}^{T}$, $v = \\begin{bmatrix}0\\\\2\\\\0\\end{bmatrix}^{T}$, $w = \\begin{bmatrix}2\\\\1\\\\2\\end{bmatrix}^{T}$. Вычислите $(u \\times v) \\cdot w$, объём параллелепипеда и объём тетраэдра. Что произойдёт с этими величинами, если поменять местами $u$ и $v$?",
    "o": [
     "$(u \\times v) \\cdot w = 13$, параллелепипед = 13, тетраэдр = $\\frac{13}{6}$; перестановка u,v меняет знак, но объёмы остаются прежними",
     "$(u \\times v) \\cdot w = 11$, параллелепипед = 11, тетраэдр = $\\frac{11}{6}$; перестановка u,v меняет знак, но объёмы остаются прежними",
     "$(u \\times v) \\cdot w = 13$, параллелепипед = 13, тетраэдр = $\\frac{13}{6}$; перестановка u,v меняет и знак, и объёмы",
     "$(u \\times v) \\cdot w = 13$, параллелепипед = 13, тетраэдр = $\\frac{13}{6}$; перестановка u,v ничего не меняет"
    ],
    "e": "Векторное произведение $u \\times v$ равно $\\begin{bmatrix}-2\\\\1\\\\0\\end{bmatrix}^{T}$, а его скалярное произведение с $w$ равно 13. Это значение представляет объём параллелепипеда. Объём тетраэдра равен $\\frac{1}{6}$ этого значения. Перестановка $u$ и $v$ меняет знак векторного произведения, но объёмы — абсолютные величины."
   },
   "uz": {
    "t": "$u = \\begin{bmatrix}0\\\\0\\\\1\\end{bmatrix}^{T}$, $v = \\begin{bmatrix}0\\\\2\\\\0\\end{bmatrix}^{T}$, $w = \\begin{bmatrix}2\\\\1\\\\2\\end{bmatrix}^{T}$ boʻlsin. $(u \\times v) \\cdot w$ ni, parallelepiped hajmini va tetraedr hajmini hisoblang. $u$ va $v$ almashtirilsa, bu kattaliklar qanday boʻladi?",
    "o": [
     "$(u \\times v) \\cdot w = 13$, parallelepiped = 13, tetraedr = $\\frac{13}{6}$; u,v ni almashtirish belgini oʻzgartiradi, lekin hajmlar oʻzgarmaydi",
     "$(u \\times v) \\cdot w = 11$, parallelepiped = 11, tetraedr = $\\frac{11}{6}$; u,v ni almashtirish belgini oʻzgartiradi, lekin hajmlar oʻzgarmaydi",
     "$(u \\times v) \\cdot w = 13$, parallelepiped = 13, tetraedr = $\\frac{13}{6}$; u,v ni almashtirish ham belgini, ham hajmlarni oʻzgartiradi",
     "$(u \\times v) \\cdot w = 13$, parallelepiped = 13, tetraedr = $\\frac{13}{6}$; u,v ni almashtirish hech narsani oʻzgartirmaydi"
    ],
    "e": "$u \\times v$ vektor koʻpaytma $\\begin{bmatrix}-2\\\\1\\\\0\\end{bmatrix}^{T}$ ga teng, uning $w$ bilan skalyar koʻpaytmasi 13 ga teng. Bu qiymat parallelepiped hajmini bildiradi. Tetraedr hajmi bundan $\\frac{1}{6}$ ga teng. $u$ va $v$ ni almashtirish vektor koʻpaytma belgisini oʻzgartiradi, lekin hajmlar modul qiymatlar hisoblanadi."
   }
  },
  {
   "t": "For $u = [0, 1, 1]^{T}$, $v = [2, 0, 1]^{T}$, $w = [2, 1, k]^{T}$: find all k making the vectors coplanar; at that k express w as a linear combination of u and v.",
   "o": [
    "$k = \\frac{3}{2}$; w = u + ($\\frac{1}{2}$)v",
    "$k = \\frac{1}{2}$; w = u + ($\\frac{1}{2}$)v",
    "$k = \\frac{3}{2}$; w = 2u + v",
    "$k = \\frac{1}{2}$; w = 2u + v"
   ],
   "e": "Vectors are coplanar when the scalar triple product is zero. The cross product u × v is [-1, -2, 2]^T, and its dot product with w gives 2k - 3 = 0, so $k = \\frac{3}{2}$. Solving w = αu + βv gives α = 1 and β = $\\frac{1}{2}$.",
   "ru": {
    "t": "Для $u = [0, 1, 1]^{T}$, $v = [2, 0, 1]^{T}$, $w = [2, 1, k]^{T}$: найдите все k, при которых векторы компланарны; при таком k выразите w как линейную комбинацию u и v.",
    "o": [
     "$k = \\frac{3}{2}$; w = u + ($\\frac{1}{2}$)v",
     "$k = \\frac{1}{2}$; w = u + ($\\frac{1}{2}$)v",
     "$k = \\frac{3}{2}$; w = 2u + v",
     "$k = \\frac{1}{2}$; w = 2u + v"
    ],
    "e": "Векторы компланарны, когда смешанное произведение равно нулю. Векторное произведение u × v равно [-1, -2, 2]^T, а его скалярное произведение с w даёт 2k - 3 = 0, поэтому $k = \\frac{3}{2}$. Решая w = αu + βv, получаем α = 1 и β = $\\frac{1}{2}$."
   },
   "uz": {
    "t": "$u = [0, 1, 1]^{T}$, $v = [2, 0, 1]^{T}$, $w = [2, 1, k]^{T}$ uchun: vektorlarni tekislikda yotuvchi qiladigan barcha k ni toping; oʻsha k da w ni u va v ning chiziqli kombiniatsiyasi sifatida ifodalang.",
    "o": [
     "$k = \\frac{3}{2}$; w = u + ($\\frac{1}{2}$)v",
     "$k = \\frac{1}{2}$; w = u + ($\\frac{1}{2}$)v",
     "$k = \\frac{3}{2}$; w = 2u + v",
     "$k = \\frac{1}{2}$; w = 2u + v"
    ],
    "e": "Vektorlar skalyar uchlik koʻpaytma nol boʻlganda bir tekislikda yotadi. u × v vektor koʻpaytma [-1, -2, 2]^T ga teng, uning w bilan skalyar koʻpaytmasi 2k - 3 = 0 ni beradi, demak $k = \\frac{3}{2}$. w = αu + βv tenglamani yechish α = 1 va β = $\\frac{1}{2}$ ni beradi."
   }
  },
  {
   "t": "Let D = $\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$ and X = $\\begin{pmatrix}a&b\\\\&d\\end{pmatrix}$. Find every X such that DX = XD. What if both diagonal entries of D are equal?",
   "o": [
    "X must have $b = c = 0$; if $D = λI$, then all X commute with D",
    "X must be diagonal; if $D = λI$, then all X commute with D",
    "X must have $b = c = 0$; if $D = λI$, then only diagonal X commute with D",
    "X must be scalar multiples of I; if $D = λI$, then only scalar multiples commute with D"
   ],
   "e": "Equating DX and XD shows that b and c must be zero, while a and d are free. If D is a scalar multiple of the identity, then DX = λX = XD for any matrix X.",
   "ru": {
    "t": "Пусть D = $\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$ и X = $\\begin{pmatrix}a&b\\\\&d\\end{pmatrix}$. Найдите все X, для которых DX = XD. Что, если оба диагональных элемента D равны?",
    "o": [
     "X должна иметь $b = c = 0$; если $D = λI$, то все X коммутируют с D",
     "X должна быть диагональной; если $D = λI$, то все X коммутируют с D",
     "X должна иметь $b = c = 0$; если $D = λI$, то с D коммутируют только диагональные X",
     "X должна быть скалярным кратным I; если $D = λI$, то с D коммутируют только скалярные кратные"
    ],
    "e": "Приравнивая DX и XD, получаем, что b и c должны быть нулями, а a и d — произвольными. Если D — скалярное кратное единичной матрицы, то DX = λX = XD для любой матрицы X."
   },
   "uz": {
    "t": "D = $\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$ va X = $\\begin{pmatrix}a&b\\\\&d\\end{pmatrix}$ boʻlsin. DX = XD boʻladigan barcha X ni toping. Agar D ning ikkala diagonal elementi teng boʻlsa-chi?",
    "o": [
     "X da $b = c = 0$ boʻlishi kerak; agar $D = λI$ boʻlsa, barcha X D bilan kommutativ boʻladi",
     "X diagonal boʻlishi kerak; agar $D = λI$ boʻlsa, barcha X D bilan kommutativ boʻladi",
     "X da $b = c = 0$ boʻlishi kerak; agar $D = λI$ boʻlsa, D bilan faqat diagonal X lar kommutativ boʻladi",
     "X ning I ning sonli koʻpaytmasi boʻlishi kerak; agar $D = λI$ boʻlsa, D bilan faqat sonli koʻpaytmalar kommutativ boʻladi"
    ],
    "e": "DX va XD ni tenglashtirish b va c nol boʻlishi kerakligini, a va d esa erkin ekanini koʻrsatadi. Agar D birlik matritsaning sonli koʻpaytmasi boʻlsa, istalgan X matritsa uchun DX = λX = XD boʻladi."
   }
  },
  {
   "t": "Let u = [0, 0], v = [2, 0], w = [1, -1] and L = $\\begin{pmatrix}0 & 1\\\\0 & -1\\end{pmatrix}$. Without recomputing edges, find the signed triple product and volume after applying L to every edge; why is the volume factor universal?",
   "o": [
    "Signed triple product = -26, volume = 26, factor is |$det L| = 2$",
    "Signed triple product = -13, volume = 13, factor is |$det L| = 1$",
    "Signed triple product = 26, volume = 26, factor is |$det L| = 2$",
    "Signed triple product = -26, volume = 26, factor is |$det L| = 1$"
   ],
   "e": "The signed triple product is det(LU) = det L det U = (-2)(13) = -26, so the volume is 26. The factor is |det L| = 2 regardless of the original vectors because det(LU) = det L det U for every matrix U.",
   "ru": {
    "t": "Пусть u = [0, 0], v = [2, 0], w = [1, -1] и L = $\\begin{pmatrix}0 & 1\\\\0 & -1\\end{pmatrix}$. Не пересчитывая рёбра, найдите знаковое тройное произведение и объём после применения L к каждому ребру; почему объёмный коэффициент универсален?",
    "o": [
     "Знаковое тройное произведение = -26, объём = 26, коэффициент равен |$det L| = 2$",
     "Знаковое тройное произведение = -13, объём = 13, коэффициент равен |$det L| = 1$",
     "Знаковое тройное произведение = 26, объём = 26, коэффициент равен |$det L| = 2$",
     "Знаковое тройное произведение = -26, объём = 26, коэффициент равен |$det L| = 1$"
    ],
    "e": "Знаковое тройное произведение равно det(LU) = det L det U = (-2)(13) = -26, поэтому объём равен 26. Коэффициент равен |det L| = 2 независимо от исходных векторов, поскольку det(LU) = det L det U для любой матрицы U."
   },
   "uz": {
    "t": "u = [0, 0], v = [2, 0], w = [1, -1] va L = $\\begin{pmatrix}0 & 1\\\\0 & -1\\end{pmatrix}$ boʻlsin. Qirralarni qayta hisoblamasdan, har bir qirraga L qoʻllangandan keyingi ishorali uchlik koʻpaytmani va hajmni toping; hajm koeffitsienti nima uchun universal?",
    "o": [
     "Ishorali uchlik koʻpaytma = -26, hajm = 26, koeffitsient |$det L| = 2$",
     "Ishorali uchlik koʻpaytma = -13, hajm = 13, koeffitsient |$det L| = 1$",
     "Ishorali uchlik koʻpaytma = 26, hajm = 26, koeffitsient |$det L| = 2$",
     "Ishorali uchlik koʻpaytma = -26, hajm = 26, koeffitsient |$det L| = 1$"
    ],
    "e": "Ishorali uchlik koʻpaytma det(LU) = det L det U = (-2)(13) = -26 ga teng, demak hajm 26 ga teng. Koeffitsient |det L| = 2 boʻlib, u dastlabki vektorlarga bogʻliq emas, chunki har qanday U matritsa uchun det(LU) = det L det U."
   }
  },
  {
   "t": "Compute the rank of matrix $A = \\begin{pmatrix}2 & 4 & 5 \\\\ 3 & 6 & 4\\end{pmatrix}$ using Gaussian elimination.",
   "o": [
    "2",
    "1",
    "3",
    "0"
   ],
   "e": "After elimination, we get two nonzero pivots: the first in column 1 and the second in column 3 after row operations. The second column is dependent (2× first column), confirming rank $A = 2$.",
   "ru": {
    "t": "Найдите ранг матрицы $A = \\begin{pmatrix}2 & 4 & 5 \\\\ 3 & 6 & 4\\end{pmatrix}$ с помощью гауссова исключения.",
    "o": [
     "2",
     "1",
     "3",
     "0"
    ],
    "e": "После исключения получаем два ненулевых ведущих элемента: первый в столбце 1 и второй в столбце 3 после преобразования строк. Второй столбец зависим (2× первый столбец), что подтверждает rank $A = 2$."
   },
   "uz": {
    "t": "Gauss usuli bilan $A = \\begin{pmatrix}2 & 4 & 5 \\\\ 3 & 6 & 4\\end{pmatrix}$ matritsaning rangini hisoblang.",
    "o": [
     "2",
     "1",
     "3",
     "0"
    ],
    "e": "Qadam tashlashdan soʻng ikkita nolga teng boʻlmagan yetakchi element olamiz: birinchisi 1-ustunda, ikkinchisi qator amallaridan keyin 3-ustunda. Ikkinchi ustun bogʻliq (birinchi ustunning 2× barobari), bu rang $A = 2$ ekanligini tasdiqlaydi."
   }
  },
  {
   "t": "Determine if matrix $B = \\begin{pmatrix}2 & 1 \\\\ 4 & 2\\end{pmatrix}$ is invertible using three methods: pivots, determinant, and null vectors.",
   "o": [
    "Not invertible by all three methods",
    "Invertible by all three methods",
    "Not invertible by pivots method only",
    "Not invertible by determinant method only"
   ],
   "e": "All three methods show $B$ is singular: only one pivot after elimination; determinant is $2\\times 2 - 1\\times 4 = 0$; and $(1, -2)^{T}$ is a nonzero null vector. Thus $B$ is not invertible.",
   "ru": {
    "t": "Определите, обратима ли матрица $B = \\begin{pmatrix}2 & 1 \\\\ 4 & 2\\end{pmatrix}$, тремя методами: ведущие элементы, определитель и нулевые векторы.",
    "o": [
     "Не обратима по всем трём методам",
     "Обратима по всем трём методам",
     "Не обратима только по методу ведущих элементов",
     "Не обратима только по методу определителя"
    ],
    "e": "Все три метода показывают, что $B$ вырождена: после исключения остаётся только один ведущий элемент; определитель равен $2\\times 2 - 1\\times 4 = 0$; и $(1, -2)^{T}$ — ненулевой вектор нуль-пространства. Следовательно, $B$ не обратима."
   },
   "uz": {
    "t": "$B = \\begin{pmatrix}2 & 1 \\\\ 4 & 2\\end{pmatrix}$ matritsaning teskari matritsaga ega yoki ega emasligini uch usul bilan aniqlang: yetakchi elementlar, determinant va null-vektorlar.",
    "o": [
     "Uchala usul boʻyicha ham teskari matritsaga ega emas",
     "Uchala usul boʻyicha ham teskari matritsaga ega",
     "Faqat yetakchi elementlar usuli boʻyicha teskari matritsaga ega emas",
     "Faqat determinant usuli boʻyicha teskari matritsaga ega emas"
    ],
    "e": "Uchala usul ham $B$ degeneratsiyalangan (singular) ekanligini koʻrsatadi: qadam tashlashdan keyin faqat bitta yetakchi element qoladi; determinant $2\\times 2 - 1\\times 4 = 0$; va $(1, -2)^{T}$ — nol-fazoning noldan farq qiluvchi vektori. Demak, $B$ teskari matritsaga ega emas."
   }
  },
  {
   "t": "Find the inverse of A = $\\begin{pmatrix}5&3\\\\1&2\\end{pmatrix}$ by the 2×2 formula and check that $AA^{-1} = I$.",
   "o": [
    "$\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$",
    "$\\begin{pmatrix}2&-1\\\\-5&3\\end{pmatrix}$",
    "$\\begin{pmatrix}2&-1\\\\-3&5\\end{pmatrix}$",
    "$\\begin{pmatrix}3&-1\\\\-3&2\\end{pmatrix}$"
   ],
   "e": "The determinant of A is 1, and using the 2×2 inverse formula, we get $A^{-1} = \\begin{pmatrix}2&-1\\\\-5&2\\end{pmatrix}$. The check confirms $AA^{-1} = I$.",
   "ru": {
    "t": "Найдите обратную матрицу для A = $\\begin{pmatrix}5&3\\\\1&2\\end{pmatrix}$ по формуле для 2×2 и проверьте, что $AA^{-1} = I$.",
    "o": [
     "$\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$",
     "$\\begin{pmatrix}2&-1\\\\-5&3\\end{pmatrix}$",
     "$\\begin{pmatrix}2&-1\\\\-3&5\\end{pmatrix}$",
     "$\\begin{pmatrix}3&-1\\\\-3&2\\end{pmatrix}$"
    ],
    "e": "Определитель A равен 1, и по формуле обратной матрицы 2×2 получаем $A^{-1} = \\begin{pmatrix}2&-1\\\\-5&2\\end{pmatrix}$. Проверка подтверждает $AA^{-1} = I$."
   },
   "uz": {
    "t": "A = $\\begin{pmatrix}5&3\\\\1&2\\end{pmatrix}$ matritsa uchun teskari matritsani 2×2 formula boʻyicha toping va $AA^{-1} = I$ ekanligini tekshiring.",
    "o": [
     "$\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$",
     "$\\begin{pmatrix}2&-1\\\\-5&3\\end{pmatrix}$",
     "$\\begin{pmatrix}2&-1\\\\-3&5\\end{pmatrix}$",
     "$\\begin{pmatrix}3&-1\\\\-3&2\\end{pmatrix}$"
    ],
    "e": "A matritsaning determinanti 1 ga teng; 2×2 teskari matritsa formulasidan $A^{-1} = \\begin{pmatrix}2&-1\\\\-5&2\\end{pmatrix}$ topiladi. Tekshirish $AA^{-1} = I$ ekanligini tasdiqlaydi."
   }
  },
  {
   "t": "Use Gauss-Jordan elimination on $[A|I]$ to find the inverse of A = $\\begin{pmatrix}1&2\\\\3&7\\end{pmatrix}$.",
   "o": [
    "$\\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$",
    "$\\begin{pmatrix}-7&2\\\\3&-1\\end{pmatrix}$",
    "$\\begin{pmatrix}7&2\\\\-3&1\\end{pmatrix}$",
    "$\\begin{pmatrix}-7&-2\\\\3&1\\end{pmatrix}$"
   ],
   "e": "Applying Gauss-Jordan elimination to $[A|I]$ yields the inverse matrix $A^{-1} = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$, which is verified by checking $AA^{-1} = I$.",
   "ru": {
    "t": "Примените исключение Гаусса–Жордана к $[A|I]$, чтобы найти обратную матрицу для A = $\\begin{pmatrix}1&2\\\\3&7\\end{pmatrix}$.",
    "o": [
     "$\\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$",
     "$\\begin{pmatrix}-7&2\\\\3&-1\\end{pmatrix}$",
     "$\\begin{pmatrix}7&2\\\\-3&1\\end{pmatrix}$",
     "$\\begin{pmatrix}-7&-2\\\\3&1\\end{pmatrix}$"
    ],
    "e": "Применение исключения Гаусса–Жордана к $[A|I]$ даёт обратную матрицу $A^{-1} = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$, что подтверждается проверкой $AA^{-1} = I$."
   },
   "uz": {
    "t": "A = $\\begin{pmatrix}1&2\\\\3&7\\end{pmatrix}$ matritsaning teskari matritsasini topish uchun $[A|I]$ ga Gauss–Jordan usulini qoʻllang.",
    "o": [
     "$\\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$",
     "$\\begin{pmatrix}-7&2\\\\3&-1\\end{pmatrix}$",
     "$\\begin{pmatrix}7&2\\\\-3&1\\end{pmatrix}$",
     "$\\begin{pmatrix}-7&-2\\\\3&1\\end{pmatrix}$"
    ],
    "e": "$[A|I]$ ga Gauss–Jordan usulini qoʻllash $A^{-1} = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$ teskari matritsani beradi; bu $AA^{-1} = I$ tekshiruvi bilan tasdiqlanadi."
   }
  },
  {
   "t": "Find the inverse of K = $\\begin{pmatrix}2&-1&0\\\\-1&2&-1\\\\0&-1&2\\end{pmatrix}$ using Gauss-Jordan elimination and verify that the product of the pivots equals det(K).",
   "o": [
    "$\\begin{pmatrix}3&2&1\\\\ 2&4&2\\\\ 1&2&3\\end{pmatrix}$",
    "$\\begin{pmatrix}\\frac{3}{4}&\\frac{1}{2}&\\frac{1}{4}\\\\ \\frac{1}{2}&1&\\frac{1}{2}\\\\ \\frac{1}{4}&\\frac{1}{2}&\\frac{3}{4}\\end{pmatrix}$",
    "$\\begin{pmatrix}\\frac{3}{2}&1&\\frac{1}{2}\\\\ 1&2&1\\\\ \\frac{1}{2}&1&\\frac{3}{2}\\end{pmatrix}$",
    "$\\begin{pmatrix}\\frac{1}{3}&\\frac{1}{2}&\\frac{1}{4}\\\\ \\frac{1}{2}&1&\\frac{1}{2}\\\\ \\frac{1}{4}&\\frac{1}{2}&\\frac{1}{3}\\end{pmatrix}$"
   ],
   "e": "Using Gauss-Jordan elimination, we find $K^{-1} = \\begin{pmatrix}3&2&1\\\\ 2&4&2\\\\ 1&2&3\\end{pmatrix}$. The pivots are 2, $\\frac{3}{2}$, and $\\frac{3}{4}$, and their product is 4, which equals $\\det(K)$.",
   "ru": {
    "t": "Найдите обратную матрицу K = $\\begin{pmatrix}2&-1&0\\\\-1&2&-1\\\\0&-1&2\\end{pmatrix}$ методом Гаусса–Жордана и проверьте, что произведение ведущих элементов равно det(K).",
    "o": [
     "$\\begin{pmatrix}3&2&1\\\\ 2&4&2\\\\ 1&2&3\\end{pmatrix}$",
     "$\\begin{pmatrix}\\frac{3}{4}&\\frac{1}{2}&\\frac{1}{4}\\\\ \\frac{1}{2}&1&\\frac{1}{2}\\\\ \\frac{1}{4}&\\frac{1}{2}&\\frac{3}{4}\\end{pmatrix}$",
     "$\\begin{pmatrix}\\frac{3}{2}&1&\\frac{1}{2}\\\\ 1&2&1\\\\ \\frac{1}{2}&1&\\frac{3}{2}\\end{pmatrix}$",
     "$\\begin{pmatrix}\\frac{1}{3}&\\frac{1}{2}&\\frac{1}{4}\\\\ \\frac{1}{2}&1&\\frac{1}{2}\\\\ \\frac{1}{4}&\\frac{1}{2}&\\frac{1}{3}\\end{pmatrix}$"
    ],
    "e": "Методом Гаусса–Жордана находим $K^{-1} = \\begin{pmatrix}3&2&1\\\\ 2&4&2\\\\ 1&2&3\\end{pmatrix}$. Ведущие элементы равны 2, $\\frac{3}{2}$ и $\\frac{3}{4}$, их произведение равно 4, что совпадает с $\\det(K)$."
   },
   "uz": {
    "t": "K = $\\begin{pmatrix}2&-1&0\\\\-1&2&-1\\\\0&-1&2\\end{pmatrix}$ matritsaning teskari matritsini Gauss–Jordan usuli bilan toping va yetakchi elementlar koʻpaytmasi det(K) ga teng ekanligini tekshiring.",
    "o": [
     "$\\begin{pmatrix}3&2&1\\\\ 2&4&2\\\\ 1&2&3\\end{pmatrix}$",
     "$\\begin{pmatrix}\\frac{3}{4}&\\frac{1}{2}&\\frac{1}{4}\\\\ \\frac{1}{2}&1&\\frac{1}{2}\\\\ \\frac{1}{4}&\\frac{1}{2}&\\frac{3}{4}\\end{pmatrix}$",
     "$\\begin{pmatrix}\\frac{3}{2}&1&\\frac{1}{2}\\\\ 1&2&1\\\\ \\frac{1}{2}&1&\\frac{3}{2}\\end{pmatrix}$",
     "$\\begin{pmatrix}\\frac{1}{3}&\\frac{1}{2}&\\frac{1}{4}\\\\ \\frac{1}{2}&1&\\frac{1}{2}\\\\ \\frac{1}{4}&\\frac{1}{2}&\\frac{1}{3}\\end{pmatrix}$"
    ],
    "e": "Gauss–Jordan usuli yordamida $K^{-1} = \\begin{pmatrix}3&2&1\\\\ 2&4&2\\\\ 1&2&3\\end{pmatrix}$ topiladi. Yetakchi elementlar 2, $\\frac{3}{2}$ va $\\frac{3}{4}$ boʻlib, ularning koʻpaytmasi 4 ga, yaʼni $\\det(K)$ ga teng."
   }
  },
  {
   "t": "Solve $Ax = b$ for $A = \\begin{pmatrix}1&2\\\\3&7\\end{pmatrix}$ and $b = (1, 1)^T$ using the inverse $A^{-1} = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$ found in Problem 4.",
   "o": [
    "$x = (5, -2)$",
    "$x = (9, -1)$",
    "$x = (1, 1)$",
    "$x = (7, -3)$"
   ],
   "e": "x = $A^{-1}b = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix} \\begin{pmatrix}1\\\\1\\end{pmatrix} = (7-2, -3+1) = (5, -2)$. Check: $A \\begin{pmatrix}5\\\\-2\\end{pmatrix} = (1·5+2·(-2), 3·5+7·(-2)) = (1, 1) = b$.",
   "ru": {
    "t": "Решите $Ax = b$ для $A = \\begin{pmatrix}1&2\\\\3&7\\end{pmatrix}$ и $b = (1, 1)^T$, используя обратную матрицу $A^{-1} = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$, найденную в задаче 4.",
    "o": [
     "$x = (5, -2)$",
     "$x = (9, -1)$",
     "$x = (1, 1)$",
     "$x = (7, -3)$"
    ],
    "e": "x = $A^{-1}b = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix} \\begin{pmatrix}1\\\\1\\end{pmatrix} = (7-2, -3+1) = (5, -2)$. Проверка: $A \\begin{pmatrix}5\\\\-2\\end{pmatrix} = (1·5+2·(-2), 3·5+7·(-2)) = (1, 1) = b$."
   },
   "uz": {
    "t": "4-masalada topilgan teskari matritsa $A^{-1} = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix}$ yordamida $A = \\begin{pmatrix}1&2\\\\3&7\\end{pmatrix}$ va $b = (1, 1)^T$ uchun $Ax = b$ tenglamani yeching.",
    "o": [
     "$x = (5, -2)$",
     "$x = (9, -1)$",
     "$x = (1, 1)$",
     "$x = (7, -3)$"
    ],
    "e": "x = $A^{-1}b = \\begin{pmatrix}7&-2\\\\-3&1\\end{pmatrix} \\begin{pmatrix}1\\\\1\\end{pmatrix} = (7-2, -3+1) = (5, -2)$. Tekshirish: $A \\begin{pmatrix}5\\\\-2\\end{pmatrix} = (1·5+2·(-2), 3·5+7·(-2)) = (1, 1) = b$."
   }
  },
  {
   "t": "Given A = $\\begin{pmatrix}0&2\\\\1&1\\end{pmatrix}$ and B = $\\begin{pmatrix}1&0\\\\-1&1\\end{pmatrix}$, compute $(AB)^{-1}$ without multiplying first, then verify.",
   "o": [
    "$\\begin{pmatrix}1/2&-1/4\\\\-1/2&3/4\\end{pmatrix}$",
    "$\\begin{pmatrix}1/2&-1/2\\\\-1/4&3/4\\end{pmatrix}$",
    "$\\begin{pmatrix}1/2&1/4\\\\1/2&3/4\\end{pmatrix}$",
    "$\\begin{pmatrix}1/2&-1/2\\\\1/4&3/4\\end{pmatrix}$"
   ],
   "e": "Using the reverse-order law, $(AB)^{-1} = B^{-1}A^{-1}$. We find $A^{-1} = \\begin{pmatrix}-1/2&1\\\\1/2&0\\end{pmatrix}$ and $B^{-1} = \\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$, then multiply to get $B^{-1}A^{-1} = \\begin{pmatrix}1/2&-1/4\\\\-1/2&3/4\\end{pmatrix}$.",
   "ru": {
    "t": "Даны A = $\\begin{pmatrix}0&2\\\\1&1\\end{pmatrix}$ и B = $\\begin{pmatrix}1&0\\\\-1&1\\end{pmatrix}$. Вычислите $(AB)^{-1}$ без предварительного перемножения, затем выполните проверку.",
    "o": [
     "$\\begin{pmatrix}1/2&-1/4\\\\-1/2&3/4\\end{pmatrix}$",
     "$\\begin{pmatrix}1/2&-1/2\\\\-1/4&3/4\\end{pmatrix}$",
     "$\\begin{pmatrix}1/2&1/4\\\\1/2&3/4\\end{pmatrix}$",
     "$\\begin{pmatrix}1/2&-1/2\\\\1/4&3/4\\end{pmatrix}$"
    ],
    "e": "По закону обратного порядка $(AB)^{-1} = B^{-1}A^{-1}$. Находим $A^{-1} = \\begin{pmatrix}-1/2&1\\\\1/2&0\\end{pmatrix}$ и $B^{-1} = \\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$, затем перемножаем: $B^{-1}A^{-1} = \\begin{pmatrix}1/2&-1/4\\\\-1/2&3/4\\end{pmatrix}$."
   },
   "uz": {
    "t": "A = $\\begin{pmatrix}0&2\\\\1&1\\end{pmatrix}$ va B = $\\begin{pmatrix}1&0\\\\-1&1\\end{pmatrix}$ berilgan. Avval koʻpaytmani hisoblamasdan $(AB)^{-1}$ ni toping, soʻng tekshiring.",
    "o": [
     "$\\begin{pmatrix}1/2&-1/4\\\\-1/2&3/4\\end{pmatrix}$",
     "$\\begin{pmatrix}1/2&-1/2\\\\-1/4&3/4\\end{pmatrix}$",
     "$\\begin{pmatrix}1/2&1/4\\\\1/2&3/4\\end{pmatrix}$",
     "$\\begin{pmatrix}1/2&-1/2\\\\1/4&3/4\\end{pmatrix}$"
    ],
    "e": "Teskari tartib qonuniga koʻra $(AB)^{-1} = B^{-1}A^{-1}$. $A^{-1} = \\begin{pmatrix}-1/2&1\\\\1/2&0\\end{pmatrix}$ va $B^{-1} = \\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$ topib, ularni koʻpaytiramiz: $B^{-1}A^{-1} = \\begin{pmatrix}1/2&-1/4\\\\-1/2&3/4\\end{pmatrix}$."
   }
  },
  {
   "t": "True or false: (a) If A is invertible, so is $A^{T}$. (b) If $Ax = \\lambda x$ with $x \\neq 0$ and $\\lambda = 0$, then A is not invertible. (c) A product of invertible $3\\times 3$ matrices can be singular. (d) rank(A) ≤ 2 for every $2\\times 3$ matrix.",
   "o": [
    "(a) True, (b) True, (c) False, (d) True",
    "(a) True, (b) True, (c) True, (d) False",
    "(a) True, (b) False, (c) True, (d) False",
    "(a) False, (b) True, (c) False, (d) True"
   ],
   "e": "(a) True because $A^{T}$ has the same rank as A. (b) True because $Ax = 0$ with $x \\neq 0$ implies A is not invertible. (c) False because the product of invertible matrices is always invertible. (d) True because rank cannot exceed the number of rows.",
   "ru": {
    "t": "Верно или неверно: (a) Если A обратима, то и $A^{T}$ обратима. (b) Если $Ax = \\lambda x$, где $x \\neq 0$ и $\\lambda = 0$, то A не обратима. (c) Произведение обратимых матриц $3\\times 3$ может быть вырожденным. (d) rank(A) ≤ 2 для любой матрицы $2\\times 3$.",
    "o": [
     "(a) Верно, (b) Верно, (c) Неверно, (d) Верно",
     "(a) Верно, (b) Верно, (c) Верно, (d) Неверно",
     "(a) Верно, (b) Неверно, (c) Верно, (d) Неверно",
     "(a) Неверно, (b) Верно, (c) Неверно, (d) Верно"
    ],
    "e": "(a) Верно, так как $A^{T}$ имеет тот же ранг, что и A. (b) Верно, так как $Ax = 0$ при $x \\neq 0$ означает, что A не обратима. (c) Неверно, потому что произведение обратимых матриц всегда обратимо. (d) Верно, так как ранг не может превышать числа строк."
   },
   "uz": {
    "t": "Toʻgʻrimi yoki notoʻgʻrimi: (a) Agar A teskari matritsaga ega boʻlsa, $A^{T}$ ham shunday. (b) Agar $Ax = \\lambda x$, $x \\neq 0$ va $\\lambda = 0$ boʻlsa, u holda A teskari matritsaga ega emas. (c) Teskari $3\\times 3$ matritsalar koʻpaytmasi degeneratsiyalangan boʻlishi mumkin. (d) Har bir $2\\times 3$ matritsa uchun rank(A) ≤ 2.",
    "o": [
     "(a) Toʻgʻri, (b) Toʻgʻri, (c) Notoʻgʻri, (d) Toʻgʻri",
     "(a) Toʻgʻri, (b) Toʻgʻri, (c) Toʻgʻri, (d) Notoʻgʻri",
     "(a) Toʻgʻri, (b) Notoʻgʻri, (c) Toʻgʻri, (d) Notoʻgʻri",
     "(a) Notoʻgʻri, (b) Toʻgʻri, (c) Notoʻgʻri, (d) Toʻgʻri"
    ],
    "e": "(a) Toʻgʻri, chunki $A^{T}$ A bilan bir xil rangga ega. (b) Toʻgʻri, chunki $x \\neq 0$ boʻlganda $Ax = 0$ A teskari matritsaga ega emasligini bildiradi. (c) Notoʻgʻri, chunki teskari matritsalar koʻpaytmasi har doim teskari matritsaga ega. (d) Toʻgʻri, chunki rang qatorlar sonidan oshmaydi."
   }
  },
  {
   "t": "For which value(s) of c is A = $\\begin{pmatrix}1&3\\\\2&c\\end{pmatrix}$ singular? For the remaining values, solve $Ax = b$ by the inverse formula.",
   "o": [
    "c = 6; for c ≠ 6, x = $\\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
    "c = 6; for c ≠ 6, x = $\\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
    "c = 3; for c ≠ 3, x = $\\begin{pmatrix}(4c-20)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
    "c = 3; for c ≠ 3, x = $\\begin{pmatrix}(4c-20)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$"
   ],
   "e": "A is singular when det(A) = c - 6 = 0, so c = 6. For c ≠ 6, $A^{-1} = \\begin{pmatrix}c/(c-6)&-3/(c-6)\\\\2/(c-6)&1/(c-6)\\end{pmatrix}$, and $x = A^{-1}b$ gives $x = \\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$ for $b = \\begin{pmatrix}4\\\\-2\\end{pmatrix}$.",
   "ru": {
    "t": "При каких значениях c матрица A = $\\begin{pmatrix}1&3\\\\2&c\\end{pmatrix}$ вырождена? Для остальных значений решите $Ax = b$ по формуле обратной матрицы.",
    "o": [
     "c = 6; для c ≠ 6, x = $\\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
     "c = 6; для c ≠ 6, x = $\\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
     "c = 3; для c ≠ 3, x = $\\begin{pmatrix}(4c-20)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
     "c = 3; для c ≠ 3, x = $\\begin{pmatrix}(4c-20)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$"
    ],
    "e": "A вырождена, когда det(A) = c - 6 = 0, то есть c = 6. При c ≠ 6, $A^{-1} = \\begin{pmatrix}c/(c-6)&-3/(c-6)\\\\2/(c-6)&1/(c-6)\\end{pmatrix}$, и $x = A^{-1}b$ даёт $x = \\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$ для $b = \\begin{pmatrix}4\\\\-2\\end{pmatrix}$."
   },
   "uz": {
    "t": "Qanday c qiymatlarda A = $\\begin{pmatrix}1&3\\\\2&c\\end{pmatrix}$ matritsa degeneratsiyalangan (singular) boʻladi? Qolgan qiymatlar uchun teskari matritsa formulasi orqali $Ax = b$ ni yeching.",
    "o": [
     "c = 6; c ≠ 6 uchun x = $\\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
     "c = 6; c ≠ 6 uchun x = $\\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
     "c = 3; c ≠ 3 uchun x = $\\begin{pmatrix}(4c-20)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$",
     "c = 3; c ≠ 3 uchun x = $\\begin{pmatrix}(4c-20)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$"
    ],
    "e": "det(A) = c - 6 = 0 boʻlganda, yaʼni c = 6 da A degeneratsiyalangan. c ≠ 6 boʻlganda $A^{-1} = \\begin{pmatrix}c/(c-6)&-3/(c-6)\\\\2/(c-6)&1/(c-6)\\end{pmatrix}$ boʻladi va $x = A^{-1}b$ dan $b = \\begin{pmatrix}4\\\\-2\\end{pmatrix}$ uchun $x = \\begin{pmatrix}(c-2)/(c-6)\\\\(-2)/(c-6)\\end{pmatrix}$ kelib chiqadi."
   }
  },
  {
   "t": "Show that if A is invertible then rank(AB) = rank(B) for any compatible matrix B.",
   "o": [
    "rank(AB) ≤ rank(B) because rows of AB are combinations of rows of B. Applying to B = $A^{-1}(AB)$ gives rank(B) ≤ rank(AB), so equality holds.",
    "rank(AB) = rank(B) because multiplying by an invertible matrix doesn't change the nullity of B.",
    "rank(AB) = rank(A) × rank(B) because A is invertible, so rank(AB) = rank(B).",
    "rank(AB) = rank(A) + rank(B) - n, where n is the number of columns in A, which equals rank(B) when A is invertible."
   ],
   "e": "rank(AB) ≤ rank(B) because rows of AB are combinations of rows of B. Applying the same to B = $A^{-1}(AB)$ gives rank(B) ≤ rank(AB). Both inequalities force rank(AB) = rank(B).",
   "ru": {
    "t": "Покажите, что если A обратима, то rank(AB) = rank(B) для любой совместимой с ней матрицы B.",
    "o": [
     "rank(AB) ≤ rank(B), потому что строки AB — комбинации строк B. Применяя это к B = $A^{-1}(AB)$, получаем rank(B) ≤ rank(AB), откуда следует равенство.",
     "rank(AB) = rank(B), потому что умножение на обратимую матрицу не меняет размерность ядра матрицы B.",
     "rank(AB) = rank(A) × rank(B), так как A обратима, поэтому rank(AB) = rank(B).",
     "rank(AB) = rank(A) + rank(B) - n, где n — число столбцов матрицы A; это равно rank(B), когда A обратима."
    ],
    "e": "rank(AB) ≤ rank(B), потому что строки AB являются комбинациями строк B. Применяя то же к B = $A^{-1}(AB)$, получаем rank(B) ≤ rank(AB). Оба неравенства дают rank(AB) = rank(B)."
   },
   "uz": {
    "t": "Agar A teskari matritsaga ega boʻlsa, istalgan mos keluvchi B matritsa uchun rank(AB) = rank(B) ekanligini koʻrsating.",
    "o": [
     "rank(AB) ≤ rank(B), chunki AB qatorlari B qatorlarining kombinatsiyalari. Buni B = $A^{-1}(AB)$ ga qoʻllasak, rank(B) ≤ rank(AB) boʻladi, demak tenglik oʻrinli.",
     "rank(AB) = rank(B), chunki teskari matritsaga koʻpaytirish B matritsaning yadro oʻlchamini oʻzgartirmaydi.",
     "rank(AB) = rank(A) × rank(B), chunki A teskari matritsaga ega, shuning uchun rank(AB) = rank(B).",
     "rank(AB) = rank(A) + rank(B) - n, bu yerda n — A ning ustunlari soni; A teskari boʻlganda bu rank(B) ga teng boʻladi."
    ],
    "e": "rank(AB) ≤ rank(B), chunki AB qatorlari B qatorlarining kombinatsiyalari. Xuddi shuni B = $A^{-1}(AB)$ ga qoʻllasak, rank(B) ≤ rank(AB) chiqadi. Ikkala tengsizlik birgalikda rank(AB) = rank(B) ni beradi."
   }
  },
  {
   "t": "Describe all vectors $c$u for $u = (2, 1)$, and all combinations $c$u + $d$v for $u = (2, 1)$, $v = (1, 2)$. When do the combinations $c$u + $d$v fill the plane?",
   "o": [
    "cu fills the line; cu+dv fills the plane when u and v are linearly independent",
    "cu fills the line; cu+dv fills the plane when u and v are collinear",
    "cu fills the line; cu+dv fills the plane when u and v are perpendicular",
    "cu fills the plane; cu+dv fills the line when u and v are collinear"
   ],
   "e": "cu fills the line through $(2,1)$; cu+dv fills the plane when u and v are linearly independent, which is the case here since the determinant of the matrix with columns u and v is $3≠0$.",
   "ru": {
    "t": "Опишите все векторы $c$u при $u = (2, 1)$ и все комбинации $c$u + $d$v при $u = (2, 1)$, $v = (1, 2)$. Когда комбинации $c$u + $d$v заполняют всю плоскость?",
    "o": [
     "cu заполняет прямую; cu+dv заполняет плоскость, когда u и v линейно независимы",
     "cu заполняет прямую; cu+dv заполняет плоскость, когда u и v коллинеарны",
     "cu заполняет прямую; cu+dv заполняет плоскость, когда u и v перпендикулярны",
     "cu заполняет плоскость; cu+dv заполняет прямую, когда u и v коллинеарны"
    ],
    "e": "cu заполняет прямую через $(2,1)$; cu+dv заполняет плоскость, когда u и v линейно независимы, что выполняется в данном случае, так как определитель матрицы со столбцами u и v равен $3≠0$."
   },
   "uz": {
    "t": "$u = (2, 1)$ boʻlganda barcha $c$u vektorlarni va $u = (2, 1)$, $v = (1, 2)$ boʻlganda barcha $c$u + $d$v kombinatsiyalarini tasvirlang. $c$u + $d$v kombinatsiyalari qachon butun tekislikni toʻldiradi?",
    "o": [
     "cu toʻgʻri chiziqni toʻldiradi; u va v chiziqli mustaqil boʻlganda cu+dv tekislikni toʻldiradi",
     "cu toʻgʻri chiziqni toʻldiradi; u va v kollinear boʻlganda cu+dv tekislikni toʻldiradi",
     "cu toʻgʻri chiziqni toʻldiradi; u va v perpendikulyar boʻlganda cu+dv tekislikni toʻldiradi",
     "cu tekislikni toʻldiradi; u va v kollinear boʻlganda cu+dv toʻgʻri chiziqni toʻldiradi"
    ],
    "e": "cu $(2,1)$ dan oʻtuvchi toʻgʻri chiziqni toʻldiradi; u va v chiziqli mustaqil boʻlganda cu+dv tekislikni toʻldiradi — bu yerda shunday, chunki u va v ustunlardan tuzilgan matritsaning determinanti $3≠0$."
   }
  },
  {
   "t": "Compute the dot product $u · v$ for $u = (1, 2, 1)$, $v = (3, 0, 2)$ and find a vector $w$ perpendicular to both.",
   "o": [
    "$u \\cdot v = 5$, $w = (4, -1, -6)$",
    "$u \\cdot v = 3$, $w = (2, -1, -4)$",
    "$u \\cdot v = 7$, $w = (4, 1, -6)$",
    "$u \\cdot v = 5$, $w = (-4, 1, 6)$"
   ],
   "e": "u · v = $1·3 + 2·0 + 1·2 = 5$. A perpendicular vector is the cross product $w = u × v = (4, -1, -6)$, which satisfies $w · u = 0$ and $w · v = 0$.",
   "ru": {
    "t": "Вычислите скалярное произведение $u · v$ для $u = (1, 2, 1)$, $v = (3, 0, 2)$ и найдите вектор $w$, перпендикулярный обоим.",
    "o": [
     "$u \\cdot v = 5$, $w = (4, -1, -6)$",
     "$u \\cdot v = 3$, $w = (2, -1, -4)$",
     "$u \\cdot v = 7$, $w = (4, 1, -6)$",
     "$u \\cdot v = 5$, $w = (-4, 1, 6)$"
    ],
    "e": "u · v = $1·3 + 2·0 + 1·2 = 5$. Перпендикулярный вектор — это векторное произведение $w = u × v = (4, -1, -6)$, которое удовлетворяет условиям $w · u = 0$ и $w · v = 0$."
   },
   "uz": {
    "t": "$u = (1, 2, 1)$, $v = (3, 0, 2)$ uchun skalyar koʻpaytma $u · v$ ni hisoblang va ikkalasiga ham perpendikulyar boʻlgan $w$ vektorni toping.",
    "o": [
     "$u \\cdot v = 5$, $w = (4, -1, -6)$",
     "$u \\cdot v = 3$, $w = (2, -1, -4)$",
     "$u \\cdot v = 7$, $w = (4, 1, -6)$",
     "$u \\cdot v = 5$, $w = (-4, 1, 6)$"
    ],
    "e": "u · v = $1·3 + 2·0 + 1·2 = 5$. Perpendikulyar vektor — bu vektor koʻpaytma $w = u × v = (4, -1, -6)$; u $w · u = 0$ va $w · v = 0$ shartlarni qanoatlantiradi."
   }
  },
  {
   "t": "When is the dot product $u · v$ negative, and what does that say about the angle? When is it zero?",
   "o": [
    "Negative when the angle is obtuse (greater than $90°$), zero when perpendicular",
    "Negative when the angle is acute (less than $90°$), zero when perpendicular",
    "Negative when the angle is $90°$, zero when acute",
    "Negative when the angle is $180°$, zero when acute"
   ],
   "e": "The dot product $u · v = |u||v|\\cosθ$ is negative when $\\cosθ < 0$, which occurs when the angle θ exceeds $90°$ (obtuse). It is zero when θ = $90°$ (perpendicular).",
   "ru": {
    "t": "Когда скалярное произведение $u · v$ отрицательно и что это говорит об угле? Когда оно равно нулю?",
    "o": [
     "Отрицательно, когда угол тупой (больше $90°$), ноль — при перпендикулярности",
     "Отрицательно, когда угол острый (меньше $90°$), ноль — при перпендикулярности",
     "Отрицательно при угле $90°$, ноль — при остром угле",
     "Отрицательно при угле $180°$, ноль — при остром угле"
    ],
    "e": "Скалярное произведение $u · v = |u||v|\\cosθ$ отрицательно при $\\cosθ < 0$, то есть когда угол θ больше $90°$ (тупой). Оно равно нулю при θ = $90°$ (перпендикулярность)."
   },
   "uz": {
    "t": "Skalyar koʻpaytma $u · v$ qachon manfiy boʻladi va bu burchak haqida nima deydi? Qachon u nol boʻladi?",
    "o": [
     "Burchak keng ($90°$ dan katta) boʻlganda manfiy, perpendikulyar boʻlganda nol",
     "Burchak oʻtkir ($90°$ dan kichik) boʻlganda manfiy, perpendikulyar boʻlganda nol",
     "Burchak $90°$ boʻlganda manfiy, oʻtkir boʻlganda nol",
     "Burchak $180°$ boʻlganda manfiy, oʻtkir boʻlganda nol"
    ],
    "e": "$u · v = |u||v|\\cosθ$ skalyar koʻpaytma $\\cosθ < 0$ boʻlganda manfiy; bu θ burchak $90°$ dan oshganda (keng burchak) roʻy beradi. θ = $90°$ (perpendikulyar) boʻlganda esa nol boʻladi."
   }
  },
  {
   "t": "Solve $Ax = b$ with $A = \\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ and $b = \\begin{pmatrix}3\\\\4\\end{pmatrix}$ using $A^{-1}$.",
   "o": [
    "x = $\\begin{pmatrix}2/3\\\\5/3\\end{pmatrix}$",
    "x = $\\begin{pmatrix}1/3\\\\2/3\\end{pmatrix}$",
    "x = $\\begin{pmatrix}3/2\\\\4/2\\end{pmatrix}$",
    "x = $\\begin{pmatrix}5/3\\\\2/3\\end{pmatrix}$"
   ],
   "e": "$\\det(A) = 3$, $A^{-1} = \\frac{1}{3}\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}$, so $x = A^{-1}b = \\frac{1}{3}\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}\\begin{pmatrix}3\\\\4\\end{pmatrix} = \\begin{pmatrix}2/3\\\\5/3\\end{pmatrix}$.",
   "ru": {
    "t": "Решите $Ax = b$ с $A = \\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ и $b = \\begin{pmatrix}3\\\\4\\end{pmatrix}$, используя $A^{-1}$.",
    "o": [
     "x = $\\begin{pmatrix}2/3\\\\5/3\\end{pmatrix}$",
     "x = $\\begin{pmatrix}1/3\\\\2/3\\end{pmatrix}$",
     "x = $\\begin{pmatrix}3/2\\\\4/2\\end{pmatrix}$",
     "x = $\\begin{pmatrix}5/3\\\\2/3\\end{pmatrix}$"
    ],
    "e": "$\\det(A) = 3$, $A^{-1} = \\frac{1}{3}\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}$, поэтому $x = A^{-1}b = \\frac{1}{3}\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}\\begin{pmatrix}3\\\\4\\end{pmatrix} = \\begin{pmatrix}2/3\\\\5/3\\end{pmatrix}$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ va $b = \\begin{pmatrix}3\\\\4\\end{pmatrix}$ boʻlganda $Ax = b$ tenglamani $A^{-1}$ yordamida yeching.",
    "o": [
     "x = $\\begin{pmatrix}2/3\\\\5/3\\end{pmatrix}$",
     "x = $\\begin{pmatrix}1/3\\\\2/3\\end{pmatrix}$",
     "x = $\\begin{pmatrix}3/2\\\\4/2\\end{pmatrix}$",
     "x = $\\begin{pmatrix}5/3\\\\2/3\\end{pmatrix}$"
    ],
    "e": "$\\det(A) = 3$, $A^{-1} = \\frac{1}{3}\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}$, demak $x = A^{-1}b = \\frac{1}{3}\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}\\begin{pmatrix}3\\\\4\\end{pmatrix} = \\begin{pmatrix}2/3\\\\5/3\\end{pmatrix}$."
   }
  },
  {
   "t": "Why does a nonzero solution of $Ax = 0$ rule out an inverse? Give the 2-sentence reason the Notes call 'no matrix can bring 0 back to x'.",
   "o": [
    "Because if $Ax = 0$ with $x \\neq 0$, then $x = A^{-1}0 = 0$, creating a contradiction",
    "Because $A$ would have to map $0$ to $x$, but $A(0) = 0$ always, so $x$ must be $0$",
    "Because $A$ would need to be a square matrix, which isn't guaranteed by $Ax = 0$",
    "Because the determinant would be zero, making $A$ singular"
   ],
   "e": "If $Ax = 0$ with $x \\neq 0$ and $A$ had an inverse, then $x = A^{-1}Ax = A^{-1}0 = 0$ — a contradiction. The zero vector has no 'pre-image trouble' only when the map is one-to-one; a null vector proves it is not.",
   "ru": {
    "t": "Почему ненулевое решение $Ax = 0$ исключает существование обратной матрицы? Приведите состоящее из двух фраз объяснение, которое в конспектах называется «никакая матрица не может вернуть 0 обратно в x».",
    "o": [
     "Потому что если $Ax = 0$ при $x \\neq 0$, то $x = A^{-1}0 = 0$ — возникает противоречие",
     "Потому что $A$ должна была бы отображать $0$ в $x$, но всегда $A(0) = 0$, поэтому $x$ должно равняться $0$",
     "Потому что $A$ должна быть квадратной матрицей, а это не гарантируется условием $Ax = 0$",
     "Потому что определитель был бы равен нулю, что делает $A$ вырожденной"
    ],
    "e": "Если $Ax = 0$ при $x \\neq 0$ и у $A$ есть обратная матрица, то $x = A^{-1}Ax = A^{-1}0 = 0$ — противоречие. «Проблемы с прообразом» нет только тогда, когда отображение взаимно однозначно; а нулевой вектор доказывает, что это не так."
   },
   "uz": {
    "t": "$Ax = 0$ ning noldan farq qiluvchi yechimi nima uchun teskari matritsa mavjudligini istisno qiladi? Konspektlarda «hech qanday matritsa 0 ni yana x ga qaytara olmaydi» deb atalgan ikki jumlali asosni keltiring.",
    "o": [
     "Chunki agar $Ax = 0$, $x \\neq 0$ boʻlsa, u holda $x = A^{-1}0 = 0$ — zidlik kelib chiqadi",
     "Chunki $A$ $0$ ni $x$ ga akslantirishi kerak boʻlar edi, lekin har doim $A(0) = 0$, demak $x$ albatta $0$ boʻlishi kerak",
     "Chunki $A$ kvadrat matritsa boʻlishi kerak, bu esa $Ax = 0$ shartidan kafolatlanmaydi",
     "Chunki determinant nolga teng boʻlib qoladi, bu $A$ ni degeneratsiyalangan qiladi"
    ],
    "e": "Agar $Ax = 0$, $x \\neq 0$ va $A$ ning teskari matritsasi boʻlsa, u holda $x = A^{-1}Ax = A^{-1}0 = 0$ — zidlik. «Proobraz muammosi» faqat akslantirish oʻzaro bir-qiymatli boʻlganda boʻlmaydi; null-vektor esa aksincha, bunday emasligini isbotlaydi."
   }
  },
  {
   "t": "If $A$ and $C$ are invertible $3 \\times 3$ matrices, is $A + C$ invertible? Is $AC$? Is $A^{-1}C$?",
   "o": [
    "$A + C$: not necessarily, $AC$: always, $A^{-1}C$: always",
    "$A + C$: always, $AC$: always, $A^{-1}C$: always",
    "$A + C$: never, $AC$: always, $A^{-1}C$: always",
    "$A + C$: not necessarily, $AC$: not necessarily, $A^{-1}C$: always"
   ],
   "e": "$A + C$ is not necessarily invertible (e.g., $C = -A$ gives $0$), but $AC$ and $A^{-1}C$ are always invertible as products of invertible matrices.",
   "ru": {
    "t": "Если $A$ и $C$ — обратимые матрицы $3 \\times 3$, обратима ли $A + C$? А $AC$? А $A^{-1}C$?",
    "o": [
     "$A + C$: не обязательно, $AC$: всегда, $A^{-1}C$: всегда",
     "$A + C$: всегда, $AC$: всегда, $A^{-1}C$: всегда",
     "$A + C$: никогда, $AC$: всегда, $A^{-1}C$: всегда",
     "$A + C$: не обязательно, $AC$: не обязательно, $A^{-1}C$: всегда"
    ],
    "e": "$A + C$ не обязательно обратима (например, $C = -A$ даёт $0$), но $AC$ и $A^{-1}C$ всегда обратимы как произведения обратимых матриц."
   },
   "uz": {
    "t": "Agar $A$ va $C$ teskari $3 \\times 3$ matritsalar boʻlsa, $A + C$ teskari matritsaga egami? $AC$-chi? $A^{-1}C$-chi?",
    "o": [
     "$A + C$: har doim ham emas, $AC$: har doim, $A^{-1}C$: har doim",
     "$A + C$: har doim, $AC$: har doim, $A^{-1}C$: har doim",
     "$A + C$: hech qachon, $AC$: har doim, $A^{-1}C$: har doim",
     "$A + C$: har doim ham emas, $AC$: har doim ham emas, $A^{-1}C$: har doim"
    ],
    "e": "$A + C$ har doim ham teskari matritsaga ega emas (masalan, $C = -A$ boʻlsa $0$ chiqadi), lekin $AC$ va $A^{-1}C$ teskari matritsalar koʻpaytmasi boʻlgani uchun har doim teskari matritsaga ega."
   }
  },
  {
   "t": "Carry out Gauss–Jordan elimination for $A = \\begin{pmatrix}4&-6&0\\\\-2&7&2\\end{pmatrix}$ and state $A^{-1}$.",
   "o": [
    "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$",
    "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\1&-1&\\frac{1}{8}\\end{pmatrix}$",
    "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\-\\frac{8}{8}&\\frac{3}{8}&\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$",
    "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&\\frac{1}{8}\\end{pmatrix}$"
   ],
   "e": "Gauss-Jordan elimination yields $A^{-1} = \\begin{pmatrix}12/8&-5/8&-6/8\\\\8/8&-3/8&-2/8\\\\-1&1&-1/8\\end{pmatrix}$. The determinant is $-16$, confirming the inverse calculation.",
   "ru": {
    "t": "Выполните исключение Гаусса–Жордана для $A = \\begin{pmatrix}4&-6&0\\\\-2&7&2\\end{pmatrix}$ и укажите $A^{-1}$.",
    "o": [
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$",
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\1&-1&\\frac{1}{8}\\end{pmatrix}$",
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\-\\frac{8}{8}&\\frac{3}{8}&\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$",
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&\\frac{1}{8}\\end{pmatrix}$"
    ],
    "e": "Исключение Гаусса–Жордана даёт $A^{-1} = \\begin{pmatrix}12/8&-5/8&-6/8\\\\8/8&-3/8&-2/8\\\\-1&1&-1/8\\end{pmatrix}$. Определитель равен $-16$, что подтверждает вычисление обратной матрицы."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}4&-6&0\\\\-2&7&2\\end{pmatrix}$ uchun Gauss–Jordan usulini bajaring va $A^{-1}$ ni koʻrsating.",
    "o": [
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$",
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\1&-1&\\frac{1}{8}\\end{pmatrix}$",
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\-\\frac{8}{8}&\\frac{3}{8}&\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$",
     "$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&\\frac{1}{8}\\end{pmatrix}$"
    ],
    "e": "Gauss–Jordan usuli $A^{-1} = \\begin{pmatrix}12/8&-5/8&-6/8\\\\8/8&-3/8&-2/8\\\\-1&1&-1/8\\end{pmatrix}$ ni beradi. Determinant $-16$ ga teng, bu teskari matritsa hisobini tasdiqlaydi."
   }
  },
  {
   "t": "State the determinant-transpose identities: $det(A^T)$, $det(AB)$, $det(A^{-1})$.",
   "o": [
    "$det(A^T) = det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = \\frac{1}{det(A)}$",
    "$det(A^T) = det(A)$, $det(AB) = det(A) + det(B)$, $det(A^{-1}) = det(A)$",
    "$det(A^T) = -det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = \\frac{1}{det(A)}$",
    "$det(A^T) = det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = -det(A)$"
   ],
   "e": "The identities are $det(A^T) = det(A)$, $det(AB) = det(A)det(B)$, and $det(A^{-1}) = \\frac{1}{det(A)}$, which shows $A$ is invertible iff $det(A) \\neq 0$.",
   "ru": {
    "t": "Сформулируйте тождества определителя и транспонирования: $det(A^T)$, $det(AB)$, $det(A^{-1})$.",
    "o": [
     "$det(A^T) = det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = \\frac{1}{det(A)}$",
     "$det(A^T) = det(A)$, $det(AB) = det(A) + det(B)$, $det(A^{-1}) = det(A)$",
     "$det(A^T) = -det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = \\frac{1}{det(A)}$",
     "$det(A^T) = det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = -det(A)$"
    ],
    "e": "Тождества: $det(A^T) = det(A)$, $det(AB) = det(A)det(B)$ и $det(A^{-1}) = \\frac{1}{det(A)}$; они показывают, что $A$ обратима тогда и только тогда, когда $det(A) \\neq 0$."
   },
   "uz": {
    "t": "Determinant–transponirlash ayniyatlarini yozing: $det(A^T)$, $det(AB)$, $det(A^{-1})$.",
    "o": [
     "$det(A^T) = det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = \\frac{1}{det(A)}$",
     "$det(A^T) = det(A)$, $det(AB) = det(A) + det(B)$, $det(A^{-1}) = det(A)$",
     "$det(A^T) = -det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = \\frac{1}{det(A)}$",
     "$det(A^T) = det(A)$, $det(AB) = det(A)det(B)$, $det(A^{-1}) = -det(A)$"
    ],
    "e": "Ayniyatlar: $det(A^T) = det(A)$, $det(AB) = det(A)det(B)$ va $det(A^{-1}) = \\frac{1}{det(A)}$; ular $A$ faqat $det(A) \\neq 0$ boʻlganda teskari matritsaga ega ekanligini koʻrsatadi."
   }
  },
  {
   "t": "Prove $(A^{-1})^T = (A^T)^{-1}$ and explain why $A^T A$ is symmetric with nonnegative diagonal.",
   "o": [
    "$(A^{-1})^T$ is inverse of $A^T$ because $(A^{-1})^T A^T = I$; $A^T A$ is symmetric as $(A^T A)^T = A^T A$, with diagonal entries $a_{ki}^2 \\geq 0$",
    "$(A^{-1})^T$ is inverse of $A^T$ because $(A^{-1})^T A^T = A$; $A^T A$ is symmetric as $(A^T A)^T = A^T A$, with diagonal entries $a_{ki} \\geq 0$",
    "$(A^{-1})^T$ is inverse of $A^T$ because $(A^{-1})^T A^T = I$; $A^T A$ is symmetric as $(A^T A)^T = A A^T$, with diagonal entries $a_{ki}^2 \\geq 0$",
    "$(A^{-1})^T$ is inverse of $A^T$ because $(A^{-1})^T A^T = -I$; $A^T A$ is symmetric as $(A^T A)^T = A^T A$, with diagonal entries $a_{ki}^2 \\geq 0$"
   ],
   "e": "Transposing $AA^{-1} = I$ gives $(A^{-1})^T A^T = I$, proving $(A^{-1})^T$ is the inverse of $A^T$. $A^T A$ is symmetric since $(A^T A)^T = A^T A$, and its diagonal entries are sums of squares, hence nonnegative.",
   "ru": {
    "t": "Докажите $(A^{-1})^T = (A^T)^{-1}$ и объясните, почему $A^T A$ симметрична и имеет неотрицательную диагональ.",
    "o": [
     "$(A^{-1})^T$ — обратная для $A^T$, потому что $(A^{-1})^T A^T = I$; $A^T A$ симметрична, так как $(A^T A)^T = A^T A$, диагональные элементы $a_{ki}^2 \\geq 0$",
     "$(A^{-1})^T$ — обратная для $A^T$, потому что $(A^{-1})^T A^T = A$; $A^T A$ симметрична, так как $(A^T A)^T = A^T A$, диагональные элементы $a_{ki} \\geq 0$",
     "$(A^{-1})^T$ — обратная для $A^T$, потому что $(A^{-1})^T A^T = I$; $A^T A$ симметрична, так как $(A^T A)^T = A A^T$, диагональные элементы $a_{ki}^2 \\geq 0$",
     "$(A^{-1})^T$ — обратная для $A^T$, потому что $(A^{-1})^T A^T = -I$; $A^T A$ симметрична, так как $(A^T A)^T = A^T A$, диагональные элементы $a_{ki}^2 \\geq 0$"
    ],
    "e": "Транспонируя $AA^{-1} = I$, получаем $(A^{-1})^T A^T = I$, что доказывает: $(A^{-1})^T$ — обратная матрица для $A^T$. $A^T A$ симметрична, поскольку $(A^T A)^T = A^T A$, а её диагональные элементы — суммы квадратов, следовательно, неотрицательны."
   },
   "uz": {
    "t": "$(A^{-1})^T = (A^T)^{-1}$ ekanligini isbotlang va $A^T A$ nima uchun simmetrik hamda manfiy boʻlmagan diagonalga ega ekanligini tushuntiring.",
    "o": [
     "$(A^{-1})^T$ — $A^T$ ning teskari matritsasi, chunki $(A^{-1})^T A^T = I$; $A^T A$ simmetrik, chunki $(A^T A)^T = A^T A$, diagonal elementlari $a_{ki}^2 \\geq 0$",
     "$(A^{-1})^T$ — $A^T$ ning teskari matritsasi, chunki $(A^{-1})^T A^T = A$; $A^T A$ simmetrik, chunki $(A^T A)^T = A^T A$, diagonal elementlari $a_{ki} \\geq 0$",
     "$(A^{-1})^T$ — $A^T$ ning teskari matritsasi, chunki $(A^{-1})^T A^T = I$; $A^T A$ simmetrik, chunki $(A^T A)^T = A A^T$, diagonal elementlari $a_{ki}^2 \\geq 0$",
     "$(A^{-1})^T$ — $A^T$ ning teskari matritsasi, chunki $(A^{-1})^T A^T = -I$; $A^T A$ simmetrik, chunki $(A^T A)^T = A^T A$, diagonal elementlari $a_{ki}^2 \\geq 0$"
    ],
    "e": "$AA^{-1} = I$ ni transponirlasak, $(A^{-1})^T A^T = I$ boʻladi; bu $(A^{-1})^T$ — $A^T$ ning teskari matritsasi ekanligini isbotlaydi. $A^T A$ simmetrik, chunki $(A^T A)^T = A^T A$, uning diagonal elementlari kvadratlar yigʻindisi boʻlgani uchun manfiy emas."
   }
  }
 ]
};
