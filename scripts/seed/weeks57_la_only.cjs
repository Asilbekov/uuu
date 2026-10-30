module.exports = {
 "title": "Linear Algebra I: Weeks 5-7 Complete Test",
 "description": "Weeks 5-7 of Linear Algebra I in one test: row and column pictures, Gaussian elimination, elimination matrices and permutations; matrix operations, inverses, LU/LDU decompositions, transposes; vector spaces and subspaces, column and null spaces. The full study-guide PDFs (RU/EN/UZ) are attached.",
 "topic": "Mathematics",
 "attachments": [
  {
   "title": "Study Guide (RU) — Линейная алгебра I, недели 5–7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Linear_Algebra_I_Weeks_5-7_RU.pdf",
   "size": null
  },
  {
   "title": "Study Guide (EN) — Linear Algebra I, Weeks 5-7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Linear_Algebra_I_Weeks_5-7_EN.pdf",
   "size": null
  },
  {
   "title": "Study Guide (UZ) — Chiziqli algebra I, 5–7 haftalar",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Linear_Algebra_I_Weeks_5-7_UZ.pdf",
   "size": null
  }
 ],
 "questions": [
  {
   "t": "In the row picture of the system $\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$, what does each row of the matrix represent geometrically?",
   "o": [
    "A line in the plane; the solution (2, 3) is the intersection point of the two lines",
    "A vector from the origin; the solution is their sum",
    "A point in the plane; the solution is the midpoint",
    "A parabola; the solution is the tangency point"
   ],
   "e": "Each row of Ax = b is one linear equation — a line in 2D (a plane in 3D). The row-picture solution is the common intersection point; here 2x − y = 1 and x + y = 5 meet at (2, 3).",
   "ru": {
    "t": "В строчной картине (row picture) системы $\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$ что геометрически представляет каждая строка матрицы?",
    "o": [
     "Прямую на плоскости; решение (2, 3) — точка пересечения двух прямых",
     "Вектор из начала координат; решение — их сумма",
     "Точку на плоскости; решение — середина",
     "Параболу; решение — точка касания"
    ],
    "e": "Каждая строка Ax = b — одно линейное уравнение, то есть прямая в 2D (плоскость в 3D). Решение в строчной картине — общая точка пересечения; здесь 2x − y = 1 и x + y = 5 пересекаются в (2, 3)."
   },
   "uz": {
    "t": "$\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$ sistemasining satrli tasvirida (row picture) matritsaning har bir satri geometrik nimani bildiradi?",
    "o": [
     "Tekislikdagi toʻgʻri chiziq; (2, 3) yechim — ikki chiziqning kesishish nuqtasi",
     "Bosh nuqtadan chizilgan vektor; yechim — ularning yigʻindisi",
     "Tekislikdagi nuqta; yechim — oʻrta nuqta",
     "Parabola; yechim — urinilish nuqtasi"
    ],
    "e": "Ax = b ning har bir satri bitta chiziqli tenglama — 2D da toʻgʻri chiziq (3D da tekislik). Satrli tasvirdagi yechim — umumiy kesishish nuqtasi; bu yerda 2x − y = 1 va x + y = 5 chiziqlari (2, 3) da kesishadi."
   }
  },
  {
   "t": "In the column picture, the product $A \\cdot x$ is interpreted as:",
   "o": [
    "A linear combination of the columns of A with coefficients $x_{1}$, ..., $x_{n}$",
    "A linear combination of the rows of A",
    "The dot product of the rows of A with the vector b",
    "The product of the diagonal entries of A"
   ],
   "e": "$Ax = x_{1} \\cdot a_{1} + x_{2} \\cdot a_{2}$ + ... + $x_{n} \\cdot a_{n}$: the vector b must be assembled from the columns of A. Solving Ax = b means finding the right coefficients of that combination.",
   "ru": {
    "t": "В столбцовой картине произведение $A \\cdot x$ интерпретируется как:",
    "o": [
     "Линейная комбинация столбцов A с коэффициентами $x_{1}$, ..., $x_{n}$",
     "Линейная комбинация строк A",
     "Скалярное произведение строк A на вектор b",
     "Произведение диагональных элементов A"
    ],
    "e": "$Ax = x_{1} \\cdot a_{1} + x_{2} \\cdot a_{2}$ + ... + $x_{n} \\cdot a_{n}$: вектор b собирается из столбцов A. Решить Ax = b — значит найти правильные коэффициенты этой комбинации."
   },
   "uz": {
    "t": "Ustunli tasvirda $A \\cdot x$ koʻpaytma qanday talqin etiladi?",
    "o": [
     "A ustunlarining $x_{1}$, ..., $x_{n}$ koeffitsientli chiziqli kombinatsiyasi",
     "A satrlarining chiziqli kombinatsiyasi",
     "A satrlarining b vektor bilan skalyar koʻpaytmasi",
     "A diagonal elementlarining koʻpaytmasi"
    ],
    "e": "$Ax = x_{1} \\cdot a_{1} + x_{2} \\cdot a_{2}$ + ... + $x_{n} \\cdot a_{n}$: b vektori A ustunlaridan yigʻiladi. Ax = b ni yechish — bu kombinatsiyaning toʻgʻri koeffitsientlarini topish demakdir."
   }
  },
  {
   "t": "Solve the system $\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$.",
   "o": [
    "x = 2, y = 3",
    "x = 3, y = 2",
    "x = 1, y = 5",
    "x = 2, y = −3"
   ],
   "e": "Adding the equations 2x − y = 1 and x + y = 5 gives 3x = 6, so x = 2 and y = 3. Column-picture check: $2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$.",
   "ru": {
    "t": "Решите систему $\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$.",
    "o": [
     "x = 2, y = 3",
     "x = 3, y = 2",
     "x = 1, y = 5",
     "x = 2, y = −3"
    ],
    "e": "Складывая уравнения 2x − y = 1 и x + y = 5, получаем 3x = 6, откуда x = 2 и y = 3. Проверка в столбцовой картине: $2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$."
   },
   "uz": {
    "t": "$\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$ sistemasini yeching.",
    "o": [
     "x = 2, y = 3",
     "x = 3, y = 2",
     "x = 1, y = 5",
     "x = 2, y = −3"
    ],
    "e": "2x − y = 1 va x + y = 5 tenglamalarini qoʻshsak, 3x = 6, demak x = 2 va y = 3. Ustunli tasvirda tekshirish: $2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$."
   }
  },
  {
   "t": "In the column picture of $\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$, which combination of the columns $\\begin{pmatrix}2 \\\\ 1\\end{pmatrix}$ and $\\begin{pmatrix}-1 \\\\ 1\\end{pmatrix}$ produces $\\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$?",
   "o": [
    "$2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
    "$1 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 5 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
    "$3 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 2 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
    "$5 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 1 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$"
   ],
   "e": "$2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}4 - 3 \\\\ 2 + 3\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$. The weights are exactly the components of the solution x = (2, 3).",
   "ru": {
    "t": "В столбцовой картине системы $\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$ какая комбинация столбцов $\\begin{pmatrix}2 \\\\ 1\\end{pmatrix}$ и $\\begin{pmatrix}-1 \\\\ 1\\end{pmatrix}$ даёт $\\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$?",
    "o": [
     "$2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
     "$1 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 5 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
     "$3 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 2 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
     "$5 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 1 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$"
    ],
    "e": "$2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}4 - 3 \\\\ 2 + 3\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$. Веса — это в точности компоненты решения x = (2, 3)."
   },
   "uz": {
    "t": "$\\begin{pmatrix}2 & -1 \\\\ 1 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$ sistemasining ustunli tasvirida $\\begin{pmatrix}2 \\\\ 1\\end{pmatrix}$ va $\\begin{pmatrix}-1 \\\\ 1\\end{pmatrix}$ ustunlarining qaysi kombinatsiyasi $\\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$ beradi?",
    "o": [
     "$2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
     "$1 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 5 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
     "$3 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 2 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$",
     "$5 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 1 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$"
    ],
    "e": "$2 \\cdot \\begin{pmatrix}2 \\\\ 1\\end{pmatrix} + 3 \\cdot \\begin{pmatrix}-1 \\\\ 1\\end{pmatrix} = \\begin{pmatrix}4 - 3 \\\\ 2 + 3\\end{pmatrix} = \\begin{pmatrix}1 \\\\ 5\\end{pmatrix}$. Ogʻirliklar aynan x = (2, 3) yechimining komponentalaridir."
   }
  },
  {
   "t": "During Gaussian elimination on an augmented matrix you obtain the row $\\left[\\begin{array}{cc|c}0 & 0 & c\\end{array}\\right]$ with $c \\ne 0$. What does it mean?",
   "o": [
    "The system has no solution: the row reads 0 = c, which is impossible",
    "The system has infinitely many solutions",
    "The system has a unique solution",
    "A row exchange is required"
   ],
   "e": "A row $\\left[\\begin{array}{cccc|c}0 & 0 & \\cdots & 0 & c\\end{array}\\right]$ with $c \\ne 0$ reads 0 = c — a contradiction, so the system is inconsistent. If instead c = 0, the row carries no information and there are infinitely many solutions (fewer pivots than unknowns).",
   "ru": {
    "t": "При гауссовом исключении на расширенной матрице получена строка $\\left[\\begin{array}{cc|c}0 & 0 & c\\end{array}\\right]$, где $c \\ne 0$. Что это означает?",
    "o": [
     "Система не имеет решений: строка читается как 0 = c, что невозможно",
     "Система имеет бесконечно много решений",
     "Система имеет единственное решение",
     "Требуется обмен строк"
    ],
    "e": "Строка $\\left[\\begin{array}{cccc|c}0 & 0 & \\cdots & 0 & c\\end{array}\\right]$ с $c \\ne 0$ читается как 0 = c — противоречие, система несовместна. Если же c = 0, строка информации не даёт и решений бесконечно много (опорных элементов меньше, чем неизвестных)."
   },
   "uz": {
    "t": "Kengaytirilgan matritsada gauss eliminasiyasi paytida $\\left[\\begin{array}{cc|c}0 & 0 & c\\end{array}\\right]$ satri hosil boʻldi, bunda $c \\ne 0$. Bu nimani anglatadi?",
    "o": [
     "Sistemada yechim yoʻq: satr 0 = c deb oʻqiladi, bu esa imkonsiz",
     "Sistemada cheksiz koʻp yechim bor",
     "Sistemada yagona yechim bor",
     "Satrlarni almashtirish kerak"
    ],
    "e": "$\\left[\\begin{array}{cccc|c}0 & 0 & \\cdots & 0 & c\\end{array}\\right]$ satri $c \\ne 0$ bilan 0 = c deb oʻqiladi — ziddiyat, sistema mos emas. Agar c = 0 boʻlsa, satr maʼlumot bermaydi va yechimlar cheksiz koʻp boʻladi (tayanch elementlar nomaʼlumlardan kam)."
   }
  },
  {
   "t": "Classify the system $\\begin{pmatrix}1 & 1 \\\\ 2 & 2\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}2 \\\\ c\\end{pmatrix}$ for c = 4 and c = 5.",
   "o": [
    "c = 4: infinitely many solutions (the lines coincide); c = 5: no solution (parallel lines)",
    "c = 4: no solution; c = 5: infinitely many solutions",
    "Both values give a unique solution",
    "Both values make the system inconsistent"
   ],
   "e": "$R_{2} \\leftarrow R_{2} - 2R_{1}$ produces the row $\\left[\\begin{array}{cc|c}0 & 0 & c - 4\\end{array}\\right]$. For c = 4 it reads 0 = 0 — one equation x + y = 2 remains, so infinitely many solutions $\\begin{pmatrix}2 - t \\\\ t\\end{pmatrix}$; for c = 5 it reads 0 = 1 — no solutions.",
   "ru": {
    "t": "Классифицируйте систему $\\begin{pmatrix}1 & 1 \\\\ 2 & 2\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}2 \\\\ c\\end{pmatrix}$ для c = 4 и c = 5.",
    "o": [
     "c = 4: бесконечно много решений (прямые совпадают); c = 5: решений нет (прямые параллельны)",
     "c = 4: решений нет; c = 5: бесконечно много",
     "Оба значения дают единственное решение",
     "Оба значения делают систему несовместной"
    ],
    "e": "$R_{2} \\leftarrow R_{2} - 2R_{1}$ даёт строку $\\left[\\begin{array}{cc|c}0 & 0 & c - 4\\end{array}\\right]$. При c = 4 это 0 = 0 — остаётся одно уравнение x + y = 2, решений бесконечно много: $\\begin{pmatrix}2 - t \\\\ t\\end{pmatrix}$; при c = 5 это 0 = 1 — решений нет."
   },
   "uz": {
    "t": "$\\begin{pmatrix}1 & 1 \\\\ 2 & 2\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}2 \\\\ c\\end{pmatrix}$ sistemasini c = 4 va c = 5 uchun tasniflang.",
    "o": [
     "c = 4: cheksiz koʻp yechim (chiziqlar ustma-ust tushadi); c = 5: yechim yoʻq (parallel chiziqlar)",
     "c = 4: yechim yoʻq; c = 5: cheksiz koʻp yechim",
     "Ikkala qiymat ham yagona yechim beradi",
     "Ikkala qiymat ham sistemani mos emas qiladi"
    ],
    "e": "$R_{2} \\leftarrow R_{2} - 2R_{1} \\left[\\begin{array}{cc|c}0 & 0 & c - 4\\end{array}\\right]$ satrini beradi. c = 4 da bu 0 = 0 — x + y = 2 tenglamasi qoladi, yechimlar cheksiz: $\\begin{pmatrix}2 - t \\\\ t\\end{pmatrix}$; c = 5 da 0 = 1 — yechim yoʻq."
   }
  },
  {
   "t": "Eliminate below the first pivot in the augmented matrix $\\left[\\begin{array}{cc|c}2 & 3 & 7 \\\\ 8 & 13 & 29\\end{array}\\right]$. What are the multiplier and the resulting pivots?",
   "o": [
    "$\\lambda_{21} = 4$; after $R_{2} \\leftarrow R_{2} - 4R_{1}$ the pivots are 2 and 1",
    "$\\lambda_{21} = 2$; the pivots are 2 and 3",
    "$\\lambda_{21} = 4$; the pivots are 2 and 13",
    "$\\lambda_{21} = \\frac{8}{3}$; the pivots are 3 and 1"
   ],
   "e": "The multiplier is $\\lambda_{21} = \\frac{a_{21}}{a_{11}} = \\frac{8}{2} = 4$. Then $\\left[\\begin{array}{cc|c}8 & 13 & 29\\end{array}\\right] - 4 \\cdot \\left[\\begin{array}{cc|c}2 & 3 & 7\\end{array}\\right] = \\left[\\begin{array}{cc|c}0 & 1 & 1\\end{array}\\right]$, giving pivots 2 and 1.",
   "ru": {
    "t": "Исключите под первым опорным элементом в расширенной матрице $\\left[\\begin{array}{cc|c}2 & 3 & 7 \\\\ 8 & 13 & 29\\end{array}\\right]$. Каков множитель и каковы полученные опорные элементы?",
    "o": [
     "$\\lambda_{21} = 4$; после $R_{2} \\leftarrow R_{2} - 4R_{1}$ опорные элементы равны 2 и 1",
     "$\\lambda_{21} = 2$; опорные элементы 2 и 3",
     "$\\lambda_{21} = 4$; опорные элементы 2 и 13",
     "$\\lambda_{21} = \\frac{8}{3}$; опорные элементы 3 и 1"
    ],
    "e": "Множитель равен $\\lambda_{21} = \\frac{a_{21}}{a_{11}} = \\frac{8}{2} = 4$. Затем $\\left[\\begin{array}{cc|c}8 & 13 & 29\\end{array}\\right] - 4 \\cdot \\left[\\begin{array}{cc|c}2 & 3 & 7\\end{array}\\right] = \\left[\\begin{array}{cc|c}0 & 1 & 1\\end{array}\\right]$, опорные элементы 2 и 1."
   },
   "uz": {
    "t": "$\\left[\\begin{array}{cc|c}2 & 3 & 7 \\\\ 8 & 13 & 29\\end{array}\\right]$ kengaytirilgan matritsasida birinchi tayanch ostida eliminasiya qiling. Koʻpaytuvchi va hosil boʻlgan tayanch elementlar qanday?",
    "o": [
     "$\\lambda_{21} = 4$; $R_{2} \\leftarrow R_{2} - 4R_{1}$ dan keyin tayanch elementlar 2 va 1",
     "$\\lambda_{21} = 2$; tayanch elementlar 2 va 3",
     "$\\lambda_{21} = 4$; tayanch elementlar 2 va 13",
     "$\\lambda_{21} = \\frac{8}{3}$; tayanch elementlar 3 va 1"
    ],
    "e": "Koʻpaytuvchi $\\lambda_{21} = \\frac{a_{21}}{a_{11}} = \\frac{8}{2} = 4$. Soʻngra $\\left[\\begin{array}{cc|c}8 & 13 & 29\\end{array}\\right] - 4 \\cdot \\left[\\begin{array}{cc|c}2 & 3 & 7\\end{array}\\right] = \\left[\\begin{array}{cc|c}0 & 1 & 1\\end{array}\\right]$, tayanch elementlar 2 va 1."
   }
  },
  {
   "t": "Solve the triangular system $\\begin{pmatrix}2 & 1 & -1 \\\\ 0 & 3 & 2 \\\\ 0 & 0 & 4\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y \\\\ z\\end{pmatrix} = \\begin{pmatrix}3 \\\\ 7 \\\\ 8\\end{pmatrix}$ by back substitution.",
   "o": [
    "x = 2, y = 1, z = 2",
    "x = 1, y = 2, z = 2",
    "x = 2, y = 2, z = 1",
    "x = 3, y = 1, z = 2"
   ],
   "e": "Bottom-up: 4z = 8 gives z = 2; $3y + 2 \\cdot 2 = 7$ gives y = 1; 2x + 1 − 2 = 3 gives x = 2. Check: $A \\cdot \\begin{pmatrix}2 \\\\ 1 \\\\ 2\\end{pmatrix} = \\begin{pmatrix}3 \\\\ 7 \\\\ 8\\end{pmatrix}$.",
   "ru": {
    "t": "Решите треугольную систему $\\begin{pmatrix}2 & 1 & -1 \\\\ 0 & 3 & 2 \\\\ 0 & 0 & 4\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y \\\\ z\\end{pmatrix} = \\begin{pmatrix}3 \\\\ 7 \\\\ 8\\end{pmatrix}$ обратной подстановкой.",
    "o": [
     "x = 2, y = 1, z = 2",
     "x = 1, y = 2, z = 2",
     "x = 2, y = 2, z = 1",
     "x = 3, y = 1, z = 2"
    ],
    "e": "Снизу вверх: 4z = 8 даёт z = 2; $3y + 2 \\cdot 2 = 7$ даёт y = 1; 2x + 1 − 2 = 3 даёт x = 2. Проверка: $A \\cdot \\begin{pmatrix}2 \\\\ 1 \\\\ 2\\end{pmatrix} = \\begin{pmatrix}3 \\\\ 7 \\\\ 8\\end{pmatrix}$."
   },
   "uz": {
    "t": "$\\begin{pmatrix}2 & 1 & -1 \\\\ 0 & 3 & 2 \\\\ 0 & 0 & 4\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y \\\\ z\\end{pmatrix} = \\begin{pmatrix}3 \\\\ 7 \\\\ 8\\end{pmatrix}$ uchburchak sistemasini teskari almashtirish bilan yeching.",
    "o": [
     "x = 2, y = 1, z = 2",
     "x = 1, y = 2, z = 2",
     "x = 2, y = 2, z = 1",
     "x = 3, y = 1, z = 2"
    ],
    "e": "Pastdan yuqoriga: $4z = 8 \\to z = 2$; $3y + 2 \\cdot 2 = 7 \\to y = 1$; $2x + 1 - 2 = 3 \\to x = 2$. Tekshirish: $A \\cdot \\begin{pmatrix}2 \\\\ 1 \\\\ 2\\end{pmatrix} = \\begin{pmatrix}3 \\\\ 7 \\\\ 8\\end{pmatrix}$."
   }
  },
  {
   "t": "Which $3 \\times 3$ matrix E performs the row operation $R_{3} \\leftarrow R_{3} - 4R_{1}$?",
   "o": [
    "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ -4 & 0 & 1\\end{pmatrix}$",
    "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 4 & 0 & 1\\end{pmatrix}$",
    "$E = \\begin{pmatrix}1 & 0 & -4 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$",
    "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -4 & 1\\end{pmatrix}$"
   ],
   "e": "E is the identity with −4 in position (3, 1): the third row of EA equals row 3 minus $4$·(row 1). To undo the step, add back: $E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 4 & 0 & 1\\end{pmatrix}$.",
   "ru": {
    "t": "Какая матрица E размера $3 \\times 3$ выполняет строковую операцию $R_{3} \\leftarrow R_{3} - 4R_{1}$?",
    "o": [
     "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ -4 & 0 & 1\\end{pmatrix}$",
     "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 4 & 0 & 1\\end{pmatrix}$",
     "$E = \\begin{pmatrix}1 & 0 & -4 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$",
     "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -4 & 1\\end{pmatrix}$"
    ],
    "e": "E — единичная матрица с −4 в позиции (3, 1): третья строка EA равна строке 3 минус $4$·(строка 1). Отмена шага — прибавление обратно: $E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 4 & 0 & 1\\end{pmatrix}$."
   },
   "uz": {
    "t": "Qaysi $3 \\times 3 E$ matritsa $R_{3} \\leftarrow R_{3} - 4R_{1}$ satr amalini bajaradi?",
    "o": [
     "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ -4 & 0 & 1\\end{pmatrix}$",
     "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 4 & 0 & 1\\end{pmatrix}$",
     "$E = \\begin{pmatrix}1 & 0 & -4 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$",
     "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -4 & 1\\end{pmatrix}$"
    ],
    "e": "E — (3, 1) pozitsiyasida −4 turgan birlik matritsa: EA ning uchinchi satri 3-satrdan $4 \\cdot (1$-satr) ayirilganiga teng. Qadamni bekor qilish — qayta qoʻshish: $E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 4 & 0 & 1\\end{pmatrix}$."
   }
  },
  {
   "t": "Which $3 \\times 3$ matrix $E_{32}$ performs the row operation $R_{3} \\leftarrow R_{3} + 5R_{2}$?",
   "o": [
    "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 5 & 1\\end{pmatrix}$",
    "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -5 & 1\\end{pmatrix}$",
    "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 5 \\\\ 0 & 0 & 1\\end{pmatrix}$",
    "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 5 & 0 & 1\\end{pmatrix}$"
   ],
   "e": "$E_{32}$ is the identity with 5 in position (3, 2): rows 1–2 are unchanged, and row 3 of the product equals row 3 plus $5$·(row 2). Multiplying on the left by E performs the row operation — on A and on b alike.",
   "ru": {
    "t": "Какая матрица $3 \\times 3$ выполняет операцию $R_{3} \\leftarrow R_{3} + 5R_{2}$?",
    "o": [
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 5 & 1\\end{pmatrix}$",
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -5 & 1\\end{pmatrix}$",
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 5 \\\\ 0 & 0 & 1\\end{pmatrix}$",
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 5 & 0 & 1\\end{pmatrix}$"
    ],
    "e": "$E_{32}$ — единичная матрица с 5 в позиции (3, 2): строки 1–2 не меняются, а строка 3 произведения равна строке 3 плюс $5$·(строка 2). Умножение слева на E выполняет строковую операцию — и над A, и над b."
   },
   "uz": {
    "t": "Qaysi $3 \\times 3 E_{32}$ matritsa $R_{3} \\leftarrow R_{3} + 5R_{2}$ amalini bajaradi?",
    "o": [
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 5 & 1\\end{pmatrix}$",
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -5 & 1\\end{pmatrix}$",
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 5 \\\\ 0 & 0 & 1\\end{pmatrix}$",
     "$E_{32} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 5 & 0 & 1\\end{pmatrix}$"
    ],
    "e": "$E_{32}$ — (3, 2) pozitsiyasida 5 turgan birlik matritsa: 1–2-satrlar oʻzgarmaydi, koʻpaytmaning 3-satri esa 3-satr ustiga $5 \\cdot (2$-satr) qoʻshilganiga teng. E ga chapdan koʻpaytirish satr amalini bajaradi — ham A, ham b ustida."
   }
  },
  {
   "t": "Let $E = \\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$ and $A = \\begin{pmatrix}3 & 1 \\\\ 6 & 5\\end{pmatrix}$. Compute EA and describe the operation.",
   "o": [
    "$EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 3\\end{pmatrix}$: E subtracts twice row 1 from row 2 (multiplier 2)",
    "$EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 5\\end{pmatrix}$: E subtracts row 1 from row 2",
    "$EA = \\begin{pmatrix}3 & 1 \\\\ 6 & 3\\end{pmatrix}$: E subtracts twice row 2 from row 1",
    "$EA = \\begin{pmatrix}0 & 1 \\\\ 6 & 5\\end{pmatrix}$"
   ],
   "e": "Row 1 of the product is $\\begin{pmatrix}3 & 1\\end{pmatrix}$; row 2 is $-2 \\cdot \\begin{pmatrix}3 & 1\\end{pmatrix} + \\begin{pmatrix}6 & 5\\end{pmatrix} = \\begin{pmatrix}0 & 3\\end{pmatrix}$. So $EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 3\\end{pmatrix}$ — elimination below the pivot 3 with multiplier $\\frac{6}{3} = 2$.",
   "ru": {
    "t": "Пусть $E = \\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$ и $A = \\begin{pmatrix}3 & 1 \\\\ 6 & 5\\end{pmatrix}$. Вычислите EA и опишите выполняемую операцию.",
    "o": [
     "$EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 3\\end{pmatrix}$: E вычитает удвоенную строку 1 из строки 2 (множитель 2)",
     "$EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 5\\end{pmatrix}$: E вычитает строку 1 из строки 2",
     "$EA = \\begin{pmatrix}3 & 1 \\\\ 6 & 3\\end{pmatrix}$: E вычитает удвоенную строку 2 из строки 1",
     "$EA = \\begin{pmatrix}0 & 1 \\\\ 6 & 5\\end{pmatrix}$"
    ],
    "e": "Строка 1 произведения: $\\begin{pmatrix}3 & 1\\end{pmatrix}$; строка 2: $-2 \\cdot \\begin{pmatrix}3 & 1\\end{pmatrix} + \\begin{pmatrix}6 & 5\\end{pmatrix} = \\begin{pmatrix}0 & 3\\end{pmatrix}$. Итак, $EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 3\\end{pmatrix}$ — исключение под опорным элементом 3 с множителем $\\frac{6}{3} = 2$."
   },
   "uz": {
    "t": "$E = \\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$ va $A = \\begin{pmatrix}3 & 1 \\\\ 6 & 5\\end{pmatrix}$ boʻlsin. EA ni hisoblang va bajarilayotgan amalni taʼriflang.",
    "o": [
     "$EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 3\\end{pmatrix}$: E 1-satrning ikki barobarini 2-satrdan ayiradi (koʻpaytuvchi 2)",
     "$EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 5\\end{pmatrix}$: E 1-satrni 2-satrdan ayiradi",
     "$EA = \\begin{pmatrix}3 & 1 \\\\ 6 & 3\\end{pmatrix}$: E 2-satrning ikki barobarini 1-satrdan ayiradi",
     "$EA = \\begin{pmatrix}0 & 1 \\\\ 6 & 5\\end{pmatrix}$"
    ],
    "e": "Koʻpaytmaning 1-satri: $\\begin{pmatrix}3 & 1\\end{pmatrix}$; 2-satri: $-2 \\cdot \\begin{pmatrix}3 & 1\\end{pmatrix} + \\begin{pmatrix}6 & 5\\end{pmatrix} = \\begin{pmatrix}0 & 3\\end{pmatrix}$. Demak, $EA = \\begin{pmatrix}3 & 1 \\\\ 0 & 3\\end{pmatrix}$ — 3 tayanch elementi ostida $\\frac{6}{3} = 2$ koʻpaytuvchi bilan eliminasiya."
   }
  },
  {
   "t": "Find the inverse of the elimination matrix $E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1\\end{pmatrix}$.",
   "o": [
    "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 3 & 1\\end{pmatrix}$ — add back what was subtracted",
    "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1\\end{pmatrix}$ — E is its own inverse",
    "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -\\frac{1}{3} & 1\\end{pmatrix}$",
    "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 3 \\\\ 0 & 0 & 1\\end{pmatrix}$"
   ],
   "e": "E implements $R_{3} \\leftarrow R_{3} - 3R_{2}$; the inverse operation adds $3R_{2}$ back: $E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 3 & 1\\end{pmatrix}$. Indeed $E^{-1} \\cdot E = I$ — only the sign of the multiplier changes.",
   "ru": {
    "t": "Найдите обратную матрицу для матрицы исключения $E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1\\end{pmatrix}$.",
    "o": [
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 3 & 1\\end{pmatrix}$ — прибавить обратно вычтенное",
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1\\end{pmatrix}$ — E совпадает со своей обратной",
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -\\frac{1}{3} & 1\\end{pmatrix}$",
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 3 \\\\ 0 & 0 & 1\\end{pmatrix}$"
    ],
    "e": "E реализует $R_{3} \\leftarrow R_{3} - 3R_{2}$; обратная операция прибавляет $3R_{2}$ обратно: $E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 3 & 1\\end{pmatrix}$. Верно и $E^{-1} \\cdot E = I$ — меняется только знак множителя."
   },
   "uz": {
    "t": "$E = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1\\end{pmatrix}$ eliminasiya matritsasining teskarisini toping.",
    "o": [
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 3 & 1\\end{pmatrix}$ — ayirilganni qayta qoʻshish",
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1\\end{pmatrix}$ — E oʻz teskarisiga teng",
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -\\frac{1}{3} & 1\\end{pmatrix}$",
     "$E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 3 \\\\ 0 & 0 & 1\\end{pmatrix}$"
    ],
    "e": "E amali $R_{3} \\leftarrow R_{3} - 3R_{2}$; teskarisi $3R_{2}$ ni qayta qoʻshadi: $E^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 3 & 1\\end{pmatrix}$. Haqiqatan ham $E^{-1} \\cdot E = I$ — faqat koʻpaytuvchi ishorasi oʻzgaradi."
   }
  },
  {
   "t": "Solve $\\begin{pmatrix}0 & 2 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}4 \\\\ 7\\end{pmatrix}$ using a row exchange. What are the solution and the permutation matrix?",
   "o": [
    "$x = \\frac{5}{3}$, y = 2, with $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
    "x = 2, $y = \\frac{5}{3}$, with $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
    "$x = \\frac{5}{3}$, y = 2, with $P = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$ — no exchange needed",
    "No solution: the zero pivot means the matrix is singular"
   ],
   "e": "Swap the rows: $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ gives $PA = \\begin{pmatrix}3 & 1 \\\\ 0 & 2\\end{pmatrix}$ and $Pb = \\begin{pmatrix}7 \\\\ 4\\end{pmatrix}$. Then 2y = 4 gives y = 2, and 3x + 2 = 7 gives $x = \\frac{5}{3}$. A zero pivot with a nonzero entry below it is only a temporary failure.",
   "ru": {
    "t": "Решите систему $\\begin{pmatrix}0 & 2 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}4 \\\\ 7\\end{pmatrix}$ с обменом строк. Каково решение и какова матрица перестановки?",
    "o": [
     "$x = \\frac{5}{3}$, y = 2, $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
     "x = 2, $y = \\frac{5}{3}$, $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
     "$x = \\frac{5}{3}$, y = 2, $P = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$ — обмен не нужен",
     "Решений нет: нулевой опорный элемент означает вырожденность"
    ],
    "e": "Обмен строк: $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ даёт $PA = \\begin{pmatrix}3 & 1 \\\\ 0 & 2\\end{pmatrix}$ и $Pb = \\begin{pmatrix}7 \\\\ 4\\end{pmatrix}$. Тогда 2y = 4 даёт y = 2, а 3x + 2 = 7 даёт $x = \\frac{5}{3}$. Нулевой опорный элемент с ненулевым элементом ниже — лишь временная неудача."
   },
   "uz": {
    "t": "$\\begin{pmatrix}0 & 2 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}x \\\\ y\\end{pmatrix} = \\begin{pmatrix}4 \\\\ 7\\end{pmatrix}$ sistemasini satr almashinuvi bilan yeching. Yechim va permutatsiya matritsasi qanday?",
    "o": [
     "$x = \\frac{5}{3}$, y = 2, $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
     "x = 2, $y = \\frac{5}{3}$, $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
     "$x = \\frac{5}{3}$, y = 2, $P = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$ — almashinish kerak emas",
     "Yechim yoʻq: nol tayanch matritsa singulyar degani"
    ],
    "e": "Satrlarni almashtiring: $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix} PA = \\begin{pmatrix}3 & 1 \\\\ 0 & 2\\end{pmatrix}$ va $Pb = \\begin{pmatrix}7 \\\\ 4\\end{pmatrix}$ beradi. U holda $2y = 4 \\to y = 2$, $3x + 2 = 7 \\to x = \\frac{5}{3}$. Ostida noldan farqli element turib, tayanchning nol boʻlishi — faqat vaqtinchalik muammo."
   }
  },
  {
   "t": "Which permutation matrix exchanges rows 1 and 3 of a $3 \\times 3$ matrix, and what is $P^{2}$?",
   "o": [
    "$P = \\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ and $P^{2} = I$ — a double exchange restores the order",
    "$P = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 1 & 0\\end{pmatrix}$ and $P^{2} = 0$",
    "$P = \\begin{pmatrix}0 & 1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$ and $P^{2} = I$",
    "$P = \\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ and $P^{2} = P$"
   ],
   "e": "$P_{13}$ is the identity with rows 1 and 3 swapped. Exchanging rows 1 and 3 twice returns the original matrix, so $P^{2} = I$ and $P^{-1} = P$ — consistent with $P^{-1} = P^{T}$.",
   "ru": {
    "t": "Какая матрица перестановки обменивает строки 1 и 3 матрицы $3 \\times 3$ и чему равна $P^{2}$?",
    "o": [
     "$P = \\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ и $P^{2} = I$ — двойной обмен возвращает порядок",
     "$P = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 1 & 0\\end{pmatrix}$ и $P^{2} = 0$",
     "$P = \\begin{pmatrix}0 & 1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$ и $P^{2} = I$",
     "$P = \\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ и $P^{2} = P$"
    ],
    "e": "$P_{13}$ — единичная матрица с обменянными строками 1 и 3. Двойной обмен строк 1 и 3 возвращает исходную матрицу, поэтому $P^{2} = I$ и $P^{-1} = P$ — согласуется с $P^{-1} = P^{T}$."
   },
   "uz": {
    "t": "Qaysi permutatsiya matritsa $3 \\times 3$ matritsaning 1- va 3-satrlarini almashtiradi va $P^{2}$ nimaga teng?",
    "o": [
     "$P = \\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ va $P^{2} = I$ — ikki karra almashinish tartibni tiklaydi",
     "$P = \\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 1 & 0\\end{pmatrix}$ va $P^{2} = 0$",
     "$P = \\begin{pmatrix}0 & 1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$ va $P^{2} = I$",
     "$P = \\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ va $P^{2} = P$"
    ],
    "e": "$P_{13}$ — 1- va 3-satrlari almashtirilgan birlik matritsa. 1- va 3-satrlarni ikki marta almashtirish asl matritsani qaytaradi, shuning uchun $P^{2} = I$ va $P^{-1} = P$ — bu $P^{-1} = P^{T}$ ga mos."
   }
  },
  {
   "t": "Let $E = \\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$ (elimination) and $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ (exchange). What can be said about EP and PE?",
   "o": [
    "$EP \\ne PE$: row operations generally do not commute $(EP = \\begin{pmatrix}0 & 1 \\\\ 1 & -2\\end{pmatrix}, PE = \\begin{pmatrix}-2 & 1 \\\\ 1 & 0\\end{pmatrix})$",
    "EP = PE: both equal $\\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
    "EP = PE: both equal $\\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$",
    "PE is not defined for these matrices"
   ],
   "e": "Computing: $EP = \\begin{pmatrix}0 & 1 \\\\ 1 & -2\\end{pmatrix}$, while $PE = \\begin{pmatrix}-2 & 1 \\\\ 1 & 0\\end{pmatrix}$. The products differ — 'eliminate then exchange' and 'exchange then eliminate' give different matrices, so row operations do not commute.",
   "ru": {
    "t": "Пусть $E = \\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$ (исключение) и $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ (обмен). Что можно сказать о EP и PE?",
    "o": [
     "$EP \\ne PE$: строковые операции, вообще говоря, не коммутируют $(EP = \\begin{pmatrix}0 & 1 \\\\ 1 & -2\\end{pmatrix}, PE = \\begin{pmatrix}-2 & 1 \\\\ 1 & 0\\end{pmatrix})$",
     "EP = PE: оба равны $\\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$",
     "EP = PE: оба равны $\\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$",
     "PE для этих матриц не определено"
    ],
    "e": "Вычисление: $EP = \\begin{pmatrix}0 & 1 \\\\ 1 & -2\\end{pmatrix}$, тогда как $PE = \\begin{pmatrix}-2 & 1 \\\\ 1 & 0\\end{pmatrix}$. Произведения различны: «сначала исключение, потом обмен» и «сначала обмен, потом исключение» дают разные матрицы — строковые операции не коммутируют."
   },
   "uz": {
    "t": "$E = \\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$ (eliminasiya) va $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ (almashinish) boʻlsin. EP va PE haqida nima deyish mumkin?",
    "o": [
     "$EP \\ne PE$: satr amallari umuman kommutativ emas $(EP = \\begin{pmatrix}0 & 1 \\\\ 1 & -2\\end{pmatrix}, PE = \\begin{pmatrix}-2 & 1 \\\\ 1 & 0\\end{pmatrix})$",
     "EP = PE: ikkalasi ham $\\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ ga teng",
     "EP = PE: ikkalasi ham $\\begin{pmatrix}1 & 0 \\\\ -2 & 1\\end{pmatrix}$ ga teng",
     "Bu matritsalar uchun PE aniqlanmagan"
    ],
    "e": "Hisoblash: $EP = \\begin{pmatrix}0 & 1 \\\\ 1 & -2\\end{pmatrix}$, $PE = \\begin{pmatrix}-2 & 1 \\\\ 1 & 0\\end{pmatrix}$. Koʻpaytmalar farq qiladi: «avval eliminasiya, keyin almashinish» va «avval almashinish, keyin eliminasiya» har xil matritsalar beradi — satr amallari kommutativ emas."
   }
  },
  {
   "t": "For $A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$, classify the systems $Ax = \\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$ and $Ax = \\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$.",
   "o": [
    "$\\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$: infinitely many solutions; $\\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$: no solutions",
    "$\\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$: no solutions; $\\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$: infinitely many solutions",
    "Both have unique solutions",
    "Both have infinitely many solutions"
   ],
   "e": "Row $2 = 2$·(row 1). For $b = \\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$ the same relation holds $(6 = 2 \\cdot 3)$, leaving one equation x + 2y = 3 — infinitely many solutions. For $b = \\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$ the elimination gives 0 = 1 — no solutions. The matrix has rank 1 and no inverse.",
   "ru": {
    "t": "Для $A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$ классифицируйте системы $Ax = \\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$ и $Ax = \\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$.",
    "o": [
     "$\\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$: бесконечно много решений; $\\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$: решений нет",
     "$\\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$: решений нет; $\\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$: бесконечно много",
     "Обе имеют единственное решение",
     "Обе имеют бесконечно много решений"
    ],
    "e": "Строка $2 = 2$·(строка 1). Для $b = \\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$ то же соотношение выполнено $(6 = 2 \\cdot 3)$, остаётся одно уравнение x + 2y = 3 — решений бесконечно много. Для $b = \\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$ исключение даёт 0 = 1 — решений нет. Ранг матрицы равен 1, обратной нет."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$ uchun $Ax = \\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$ va $Ax = \\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$ sistemalarini tasniflang.",
    "o": [
     "$\\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$: cheksiz koʻp yechim; $\\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$: yechim yoʻq",
     "$\\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$: yechim yoʻq; $\\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$: cheksiz koʻp yechim",
     "Ikkalasida ham yagona yechim bor",
     "Ikkalasida ham cheksiz koʻp yechim bor"
    ],
    "e": "2-satr = $2 \\cdot (1$-satr). $b = \\begin{pmatrix}3 \\\\ 6\\end{pmatrix}$ uchun xuddi shu munosabat bajariladi $(6 = 2 \\cdot 3)$, bitta x + 2y = 3 tenglamasi qoladi — cheksiz koʻp yechim. $b = \\begin{pmatrix}3 \\\\ 7\\end{pmatrix}$ uchun eliminasiya 0 = 1 beradi — yechim yoʻq. Matritsa rangi 1, teskarisi yoʻq."
   }
  },
  {
   "t": "For $A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$, which right-hand sides $b = \\begin{pmatrix}b_{1} \\\\ b_{2}\\end{pmatrix}$ allow the system Ax = b to be solved?",
   "o": [
    "Exactly those with $b_{2} = 2b_{1}$: b must lie on the line through the columns of A",
    "All b in $\\mathbb{R}^{2}$",
    "Only $b = \\begin{pmatrix}0 \\\\ 0\\end{pmatrix}$",
    "Exactly those with $b_{1} = 2b_{2}$"
   ],
   "e": "The columns are $\\begin{pmatrix}1 \\\\ 2\\end{pmatrix}$ and $\\begin{pmatrix}2 \\\\ 4\\end{pmatrix} = 2 \\cdot \\begin{pmatrix}1 \\\\ 2\\end{pmatrix}$, so every combination $x \\cdot \\begin{pmatrix}1 \\\\ 2\\end{pmatrix} + y \\cdot \\begin{pmatrix}2 \\\\ 4\\end{pmatrix}$ lies on the line $b_{2} = 2b_{1}$. Consistency requires exactly $b_{2} = 2b_{1} (e.g. \\begin{pmatrix}4 \\\\ 8\\end{pmatrix}$ works, $\\begin{pmatrix}4 \\\\ 9\\end{pmatrix}$ does not).",
   "ru": {
    "t": "Для $A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$ какие правые части $b = \\begin{pmatrix}b_{1} \\\\ b_{2}\\end{pmatrix}$ допускают решение системы Ax = b?",
    "o": [
     "Ровно те, для которых $b_{2} = 2b_{1}$: b должен лежать на прямой через столбцы A",
     "Все b из $\\mathbb{R}^{2}$",
     "Только $b = \\begin{pmatrix}0 \\\\ 0\\end{pmatrix}$",
     "Ровно те, для которых $b_{1} = 2b_{2}$"
    ],
    "e": "Столбцы $\\begin{pmatrix}1 \\\\ 2\\end{pmatrix}$ и $\\begin{pmatrix}2 \\\\ 4\\end{pmatrix} = 2 \\cdot \\begin{pmatrix}1 \\\\ 2\\end{pmatrix}$ пропорциональны, поэтому любая комбинация $x \\cdot \\begin{pmatrix}1 \\\\ 2\\end{pmatrix} + y \\cdot \\begin{pmatrix}2 \\\\ 4\\end{pmatrix}$ лежит на прямой $b_{2} = 2b_{1}$. Совместность требует ровно $b_{2} = 2b_{1}$ (например, $\\begin{pmatrix}4 \\\\ 8\\end{pmatrix}$ решается, $\\begin{pmatrix}4 \\\\ 9\\end{pmatrix}$ — нет)."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$ uchun qaysi $b = \\begin{pmatrix}b_{1} \\\\ b_{2}\\end{pmatrix}$ oʻng tomonlar Ax = b sistemasini yechishga imkon beradi?",
    "o": [
     "Aynan $b_{2} = 2b_{1}$ bajarilganlari: b, A ustunlari orqali oʻtuvchi toʻgʻri chiziqda yotishi kerak",
     "$\\mathbb{R}^{2}$ dagi barcha b",
     "Faqat $b = \\begin{pmatrix}0 \\\\ 0\\end{pmatrix}$",
     "Aynan $b_{1} = 2b_{2}$ bajarilganlari"
    ],
    "e": "$\\begin{pmatrix}1 \\\\ 2\\end{pmatrix}$ va $\\begin{pmatrix}2 \\\\ 4\\end{pmatrix} = 2 \\cdot \\begin{pmatrix}1 \\\\ 2\\end{pmatrix}$ ustunlari proporsional, shuning uchun har qanday $x \\cdot \\begin{pmatrix}1 \\\\ 2\\end{pmatrix} + y \\cdot \\begin{pmatrix}2 \\\\ 4\\end{pmatrix}$ kombinatsiyasi $b_{2} = 2b_{1}$ toʻgʻri chizigʻida yotadi. Moslik aynan $b_{2} = 2b_{1}$ ni talab qiladi (masalan, $\\begin{pmatrix}4 \\\\ 8\\end{pmatrix}$ yechiladi, $\\begin{pmatrix}4 \\\\ 9\\end{pmatrix}$ — yoʻq)."
   }
  },
  {
   "t": "For a square $n \\times n$ matrix A, having n pivots after elimination is equivalent to:",
   "o": [
    "A being invertible: Ax = b has exactly one solution for every b",
    "A having rank 1",
    "Ax = 0 having nonzero solutions",
    "A being symmetric"
   ],
   "e": "n pivots mean the columns are independent, so Ax = 0 has only x = 0 and Ax = b is uniquely solvable for every b — the matrix is invertible. The number of pivots found by elimination is the rank.",
   "ru": {
    "t": "Для квадратной матрицы A размера $n \\times n$ наличие n опорных элементов после исключения равносильно тому, что:",
    "o": [
     "A обратима: Ax = b имеет ровно одно решение для каждого b",
     "ранг A равен 1",
     "Ax = 0 имеет ненулевые решения",
     "A симметрична"
    ],
    "e": "n опорных элементов означают независимость столбцов: Ax = 0 имеет только решение x = 0, а Ax = b однозначно разрешима при каждом b — матрица обратима. Число опорных элементов, найденных исключением, — это ранг."
   },
   "uz": {
    "t": "$n \\times n$ kvadrat matritsa A uchun eliminasiyadan keyin n ta tayanch elementga ega boʻlish nimga ekvivalent?",
    "o": [
     "A teskari matritsa: har bir b uchun Ax = b da aynan bitta yechim bor",
     "A ning rangi 1",
     "Ax = 0 noldan farqli yechimga ega",
     "A simmetrik"
    ],
    "e": "n ta tayanch ustunlar chiziqli mustaqil ekanini bildiradi: Ax = 0 faqat x = 0 yechimiga ega va har bir b uchun Ax = b yagona yechimga ega — matritsa teskari. Eliminatsiya bilan topilgan tayanch elementlar soni — rang."
   }
  },
  {
   "t": "Gaussian elimination stops at an upper triangular U and finishes with back substitution. What does the Gauss–Jordan method do instead?",
   "o": [
    "It continues on $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ up to the reduced form $[I | A^{-1}$]",
    "It stops earlier, at the first pivot",
    "It swaps all rows of A before eliminating",
    "It computes the transpose instead of the inverse"
   ],
   "e": "Gauss–Jordan keeps eliminating above the pivots too, reducing the left block of $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ to the identity; the right block then holds $A^{-1}$. Gaussian elimination itself stops at U plus back substitution.",
   "ru": {
    "t": "Гауссово исключение останавливается на верхней треугольной U и завершается обратной подстановкой. Что вместо этого делает метод Гаусса–Жордана?",
    "o": [
     "Он продолжает работу над $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ до приведённого вида $[I | A^{-1}$]",
     "Он останавливается раньше — на первом опорном элементе",
     "Он меняет местами все строки A перед исключением",
     "Он вычисляет транспонирование вместо обратной"
    ],
    "e": "Гаусс–Жордан исключает и над опорными элементами, приводя левый блок $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ к единичной матрице; тогда в правом блоке стоит $A^{-1}$. Само гауссово исключение останавливается на U плюс обратная подстановка."
   },
   "uz": {
    "t": "Gauss eliminasiyasi yuqori uchburchak U da toʻxtaydi va teskari almashtirish bilan tugaydi. Gauss–Jordan usuli buning oʻrniga nima qiladi?",
    "o": [
     "$U \\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ ustida ishlashni $[I | A^{-1}$] koʻrinishigacha davom ettiradi",
     "U birinchi tayanchda, undan ham oldinroq toʻxtaydi",
     "Eliminasiyadan oldin A ning barcha satrlarini almashtiradi",
     "Teskarining oʻrniga transpozitsiyani hisoblaydi"
    ],
    "e": "Gauss–Jordan tayanch elementlar ustida ham eliminasiya qilib, $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ ning chap blokini birlik matritsaga keltiradi; oʻng blokda esa $A^{-1}$ turadi. Gauss eliminasiyaning oʻzi esa U da teskari almashtirish bilan toʻxtaydi."
   }
  },
  {
   "t": "Which of the four ways to compute the product AB is the COLUMN interpretation?",
   "o": [
    "$AB = \\begin{pmatrix}Ab_{1} & \\cdots & Ab_p\\end{pmatrix}$: column j of AB is A times column j of B",
    "Each row of AB is a combination of the rows of B",
    "$(AB)_{ij}$ is the dot product of row i of A with column j of B, entry by entry",
    "AB is the sum over k of (column k of A)$\\cdot$(row k of B) — outer products"
   ],
   "e": "Column view: multiplying A by the j-th column of B produces the j-th column of AB, so $AB = \\begin{pmatrix}Ab_{1} & \\cdots & Ab_p\\end{pmatrix}$. The other options are the row view, the entry view and the outer-product view — all four give the same AB.",
   "ru": {
    "t": "Какой из четырёх способов вычисления произведения AB соответствует СТОЛБЦОВОЙ интерпретации?",
    "o": [
     "$AB = \\begin{pmatrix}Ab_{1} & \\cdots & Ab_p\\end{pmatrix}$: столбец j матрицы AB равен A, умноженной на столбец j матрицы B",
     "Каждая строка AB есть комбинация строк B",
     "$(AB)_{ij}$ — скалярное произведение строки i матрицы A и столбца j матрицы B, поэлементно",
     "AB — сумма по k произведений (столбец k матрицы A)$\\cdot$(строка k матрицы B) — внешние произведения"
    ],
    "e": "Столбцовый взгляд: умножение A на j-й столбец B даёт j-й столбец AB, то есть $AB = \\begin{pmatrix}Ab_{1} & \\cdots & Ab_p\\end{pmatrix}$. Остальные варианты — строчный, поэлементный взгляды и взгляд через внешние произведения; все четыре дают одно AB."
   },
   "uz": {
    "t": "AB koʻpaytmasini hisoblashning toʻrt usulidan qaysi biri USTUNLI talqinga mos keladi?",
    "o": [
     "$AB = \\begin{pmatrix}Ab_{1} & \\cdots & Ab_p\\end{pmatrix}$: AB ning j-ustuni — A ning B ning j-ustuniga koʻpaytmasi",
     "AB ning har bir satri — B satrlarining kombinatsiyasi",
     "$(AB)_{ij}$ — A ning i-satri bilan B ning j-ustunining skalyar koʻpaytmasi, elementma-element",
     "AB — k boʻyicha (A ning k-ustuni)·$(B$ ning k-satri) yigʻindisi — tashqi koʻpaytmalar"
    ],
    "e": "Ustunli qarash: A ni B ning j-ustuniga koʻpaytirish AB ning j-ustunini beradi, yaʼni $AB = \\begin{pmatrix}Ab_{1} & \\cdots & Ab_p\\end{pmatrix}$. Qolgan variantlar — satrli, elementli va tashqi koʻpaytma qarashlari; toʻrttasi bir xil AB beradi."
   }
  },
  {
   "t": "Compute the product $\\begin{pmatrix}1 & 2 & 0 \\\\ -1 & 3 & 4\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 1 \\\\ 0 & -1 \\\\ 3 & 2\\end{pmatrix}$.",
   "o": [
    "$\\begin{pmatrix}2 & -1 \\\\ 10 & 4\\end{pmatrix}$",
    "$\\begin{pmatrix}2 & 1 \\\\ 10 & 4\\end{pmatrix}$",
    "$\\begin{pmatrix}2 & -1 \\\\ 10 & -4\\end{pmatrix}$",
    "$\\begin{pmatrix}-2 & -1 \\\\ 10 & 4\\end{pmatrix}$"
   ],
   "e": "Entry (i, j) is row i of the first matrix times column j of the second: $(1,1) = 1 \\cdot 2 + 2 \\cdot 0 + 0 \\cdot 3 = 2$; $(1,2) = 1 \\cdot 1 + 2 \\cdot (-1) + 0 \\cdot 2 = -1$; $(2,1) = -1 \\cdot 2 + 3 \\cdot 0 + 4 \\cdot 3 = 10$; (2,2) = −1 − 3 + 8 = 4.",
   "ru": {
    "t": "Вычислите произведение $\\begin{pmatrix}1 & 2 & 0 \\\\ -1 & 3 & 4\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 1 \\\\ 0 & -1 \\\\ 3 & 2\\end{pmatrix}$.",
    "o": [
     "$\\begin{pmatrix}2 & -1 \\\\ 10 & 4\\end{pmatrix}$",
     "$\\begin{pmatrix}2 & 1 \\\\ 10 & 4\\end{pmatrix}$",
     "$\\begin{pmatrix}2 & -1 \\\\ 10 & -4\\end{pmatrix}$",
     "$\\begin{pmatrix}-2 & -1 \\\\ 10 & 4\\end{pmatrix}$"
    ],
    "e": "Элемент (i, j) — строка i первой матрицы на столбец j второй: $(1,1) = 1 \\cdot 2 + 2 \\cdot 0 + 0 \\cdot 3 = 2$; $(1,2) = 1 \\cdot 1 + 2 \\cdot (-1) + 0 \\cdot 2 = -1$; $(2,1) = -1 \\cdot 2 + 3 \\cdot 0 + 4 \\cdot 3 = 10$; (2,2) = −1 − 3 + 8 = 4."
   },
   "uz": {
    "t": "$\\begin{pmatrix}1 & 2 & 0 \\\\ -1 & 3 & 4\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 1 \\\\ 0 & -1 \\\\ 3 & 2\\end{pmatrix}$ koʻpaytmasini hisoblang.",
    "o": [
     "$\\begin{pmatrix}2 & -1 \\\\ 10 & 4\\end{pmatrix}$",
     "$\\begin{pmatrix}2 & 1 \\\\ 10 & 4\\end{pmatrix}$",
     "$\\begin{pmatrix}2 & -1 \\\\ 10 & -4\\end{pmatrix}$",
     "$\\begin{pmatrix}-2 & -1 \\\\ 10 & 4\\end{pmatrix}$"
    ],
    "e": "(i, j) elementi — birinchi matritsaning i-satri bilan ikkinchisining j-ustunining koʻpaytmasi: $(1,1) = 1 \\cdot 2 + 2 \\cdot 0 + 0 \\cdot 3 = 2$; $(1,2) = 1 \\cdot 1 + 2 \\cdot (-1) + 0 \\cdot 2 = -1$; $(2,1) = -1 \\cdot 2 + 3 \\cdot 0 + 4 \\cdot 3 = 10$; (2,2) = −1 − 3 + 8 = 4."
   }
  },
  {
   "t": "For $A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$ and $B = \\begin{pmatrix}1 & 0 \\\\ 1 & 1\\end{pmatrix}$, compute AB and BA.",
   "o": [
    "$AB = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$, $BA = \\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$ — the two products are different",
    "$AB = BA = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$",
    "$AB = \\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$, $BA = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$",
    "$AB = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$, $BA = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$"
   ],
   "e": "AB combines the columns of A: $[A \\cdot (1; 1)$, $A \\cdot (0; 1)$] = $\\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$. BA combines the rows of A and gives $\\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$. In general $AB \\ne BA$ — matrix multiplication is not commutative (horizontal and vertical shears depend on the order).",
   "ru": {
    "t": "Для $A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$ и $B = \\begin{pmatrix}1 & 0 \\\\ 1 & 1\\end{pmatrix}$ вычислите AB и BA.",
    "o": [
     "$AB = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$, $BA = \\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$ — произведения различны",
     "$AB = BA = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$",
     "$AB = \\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$, $BA = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$",
     "$AB = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$, $BA = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$"
    ],
    "e": "AB комбинирует столбцы A: $[A \\cdot (1; 1)$, $A \\cdot (0; 1)$] = $\\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$. BA комбинирует строки A и даёт $\\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$. Вообще говоря, $AB \\ne BA$ — умножение матриц некоммутативно (горизонтальный и вертикальный сдвиги зависят от порядка)."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$ va $B = \\begin{pmatrix}1 & 0 \\\\ 1 & 1\\end{pmatrix}$ uchun AB va BA ni hisoblang.",
    "o": [
     "$AB = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$, $BA = \\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$ — ikki koʻpaytma farqli",
     "$AB = BA = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$",
     "$AB = \\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$, $BA = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$",
     "$AB = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$, $BA = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$"
    ],
    "e": "AB A ning ustunlarini aralashtiradi: $[A \\cdot (1; 1)$, $A \\cdot (0; 1)$] = $\\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$. BA A satrlarini aralashtirib $\\begin{pmatrix}1 & 1 \\\\ 1 & 2\\end{pmatrix}$ beradi. Umuman $AB \\ne BA$ — matritsalar koʻpaytmasi kommutativ emas (gorizontal va vertikal siljishlar tartibga bogʻliq)."
   }
  },
  {
   "t": "Which statement about matrix algebra is TRUE (whenever the sums and products are defined)?",
   "o": [
    "(AB)C = A(BC) and A(B + C) = AB + AC — associativity and distributivity always hold",
    "AB = BA for all square matrices A and B",
    "$(A + B)^{2} = A^{2} + 2AB + B^{2}$ for all A and B",
    "$(AB)^{2} = A^{2} \\cdot B^{2}$ for all invertible A and B"
   ],
   "e": "Matrix multiplication is associative and distributive over addition. It is NOT commutative: expanding $(A + B)^{2}$ gives $A^{2} + AB + BA + B^{2}$, which differs from $A^{2} + 2AB + B^{2}$ unless AB = BA, and $(AB)^{2}$ = ABAB ≠$A^2B^{2}$.",
   "ru": {
    "t": "Какое утверждение о матричной алгебре ВЕРНО (когда суммы и произведения определены)?",
    "o": [
     "(AB)C = A(BC) и A(B + C) = AB + AC — ассоциативность и дистрибутивность выполняются всегда",
     "AB = BA для всех квадратных матриц A и B",
     "$(A + B)^{2} = A^{2} + 2AB + B^{2}$ для всех A и B",
     "$(AB)^{2} = A^{2} \\cdot B^{2}$ для всех обратимых A и B"
    ],
    "e": "Матричное умножение ассоциативно и дистрибутивно относительно сложения. Оно НЕ коммутативно: раскрытие $(A + B)^{2}$ даёт $A^{2} + AB + BA + B^{2}$, что отличается от $A^{2} + 2AB + B^{2}$, если только AB = BA, и $(AB)^{2}$ = ABAB ≠$A^2B^{2}$."
   },
   "uz": {
    "t": "Matritsalar algebrasi haqida qaysi gap TOʻGʻRI (yigʻindilar va koʻpaytmalar aniqlangan sharoitda)?",
    "o": [
     "(AB)C = A(BC) va A(B + C) = AB + AC — assotsiativlik va distributivlik doim oʻrinli",
     "Barcha kvadrat A va B uchun AB = BA",
     "Barcha A va B uchun $(A + B)^{2} = A^{2} + 2AB + B^{2}$",
     "Barcha teskari A va B uchun $(AB)^{2} = A^{2} \\cdot B^{2}$"
    ],
    "e": "Matritsalar koʻpaytmasi assotsiativ va qoʻshish boʻyicha distributiv. U kommutativ EMAS: $(A + B)^{2}$ ni ochganda $A^{2} + AB + BA + B^{2}$ chiqadi, bu AB = BA boʻlmaganda $A^{2} + 2AB + B^{2}$ dan farq qiladi, hamda $(AB)^{2}$ = ABAB ≠$A^2B^{2}$."
   }
  },
  {
   "t": "For arbitrary square matrices A and B, $(A + B)^{2}$ equals:",
   "o": [
    "$A^{2} + AB + BA + B^{2}$",
    "$A^{2} + 2AB + B^{2}$",
    "$A^{2} + B^{2}$",
    "$A^{2} + AB + B^{2}$"
   ],
   "e": "$(A + B)(A + B) = A^{2} + AB + BA + B^{2}$. The middle terms cannot merge into 2AB unless AB = BA; e.g. for $A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$, $B = \\begin{pmatrix}1 & 0 \\\\ 1 & 1\\end{pmatrix}$ one gets $AB + BA = \\begin{pmatrix}3 & 2 \\\\ 2 & 3\\end{pmatrix}$ while $2AB = \\begin{pmatrix}4 & 2 \\\\ 2 & 2\\end{pmatrix}$.",
   "ru": {
    "t": "Для произвольных квадратных матриц A и B выражение $(A + B)^{2}$ равно:",
    "o": [
     "$A^{2} + AB + BA + B^{2}$",
     "$A^{2} + 2AB + B^{2}$",
     "$A^{2} + B^{2}$",
     "$A^{2} + AB + B^{2}$"
    ],
    "e": "$(A + B)(A + B) = A^{2} + AB + BA + B^{2}$. Средние слагаемые нельзя объединить в 2AB, если только AB = BA; например, при $A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$, $B = \\begin{pmatrix}1 & 0 \\\\ 1 & 1\\end{pmatrix}$ имеем $AB + BA = \\begin{pmatrix}3 & 2 \\\\ 2 & 3\\end{pmatrix}$, тогда как $2AB = \\begin{pmatrix}4 & 2 \\\\ 2 & 2\\end{pmatrix}$."
   },
   "uz": {
    "t": "Ixtiyoriy kvadrat A va B matritsalar uchun $(A + B)^{2}$ nimaga teng?",
    "o": [
     "$A^{2} + AB + BA + B^{2}$",
     "$A^{2} + 2AB + B^{2}$",
     "$A^{2} + B^{2}$",
     "$A^{2} + AB + B^{2}$"
    ],
    "e": "$(A + B)(A + B) = A^{2} + AB + BA + B^{2}$. AB = BA boʻlmasa, oʻrta hadlarni 2AB ga birlashtirib boʻlmaydi; masalan, $A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$, $B = \\begin{pmatrix}1 & 0 \\\\ 1 & 1\\end{pmatrix}$ uchun $AB + BA = \\begin{pmatrix}3 & 2 \\\\ 2 & 3\\end{pmatrix}$, 2AB esa $\\begin{pmatrix}4 & 2 \\\\ 2 & 2\\end{pmatrix}$."
   }
  },
  {
   "t": "If A and B are invertible $n \\times n$ matrices, then $(AB)^{-1}$ equals:",
   "o": [
    "$B^{-1}A^{-1}$ — the order of the factors reverses",
    "$A^{-1}B^{-1}$ — the order stays the same",
    "$(A^{-1})^{T}(B^{-1})^{T}$",
    "The product AB is not invertible in general"
   ],
   "e": "Check by multiplying: $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1}$ = AIA$^{-1} = I$. The order must reverse; $A^{-1}B^{-1}$ equals $(BA)^{-1}$ instead.",
   "ru": {
    "t": "Если A и B — обратимые $n \\times n$ матрицы, то $(AB)^{-1}$ равно:",
    "o": [
     "$B^{-1}A^{-1}$ — порядок множителей меняется на противоположный",
     "$A^{-1}B^{-1}$ — порядок сохраняется",
     "$(A^{-1})^{T}(B^{-1})^{T}$",
     "Произведение AB в общем случае необратимо"
    ],
    "e": "Проверка умножением: $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1}$ = AIA$^{-1} = I$. Порядок обязан быть обратным; $A^{-1}B^{-1}$ — это $(BA)^{-1}$."
   },
   "uz": {
    "t": "Agar A va B teskari $n \\times n$ matritsalar boʻlsa, $(AB)^{-1}$ nimaga teng?",
    "o": [
     "$B^{-1}A^{-1}$ — koʻpaytuvchilar tartibi teskari boʻladi",
     "$A^{-1}B^{-1}$ — tartib saqlanadi",
     "$(A^{-1})^{T}(B^{-1})^{T}$",
     "AB koʻpaytmasi umuman teskari boʻlmaydi"
    ],
    "e": "Koʻpaytirib tekshiramiz: $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1}$ = AIA$^{-1} = I$. Tartib albatta teskari boʻlishi kerak; $A^{-1}B^{-1}$ esa $(BA)^{-1}$ ga teng."
   }
  },
  {
   "t": "Find the inverse of $A = \\begin{pmatrix}2 & 1 \\\\ 5 & 3\\end{pmatrix}$.",
   "o": [
    "$\\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix}$",
    "$\\begin{pmatrix}2 & -1 \\\\ -5 & 3\\end{pmatrix}$",
    "$\\begin{pmatrix}3 & -5 \\\\ -1 & 2\\end{pmatrix}$",
    "$\\begin{pmatrix}-3 & 1 \\\\ 5 & -2\\end{pmatrix}$"
   ],
   "e": "$det A = 2 \\cdot 3 - 1 \\cdot 5 = 1$, so $A^{-1} = (\\frac{1}{det}) \\cdot \\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix} = \\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix}$. Check: $\\begin{pmatrix}2 & 1 \\\\ 5 & 3\\end{pmatrix} \\cdot \\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$.",
   "ru": {
    "t": "Найдите обратную матрицу для $A = \\begin{pmatrix}2 & 1 \\\\ 5 & 3\\end{pmatrix}$.",
    "o": [
     "$\\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix}$",
     "$\\begin{pmatrix}2 & -1 \\\\ -5 & 3\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -5 \\\\ -1 & 2\\end{pmatrix}$",
     "$\\begin{pmatrix}-3 & 1 \\\\ 5 & -2\\end{pmatrix}$"
    ],
    "e": "$det A = 2 \\cdot 3 - 1 \\cdot 5 = 1$, поэтому $A^{-1} = (\\frac{1}{det}) \\cdot \\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix} = \\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix}$. Проверка: $\\begin{pmatrix}2 & 1 \\\\ 5 & 3\\end{pmatrix} \\cdot \\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}2 & 1 \\\\ 5 & 3\\end{pmatrix}$ matritsaning teskarisini toping.",
    "o": [
     "$\\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix}$",
     "$\\begin{pmatrix}2 & -1 \\\\ -5 & 3\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -5 \\\\ -1 & 2\\end{pmatrix}$",
     "$\\begin{pmatrix}-3 & 1 \\\\ 5 & -2\\end{pmatrix}$"
    ],
    "e": "$det A = 2 \\cdot 3 - 1 \\cdot 5 = 1$, shuning uchun $A^{-1} = (\\frac{1}{det}) \\cdot \\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix} = \\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix}$. Tekshirish: $\\begin{pmatrix}2 & 1 \\\\ 5 & 3\\end{pmatrix} \\cdot \\begin{pmatrix}3 & -1 \\\\ -5 & 2\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$."
   }
  },
  {
   "t": "Find the inverse of $A = \\begin{pmatrix}2 & 1 \\\\ 2 & 3\\end{pmatrix}$.",
   "o": [
    "$(\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$, that is $\\begin{pmatrix}\\frac{3}{4} & -\\frac{1}{4} \\\\ -\\frac{1}{2} & \\frac{1}{2}\\end{pmatrix}$",
    "$\\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$",
    "$(\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -2 \\\\ -1 & 2\\end{pmatrix}$",
    "$(\\frac{1}{6}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$"
   ],
   "e": "$det A = 2 \\cdot 3 - 1 \\cdot 2 = 4$. The formula gives $A^{-1} = (1/$(ad − bc))·$\\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix} = (\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$. Forgetting the factor $\\frac{1}{det}$ is the classic mistake (it would leave $\\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$).",
   "ru": {
    "t": "Найдите обратную матрицу для $A = \\begin{pmatrix}2 & 1 \\\\ 2 & 3\\end{pmatrix}$.",
    "o": [
     "$(\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$, то есть $\\begin{pmatrix}\\frac{3}{4} & -\\frac{1}{4} \\\\ -\\frac{1}{2} & \\frac{1}{2}\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$",
     "$(\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -2 \\\\ -1 & 2\\end{pmatrix}$",
     "$(\\frac{1}{6}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$"
    ],
    "e": "$det A = 2 \\cdot 3 - 1 \\cdot 2 = 4$. По формуле $A^{-1} = (1/$(ad − bc))·$\\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix} = (\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$. Классическая ошибка — забыть множитель $\\frac{1}{det}$ (останется $\\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$)."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}2 & 1 \\\\ 2 & 3\\end{pmatrix}$ matritsaning teskarisini toping.",
    "o": [
     "$(\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$, yaʼni $\\begin{pmatrix}\\frac{3}{4} & -\\frac{1}{4} \\\\ -\\frac{1}{2} & \\frac{1}{2}\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$",
     "$(\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -2 \\\\ -1 & 2\\end{pmatrix}$",
     "$(\\frac{1}{6}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$"
    ],
    "e": "$det A = 2 \\cdot 3 - 1 \\cdot 2 = 4$. Formula boʻyicha $A^{-1} = (1/$(ad − bc))·$\\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix} = (\\frac{1}{4}) \\cdot \\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$. $\\frac{1}{det}$ koʻpaytuvchisini unutish — tipik xato (faqat $\\begin{pmatrix}3 & -1 \\\\ -2 & 2\\end{pmatrix}$ qoladi)."
   }
  },
  {
   "t": "Apply Gauss–Jordan elimination to $\\left[\\begin{array}{c|c}A & I\\end{array}\\right] = \\begin{pmatrix}1 & 2 & 1 & 0 \\\\ 3 & 7 & 0 & 1\\end{pmatrix}$ to find $A^{-1}$ for $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 7\\end{pmatrix}$.",
   "o": [
    "$\\begin{pmatrix}7 & -2 \\\\ -3 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}7 & -3 \\\\ -2 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}-7 & 2 \\\\ 3 & -1\\end{pmatrix}$",
    "$\\begin{pmatrix}1 & -2 \\\\ -3 & 7\\end{pmatrix}$"
   ],
   "e": "$R_{2} \\leftarrow R_{2} - 3R_{1}$ gives $\\begin{pmatrix}1 & 2 & 1 & 0 \\\\ 0 & 1 & -3 & 1\\end{pmatrix}$; then $R_{1} \\leftarrow R_{1} - 2R_{2}$ gives $\\begin{pmatrix}1 & 0 & 7 & -2 \\\\ 0 & 1 & -3 & 1\\end{pmatrix}$. The right half is $A^{-1} = \\begin{pmatrix}7 & -2 \\\\ -3 & 1\\end{pmatrix}$ (here det A = 1).",
   "ru": {
    "t": "Методом Гаусса–Жордана на $\\left[\\begin{array}{c|c}A & I\\end{array}\\right] = \\begin{pmatrix}1 & 2 & 1 & 0 \\\\ 3 & 7 & 0 & 1\\end{pmatrix}$ найдите $A^{-1}$ для $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 7\\end{pmatrix}$.",
    "o": [
     "$\\begin{pmatrix}7 & -2 \\\\ -3 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}7 & -3 \\\\ -2 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}-7 & 2 \\\\ 3 & -1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & -2 \\\\ -3 & 7\\end{pmatrix}$"
    ],
    "e": "$R_{2} \\leftarrow R_{2} - 3R_{1}$ даёт $\\begin{pmatrix}1 & 2 & 1 & 0 \\\\ 0 & 1 & -3 & 1\\end{pmatrix}$; затем $R_{1} \\leftarrow R_{1} - 2R_{2}$ даёт $\\begin{pmatrix}1 & 0 & 7 & -2 \\\\ 0 & 1 & -3 & 1\\end{pmatrix}$. Правая половина — $A^{-1} = \\begin{pmatrix}7 & -2 \\\\ -3 & 1\\end{pmatrix}$ (здесь det A = 1)."
   },
   "uz": {
    "t": "$\\left[\\begin{array}{c|c}A & I\\end{array}\\right] = \\begin{pmatrix}1 & 2 & 1 & 0 \\\\ 3 & 7 & 0 & 1\\end{pmatrix}$ ustida Gauss–Jordan usulini qoʻllab, $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 7\\end{pmatrix}$ uchun $A^{-1}$ ni toping.",
    "o": [
     "$\\begin{pmatrix}7 & -2 \\\\ -3 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}7 & -3 \\\\ -2 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}-7 & 2 \\\\ 3 & -1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & -2 \\\\ -3 & 7\\end{pmatrix}$"
    ],
    "e": "$R_{2} \\leftarrow R_{2} - 3R_{1} \\begin{pmatrix}1 & 2 & 1 & 0 \\\\ 0 & 1 & -3 & 1\\end{pmatrix}$ beradi; soʻng $R_{1} \\leftarrow R_{1} - 2R_{2} \\begin{pmatrix}1 & 0 & 7 & -2 \\\\ 0 & 1 & -3 & 1\\end{pmatrix}$ beradi. Oʻng yarmi — $A^{-1} = \\begin{pmatrix}7 & -2 \\\\ -3 & 1\\end{pmatrix}$ (bu yerda det A = 1)."
   }
  },
  {
   "t": "Applying Gauss–Jordan elimination to $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ with $A = \\begin{pmatrix}1 & 1 & 0 \\\\ 1 & 2 & 1 \\\\ 0 & 1 & 2\\end{pmatrix}$ yields the inverse:",
   "o": [
    "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & -1 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & 1 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & 1 \\\\ 1 & -1 & 1\\end{pmatrix}$",
    "The inverse does not exist — elimination produces a zero row"
   ],
   "e": "Forward elimination gives $U = \\begin{pmatrix}1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1\\end{pmatrix}$ with multipliers 1, 1, 1; continuing upward reduces the left block to I and leaves $A^{-1} = \\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & -1 & 1\\end{pmatrix}$. Indeed $det A = 1 \\ne 0$, so the inverse exists; check $A \\cdot A^{-1} = I$.",
   "ru": {
    "t": "Применив метод Гаусса–Жордана к $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ с $A = \\begin{pmatrix}1 & 1 & 0 \\\\ 1 & 2 & 1 \\\\ 0 & 1 & 2\\end{pmatrix}$, получаем обратную матрицу:",
    "o": [
     "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & -1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & 1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & 1 \\\\ 1 & -1 & 1\\end{pmatrix}$",
     "Обратной не существует — исключение даёт нулевую строку"
    ],
    "e": "Прямой ход даёт $U = \\begin{pmatrix}1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1\\end{pmatrix}$ с множителями 1, 1, 1; продолжая вверх, приводим левый блок к I и получаем $A^{-1} = \\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & -1 & 1\\end{pmatrix}$. В самом деле, $det A = 1 \\ne 0$ — обратная существует; проверка: $A \\cdot A^{-1} = I$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 1 & 0 \\\\ 1 & 2 & 1 \\\\ 0 & 1 & 2\\end{pmatrix}$ boʻlgan $\\left[\\begin{array}{c|c}A & I\\end{array}\\right]$ ga Gauss–Jordan usulini qoʻllab, teskari matritsa topiladi:",
    "o": [
     "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & -1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & 1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & 1 \\\\ 1 & -1 & 1\\end{pmatrix}$",
     "Teskarisi mavjud emas — eliminatsiya nol satr beradi"
    ],
    "e": "Toʻgʻri yurish $U = \\begin{pmatrix}1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1\\end{pmatrix}$ beradi (koʻpaytuvchilar 1, 1, 1); yuqoriga davom ettirib, chap blokni I ga keltiramiz va $A^{-1} = \\begin{pmatrix}3 & -2 & 1 \\\\ -2 & 2 & -1 \\\\ 1 & -1 & 1\\end{pmatrix}$ hosil boʻladi. Haqiqatdan $det A = 1 \\ne 0$ — teskarisi mavjud; tekshirish: $A \\cdot A^{-1} = I$."
   }
  },
  {
   "t": "Computing the inverse $A^{-1}$ is equivalent to solving which systems?",
   "o": [
    "n systems $Ax_{j} = e_{j}$, one for each column of the identity: $A^{-1} = \\begin{pmatrix}x_{1} & \\cdots & x_n\\end{pmatrix}$",
    "One system Ax = b with a single fixed right side b",
    "The single system Ax = 0",
    "n systems $Ax_{j} = b_{j}$ with arbitrary right sides $b_{j}$"
   ],
   "e": "If $A^{-1} = \\begin{pmatrix}x_{1} & \\cdots & x_n\\end{pmatrix}$, then $A \\cdot A^{-1} = I$ means $Ax_{j} = e_{j}$ for every j: the j-th column of the inverse solves the system with right side $e_{j}$. Gauss–Jordan on $\\left[\\begin{array}{c|c}A & I\\end{array}\\right] \\to [I | A^{-1}$] solves all n systems at once.",
   "ru": {
    "t": "Вычисление обратной матрицы $A^{-1}$ равносильно решению каких систем?",
    "o": [
     "n систем $Ax_{j} = e_{j}$, по одной на каждый столбец единичной матрицы: $A^{-1} = \\begin{pmatrix}x_{1} & \\cdots & x_n\\end{pmatrix}$",
     "Одной системы Ax = b с единственной фиксированной правой частью b",
     "Единственной системы Ax = 0",
     "n систем $Ax_{j} = b_{j}$ с произвольными правыми частями $b_{j}$"
    ],
    "e": "Если $A^{-1} = \\begin{pmatrix}x_{1} & \\cdots & x_n\\end{pmatrix}$, то $A \\cdot A^{-1} = I$ означает $Ax_{j} = e_{j}$ для каждого j: j-й столбец обратной решает систему с правой частью $e_{j}$. Гаусс–Жордан $\\left[\\begin{array}{c|c}A & I\\end{array}\\right] \\to [I | A^{-1}$] решает все n систем одновременно."
   },
   "uz": {
    "t": "$A^{-1}$ teskari matritsasini hisoblash qaysi sistemalarni yechishga teng?",
    "o": [
     "Birlik matritsaning har bir ustuni uchun bittadan n ta $Ax_{j} = e_{j}$ sistemasi: $A^{-1} = \\begin{pmatrix}x_{1} & \\cdots & x_n\\end{pmatrix}$",
     "Yagona qatʼiy oʻng tomonlama b li bitta Ax = b sistemasi",
     "Yagona Ax = 0 sistemasi",
     "Ixtiyoriy oʻng tomonlamali $b_{j}$ boʻlgan n ta $Ax_{j} = b_{j}$ sistemasi"
    ],
    "e": "Agar $A^{-1} = \\begin{pmatrix}x_{1} & \\cdots & x_n\\end{pmatrix}$ boʻlsa, $A \\cdot A^{-1} = I$ har bir j uchun $Ax_{j} = e_{j}$ degani: teskarining j-ustuni $e_{j}$ oʻng tomonlamali sistemani yechadi. Gauss–Jordan $\\left[\\begin{array}{c|c}A & I\\end{array}\\right] \\to [I | A^{-1}$] barcha n sistemani birdan yechadi."
   }
  },
  {
   "t": "Find the LU decomposition of $A = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$ (no row exchanges).",
   "o": [
    "$L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$",
    "$L = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 3\\end{pmatrix}$",
    "$L = \\begin{pmatrix}1 & 0 \\\\ 6 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 5\\end{pmatrix}$",
    "$L = \\begin{pmatrix}1 & 0 \\\\ \\frac{1}{3} & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$"
   ],
   "e": "The multiplier is $\\lambda_{21} = \\frac{6}{2} = 3$, and $R_{2} \\leftarrow R_{2} - 3R_{1}$ turns the row $\\begin{pmatrix}6 & 5\\end{pmatrix}$ into $\\begin{pmatrix}0 & 2\\end{pmatrix}$. The multiplier goes below the diagonal of L and U keeps the elimination result: $\\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$.",
   "ru": {
    "t": "Найдите LU-разложение матрицы $A = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$ (без обменов строк).",
    "o": [
     "$L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$",
     "$L = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 3\\end{pmatrix}$",
     "$L = \\begin{pmatrix}1 & 0 \\\\ 6 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 5\\end{pmatrix}$",
     "$L = \\begin{pmatrix}1 & 0 \\\\ \\frac{1}{3} & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$"
    ],
    "e": "Множитель $\\lambda_{21} = \\frac{6}{2} = 3$, и $R_{2} \\leftarrow R_{2} - 3R_{1}$ превращает строку $\\begin{pmatrix}6 & 5\\end{pmatrix}$ в $\\begin{pmatrix}0 & 2\\end{pmatrix}$. Множитель записывается под диагональю L, а U хранит результат исключения: $\\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$ matritsaning LU-ajralmasini toping (satr almashuvisiz).",
    "o": [
     "$L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$",
     "$L = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 3\\end{pmatrix}$",
     "$L = \\begin{pmatrix}1 & 0 \\\\ 6 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 5\\end{pmatrix}$",
     "$L = \\begin{pmatrix}1 & 0 \\\\ \\frac{1}{3} & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$"
    ],
    "e": "Koʻpaytuvchi $\\lambda_{21} = \\frac{6}{2} = 3$, $R_{2} \\leftarrow R_{2} - 3R_{1}$ esa $\\begin{pmatrix}6 & 5\\end{pmatrix}$ satrini $\\begin{pmatrix}0 & 2\\end{pmatrix}$ ga aylantiradi. Koʻpaytuvchi L diagonalining ostiga yoziladi, U eliminatsiya natijasini saqlaydi: $\\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$."
   }
  },
  {
   "t": "Elimination on $A = \\begin{pmatrix}2 & 1 & 1 \\\\ 4 & 5 & 4 \\\\ -2 & 2 & 3\\end{pmatrix}$ ends with $U = \\begin{pmatrix}2 & 1 & 1 \\\\ 0 & 3 & 2 \\\\ 0 & 0 & 2\\end{pmatrix}$. What is L?",
   "o": [
    "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 1 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & -1 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}1 & 0 & 0 \\\\ 4 & 1 & 0 \\\\ -2 & 1 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 3 & 1\\end{pmatrix}$"
   ],
   "e": "The multipliers are $\\lambda_{21} = \\frac{4}{2} = 2$ and $\\lambda_{31} = -\\frac{2}{2} = -1$, then $\\lambda_{32} = \\frac{3}{3} = 1$ (from the updated row 3). They enter L with their original signs: $L = \\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 1 & 1\\end{pmatrix}$, and indeed $L \\cdot U = A$.",
   "ru": {
    "t": "Исключение на $A = \\begin{pmatrix}2 & 1 & 1 \\\\ 4 & 5 & 4 \\\\ -2 & 2 & 3\\end{pmatrix}$ завершается матрицей $U = \\begin{pmatrix}2 & 1 & 1 \\\\ 0 & 3 & 2 \\\\ 0 & 0 & 2\\end{pmatrix}$. Чему равно L?",
    "o": [
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & -1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 4 & 1 & 0 \\\\ -2 & 1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 3 & 1\\end{pmatrix}$"
    ],
    "e": "Множители: $\\lambda_{21} = \\frac{4}{2} = 2$ и $\\lambda_{31} = -\\frac{2}{2} = -1$, затем $\\lambda_{32} = \\frac{3}{3} = 1$ (по обновлённой строке 3). Они попадают в L с исходными знаками: $L = \\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 1 & 1\\end{pmatrix}$, и действительно $L \\cdot U = A$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}2 & 1 & 1 \\\\ 4 & 5 & 4 \\\\ -2 & 2 & 3\\end{pmatrix}$ ustidagi eliminatsiya $U = \\begin{pmatrix}2 & 1 & 1 \\\\ 0 & 3 & 2 \\\\ 0 & 0 & 2\\end{pmatrix}$ bilan tugaydi. L nimaga teng?",
    "o": [
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & -1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 4 & 1 & 0 \\\\ -2 & 1 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 3 & 1\\end{pmatrix}$"
    ],
    "e": "Koʻpaytuvchilar: $\\lambda_{21} = \\frac{4}{2} = 2$ va $\\lambda_{31} = -\\frac{2}{2} = -1$, soʻngra (yangilangan 3-satrdan) $\\lambda_{32} = \\frac{3}{3} = 1$. Ular asl belgilari bilan L ga tushadi: $L = \\begin{pmatrix}1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & 1 & 1\\end{pmatrix}$, haqiqatan $L \\cdot U = A$."
   }
  },
  {
   "t": "Let A = LU with $L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$ and $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$. Solving Ax = b for $b = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$ in two steps gives:",
   "o": [
    "$y = \\begin{pmatrix}5 \\\\ 4\\end{pmatrix}$ from Ly = b, then $x = \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix}$ from Ux = y",
    "$y = \\begin{pmatrix}5 \\\\ 4\\end{pmatrix}$, then $x = \\begin{pmatrix}2 \\\\ \\frac{3}{2}\\end{pmatrix}$",
    "$y = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$, then $x = \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix}$",
    "$y = \\begin{pmatrix}4 \\\\ 5\\end{pmatrix}$, then $x = \\begin{pmatrix}2 \\\\ 2\\end{pmatrix}$"
   ],
   "e": "Forward substitution Ly = b: $y_{1} = 5$ and $3 \\cdot 5 + y_{2} = 19$, so $y_{2} = 4$. Back substitution Ux = y: $2x_{2} = 4$ gives $x_{2} = 2$, and $2x_{1} + 2 = 5$ gives $x_{1} = \\frac{3}{2}$. Check with $A = LU = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$: $A \\cdot \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix} = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$.",
   "ru": {
    "t": "Пусть A = LU, где $L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$. Решение Ax = b при $b = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$ в два шага даёт:",
    "o": [
     "$y = \\begin{pmatrix}5 \\\\ 4\\end{pmatrix}$ из Ly = b, затем $x = \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix}$ из Ux = y",
     "$y = \\begin{pmatrix}5 \\\\ 4\\end{pmatrix}$, затем $x = \\begin{pmatrix}2 \\\\ \\frac{3}{2}\\end{pmatrix}$",
     "$y = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$, затем $x = \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix}$",
     "$y = \\begin{pmatrix}4 \\\\ 5\\end{pmatrix}$, затем $x = \\begin{pmatrix}2 \\\\ 2\\end{pmatrix}$"
    ],
    "e": "Прямая подстановка Ly = b: $y_{1} = 5$ и $3 \\cdot 5 + y_{2} = 19$, откуда $y_{2} = 4$. Обратная подстановка Ux = y: $2x_{2} = 4$ даёт $x_{2} = 2$, а $2x_{1} + 2 = 5$ даёт $x_{1} = \\frac{3}{2}$. Проверка с $A = LU = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$: $A \\cdot \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix} = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$."
   },
   "uz": {
    "t": "A = LU, $L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$ boʻlsin. $b = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$ uchun Ax = b ni ikki qadamda yechish nimani beradi?",
    "o": [
     "Ly = b dan $y = \\begin{pmatrix}5 \\\\ 4\\end{pmatrix}$, soʻngra Ux = y dan $x = \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix}$",
     "$y = \\begin{pmatrix}5 \\\\ 4\\end{pmatrix}$, soʻngra $x = \\begin{pmatrix}2 \\\\ \\frac{3}{2}\\end{pmatrix}$",
     "$y = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$, soʻngra $x = \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix}$",
     "$y = \\begin{pmatrix}4 \\\\ 5\\end{pmatrix}$, soʻngra $x = \\begin{pmatrix}2 \\\\ 2\\end{pmatrix}$"
    ],
    "e": "Toʻgʻri almashtirish Ly = b: $y_{1} = 5$ va $3 \\cdot 5 + y_{2} = 19$, demak $y_{2} = 4$. Teskari almashtirish Ux = y: $2x_{2} = 4 \\to x_{2} = 2$, $2x_{1} + 2 = 5 \\to x_{1} = \\frac{3}{2}$. $A = LU = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$ bilan tekshirish: $A \\cdot \\begin{pmatrix}\\frac{3}{2} \\\\ 2\\end{pmatrix} = \\begin{pmatrix}5 \\\\ 19\\end{pmatrix}$."
   }
  },
  {
   "t": "In the LDU decomposition $\\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot D \\cdot \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix}$, the middle factor D is:",
   "o": [
    "$\\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix}$ — the pivots of U on its diagonal",
    "$\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$ — the identity matrix",
    "$\\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$ — a copy of U",
    "$\\begin{pmatrix}3 & 0 \\\\ 0 & 1\\end{pmatrix}$ — the first multiplier and a unit pivot"
   ],
   "e": "LDU splits $U = D \\cdot (D^{-1}U)$: D holds the pivots 2 and 2, while $D^{-1}U = \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix}$ has units on its diagonal. Check: $\\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix} \\cdot \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix} = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$.",
   "ru": {
    "t": "В LDU-разложении $\\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot D \\cdot \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix}$ средний множитель D равен:",
    "o": [
     "$\\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix}$ — опорные элементы U на диагонали",
     "$\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$ — единичная матрица",
     "$\\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$ — копия U",
     "$\\begin{pmatrix}3 & 0 \\\\ 0 & 1\\end{pmatrix}$ — первый множитель и единичный опорный элемент"
    ],
    "e": "LDU расщепляет $U = D \\cdot (D^{-1}U)$: D содержит опорные элементы 2 и 2, а у $D^{-1}U = \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix}$ на диагонали единицы. Проверка: $\\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix} \\cdot \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix} = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$."
   },
   "uz": {
    "t": "$\\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix} = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot D \\cdot \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix} LDU$-ajralmasida oʻrta koʻpaytuvchi D:",
    "o": [
     "$\\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix}$ — U ning tayanch elementlari diagonalida",
     "$\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$ — birlik matritsa",
     "$\\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix}$ — U nusxasi",
     "$\\begin{pmatrix}3 & 0 \\\\ 0 & 1\\end{pmatrix}$ — birinchi koʻpaytuvchi va birlik tayanch"
    ],
    "e": "LDU ni $U = D \\cdot (D^{-1}U)$ shaklida boʻladi: D da 2 va 2 tayanch elementlari, $D^{-1}U = \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix}$ diagonalida esa birliklar turadi. Tekshirish: $\\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix} \\cdot \\begin{pmatrix}1 & \\frac{1}{2} \\\\ 0 & 1\\end{pmatrix} = \\begin{pmatrix}2 & 1 \\\\ 6 & 5\\end{pmatrix}$."
   }
  },
  {
   "t": "Why does partial pivoting exchange rows for $A = [10^{-8} 1$; 1 1]?",
   "o": [
    "The first pivot $10^{-8}$ would give the huge multiplier $10^{8}$; after the exchange the multiplier is only $10^{-8}$",
    "A is singular, so a row exchange is required to make it invertible",
    "The exchange makes U symmetric, which is required for LU",
    "Partial pivoting always reorders the rows in decreasing order"
   ],
   "e": "Without the exchange the multiplier is $\\frac{1}{10^{-8}} = 10^{8}$: subtracting a huge multiple of row 1 would amplify round-off error. The exchange puts the largest available entry of the column (the number 1) into the pivot position, giving the multiplier $10^{-8}/1 = 10^{-8}$. The matrix is invertible either way $(det = 1 - 10^{-8} \\ne 0)$.",
   "ru": {
    "t": "Почему частичный выбор опорного элемента меняет строки для $A = [10^{-8} 1$; 1 1]?",
    "o": [
     "Первый опорный элемент $10^{-8}$ дал бы огромный множитель $10^{8}$; после обмена множитель равен лишь $10^{-8}$",
     "Матрица A вырождена, поэтому для обратимости необходим обмен строк",
     "Обмен делает U симметричной, что требуется для LU",
     "Частичный выбор всегда упорядочивает строки по убыванию"
    ],
    "e": "Без обмена множитель равен $\\frac{1}{10^{-8}} = 10^{8}$: вычитание огромного кратного строки 1 усиливало бы погрешности округления. Обмен ставит наибольший по модулю элемент столбца (число 1) в опорную позицию, и множитель становится $10^{-8}/1 = 10^{-8}$. Матрица обратима в обоих случаях $(det = 1 - 10^{-8} \\ne 0)$."
   },
   "uz": {
    "t": "$A = [10^{-8} 1$; 1 1] uchun qismiy tayanch tanlash (partial pivoting) nega satrlarni almashtiradi?",
    "o": [
     "Birinchi tayanch $10^{-8}$ ulkan $10^{8}$ koʻpaytuvchisini berardi; almashgandan keyin koʻpaytuvchi faqat $10^{-8}$",
     "A matritsa singulyar, shuning uchun teskari boʻlishi uchun satr almashuvi shart",
     "Almashuv U ni simmetrik qiladi, LU buni talab qiladi",
     "Qismiy tanlash har doim satrlarni kamayish tartibida joylashtiradi"
    ],
    "e": "Almashuvsiz koʻpaytuvchi $\\frac{1}{10^{-8}} = 10^{8}$: 1-satrlning ulkan koʻpaytmasini ayirish yaxlitlash xatosini kuchaytirardi. Almashuv ustunning eng katta modulli elementini (1 sonini) tayanch oʻrniga qoʻyadi va koʻpaytuvchi $10^{-8}/1 = 10^{-8}$ boʻladi. Matritsa baribir teskari $(det = 1 - 10^{-8} \\ne 0)$."
   }
  },
  {
   "t": "$A = \\begin{pmatrix}0 & 2 \\\\ 3 & 4\\end{pmatrix}$ has a zero first pivot. Which factorization PA = LU is correct?",
   "o": [
    "$P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$, L = I, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$",
    "No factorization exists — the zero pivot means A is singular",
    "P = I, L = I, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$",
    "$P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$, $L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$"
   ],
   "e": "A zero in the pivot position only signals a bad row order, not singularity: $det A = 0 \\cdot 4 - 2 \\cdot 3 = -6 \\ne 0$. Exchanging the rows $(P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix})$ gives $PA = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$, which is already triangular, so L = I and PA = LU.",
   "ru": {
    "t": "У матрицы $A = \\begin{pmatrix}0 & 2 \\\\ 3 & 4\\end{pmatrix}$ первый опорный элемент нулевой. Какое разложение PA = LU верно?",
    "o": [
     "$P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$, L = I, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$",
     "Разложения не существует — нулевой опорный элемент означает вырожденность A",
     "P = I, L = I, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$",
     "$P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$, $L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$"
    ],
    "e": "Ноль в опорной позиции лишь сигнализирует о неудачном порядке строк, а не о вырожденности: $det A = 0 \\cdot 4 - 2 \\cdot 3 = -6 \\ne 0$. Обмен строк $(P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix})$ даёт $PA = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$ — уже треугольную матрицу, поэтому L = I и PA = LU."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}0 & 2 \\\\ 3 & 4\\end{pmatrix}$ matritsaning birinchi tayanch elementi nol. Qaysi PA = LU ajralmasi toʻgʻri?",
    "o": [
     "$P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$, L = I, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$",
     "Ajralmas mavjud emas — nol tayanch A ning singulyarligini bildiradi",
     "P = I, L = I, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$",
     "$P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$, $L = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$, $U = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$"
    ],
    "e": "Tayanch oʻrnidagi nol faqat satrlar tartibining yomonligini bildiradi, singulyarlikni emas: $det A = 0 \\cdot 4 - 2 \\cdot 3 = -6 \\ne 0$. Satrlarni almashtirish $(P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}) PA = \\begin{pmatrix}3 & 4 \\\\ 0 & 2\\end{pmatrix}$ beradi — u allaqachon uchburchak, shuning uchun L = I va PA = LU."
   }
  },
  {
   "t": "For $A = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$ and $B = \\begin{pmatrix}2 & 0 \\\\ 3 & 1\\end{pmatrix}$, compute $(AB)^{T}$ and check the transpose identity.",
   "o": [
    "$(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix} = B^{T} \\cdot A^{T}$",
    "$(AB)^{T} = \\begin{pmatrix}8 & 2 \\\\ 3 & 1\\end{pmatrix} = A^{T} \\cdot B^{T}$",
    "$(AB)^{T} = \\begin{pmatrix}2 & 3 \\\\ 4 & 7\\end{pmatrix} = A^{T} \\cdot B^{T}$",
    "$(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix} = A^{T} \\cdot B^{T}$"
   ],
   "e": "$AB = \\begin{pmatrix}1 \\cdot 2 + 2 \\cdot 3 & 2 \\\\ 3 & 1\\end{pmatrix} = \\begin{pmatrix}8 & 2 \\\\ 3 & 1\\end{pmatrix}$, so $(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix}$. The identity gives the same: $B^{T} \\cdot A^{T} = \\begin{pmatrix}2 & 3 \\\\ 0 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix}$. Keeping the original order gives $A^{T} \\cdot B^{T} = \\begin{pmatrix}2 & 3 \\\\ 4 & 7\\end{pmatrix}$ — the wrong matrix.",
   "ru": {
    "t": "Для $A = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$ и $B = \\begin{pmatrix}2 & 0 \\\\ 3 & 1\\end{pmatrix}$ вычислите $(AB)^{T}$ и проверьте тождество транспонирования.",
    "o": [
     "$(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix} = B^{T} \\cdot A^{T}$",
     "$(AB)^{T} = \\begin{pmatrix}8 & 2 \\\\ 3 & 1\\end{pmatrix} = A^{T} \\cdot B^{T}$",
     "$(AB)^{T} = \\begin{pmatrix}2 & 3 \\\\ 4 & 7\\end{pmatrix} = A^{T} \\cdot B^{T}$",
     "$(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix} = A^{T} \\cdot B^{T}$"
    ],
    "e": "$AB = \\begin{pmatrix}1 \\cdot 2 + 2 \\cdot 3 & 2 \\\\ 3 & 1\\end{pmatrix} = \\begin{pmatrix}8 & 2 \\\\ 3 & 1\\end{pmatrix}$, поэтому $(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix}$. Тождество даёт то же: $B^{T} \\cdot A^{T} = \\begin{pmatrix}2 & 3 \\\\ 0 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix}$. Сохранение исходного порядка даёт $A^{T} \\cdot B^{T} = \\begin{pmatrix}2 & 3 \\\\ 4 & 7\\end{pmatrix}$ — неверную матрицу."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$ va $B = \\begin{pmatrix}2 & 0 \\\\ 3 & 1\\end{pmatrix}$ uchun $(AB)^{T}$ ni hisoblang va transponirlash ayniyatini tekshiring.",
    "o": [
     "$(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix} = B^{T} \\cdot A^{T}$",
     "$(AB)^{T} = \\begin{pmatrix}8 & 2 \\\\ 3 & 1\\end{pmatrix} = A^{T} \\cdot B^{T}$",
     "$(AB)^{T} = \\begin{pmatrix}2 & 3 \\\\ 4 & 7\\end{pmatrix} = A^{T} \\cdot B^{T}$",
     "$(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix} = A^{T} \\cdot B^{T}$"
    ],
    "e": "$AB = \\begin{pmatrix}1 \\cdot 2 + 2 \\cdot 3 & 2 \\\\ 3 & 1\\end{pmatrix} = \\begin{pmatrix}8 & 2 \\\\ 3 & 1\\end{pmatrix}$, demak $(AB)^{T} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix}$. Ayniyat ham xuddi shuni beradi: $B^{T} \\cdot A^{T} = \\begin{pmatrix}2 & 3 \\\\ 0 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix} = \\begin{pmatrix}8 & 3 \\\\ 2 & 1\\end{pmatrix}$. Asl tartibni saqlash $A^{T} \\cdot B^{T} = \\begin{pmatrix}2 & 3 \\\\ 4 & 7\\end{pmatrix}$ beradi — notoʻgʻri matritsa."
   }
  },
  {
   "t": "The difference matrix $A = \\begin{pmatrix}1 & 0 & 0 \\\\ -1 & 1 & 0 \\\\ 0 & -1 & 1\\end{pmatrix}$ maps x = (1, 2, 4) to (1, 1, 2). Where does its inverse $A^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 1 & 1 & 0 \\\\ 1 & 1 & 1\\end{pmatrix}$ map x?",
   "o": [
    "To (1, 3, 7) — the cumulative sums of the entries",
    "To (1, 1, 2) — the differences again",
    "To (1, 2, 4) — x itself",
    "To (7, 3, 1) — the sums in reverse order"
   ],
   "e": "A computes differences (a discrete derivative); its inverse undoes them by cumulative sums (a discrete integral): $A^{-1}x = (x_{1}, x_{1} + x_{2}, x_{1} + x_{2} + x_{3}) = (1, 3, 7)$. Check: $A \\cdot (1, 3, 7) = (1, 2, 4)$.",
   "ru": {
    "t": "Разностная матрица $A = \\begin{pmatrix}1 & 0 & 0 \\\\ -1 & 1 & 0 \\\\ 0 & -1 & 1\\end{pmatrix}$ переводит x = (1, 2, 4) в (1, 1, 2). Куда переводит x обратная матрица $A^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 1 & 1 & 0 \\\\ 1 & 1 & 1\\end{pmatrix}$?",
    "o": [
     "В (1, 3, 7) — накопленные суммы компонент",
     "В (1, 1, 2) — снова разности",
     "В (1, 2, 4) — сам вектор x",
     "В (7, 3, 1) — суммы в обратном порядке"
    ],
    "e": "A вычисляет разности (дискретная производная); обратная отменяет их накопленными суммами (дискретный интеграл): $A^{-1}x = (x_{1}, x_{1} + x_{2}, x_{1} + x_{2} + x_{3}) = (1, 3, 7)$. Проверка: $A \\cdot (1, 3, 7) = (1, 2, 4)$."
   },
   "uz": {
    "t": "Ayirmalar matritsasi $A = \\begin{pmatrix}1 & 0 & 0 \\\\ -1 & 1 & 0 \\\\ 0 & -1 & 1\\end{pmatrix} x = (1, 2, 4)$ vektorni (1, 1, 2) ga oʻtkazadi. Teskari matritsa $A^{-1} = \\begin{pmatrix}1 & 0 & 0 \\\\ 1 & 1 & 0 \\\\ 1 & 1 & 1\\end{pmatrix} x$ ni qayerga oʻtkazadi?",
    "o": [
     "(1, 3, 7) ga — komponentalarning kumulativ yigʻindilari",
     "(1, 1, 2) ga — yana ayirmalar",
     "(1, 2, 4) ga — x oʻzi",
     "(7, 3, 1) ga — teskari tartibdagi yigʻindilar"
    ],
    "e": "A ayirmalarni hisoblaydi (diskret hosila); teskarisi ularni kumulativ yigʻindilar bilan bekor qiladi (diskret integral): $A^{-1}x = (x_{1}, x_{1} + x_{2}, x_{1} + x_{2} + x_{3}) = (1, 3, 7)$. Tekshirish: $A \\cdot (1, 3, 7) = (1, 2, 4)$."
   }
  },
  {
   "t": "Three of the following transpose identities are true for all matrices of compatible sizes. Which one is FALSE?",
   "o": [
    "$(AB)^{T} = A^{T} \\cdot B^{T}$",
    "$(A + B)^{T} = A^{T} + B^{T}$",
    "$(AB)^{T} = B^{T} \\cdot A^{T}$",
    "$(A^{-1})^{T} = (A^{T})^{-1}$ for invertible A"
   ],
   "e": "The product rule reverses the order: $(AB)^{T} = B^{T} A^{T}$, not $A^{T} B^{T}$ (which may not even be defined). The sum rule, the reversed product rule and the inverse-transpose rule are all true.",
   "ru": {
    "t": "Три из следующих тождеств транспонирования верны для всех матриц согласованных размеров. Какое из них ЛОЖНО?",
    "o": [
     "$(AB)^{T} = A^{T} \\cdot B^{T}$",
     "$(A + B)^{T} = A^{T} + B^{T}$",
     "$(AB)^{T} = B^{T} \\cdot A^{T}$",
     "$(A^{-1})^{T} = (A^{T})^{-1}$ для обратимой A"
    ],
    "e": "Правило произведения меняет порядок множителей: $(AB)^{T} = B^{T} A^{T}$, а не $A^{T} B^{T}$ (последнее может быть даже не определено). Правила суммы, обратного порядка и «обратной-транспонированной» верны."
   },
   "uz": {
    "t": "Quyidagi transponirlash ayniyatlaridan uchtasi mos oʻlchamdagi barcha matritsalar uchun toʻgʻri. Qaysi biri YALGʻON?",
    "o": [
     "$(AB)^{T} = A^{T} \\cdot B^{T}$",
     "$(A + B)^{T} = A^{T} + B^{T}$",
     "$(AB)^{T} = B^{T} \\cdot A^{T}$",
     "Teskarisi mavjud A uchun $(A^{-1})^{T} = (A^{T})^{-1}$"
    ],
    "e": "Koʻpaytma qoidasi tartibni teskariga oʻzgartiradi: $(AB)^{T} = B^{T} A^{T}$, $A^{T} B^{T}$ emas (bu hatto aniqlanmasligi mumkin). Yigʻindi, teskari tartib va «teskari-transponir» qoidalari esa toʻgʻri."
   }
  },
  {
   "t": "Split $A = \\begin{pmatrix}1 & 4 \\\\ 2 & 3\\end{pmatrix}$ into symmetric plus skew-symmetric parts. What is the symmetric part S?",
   "o": [
    "$S = \\begin{pmatrix}1 & 3 \\\\ 3 & 3\\end{pmatrix}$",
    "$S = \\begin{pmatrix}1 & 2 \\\\ 4 & 3\\end{pmatrix}$",
    "$S = \\begin{pmatrix}1 & 4 \\\\ 2 & 3\\end{pmatrix}$",
    "$S = \\begin{pmatrix}2 & 6 \\\\ 6 & 6\\end{pmatrix}$"
   ],
   "e": "$S = \\frac{(A + A^{T})}{2}$ averages the off-diagonal entries: $A^{T} = \\begin{pmatrix}1 & 2 \\\\ 4 & 3\\end{pmatrix}$, so $S = \\begin{pmatrix}1 & 3 \\\\ 3 & 3\\end{pmatrix}$ and $K = \\frac{(A - A^{T})}{2} = \\begin{pmatrix}0 & 1 \\\\ -1 & 0\\end{pmatrix}$, with S + K = A. Forgetting the division by 2 would leave $\\begin{pmatrix}2 & 6 \\\\ 6 & 6\\end{pmatrix}$.",
   "ru": {
    "t": "Разложите $A = \\begin{pmatrix}1 & 4 \\\\ 2 & 3\\end{pmatrix}$ на симметричную и кососимметрическую части. Чему равна симметричная часть S?",
    "o": [
     "$S = \\begin{pmatrix}1 & 3 \\\\ 3 & 3\\end{pmatrix}$",
     "$S = \\begin{pmatrix}1 & 2 \\\\ 4 & 3\\end{pmatrix}$",
     "$S = \\begin{pmatrix}1 & 4 \\\\ 2 & 3\\end{pmatrix}$",
     "$S = \\begin{pmatrix}2 & 6 \\\\ 6 & 6\\end{pmatrix}$"
    ],
    "e": "$S = \\frac{(A + A^{T})}{2}$ усредняет внедиагональные элементы: $A^{T} = \\begin{pmatrix}1 & 2 \\\\ 4 & 3\\end{pmatrix}$, поэтому $S = \\begin{pmatrix}1 & 3 \\\\ 3 & 3\\end{pmatrix}$, а $K = \\frac{(A - A^{T})}{2} = \\begin{pmatrix}0 & 1 \\\\ -1 & 0\\end{pmatrix}$, и S + K = A. Забывание деления на 2 оставило бы $\\begin{pmatrix}2 & 6 \\\\ 6 & 6\\end{pmatrix}$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 4 \\\\ 2 & 3\\end{pmatrix}$ ni simmetrik va kososimmetrik qismlarga ajratings. Simmetrik qism S nimaga teng?",
    "o": [
     "$S = \\begin{pmatrix}1 & 3 \\\\ 3 & 3\\end{pmatrix}$",
     "$S = \\begin{pmatrix}1 & 2 \\\\ 4 & 3\\end{pmatrix}$",
     "$S = \\begin{pmatrix}1 & 4 \\\\ 2 & 3\\end{pmatrix}$",
     "$S = \\begin{pmatrix}2 & 6 \\\\ 6 & 6\\end{pmatrix}$"
    ],
    "e": "$S = \\frac{(A + A^{T})}{2}$ diagonaldan tashqari elementlarni oʻrtachalaydi: $A^{T} = \\begin{pmatrix}1 & 2 \\\\ 4 & 3\\end{pmatrix}$, shuning uchun $S = \\begin{pmatrix}1 & 3 \\\\ 3 & 3\\end{pmatrix}$, $K = \\frac{(A - A^{T})}{2} = \\begin{pmatrix}0 & 1 \\\\ -1 & 0\\end{pmatrix}$ va S + K = A. 2 ga boʻlishni unutish $\\begin{pmatrix}2 & 6 \\\\ 6 & 6\\end{pmatrix}$ qoldirardi."
   }
  },
  {
   "t": "Compute $A^{T} \\cdot A$ for $A = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$.",
   "o": [
    "$\\begin{pmatrix}1 & 2 \\\\ 2 & 5\\end{pmatrix}$",
    "$\\begin{pmatrix}5 & 2 \\\\ 2 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$",
    "$\\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$"
   ],
   "e": "$A^{T} = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$, so $A^{T} \\cdot A = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix} = \\begin{pmatrix}1 & 2 \\\\ 2 & 5\\end{pmatrix}$. The result is symmetric, as it must be: $(A^{T} A)^{T} = A^{T} A$. (The matrix $\\begin{pmatrix}5 & 2 \\\\ 2 & 1\\end{pmatrix}$ is $A \\cdot A^{T}$.)",
   "ru": {
    "t": "Вычислите $A^{T} \\cdot A$ для $A = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$.",
    "o": [
     "$\\begin{pmatrix}1 & 2 \\\\ 2 & 5\\end{pmatrix}$",
     "$\\begin{pmatrix}5 & 2 \\\\ 2 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$"
    ],
    "e": "$A^{T} = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$, поэтому $A^{T} \\cdot A = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix} = \\begin{pmatrix}1 & 2 \\\\ 2 & 5\\end{pmatrix}$. Результат симметричен, как и должно быть: $(A^{T} A)^{T} = A^{T} A$. (Матрица $\\begin{pmatrix}5 & 2 \\\\ 2 & 1\\end{pmatrix}$ — это $A \\cdot A^{T}$.)"
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$ uchun $A^{T} \\cdot A$ ni hisoblang.",
    "o": [
     "$\\begin{pmatrix}1 & 2 \\\\ 2 & 5\\end{pmatrix}$",
     "$\\begin{pmatrix}5 & 2 \\\\ 2 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$",
     "$\\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$"
    ],
    "e": "$A^{T} = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$, demak $A^{T} \\cdot A = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix} \\cdot \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix} = \\begin{pmatrix}1 & 2 \\\\ 2 & 5\\end{pmatrix}$. Natija simmetrik — boʻlishi kerakidek: $(A^{T} A)^{T} = A^{T} A$. ($\\begin{pmatrix}5 & 2 \\\\ 2 & 1\\end{pmatrix}$ matritsa — bu $A \\cdot A^{T}$.)"
   }
  },
  {
   "t": "The product $R^{T} R$ appears in least squares. Which statement is TRUE for every real matrix R?",
   "o": [
    "$(R^{T} R)^{T} = R^{T} (R^{T})^{T} = R^{T} R$, so $R^{T} R$ is always symmetric",
    "$R^{T} R$ is symmetric only when R is a square matrix",
    "$R^{T} R$ is symmetric only when R itself is symmetric",
    "$R^{T} R = R \\cdot R^{T}$ for every R"
   ],
   "e": "By the reverse-order rule, $(R^{T} R)^{T} = R^{T} (R^{T})^{T} = R^{T} R$ — no assumption on R is needed. Moreover $x^{T} R^{T} R x = ||Rx||^{2} \\ge 0$ for every x. The products $R^{T} R$ and $R \\cdot R^{T}$ are generally different (and have different sizes for a rectangular R).",
   "ru": {
    "t": "Произведение $R^{T} R$ встречается в методе наименьших квадратов. Какое утверждение ВЕРНО для любой вещественной матрицы R?",
    "o": [
     "$(R^{T} R)^{T} = R^{T} (R^{T})^{T} = R^{T} R$, поэтому $R^{T} R$ всегда симметрична",
     "$R^{T} R$ симметрична, только когда R квадратная",
     "$R^{T} R$ симметрична, только когда сама R симметрична",
     "$R^{T} R = R \\cdot R^{T}$ для любой R"
    ],
    "e": "По правилу обратного порядка $(R^{T} R)^{T} = R^{T} (R^{T})^{T} = R^{T} R$ — никаких предположений о R не требуется. Более того, $x^{T} R^{T} R x = ||Rx||^{2} \\ge 0$ для любого x. Произведения $R^{T} R$ и $R \\cdot R^{T}$ в общем случае различны (и при прямоугольной R имеют разные размеры)."
   },
   "uz": {
    "t": "$R^{T} R$ koʻpaytmasi eng kichik kvadratlar usulida uchraydi. Har qanday haqiqiy R matritsa uchun qaysi gap TOʻGʻRI?",
    "o": [
     "$(R^{T} R)^{T} = R^{T} (R^{T})^{T} = R^{T} R$, shuning uchun $R^{T} R$ doim simmetrik",
     "$R^{T} R$ faqat R kvadrat boʻlganda simmetrik",
     "$R^{T} R$ faqat R oʻzi simmetrik boʻlganda simmetrik",
     "Har qanday R uchun $R^{T} R = R \\cdot R^{T}$"
    ],
    "e": "Teskari tartib qoidasi boʻyicha $(R^{T} R)^{T} = R^{T} (R^{T})^{T} = R^{T} R$ — R haqida hech qanday shart kerak emas. Bundan tashqari, har qanday x uchun $x^{T} R^{T} R x = ||Rx||^{2} \\ge 0$. $R^{T} R$ va $R \\cdot R^{T}$ koʻpaytmalari odatda farq qiladi (toʻrtburchak R uchun oʻlchamlari ham boshqacha)."
   }
  },
  {
   "t": "For $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$ and the permutation $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$, what are PA and AP?",
   "o": [
    "$PA = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$ (rows exchanged), $AP = \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix}$ (columns exchanged)",
    "$PA = \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix}$, $AP = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$",
    "$PA = AP = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$",
    "$PA = \\begin{pmatrix}4 & 3 \\\\ 2 & 1\\end{pmatrix}$, $AP = \\begin{pmatrix}4 & 3 \\\\ 2 & 1\\end{pmatrix}$"
   ],
   "e": "Multiplication on the left acts on rows: PA exchanges rows 1 and 2 of A. Multiplication on the right acts on columns: AP exchanges columns 1 and 2. In general $PA \\ne AP$.",
   "ru": {
    "t": "Для $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$ и перестановочной $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ чему равны PA и AP?",
    "o": [
     "$PA = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$ (строки обменяны), $AP = \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix}$ (столбцы обменяны)",
     "$PA = \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix}$, $AP = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$",
     "$PA = AP = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$",
     "$PA = \\begin{pmatrix}4 & 3 \\\\ 2 & 1\\end{pmatrix}$, $AP = \\begin{pmatrix}4 & 3 \\\\ 2 & 1\\end{pmatrix}$"
    ],
    "e": "Умножение слева действует на строки: PA обменивает строки 1 и 2 матрицы A. Умножение справа действует на столбцы: AP обменивает столбцы 1 и 2. Вообще говоря, $PA \\ne AP$."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$ va permutatsiya $P = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$ uchun PA va AP nimaga teng?",
    "o": [
     "$PA = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$ (satrlar almashgan), $AP = \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix}$ (ustunlar almashgan)",
     "$PA = \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix}$, $AP = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$",
     "$PA = AP = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix}$",
     "$PA = \\begin{pmatrix}4 & 3 \\\\ 2 & 1\\end{pmatrix}$, $AP = \\begin{pmatrix}4 & 3 \\\\ 2 & 1\\end{pmatrix}$"
    ],
    "e": "Chapdan koʻpaytirish satrlarga taʼsir qiladi: PA A ning 1- va 2-satrlarini almashtiradi. Oʻngdan koʻpaytirish ustunlarga taʼsir qiladi: AP 1- va 2-ustunlarni almashtiradi. Umuman $PA \\ne AP$."
   }
  },
  {
   "t": "Find $P^{-1}$ for the permutation matrix $P = \\begin{pmatrix}0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 1 & 0 & 0\\end{pmatrix}$.",
   "o": [
    "$P^{T} = \\begin{pmatrix}0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0\\end{pmatrix}$, since $P^{T} \\cdot P = I$",
    "P itself, since every permutation matrix is its own inverse",
    "$\\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ — the matrix exchanging rows 1 and 3",
    "$P^{-1}$ does not exist because det P = 0"
   ],
   "e": "The columns of P are the distinct unit vectors, so their dot products form I: $P^{T} P = I$ and $P^{-1} = P^{T} = \\begin{pmatrix}0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0\\end{pmatrix}$. A single exchange matrix is its own inverse, but this cyclic P is not.",
   "ru": {
    "t": "Найдите $P^{-1}$ для перестановочной матрицы $P = \\begin{pmatrix}0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 1 & 0 & 0\\end{pmatrix}$.",
    "o": [
     "$P^{T} = \\begin{pmatrix}0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0\\end{pmatrix}$, так как $P^{T} \\cdot P = I$",
     "Сама P, так как каждая перестановочная матрица обратна сама себе",
     "$\\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ — матрица, обменивающая строки 1 и 3",
     "$P^{-1}$ не существует, так как det P = 0"
    ],
    "e": "Столбцы P — различные единичные векторы, поэтому их скалярные произведения образуют I: $P^{T} P = I$ и $P^{-1} = P^{T} = \\begin{pmatrix}0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0\\end{pmatrix}$. Матрица одиночного обмена обратна сама себе, но эта циклическая P — нет."
   },
   "uz": {
    "t": "$P = \\begin{pmatrix}0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 1 & 0 & 0\\end{pmatrix}$ permutatsiya matritsasi uchun $P^{-1}$ ni toping.",
    "o": [
     "$P^{T} = \\begin{pmatrix}0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0\\end{pmatrix}$, chunki $P^{T} \\cdot P = I$",
     "P oʻzi, chunki har qanday permutatsiya matritsa oʻzining teskarisi",
     "$\\begin{pmatrix}0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$ — 1- va 3-satrlarni almashtiruvchi matritsa",
     "$P^{-1}$ mavjud emas, chunki det P = 0"
    ],
    "e": "P ning ustunlari — har xil birlik vektorlar, shuning uchun ularning skalyar koʻpaytmalari I ni hosil qiladi: $P^{T} P = I$ va $P^{-1} = P^{T} = \\begin{pmatrix}0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0\\end{pmatrix}$. Bitta almashuv matritsasi oʻzining teskarisi, lekin bu siklik P unday emas."
   }
  },
  {
   "t": "Which statement about permutation matrices is TRUE?",
   "o": [
    "$P^{T} \\cdot P = I$, so $P^{-1} = P^{T}$; also ||Px|| = ||x|| and $det P = \\pm 1$",
    "det P = +1 for every permutation matrix",
    "$P^{T} = P$ for every permutation matrix",
    "There are $n^{2}$ permutation matrices of order n"
   ],
   "e": "A permutation rearranges the unit vectors, so $P^{T} P = I$, lengths are preserved (||Px|| = ||x||) and $det P = \\pm 1$. A single row exchange already gives det = −1; $P^{T} = P$ holds only for exchange matrices; the number of permutations of n rows is n!, e.g. 6 matrices of order 3.",
   "ru": {
    "t": "Какое утверждение о перестановочных матрицах ВЕРНО?",
    "o": [
     "$P^{T} \\cdot P = I$, поэтому $P^{-1} = P^{T}$; также ||Px|| = ||x|| и $det P = \\pm 1$",
     "det P = +1 для всякой перестановочной матрицы",
     "$P^{T} = P$ для всякой перестановочной матрицы",
     "Перестановочных матриц порядка n всего $n^{2}$"
    ],
    "e": "Перестановка переупорядочивает единичные векторы, поэтому $P^{T} P = I$, длины сохраняются (||Px|| = ||x||) и $det P = \\pm 1$. Уже один обмен строк даёт det = −1; $P^{T} = P$ верно лишь для обменных матриц; всего перестановок n строк n!, например 6 матриц порядка 3."
   },
   "uz": {
    "t": "Permutatsiya matritsalari haqida qaysi gap TOʻGʻRI?",
    "o": [
     "$P^{T} \\cdot P = I$, shuning uchun $P^{-1} = P^{T}$; shuningdek ||Px|| = ||x|| va $det P = \\pm 1$",
     "Har qanday permutatsiya matritsa uchun det P = +1",
     "Har qanday permutatsiya matritsa uchun $P^{T} = P$",
     "n tartibli permutatsiya matritsalari jami $n^{2}$ ta"
    ],
    "e": "Permutatsiya birlik vektorlarni qayta tartiblaydi, shuning uchun $P^{T} P = I$, uzunliklar saqlanadi (||Px|| = ||x||) va $det P = \\pm 1$. Bitta satr almashuvi allaqachon det = −1 beradi; $P^{T} = P$ faqat almashuv matritsalari uchun oʻrinli; n satrning permutatsiyalari soni n!, masalan 3-tartibli 6 ta matritsa."
   }
  },
  {
   "t": "How many $3 \\times 3$ permutation matrices are there, and what are their determinants?",
   "o": [
    "6 = 3! matrices: three with det = +1 (even) and three with det = −1 (odd)",
    "9 matrices, all with det = +1",
    "6 matrices, all with det = −1",
    "3 matrices: the identity and two exchanges"
   ],
   "e": "Three rows can be permuted in 3! = 6 ways. Three permutations are even (I and the two cyclic ones, det +1) and three are odd (the single exchanges $P_{21}$, $P_{32}$, $P_{31}$, det −1).",
   "ru": {
    "t": "Сколько существует перестановочных матриц $3 \\times 3$ и каковы их определители?",
    "o": [
     "6 = 3! матриц: три с det = +1 (чётные) и три с det = −1 (нечётные)",
     "9 матриц, все с det = +1",
     "6 матриц, все с det = −1",
     "3 матрицы: единичная и две обменные"
    ],
    "e": "Три строки можно переставить 3! = 6 способами. Три перестановки чётные (I и две циклические, det +1) и три нечётные (одиночные обмены $P_{21}$, $P_{32}$, $P_{31}$, det −1)."
   },
   "uz": {
    "t": "$3 \\times 3$ permutatsiya matritsalari nechta va determinantlari qanday?",
    "o": [
     "6 = 3! ta: uchtasida det = +1 (juft), uchtasida det = −1 (toq)",
     "9 ta, hammasida det = +1",
     "6 ta, hammasida det = −1",
     "3 ta: birlik matritsa va ikkita almashuv matritsasi"
    ],
    "e": "Uch satrni 3! = 6 xil usulda permutatsiya qilish mumkin. Uchtasi juft (I va ikkita siklik, det +1), uchtasi toq (yakka almashuvlar $P_{21}$, $P_{32}$, $P_{31}$, det −1)."
   }
  },
  {
   "t": "Which of the following sets is a vector space under the usual operations?",
   "o": [
    "The set of all $2 \\times 2$ real matrices",
    "The set of all invertible $2 \\times 2$ matrices",
    "The set of vectors in $\\mathbb{R}^{2}$ with positive coordinates",
    "The set of all unit vectors (length 1) in $\\mathbb{R}^{2}$"
   ],
   "e": "All $m \\times n$ matrices form a vector space (zero matrix; closed under sums and scalar multiples). Invertible matrices fail: I + (−I) = 0 is not invertible. Vectors with positive coordinates fail under multiplication by −1; unit vectors fail under addition (the sum of two unit vectors has length up to 2).",
   "ru": {
    "t": "Какое из следующих множеств является векторным пространством с обычными операциями?",
    "o": [
     "Множество всех вещественных матриц $2 \\times 2$",
     "Множество всех обратимых матриц $2 \\times 2$",
     "Множество векторов $\\mathbb{R}^{2}$ с положительными координатами",
     "Множество всех единичных векторов (длины 1) в $\\mathbb{R}^{2}$"
    ],
    "e": "Все матрицы $m \\times n$ образуют векторное пространство (нулевая матрица; замкнутость относительно сумм и скалярных кратных). Обратимые матрицы не подходят: I + (−I) = 0 необратима. Векторы с положительными координатами нарушают умножение на −1; единичные векторы — сложение (сумма двух единичных векторов имеет длину до 2)."
   },
   "uz": {
    "t": "Quyidagi toʻplamlardan qaysi biri odatiy amallar bilan vektorlar fazosi hisoblanadi?",
    "o": [
     "Barcha $2 \\times 2$ haqiqiy matritsalar toʻplami",
     "Barcha teskari (invertible) $2 \\times 2$ matritsalar toʻplami",
     "Koordinatalari musbat boʻlgan $\\mathbb{R}^{2}$ vektorlari toʻplami",
     "$\\mathbb{R}^{2}$ dagi barcha birlik vektorlar (uzunligi 1) toʻplami"
    ],
    "e": "Barcha $m \\times n$ matritsalar vektorlar fazosini hosil qiladi (nol matritsa; yigʻindilar va skalar koʻpaytmalarga nisbatan yopiq). Teskari matritsalar mos kelmaydi: I + (−I) = 0 teskari emas. Musbat koordinatali vektorlar −1 ga koʻpaytirishda, birlik vektorlar esa qoʻshishda buziladi (ikkita birlik vektor yigʻindisining uzunligi 2 gacha yetadi)."
   }
  },
  {
   "t": "Is S = {(x, y): y = 3x + 2} a subspace of $\\mathbb{R}^{2}$?",
   "o": [
    "No — the zero vector fails the equation: $3 \\cdot 0 + 2 = 2 \\ne 0$, and every subspace must contain the origin",
    "Yes — every straight line in $\\mathbb{R}^{2}$ is a subspace",
    "Yes — the set is closed under addition because the equation is linear",
    "No — because the equation y = 3x + 2 has no solutions at all"
   ],
   "e": "A subspace must contain the zero vector, but (0, 0) does not satisfy the equation: $3 \\cdot 0 + 2 = 2 \\ne 0$. A shifted line does not pass through the origin; the line y = 3x (no shift) would be a subspace.",
   "ru": {
    "t": "Является ли S = {(x, y): y = 3x + 2} подпространством $\\mathbb{R}^{2}$?",
    "o": [
     "Нет — нулевой вектор не удовлетворяет уравнению: $3 \\cdot 0 + 2 = 2 \\ne 0$, а всякое подпространство обязано содержать начало координат",
     "Да — всякая прямая в $\\mathbb{R}^{2}$ является подпространством",
     "Да — множество замкнуто относительно сложения, так как уравнение линейно",
     "Нет — потому что у уравнения y = 3x + 2 вообще нет решений"
    ],
    "e": "Подпространство обязано содержать нулевой вектор, но (0, 0) не удовлетворяет уравнению: $3 \\cdot 0 + 2 = 2 \\ne 0$. Сдвинутая прямая не проходит через начало координат; прямая y = 3x (без сдвига) была бы подпространством."
   },
   "uz": {
    "t": "S = {(x, y): y = 3x + 2} toʻplami $\\mathbb{R}^{2}$ ning pastki fazosimi?",
    "o": [
     "Yoʻq — nol vektor tenglamani qanoatlantirmaydi: $3 \\cdot 0 + 2 = 2 \\ne 0$, har qanday pastki fazo bosh nuqtani oʻz ichiga olishi shart",
     "Ha — $\\mathbb{R}^{2}$ dagi har qanday toʻgʻri chiziq pastki faza",
     "Ha — tenglama chiziqli boʻlgani uchun toʻplam qoʻshishga nisbatan yopiq",
     "Yoʻq — chunki y = 3x + 2 tenglamasining umuman yechimi yoʻq"
    ],
    "e": "Pastki fazo nol vektorni oʻz ichiga olishi shart, lekin (0, 0) tenglamani qanoatlantirmaydi: $3 \\cdot 0 + 2 = 2 \\ne 0$. Surilgan toʻgʻri chiziq bosh nuqtadan oʻtmaydi; y = 3x chizigʻi (surilmasiz) pastki faza boʻlardi."
   }
  },
  {
   "t": "Is $W = \\{(x, y): x \\ge 0\\} a$ subspace of $\\mathbb{R}^{2}$?",
   "o": [
    "No: (1, 0) is in W but $(-1) \\cdot (1, 0) = (-1, 0)$ is not — W is not closed under scalar multiplication",
    "Yes: W contains the zero vector and is closed under addition",
    "No: the zero vector does not belong to W",
    "Yes: every half-plane is a subspace"
   ],
   "e": "The zero vector is in W, and sums of nonnegative x-coordinates stay nonnegative, but closure under scalars fails: multiply (1, 0) by −1. The subspace test requires all three conditions — zero, sums, scalar multiples.",
   "ru": {
    "t": "Является ли $W = \\{(x, y): x \\ge 0\\}$ подпространством $\\mathbb{R}^{2}$?",
    "o": [
     "Нет: (1, 0) лежит в W, но $(-1) \\cdot (1, 0) = (-1, 0)$ уже нет — W не замкнуто относительно скалярного умножения",
     "Да: W содержит нулевой вектор и замкнуто относительно сложения",
     "Нет: нулевой вектор не принадлежит W",
     "Да: всякая полуплоскость является подпространством"
    ],
    "e": "Нулевой вектор лежит в W, и суммы неотрицательных абсцисс неотрицательны, но замкнутость относительно скаляров нарушена: умножьте (1, 0) на −1. Тест подпространства требует всех трёх условий — нулевой вектор, суммы, скалярные кратные."
   },
   "uz": {
    "t": "$W = \\{(x, y): x \\ge 0\\}$ toʻplami $\\mathbb{R}^{2}$ ning pastki fazasimi?",
    "o": [
     "Yoʻq: (1, 0) W da yotadi, lekin $(-1) \\cdot (1, 0) = (-1, 0)$ yotmaydi — W skalar koʻpaytmaga nisbatan yopiq emas",
     "Ha: W nol vektorni oʻz ichiga oladi va qoʻshishga nisbatan yopiq",
     "Yoʻq: nol vektor W ga tegishli emas",
     "Ha: har qanday yarim tekislik pastki faza"
    ],
    "e": "Nol vektor W da yotadi va manfiy boʻlmagan abscissalar yigʻindisi manfiy boʻlmaydi, lekin skalar koʻpaytmaga yopqlik buziladi: (1, 0) ni −1 ga koʻpaytiring. Pastki fazo testi uch shartning hammasini — nol vektor, yigʻindilar, skalar koʻpaytmalarni talab qiladi."
   }
  },
  {
   "t": "Is $\\mathbb{R}^{2}$ a subspace of $\\mathbb{R}^{3}$?",
   "o": [
    "No — $\\mathbb{R}^{2}$ is not even a subset of $\\mathbb{R}^{3}$: vectors of $\\mathbb{R}^{3}$ have three components. The plane {(x, y, 0)} is a subspace of $\\mathbb{R}^{3}$, but it is not the same set as $\\mathbb{R}^{2}$",
    "Yes — $\\mathbb{R}^{2}$ sits inside $\\mathbb{R}^{3}$ as the plane z = 0",
    "Yes — every vector space is a subspace of every other vector space",
    "No — because $\\mathbb{R}^{2}$ is not closed under addition"
   ],
   "e": "Vectors (x, y) have two components while vectors of $\\mathbb{R}^{3}$ have three, so $\\mathbb{R}^{2}$ is not a subset of $\\mathbb{R}^{3}$ and cannot be a subspace. The plane z = 0 inside $\\mathbb{R}^{3}$ is a subspace that looks like $\\mathbb{R}^{2}$, but as a set it consists of triples (x, y, 0).",
   "ru": {
    "t": "Является ли $\\mathbb{R}^{2}$ подпространством $\\mathbb{R}^{3}$?",
    "o": [
     "Нет — $\\mathbb{R}^{2}$ даже не является подмножеством $\\mathbb{R}^{3}$: у векторов $\\mathbb{R}^{3}$ три координаты. Плоскость {(x, y, 0)} — подпространство $\\mathbb{R}^{3}$, но это не то же множество, что $\\mathbb{R}^{2}$",
     "Да — $\\mathbb{R}^{2}$ лежит внутри $\\mathbb{R}^{3}$ как плоскость z = 0",
     "Да — всякое векторное пространство является подпространством любого другого",
     "Нет — потому что $\\mathbb{R}^{2}$ не замкнуто относительно сложения"
    ],
    "e": "Векторы (x, y) имеют две координаты, а векторы $\\mathbb{R}^{3}$ — три, поэтому $\\mathbb{R}^{2}$ не подмножество $\\mathbb{R}^{3}$ и подпространством быть не может. Плоскость z = 0 внутри $\\mathbb{R}^{3}$ — подпространство, «похожее» на $\\mathbb{R}^{2}$, но как множество оно состоит из троек (x, y, 0)."
   },
   "uz": {
    "t": "$\\mathbb{R}^{2}$ fazosi $\\mathbb{R}^{3}$ ning pastki fazosimi?",
    "o": [
     "Yoʻq — $\\mathbb{R}^{2}$ hatto $\\mathbb{R}^{3}$ ning toʻplami ham emas: $\\mathbb{R}^{3}$ vektorlarida uchta koordinata bor. {(x, y, 0)} tekisligi $\\mathbb{R}^{3}$ ning pastki fazosi, lekin $u \\mathbb{R}^{2}$ bilan bir xil toʻplam emas",
     "Ha — $\\mathbb{R}^{2}$ ichida $\\mathbb{R}^{3}$ sifatida z = 0 tekisligida yotadi",
     "Ha — har qanday vektorlar fazosi boshqa har qanday fazoning pastki fazasi",
     "Yoʻq — chunki $\\mathbb{R}^{2}$ qoʻshishga nisbatan yopiq emas"
    ],
    "e": "(x, y) vektorlarda ikkita koordinata, $\\mathbb{R}^{3}$ vektorlarida esa uchta boʻladi, shuning uchun $\\mathbb{R}^{2}$ — $\\mathbb{R}^{3}$ ning toʻplami emas va pastki faza boʻla olmaydi. $\\mathbb{R}^{3}$ ichidagi z = 0 tekisligi $\\mathbb{R}^{2}$ ga «oʻxshash» pastki faza, lekin toʻplam sifatida u (x, y, 0) uchliklaridan iborat."
   }
  },
  {
   "t": "Describe the null space N(A) of $A = \\begin{pmatrix}1 & 2\\end{pmatrix}$.",
   "o": [
    "N(A) = span{(−2, 1)} — a line in $\\mathbb{R}^{2}$",
    "N(A) = span{(1, 2)} — the row itself",
    "N(A) = span{(2, 1)}",
    "$N(A) = \\mathbb{R}^{2}$, since A has only one row"
   ],
   "e": "Ax = 0 reads $x_{1} + 2x_{2} = 0$, so $x_{1} = -2x_{2}$: the solutions are the multiples of (−2, 1). Check: $\\begin{pmatrix}1 & 2\\end{pmatrix} \\cdot (-2, 1) = -2 + 2 = 0$. One equation in two unknowns leaves a line of solutions through the origin.",
   "ru": {
    "t": "Опишите нуль-пространство N(A) матрицы $A = \\begin{pmatrix}1 & 2\\end{pmatrix}$.",
    "o": [
     "N(A) = span{(−2, 1)} — прямая в $\\mathbb{R}^{2}$",
     "N(A) = span{(1, 2)} — сама строка",
     "N(A) = span{(2, 1)}",
     "$N(A) = \\mathbb{R}^{2}$, так как в A всего одна строка"
    ],
    "e": "Уравнение Ax = 0 имеет вид $x_{1} + 2x_{2} = 0$, откуда $x_{1} = -2x_{2}$: решения — кратные вектора (−2, 1). Проверка: $\\begin{pmatrix}1 & 2\\end{pmatrix} \\cdot (-2, 1) = -2 + 2 = 0$. Одно уравнение с двумя неизвестными оставляет прямую решений через начало координат."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2\\end{pmatrix}$ matritsaning nol-fazosi N(A) ni taʼriflang.",
    "o": [
     "N(A) = span{(−2, 1)} — $\\mathbb{R}^{2}$ dagi toʻgʻri chiziq",
     "N(A) = span{(1, 2)} — satrning oʻzi",
     "N(A) = span{(2, 1)}",
     "$N(A) = \\mathbb{R}^{2}$, chunki A da faqat bitta satr bor"
    ],
    "e": "Ax = 0 tenglamasi $x_{1} + 2x_{2} = 0$ koʻrinishida, demak $x_{1} = -2x_{2}$: yechimlar (−2, 1) vektorning koʻpaytmalari. Tekshirish: $\\begin{pmatrix}1 & 2\\end{pmatrix} \\cdot (-2, 1) = -2 + 2 = 0$. Ikkita nomaʼlumli bitta tenglama bosh nuqtadan oʻtuvchi yechimlar toʻgʻri chizigʻini qoldiradi."
   }
  },
  {
   "t": "Is the vector (3, 5) in span{(1, 1), (1, −1)}?",
   "o": [
    "Yes: $(3, 5) = 4 \\cdot (1, 1) - 1 \\cdot (1, -1)$",
    "No: (3, 5) is a multiple of neither (1, 1) nor (1, −1)",
    "Yes: $(3, 5) = 2 \\cdot (1, 1) + 1 \\cdot (1, -1)$",
    "No: the span of two vectors in $\\mathbb{R}^{2}$ is always a line"
   ],
   "e": "Solve $c_{1} + c_{2} = 3$ and $c_{1} - c_{2} = 5$: adding gives $2c_{1} = 8$, so $c_{1} = 4$ and $c_{2} = -1$. Hence (3, 5) = 4(1, 1) − (1, −1) belongs to the span — which here is all of $\\mathbb{R}^{2}$, since the two vectors are independent.",
   "ru": {
    "t": "Лежит ли вектор (3, 5) в span{(1, 1), (1, −1)}?",
    "o": [
     "Да: $(3, 5) = 4 \\cdot (1, 1) - 1 \\cdot (1, -1)$",
     "Нет: (3, 5) не кратно ни (1, 1), ни (1, −1)",
     "Да: $(3, 5) = 2 \\cdot (1, 1) + 1 \\cdot (1, -1)$",
     "Нет: оболочка двух векторов в $\\mathbb{R}^{2}$ — всегда прямая"
    ],
    "e": "Решите $c_{1} + c_{2} = 3$ и $c_{1} - c_{2} = 5$: сложение даёт $2c_{1} = 8$, откуда $c_{1} = 4$ и $c_{2} = -1$. Значит, (3, 5) = 4(1, 1) − (1, −1) лежит в оболочке — которая здесь всё $\\mathbb{R}^{2}$, так как векторы независимы."
   },
   "uz": {
    "t": "(3, 5) vektor span{(1, 1), (1, −1)} da yotadimi?",
    "o": [
     "Ha: $(3, 5) = 4 \\cdot (1, 1) - 1 \\cdot (1, -1)$",
     "Yoʻq: (3, 5) na (1, 1), na (1, −1) ga karrali",
     "Ha: $(3, 5) = 2 \\cdot (1, 1) + 1 \\cdot (1, -1)$",
     "Yoʻq: $\\mathbb{R}^{2}$ dagi ikki vektorning qobiq doim toʻgʻri chiziq"
    ],
    "e": "$c_{1} + c_{2} = 3$ va $c_{1} - c_{2} = 5$ ni yechamiz: qoʻshsak $2c_{1} = 8$, demak $c_{1} = 4$ va $c_{2} = -1$. Shuning uchun (3, 5) = 4(1, 1) − (1, −1) qobiqda yotadi — vektorlar mustaqil boʻlgani uchun qobiq bu yerda butun $\\mathbb{R}^{2}$."
   }
  },
  {
   "t": "Describe the column space C(A) of $A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4 \\\\ 0 & 0\\end{pmatrix}$.",
   "o": [
    "C(A) = span{(1, 2, 0)} — a line in $\\mathbb{R}^{3}$, because column 2 is twice column 1",
    "C(A) = the whole plane z = 0 in $\\mathbb{R}^{3}$",
    "$C(A) = \\mathbb{R}^{3}$",
    "C(A) = {0}, the zero subspace"
   ],
   "e": "The columns (1, 2, 0) and (2, 4, 0) are proportional, so every combination is a multiple of (1, 2, 0): C(A) is a line. For instance $(3, 6, 0) = A \\cdot \\begin{pmatrix}3 \\\\ 0\\end{pmatrix}$ lies in C(A), but (1, 2, 1) does not (its third coordinate is nonzero).",
   "ru": {
    "t": "Опишите столбцовое пространство C(A) матрицы $A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4 \\\\ 0 & 0\\end{pmatrix}$.",
    "o": [
     "C(A) = span{(1, 2, 0)} — прямая в $\\mathbb{R}^{3}$, так как столбец 2 вдвое больше столбца 1",
     "C(A) = вся плоскость z = 0 в $\\mathbb{R}^{3}$",
     "$C(A) = \\mathbb{R}^{3}$",
     "C(A) = {0} — нулевое подпространство"
    ],
    "e": "Столбцы (1, 2, 0) и (2, 4, 0) пропорциональны, поэтому любая комбинация кратна (1, 2, 0): C(A) — прямая. Например, $(3, 6, 0) = A \\cdot \\begin{pmatrix}3 \\\\ 0\\end{pmatrix}$ лежит в C(A), а (1, 2, 1) — нет (третья координата ненулевая)."
   },
   "uz": {
    "t": "$A = \\begin{pmatrix}1 & 2 \\\\ 2 & 4 \\\\ 0 & 0\\end{pmatrix}$ matritsaning ustunlar fazosi C(A) ni taʼriflang.",
    "o": [
     "C(A) = span{(1, 2, 0)} — $\\mathbb{R}^{3}$ dagi toʻgʻri chiziq, chunki 2-ustun 1-ustunning ikki barobari",
     "$C(A) = \\mathbb{R}^{3}$ dagi butun z = 0 tekisligi",
     "$C(A) = \\mathbb{R}^{3}$",
     "C(A) = {0} — nol pastki fazо"
    ],
    "e": "(1, 2, 0) va (2, 4, 0) ustunlari proporsional, shuning uchun har qanday kombinatsiya (1, 2, 0) koʻpaytmasi: C(A) — toʻgʻri chiziq. Masalan, $(3, 6, 0) = A \\cdot \\begin{pmatrix}3 \\\\ 0\\end{pmatrix} C(A) da$ yotadi, lekin (1, 2, 1) yotmaydi (uchinchi koordinatasi noldan farq qiladi)."
   }
  },
  {
   "t": "The system Ax = b has a solution if and only if:",
   "o": [
    "b lies in the column space C(A) — b is a combination of the columns of A",
    "b is a combination of the rows of A",
    "b is nonzero",
    "A is a square matrix"
   ],
   "e": "$Ax = x_{1} \\cdot a_{1}$ + ... + $x_{n} \\cdot a_{n}$ produces exactly the combinations of the columns, so a solution exists precisely when b is in C(A). This is the master criterion for solvability: the system is solvable ⇔ b ∈ C(A).",
   "ru": {
    "t": "Система Ax = b имеет решение тогда и только тогда, когда:",
    "o": [
     "b лежит в столбцовом пространстве C(A) — b является комбинацией столбцов A",
     "b является комбинацией строк A",
     "b ненулевой",
     "A — квадратная матрица"
    ],
    "e": "$Ax = x_{1} \\cdot a_{1}$ + ... + $x_{n} \\cdot a_{n}$ порождает в точности комбинации столбцов, поэтому решение существует ровно тогда, когда b лежит в C(A). Это главный критерий разрешимости: система разрешима ⇔ b ∈ C(A)."
   },
   "uz": {
    "t": "Ax = b sistemasi yechimga ega boʻlsa va faqat:",
    "o": [
     "b ustunlar fazosida C(A) yotsa — b A ustunlarining kombinatsiyasi boʻlsa",
     "b A satrlarining kombinatsiyasi boʻlsa",
     "b noldan farq qilgan vektor boʻlsa",
     "A kvadrat matritsa boʻlsa"
    ],
    "e": "$Ax = x_{1} \\cdot a_{1}$ + ... + $x_{n} \\cdot a_{n}$ aynan ustunlar kombinatsiyalarini hosil qiladi, shuning uchun yechim faqat b C(A) da yotganda mavjud. Bu — yechiluvchanlikning asosiy mezonlari: sistema yechiladi ⇔ b ∈ C(A)."
   }
  },
  {
   "t": "Which vector lies in the null space N(A) of $A = \\begin{pmatrix}1 & 2 & -1\\end{pmatrix}$?",
   "o": [
    "(1, 0, 1)",
    "(1, 1, 1)",
    "(−2, 1, 1)",
    "(1, 2, 3)"
   ],
   "e": "N(A) consists of the solutions of $x_{1} + 2x_{2} - x_{3} = 0$. Testing (1, 0, 1): 1 + 0 − 1 = 0 — it works. The other candidates give 2, −1 and 2. In fact N(A) = span{(−2, 1, 0), (1, 0, 1)} — a plane in $\\mathbb{R}^{3}$.",
   "ru": {
    "t": "Какой вектор лежит в нуль-пространстве N(A) матрицы $A = \\begin{pmatrix}1 & 2 & -1\\end{pmatrix}$?",
    "o": [
     "(1, 0, 1)",
     "(1, 1, 1)",
     "(−2, 1, 1)",
     "(1, 2, 3)"
    ],
    "e": "N(A) — решения уравнения $x_{1} + 2x_{2} - x_{3} = 0$. Проверка (1, 0, 1): 1 + 0 − 1 = 0 — подходит. Остальные кандидаты дают 2, −1 и 2. На самом деле N(A) = span{(−2, 1, 0), (1, 0, 1)} — плоскость в $\\mathbb{R}^{3}$."
   },
   "uz": {
    "t": "Qaysi vektor $A = \\begin{pmatrix}1 & 2 & -1\\end{pmatrix}$ matritsaning nol-fazosida N(A) yotadi?",
    "o": [
     "(1, 0, 1)",
     "(1, 1, 1)",
     "(−2, 1, 1)",
     "(1, 2, 3)"
    ],
    "e": "N(A) — $x_{1} + 2x_{2} - x_{3} = 0$ tenglamasining yechimlari. (1, 0, 1) ni tekshiramiz: 1 + 0 − 1 = 0 — mos keladi. Qolgan nomzodlar 2, −1 va 2 beradi. Aslida N(A) = span{(−2, 1, 0), (1, 0, 1)} — $\\mathbb{R}^{3}$ dagi tekislik."
   }
  },
  {
   "t": "Ax = b is solvable and $x_{p}$ is one particular solution. The complete solution is:",
   "o": [
    "$x = x_{p} + x_{n}$, where $x_{n}$ is any vector of the null space N(A)",
    "$x = x_{p}$ alone — the solution is always unique",
    "$x = x_{p} + x_{n}$, where $x_{n}$ is any vector of the column space C(A)",
    "$x = b + x_{n}$, where $x_{n}$ is in N(A)"
   ],
   "e": "If x is any solution, then $A(x - x_{p}) = b - b = 0$, so $x - x_{p}$ is in N(A): every solution is $x_{p}$ plus a null-space vector. The null space is a subspace, but for $b \\ne 0$ the solution set of Ax = b is its shifted copy and contains no zero vector.",
   "ru": {
    "t": "Система Ax = b разрешима, $x_{p}$ — одно частное решение. Полное решение имеет вид:",
    "o": [
     "$x = x_{p} + x_{n}$, где $x_{n}$ — любой вектор нуль-пространства N(A)",
     "$x = x_{p}$ — решение всегда единственно",
     "$x = x_{p} + x_{n}$, где $x_{n}$ — любой вектор столбцового пространства C(A)",
     "$x = b + x_{n}$, где $x_{n}$ из N(A)"
    ],
    "e": "Если x — любое решение, то $A(x - x_{p}) = b - b = 0$, поэтому $x - x_{p}$ лежит в N(A): каждое решение есть $x_{p}$ плюс вектор нуль-пространства. N(A) — подпространство, а при $b \\ne 0$ множество решений Ax = b — его сдвинутая копия, не содержащая нулевого вектора."
   },
   "uz": {
    "t": "Ax = b sistemasida yechim mavjud, $x_{p}$ — bitta xos yechim. Toʻliq yechim qanday koʻrinishda?",
    "o": [
     "$x = x_{p} + x_{n}$, bu yerda $x_{n}$ — nol-fazо N(A) ning ixtiyoriy vektori",
     "$x = x_{p}$ — yechim har doim yagona",
     "$x = x_{p} + x_{n}$, bu yerda $x_{n}$ — ustunlar fazosi C(A) ning ixtiyoriy vektori",
     "$x = b + x_{n}$, bu yerda $x_{n}$ — N(A) dan"
    ],
    "e": "Agar x ixtiyoriy yechim boʻlsa, $A(x - x_{p}) = b - b = 0$, demak $x - x_{p} N(A) da$ yotadi: har qanday yechim $x_{p}$ plus nol-fazо vektori. N(A) pastki fazо, $b \\ne 0$ boʻlganda esa Ax = b yechimlar toʻplami — uning surilgan nusxasi boʻlib, nol vektorni oʻz ichiga olmaydi."
   }
  }
 ]
};
