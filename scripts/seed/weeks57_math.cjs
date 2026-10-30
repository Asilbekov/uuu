module.exports = {
 "title": "Math I & Linear Algebra: Weeks 5-7 Complete Test",
 "description": "Weeks 5-7 in one test: continuity, inverse functions and Weierstrass theorem; derivatives and related rates (Math I); geometry and elimination, matrix operations, inverses, LU/LDU factorizations, transposes, permutations, vector spaces and subspaces (Linear Algebra I). The full study-guide PDFs (RU/EN/UZ) are attached.",
 "topic": "Mathematics",
 "attachments": [
  {
   "title": "Study Guide (EN) — Linear Algebra & Math I, Weeks 5-7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Study_Guide_Weeks_5-7_EN.pdf",
   "size": null
  },
  {
   "title": "Study Guide (RU) — Линейная алгебра I и Math I, недели 5–7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Study_Guide_Weeks_5-7_RU.pdf",
   "size": null
  },
  {
   "title": "Study Guide (UZ) — Chiziqli algebra va Math I, 5–7 haftalar",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Study_Guide_Weeks_5-7_UZ.pdf",
   "size": null
  },
  {
   "title": "Course file: Guide to MIDTERM EXAM Preparation (Math I)",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/course-files/math-1-mathematical-analysis/Guide_to_MIDTERM_EXAM.pdf",
   "size": null
  }
 ],
 "questions": [
  {
   "t": "A function f is continuous at a point x = a when:",
   "o": [
    "lim x→a f(x) = f(a) — that is, f(a) is defined, the limit exists, and they are equal",
    "lim x→a f(x) exists, but it may differ from f(a)",
    "f(a) is defined, regardless of the limit",
    "lim x→a− f(x) and lim x→a+ f(x) both exist"
   ],
   "e": "Continuity at a requires all three conditions: f(a) is defined, lim x→a f(x) exists, and the limit equals the value of the function. The one-line form is lim x→a f(x) = f(a).",
   "ru": {
    "t": "Функция f непрерывна в точке x = a, если:",
    "o": [
     "lim x→a f(x) = f(a) — то есть f(a) определена, предел существует и они равны",
     "lim x→a f(x) существует, но может отличаться от f(a)",
     "f(a) определена, независимо от предела",
     "lim x→a− f(x) и lim x→a+ f(x) оба существуют"
    ],
    "e": "Непрерывность в точке a требует всех трёх условий: f(a) определена, lim x→a f(x) существует и предел равен значению функции. Однострочная форма: lim x→a f(x) = f(a)."
   },
   "uz": {
    "t": "f funksiya x = a nuqtada uzluksiz boʻladi, agar:",
    "o": [
     "lim x→a f(x) = f(a) — yaʼni f(a) aniqlangan, limit mavjud va ular teng",
     "lim x→a f(x) mavjud, lekin f(a) dan farq qilishi mumkin",
     "f(a) aniqlangan, limitga qaramasdan",
     "lim x→a− f(x) va lim x→a+ f(x) ikkalasi ham mavjud"
    ],
    "e": "a nuqtada uzluksizlik uch shartni talab qiladi: f(a) aniqlangan, lim x→a f(x) mavjud va limit funksiya qiymatiga teng. Bir qatorli shakl: lim x→a f(x) = f(a)."
   }
  },
  {
   "t": "Using the definition of continuity, decide whether f(x) = (x^2 − 4)/(x − 2) is continuous at x = 2.",
   "o": [
    "Discontinuous, because f(2) is not defined (the discontinuity is removable: lim x→2 f(x) = 4)",
    "Continuous, because the limit exists",
    "Discontinuous, because lim x→2 f(x) does not exist",
    "Continuous, because the numerator and the denominator are polynomials"
   ],
   "e": "At x = 2 the formula gives 0/0, so f(2) is undefined — the first condition of continuity fails. For x ≠ 2, f(x) = x + 2, so lim x→2 f(x) = 4 exists: the discontinuity is removable.",
   "ru": {
    "t": "По определению непрерывности определите, непрерывна ли f(x) = (x^2 − 4)/(x − 2) в точке x = 2.",
    "o": [
     "Разрывна, поскольку f(2) не определена (разрыв устранимый: lim x→2 f(x) = 4)",
     "Непрерывна, поскольку предел существует",
     "Разрывна, поскольку lim x→2 f(x) не существует",
     "Непрерывна, поскольку числитель и знаменатель — полиномы"
    ],
    "e": "В точке x = 2 формула даёт 0/0, то есть f(2) не определена — нарушено первое условие непрерывности. При x ≠ 2 f(x) = x + 2, поэтому lim x→2 f(x) = 4 существует: разрыв устранимый."
   },
   "uz": {
    "t": "Uzluksizlik taʼrifi boʻyicha f(x) = (x^2 − 4)/(x − 2) funksiyasi x = 2 nuqtada uzluksizmi aniqlang.",
    "o": [
     "Uzluksiz emas, chunki f(2) aniqlanmagan (uzilish olib tashlanadigan: lim x→2 f(x) = 4)",
     "Uzluksiz, chunki limit mavjud",
     "Uzluksiz emas, chunki lim x→2 f(x) mavjud emas",
     "Uzluksiz, chunki surat va maxraj polinomlar"
    ],
    "e": "x = 2 da formula 0/0 beradi, yaʼni f(2) aniqlanmagan — uzluksizlikning birinchi sharti buziladi. x ≠ 2 uchun f(x) = x + 2, shuning uchun lim x→2 f(x) = 4 mavjud: uzilish olib tashlanadigan."
   }
  },
  {
   "t": "Determine whether f(x) = {−x^2 + 4, if x ≤ 3; 4x − 8, if x > 3} is continuous at x = 3.",
   "o": [
    "Discontinuous: the one-sided limits are −5 and 4, so the limit does not exist (a jump)",
    "Continuous: f(3) = −5 and the limit equals −5",
    "Discontinuous: f(3) is not defined",
    "Continuous: both branches give the same value at x = 3"
   ],
   "e": "f(3) = −9 + 4 = −5; lim x→3− f(x) = −5, but lim x→3+ f(x) = 4·3 − 8 = 4. The one-sided limits differ, so lim x→3 f(x) does not exist — a jump discontinuity.",
   "ru": {
    "t": "Определите, непрерывна ли функция f(x) = {−x^2 + 4, если x ≤ 3; 4x − 8, если x > 3} в точке x = 3.",
    "o": [
     "Разрывна: односторонние пределы равны −5 и 4, поэтому предела не существует (скачок)",
     "Непрерывна: f(3) = −5 и предел равен −5",
     "Разрывна: f(3) не определена",
     "Непрерывна: обе ветви дают одинаковое значение при x = 3"
    ],
    "e": "f(3) = −9 + 4 = −5; lim x→3− f(x) = −5, но lim x→3+ f(x) = 4·3 − 8 = 4. Односторонние пределы различны, поэтому lim x→3 f(x) не существует — разрыв-скачок."
   },
   "uz": {
    "t": "f(x) = {−x^2 + 4, agar x ≤ 3; 4x − 8, agar x > 3} funksiyasi x = 3 nuqtada uzluksizmi?",
    "o": [
     "Uzluksiz emas: bir tomonlama limitlar −5 va 4, shuning uchun limit mavjud emas (sakrash)",
     "Uzluksiz: f(3) = −5 va limit −5 ga teng",
     "Uzluksiz emas: f(3) aniqlanmagan",
     "Uzluksiz: ikkala shox x = 3 da bir xil qiymat beradi"
    ],
    "e": "f(3) = −9 + 4 = −5; lim x→3− f(x) = −5, lekin lim x→3+ f(x) = 4·3 − 8 = 4. Bir tomonlama limitlar farq qiladi, shuning uchun lim x→3 f(x) mavjud emas — sakrash uzilishi."
   }
  },
  {
   "t": "Is f(x) = {sin(x)/x, if x ≠ 0; 1, if x = 0} continuous at x = 0?",
   "o": [
    "Yes: f(0) = 1 and lim x→0 sin(x)/x = 1, so all three conditions hold",
    "No: f(0) is not defined",
    "No: lim x→0 sin(x)/x does not exist",
    "Yes: sin(x)/x is a polynomial, and polynomials are continuous everywhere"
   ],
   "e": "f(0) = 1 is defined, and the standard limit lim x→0 sin(x)/x = 1 exists and equals f(0). All three continuity conditions are satisfied.",
   "ru": {
    "t": "Непрерывна ли функция f(x) = {sin(x)/x, если x ≠ 0; 1, если x = 0} в точке x = 0?",
    "o": [
     "Да: f(0) = 1 и lim x→0 sin(x)/x = 1 — выполнены все три условия",
     "Нет: f(0) не определена",
     "Нет: lim x→0 sin(x)/x не существует",
     "Да: sin(x)/x — полином, а полиномы непрерывны всюду"
    ],
    "e": "f(0) = 1 определена, замечательный предел lim x→0 sin(x)/x = 1 существует и равен f(0). Все три условия непрерывности выполнены."
   },
   "uz": {
    "t": "f(x) = {sin(x)/x, agar x ≠ 0; 1, agar x = 0} funksiyasi x = 0 nuqtada uzluksizmi?",
    "o": [
     "Ha: f(0) = 1 va lim x→0 sin(x)/x = 1 — uchala shart ham bajarilgan",
     "Yoʻq: f(0) aniqlanmagan",
     "Yoʻq: lim x→0 sin(x)/x mavjud emas",
     "Ha: sin(x)/x — polinom, polinomlar esa hamma joyda uzluksiz"
    ],
    "e": "f(0) = 1 aniqlangan va mashhur limit lim x→0 sin(x)/x = 1 mavjud, f(0) ga teng. Uchala uzluksizlik sharti bajarilgan."
   }
  },
  {
   "t": "For f(x) = x/(x^2 − x), classify the discontinuities at x = 0 and x = 1.",
   "o": [
    "x = 0 is removable (lim x→0 f(x) = −1); x = 1 is infinite",
    "x = 0 is infinite; x = 1 is removable",
    "Both are removable",
    "Both are infinite"
   ],
   "e": "x^2 − x = x(x − 1), so for x ≠ 0, 1 we have f(x) = 1/(x − 1). At x = 0 the limit is −1 — a hole that can be fixed by defining f(0) = −1; at x = 1 the one-sided limits are ±∞ (a vertical asymptote).",
   "ru": {
    "t": "Для f(x) = x/(x^2 − x) классифицируйте разрывы в точках x = 0 и x = 1.",
    "o": [
     "x = 0 — устранимый (lim x→0 f(x) = −1); x = 1 — бесконечный",
     "x = 0 — бесконечный; x = 1 — устранимый",
     "Оба устранимые",
     "Оба бесконечные"
    ],
    "e": "x^2 − x = x(x − 1), поэтому при x ≠ 0, 1 имеем f(x) = 1/(x − 1). В точке x = 0 предел равен −1 — «дырка», устранимая доопределением f(0) = −1; в точке x = 1 односторонние пределы ±∞ (вертикальная асимптота)."
   },
   "uz": {
    "t": "f(x) = x/(x^2 − x) uchun x = 0 va x = 1 nuqtalardagi uzilishlarni tasniflang.",
    "o": [
     "x = 0 — olib tashlanadigan (lim x→0 f(x) = −1); x = 1 — cheksiz",
     "x = 0 — cheksiz; x = 1 — olib tashlanadigan",
     "Ikkalasi ham olib tashlanadigan",
     "Ikkalasi ham cheksiz"
    ],
    "e": "x^2 − x = x(x − 1), shuning uchun x ≠ 0, 1 da f(x) = 1/(x − 1). x = 0 da limit −1 — f(0) = −1 deb belgilash bilan olib tashlanadigan tuynuk; x = 1 da bir tomonlama limitlar ±∞ (vertikal asimptota)."
   }
  },
  {
   "t": "Where is f(x) = 5/(e^x − 2) discontinuous, and what type of discontinuity is it?",
   "o": [
    "At x = ln 2 — an infinite discontinuity (vertical asymptote)",
    "At x = 2 — a jump",
    "At x = ln 2 — a removable discontinuity",
    "Nowhere: f is continuous on all of R"
   ],
   "e": "The denominator vanishes when e^x = 2, i.e. at x = ln 2. As x → ln 2 the one-sided limits are −∞ and +∞, so x = ln 2 is an infinite discontinuity.",
   "ru": {
    "t": "Где разрывна функция f(x) = 5/(e^x − 2) и каков тип разрыва?",
    "o": [
     "В точке x = ln 2 — бесконечный разрыв (вертикальная асимптота)",
     "В точке x = 2 — скачок",
     "В точке x = ln 2 — устранимый разрыв",
     "Нигде: f непрерывна на всей R"
    ],
    "e": "Знаменатель обращается в ноль при e^x = 2, то есть при x = ln 2. При x → ln 2 односторонние пределы равны −∞ и +∞, значит, x = ln 2 — точка бесконечного разрыва."
   },
   "uz": {
    "t": "f(x) = 5/(e^x − 2) funksiyasi qayerda uzluksiz emas va uzilish qaysi turda?",
    "o": [
     "x = ln 2 nuqtada — cheksiz uzilish (vertikal asimptota)",
     "x = 2 nuqtada — sakrash",
     "x = ln 2 nuqtada — olib tashlanadigan uzilish",
     "Hech qayerda: f butun R da uzluksiz"
    ],
    "e": "Maxraj e^x = 2, yaʼni x = ln 2 da nolga aylanadi. x → ln 2 da bir tomonlama limitlar −∞ va +∞, demak x = ln 2 — cheksiz uzilish nuqtasi."
   }
  },
  {
   "t": "Find k so that f(x) = {(x^2 − 9)/(x − 3), if x ≠ 3; k, if x = 3} is continuous at x = 3.",
   "o": [
    "k = 6",
    "k = 3",
    "k = 0",
    "k = 9"
   ],
   "e": "For x ≠ 3, f(x) = (x − 3)(x + 3)/(x − 3) = x + 3, so lim x→3 f(x) = 6. Continuity requires k = lim x→3 f(x) = 6.",
   "ru": {
    "t": "Найдите k, при котором функция f(x) = {(x^2 − 9)/(x − 3), если x ≠ 3; k, если x = 3} непрерывна в точке x = 3.",
    "o": [
     "k = 6",
     "k = 3",
     "k = 0",
     "k = 9"
    ],
    "e": "При x ≠ 3 f(x) = (x − 3)(x + 3)/(x − 3) = x + 3, поэтому lim x→3 f(x) = 6. Непрерывность требует k = lim x→3 f(x) = 6."
   },
   "uz": {
    "t": "f(x) = {(x^2 − 9)/(x − 3), agar x ≠ 3; k, agar x = 3} funksiyasi x = 3 da uzluksiz boʻlishi uchun k ni toping.",
    "o": [
     "k = 6",
     "k = 3",
     "k = 0",
     "k = 9"
    ],
    "e": "x ≠ 3 uchun f(x) = (x − 3)(x + 3)/(x − 3) = x + 3, shuning uchun lim x→3 f(x) = 6. Uzluksizlik k = lim x→3 f(x) = 6 boʻlishini talab qiladi."
   }
  },
  {
   "t": "A power converter is modeled by P(t) = {4t + 1, if t < 2; a·t^2 − 1, if t ≥ 2}. Find a so that P is continuous at t = 2.",
   "o": [
    "a = 5/2",
    "a = 2",
    "a = 5",
    "a = 9/4"
   ],
   "e": "lim t→2− P(t) = 4·2 + 1 = 9, while P(2) = 4a − 1. Continuity requires 4a − 1 = 9, so 4a = 10 and a = 5/2.",
   "ru": {
    "t": "Преобразователь мощности описывается функцией P(t) = {4t + 1, если t < 2; a·t^2 − 1, если t ≥ 2}. Найдите a, при котором P непрерывна в точке t = 2.",
    "o": [
     "a = 5/2",
     "a = 2",
     "a = 5",
     "a = 9/4"
    ],
    "e": "lim t→2− P(t) = 4·2 + 1 = 9, а P(2) = 4a − 1. Непрерывность требует 4a − 1 = 9, откуда 4a = 10 и a = 5/2."
   },
   "uz": {
    "t": "Quvvat oʻzgartirgich P(t) = {4t + 1, agar t < 2; a·t^2 − 1, agar t ≥ 2} funksiyasi bilan model berilgan. P ning t = 2 da uzluksiz boʻlishi uchun a ni toping.",
    "o": [
     "a = 5/2",
     "a = 2",
     "a = 5",
     "a = 9/4"
    ],
    "e": "lim t→2− P(t) = 4·2 + 1 = 9, P(2) = 4a − 1 esa. Uzluksizlik 4a − 1 = 9 shartini talab qiladi, demak 4a = 10 va a = 5/2."
   }
  },
  {
   "t": "On which intervals is f(x) = (x − 1)/(x^2 + 2x) continuous?",
   "o": [
    "(−∞, −2), (−2, 0) and (0, +∞)",
    "On all of R",
    "Only on (−∞, 0) and (0, +∞)",
    "Only on (−2, 0) and (0, +∞)"
   ],
   "e": "A rational function is continuous wherever its denominator is nonzero. x^2 + 2x = x(x + 2) = 0 at x = 0 and x = −2, so f is continuous on (−∞, −2), (−2, 0) and (0, +∞).",
   "ru": {
    "t": "На каких интервалах непрерывна функция f(x) = (x − 1)/(x^2 + 2x)?",
    "o": [
     "(−∞, −2), (−2, 0) и (0, +∞)",
     "На всей R",
     "Только на (−∞, 0) и (0, +∞)",
     "Только на (−2, 0) и (0, +∞)"
    ],
    "e": "Рациональная функция непрерывна там, где знаменатель ненулевой. x^2 + 2x = x(x + 2) = 0 при x = 0 и x = −2, поэтому f непрерывна на (−∞, −2), (−2, 0) и (0, +∞)."
   },
   "uz": {
    "t": "f(x) = (x − 1)/(x^2 + 2x) funksiyasi qaysi oraliqlarda uzluksiz?",
    "o": [
     "(−∞, −2), (−2, 0) va (0, +∞)",
     "Butun R da",
     "Faqat (−∞, 0) va (0, +∞) da",
     "Faqat (−2, 0) va (0, +∞) da"
    ],
    "e": "Ratsional funksiya maxraj nol boʻlmagan joyda uzluksiz. x^2 + 2x = x(x + 2) = 0 x = 0 va x = −2 da, shuning uchun f (−∞, −2), (−2, 0) va (0, +∞) oraliqlarida uzluksiz."
   }
  },
  {
   "t": "The temperature of a component is T(t) = 20 + 5t − t^2 on 0 ≤ t ≤ 4, with T(1) = 24 and T(2) = 26. What does the Intermediate Value Theorem guarantee?",
   "o": [
    "There is at least one c ∈ (1, 2) with T(c) = 25",
    "The component reaches 25°C exactly once",
    "The maximum temperature on [0, 4] is 26°C",
    "Nothing can be concluded: the IVT requires T(1)·T(2) < 0"
   ],
   "e": "T is a polynomial, hence continuous; 25 lies between T(1) = 24 and T(2) = 26, so the IVT guarantees at least one c ∈ (1, 2) with T(c) = 25 (in fact there are two such moments, but the theorem guarantees only existence).",
   "ru": {
    "t": "Температура компонента: T(t) = 20 + 5t − t^2, 0 ≤ t ≤ 4; известно T(1) = 24 и T(2) = 26. Что гарантирует теорема о промежуточном значении?",
    "o": [
     "Существует по крайней мере одно c ∈ (1, 2), для которого T(c) = 25",
     "Компонент достигает 25°C ровно один раз",
     "Максимальная температура на [0, 4] равна 26°C",
     "Ничего: теорема требует T(1)·T(2) < 0"
    ],
    "e": "T — полином, значит, непрерывна; 25 лежит между T(1) = 24 и T(2) = 26, поэтому IVT гарантирует существование c ∈ (1, 2) с T(c) = 25 (на самом деле таких моментов два, но теорема гарантирует лишь существование)."
   },
   "uz": {
    "t": "Komponent harorati T(t) = 20 + 5t − t^2, 0 ≤ t ≤ 4; maʼlumki T(1) = 24 va T(2) = 26. Oraliq qiymat teoremasi nimani kafolatlaydi?",
    "o": [
     "T(c) = 25 boʻlgan kamida bitta c ∈ (1, 2) mavjud",
     "Komponent 25°C ga aynan bir marta erishadi",
     "[0, 4] dagi maksimal harorat 26°C",
     "Hech narsa: teorema T(1)·T(2) < 0 talab qiladi"
    ],
    "e": "T — polinom, demak uzluksiz; 25 soni T(1) = 24 bilan T(2) = 26 orasida yotadi, shuning uchun IVT T(c) = 25 boʻlgan kamida bitta c ∈ (1, 2) mavjudligini kafolatlaydi (aslida bunday momentlar ikkita, lekin teorema faqat mavjudlikni kafolatlaydi)."
   }
  },
  {
   "t": "To show that f(x) = x − cos x has at least one zero, which interval and which theorem are used?",
   "o": [
    "[0, π/2] and the Intermediate Value Theorem: f(0) = −1 < 0 and f(π/2) = π/2 > 0",
    "[0, 1] and the Extreme Value Theorem",
    "[−1, 1] and the Squeeze Theorem",
    "[0, π] and the theorem on inverse functions"
   ],
   "e": "f is continuous everywhere; f(0) = 0 − cos 0 = −1 < 0 and f(π/2) = π/2 − 0 = π/2 > 0. Since f(0)·f(π/2) < 0, the IVT gives a zero c ∈ (0, π/2).",
   "ru": {
    "t": "Чтобы показать, что f(x) = x − cos x имеет по крайней мере один ноль, какой интервал и какая теорема используются?",
    "o": [
     "[0, π/2] и теорема о промежуточном значении: f(0) = −1 < 0 и f(π/2) = π/2 > 0",
     "[0, 1] и теорема Вейерштрасса",
     "[−1, 1] и теорема о зажатой функции",
     "[0, π] и теорема об обратных функциях"
    ],
    "e": "f непрерывна всюду; f(0) = 0 − cos 0 = −1 < 0 и f(π/2) = π/2 − 0 = π/2 > 0. Так как f(0)·f(π/2) < 0, по IVT найдётся ноль c ∈ (0, π/2)."
   },
   "uz": {
    "t": "f(x) = x − cos x funksiyasining kamida bitta noli borligini koʻrsatish uchun qaysi oraliq va qaysi teorema ishlatiladi?",
    "o": [
     "[0, π/2] va oraliq qiymat teoremasi: f(0) = −1 < 0 va f(π/2) = π/2 > 0",
     "[0, 1] va Weierstrass teoremasi",
     "[−1, 1] va siqish teoremasi",
     "[0, π] va teskari funksiyalar teoremasi"
    ],
    "e": "f hamma joyda uzluksiz; f(0) = 0 − cos 0 = −1 < 0 va f(π/2) = π/2 − 0 = π/2 > 0. f(0)·f(π/2) < 0 boʻlgani uchun IVT boʻyicha c ∈ (0, π/2) nol mavjud."
   }
  },
  {
   "t": "For f(x) = 1/x we have f(−1) = −1 < 0 and f(1) = 1 > 0. Can we conclude that f has a zero on [−1, 1]?",
   "o": [
    "No: f is not continuous on [−1, 1] (infinite discontinuity at x = 0), so the IVT does not apply",
    "Yes: whenever the endpoint values have different signs, there is a zero",
    "Yes: 1/x equals 0 at x = 0",
    "No: because [−1, 1] is not a closed interval"
   ],
   "e": "The IVT requires continuity on the whole interval. f(x) = 1/x has an infinite discontinuity at x = 0 (it is undefined there), so the theorem does not apply — and indeed 1/x is never 0.",
   "ru": {
    "t": "Для f(x) = 1/x имеем f(−1) = −1 < 0 и f(1) = 1 > 0. Можно ли заключить, что f имеет ноль на [−1, 1]?",
    "o": [
     "Нет: f не непрерывна на [−1, 1] (бесконечный разрыв в нуле), поэтому IVT неприменима",
     "Да: если значения на концах разных знаков, ноль обязательно есть",
     "Да: 1/x равна 0 при x = 0",
     "Нет: потому что [−1, 1] — не замкнутый интервал"
    ],
    "e": "IVT требует непрерывности на всём интервале. f(x) = 1/x имеет бесконечный разрыв в точке x = 0 (там она не определена), поэтому теорема неприменима — и действительно, 1/x никогда не равна 0."
   },
   "uz": {
    "t": "f(x) = 1/x uchun f(−1) = −1 < 0 va f(1) = 1 > 0. f ning [−1, 1] da noli bor degan xulosa chiqarish mumkinmi?",
    "o": [
     "Yoʻq: f [−1, 1] da uzluksiz emas (x = 0 da cheksiz uzilish), shuning uchun IVT qoʻllanmaydi",
     "Ha: chegaradagi qiymatlar ishorasi farq qilsa, nol albatta bor",
     "Ha: 1/x x = 0 da 0 ga teng",
     "Yoʻq: chunki [−1, 1] yopiq oraliq emas"
    ],
    "e": "IVT butun oraliqda uzluksizlikni talab qiladi. f(x) = 1/x funksiyasi x = 0 da cheksiz uzilishga ega (u yerda aniqlanmagan), shuning uchun teorema qoʻllanmaydi — va haqiqatdan ham 1/x hech qachon 0 ga teng emas."
   }
  },
  {
   "t": "What does the Extreme Value Theorem (Weierstrass' theorem) state?",
   "o": [
    "If f is continuous on a closed bounded interval [a, b], then f attains its absolute maximum and minimum on [a, b]",
    "If f is continuous on [a, b], then f takes every value between f(a) and f(b)",
    "If f is differentiable on (a, b), then f′ = 0 at an interior maximum point",
    "A function continuous on all of R always has a maximum"
   ],
   "e": "Weierstrass' theorem guarantees that a continuous function on a closed bounded interval actually attains (reaches) its absolute maximum and minimum there. The statement about intermediate values is the IVT, not the EVT.",
   "ru": {
    "t": "Что утверждает теорема Вейерштрасса (о экстремальных значениях)?",
    "o": [
     "Если f непрерывна на замкнутом ограниченном интервале [a, b], то f достигает абсолютных максимума и минимума на [a, b]",
     "Если f непрерывна на [a, b], то f принимает каждое значение между f(a) и f(b)",
     "Если f дифференцируема на (a, b), то f′ = 0 во внутренней точке максимума",
     "Функция, непрерывная на всей R, всегда имеет максимум"
    ],
    "e": "Теорема Вейерштрасса гарантирует, что непрерывная на замкнутом ограниченном интервале функция фактически достигает своих абсолютных максимума и минимума на этом интервале. Утверждение о промежуточных значениях — это IVT, а не теорема Вейерштрасса."
   },
   "uz": {
    "t": "Weierstrass teoremasi (ekstremal qiymatlar teoremasi) nimani aytadi?",
    "o": [
     "Agar f yopiq chekli [a, b] oraliqda uzluksiz boʻlsa, f [a, b] da absolyut maksimum va minimumiga erishadi",
     "Agar f [a, b] da uzluksiz boʻlsa, f f(a) va f(b) orasidagi har qanday qiymatni qabul qiladi",
     "Agar f (a, b) da differensiallansa, ichki maksimum nuqtada f′ = 0",
     "Butun R da uzluksiz funksiya har doim maksimumga ega"
    ],
    "e": "Weierstrass teoremasi yopiq chekli oraliqda uzluksiz funksiya oʻz absolyut maksimum va minimumiga haqiqatan erishishini kafolatlaydi. Oraliq qiymatlar haqidagi bayonot — bu IVT, Weierstrass teoremasi emas."
   }
  },
  {
   "t": "Consider f(x) = x on the open interval (0, 1). Why does the Extreme Value Theorem not guarantee a maximum or a minimum here?",
   "o": [
    "The interval is not closed: f approaches 0 and 1 but never attains them",
    "f is not continuous on (0, 1)",
    "The interval is not bounded",
    "The theorem actually does guarantee a maximum on (0, 1)"
   ],
   "e": "f is continuous and the interval is bounded, but (0, 1) is open. The function gets arbitrarily close to 0 and 1 without reaching them, so no absolute maximum or minimum exists — both hypotheses of the theorem must hold.",
   "ru": {
    "t": "Рассмотрим f(x) = x на открытом интервале (0, 1). Почему теорема Вейерштрасса здесь не гарантирует ни максимума, ни минимума?",
    "o": [
     "Интервал не замкнут: f приближается к 0 и 1, но не достигает их",
     "f не непрерывна на (0, 1)",
     "Интервал не ограничен",
     "Теорема на самом деле гарантирует максимум на (0, 1)"
    ],
    "e": "f непрерывна и интервал ограничен, но (0, 1) открыт. Функция сколь угодно близко подходит к 0 и 1, не достигая их, поэтому абсолютных экстремумов нет — должны выполняться оба условия теоремы."
   },
   "uz": {
    "t": "f(x) = x funksiyasini ochiq (0, 1) oraliqda qaraymiz. Nega Weierstrass teoremasi bu yerda maksimum yoki minimumni kafolatlamaydi?",
    "o": [
     "Oraliq yopiq emas: f 0 va 1 ga yaqinlashadi, lekin ularga erishmaydi",
     "f (0, 1) da uzluksiz emas",
     "Oraliq chekli emas",
     "Teorema aslida (0, 1) da maksimumni kafolatlaydi"
    ],
    "e": "f uzluksiz va oraliq chekli, lekin (0, 1) ochiq. Funksiya 0 va 1 ga ixtiyoriy darajada yaqin boradi, lekin erishmaydi, shuning uchun absolyut ekstremumlar yoʻq — teoremaning ikkala sharti bajarilishi kerak."
   }
  },
  {
   "t": "A protection controller outputs u(T) = {T, if 0 ≤ T < 100; 0, if T = 100} on [0, 100]. Does u attain an absolute maximum?",
   "o": [
    "No: u is discontinuous at T = 100 (lim T→100− u(T) = 100 ≠ 0 = u(100)), so the EVT does not apply",
    "Yes: by the EVT, since [0, 100] is closed and bounded",
    "Yes: the maximum is u(100) = 0",
    "No: because the domain is unbounded"
   ],
   "e": "The domain is closed and bounded, but u is discontinuous at T = 100: the values approach 100 yet never equal it. One hypothesis of the EVT fails, so no maximum is guaranteed — and indeed none is attained.",
   "ru": {
    "t": "Контроллер защиты имеет выход u(T) = {T, если 0 ≤ T < 100; 0, если T = 100} на [0, 100]. Достигает ли u абсолютного максимума?",
    "o": [
     "Нет: u разрывна при T = 100 (lim T→100− u(T) = 100 ≠ 0 = u(100)), поэтому теорема Вейерштрасса неприменима",
     "Да: по теореме Вейерштрасса, так как [0, 100] замкнут и ограничен",
     "Да: максимум равен u(100) = 0",
     "Нет: потому что область определения не ограничена"
    ],
    "e": "Область определения замкнута и ограничена, но u разрывна в точке T = 100: значения приближаются к 100, никогда не достигая её. Одно из условий теоремы нарушено, поэтому максимум не гарантируется — и действительно не достигается."
   },
   "uz": {
    "t": "Himoya boshqaruvchisi [0, 100] da u(T) = {T, agar 0 ≤ T < 100; 0, agar T = 100} chiqishiga ega. u absolyut maksimumga erishadimi?",
    "o": [
     "Yoʻq: u T = 100 da uzluksiz emas (lim T→100− u(T) = 100 ≠ 0 = u(100)), shuning uchun Weierstrass teoremasi qoʻllanmaydi",
     "Ha: [0, 100] yopiq va chekli boʻlgani uchun Weierstrass teoremasi boʻyicha",
     "Ha: maksimum u(100) = 0",
     "Yoʻq: chunki taʼrif sohasi cheksiz"
    ],
    "e": "Taʼrif sohasi yopiq va chekli, lekin u T = 100 da uzluksiz emas: qiymatlar 100 ga yaqinlashadi, lekin hech qachon unga teng boʻlmaydi. Teoremaning bir sharti buzilgan, shuning uchun maksimum kafolatlanmaydi — va haqiqatan ham erishilmaydi."
   }
  },
  {
   "t": "Find the inverse of f(x) = 3x + 2.",
   "o": [
    "f^(−1)(y) = (y − 2)/3",
    "f^(−1)(y) = 1/(3y + 2)",
    "f^(−1)(y) = 3y − 2",
    "f^(−1)(y) = (y + 2)/3"
   ],
   "e": "Solve y = 3x + 2 for x: x = (y − 2)/3. Note that f^(−1) does not mean 1/f — the notation f^(−1) never denotes the reciprocal.",
   "ru": {
    "t": "Найдите обратную функцию для f(x) = 3x + 2.",
    "o": [
     "f^(−1)(y) = (y − 2)/3",
     "f^(−1)(y) = 1/(3y + 2)",
     "f^(−1)(y) = 3y − 2",
     "f^(−1)(y) = (y + 2)/3"
    ],
    "e": "Решите y = 3x + 2 относительно x: x = (y − 2)/3. Заметим: f^(−1) — это не 1/f; запись f^(−1) никогда не означает обратную величину."
   },
   "uz": {
    "t": "f(x) = 3x + 2 funksiyasining teskarisini toping.",
    "o": [
     "f^(−1)(y) = (y − 2)/3",
     "f^(−1)(y) = 1/(3y + 2)",
     "f^(−1)(y) = 3y − 2",
     "f^(−1)(y) = (y + 2)/3"
    ],
    "e": "y = 3x + 2 tenglamani x ga nisbatan yeching: x = (y − 2)/3. Eslatma: f^(−1) — bu 1/f emas; f^(−1) yozuvi hech qachon teskari qiymatni bildirmaydi."
   }
  },
  {
   "t": "An actuator displacement is x(V) = 0.5·V + 2 for 0 ≤ V ≤ 10. Find the inverse function V(x) and its domain.",
   "o": [
    "V(x) = 2x − 4 on 2 ≤ x ≤ 7",
    "V(x) = 0.5x + 2 on 0 ≤ x ≤ 10",
    "V(x) = 2x − 4 on 0 ≤ x ≤ 10",
    "V(x) = (x + 2)/2 on 2 ≤ x ≤ 7"
   ],
   "e": "Solving x = 0.5·V + 2 for V gives V = 2(x − 2) = 2x − 4. The range of x is [x(0), x(10)] = [2, 7], and it becomes the domain of the inverse.",
   "ru": {
    "t": "Смещение привода: x(V) = 0.5·V + 2 при 0 ≤ V ≤ 10. Найдите обратную функцию V(x) и её область определения.",
    "o": [
     "V(x) = 2x − 4 при 2 ≤ x ≤ 7",
     "V(x) = 0.5x + 2 при 0 ≤ x ≤ 10",
     "V(x) = 2x − 4 при 0 ≤ x ≤ 10",
     "V(x) = (x + 2)/2 при 2 ≤ x ≤ 7"
    ],
    "e": "Решая x = 0.5·V + 2 относительно V, получаем V = 2(x − 2) = 2x − 4. Область значений x — [x(0), x(10)] = [2, 7] — становится областью определения обратной функции."
   },
   "uz": {
    "t": "Aktuatorning siljishi x(V) = 0.5·V + 2, 0 ≤ V ≤ 10. Teskari V(x) funksiyasini va uning taʼrif sohasini toping.",
    "o": [
     "V(x) = 2x − 4, 2 ≤ x ≤ 7",
     "V(x) = 0.5x + 2, 0 ≤ x ≤ 10",
     "V(x) = 2x − 4, 0 ≤ x ≤ 10",
     "V(x) = (x + 2)/2, 2 ≤ x ≤ 7"
    ],
    "e": "x = 0.5·V + 2 ni V ga nisbatan yechsak, V = 2(x − 2) = 2x − 4 boʻladi. x ning qiymatlar sohasi [x(0), x(10)] = [2, 7] teskari funksiyaning taʼrif sohasiga aylanadi."
   }
  },
  {
   "t": "A thermistor is modeled by R(T) = 100·e^(−0.02·T) for T ≥ 0 (R in kΩ, T in °C). Find the inverse T(R) and the temperature when R = 40 kΩ.",
   "o": [
    "T(R) = −50·ln(R/100); at R = 40 the temperature is about 45.8°C",
    "T(R) = 50·ln(R/100); at R = 40 the temperature is about −45.8°C",
    "T(R) = −50·ln(100/R); at R = 40 the temperature is about −45.8°C",
    "T(R) = −0.02·ln(R/100); at R = 40 the temperature is about 0.02°C"
   ],
   "e": "From R = 100·e^(−0.02·T): R/100 = e^(−0.02·T), so ln(R/100) = −0.02·T and T = −50·ln(R/100). At R = 40: T = −50·ln(0.4) ≈ 45.8°C.",
   "ru": {
    "t": "Термистор описывается моделью R(T) = 100·e^(−0.02·T), T ≥ 0 (R в кОм, T в °C). Найдите обратную зависимость T(R) и температуру при R = 40 кОм.",
    "o": [
     "T(R) = −50·ln(R/100); при R = 40 температура около 45.8°C",
     "T(R) = 50·ln(R/100); при R = 40 температура около −45.8°C",
     "T(R) = −50·ln(100/R); при R = 40 температура около −45.8°C",
     "T(R) = −0.02·ln(R/100); при R = 40 температура около 0.02°C"
    ],
    "e": "Из R = 100·e^(−0.02·T): R/100 = e^(−0.02·T), откуда ln(R/100) = −0.02·T и T = −50·ln(R/100). При R = 40: T = −50·ln(0.4) ≈ 45.8°C."
   },
   "uz": {
    "t": "Termistor R(T) = 100·e^(−0.02·T), T ≥ 0 modeli bilan berilgan (R kΩ da, T °C da). Teskari T(R) ni va R = 40 kΩ dagi haroratni toping.",
    "o": [
     "T(R) = −50·ln(R/100); R = 40 da harorat taxminan 45.8°C",
     "T(R) = 50·ln(R/100); R = 40 da harorat taxminan −45.8°C",
     "T(R) = −50·ln(100/R); R = 40 da harorat taxminan −45.8°C",
     "T(R) = −0.02·ln(R/100); R = 40 da harorat taxminan 0.02°C"
    ],
    "e": "R = 100·e^(−0.02·T) dan: R/100 = e^(−0.02·T), demak ln(R/100) = −0.02·T va T = −50·ln(R/100). R = 40 da: T = −50·ln(0.4) ≈ 45.8°C."
   }
  },
  {
   "t": "The derivative of a function f at a point a is defined as:",
   "o": [
    "f′(a) = lim h→0 (f(a + h) − f(a))/h",
    "f′(a) = (f(a + h) − f(a))/h taken at h = 1",
    "f′(a) = lim h→0 (f(a + h) + f(a))/h",
    "f′(a) = lim h→∞ (f(a + h) − f(a))/h"
   ],
   "e": "The derivative is the limit of the difference quotient (the slope of the secant line) as h → 0; when the limit exists, it is the slope of the tangent line at the point (a, f(a)).",
   "ru": {
    "t": "Производная функции f в точке a определяется как:",
    "o": [
     "f′(a) = lim h→0 (f(a + h) − f(a))/h",
     "f′(a) = (f(a + h) − f(a))/h при h = 1",
     "f′(a) = lim h→0 (f(a + h) + f(a))/h",
     "f′(a) = lim h→∞ (f(a + h) − f(a))/h"
    ],
    "e": "Производная — это предел разностного отношения (наклона секущей) при h → 0; когда предел существует, он равен наклону касательной в точке (a, f(a))."
   },
   "uz": {
    "t": "f funksiyaning a nuqtadagi hosilasi quyidagicha taʼriflanadi:",
    "o": [
     "f′(a) = lim h→0 (f(a + h) − f(a))/h",
     "f′(a) = (f(a + h) − f(a))/h, h = 1 olinganda",
     "f′(a) = lim h→0 (f(a + h) + f(a))/h",
     "f′(a) = lim h→∞ (f(a + h) − f(a))/h"
    ],
    "e": "Hosila — h → 0 da ayirmali nisbatning (kesuvchi chiziq qiyaligining) limiti; limit mavjud boʻlsa, u (a, f(a)) nuqtadagi urinma chiziq qiyaligidir."
   }
  },
  {
   "t": "Using the definition of the derivative, find f′(2) for f(x) = x^2 + 3x.",
   "o": [
    "7 — the slope of the tangent at the point (2, 10)",
    "10 — the value of the function at x = 2",
    "4 — the average rate of change on [0, 2]",
    "2x + 3 — the general formula, not a number"
   ],
   "e": "f(2) = 10 and f(2 + h) = 10 + 7h + h^2, so f′(2) = lim h→0 (7h + h^2)/h = lim h→0 (7 + h) = 7 — the slope of the tangent at (2, 10).",
   "ru": {
    "t": "По определению производной найдите f′(2) для f(x) = x^2 + 3x.",
    "o": [
     "7 — наклон касательной в точке (2, 10)",
     "10 — значение функции при x = 2",
     "4 — средняя скорость изменения на [0, 2]",
     "2x + 3 — общая формула, а не число"
    ],
    "e": "f(2) = 10 и f(2 + h) = 10 + 7h + h^2, поэтому f′(2) = lim h→0 (7h + h^2)/h = lim h→0 (7 + h) = 7 — наклон касательной в точке (2, 10)."
   },
   "uz": {
    "t": "Hosila taʼrifi boʻyicha f(x) = x^2 + 3x uchun f′(2) ni toping.",
    "o": [
     "7 — (2, 10) nuqtadagi urinma qiyaligi",
     "10 — x = 2 dagi funksiya qiymati",
     "4 — [0, 2] dagi oʻrtacha oʻzgarish tezligi",
     "2x + 3 — umumiy formula, son emas"
    ],
    "e": "f(2) = 10 va f(2 + h) = 10 + 7h + h^2, shuning uchun f′(2) = lim h→0 (7h + h^2)/h = lim h→0 (7 + h) = 7 — (2, 10) nuqtadagi urinma qiyaligi."
   }
  },
  {
   "t": "Compute d/dx(x^10).",
   "o": [
    "10x^9",
    "10x^10",
    "x^9",
    "9x^10"
   ],
   "e": "By the power rule d/dx(x^n) = n·x^(n−1): the exponent becomes the coefficient and the power drops by one. Note that the power rule applies to x^n, not to functions like 3^x.",
   "ru": {
    "t": "Вычислите d/dx(x^10).",
    "o": [
     "10x^9",
     "10x^10",
     "x^9",
     "9x^10"
    ],
    "e": "По степенному правилу d/dx(x^n) = n·x^(n−1): показатель становится коэффициентом, степень понижается на 1. Степенное правило применимо к x^n, но не к функциям вида 3^x."
   },
   "uz": {
    "t": "d/dx(x^10) ni hisoblang.",
    "o": [
     "10x^9",
     "10x^10",
     "x^9",
     "9x^10"
    ],
    "e": "Daraja qoidasi boʻyicha d/dx(x^n) = n·x^(n−1): koʻrsatkich koeffitsientga aylanadi, daraja bittaga kamayadi. Daraja qoidasi x^n ga qoʻllanadi, 3^x kabi funksiyalarga emas."
   }
  },
  {
   "t": "State the product rule for differentiating f(x)·g(x).",
   "o": [
    "(f·g)′ = f′·g + g′·f",
    "(f·g)′ = f′·g′",
    "(f·g)′ = f′·g − g′·f",
    "(f·g)′ = f′ + g′"
   ],
   "e": "The derivative of a product is f′g + g′f — not the product of the derivatives (for x·x that would give 1, while the true derivative of x^2 is 2x).",
   "ru": {
    "t": "Сформулируйте правило произведения для дифференцирования f(x)·g(x).",
    "o": [
     "(f·g)′ = f′·g + g′·f",
     "(f·g)′ = f′·g′",
     "(f·g)′ = f′·g − g′·f",
     "(f·g)′ = f′ + g′"
    ],
    "e": "Производная произведения равна f′g + g′f — а не произведению производных (для x·x оно дало бы 1, тогда как настоящая производная x^2 равна 2x)."
   },
   "uz": {
    "t": "f(x)·g(x) ni differensiallash uchun koʻpaytma qoidasini yozing.",
    "o": [
     "(f·g)′ = f′·g + g′·f",
     "(f·g)′ = f′·g′",
     "(f·g)′ = f′·g − g′·f",
     "(f·g)′ = f′ + g′"
    ],
    "e": "Koʻpaytmaning hosilasi f′g + g′f — hosilalar koʻpaytmasi emas (x·x uchun u 1 berardi, holbuki x^2 ning haqiqiy hosilasi 2x)."
   }
  },
  {
   "t": "A student writes d/dx(x^2·x^3) = (2x)·(3x^2) = 6x^3. What is the correct derivative?",
   "o": [
    "5x^4, because x^2·x^3 = x^5 and d/dx(x^5) = 5x^4",
    "6x^3 — the student is right",
    "6x^5",
    "x^5"
   ],
   "e": "Multiplying the derivatives is wrong. Either apply the product rule — (2x)·x^3 + x^2·(3x^2) = 2x^4 + 3x^4 — or simplify first: x^2·x^3 = x^5, so the derivative is 5x^4.",
   "ru": {
    "t": "Студент пишет: d/dx(x^2·x^3) = (2x)·(3x^2) = 6x^3. Какова правильная производная?",
    "o": [
     "5x^4, так как x^2·x^3 = x^5 и d/dx(x^5) = 5x^4",
     "6x^3 — студент прав",
     "6x^5",
     "x^5"
    ],
    "e": "Перемножать производные неверно. Либо примените правило произведения — (2x)·x^3 + x^2·(3x^2) = 2x^4 + 3x^4, — либо сначала упростите: x^2·x^3 = x^5, и производная равна 5x^4."
   },
   "uz": {
    "t": "Talaba d/dx(x^2·x^3) = (2x)·(3x^2) = 6x^3 deb yozdi. Toʻgʻri hosila qanday?",
    "o": [
     "5x^4, chunki x^2·x^3 = x^5 va d/dx(x^5) = 5x^4",
     "6x^3 — talaba toʻgʻri",
     "6x^5",
     "x^5"
    ],
    "e": "Hosilalarni koʻpaytirish notoʻgʻri. Yoki koʻpaytma qoidasini qoʻllang — (2x)·x^3 + x^2·(3x^2) = 2x^4 + 3x^4, — yoki avval soddalashtiring: x^2·x^3 = x^5, demak hosila 5x^4."
   }
  },
  {
   "t": "Differentiate f(x) = (x^2 + 1)/(x + 1), x ≠ −1.",
   "o": [
    "(x^2 + 2x − 1)/(x + 1)^2",
    "2x/1 = 2x",
    "(2x(x + 1) + (x^2 + 1))/(x + 1)^2",
    "(x^2 − 2x − 1)/(x + 1)^2"
   ],
   "e": "By the quotient rule f′ = (f′g − g′f)/g^2 = (2x(x + 1) − (x^2 + 1))/(x + 1)^2 = (x^2 + 2x − 1)/(x + 1)^2. The derivative of a quotient is not the quotient of the derivatives.",
   "ru": {
    "t": "Продифференцируйте f(x) = (x^2 + 1)/(x + 1), x ≠ −1.",
    "o": [
     "(x^2 + 2x − 1)/(x + 1)^2",
     "2x/1 = 2x",
     "(2x(x + 1) + (x^2 + 1))/(x + 1)^2",
     "(x^2 − 2x − 1)/(x + 1)^2"
    ],
    "e": "По правилу частного f′ = (f′g − g′f)/g^2 = (2x(x + 1) − (x^2 + 1))/(x + 1)^2 = (x^2 + 2x − 1)/(x + 1)^2. Производная частного — не частное производных."
   },
   "uz": {
    "t": "f(x) = (x^2 + 1)/(x + 1), x ≠ −1 funksiyasini differensiallang.",
    "o": [
     "(x^2 + 2x − 1)/(x + 1)^2",
     "2x/1 = 2x",
     "(2x(x + 1) + (x^2 + 1))/(x + 1)^2",
     "(x^2 − 2x − 1)/(x + 1)^2"
    ],
    "e": "Nisbat qoidasi boʻyicha f′ = (f′g − g′f)/g^2 = (2x(x + 1) − (x^2 + 1))/(x + 1)^2 = (x^2 + 2x − 1)/(x + 1)^2. Nisbatning hosilasi hosilalar nisbati emas."
   }
  },
  {
   "t": "A student writes d/dx(7x^3 + 5) = 21x^2 + 5. What is the correct answer and which rule was misused?",
   "o": [
    "21x^2 — the derivative of a constant is 0",
    "21x^2 + 5 — the sum rule was applied correctly",
    "21x^2 + 5x — the power rule requires adding an x",
    "7x^2 — the constant multiple rule divides by 3"
   ],
   "e": "By the sum rule, d/dx(7x^3 + 5) = 21x^2 + 0: the derivative of the constant 5 is 0 (constant rule), so the answer is 21x^2.",
   "ru": {
    "t": "Студент пишет: d/dx(7x^3 + 5) = 21x^2 + 5. Каков правильный ответ и какое правило нарушено?",
    "o": [
     "21x^2 — производная константы равна 0",
     "21x^2 + 5 — правило суммы применено верно",
     "21x^2 + 5x — степенное правило требует добавить x",
     "7x^2 — правило множителя делит на 3"
    ],
    "e": "По правилу суммы d/dx(7x^3 + 5) = 21x^2 + 0: производная константы 5 равна 0 (правило константы), поэтому ответ 21x^2."
   },
   "uz": {
    "t": "Talaba d/dx(7x^3 + 5) = 21x^2 + 5 deb yozdi. Toʻgʻri javob qanday va qaysi qoida buzilgan?",
    "o": [
     "21x^2 — konstantaning hosilasi 0",
     "21x^2 + 5 — yigʻindi qoidasi toʻgʻri qoʻllangan",
     "21x^2 + 5x — daraja qoidasi x qoʻshishni talab qiladi",
     "7x^2 — koʻpaytuvchi qoidasi 3 ga boʻladi"
    ],
    "e": "Yigʻindi qoidasi boʻyicha d/dx(7x^3 + 5) = 21x^2 + 0: 5 konstantaning hosilasi 0 (konstanta qoidasi), shuning uchun javob 21x^2."
   }
  },
  {
   "t": "Compute d/dx(6/x^2).",
   "o": [
    "−12/x^3",
    "12/x^3",
    "−6/x^3",
    "−12/x^2"
   ],
   "e": "Rewrite as a power: 6/x^2 = 6x^(−2), so the derivative is 6·(−2)·x^(−3) = −12/x^3. Rewriting fractions as powers is often easier than the quotient rule.",
   "ru": {
    "t": "Вычислите d/dx(6/x^2).",
    "o": [
     "−12/x^3",
     "12/x^3",
     "−6/x^3",
     "−12/x^2"
    ],
    "e": "Перепишите как степень: 6/x^2 = 6x^(−2), поэтому производная равна 6·(−2)·x^(−3) = −12/x^3. Переписывание дробей степенями часто проще правила частного."
   },
   "uz": {
    "t": "d/dx(6/x^2) ni hisoblang.",
    "o": [
     "−12/x^3",
     "12/x^3",
     "−6/x^3",
     "−12/x^2"
    ],
    "e": "Daraja shaklida yozing: 6/x^2 = 6x^(−2), shuning uchun hosila 6·(−2)·x^(−3) = −12/x^3. Kasrlarni daraja shaklida yozish koʻpincha nisbat qoidasidan osonroq."
   }
  },
  {
   "t": "Which statement is true?",
   "o": [
    "If f is differentiable at a, then f is continuous at a (the converse is false: |x| at 0)",
    "If f is continuous at a, then f is differentiable at a",
    "If f′(a) = 0, then f is a constant function",
    "If both one-sided derivatives at a exist and are finite, then f′(a) exists"
   ],
   "e": "Differentiability implies continuity (Theorem 3.1), but not conversely: |x| is continuous at 0 yet has no derivative there. For f′(a) to exist, the one-sided derivatives must also be equal, and f′(a) = 0 at a single point does not make f constant.",
   "ru": {
    "t": "Какое утверждение верно?",
    "o": [
     "Если f дифференцируема в a, то f непрерывна в a (обратное неверно: |x| в нуле)",
     "Если f непрерывна в a, то f дифференцируема в a",
     "Если f′(a) = 0, то f — константа",
     "Если обе односторонние производные в a существуют и конечны, то f′(a) существует"
    ],
    "e": "Дифференцируемость влечёт непрерывность (теорема 3.1), но не наоборот: |x| непрерывна в нуле, но производной там нет. Для существования f′(a) односторонние производные должны ещё и совпадать, а f′(a) = 0 в одной точке не делает f константой."
   },
   "uz": {
    "t": "Qaysi bayonot toʻgʻri?",
    "o": [
     "Agar f a nuqtada differensiallansa, f u yerda uzluksiz (teskarisi yolgʻon: 0 dagi |x|)",
     "Agar f a nuqtada uzluksiz boʻlsa, f u yerda differensiallanadi",
     "Agar f′(a) = 0 boʻlsa, f konstanta funksiya",
     "Agar a nuqtadagi ikkala bir tomonlama hosila mavjud va chekli boʻlsa, f′(a) mavjud"
    ],
    "e": "Differensiallanuvchanlik uzluksizlikni keltiradi (3.1-teorema), lekin teskarisi emas: |x| 0 da uzluksiz, lekin hosilasi yoʻq. f′(a) mavjud boʻlishi uchun bir tomonlama hosilalar teng ham boʻlishi kerak, va bitta nuqtada f′(a) = 0 boʻlishi f ni konstanta qilmaydi."
   }
  },
  {
   "t": "For f(x) = |x|, find the one-sided derivatives at 0.",
   "o": [
    "f′_−(0) = −1 and f′_+(0) = 1, so f′(0) does not exist (a kink)",
    "f′_−(0) = 1 and f′_+(0) = −1",
    "f′_−(0) = f′_+(0) = 0, so f′(0) = 0",
    "f′_−(0) = f′_+(0) = 1, so f′(0) = 1"
   ],
   "e": "The difference quotient is |h|/h, which equals −1 for h < 0 and 1 for h > 0. The one-sided limits differ, so f′(0) does not exist — the graph has a corner (kink) at the origin.",
   "ru": {
    "t": "Для f(x) = |x| найдите односторонние производные в нуле.",
    "o": [
     "f′_−(0) = −1 и f′_+(0) = 1, поэтому f′(0) не существует (излом)",
     "f′_−(0) = 1 и f′_+(0) = −1",
     "f′_−(0) = f′_+(0) = 0, поэтому f′(0) = 0",
     "f′_−(0) = f′_+(0) = 1, поэтому f′(0) = 1"
    ],
    "e": "Разностное отношение равно |h|/h, то есть −1 при h < 0 и 1 при h > 0. Односторонние пределы различны, поэтому f′(0) не существует — в начале координат излом (kink)."
   },
   "uz": {
    "t": "f(x) = |x| uchun noldagi bir tomonlama hosilalarni toping.",
    "o": [
     "f′_−(0) = −1 va f′_+(0) = 1, shuning uchun f′(0) mavjud emas (sinish)",
     "f′_−(0) = 1 va f′_+(0) = −1",
     "f′_−(0) = f′_+(0) = 0, shuning uchun f′(0) = 0",
     "f′_−(0) = f′_+(0) = 1, shuning uchun f′(0) = 1"
    ],
    "e": "Ayirmali nisbat |h|/h ga teng: h < 0 da −1, h > 0 da 1. Bir tomonlama limitlar farq qiladi, shuning uchun f′(0) mavjud emas — grafik koordinata boshida sinish (kink) nuqtaga ega."
   }
  },
  {
   "t": "The function f(x) = x^(1/3) (cube root of x) is continuous at x = 0. What happens to its derivative there?",
   "o": [
    "The difference quotient 1/h^(2/3) → +∞ from both sides: a vertical tangent, no finite derivative",
    "f′(0) = 0: a horizontal tangent",
    "f′_−(0) = −∞ and f′_+(0) = +∞: a cusp",
    "f′(0) = 1/3"
   ],
   "e": "(h^(1/3) − 0)/h = 1/h^(2/3) → +∞ from both sides. The graph is continuous but has the vertical tangent line x = 0; no finite derivative exists (informally one writes f′(0) = +∞).",
   "ru": {
    "t": "Функция f(x) = x^(1/3) (кубический корень) непрерывна в точке x = 0. Что происходит с её производной там?",
    "o": [
     "Разностное отношение 1/h^(2/3) → +∞ с обеих сторон: вертикальная касательная, конечной производной нет",
     "f′(0) = 0: горизонтальная касательная",
     "f′_−(0) = −∞ и f′_+(0) = +∞: острие",
     "f′(0) = 1/3"
    ],
    "e": "(h^(1/3) − 0)/h = 1/h^(2/3) → +∞ с обеих сторон. График непрерывен, но имеет вертикальную касательную x = 0; конечной производной нет (неформально пишут f′(0) = +∞)."
   },
   "uz": {
    "t": "f(x) = x^(1/3) funksiyasi (kub ildiz) x = 0 da uzluksiz. Hosilasi u yerda nima boʻladi?",
    "o": [
     "Ayirmali nisbat 1/h^(2/3) → +∞ ikkala tomondan: vertikal urinma, chekli hosila yoʻq",
     "f′(0) = 0: gorizontal urinma",
     "f′_−(0) = −∞ va f′_+(0) = +∞: oʻtkir uch (cusp)",
     "f′(0) = 1/3"
    ],
    "e": "(h^(1/3) − 0)/h = 1/h^(2/3) → +∞ ikkala tomondan. Grafik uzluksiz, lekin x = 0 vertikal urinmaga ega; chekli hosila mavjud emas (norasmiy ravishda f′(0) = +∞ deb yoziladi)."
   }
  },
  {
   "t": "The function p(x) = |x|^(2/3) is continuous at 0. Classify the behavior of its graph at that point.",
   "o": [
    "A cusp: the slopes tend to −∞ from the left and +∞ from the right",
    "A kink: the slopes are −1 and 1",
    "A vertical tangent: +∞ from both sides",
    "Smooth, with p′(0) = 0"
   ],
   "e": "|h|^(2/3)/h → −∞ as h → 0− and → +∞ as h → 0+: infinite slopes of opposite signs — a cusp. The function is continuous, but no finite derivative exists at 0.",
   "ru": {
    "t": "Функция p(x) = |x|^(2/3) непрерывна в нуле. Опишите поведение её графика в этой точке.",
    "o": [
     "Острие (cusp): наклоны стремятся к −∞ слева и +∞ справа",
     "Излом: наклоны −1 и 1",
     "Вертикальная касательная: +∞ с обеих сторон",
     "Гладко: p′(0) = 0"
    ],
    "e": "|h|^(2/3)/h → −∞ при h → 0− и → +∞ при h → 0+: бесконечные наклоны противоположных знаков — острие. Функция непрерывна, но конечной производной в нуле нет."
   },
   "uz": {
    "t": "p(x) = |x|^(2/3) funksiyasi 0 da uzluksiz. Grafikning bu nuqtadagi xatti-harakatini tasniflang.",
    "o": [
     "Oʻtkir uch (cusp): qiyaliklar chapdan −∞ va oʻngdan +∞ ga intiladi",
     "Sininish: qiyaliklar −1 va 1",
     "Vertikal urinma: ikkala tomondan +∞",
     "Silliq, p′(0) = 0"
    ],
    "e": "|h|^(2/3)/h → −∞ (h → 0− da) va → +∞ (h → 0+ da): qarama-qarshi ishorali cheksiz qiyaliklar — oʻtkir uch. Funksiya uzluksiz, lekin 0 da chekli hosila mavjud emas."
   }
  },
  {
   "t": "Let j = f·g. Given f(2) = 3, f′(2) = −4, g(2) = 1 and g′(2) = 6, compute j′(2).",
   "o": [
    "14",
    "−24",
    "−10",
    "4"
   ],
   "e": "By the product rule, j′(2) = f′(2)·g(2) + g′(2)·f(2) = (−4)·1 + 6·3 = −4 + 18 = 14.",
   "ru": {
    "t": "Пусть j = f·g. Дано: f(2) = 3, f′(2) = −4, g(2) = 1 и g′(2) = 6. Вычислите j′(2).",
    "o": [
     "14",
     "−24",
     "−10",
     "4"
    ],
    "e": "По правилу произведения j′(2) = f′(2)·g(2) + g′(2)·f(2) = (−4)·1 + 6·3 = −4 + 18 = 14."
   },
   "uz": {
    "t": "j = f·g boʻlsin. Berilgan: f(2) = 3, f′(2) = −4, g(2) = 1 va g′(2) = 6. j′(2) ni hisoblang.",
    "o": [
     "14",
     "−24",
     "−10",
     "4"
    ],
    "e": "Koʻpaytma qoidasi boʻyicha j′(2) = f′(2)·g(2) + g′(2)·f(2) = (−4)·1 + 6·3 = −4 + 18 = 14."
   }
  },
  {
   "t": "For f(x) = 1/x (x ≠ 0), find the third derivative f‴(x).",
   "o": [
    "−6/x^4",
    "6/x^4",
    "2/x^3",
    "−1/x^2"
   ],
   "e": "f′ = −1/x^2, f″ = 2/x^3, f‴ = −6/x^4. In general f^(n)(x) = (−1)^n·n!/x^(n+1): the signs alternate and the coefficients are factorials.",
   "ru": {
    "t": "Для f(x) = 1/x (x ≠ 0) найдите третью производную f‴(x).",
    "o": [
     "−6/x^4",
     "6/x^4",
     "2/x^3",
     "−1/x^2"
    ],
    "e": "f′ = −1/x^2, f″ = 2/x^3, f‴ = −6/x^4. В общем случае f^(n)(x) = (−1)^n·n!/x^(n+1): знаки чередуются, коэффициенты — факториалы."
   },
   "uz": {
    "t": "f(x) = 1/x (x ≠ 0) uchun uchinchi hosila f‴(x) ni toping.",
    "o": [
     "−6/x^4",
     "6/x^4",
     "2/x^3",
     "−1/x^2"
    ],
    "e": "f′ = −1/x^2, f″ = 2/x^3, f‴ = −6/x^4. Umumiy holda f^(n)(x) = (−1)^n·n!/x^(n+1): ishoralar almashinadi, koeffitsientlar faktiallar."
   }
  },
  {
   "t": "For f(x) = 2x^4 − 3x^3 + x^2 − 5x + 6, what is f^(5)(x)?",
   "o": [
    "0, because each differentiation lowers the degree and the derivative of a constant is 0",
    "48",
    "48x",
    "24"
   ],
   "e": "f^(4)(x) = 48, a constant, so the fifth derivative is 0: repeatedly differentiating a polynomial ends in the zero function.",
   "ru": {
    "t": "Для f(x) = 2x^4 − 3x^3 + x^2 − 5x + 6 найдите f^(5)(x).",
    "o": [
     "0, так как каждое дифференцирование понижает степень, а производная константы равна 0",
     "48",
     "48x",
     "24"
    ],
    "e": "f^(4)(x) = 48 — константа, поэтому пятая производная равна 0: повторное дифференцирование полинома заканчивается нулевой функцией."
   },
   "uz": {
    "t": "f(x) = 2x^4 − 3x^3 + x^2 − 5x + 6 uchun f^(5)(x) nimaga teng?",
    "o": [
     "0, chunki har bir differensiallash darajani kamaytiradi va konstantaning hosilasi 0",
     "48",
     "48x",
     "24"
    ],
    "e": "f^(4)(x) = 48 — konstanta, shuning uchun beshinchi hosila 0: polinomni qayta-qayta differensiallash nol funksiyaga olib keladi."
   }
  },
  {
   "t": "Given f(3) = 2 and f′(3) = 5, use the increment formula to estimate f(3.2).",
   "o": [
    "3",
    "2.2",
    "10",
    "3.2"
   ],
   "e": "The increment formula f(a + h) ≈ f(a) + f′(a)·h with a = 3 and h = 0.2 gives f(3.2) ≈ 2 + 5·0.2 = 3. The estimate combines the known value with the instantaneous rate of change.",
   "ru": {
    "t": "Дано f(3) = 2 и f′(3) = 5. По формуле приращения оцените f(3.2).",
    "o": [
     "3",
     "2.2",
     "10",
     "3.2"
    ],
    "e": "Формула приращения f(a + h) ≈ f(a) + f′(a)·h при a = 3, h = 0.2 даёт f(3.2) ≈ 2 + 5·0.2 = 3. Оценка объединяет известное значение с мгновенной скоростью изменения."
   },
   "uz": {
    "t": "f(3) = 2 va f′(3) = 5 berilgan. Oʻsish formulasidan foydalanib f(3.2) ni baholang.",
    "o": [
     "3",
     "2.2",
     "10",
     "3.2"
    ],
    "e": "Oʻsish formulasi f(a + h) ≈ f(a) + f′(a)·h, a = 3, h = 0.2 bilan: f(3.2) ≈ 2 + 5·0.2 = 3. Baho maʼlum qiymatni bir lahzalik oʻzgarish tezligi bilan birlashtiradi."
   }
  },
  {
   "t": "A ball is dropped from a height of 64 feet, so s(t) = −16t^2 + 64. What is its instantaneous velocity at the moment it hits the ground?",
   "o": [
    "−64 ft/s: v(t) = −32t and the ground is reached at t = 2",
    "−32 ft/s — the average velocity over the fall",
    "64 ft/s",
    "0 ft/s, because the motion stops at impact"
   ],
   "e": "The ground is reached when s(t) = 0: t^2 = 4, so t = 2 s. With v(t) = s′(t) = −32t, the impact velocity is v(2) = −64 ft/s (the minus sign means the motion is downward).",
   "ru": {
    "t": "Мяч падает с высоты 64 фута: s(t) = −16t^2 + 64. Какова его мгновенная скорость в момент удара о землю?",
    "o": [
     "−64 фут/с: v(t) = −32t, а земля достигается при t = 2",
     "−32 фут/с — средняя скорость за время падения",
     "64 фут/с",
     "0 фут/с, так как движение прекращается при ударе"
    ],
    "e": "Земля достигается при s(t) = 0: t^2 = 4, то есть t = 2 с. Так как v(t) = s′(t) = −32t, скорость удара v(2) = −64 фут/с (знак «минус» — движение вниз)."
   },
   "uz": {
    "t": "Toʻp 64 fut balandlikdan tashlanadi: s(t) = −16t^2 + 64. Yerga urilgan lahzadagi bir lahzalik tezligi qanday?",
    "o": [
     "−64 fut/s: v(t) = −32t, yerga esa t = 2 da yetiladi",
     "−32 fut/s — qulash davomidagi oʻrtacha tezlik",
     "64 fut/s",
     "0 fut/s, chunki urilganda harakat toʻxtaydi"
    ],
    "e": "Yer s(t) = 0 boʻlganda yetiladi: t^2 = 4, yaʼni t = 2 s. v(t) = s′(t) = −32t boʻlgani uchun urilish tezligi v(2) = −64 fut/s (minus ishorasi pastga harakatni bildiradi)."
   }
  },
  {
   "t": "A particle moves along a line with s(t) = t^3 − 9t^2 + 24t + 4, t ≥ 0. At what times is the particle at rest?",
   "o": [
    "t = 2 and t = 4, since v(t) = 3t^2 − 18t + 24 = 3(t − 2)(t − 4)",
    "t = 3 only",
    "t = 0, t = 2 and t = 4",
    "Never: the velocity is always positive"
   ],
   "e": "The particle is at rest when v(t) = s′(t) = 0: 3t^2 − 18t + 24 = 3(t − 2)(t − 4) = 0 gives t = 2 and t = 4.",
   "ru": {
    "t": "Частица движется по оси: s(t) = t^3 − 9t^2 + 24t + 4, t ≥ 0. В какие моменты частица покоится?",
    "o": [
     "t = 2 и t = 4, так как v(t) = 3t^2 − 18t + 24 = 3(t − 2)(t − 4)",
     "только t = 3",
     "t = 0, t = 2 и t = 4",
     "никогда: скорость всегда положительна"
    ],
    "e": "Частица покоится, когда v(t) = s′(t) = 0: 3t^2 − 18t + 24 = 3(t − 2)(t − 4) = 0 даёт t = 2 и t = 4."
   },
   "uz": {
    "t": "Zarracha s(t) = t^3 − 9t^2 + 24t + 4, t ≥ 0 qonuni boʻyicha harakatlanadi. Qaysi momentlarda zarracha tinch turadi?",
    "o": [
     "t = 2 va t = 4, chunki v(t) = 3t^2 − 18t + 24 = 3(t − 2)(t − 4)",
     "faqat t = 3",
     "t = 0, t = 2 va t = 4",
     "hech qachon: tezlik har doim musbat"
    ],
    "e": "Zarracha v(t) = s′(t) = 0 boʻlganda tinch turadi: 3t^2 − 18t + 24 = 3(t − 2)(t − 4) = 0 dan t = 2 va t = 4 keladi."
   }
  },
  {
   "t": "In a related-rates problem, when should you substitute the known numerical values (such as \"when r = 30\")?",
   "o": [
    "After differentiating the relation with respect to t — substituting earlier would freeze the equation and lose the rates",
    "Before differentiating, to simplify the algebra",
    "It makes no difference",
    "Only after solving explicitly for the unknown function"
   ],
   "e": "Numbers substituted before differentiation turn the relation into a constant equation whose derivative is 0 — the rates would be lost. Differentiate the relation first, then substitute the instantaneous snapshot values.",
   "ru": {
    "t": "В задаче на связанные скорости когда следует подставлять известные числовые значения (например, «когда r = 30»)?",
    "o": [
     "После дифференцирования связи по t — подстановка раньше превратила бы уравнение в константу и скорости были бы потеряны",
     "До дифференцирования, чтобы упростить алгебру",
     "Разницы нет",
     "Только после явного решения относительно неизвестной функции"
    ],
    "e": "Числа, подставленные до дифференцирования, превращают связь в константное уравнение с нулевой производной — скорости теряются. Сначала продифференцируйте связь, затем подставьте мгновенный снимок значений."
   },
   "uz": {
    "t": "Oʻzaro bogʻliq tezliklar masalasida maʼlum sonli qiymatlarni (masalan, «r = 30 boʻlganda») qachon qoʻyish kerak?",
    "o": [
     "Bogʻliqlikni t boʻyicha differensiallagandan keyin — undan oldin qoʻysak tenglama doimiyga aylanib, tezliklar yoʻqoladi",
     "Algebrani soddalashtirish uchun differensiallashdan oldin",
     "Farqi yoʻq",
     "Faqat nomaʼlum funksiyani ochiq ifodalab yechgandan keyin"
    ],
    "e": "Differensiallashdan oldin qoʻyilgan sonlar bogʻliqlikni hosilasi 0 boʻlgan konstanta tenglamaga aylantiradi — tezliklar yoʻqoladi. Avval bogʻliqlikni differensiallang, soʻngra bir lahzalik qiymatlarni qoʻying."
   }
  },
  {
   "t": "A spherical balloon is inflated at 800 cm^3/min. How fast is the radius increasing when r = 30 cm? (V = (4/3)πr^3)",
   "o": [
    "2/(9π) ≈ 0.071 cm/min",
    "800/(4π·30) ≈ 2.12 cm/min",
    "2/(9π) cm/s",
    "9π/2 ≈ 14.1 cm/min"
   ],
   "e": "dV/dt = 4πr^2·(dr/dt), so dr/dt = 800/(4π·30^2) = 800/(3600π) = 2/(9π) ≈ 0.0707 cm/min.",
   "ru": {
    "t": "Сферический шар надувается со скоростью 800 см^3/мин. Как быстро растёт радиус в момент, когда r = 30 см? (V = (4/3)πr^3)",
    "o": [
     "2/(9π) ≈ 0.071 см/мин",
     "800/(4π·30) ≈ 2.12 см/мин",
     "2/(9π) см/с",
     "9π/2 ≈ 14.1 см/мин"
    ],
    "e": "dV/dt = 4πr^2·(dr/dt), поэтому dr/dt = 800/(4π·30^2) = 800/(3600π) = 2/(9π) ≈ 0.0707 см/мин."
   },
   "uz": {
    "t": "Sferik shar 800 sm^3/min tezlik bilan puflanmoqda. r = 30 sm boʻlganda radius qanchalik tez oʻsadi? (V = (4/3)πr^3)",
    "o": [
     "2/(9π) ≈ 0.071 sm/min",
     "800/(4π·30) ≈ 2.12 sm/min",
     "2/(9π) sm/s",
     "9π/2 ≈ 14.1 sm/min"
    ],
    "e": "dV/dt = 4πr^2·(dr/dt), shuning uchun dr/dt = 800/(4π·30^2) = 800/(3600π) = 2/(9π) ≈ 0.0707 sm/min."
   }
  },
  {
   "t": "A 10-ft ladder leans against a wall. The bottom slides away from the wall at 1 ft/s. How fast is the top sliding down the wall when the bottom is 6 ft from the wall?",
   "o": [
    "3/4 ft/s: dy/dt = −(x/y)·(dx/dt) = −(6/8)·1",
    "4/3 ft/s",
    "1 ft/s",
    "3/4 ft/s upward"
   ],
   "e": "From x^2 + y^2 = 100 with x = 6 we get y = 8. Differentiating: 2x·(dx/dt) + 2y·(dy/dt) = 0, so dy/dt = −(6/8)·1 = −3/4 ft/s — the top slides down at 3/4 ft/s.",
   "ru": {
    "t": "Лестница длиной 10 футов опирается о стену. Нижний конец скользит по полу от стены со скоростью 1 фут/с. Как быстро верхний конец скользит вниз, когда нижний находится в 6 футах от стены?",
    "o": [
     "3/4 фут/с: dy/dt = −(x/y)·(dx/dt) = −(6/8)·1",
     "4/3 фут/с",
     "1 фут/с",
     "3/4 фут/с вверх"
    ],
    "e": "Из x^2 + y^2 = 100 при x = 6 получаем y = 8. Дифференцирование: 2x·(dx/dt) + 2y·(dy/dt) = 0, откуда dy/dt = −(6/8)·1 = −3/4 фут/с — верх скользит вниз со скоростью 3/4 фут/с."
   },
   "uz": {
    "t": "10 fut uzunlikdagi narvon devorga suyangan. Pastki uchi devordan 1 fut/s tezlik bilan sirpanmoqda. Pastki uchi devordan 6 fut masofada boʻlganda yuqori uchi qanchalik tez pastga sirpanadi?",
    "o": [
     "3/4 fut/s: dy/dt = −(x/y)·(dx/dt) = −(6/8)·1",
     "4/3 fut/s",
     "1 fut/s",
     "3/4 fut/s yuqoriga"
    ],
    "e": "x^2 + y^2 = 100 dan x = 6 boʻlganda y = 8 keladi. Differensiallash: 2x·(dx/dt) + 2y·(dy/dt) = 0, demak dy/dt = −(6/8)·1 = −3/4 fut/s — yuqori uch 3/4 fut/s tezlik bilan pastga sirpanadi."
   }
  },
  {
   "t": "A 6-ft person walks away from a 15-ft lamppost at 5 ft/s. How fast is the tip of their shadow moving?",
   "o": [
    "25/3 ≈ 8.33 ft/s: by similar triangles s = (2/3)x, so L = x + s = (5/3)x and dL/dt = (5/3)·5",
    "5 ft/s — the same speed as the person",
    "15/3 = 5 ft/s",
    "40/3 ≈ 13.3 ft/s"
   ],
   "e": "Similar triangles give 15/(x + s) = 6/s, so s = (2/3)x and L = x + s = (5/3)x. Hence dL/dt = (5/3)·(dx/dt) = 25/3 ft/s — independent of the distance from the post.",
   "ru": {
    "t": "Человек ростом 6 футов уходит от 15-футового фонарного столба со скоростью 5 фут/с. Как быстро движется кончик его тени?",
    "o": [
     "25/3 ≈ 8.33 фут/с: из подобия s = (2/3)x, поэтому L = x + s = (5/3)x и dL/dt = (5/3)·5",
     "5 фут/с — с той же скоростью, что и человек",
     "15/3 = 5 фут/с",
     "40/3 ≈ 13.3 фут/с"
    ],
    "e": "Подобие треугольников даёт 15/(x + s) = 6/s, откуда s = (2/3)x и L = x + s = (5/3)x. Поэтому dL/dt = (5/3)·(dx/dt) = 25/3 фут/с — не зависит от расстояния до столба."
   },
   "uz": {
    "t": "6 fut boʻyli odam 15 futlik koʻcha chirogʻidan 5 fut/s tezlik bilan uzoqlashmoqda. Soyasi uchi qanchalik tez harakatlanadi?",
    "o": [
     "25/3 ≈ 8.33 fut/s: oʻxshashlikdan s = (2/3)x, demak L = x + s = (5/3)x va dL/dt = (5/3)·5",
     "5 fut/s — odam harakatlanayotgan tezlik bilan bir xil",
     "15/3 = 5 fut/s",
     "40/3 ≈ 13.3 fut/s"
    ],
    "e": "Oʻxshash uchburchaklar 15/(x + s) = 6/s beradi, demak s = (2/3)x va L = x + s = (5/3)x. Shuning uchun dL/dt = (5/3)·(dx/dt) = 25/3 fut/s — ustun masofasiga bogʻliq emas."
   }
  },
  {
   "t": "Water flows INTO an inverted conical tank (height 12 m, top radius 6 m) at 9 m^3/min. The water level rises at 0.2 m/min when the depth is 4 m. At what rate is water leaking out?",
   "o": [
    "9 − 0.8π ≈ 6.49 m^3/min",
    "0.8π ≈ 2.51 m^3/min",
    "9 m^3/min — there is no leak",
    "9 + 0.8π ≈ 11.51 m^3/min"
   ],
   "e": "By similarity r = h/2, so V = (π/12)h^3 and the net rate is dV/dt = (πh^2/4)·(dh/dt) = (π·16/4)·0.2 = 0.8π ≈ 2.513 m^3/min. Since net = inflow − leak: leak = 9 − 0.8π ≈ 6.49 m^3/min.",
   "ru": {
    "t": "Вода вливается в перевёрнутый конический бак (высота 12 м, верхний радиус 6 м) со скоростью 9 м^3/мин. Уровень воды поднимается со скоростью 0.2 м/мин при глубине 4 м. С какой скоростью вода вытекает из бака?",
    "o": [
     "9 − 0.8π ≈ 6.49 м^3/мин",
     "0.8π ≈ 2.51 м^3/мин",
     "9 м^3/мин — утечки нет",
     "9 + 0.8π ≈ 11.51 м^3/мин"
    ],
    "e": "Из подобия r = h/2, поэтому V = (π/12)h^3 и чистая скорость dV/dt = (πh^2/4)·(dh/dt) = (π·16/4)·0.2 = 0.8π ≈ 2.513 м^3/мин. Так как чистая = приток − утечка: утечка = 9 − 0.8π ≈ 6.49 м^3/мин."
   },
   "uz": {
    "t": "Suv teskari konus shaklidagi bakka (balandligi 12 m, yuqori radiusi 6 m) 9 m^3/min tezlik bilan quyilmoqda. Chuqurlik 4 m boʻlganda suv sathi 0.2 m/min koʻtariladi. Suv qanchalik tez oqib chiqmoqda?",
    "o": [
     "9 − 0.8π ≈ 6.49 m^3/min",
     "0.8π ≈ 2.51 m^3/min",
     "9 m^3/min — oqib chiqish yoʻq",
     "9 + 0.8π ≈ 11.51 m^3/min"
    ],
    "e": "Oʻxshashlikdan r = h/2, demak V = (π/12)h^3 va toza tezlik dV/dt = (πh^2/4)·(dh/dt) = (π·16/4)·0.2 = 0.8π ≈ 2.513 m^3/min. Toza = kirish − oqim boʻlgani uchun: oqim = 9 − 0.8π ≈ 6.49 m^3/min."
   }
  },
  {
   "t": "Two cars start from the same point: one drives south at 60 km/h, the other west at 50 km/h. How fast is the distance between them growing 2 hours later?",
   "o": [
    "10·√61 ≈ 78.1 km/h",
    "110 km/h",
    "60 km/h",
    "20·√61 ≈ 156.2 km/h"
   ],
   "e": "After 2 h: x = 100, y = 120, z = √(100^2 + 120^2) = 20√61. From z^2 = x^2 + y^2: dz/dt = (x·(dx/dt) + y·(dy/dt))/z = (5000 + 7200)/(20√61) = 10√61 ≈ 78.1 km/h.",
   "ru": {
    "t": "Два автомобиля стартуют из одной точки: один едет на юг со скоростью 60 км/ч, другой — на запад со скоростью 50 км/ч. С какой скоростью растёт расстояние между ними через 2 часа?",
    "o": [
     "10·√61 ≈ 78.1 км/ч",
     "110 км/ч",
     "60 км/ч",
     "20·√61 ≈ 156.2 км/ч"
    ],
    "e": "Через 2 ч: x = 100, y = 120, z = √(100^2 + 120^2) = 20√61. Из z^2 = x^2 + y^2: dz/dt = (x·(dx/dt) + y·(dy/dt))/z = (5000 + 7200)/(20√61) = 10√61 ≈ 78.1 км/ч."
   },
   "uz": {
    "t": "Ikki avtomobil bir nuqtadan yoʻlga chiqadi: biri 60 km/soat tezlik bilan janubga, ikkinchisi 50 km/soat bilan gʻarbga ketadi. 2 soatdan keyin ular orasidagi masofa qanchalik tez oʻsadi?",
    "o": [
     "10·√61 ≈ 78.1 km/soat",
     "110 km/soat",
     "60 km/soat",
     "20·√61 ≈ 156.2 km/soat"
    ],
    "e": "2 soatdan keyin: x = 100, y = 120, z = √(100^2 + 120^2) = 20√61. z^2 = x^2 + y^2 dan: dz/dt = (x·(dx/dt) + y·(dy/dt))/z = (5000 + 7200)/(20√61) = 10√61 ≈ 78.1 km/soat."
   }
  },
  {
   "t": "Gravel is poured at 30 ft^3/min, forming a conical pile whose base diameter always equals its height. How fast is the height growing when it is 10 ft?",
   "o": [
    "6/(5π) ≈ 0.382 ft/min",
    "30/(10π) ≈ 0.955 ft/min",
    "0.0955 ft/min",
    "1.2π ≈ 3.77 ft/min"
   ],
   "e": "With 2r = h we have r = h/2, so V = (1/3)π(h/2)^2·h = (π/12)h^3 and dV/dt = (πh^2/4)·(dh/dt). Thus dh/dt = 4·30/(π·10^2) = 120/(100π) = 6/(5π) ≈ 0.382 ft/min.",
   "ru": {
    "t": "Щебень ссыпается со скоростью 30 фут^3/мин, образуя коническую кучу, у которой диаметр основания всегда равен высоте. Как быстро растёт высота кучи, когда она равна 10 футам?",
    "o": [
     "6/(5π) ≈ 0.382 фут/мин",
     "30/(10π) ≈ 0.955 фут/мин",
     "0.0955 фут/мин",
     "1.2π ≈ 3.77 фут/мин"
    ],
    "e": "Так как 2r = h, то r = h/2 и V = (1/3)π(h/2)^2·h = (π/12)h^3, откуда dV/dt = (πh^2/4)·(dh/dt). Поэтому dh/dt = 4·30/(π·10^2) = 120/(100π) = 6/(5π) ≈ 0.382 фут/мин."
   },
   "uz": {
    "t": "Shagʻal 30 fut^3/min tezlik bilan tushib, asos diametri doim balandligiga teng boʻlgan konus uyum hosil qiladi. Balandlik 10 fut boʻlganda u qanchalik tez oʻsadi?",
    "o": [
     "6/(5π) ≈ 0.382 fut/min",
     "30/(10π) ≈ 0.955 fut/min",
     "0.0955 fut/min",
     "1.2π ≈ 3.77 fut/min"
    ],
    "e": "2r = h boʻlgani uchun r = h/2 va V = (1/3)π(h/2)^2·h = (π/12)h^3, demak dV/dt = (πh^2/4)·(dh/dt). Shuning uchun dh/dt = 4·30/(π·10^2) = 120/(100π) = 6/(5π) ≈ 0.382 fut/min."
   }
  },
  {
   "t": "The radius of a circular oil slick grows at a constant 2 m/min. How fast is the area growing when r = 30 m?",
   "o": [
    "120π ≈ 377 m^2/min",
    "60π m^2/min",
    "2πr = 60π m/min",
    "4π·30^2 m^2/min"
   ],
   "e": "A = πr^2 gives dA/dt = 2πr·(dr/dt) = 2π·30·2 = 120π ≈ 376.99 m^2/min.",
   "ru": {
    "t": "Радиус кругового нефтяного пятна растёт с постоянной скоростью 2 м/мин. Как быстро растёт площадь пятна, когда r = 30 м?",
    "o": [
     "120π ≈ 377 м^2/мин",
     "60π м^2/мин",
     "2πr = 60π м/мин",
     "4π·30^2 м^2/мин"
    ],
    "e": "Из A = πr^2 получаем dA/dt = 2πr·(dr/dt) = 2π·30·2 = 120π ≈ 376.99 м^2/мин."
   },
   "uz": {
    "t": "Doira shaklidagi neft dogʻining radiusi doimiy 2 m/min tezlik bilan oʻsadi. r = 30 m boʻlganda dogʻ yuzasi qanchalik tez oʻsadi?",
    "o": [
     "120π ≈ 377 m^2/min",
     "60π m^2/min",
     "2πr = 60π m/min",
     "4π·30^2 m^2/min"
    ],
    "e": "A = πr^2 dan dA/dt = 2πr·(dr/dt) = 2π·30·2 = 120π ≈ 376.99 m^2/min keladi."
   }
  },
  {
   "t": "A boat is pulled toward a dock by a rope through a pulley 1 m above the bow. The rope is shortened at 1 m/s. How fast is the boat approaching the dock when it is 8 m away?",
   "o": [
    "√65/8 ≈ 1.01 m/s",
    "Exactly 1 m/s",
    "8/√65 ≈ 0.99 m/s",
    "√65 ≈ 8.06 m/s"
   ],
   "e": "With l^2 = x^2 + 1 and dl/dt = −1: at x = 8 we have l = √65, so dx/dt = (l/x)·(dl/dt) = −√65/8 ≈ −1.008 m/s — the boat approaches at √65/8 m/s.",
   "ru": {
    "t": "Лодку подтягивают к причалу канатом, продетым через блок на 1 м выше носа лодки. Канат выбирают со скоростью 1 м/с. Как быстро лодка приближается к причалу, когда она находится в 8 м от него?",
    "o": [
     "√65/8 ≈ 1.01 м/с",
     "Ровно 1 м/с",
     "8/√65 ≈ 0.99 м/с",
     "√65 ≈ 8.06 м/с"
    ],
    "e": "Из l^2 = x^2 + 1 и dl/dt = −1: при x = 8 имеем l = √65, поэтому dx/dt = (l/x)·(dl/dt) = −√65/8 ≈ −1.008 м/с — лодка приближается со скоростью √65/8 м/с."
   },
   "uz": {
    "t": "Qayiq burnidan 1 m yuqorida joylashgan blokdan oʻtgan arqon bilan qirgʻoqqa tortilmoqda. Arqon 1 m/s tezlik bilan qisqartirilmoqda. Qayiq qirgʻoqdan 8 m masofada boʻlganda u qanchalik tez yaqinlashmoqda?",
    "o": [
     "√65/8 ≈ 1.01 m/s",
     "Aynan 1 m/s",
     "8/√65 ≈ 0.99 m/s",
     "√65 ≈ 8.06 m/s"
    ],
    "e": "l^2 = x^2 + 1 va dl/dt = −1: x = 8 da l = √65, shuning uchun dx/dt = (l/x)·(dl/dt) = −√65/8 ≈ −1.008 m/s — qayiq √65/8 m/s tezlik bilan yaqinlashadi."
   }
  },
  {
   "t": "A particle moves along the curve y = √x so that its x-coordinate increases at 2 units/s. How fast is the y-coordinate changing at the point (4, 2)?",
   "o": [
    "1/2 units/s: dy/dt = (1/(2√x))·(dx/dt) = (1/4)·2",
    "1 unit/s",
    "2 units/s",
    "1/4 units/s"
   ],
   "e": "dy/dt = (dy/dx)·(dx/dt) = (1/(2√x))·2; at x = 4 this is (1/4)·2 = 1/2 unit/s — the y-coordinate is increasing.",
   "ru": {
    "t": "Частица движется по кривой y = √x, причём её абсцисса растёт со скоростью 2 ед/с. Как быстро меняется ордината в точке (4, 2)?",
    "o": [
     "1/2 ед/с: dy/dt = (1/(2√x))·(dx/dt) = (1/4)·2",
     "1 ед/с",
     "2 ед/с",
     "1/4 ед/с"
    ],
    "e": "dy/dt = (dy/dx)·(dx/dt) = (1/(2√x))·2; при x = 4 это (1/4)·2 = 1/2 ед/с — ордината увеличивается."
   },
   "uz": {
    "t": "Zarracha y = √x egri chiziq boʻylab harakatlanadi, abssissasi 2 birlik/s tezlik bilan oʻsadi. (4, 2) nuqtada ordinata qanchalik tez oʻzgaradi?",
    "o": [
     "1/2 birlik/s: dy/dt = (1/(2√x))·(dx/dt) = (1/4)·2",
     "1 birlik/s",
     "2 birlik/s",
     "1/4 birlik/s"
    ],
    "e": "dy/dt = (dy/dx)·(dx/dt) = (1/(2√x))·2; x = 4 da bu (1/4)·2 = 1/2 birlik/s — ordinata oʻsishda."
   }
  },
  {
   "t": "What are d/dx(sin x) and d/dx(cos x)?",
   "o": [
    "cos x and −sin x",
    "cos x and sin x",
    "−cos x and sin x",
    "sec^2 x and −csc^2 x"
   ],
   "e": "Theorem 3.8: the derivative of sin is cos, and the derivative of cos is −sin. At the maxima and minima of sin x we have cos x = 0 — the tangent to the sine curve is horizontal there.",
   "ru": {
    "t": "Чему равны d/dx(sin x) и d/dx(cos x)?",
    "o": [
     "cos x и −sin x",
     "cos x и sin x",
     "−cos x и sin x",
     "sec^2 x и −csc^2 x"
    ],
    "e": "Теорема 3.8: производная синуса — косинус, производная косинуса — минус синус. В точках максимума и минимума sin x имеем cos x = 0 — касательная к синусоиде там горизонтальна."
   },
   "uz": {
    "t": "d/dx(sin x) va d/dx(cos x) nimaga teng?",
    "o": [
     "cos x va −sin x",
     "cos x va sin x",
     "−cos x va sin x",
     "sec^2 x va −csc^2 x"
    ],
    "e": "3.8-teorema: sinusning hosilasi — kosinus, kosinusning hosilasi — minus sinus. sin x ning maksimum va minimum nuqtalarida cos x = 0 — sinus grafigiga urinma u yerda gorizontal."
   }
  },
  {
   "t": "Starting from tan x = sin x/cos x, derive d/dx(tan x).",
   "o": [
    "sec^2 x, since (cos^2 x + sin^2 x)/cos^2 x = 1/cos^2 x",
    "−sec^2 x",
    "tan x·sec x",
    "cot^2 x"
   ],
   "e": "By the quotient rule: (cos x·cos x − (−sin x)·sin x)/cos^2 x = (cos^2 x + sin^2 x)/cos^2 x = 1/cos^2 x = sec^2 x.",
   "ru": {
    "t": "Исходя из tan x = sin x/cos x, выведите d/dx(tan x).",
    "o": [
     "sec^2 x, так как (cos^2 x + sin^2 x)/cos^2 x = 1/cos^2 x",
     "−sec^2 x",
     "tan x·sec x",
     "cot^2 x"
    ],
    "e": "По правилу частного: (cos x·cos x − (−sin x)·sin x)/cos^2 x = (cos^2 x + sin^2 x)/cos^2 x = 1/cos^2 x = sec^2 x."
   },
   "uz": {
    "t": "tan x = sin x/cos x dan boshlab d/dx(tan x) ni chiqaring.",
    "o": [
     "sec^2 x, chunki (cos^2 x + sin^2 x)/cos^2 x = 1/cos^2 x",
     "−sec^2 x",
     "tan x·sec x",
     "cot^2 x"
    ],
    "e": "Nisbat qoidasi boʻyicha: (cos x·cos x − (−sin x)·sin x)/cos^2 x = (cos^2 x + sin^2 x)/cos^2 x = 1/cos^2 x = sec^2 x."
   }
  },
  {
   "t": "Compute d^74/dx^74 (sin x).",
   "o": [
    "−sin x, since 74 = 4·18 + 2 and the derivatives cycle with period 4",
    "sin x",
    "cos x",
    "−cos x"
   ],
   "e": "The derivatives of sin cycle: sin → cos → −sin → −cos → sin ... with period 4. Since 74 leaves remainder 2 on division by 4, the 74th derivative equals the 2nd: −sin x.",
   "ru": {
    "t": "Вычислите d^74/dx^74 (sin x).",
    "o": [
     "−sin x, так как 74 = 4·18 + 2 и производные цикличны с периодом 4",
     "sin x",
     "cos x",
     "−cos x"
    ],
    "e": "Производные синуса цикличны: sin → cos → −sin → −cos → sin ... с периодом 4. Так как 74 даёт остаток 2 при делении на 4, 74-я производная равна 2-й: −sin x."
   },
   "uz": {
    "t": "d^74/dx^74 (sin x) ni hisoblang.",
    "o": [
     "−sin x, chunki 74 = 4·18 + 2 va hosilalar 4 davr bilan takrorlanadi",
     "sin x",
     "cos x",
     "−cos x"
    ],
    "e": "Sinus hosilalari siklik: sin → cos → −sin → −cos → sin ... 4 davr bilan. 74 ning 4 ga boʻlinishida qoldiq 2 boʻlgani uchun 74-hosila 2-hosilaga teng: −sin x."
   }
  },
  {
   "t": "Differentiate f(x) = e^(2x).",
   "o": [
    "2·e^(2x)",
    "e^(2x)",
    "e^(2x)/2",
    "2x·e^(2x−1)"
   ],
   "e": "By d/dx(e^(g(x))) = e^(g(x))·g′(x) with g(x) = 2x: f′(x) = e^(2x)·2 = 2e^(2x). The exponential keeps itself, and the chain factor is the derivative of the exponent.",
   "ru": {
    "t": "Продифференцируйте f(x) = e^(2x).",
    "o": [
     "2·e^(2x)",
     "e^(2x)",
     "e^(2x)/2",
     "2x·e^(2x−1)"
    ],
    "e": "По правилу d/dx(e^(g(x))) = e^(g(x))·g′(x) при g(x) = 2x: f′(x) = e^(2x)·2 = 2e^(2x). Экспонента сохраняется, а цепной множитель — производная показателя."
   },
   "uz": {
    "t": "f(x) = e^(2x) funksiyasini differensiallang.",
    "o": [
     "2·e^(2x)",
     "e^(2x)",
     "e^(2x)/2",
     "2x·e^(2x−1)"
    ],
    "e": "d/dx(e^(g(x))) = e^(g(x))·g′(x) qoidasi boʻyicha, g(x) = 2x: f′(x) = e^(2x)·2 = 2e^(2x). Eksponent oʻzini saqlaydi, zanjir koʻpaytuvchisi esa koʻrsatkich hosilasidir."
   }
  },
  {
   "t": "Differentiate f(x) = 3e^x + 2^x − 5 and find f′(0).",
   "o": [
    "f′(x) = 3e^x + 2^x·ln 2, so f′(0) = 3 + ln 2 ≈ 3.693",
    "f′(x) = 3e^x + 2^x, so f′(0) = 4",
    "f′(x) = 3e^x + x·2^(x−1), so f′(0) = 3",
    "f′(x) = 3e^x + 2^x·log_10 2, so f′(0) ≈ 3.3"
   ],
   "e": "(e^x)′ = e^x and (2^x)′ = 2^x·ln 2 (since 2^x = e^(x·ln 2)); the derivative of −5 is 0. So f′(0) = 3·1 + 1·ln 2 = 3 + ln 2 ≈ 3.693.",
   "ru": {
    "t": "Продифференцируйте f(x) = 3e^x + 2^x − 5 и найдите f′(0).",
    "o": [
     "f′(x) = 3e^x + 2^x·ln 2, поэтому f′(0) = 3 + ln 2 ≈ 3.693",
     "f′(x) = 3e^x + 2^x, поэтому f′(0) = 4",
     "f′(x) = 3e^x + x·2^(x−1), поэтому f′(0) = 3",
     "f′(x) = 3e^x + 2^x·log_10 2, поэтому f′(0) ≈ 3.3"
    ],
    "e": "(e^x)′ = e^x и (2^x)′ = 2^x·ln 2 (так как 2^x = e^(x·ln 2)); производная −5 равна 0. Поэтому f′(0) = 3·1 + 1·ln 2 = 3 + ln 2 ≈ 3.693."
   },
   "uz": {
    "t": "f(x) = 3e^x + 2^x − 5 funksiyasini differensiallang va f′(0) ni toping.",
    "o": [
     "f′(x) = 3e^x + 2^x·ln 2, shuning uchun f′(0) = 3 + ln 2 ≈ 3.693",
     "f′(x) = 3e^x + 2^x, shuning uchun f′(0) = 4",
     "f′(x) = 3e^x + x·2^(x−1), shuning uchun f′(0) = 3",
     "f′(x) = 3e^x + 2^x·log_10 2, shuning uchun f′(0) ≈ 3.3"
    ],
    "e": "(e^x)′ = e^x va (2^x)′ = 2^x·ln 2 (chunki 2^x = e^(x·ln 2)); −5 ning hosilasi 0. Shuning uchun f′(0) = 3·1 + 1·ln 2 = 3 + ln 2 ≈ 3.693."
   }
  },
  {
   "t": "Differentiate f(x) = x·ln x (x > 0).",
   "o": [
    "ln x + 1",
    "1/x",
    "ln x",
    "1 + 1/x"
   ],
   "e": "By the product rule: f′ = 1·ln x + x·(1/x) = ln x + 1.",
   "ru": {
    "t": "Продифференцируйте f(x) = x·ln x (x > 0).",
    "o": [
     "ln x + 1",
     "1/x",
     "ln x",
     "1 + 1/x"
    ],
    "e": "По правилу произведения: f′ = 1·ln x + x·(1/x) = ln x + 1."
   },
   "uz": {
    "t": "f(x) = x·ln x (x > 0) funksiyasini differensiallang.",
    "o": [
     "ln x + 1",
     "1/x",
     "ln x",
     "1 + 1/x"
    ],
    "e": "Koʻpaytma qoidasi boʻyicha: f′ = 1·ln x + x·(1/x) = ln x + 1."
   }
  },
  {
   "t": "Differentiate g(x) = e^x/x (x ≠ 0).",
   "o": [
    "e^x·(x − 1)/x^2",
    "e^x/x^2",
    "e^x·(x + 1)/x^2",
    "(e^x·x − e^x)/x"
   ],
   "e": "By the quotient rule: g′ = (e^x·x − e^x·1)/x^2 = e^x·(x − 1)/x^2.",
   "ru": {
    "t": "Продифференцируйте g(x) = e^x/x (x ≠ 0).",
    "o": [
     "e^x·(x − 1)/x^2",
     "e^x/x^2",
     "e^x·(x + 1)/x^2",
     "(e^x·x − e^x)/x"
    ],
    "e": "По правилу частного: g′ = (e^x·x − e^x·1)/x^2 = e^x·(x − 1)/x^2."
   },
   "uz": {
    "t": "g(x) = e^x/x (x ≠ 0) funksiyasini differensiallang.",
    "o": [
     "e^x·(x − 1)/x^2",
     "e^x/x^2",
     "e^x·(x + 1)/x^2",
     "(e^x·x − e^x)/x"
    ],
    "e": "Nisbat qoidasi boʻyicha: g′ = (e^x·x − e^x·1)/x^2 = e^x·(x − 1)/x^2."
   }
  },
  {
   "t": "A discharging capacitor has voltage V(t) = 12·e^(−t/2) V (t in seconds). Find the initial rate of change of the voltage and V′(2).",
   "o": [
    "V′(0) = −6 V/s and V′(2) = −6/e ≈ −2.21 V/s",
    "V′(0) = 12 V/s and V′(2) = 12/e V/s",
    "V′(0) = −6 V/s and V′(2) = −3 V/s",
    "V′(0) = −12 V/s and V′(2) = −12/e V/s"
   ],
   "e": "V′(t) = 12·e^(−t/2)·(−1/2) = −6·e^(−t/2). So V′(0) = −6 V/s and V′(2) = −6·e^(−1) ≈ −2.21 V/s: the voltage decreases, and the rate of decrease slows over time.",
   "ru": {
    "t": "Разряжающийся конденсатор имеет напряжение V(t) = 12·e^(−t/2) В (t в секундах). Найдите начальную скорость изменения напряжения и V′(2).",
    "o": [
     "V′(0) = −6 В/с и V′(2) = −6/e ≈ −2.21 В/с",
     "V′(0) = 12 В/с и V′(2) = 12/e В/с",
     "V′(0) = −6 В/с и V′(2) = −3 В/с",
     "V′(0) = −12 В/с и V′(2) = −12/e В/с"
    ],
    "e": "V′(t) = 12·e^(−t/2)·(−1/2) = −6·e^(−t/2). Поэтому V′(0) = −6 В/с и V′(2) = −6·e^(−1) ≈ −2.21 В/с: напряжение убывает, причём скорость убывания со временем замедляется."
   },
   "uz": {
    "t": "Zaryadsizlanayotgan kondensatorning kuchlanishi V(t) = 12·e^(−t/2) V (t sekundlarda). Kuchlanishning boshlangʻich oʻzgarish tezligini va V′(2) ni toping.",
    "o": [
     "V′(0) = −6 V/s va V′(2) = −6/e ≈ −2.21 V/s",
     "V′(0) = 12 V/s va V′(2) = 12/e V/s",
     "V′(0) = −6 V/s va V′(2) = −3 V/s",
     "V′(0) = −12 V/s va V′(2) = −12/e V/s"
    ],
    "e": "V′(t) = 12·e^(−t/2)·(−1/2) = −6·e^(−t/2). Shuning uchun V′(0) = −6 V/s va V′(2) = −6·e^(−1) ≈ −2.21 V/s: kuchlanish kamayadi va kamayish tezligi vaqt oʻtishi bilan sekinlashadi."
   }
  },
  {
   "t": "Find the derivative of f(x) = e^(x^3).",
   "o": [
    "3x^2·e^(x^3)",
    "e^(x^3)",
    "3x^2·e^(3x^2)",
    "x^3·e^(x^3−1)"
   ],
   "e": "With g(x) = x^3 and g′(x) = 3x^2: f′(x) = e^(x^3)·3x^2 = 3x^2·e^(x^3). The exponential stays unchanged; the chain rule adds the derivative of the exponent.",
   "ru": {
    "t": "Найдите производную функции f(x) = e^(x^3).",
    "o": [
     "3x^2·e^(x^3)",
     "e^(x^3)",
     "3x^2·e^(3x^2)",
     "x^3·e^(x^3−1)"
    ],
    "e": "При g(x) = x^3 и g′(x) = 3x^2: f′(x) = e^(x^3)·3x^2 = 3x^2·e^(x^3). Экспонента не меняется; цепное правило добавляет производную показателя."
   },
   "uz": {
    "t": "f(x) = e^(x^3) funksiyasining hosilasini toping.",
    "o": [
     "3x^2·e^(x^3)",
     "e^(x^3)",
     "3x^2·e^(3x^2)",
     "x^3·e^(x^3−1)"
    ],
    "e": "g(x) = x^3 va g′(x) = 3x^2 boʻlgani uchun: f′(x) = e^(x^3)·3x^2 = 3x^2·e^(x^3). Eksponent oʻzgarmaydi; zanjir qoidasi koʻrsatkich hosilasini qoʻshadi."
   }
  },
  {
   "t": "In the row picture of the system [2 −1; 1 1]·[x; y] = [1; 5], what does each row of the matrix represent geometrically?",
   "o": [
    "A line in the plane; the solution (2, 3) is the intersection point of the two lines",
    "A vector from the origin; the solution is their sum",
    "A point in the plane; the solution is the midpoint",
    "A parabola; the solution is the tangency point"
   ],
   "e": "Each row of Ax = b is one linear equation — a line in 2D (a plane in 3D). The row-picture solution is the common intersection point; here 2x − y = 1 and x + y = 5 meet at (2, 3).",
   "ru": {
    "t": "В строчной картине (row picture) системы [2 −1; 1 1]·[x; y] = [1; 5] что геометрически представляет каждая строка матрицы?",
    "o": [
     "Прямую на плоскости; решение (2, 3) — точка пересечения двух прямых",
     "Вектор из начала координат; решение — их сумма",
     "Точку на плоскости; решение — середина",
     "Параболу; решение — точка касания"
    ],
    "e": "Каждая строка Ax = b — одно линейное уравнение, то есть прямая в 2D (плоскость в 3D). Решение в строчной картине — общая точка пересечения; здесь 2x − y = 1 и x + y = 5 пересекаются в (2, 3)."
   },
   "uz": {
    "t": "[2 −1; 1 1]·[x; y] = [1; 5] sistemasining satrli tasvirida (row picture) matritsaning har bir satri geometrik nimani bildiradi?",
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
   "t": "In the column picture, the product A·x is interpreted as:",
   "o": [
    "A linear combination of the columns of A with coefficients x_1, ..., x_n",
    "A linear combination of the rows of A",
    "The dot product of the rows of A with the vector b",
    "The product of the diagonal entries of A"
   ],
   "e": "Ax = x_1·a_1 + x_2·a_2 + ... + x_n·a_n: the vector b must be assembled from the columns of A. Solving Ax = b means finding the right coefficients of that combination.",
   "ru": {
    "t": "В столбцовой картине произведение A·x интерпретируется как:",
    "o": [
     "Линейная комбинация столбцов A с коэффициентами x_1, ..., x_n",
     "Линейная комбинация строк A",
     "Скалярное произведение строк A на вектор b",
     "Произведение диагональных элементов A"
    ],
    "e": "Ax = x_1·a_1 + x_2·a_2 + ... + x_n·a_n: вектор b собирается из столбцов A. Решить Ax = b — значит найти правильные коэффициенты этой комбинации."
   },
   "uz": {
    "t": "Ustunli tasvirda A·x koʻpaytma qanday talqin etiladi?",
    "o": [
     "A ustunlarining x_1, ..., x_n koeffitsientli chiziqli kombinatsiyasi",
     "A satrlarining chiziqli kombinatsiyasi",
     "A satrlarining b vektor bilan skalyar koʻpaytmasi",
     "A diagonal elementlarining koʻpaytmasi"
    ],
    "e": "Ax = x_1·a_1 + x_2·a_2 + ... + x_n·a_n: b vektori A ustunlaridan yigʻiladi. Ax = b ni yechish — bu kombinatsiyaning toʻgʻri koeffitsientlarini topish demakdir."
   }
  },
  {
   "t": "Solve the system [2 −1; 1 1]·[x; y] = [1; 5].",
   "o": [
    "x = 2, y = 3",
    "x = 3, y = 2",
    "x = 1, y = 5",
    "x = 2, y = −3"
   ],
   "e": "Adding the equations 2x − y = 1 and x + y = 5 gives 3x = 6, so x = 2 and y = 3. Column-picture check: 2·[2; 1] + 3·[−1; 1] = [1; 5].",
   "ru": {
    "t": "Решите систему [2 −1; 1 1]·[x; y] = [1; 5].",
    "o": [
     "x = 2, y = 3",
     "x = 3, y = 2",
     "x = 1, y = 5",
     "x = 2, y = −3"
    ],
    "e": "Складывая уравнения 2x − y = 1 и x + y = 5, получаем 3x = 6, откуда x = 2 и y = 3. Проверка в столбцовой картине: 2·[2; 1] + 3·[−1; 1] = [1; 5]."
   },
   "uz": {
    "t": "[2 −1; 1 1]·[x; y] = [1; 5] sistemasini yeching.",
    "o": [
     "x = 2, y = 3",
     "x = 3, y = 2",
     "x = 1, y = 5",
     "x = 2, y = −3"
    ],
    "e": "2x − y = 1 va x + y = 5 tenglamalarini qoʻshsak, 3x = 6, demak x = 2 va y = 3. Ustunli tasvirda tekshirish: 2·[2; 1] + 3·[−1; 1] = [1; 5]."
   }
  },
  {
   "t": "In the column picture of [2 −1; 1 1]·[x; y] = [1; 5], which combination of the columns [2; 1] and [−1; 1] produces [1; 5]?",
   "o": [
    "2·[2; 1] + 3·[−1; 1] = [1; 5]",
    "1·[2; 1] + 5·[−1; 1] = [1; 5]",
    "3·[2; 1] + 2·[−1; 1] = [1; 5]",
    "5·[2; 1] + 1·[−1; 1] = [1; 5]"
   ],
   "e": "2·[2; 1] + 3·[−1; 1] = [4 − 3; 2 + 3] = [1; 5]. The weights are exactly the components of the solution x = (2, 3).",
   "ru": {
    "t": "В столбцовой картине системы [2 −1; 1 1]·[x; y] = [1; 5] какая комбинация столбцов [2; 1] и [−1; 1] даёт [1; 5]?",
    "o": [
     "2·[2; 1] + 3·[−1; 1] = [1; 5]",
     "1·[2; 1] + 5·[−1; 1] = [1; 5]",
     "3·[2; 1] + 2·[−1; 1] = [1; 5]",
     "5·[2; 1] + 1·[−1; 1] = [1; 5]"
    ],
    "e": "2·[2; 1] + 3·[−1; 1] = [4 − 3; 2 + 3] = [1; 5]. Веса — это в точности компоненты решения x = (2, 3)."
   },
   "uz": {
    "t": "[2 −1; 1 1]·[x; y] = [1; 5] sistemasining ustunli tasvirida [2; 1] va [−1; 1] ustunlarining qaysi kombinatsiyasi [1; 5] beradi?",
    "o": [
     "2·[2; 1] + 3·[−1; 1] = [1; 5]",
     "1·[2; 1] + 5·[−1; 1] = [1; 5]",
     "3·[2; 1] + 2·[−1; 1] = [1; 5]",
     "5·[2; 1] + 1·[−1; 1] = [1; 5]"
    ],
    "e": "2·[2; 1] + 3·[−1; 1] = [4 − 3; 2 + 3] = [1; 5]. Ogʻirliklar aynan x = (2, 3) yechimining komponentalaridir."
   }
  },
  {
   "t": "During Gaussian elimination on an augmented matrix you obtain the row [0 0 | c] with c ≠ 0. What does it mean?",
   "o": [
    "The system has no solution: the row reads 0 = c, which is impossible",
    "The system has infinitely many solutions",
    "The system has a unique solution",
    "A row exchange is required"
   ],
   "e": "A row [0 0 ... 0 | c] with c ≠ 0 reads 0 = c — a contradiction, so the system is inconsistent. If instead c = 0, the row carries no information and there are infinitely many solutions (fewer pivots than unknowns).",
   "ru": {
    "t": "При гауссовом исключении на расширенной матрице получена строка [0 0 | c], где c ≠ 0. Что это означает?",
    "o": [
     "Система не имеет решений: строка читается как 0 = c, что невозможно",
     "Система имеет бесконечно много решений",
     "Система имеет единственное решение",
     "Требуется обмен строк"
    ],
    "e": "Строка [0 0 ... 0 | c] с c ≠ 0 читается как 0 = c — противоречие, система несовместна. Если же c = 0, строка информации не даёт и решений бесконечно много (опорных элементов меньше, чем неизвестных)."
   },
   "uz": {
    "t": "Kengaytirilgan matritsada gauss eliminasiyasi paytida [0 0 | c] satri hosil boʻldi, bunda c ≠ 0. Bu nimani anglatadi?",
    "o": [
     "Sistemada yechim yoʻq: satr 0 = c deb oʻqiladi, bu esa imkonsiz",
     "Sistemada cheksiz koʻp yechim bor",
     "Sistemada yagona yechim bor",
     "Satrlarni almashtirish kerak"
    ],
    "e": "[0 0 ... 0 | c] satri c ≠ 0 bilan 0 = c deb oʻqiladi — ziddiyat, sistema mos emas. Agar c = 0 boʻlsa, satr maʼlumot bermaydi va yechimlar cheksiz koʻp boʻladi (tayanch elementlar nomaʼlumlardan kam)."
   }
  },
  {
   "t": "Classify the system [1 1; 2 2]·[x; y] = [2; c] for c = 4 and c = 5.",
   "o": [
    "c = 4: infinitely many solutions (the lines coincide); c = 5: no solution (parallel lines)",
    "c = 4: no solution; c = 5: infinitely many solutions",
    "Both values give a unique solution",
    "Both values make the system inconsistent"
   ],
   "e": "R_2 ← R_2 − 2R_1 produces the row [0 0 | c − 4]. For c = 4 it reads 0 = 0 — one equation x + y = 2 remains, so infinitely many solutions [2 − t; t]; for c = 5 it reads 0 = 1 — no solutions.",
   "ru": {
    "t": "Классифицируйте систему [1 1; 2 2]·[x; y] = [2; c] для c = 4 и c = 5.",
    "o": [
     "c = 4: бесконечно много решений (прямые совпадают); c = 5: решений нет (прямые параллельны)",
     "c = 4: решений нет; c = 5: бесконечно много",
     "Оба значения дают единственное решение",
     "Оба значения делают систему несовместной"
    ],
    "e": "R_2 ← R_2 − 2R_1 даёт строку [0 0 | c − 4]. При c = 4 это 0 = 0 — остаётся одно уравнение x + y = 2, решений бесконечно много: [2 − t; t]; при c = 5 это 0 = 1 — решений нет."
   },
   "uz": {
    "t": "[1 1; 2 2]·[x; y] = [2; c] sistemasini c = 4 va c = 5 uchun tasniflang.",
    "o": [
     "c = 4: cheksiz koʻp yechim (chiziqlar ustma-ust tushadi); c = 5: yechim yoʻq (parallel chiziqlar)",
     "c = 4: yechim yoʻq; c = 5: cheksiz koʻp yechim",
     "Ikkala qiymat ham yagona yechim beradi",
     "Ikkala qiymat ham sistemani mos emas qiladi"
    ],
    "e": "R_2 ← R_2 − 2R_1 [0 0 | c − 4] satrini beradi. c = 4 da bu 0 = 0 — x + y = 2 tenglamasi qoladi, yechimlar cheksiz: [2 − t; t]; c = 5 da 0 = 1 — yechim yoʻq."
   }
  },
  {
   "t": "Eliminate below the first pivot in the augmented matrix [2 3 | 7; 8 13 | 29]. What are the multiplier and the resulting pivots?",
   "o": [
    "λ_21 = 4; after R_2 ← R_2 − 4R_1 the pivots are 2 and 1",
    "λ_21 = 2; the pivots are 2 and 3",
    "λ_21 = 4; the pivots are 2 and 13",
    "λ_21 = 8/3; the pivots are 3 and 1"
   ],
   "e": "The multiplier is λ_21 = a_21/a_11 = 8/2 = 4. Then [8 13 | 29] − 4·[2 3 | 7] = [0 1 | 1], giving pivots 2 and 1.",
   "ru": {
    "t": "Исключите под первым опорным элементом в расширенной матрице [2 3 | 7; 8 13 | 29]. Каков множитель и каковы полученные опорные элементы?",
    "o": [
     "λ_21 = 4; после R_2 ← R_2 − 4R_1 опорные элементы равны 2 и 1",
     "λ_21 = 2; опорные элементы 2 и 3",
     "λ_21 = 4; опорные элементы 2 и 13",
     "λ_21 = 8/3; опорные элементы 3 и 1"
    ],
    "e": "Множитель равен λ_21 = a_21/a_11 = 8/2 = 4. Затем [8 13 | 29] − 4·[2 3 | 7] = [0 1 | 1], опорные элементы 2 и 1."
   },
   "uz": {
    "t": "[2 3 | 7; 8 13 | 29] kengaytirilgan matritsasida birinchi tayanch ostida eliminasiya qiling. Koʻpaytuvchi va hosil boʻlgan tayanch elementlar qanday?",
    "o": [
     "λ_21 = 4; R_2 ← R_2 − 4R_1 dan keyin tayanch elementlar 2 va 1",
     "λ_21 = 2; tayanch elementlar 2 va 3",
     "λ_21 = 4; tayanch elementlar 2 va 13",
     "λ_21 = 8/3; tayanch elementlar 3 va 1"
    ],
    "e": "Koʻpaytuvchi λ_21 = a_21/a_11 = 8/2 = 4. Soʻngra [8 13 | 29] − 4·[2 3 | 7] = [0 1 | 1], tayanch elementlar 2 va 1."
   }
  },
  {
   "t": "Solve the triangular system [2 1 −1; 0 3 2; 0 0 4]·[x; y; z] = [3; 7; 8] by back substitution.",
   "o": [
    "x = 2, y = 1, z = 2",
    "x = 1, y = 2, z = 2",
    "x = 2, y = 2, z = 1",
    "x = 3, y = 1, z = 2"
   ],
   "e": "Bottom-up: 4z = 8 gives z = 2; 3y + 2·2 = 7 gives y = 1; 2x + 1 − 2 = 3 gives x = 2. Check: A·[2; 1; 2] = [3; 7; 8].",
   "ru": {
    "t": "Решите треугольную систему [2 1 −1; 0 3 2; 0 0 4]·[x; y; z] = [3; 7; 8] обратной подстановкой.",
    "o": [
     "x = 2, y = 1, z = 2",
     "x = 1, y = 2, z = 2",
     "x = 2, y = 2, z = 1",
     "x = 3, y = 1, z = 2"
    ],
    "e": "Снизу вверх: 4z = 8 даёт z = 2; 3y + 2·2 = 7 даёт y = 1; 2x + 1 − 2 = 3 даёт x = 2. Проверка: A·[2; 1; 2] = [3; 7; 8]."
   },
   "uz": {
    "t": "[2 1 −1; 0 3 2; 0 0 4]·[x; y; z] = [3; 7; 8] uchburchak sistemasini teskari almashtirish bilan yeching.",
    "o": [
     "x = 2, y = 1, z = 2",
     "x = 1, y = 2, z = 2",
     "x = 2, y = 2, z = 1",
     "x = 3, y = 1, z = 2"
    ],
    "e": "Pastdan yuqoriga: 4z = 8 → z = 2; 3y + 2·2 = 7 → y = 1; 2x + 1 − 2 = 3 → x = 2. Tekshirish: A·[2; 1; 2] = [3; 7; 8]."
   }
  },
  {
   "t": "Which 3×3 matrix E performs the row operation R_3 ← R_3 − 4R_1?",
   "o": [
    "E = [1 0 0; 0 1 0; −4 0 1]",
    "E = [1 0 0; 0 1 0; 4 0 1]",
    "E = [1 0 −4; 0 1 0; 0 0 1]",
    "E = [1 0 0; 0 1 0; 0 −4 1]"
   ],
   "e": "E is the identity with −4 in position (3, 1): the third row of EA equals row 3 minus 4·(row 1). To undo the step, add back: E^{-1} = [1 0 0; 0 1 0; 4 0 1].",
   "ru": {
    "t": "Какая матрица E размера 3×3 выполняет строковую операцию R_3 ← R_3 − 4R_1?",
    "o": [
     "E = [1 0 0; 0 1 0; −4 0 1]",
     "E = [1 0 0; 0 1 0; 4 0 1]",
     "E = [1 0 −4; 0 1 0; 0 0 1]",
     "E = [1 0 0; 0 1 0; 0 −4 1]"
    ],
    "e": "E — единичная матрица с −4 в позиции (3, 1): третья строка EA равна строке 3 минус 4·(строка 1). Отмена шага — прибавление обратно: E^{-1} = [1 0 0; 0 1 0; 4 0 1]."
   },
   "uz": {
    "t": "Qaysi 3×3 E matritsa R_3 ← R_3 − 4R_1 satr amalini bajaradi?",
    "o": [
     "E = [1 0 0; 0 1 0; −4 0 1]",
     "E = [1 0 0; 0 1 0; 4 0 1]",
     "E = [1 0 −4; 0 1 0; 0 0 1]",
     "E = [1 0 0; 0 1 0; 0 −4 1]"
    ],
    "e": "E — (3, 1) pozitsiyasida −4 turgan birlik matritsa: EA ning uchinchi satri 3-satrdan 4·(1-satr) ayirilganiga teng. Qadamni bekor qilish — qayta qoʻshish: E^{-1} = [1 0 0; 0 1 0; 4 0 1]."
   }
  },
  {
   "t": "Which 3×3 matrix E_32 performs the row operation R_3 ← R_3 + 5R_2?",
   "o": [
    "E_32 = [1 0 0; 0 1 0; 0 5 1]",
    "E_32 = [1 0 0; 0 1 0; 0 −5 1]",
    "E_32 = [1 0 0; 0 1 5; 0 0 1]",
    "E_32 = [1 0 0; 0 1 0; 5 0 1]"
   ],
   "e": "E_32 is the identity with 5 in position (3, 2): rows 1–2 are unchanged, and row 3 of the product equals row 3 plus 5·(row 2). Multiplying on the left by E performs the row operation — on A and on b alike.",
   "ru": {
    "t": "Какая матрица 3×3 выполняет операцию R_3 ← R_3 + 5R_2?",
    "o": [
     "E_32 = [1 0 0; 0 1 0; 0 5 1]",
     "E_32 = [1 0 0; 0 1 0; 0 −5 1]",
     "E_32 = [1 0 0; 0 1 5; 0 0 1]",
     "E_32 = [1 0 0; 0 1 0; 5 0 1]"
    ],
    "e": "E_32 — единичная матрица с 5 в позиции (3, 2): строки 1–2 не меняются, а строка 3 произведения равна строке 3 плюс 5·(строка 2). Умножение слева на E выполняет строковую операцию — и над A, и над b."
   },
   "uz": {
    "t": "Qaysi 3×3 E_32 matritsa R_3 ← R_3 + 5R_2 amalini bajaradi?",
    "o": [
     "E_32 = [1 0 0; 0 1 0; 0 5 1]",
     "E_32 = [1 0 0; 0 1 0; 0 −5 1]",
     "E_32 = [1 0 0; 0 1 5; 0 0 1]",
     "E_32 = [1 0 0; 0 1 0; 5 0 1]"
    ],
    "e": "E_32 — (3, 2) pozitsiyasida 5 turgan birlik matritsa: 1–2-satrlar oʻzgarmaydi, koʻpaytmaning 3-satri esa 3-satr ustiga 5·(2-satr) qoʻshilganiga teng. E ga chapdan koʻpaytirish satr amalini bajaradi — ham A, ham b ustida."
   }
  },
  {
   "t": "Let E = [1 0; −2 1] and A = [3 1; 6 5]. Compute EA and describe the operation.",
   "o": [
    "EA = [3 1; 0 3]: E subtracts twice row 1 from row 2 (multiplier 2)",
    "EA = [3 1; 0 5]: E subtracts row 1 from row 2",
    "EA = [3 1; 6 3]: E subtracts twice row 2 from row 1",
    "EA = [0 1; 6 5]"
   ],
   "e": "Row 1 of the product is [3 1]; row 2 is −2·[3 1] + [6 5] = [0 3]. So EA = [3 1; 0 3] — elimination below the pivot 3 with multiplier 6/3 = 2.",
   "ru": {
    "t": "Пусть E = [1 0; −2 1] и A = [3 1; 6 5]. Вычислите EA и опишите выполняемую операцию.",
    "o": [
     "EA = [3 1; 0 3]: E вычитает удвоенную строку 1 из строки 2 (множитель 2)",
     "EA = [3 1; 0 5]: E вычитает строку 1 из строки 2",
     "EA = [3 1; 6 3]: E вычитает удвоенную строку 2 из строки 1",
     "EA = [0 1; 6 5]"
    ],
    "e": "Строка 1 произведения: [3 1]; строка 2: −2·[3 1] + [6 5] = [0 3]. Итак, EA = [3 1; 0 3] — исключение под опорным элементом 3 с множителем 6/3 = 2."
   },
   "uz": {
    "t": "E = [1 0; −2 1] va A = [3 1; 6 5] boʻlsin. EA ni hisoblang va bajarilayotgan amalni taʼriflang.",
    "o": [
     "EA = [3 1; 0 3]: E 1-satrning ikki barobarini 2-satrdan ayiradi (koʻpaytuvchi 2)",
     "EA = [3 1; 0 5]: E 1-satrni 2-satrdan ayiradi",
     "EA = [3 1; 6 3]: E 2-satrning ikki barobarini 1-satrdan ayiradi",
     "EA = [0 1; 6 5]"
    ],
    "e": "Koʻpaytmaning 1-satri: [3 1]; 2-satri: −2·[3 1] + [6 5] = [0 3]. Demak, EA = [3 1; 0 3] — 3 tayanch elementi ostida 6/3 = 2 koʻpaytuvchi bilan eliminasiya."
   }
  },
  {
   "t": "Find the inverse of the elimination matrix E = [1 0 0; 0 1 0; 0 −3 1].",
   "o": [
    "E^{-1} = [1 0 0; 0 1 0; 0 3 1] — add back what was subtracted",
    "E^{-1} = [1 0 0; 0 1 0; 0 −3 1] — E is its own inverse",
    "E^{-1} = [1 0 0; 0 1 0; 0 −1/3 1]",
    "E^{-1} = [1 0 0; 0 1 3; 0 0 1]"
   ],
   "e": "E implements R_3 ← R_3 − 3R_2; the inverse operation adds 3R_2 back: E^{-1} = [1 0 0; 0 1 0; 0 3 1]. Indeed E^{-1}·E = I — only the sign of the multiplier changes.",
   "ru": {
    "t": "Найдите обратную матрицу для матрицы исключения E = [1 0 0; 0 1 0; 0 −3 1].",
    "o": [
     "E^{-1} = [1 0 0; 0 1 0; 0 3 1] — прибавить обратно вычтенное",
     "E^{-1} = [1 0 0; 0 1 0; 0 −3 1] — E совпадает со своей обратной",
     "E^{-1} = [1 0 0; 0 1 0; 0 −1/3 1]",
     "E^{-1} = [1 0 0; 0 1 3; 0 0 1]"
    ],
    "e": "E реализует R_3 ← R_3 − 3R_2; обратная операция прибавляет 3R_2 обратно: E^{-1} = [1 0 0; 0 1 0; 0 3 1]. Верно и E^{-1}·E = I — меняется только знак множителя."
   },
   "uz": {
    "t": "E = [1 0 0; 0 1 0; 0 −3 1] eliminasiya matritsasining teskarisini toping.",
    "o": [
     "E^{-1} = [1 0 0; 0 1 0; 0 3 1] — ayirilganni qayta qoʻshish",
     "E^{-1} = [1 0 0; 0 1 0; 0 −3 1] — E oʻz teskarisiga teng",
     "E^{-1} = [1 0 0; 0 1 0; 0 −1/3 1]",
     "E^{-1} = [1 0 0; 0 1 3; 0 0 1]"
    ],
    "e": "E amali R_3 ← R_3 − 3R_2; teskarisi 3R_2 ni qayta qoʻshadi: E^{-1} = [1 0 0; 0 1 0; 0 3 1]. Haqiqatan ham E^{-1}·E = I — faqat koʻpaytuvchi ishorasi oʻzgaradi."
   }
  },
  {
   "t": "Solve [0 2; 3 1]·[x; y] = [4; 7] using a row exchange. What are the solution and the permutation matrix?",
   "o": [
    "x = 5/3, y = 2, with P = [0 1; 1 0]",
    "x = 2, y = 5/3, with P = [0 1; 1 0]",
    "x = 5/3, y = 2, with P = [1 0; 0 1] — no exchange needed",
    "No solution: the zero pivot means the matrix is singular"
   ],
   "e": "Swap the rows: P = [0 1; 1 0] gives PA = [3 1; 0 2] and Pb = [7; 4]. Then 2y = 4 gives y = 2, and 3x + 2 = 7 gives x = 5/3. A zero pivot with a nonzero entry below it is only a temporary failure.",
   "ru": {
    "t": "Решите систему [0 2; 3 1]·[x; y] = [4; 7] с обменом строк. Каково решение и какова матрица перестановки?",
    "o": [
     "x = 5/3, y = 2, P = [0 1; 1 0]",
     "x = 2, y = 5/3, P = [0 1; 1 0]",
     "x = 5/3, y = 2, P = [1 0; 0 1] — обмен не нужен",
     "Решений нет: нулевой опорный элемент означает вырожденность"
    ],
    "e": "Обмен строк: P = [0 1; 1 0] даёт PA = [3 1; 0 2] и Pb = [7; 4]. Тогда 2y = 4 даёт y = 2, а 3x + 2 = 7 даёт x = 5/3. Нулевой опорный элемент с ненулевым элементом ниже — лишь временная неудача."
   },
   "uz": {
    "t": "[0 2; 3 1]·[x; y] = [4; 7] sistemasini satr almashinuvi bilan yeching. Yechim va permutatsiya matritsasi qanday?",
    "o": [
     "x = 5/3, y = 2, P = [0 1; 1 0]",
     "x = 2, y = 5/3, P = [0 1; 1 0]",
     "x = 5/3, y = 2, P = [1 0; 0 1] — almashinish kerak emas",
     "Yechim yoʻq: nol tayanch matritsa singulyar degani"
    ],
    "e": "Satrlarni almashtiring: P = [0 1; 1 0] PA = [3 1; 0 2] va Pb = [7; 4] beradi. U holda 2y = 4 → y = 2, 3x + 2 = 7 → x = 5/3. Ostida noldan farqli element turib, tayanchning nol boʻlishi — faqat vaqtinchalik muammo."
   }
  },
  {
   "t": "Which permutation matrix exchanges rows 1 and 3 of a 3×3 matrix, and what is P^2?",
   "o": [
    "P = [0 0 1; 0 1 0; 1 0 0] and P^2 = I — a double exchange restores the order",
    "P = [1 0 0; 0 0 1; 0 1 0] and P^2 = 0",
    "P = [0 1 0; 1 0 0; 0 0 1] and P^2 = I",
    "P = [0 0 1; 0 1 0; 1 0 0] and P^2 = P"
   ],
   "e": "P_13 is the identity with rows 1 and 3 swapped. Exchanging rows 1 and 3 twice returns the original matrix, so P^2 = I and P^{-1} = P — consistent with P^{-1} = P^T.",
   "ru": {
    "t": "Какая матрица перестановки обменивает строки 1 и 3 матрицы 3×3 и чему равна P^2?",
    "o": [
     "P = [0 0 1; 0 1 0; 1 0 0] и P^2 = I — двойной обмен возвращает порядок",
     "P = [1 0 0; 0 0 1; 0 1 0] и P^2 = 0",
     "P = [0 1 0; 1 0 0; 0 0 1] и P^2 = I",
     "P = [0 0 1; 0 1 0; 1 0 0] и P^2 = P"
    ],
    "e": "P_13 — единичная матрица с обменянными строками 1 и 3. Двойной обмен строк 1 и 3 возвращает исходную матрицу, поэтому P^2 = I и P^{-1} = P — согласуется с P^{-1} = P^T."
   },
   "uz": {
    "t": "Qaysi permutatsiya matritsa 3×3 matritsaning 1- va 3-satrlarini almashtiradi va P^2 nimaga teng?",
    "o": [
     "P = [0 0 1; 0 1 0; 1 0 0] va P^2 = I — ikki karra almashinish tartibni tiklaydi",
     "P = [1 0 0; 0 0 1; 0 1 0] va P^2 = 0",
     "P = [0 1 0; 1 0 0; 0 0 1] va P^2 = I",
     "P = [0 0 1; 0 1 0; 1 0 0] va P^2 = P"
    ],
    "e": "P_13 — 1- va 3-satrlari almashtirilgan birlik matritsa. 1- va 3-satrlarni ikki marta almashtirish asl matritsani qaytaradi, shuning uchun P^2 = I va P^{-1} = P — bu P^{-1} = P^T ga mos."
   }
  },
  {
   "t": "Let E = [1 0; −2 1] (elimination) and P = [0 1; 1 0] (exchange). What can be said about EP and PE?",
   "o": [
    "EP ≠ PE: row operations generally do not commute (EP = [0 1; 1 −2], PE = [−2 1; 1 0])",
    "EP = PE: both equal [0 1; 1 0]",
    "EP = PE: both equal [1 0; −2 1]",
    "PE is not defined for these matrices"
   ],
   "e": "Computing: EP = [0 1; 1 −2], while PE = [−2 1; 1 0]. The products differ — 'eliminate then exchange' and 'exchange then eliminate' give different matrices, so row operations do not commute.",
   "ru": {
    "t": "Пусть E = [1 0; −2 1] (исключение) и P = [0 1; 1 0] (обмен). Что можно сказать о EP и PE?",
    "o": [
     "EP ≠ PE: строковые операции, вообще говоря, не коммутируют (EP = [0 1; 1 −2], PE = [−2 1; 1 0])",
     "EP = PE: оба равны [0 1; 1 0]",
     "EP = PE: оба равны [1 0; −2 1]",
     "PE для этих матриц не определено"
    ],
    "e": "Вычисление: EP = [0 1; 1 −2], тогда как PE = [−2 1; 1 0]. Произведения различны: «сначала исключение, потом обмен» и «сначала обмен, потом исключение» дают разные матрицы — строковые операции не коммутируют."
   },
   "uz": {
    "t": "E = [1 0; −2 1] (eliminasiya) va P = [0 1; 1 0] (almashinish) boʻlsin. EP va PE haqida nima deyish mumkin?",
    "o": [
     "EP ≠ PE: satr amallari umuman kommutativ emas (EP = [0 1; 1 −2], PE = [−2 1; 1 0])",
     "EP = PE: ikkalasi ham [0 1; 1 0] ga teng",
     "EP = PE: ikkalasi ham [1 0; −2 1] ga teng",
     "Bu matritsalar uchun PE aniqlanmagan"
    ],
    "e": "Hisoblash: EP = [0 1; 1 −2], PE = [−2 1; 1 0]. Koʻpaytmalar farq qiladi: «avval eliminasiya, keyin almashinish» va «avval almashinish, keyin eliminasiya» har xil matritsalar beradi — satr amallari kommutativ emas."
   }
  },
  {
   "t": "For A = [1 2; 2 4], classify the systems Ax = [3; 6] and Ax = [3; 7].",
   "o": [
    "[3; 6]: infinitely many solutions; [3; 7]: no solutions",
    "[3; 6]: no solutions; [3; 7]: infinitely many solutions",
    "Both have unique solutions",
    "Both have infinitely many solutions"
   ],
   "e": "Row 2 = 2·(row 1). For b = [3; 6] the same relation holds (6 = 2·3), leaving one equation x + 2y = 3 — infinitely many solutions. For b = [3; 7] the elimination gives 0 = 1 — no solutions. The matrix has rank 1 and no inverse.",
   "ru": {
    "t": "Для A = [1 2; 2 4] классифицируйте системы Ax = [3; 6] и Ax = [3; 7].",
    "o": [
     "[3; 6]: бесконечно много решений; [3; 7]: решений нет",
     "[3; 6]: решений нет; [3; 7]: бесконечно много",
     "Обе имеют единственное решение",
     "Обе имеют бесконечно много решений"
    ],
    "e": "Строка 2 = 2·(строка 1). Для b = [3; 6] то же соотношение выполнено (6 = 2·3), остаётся одно уравнение x + 2y = 3 — решений бесконечно много. Для b = [3; 7] исключение даёт 0 = 1 — решений нет. Ранг матрицы равен 1, обратной нет."
   },
   "uz": {
    "t": "A = [1 2; 2 4] uchun Ax = [3; 6] va Ax = [3; 7] sistemalarini tasniflang.",
    "o": [
     "[3; 6]: cheksiz koʻp yechim; [3; 7]: yechim yoʻq",
     "[3; 6]: yechim yoʻq; [3; 7]: cheksiz koʻp yechim",
     "Ikkalasida ham yagona yechim bor",
     "Ikkalasida ham cheksiz koʻp yechim bor"
    ],
    "e": "2-satr = 2·(1-satr). b = [3; 6] uchun xuddi shu munosabat bajariladi (6 = 2·3), bitta x + 2y = 3 tenglamasi qoladi — cheksiz koʻp yechim. b = [3; 7] uchun eliminasiya 0 = 1 beradi — yechim yoʻq. Matritsa rangi 1, teskarisi yoʻq."
   }
  },
  {
   "t": "For A = [1 2; 2 4], which right-hand sides b = [b_1; b_2] allow the system Ax = b to be solved?",
   "o": [
    "Exactly those with b_2 = 2b_1: b must lie on the line through the columns of A",
    "All b in R^2",
    "Only b = [0; 0]",
    "Exactly those with b_1 = 2b_2"
   ],
   "e": "The columns are [1; 2] and [2; 4] = 2·[1; 2], so every combination x·[1; 2] + y·[2; 4] lies on the line b_2 = 2b_1. Consistency requires exactly b_2 = 2b_1 (e.g. [4; 8] works, [4; 9] does not).",
   "ru": {
    "t": "Для A = [1 2; 2 4] какие правые части b = [b_1; b_2] допускают решение системы Ax = b?",
    "o": [
     "Ровно те, для которых b_2 = 2b_1: b должен лежать на прямой через столбцы A",
     "Все b из R^2",
     "Только b = [0; 0]",
     "Ровно те, для которых b_1 = 2b_2"
    ],
    "e": "Столбцы [1; 2] и [2; 4] = 2·[1; 2] пропорциональны, поэтому любая комбинация x·[1; 2] + y·[2; 4] лежит на прямой b_2 = 2b_1. Совместность требует ровно b_2 = 2b_1 (например, [4; 8] решается, [4; 9] — нет)."
   },
   "uz": {
    "t": "A = [1 2; 2 4] uchun qaysi b = [b_1; b_2] oʻng tomonlar Ax = b sistemasini yechishga imkon beradi?",
    "o": [
     "Aynan b_2 = 2b_1 bajarilganlari: b, A ustunlari orqali oʻtuvchi toʻgʻri chiziqda yotishi kerak",
     "R^2 dagi barcha b",
     "Faqat b = [0; 0]",
     "Aynan b_1 = 2b_2 bajarilganlari"
    ],
    "e": "[1; 2] va [2; 4] = 2·[1; 2] ustunlari proporsional, shuning uchun har qanday x·[1; 2] + y·[2; 4] kombinatsiyasi b_2 = 2b_1 toʻgʻri chizigʻida yotadi. Moslik aynan b_2 = 2b_1 ni talab qiladi (masalan, [4; 8] yechiladi, [4; 9] — yoʻq)."
   }
  },
  {
   "t": "For a square n×n matrix A, having n pivots after elimination is equivalent to:",
   "o": [
    "A being invertible: Ax = b has exactly one solution for every b",
    "A having rank 1",
    "Ax = 0 having nonzero solutions",
    "A being symmetric"
   ],
   "e": "n pivots mean the columns are independent, so Ax = 0 has only x = 0 and Ax = b is uniquely solvable for every b — the matrix is invertible. The number of pivots found by elimination is the rank.",
   "ru": {
    "t": "Для квадратной матрицы A размера n×n наличие n опорных элементов после исключения равносильно тому, что:",
    "o": [
     "A обратима: Ax = b имеет ровно одно решение для каждого b",
     "ранг A равен 1",
     "Ax = 0 имеет ненулевые решения",
     "A симметрична"
    ],
    "e": "n опорных элементов означают независимость столбцов: Ax = 0 имеет только решение x = 0, а Ax = b однозначно разрешима при каждом b — матрица обратима. Число опорных элементов, найденных исключением, — это ранг."
   },
   "uz": {
    "t": "n×n kvadrat matritsa A uchun eliminasiyadan keyin n ta tayanch elementga ega boʻlish nimga ekvivalent?",
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
    "It continues on [A | I] up to the reduced form [I | A^{-1}]",
    "It stops earlier, at the first pivot",
    "It swaps all rows of A before eliminating",
    "It computes the transpose instead of the inverse"
   ],
   "e": "Gauss–Jordan keeps eliminating above the pivots too, reducing the left block of [A | I] to the identity; the right block then holds A^{-1}. Gaussian elimination itself stops at U plus back substitution.",
   "ru": {
    "t": "Гауссово исключение останавливается на верхней треугольной U и завершается обратной подстановкой. Что вместо этого делает метод Гаусса–Жордана?",
    "o": [
     "Он продолжает работу над [A | I] до приведённого вида [I | A^{-1}]",
     "Он останавливается раньше — на первом опорном элементе",
     "Он меняет местами все строки A перед исключением",
     "Он вычисляет транспонирование вместо обратной"
    ],
    "e": "Гаусс–Жордан исключает и над опорными элементами, приводя левый блок [A | I] к единичной матрице; тогда в правом блоке стоит A^{-1}. Само гауссово исключение останавливается на U плюс обратная подстановка."
   },
   "uz": {
    "t": "Gauss eliminasiyasi yuqori uchburchak U da toʻxtaydi va teskari almashtirish bilan tugaydi. Gauss–Jordan usuli buning oʻrniga nima qiladi?",
    "o": [
     "U [A | I] ustida ishlashni [I | A^{-1}] koʻrinishigacha davom ettiradi",
     "U birinchi tayanchda, undan ham oldinroq toʻxtaydi",
     "Eliminasiyadan oldin A ning barcha satrlarini almashtiradi",
     "Teskarining oʻrniga transpozitsiyani hisoblaydi"
    ],
    "e": "Gauss–Jordan tayanch elementlar ustida ham eliminasiya qilib, [A | I] ning chap blokini birlik matritsaga keltiradi; oʻng blokda esa A^{-1} turadi. Gauss eliminasiyaning oʻzi esa U da teskari almashtirish bilan toʻxtaydi."
   }
  },
  {
   "t": "Which of the four ways to compute the product AB is the COLUMN interpretation?",
   "o": [
    "AB = [Ab_1 ... Ab_p]: column j of AB is A times column j of B",
    "Each row of AB is a combination of the rows of B",
    "(AB)_ij is the dot product of row i of A with column j of B, entry by entry",
    "AB is the sum over k of (column k of A)·(row k of B) — outer products"
   ],
   "e": "Column view: multiplying A by the j-th column of B produces the j-th column of AB, so AB = [Ab_1 ... Ab_p]. The other options are the row view, the entry view and the outer-product view — all four give the same AB.",
   "ru": {
    "t": "Какой из четырёх способов вычисления произведения AB соответствует СТОЛБЦОВОЙ интерпретации?",
    "o": [
     "AB = [Ab_1 ... Ab_p]: столбец j матрицы AB равен A, умноженной на столбец j матрицы B",
     "Каждая строка AB есть комбинация строк B",
     "(AB)_ij — скалярное произведение строки i матрицы A и столбца j матрицы B, поэлементно",
     "AB — сумма по k произведений (столбец k матрицы A)·(строка k матрицы B) — внешние произведения"
    ],
    "e": "Столбцовый взгляд: умножение A на j-й столбец B даёт j-й столбец AB, то есть AB = [Ab_1 ... Ab_p]. Остальные варианты — строчный, поэлементный взгляды и взгляд через внешние произведения; все четыре дают одно AB."
   },
   "uz": {
    "t": "AB koʻpaytmasini hisoblashning toʻrt usulidan qaysi biri USTUNLI talqinga mos keladi?",
    "o": [
     "AB = [Ab_1 ... Ab_p]: AB ning j-ustuni — A ning B ning j-ustuniga koʻpaytmasi",
     "AB ning har bir satri — B satrlarining kombinatsiyasi",
     "(AB)_ij — A ning i-satri bilan B ning j-ustunining skalyar koʻpaytmasi, elementma-element",
     "AB — k boʻyicha (A ning k-ustuni)·(B ning k-satri) yigʻindisi — tashqi koʻpaytmalar"
    ],
    "e": "Ustunli qarash: A ni B ning j-ustuniga koʻpaytirish AB ning j-ustunini beradi, yaʼni AB = [Ab_1 ... Ab_p]. Qolgan variantlar — satrli, elementli va tashqi koʻpaytma qarashlari; toʻrttasi bir xil AB beradi."
   }
  },
  {
   "t": "Compute the product [1 2 0; −1 3 4]·[2 1; 0 −1; 3 2].",
   "o": [
    "[2 −1; 10 4]",
    "[2 1; 10 4]",
    "[2 −1; 10 −4]",
    "[−2 −1; 10 4]"
   ],
   "e": "Entry (i, j) is row i of the first matrix times column j of the second: (1,1) = 1·2 + 2·0 + 0·3 = 2; (1,2) = 1·1 + 2·(−1) + 0·2 = −1; (2,1) = −1·2 + 3·0 + 4·3 = 10; (2,2) = −1 − 3 + 8 = 4.",
   "ru": {
    "t": "Вычислите произведение [1 2 0; −1 3 4]·[2 1; 0 −1; 3 2].",
    "o": [
     "[2 −1; 10 4]",
     "[2 1; 10 4]",
     "[2 −1; 10 −4]",
     "[−2 −1; 10 4]"
    ],
    "e": "Элемент (i, j) — строка i первой матрицы на столбец j второй: (1,1) = 1·2 + 2·0 + 0·3 = 2; (1,2) = 1·1 + 2·(−1) + 0·2 = −1; (2,1) = −1·2 + 3·0 + 4·3 = 10; (2,2) = −1 − 3 + 8 = 4."
   },
   "uz": {
    "t": "[1 2 0; −1 3 4]·[2 1; 0 −1; 3 2] koʻpaytmasini hisoblang.",
    "o": [
     "[2 −1; 10 4]",
     "[2 1; 10 4]",
     "[2 −1; 10 −4]",
     "[−2 −1; 10 4]"
    ],
    "e": "(i, j) elementi — birinchi matritsaning i-satri bilan ikkinchisining j-ustunining koʻpaytmasi: (1,1) = 1·2 + 2·0 + 0·3 = 2; (1,2) = 1·1 + 2·(−1) + 0·2 = −1; (2,1) = −1·2 + 3·0 + 4·3 = 10; (2,2) = −1 − 3 + 8 = 4."
   }
  },
  {
   "t": "For A = [1 1; 0 1] and B = [1 0; 1 1], compute AB and BA.",
   "o": [
    "AB = [2 1; 1 1], BA = [1 1; 1 2] — the two products are different",
    "AB = BA = [2 1; 1 1]",
    "AB = [1 1; 1 2], BA = [2 1; 1 1]",
    "AB = [2 1; 1 1], BA = [1 0; 0 1]"
   ],
   "e": "AB combines the columns of A: [A·(1; 1), A·(0; 1)] = [2 1; 1 1]. BA combines the rows of A and gives [1 1; 1 2]. In general AB ≠ BA — matrix multiplication is not commutative (horizontal and vertical shears depend on the order).",
   "ru": {
    "t": "Для A = [1 1; 0 1] и B = [1 0; 1 1] вычислите AB и BA.",
    "o": [
     "AB = [2 1; 1 1], BA = [1 1; 1 2] — произведения различны",
     "AB = BA = [2 1; 1 1]",
     "AB = [1 1; 1 2], BA = [2 1; 1 1]",
     "AB = [2 1; 1 1], BA = [1 0; 0 1]"
    ],
    "e": "AB комбинирует столбцы A: [A·(1; 1), A·(0; 1)] = [2 1; 1 1]. BA комбинирует строки A и даёт [1 1; 1 2]. Вообще говоря, AB ≠ BA — умножение матриц некоммутативно (горизонтальный и вертикальный сдвиги зависят от порядка)."
   },
   "uz": {
    "t": "A = [1 1; 0 1] va B = [1 0; 1 1] uchun AB va BA ni hisoblang.",
    "o": [
     "AB = [2 1; 1 1], BA = [1 1; 1 2] — ikki koʻpaytma farqli",
     "AB = BA = [2 1; 1 1]",
     "AB = [1 1; 1 2], BA = [2 1; 1 1]",
     "AB = [2 1; 1 1], BA = [1 0; 0 1]"
    ],
    "e": "AB A ning ustunlarini aralashtiradi: [A·(1; 1), A·(0; 1)] = [2 1; 1 1]. BA A satrlarini aralashtirib [1 1; 1 2] beradi. Umuman AB ≠ BA — matritsalar koʻpaytmasi kommutativ emas (gorizontal va vertikal siljishlar tartibga bogʻliq)."
   }
  },
  {
   "t": "Which statement about matrix algebra is TRUE (whenever the sums and products are defined)?",
   "o": [
    "(AB)C = A(BC) and A(B + C) = AB + AC — associativity and distributivity always hold",
    "AB = BA for all square matrices A and B",
    "(A + B)^2 = A^2 + 2AB + B^2 for all A and B",
    "(AB)^2 = A^2·B^2 for all invertible A and B"
   ],
   "e": "Matrix multiplication is associative and distributive over addition. It is NOT commutative: expanding (A + B)^2 gives A^2 + AB + BA + B^2, which differs from A^2 + 2AB + B^2 unless AB = BA, and (AB)^2 = ABAB ≠ A^2B^2.",
   "ru": {
    "t": "Какое утверждение о матричной алгебре ВЕРНО (когда суммы и произведения определены)?",
    "o": [
     "(AB)C = A(BC) и A(B + C) = AB + AC — ассоциативность и дистрибутивность выполняются всегда",
     "AB = BA для всех квадратных матриц A и B",
     "(A + B)^2 = A^2 + 2AB + B^2 для всех A и B",
     "(AB)^2 = A^2·B^2 для всех обратимых A и B"
    ],
    "e": "Матричное умножение ассоциативно и дистрибутивно относительно сложения. Оно НЕ коммутативно: раскрытие (A + B)^2 даёт A^2 + AB + BA + B^2, что отличается от A^2 + 2AB + B^2, если только AB = BA, и (AB)^2 = ABAB ≠ A^2B^2."
   },
   "uz": {
    "t": "Matritsalar algebrasi haqida qaysi gap TOʻGʻRI (yigʻindilar va koʻpaytmalar aniqlangan sharoitda)?",
    "o": [
     "(AB)C = A(BC) va A(B + C) = AB + AC — assotsiativlik va distributivlik doim oʻrinli",
     "Barcha kvadrat A va B uchun AB = BA",
     "Barcha A va B uchun (A + B)^2 = A^2 + 2AB + B^2",
     "Barcha teskari A va B uchun (AB)^2 = A^2·B^2"
    ],
    "e": "Matritsalar koʻpaytmasi assotsiativ va qoʻshish boʻyicha distributiv. U kommutativ EMAS: (A + B)^2 ni ochganda A^2 + AB + BA + B^2 chiqadi, bu AB = BA boʻlmaganda A^2 + 2AB + B^2 dan farq qiladi, hamda (AB)^2 = ABAB ≠ A^2B^2."
   }
  },
  {
   "t": "For arbitrary square matrices A and B, (A + B)^2 equals:",
   "o": [
    "A^2 + AB + BA + B^2",
    "A^2 + 2AB + B^2",
    "A^2 + B^2",
    "A^2 + AB + B^2"
   ],
   "e": "(A + B)(A + B) = A^2 + AB + BA + B^2. The middle terms cannot merge into 2AB unless AB = BA; e.g. for A = [1 1; 0 1], B = [1 0; 1 1] one gets AB + BA = [3 2; 2 3] while 2AB = [4 2; 2 2].",
   "ru": {
    "t": "Для произвольных квадратных матриц A и B выражение (A + B)^2 равно:",
    "o": [
     "A^2 + AB + BA + B^2",
     "A^2 + 2AB + B^2",
     "A^2 + B^2",
     "A^2 + AB + B^2"
    ],
    "e": "(A + B)(A + B) = A^2 + AB + BA + B^2. Средние слагаемые нельзя объединить в 2AB, если только AB = BA; например, при A = [1 1; 0 1], B = [1 0; 1 1] имеем AB + BA = [3 2; 2 3], тогда как 2AB = [4 2; 2 2]."
   },
   "uz": {
    "t": "Ixtiyoriy kvadrat A va B matritsalar uchun (A + B)^2 nimaga teng?",
    "o": [
     "A^2 + AB + BA + B^2",
     "A^2 + 2AB + B^2",
     "A^2 + B^2",
     "A^2 + AB + B^2"
    ],
    "e": "(A + B)(A + B) = A^2 + AB + BA + B^2. AB = BA boʻlmasa, oʻrta hadlarni 2AB ga birlashtirib boʻlmaydi; masalan, A = [1 1; 0 1], B = [1 0; 1 1] uchun AB + BA = [3 2; 2 3], 2AB esa [4 2; 2 2]."
   }
  },
  {
   "t": "If A and B are invertible n×n matrices, then (AB)^{-1} equals:",
   "o": [
    "B^{-1}A^{-1} — the order of the factors reverses",
    "A^{-1}B^{-1} — the order stays the same",
    "(A^{-1})^T(B^{-1})^T",
    "The product AB is not invertible in general"
   ],
   "e": "Check by multiplying: (AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = I. The order must reverse; A^{-1}B^{-1} equals (BA)^{-1} instead.",
   "ru": {
    "t": "Если A и B — обратимые n×n матрицы, то (AB)^{-1} равно:",
    "o": [
     "B^{-1}A^{-1} — порядок множителей меняется на противоположный",
     "A^{-1}B^{-1} — порядок сохраняется",
     "(A^{-1})^T(B^{-1})^T",
     "Произведение AB в общем случае необратимо"
    ],
    "e": "Проверка умножением: (AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = I. Порядок обязан быть обратным; A^{-1}B^{-1} — это (BA)^{-1}."
   },
   "uz": {
    "t": "Agar A va B teskari n×n matritsalar boʻlsa, (AB)^{-1} nimaga teng?",
    "o": [
     "B^{-1}A^{-1} — koʻpaytuvchilar tartibi teskari boʻladi",
     "A^{-1}B^{-1} — tartib saqlanadi",
     "(A^{-1})^T(B^{-1})^T",
     "AB koʻpaytmasi umuman teskari boʻlmaydi"
    ],
    "e": "Koʻpaytirib tekshiramiz: (AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = I. Tartib albatta teskari boʻlishi kerak; A^{-1}B^{-1} esa (BA)^{-1} ga teng."
   }
  },
  {
   "t": "Find the inverse of A = [2 1; 5 3].",
   "o": [
    "[3 −1; −5 2]",
    "[2 −1; −5 3]",
    "[3 −5; −1 2]",
    "[−3 1; 5 −2]"
   ],
   "e": "det A = 2·3 − 1·5 = 1, so A^{-1} = (1/det)·[d −b; −c a] = [3 −1; −5 2]. Check: [2 1; 5 3]·[3 −1; −5 2] = [1 0; 0 1].",
   "ru": {
    "t": "Найдите обратную матрицу для A = [2 1; 5 3].",
    "o": [
     "[3 −1; −5 2]",
     "[2 −1; −5 3]",
     "[3 −5; −1 2]",
     "[−3 1; 5 −2]"
    ],
    "e": "det A = 2·3 − 1·5 = 1, поэтому A^{-1} = (1/det)·[d −b; −c a] = [3 −1; −5 2]. Проверка: [2 1; 5 3]·[3 −1; −5 2] = [1 0; 0 1]."
   },
   "uz": {
    "t": "A = [2 1; 5 3] matritsaning teskarisini toping.",
    "o": [
     "[3 −1; −5 2]",
     "[2 −1; −5 3]",
     "[3 −5; −1 2]",
     "[−3 1; 5 −2]"
    ],
    "e": "det A = 2·3 − 1·5 = 1, shuning uchun A^{-1} = (1/det)·[d −b; −c a] = [3 −1; −5 2]. Tekshirish: [2 1; 5 3]·[3 −1; −5 2] = [1 0; 0 1]."
   }
  },
  {
   "t": "Find the inverse of A = [2 1; 2 3].",
   "o": [
    "(1/4)·[3 −1; −2 2], that is [3/4 −1/4; −1/2 1/2]",
    "[3 −1; −2 2]",
    "(1/4)·[3 −2; −1 2]",
    "(1/6)·[3 −1; −2 2]"
   ],
   "e": "det A = 2·3 − 1·2 = 4. The formula gives A^{-1} = (1/(ad − bc))·[d −b; −c a] = (1/4)·[3 −1; −2 2]. Forgetting the factor 1/det is the classic mistake (it would leave [3 −1; −2 2]).",
   "ru": {
    "t": "Найдите обратную матрицу для A = [2 1; 2 3].",
    "o": [
     "(1/4)·[3 −1; −2 2], то есть [3/4 −1/4; −1/2 1/2]",
     "[3 −1; −2 2]",
     "(1/4)·[3 −2; −1 2]",
     "(1/6)·[3 −1; −2 2]"
    ],
    "e": "det A = 2·3 − 1·2 = 4. По формуле A^{-1} = (1/(ad − bc))·[d −b; −c a] = (1/4)·[3 −1; −2 2]. Классическая ошибка — забыть множитель 1/det (останется [3 −1; −2 2])."
   },
   "uz": {
    "t": "A = [2 1; 2 3] matritsaning teskarisini toping.",
    "o": [
     "(1/4)·[3 −1; −2 2], yaʼni [3/4 −1/4; −1/2 1/2]",
     "[3 −1; −2 2]",
     "(1/4)·[3 −2; −1 2]",
     "(1/6)·[3 −1; −2 2]"
    ],
    "e": "det A = 2·3 − 1·2 = 4. Formula boʻyicha A^{-1} = (1/(ad − bc))·[d −b; −c a] = (1/4)·[3 −1; −2 2]. 1/det koʻpaytuvchisini unutish — tipik xato (faqat [3 −1; −2 2] qoladi)."
   }
  },
  {
   "t": "Apply Gauss–Jordan elimination to [A | I] = [1 2 1 0; 3 7 0 1] to find A^{-1} for A = [1 2; 3 7].",
   "o": [
    "[7 −2; −3 1]",
    "[7 −3; −2 1]",
    "[−7 2; 3 −1]",
    "[1 −2; −3 7]"
   ],
   "e": "R_2 ← R_2 − 3R_1 gives [1 2 1 0; 0 1 −3 1]; then R_1 ← R_1 − 2R_2 gives [1 0 7 −2; 0 1 −3 1]. The right half is A^{-1} = [7 −2; −3 1] (here det A = 1).",
   "ru": {
    "t": "Методом Гаусса–Жордана на [A | I] = [1 2 1 0; 3 7 0 1] найдите A^{-1} для A = [1 2; 3 7].",
    "o": [
     "[7 −2; −3 1]",
     "[7 −3; −2 1]",
     "[−7 2; 3 −1]",
     "[1 −2; −3 7]"
    ],
    "e": "R_2 ← R_2 − 3R_1 даёт [1 2 1 0; 0 1 −3 1]; затем R_1 ← R_1 − 2R_2 даёт [1 0 7 −2; 0 1 −3 1]. Правая половина — A^{-1} = [7 −2; −3 1] (здесь det A = 1)."
   },
   "uz": {
    "t": "[A | I] = [1 2 1 0; 3 7 0 1] ustida Gauss–Jordan usulini qoʻllab, A = [1 2; 3 7] uchun A^{-1} ni toping.",
    "o": [
     "[7 −2; −3 1]",
     "[7 −3; −2 1]",
     "[−7 2; 3 −1]",
     "[1 −2; −3 7]"
    ],
    "e": "R_2 ← R_2 − 3R_1 [1 2 1 0; 0 1 −3 1] beradi; soʻng R_1 ← R_1 − 2R_2 [1 0 7 −2; 0 1 −3 1] beradi. Oʻng yarmi — A^{-1} = [7 −2; −3 1] (bu yerda det A = 1)."
   }
  },
  {
   "t": "Applying Gauss–Jordan elimination to [A | I] with A = [1 1 0; 1 2 1; 0 1 2] yields the inverse:",
   "o": [
    "[3 −2 1; −2 2 −1; 1 −1 1]",
    "[3 −2 1; −2 2 −1; 1 1 1]",
    "[3 −2 1; −2 2 1; 1 −1 1]",
    "The inverse does not exist — elimination produces a zero row"
   ],
   "e": "Forward elimination gives U = [1 1 0; 0 1 1; 0 0 1] with multipliers 1, 1, 1; continuing upward reduces the left block to I and leaves A^{-1} = [3 −2 1; −2 2 −1; 1 −1 1]. Indeed det A = 1 ≠ 0, so the inverse exists; check A·A^{-1} = I.",
   "ru": {
    "t": "Применив метод Гаусса–Жордана к [A | I] с A = [1 1 0; 1 2 1; 0 1 2], получаем обратную матрицу:",
    "o": [
     "[3 −2 1; −2 2 −1; 1 −1 1]",
     "[3 −2 1; −2 2 −1; 1 1 1]",
     "[3 −2 1; −2 2 1; 1 −1 1]",
     "Обратной не существует — исключение даёт нулевую строку"
    ],
    "e": "Прямой ход даёт U = [1 1 0; 0 1 1; 0 0 1] с множителями 1, 1, 1; продолжая вверх, приводим левый блок к I и получаем A^{-1} = [3 −2 1; −2 2 −1; 1 −1 1]. В самом деле, det A = 1 ≠ 0 — обратная существует; проверка: A·A^{-1} = I."
   },
   "uz": {
    "t": "A = [1 1 0; 1 2 1; 0 1 2] boʻlgan [A | I] ga Gauss–Jordan usulini qoʻllab, teskari matritsa topiladi:",
    "o": [
     "[3 −2 1; −2 2 −1; 1 −1 1]",
     "[3 −2 1; −2 2 −1; 1 1 1]",
     "[3 −2 1; −2 2 1; 1 −1 1]",
     "Teskarisi mavjud emas — eliminatsiya nol satr beradi"
    ],
    "e": "Toʻgʻri yurish U = [1 1 0; 0 1 1; 0 0 1] beradi (koʻpaytuvchilar 1, 1, 1); yuqoriga davom ettirib, chap blokni I ga keltiramiz va A^{-1} = [3 −2 1; −2 2 −1; 1 −1 1] hosil boʻladi. Haqiqatdan det A = 1 ≠ 0 — teskarisi mavjud; tekshirish: A·A^{-1} = I."
   }
  },
  {
   "t": "Computing the inverse A^{-1} is equivalent to solving which systems?",
   "o": [
    "n systems Ax_j = e_j, one for each column of the identity: A^{-1} = [x_1 ... x_n]",
    "One system Ax = b with a single fixed right side b",
    "The single system Ax = 0",
    "n systems Ax_j = b_j with arbitrary right sides b_j"
   ],
   "e": "If A^{-1} = [x_1 ... x_n], then A·A^{-1} = I means Ax_j = e_j for every j: the j-th column of the inverse solves the system with right side e_j. Gauss–Jordan on [A | I] → [I | A^{-1}] solves all n systems at once.",
   "ru": {
    "t": "Вычисление обратной матрицы A^{-1} равносильно решению каких систем?",
    "o": [
     "n систем Ax_j = e_j, по одной на каждый столбец единичной матрицы: A^{-1} = [x_1 ... x_n]",
     "Одной системы Ax = b с единственной фиксированной правой частью b",
     "Единственной системы Ax = 0",
     "n систем Ax_j = b_j с произвольными правыми частями b_j"
    ],
    "e": "Если A^{-1} = [x_1 ... x_n], то A·A^{-1} = I означает Ax_j = e_j для каждого j: j-й столбец обратной решает систему с правой частью e_j. Гаусс–Жордан [A | I] → [I | A^{-1}] решает все n систем одновременно."
   },
   "uz": {
    "t": "A^{-1} teskari matritsasini hisoblash qaysi sistemalarni yechishga teng?",
    "o": [
     "Birlik matritsaning har bir ustuni uchun bittadan n ta Ax_j = e_j sistemasi: A^{-1} = [x_1 ... x_n]",
     "Yagona qatʼiy oʻng tomonlama b li bitta Ax = b sistemasi",
     "Yagona Ax = 0 sistemasi",
     "Ixtiyoriy oʻng tomonlamali b_j boʻlgan n ta Ax_j = b_j sistemasi"
    ],
    "e": "Agar A^{-1} = [x_1 ... x_n] boʻlsa, A·A^{-1} = I har bir j uchun Ax_j = e_j degani: teskarining j-ustuni e_j oʻng tomonlamali sistemani yechadi. Gauss–Jordan [A | I] → [I | A^{-1}] barcha n sistemani birdan yechadi."
   }
  },
  {
   "t": "Find the LU decomposition of A = [2 1; 6 5] (no row exchanges).",
   "o": [
    "L = [1 0; 3 1], U = [2 1; 0 2]",
    "L = [1 0; 2 1], U = [2 1; 0 3]",
    "L = [1 0; 6 1], U = [2 1; 0 5]",
    "L = [1 0; 1/3 1], U = [2 1; 0 2]"
   ],
   "e": "The multiplier is λ_21 = 6/2 = 3, and R_2 ← R_2 − 3R_1 turns the row [6 5] into [0 2]. The multiplier goes below the diagonal of L and U keeps the elimination result: [2 1; 6 5] = [1 0; 3 1]·[2 1; 0 2].",
   "ru": {
    "t": "Найдите LU-разложение матрицы A = [2 1; 6 5] (без обменов строк).",
    "o": [
     "L = [1 0; 3 1], U = [2 1; 0 2]",
     "L = [1 0; 2 1], U = [2 1; 0 3]",
     "L = [1 0; 6 1], U = [2 1; 0 5]",
     "L = [1 0; 1/3 1], U = [2 1; 0 2]"
    ],
    "e": "Множитель λ_21 = 6/2 = 3, и R_2 ← R_2 − 3R_1 превращает строку [6 5] в [0 2]. Множитель записывается под диагональю L, а U хранит результат исключения: [2 1; 6 5] = [1 0; 3 1]·[2 1; 0 2]."
   },
   "uz": {
    "t": "A = [2 1; 6 5] matritsaning LU-ajralmasini toping (satr almashuvisiz).",
    "o": [
     "L = [1 0; 3 1], U = [2 1; 0 2]",
     "L = [1 0; 2 1], U = [2 1; 0 3]",
     "L = [1 0; 6 1], U = [2 1; 0 5]",
     "L = [1 0; 1/3 1], U = [2 1; 0 2]"
    ],
    "e": "Koʻpaytuvchi λ_21 = 6/2 = 3, R_2 ← R_2 − 3R_1 esa [6 5] satrini [0 2] ga aylantiradi. Koʻpaytuvchi L diagonalining ostiga yoziladi, U eliminatsiya natijasini saqlaydi: [2 1; 6 5] = [1 0; 3 1]·[2 1; 0 2]."
   }
  },
  {
   "t": "Elimination on A = [2 1 1; 4 5 4; −2 2 3] ends with U = [2 1 1; 0 3 2; 0 0 2]. What is L?",
   "o": [
    "[1 0 0; 2 1 0; −1 1 1]",
    "[1 0 0; 2 1 0; −1 −1 1]",
    "[1 0 0; 4 1 0; −2 1 1]",
    "[1 0 0; 2 1 0; −1 3 1]"
   ],
   "e": "The multipliers are λ_21 = 4/2 = 2 and λ_31 = −2/2 = −1, then λ_32 = 3/3 = 1 (from the updated row 3). They enter L with their original signs: L = [1 0 0; 2 1 0; −1 1 1], and indeed L·U = A.",
   "ru": {
    "t": "Исключение на A = [2 1 1; 4 5 4; −2 2 3] завершается матрицей U = [2 1 1; 0 3 2; 0 0 2]. Чему равно L?",
    "o": [
     "[1 0 0; 2 1 0; −1 1 1]",
     "[1 0 0; 2 1 0; −1 −1 1]",
     "[1 0 0; 4 1 0; −2 1 1]",
     "[1 0 0; 2 1 0; −1 3 1]"
    ],
    "e": "Множители: λ_21 = 4/2 = 2 и λ_31 = −2/2 = −1, затем λ_32 = 3/3 = 1 (по обновлённой строке 3). Они попадают в L с исходными знаками: L = [1 0 0; 2 1 0; −1 1 1], и действительно L·U = A."
   },
   "uz": {
    "t": "A = [2 1 1; 4 5 4; −2 2 3] ustidagi eliminatsiya U = [2 1 1; 0 3 2; 0 0 2] bilan tugaydi. L nimaga teng?",
    "o": [
     "[1 0 0; 2 1 0; −1 1 1]",
     "[1 0 0; 2 1 0; −1 −1 1]",
     "[1 0 0; 4 1 0; −2 1 1]",
     "[1 0 0; 2 1 0; −1 3 1]"
    ],
    "e": "Koʻpaytuvchilar: λ_21 = 4/2 = 2 va λ_31 = −2/2 = −1, soʻngra (yangilangan 3-satrdan) λ_32 = 3/3 = 1. Ular asl belgilari bilan L ga tushadi: L = [1 0 0; 2 1 0; −1 1 1], haqiqatan L·U = A."
   }
  },
  {
   "t": "Let A = LU with L = [1 0; 3 1] and U = [2 1; 0 2]. Solving Ax = b for b = [5; 19] in two steps gives:",
   "o": [
    "y = [5; 4] from Ly = b, then x = [3/2; 2] from Ux = y",
    "y = [5; 4], then x = [2; 3/2]",
    "y = [5; 19], then x = [3/2; 2]",
    "y = [4; 5], then x = [2; 2]"
   ],
   "e": "Forward substitution Ly = b: y_1 = 5 and 3·5 + y_2 = 19, so y_2 = 4. Back substitution Ux = y: 2x_2 = 4 gives x_2 = 2, and 2x_1 + 2 = 5 gives x_1 = 3/2. Check with A = LU = [2 1; 6 5]: A·[3/2; 2] = [5; 19].",
   "ru": {
    "t": "Пусть A = LU, где L = [1 0; 3 1], U = [2 1; 0 2]. Решение Ax = b при b = [5; 19] в два шага даёт:",
    "o": [
     "y = [5; 4] из Ly = b, затем x = [3/2; 2] из Ux = y",
     "y = [5; 4], затем x = [2; 3/2]",
     "y = [5; 19], затем x = [3/2; 2]",
     "y = [4; 5], затем x = [2; 2]"
    ],
    "e": "Прямая подстановка Ly = b: y_1 = 5 и 3·5 + y_2 = 19, откуда y_2 = 4. Обратная подстановка Ux = y: 2x_2 = 4 даёт x_2 = 2, а 2x_1 + 2 = 5 даёт x_1 = 3/2. Проверка с A = LU = [2 1; 6 5]: A·[3/2; 2] = [5; 19]."
   },
   "uz": {
    "t": "A = LU, L = [1 0; 3 1], U = [2 1; 0 2] boʻlsin. b = [5; 19] uchun Ax = b ni ikki qadamda yechish nimani beradi?",
    "o": [
     "Ly = b dan y = [5; 4], soʻngra Ux = y dan x = [3/2; 2]",
     "y = [5; 4], soʻngra x = [2; 3/2]",
     "y = [5; 19], soʻngra x = [3/2; 2]",
     "y = [4; 5], soʻngra x = [2; 2]"
    ],
    "e": "Toʻgʻri almashtirish Ly = b: y_1 = 5 va 3·5 + y_2 = 19, demak y_2 = 4. Teskari almashtirish Ux = y: 2x_2 = 4 → x_2 = 2, 2x_1 + 2 = 5 → x_1 = 3/2. A = LU = [2 1; 6 5] bilan tekshirish: A·[3/2; 2] = [5; 19]."
   }
  },
  {
   "t": "In the LDU decomposition [2 1; 6 5] = [1 0; 3 1]·D·[1 1/2; 0 1], the middle factor D is:",
   "o": [
    "[2 0; 0 2] — the pivots of U on its diagonal",
    "[1 0; 0 1] — the identity matrix",
    "[2 1; 0 2] — a copy of U",
    "[3 0; 0 1] — the first multiplier and a unit pivot"
   ],
   "e": "LDU splits U = D·(D^{-1}U): D holds the pivots 2 and 2, while D^{-1}U = [1 1/2; 0 1] has units on its diagonal. Check: [1 0; 3 1]·[2 0; 0 2]·[1 1/2; 0 1] = [2 1; 6 5].",
   "ru": {
    "t": "В LDU-разложении [2 1; 6 5] = [1 0; 3 1]·D·[1 1/2; 0 1] средний множитель D равен:",
    "o": [
     "[2 0; 0 2] — опорные элементы U на диагонали",
     "[1 0; 0 1] — единичная матрица",
     "[2 1; 0 2] — копия U",
     "[3 0; 0 1] — первый множитель и единичный опорный элемент"
    ],
    "e": "LDU расщепляет U = D·(D^{-1}U): D содержит опорные элементы 2 и 2, а у D^{-1}U = [1 1/2; 0 1] на диагонали единицы. Проверка: [1 0; 3 1]·[2 0; 0 2]·[1 1/2; 0 1] = [2 1; 6 5]."
   },
   "uz": {
    "t": "[2 1; 6 5] = [1 0; 3 1]·D·[1 1/2; 0 1] LDU-ajralmasida oʻrta koʻpaytuvchi D:",
    "o": [
     "[2 0; 0 2] — U ning tayanch elementlari diagonalida",
     "[1 0; 0 1] — birlik matritsa",
     "[2 1; 0 2] — U nusxasi",
     "[3 0; 0 1] — birinchi koʻpaytuvchi va birlik tayanch"
    ],
    "e": "LDU ni U = D·(D^{-1}U) shaklida boʻladi: D da 2 va 2 tayanch elementlari, D^{-1}U = [1 1/2; 0 1] diagonalida esa birliklar turadi. Tekshirish: [1 0; 3 1]·[2 0; 0 2]·[1 1/2; 0 1] = [2 1; 6 5]."
   }
  },
  {
   "t": "Why does partial pivoting exchange rows for A = [10^{-8} 1; 1 1]?",
   "o": [
    "The first pivot 10^{-8} would give the huge multiplier 10^8; after the exchange the multiplier is only 10^{-8}",
    "A is singular, so a row exchange is required to make it invertible",
    "The exchange makes U symmetric, which is required for LU",
    "Partial pivoting always reorders the rows in decreasing order"
   ],
   "e": "Without the exchange the multiplier is 1/10^{-8} = 10^8: subtracting a huge multiple of row 1 would amplify round-off error. The exchange puts the largest available entry of the column (the number 1) into the pivot position, giving the multiplier 10^{-8}/1 = 10^{-8}. The matrix is invertible either way (det = 1 − 10^{-8} ≠ 0).",
   "ru": {
    "t": "Почему частичный выбор опорного элемента меняет строки для A = [10^{-8} 1; 1 1]?",
    "o": [
     "Первый опорный элемент 10^{-8} дал бы огромный множитель 10^8; после обмена множитель равен лишь 10^{-8}",
     "Матрица A вырождена, поэтому для обратимости необходим обмен строк",
     "Обмен делает U симметричной, что требуется для LU",
     "Частичный выбор всегда упорядочивает строки по убыванию"
    ],
    "e": "Без обмена множитель равен 1/10^{-8} = 10^8: вычитание огромного кратного строки 1 усиливало бы погрешности округления. Обмен ставит наибольший по модулю элемент столбца (число 1) в опорную позицию, и множитель становится 10^{-8}/1 = 10^{-8}. Матрица обратима в обоих случаях (det = 1 − 10^{-8} ≠ 0)."
   },
   "uz": {
    "t": "A = [10^{-8} 1; 1 1] uchun qismiy tayanch tanlash (partial pivoting) nega satrlarni almashtiradi?",
    "o": [
     "Birinchi tayanch 10^{-8} ulkan 10^8 koʻpaytuvchisini berardi; almashgandan keyin koʻpaytuvchi faqat 10^{-8}",
     "A matritsa singulyar, shuning uchun teskari boʻlishi uchun satr almashuvi shart",
     "Almashuv U ni simmetrik qiladi, LU buni talab qiladi",
     "Qismiy tanlash har doim satrlarni kamayish tartibida joylashtiradi"
    ],
    "e": "Almashuvsiz koʻpaytuvchi 1/10^{-8} = 10^8: 1-satrlning ulkan koʻpaytmasini ayirish yaxlitlash xatosini kuchaytirardi. Almashuv ustunning eng katta modulli elementini (1 sonini) tayanch oʻrniga qoʻyadi va koʻpaytuvchi 10^{-8}/1 = 10^{-8} boʻladi. Matritsa baribir teskari (det = 1 − 10^{-8} ≠ 0)."
   }
  },
  {
   "t": "A = [0 2; 3 4] has a zero first pivot. Which factorization PA = LU is correct?",
   "o": [
    "P = [0 1; 1 0], L = I, U = [3 4; 0 2]",
    "No factorization exists — the zero pivot means A is singular",
    "P = I, L = I, U = [3 4; 0 2]",
    "P = [0 1; 1 0], L = [1 0; 3 1], U = [3 4; 0 2]"
   ],
   "e": "A zero in the pivot position only signals a bad row order, not singularity: det A = 0·4 − 2·3 = −6 ≠ 0. Exchanging the rows (P = [0 1; 1 0]) gives PA = [3 4; 0 2], which is already triangular, so L = I and PA = LU.",
   "ru": {
    "t": "У матрицы A = [0 2; 3 4] первый опорный элемент нулевой. Какое разложение PA = LU верно?",
    "o": [
     "P = [0 1; 1 0], L = I, U = [3 4; 0 2]",
     "Разложения не существует — нулевой опорный элемент означает вырожденность A",
     "P = I, L = I, U = [3 4; 0 2]",
     "P = [0 1; 1 0], L = [1 0; 3 1], U = [3 4; 0 2]"
    ],
    "e": "Ноль в опорной позиции лишь сигнализирует о неудачном порядке строк, а не о вырожденности: det A = 0·4 − 2·3 = −6 ≠ 0. Обмен строк (P = [0 1; 1 0]) даёт PA = [3 4; 0 2] — уже треугольную матрицу, поэтому L = I и PA = LU."
   },
   "uz": {
    "t": "A = [0 2; 3 4] matritsaning birinchi tayanch elementi nol. Qaysi PA = LU ajralmasi toʻgʻri?",
    "o": [
     "P = [0 1; 1 0], L = I, U = [3 4; 0 2]",
     "Ajralmas mavjud emas — nol tayanch A ning singulyarligini bildiradi",
     "P = I, L = I, U = [3 4; 0 2]",
     "P = [0 1; 1 0], L = [1 0; 3 1], U = [3 4; 0 2]"
    ],
    "e": "Tayanch oʻrnidagi nol faqat satrlar tartibining yomonligini bildiradi, singulyarlikni emas: det A = 0·4 − 2·3 = −6 ≠ 0. Satrlarni almashtirish (P = [0 1; 1 0]) PA = [3 4; 0 2] beradi — u allaqachon uchburchak, shuning uchun L = I va PA = LU."
   }
  },
  {
   "t": "For A = [1 2; 0 1] and B = [2 0; 3 1], compute (AB)^T and check the transpose identity.",
   "o": [
    "(AB)^T = [8 3; 2 1] = B^T·A^T",
    "(AB)^T = [8 2; 3 1] = A^T·B^T",
    "(AB)^T = [2 3; 4 7] = A^T·B^T",
    "(AB)^T = [8 3; 2 1] = A^T·B^T"
   ],
   "e": "AB = [1·2 + 2·3, 2; 3, 1] = [8 2; 3 1], so (AB)^T = [8 3; 2 1]. The identity gives the same: B^T·A^T = [2 3; 0 1]·[1 0; 2 1] = [8 3; 2 1]. Keeping the original order gives A^T·B^T = [2 3; 4 7] — the wrong matrix.",
   "ru": {
    "t": "Для A = [1 2; 0 1] и B = [2 0; 3 1] вычислите (AB)^T и проверьте тождество транспонирования.",
    "o": [
     "(AB)^T = [8 3; 2 1] = B^T·A^T",
     "(AB)^T = [8 2; 3 1] = A^T·B^T",
     "(AB)^T = [2 3; 4 7] = A^T·B^T",
     "(AB)^T = [8 3; 2 1] = A^T·B^T"
    ],
    "e": "AB = [1·2 + 2·3, 2; 3, 1] = [8 2; 3 1], поэтому (AB)^T = [8 3; 2 1]. Тождество даёт то же: B^T·A^T = [2 3; 0 1]·[1 0; 2 1] = [8 3; 2 1]. Сохранение исходного порядка даёт A^T·B^T = [2 3; 4 7] — неверную матрицу."
   },
   "uz": {
    "t": "A = [1 2; 0 1] va B = [2 0; 3 1] uchun (AB)^T ni hisoblang va transponirlash ayniyatini tekshiring.",
    "o": [
     "(AB)^T = [8 3; 2 1] = B^T·A^T",
     "(AB)^T = [8 2; 3 1] = A^T·B^T",
     "(AB)^T = [2 3; 4 7] = A^T·B^T",
     "(AB)^T = [8 3; 2 1] = A^T·B^T"
    ],
    "e": "AB = [1·2 + 2·3, 2; 3, 1] = [8 2; 3 1], demak (AB)^T = [8 3; 2 1]. Ayniyat ham xuddi shuni beradi: B^T·A^T = [2 3; 0 1]·[1 0; 2 1] = [8 3; 2 1]. Asl tartibni saqlash A^T·B^T = [2 3; 4 7] beradi — notoʻgʻri matritsa."
   }
  },
  {
   "t": "The difference matrix A = [1 0 0; −1 1 0; 0 −1 1] maps x = (1, 2, 4) to (1, 1, 2). Where does its inverse A^{-1} = [1 0 0; 1 1 0; 1 1 1] map x?",
   "o": [
    "To (1, 3, 7) — the cumulative sums of the entries",
    "To (1, 1, 2) — the differences again",
    "To (1, 2, 4) — x itself",
    "To (7, 3, 1) — the sums in reverse order"
   ],
   "e": "A computes differences (a discrete derivative); its inverse undoes them by cumulative sums (a discrete integral): A^{-1}x = (x_1, x_1 + x_2, x_1 + x_2 + x_3) = (1, 3, 7). Check: A·(1, 3, 7) = (1, 2, 4).",
   "ru": {
    "t": "Разностная матрица A = [1 0 0; −1 1 0; 0 −1 1] переводит x = (1, 2, 4) в (1, 1, 2). Куда переводит x обратная матрица A^{-1} = [1 0 0; 1 1 0; 1 1 1]?",
    "o": [
     "В (1, 3, 7) — накопленные суммы компонент",
     "В (1, 1, 2) — снова разности",
     "В (1, 2, 4) — сам вектор x",
     "В (7, 3, 1) — суммы в обратном порядке"
    ],
    "e": "A вычисляет разности (дискретная производная); обратная отменяет их накопленными суммами (дискретный интеграл): A^{-1}x = (x_1, x_1 + x_2, x_1 + x_2 + x_3) = (1, 3, 7). Проверка: A·(1, 3, 7) = (1, 2, 4)."
   },
   "uz": {
    "t": "Ayirmalar matritsasi A = [1 0 0; −1 1 0; 0 −1 1] x = (1, 2, 4) vektorni (1, 1, 2) ga oʻtkazadi. Teskari matritsa A^{-1} = [1 0 0; 1 1 0; 1 1 1] x ni qayerga oʻtkazadi?",
    "o": [
     "(1, 3, 7) ga — komponentalarning kumulativ yigʻindilari",
     "(1, 1, 2) ga — yana ayirmalar",
     "(1, 2, 4) ga — x oʻzi",
     "(7, 3, 1) ga — teskari tartibdagi yigʻindilar"
    ],
    "e": "A ayirmalarni hisoblaydi (diskret hosila); teskarisi ularni kumulativ yigʻindilar bilan bekor qiladi (diskret integral): A^{-1}x = (x_1, x_1 + x_2, x_1 + x_2 + x_3) = (1, 3, 7). Tekshirish: A·(1, 3, 7) = (1, 2, 4)."
   }
  },
  {
   "t": "Three of the following transpose identities are true for all matrices of compatible sizes. Which one is FALSE?",
   "o": [
    "(AB)^T = A^T·B^T",
    "(A + B)^T = A^T + B^T",
    "(AB)^T = B^T·A^T",
    "(A^{-1})^T = (A^T)^{-1} for invertible A"
   ],
   "e": "The product rule reverses the order: (AB)^T = B^T A^T, not A^T B^T (which may not even be defined). The sum rule, the reversed product rule and the inverse-transpose rule are all true.",
   "ru": {
    "t": "Три из следующих тождеств транспонирования верны для всех матриц согласованных размеров. Какое из них ЛОЖНО?",
    "o": [
     "(AB)^T = A^T·B^T",
     "(A + B)^T = A^T + B^T",
     "(AB)^T = B^T·A^T",
     "(A^{-1})^T = (A^T)^{-1} для обратимой A"
    ],
    "e": "Правило произведения меняет порядок множителей: (AB)^T = B^T A^T, а не A^T B^T (последнее может быть даже не определено). Правила суммы, обратного порядка и «обратной-транспонированной» верны."
   },
   "uz": {
    "t": "Quyidagi transponirlash ayniyatlaridan uchtasi mos oʻlchamdagi barcha matritsalar uchun toʻgʻri. Qaysi biri YALGʻON?",
    "o": [
     "(AB)^T = A^T·B^T",
     "(A + B)^T = A^T + B^T",
     "(AB)^T = B^T·A^T",
     "Teskarisi mavjud A uchun (A^{-1})^T = (A^T)^{-1}"
    ],
    "e": "Koʻpaytma qoidasi tartibni teskariga oʻzgartiradi: (AB)^T = B^T A^T, A^T B^T emas (bu hatto aniqlanmasligi mumkin). Yigʻindi, teskari tartib va «teskari-transponir» qoidalari esa toʻgʻri."
   }
  },
  {
   "t": "Split A = [1 4; 2 3] into symmetric plus skew-symmetric parts. What is the symmetric part S?",
   "o": [
    "S = [1 3; 3 3]",
    "S = [1 2; 4 3]",
    "S = [1 4; 2 3]",
    "S = [2 6; 6 6]"
   ],
   "e": "S = (A + A^T)/2 averages the off-diagonal entries: A^T = [1 2; 4 3], so S = [1 3; 3 3] and K = (A − A^T)/2 = [0 1; −1 0], with S + K = A. Forgetting the division by 2 would leave [2 6; 6 6].",
   "ru": {
    "t": "Разложите A = [1 4; 2 3] на симметричную и кососимметрическую части. Чему равна симметричная часть S?",
    "o": [
     "S = [1 3; 3 3]",
     "S = [1 2; 4 3]",
     "S = [1 4; 2 3]",
     "S = [2 6; 6 6]"
    ],
    "e": "S = (A + A^T)/2 усредняет внедиагональные элементы: A^T = [1 2; 4 3], поэтому S = [1 3; 3 3], а K = (A − A^T)/2 = [0 1; −1 0], и S + K = A. Забывание деления на 2 оставило бы [2 6; 6 6]."
   },
   "uz": {
    "t": "A = [1 4; 2 3] ni simmetrik va kososimmetrik qismlarga ajratings. Simmetrik qism S nimaga teng?",
    "o": [
     "S = [1 3; 3 3]",
     "S = [1 2; 4 3]",
     "S = [1 4; 2 3]",
     "S = [2 6; 6 6]"
    ],
    "e": "S = (A + A^T)/2 diagonaldan tashqari elementlarni oʻrtachalaydi: A^T = [1 2; 4 3], shuning uchun S = [1 3; 3 3], K = (A − A^T)/2 = [0 1; −1 0] va S + K = A. 2 ga boʻlishni unutish [2 6; 6 6] qoldirardi."
   }
  },
  {
   "t": "Compute A^T·A for A = [1 2; 0 1].",
   "o": [
    "[1 2; 2 5]",
    "[5 2; 2 1]",
    "[1 0; 2 1]",
    "[1 2; 2 4]"
   ],
   "e": "A^T = [1 0; 2 1], so A^T·A = [1 0; 2 1]·[1 2; 0 1] = [1 2; 2 5]. The result is symmetric, as it must be: (A^T A)^T = A^T A. (The matrix [5 2; 2 1] is A·A^T.)",
   "ru": {
    "t": "Вычислите A^T·A для A = [1 2; 0 1].",
    "o": [
     "[1 2; 2 5]",
     "[5 2; 2 1]",
     "[1 0; 2 1]",
     "[1 2; 2 4]"
    ],
    "e": "A^T = [1 0; 2 1], поэтому A^T·A = [1 0; 2 1]·[1 2; 0 1] = [1 2; 2 5]. Результат симметричен, как и должно быть: (A^T A)^T = A^T A. (Матрица [5 2; 2 1] — это A·A^T.)"
   },
   "uz": {
    "t": "A = [1 2; 0 1] uchun A^T·A ni hisoblang.",
    "o": [
     "[1 2; 2 5]",
     "[5 2; 2 1]",
     "[1 0; 2 1]",
     "[1 2; 2 4]"
    ],
    "e": "A^T = [1 0; 2 1], demak A^T·A = [1 0; 2 1]·[1 2; 0 1] = [1 2; 2 5]. Natija simmetrik — boʻlishi kerakidek: (A^T A)^T = A^T A. ([5 2; 2 1] matritsa — bu A·A^T.)"
   }
  },
  {
   "t": "The product R^T R appears in least squares. Which statement is TRUE for every real matrix R?",
   "o": [
    "(R^T R)^T = R^T (R^T)^T = R^T R, so R^T R is always symmetric",
    "R^T R is symmetric only when R is a square matrix",
    "R^T R is symmetric only when R itself is symmetric",
    "R^T R = R·R^T for every R"
   ],
   "e": "By the reverse-order rule, (R^T R)^T = R^T (R^T)^T = R^T R — no assumption on R is needed. Moreover x^T R^T R x = ||Rx||^2 ≥ 0 for every x. The products R^T R and R·R^T are generally different (and have different sizes for a rectangular R).",
   "ru": {
    "t": "Произведение R^T R встречается в методе наименьших квадратов. Какое утверждение ВЕРНО для любой вещественной матрицы R?",
    "o": [
     "(R^T R)^T = R^T (R^T)^T = R^T R, поэтому R^T R всегда симметрична",
     "R^T R симметрична, только когда R квадратная",
     "R^T R симметрична, только когда сама R симметрична",
     "R^T R = R·R^T для любой R"
    ],
    "e": "По правилу обратного порядка (R^T R)^T = R^T (R^T)^T = R^T R — никаких предположений о R не требуется. Более того, x^T R^T R x = ||Rx||^2 ≥ 0 для любого x. Произведения R^T R и R·R^T в общем случае различны (и при прямоугольной R имеют разные размеры)."
   },
   "uz": {
    "t": "R^T R koʻpaytmasi eng kichik kvadratlar usulida uchraydi. Har qanday haqiqiy R matritsa uchun qaysi gap TOʻGʻRI?",
    "o": [
     "(R^T R)^T = R^T (R^T)^T = R^T R, shuning uchun R^T R doim simmetrik",
     "R^T R faqat R kvadrat boʻlganda simmetrik",
     "R^T R faqat R oʻzi simmetrik boʻlganda simmetrik",
     "Har qanday R uchun R^T R = R·R^T"
    ],
    "e": "Teskari tartib qoidasi boʻyicha (R^T R)^T = R^T (R^T)^T = R^T R — R haqida hech qanday shart kerak emas. Bundan tashqari, har qanday x uchun x^T R^T R x = ||Rx||^2 ≥ 0. R^T R va R·R^T koʻpaytmalari odatda farq qiladi (toʻrtburchak R uchun oʻlchamlari ham boshqacha)."
   }
  },
  {
   "t": "For A = [1 2; 3 4] and the permutation P = [0 1; 1 0], what are PA and AP?",
   "o": [
    "PA = [3 4; 1 2] (rows exchanged), AP = [2 1; 4 3] (columns exchanged)",
    "PA = [2 1; 4 3], AP = [3 4; 1 2]",
    "PA = AP = [3 4; 1 2]",
    "PA = [4 3; 2 1], AP = [4 3; 2 1]"
   ],
   "e": "Multiplication on the left acts on rows: PA exchanges rows 1 and 2 of A. Multiplication on the right acts on columns: AP exchanges columns 1 and 2. In general PA ≠ AP.",
   "ru": {
    "t": "Для A = [1 2; 3 4] и перестановочной P = [0 1; 1 0] чему равны PA и AP?",
    "o": [
     "PA = [3 4; 1 2] (строки обменяны), AP = [2 1; 4 3] (столбцы обменяны)",
     "PA = [2 1; 4 3], AP = [3 4; 1 2]",
     "PA = AP = [3 4; 1 2]",
     "PA = [4 3; 2 1], AP = [4 3; 2 1]"
    ],
    "e": "Умножение слева действует на строки: PA обменивает строки 1 и 2 матрицы A. Умножение справа действует на столбцы: AP обменивает столбцы 1 и 2. Вообще говоря, PA ≠ AP."
   },
   "uz": {
    "t": "A = [1 2; 3 4] va permutatsiya P = [0 1; 1 0] uchun PA va AP nimaga teng?",
    "o": [
     "PA = [3 4; 1 2] (satrlar almashgan), AP = [2 1; 4 3] (ustunlar almashgan)",
     "PA = [2 1; 4 3], AP = [3 4; 1 2]",
     "PA = AP = [3 4; 1 2]",
     "PA = [4 3; 2 1], AP = [4 3; 2 1]"
    ],
    "e": "Chapdan koʻpaytirish satrlarga taʼsir qiladi: PA A ning 1- va 2-satrlarini almashtiradi. Oʻngdan koʻpaytirish ustunlarga taʼsir qiladi: AP 1- va 2-ustunlarni almashtiradi. Umuman PA ≠ AP."
   }
  },
  {
   "t": "Find P^{-1} for the permutation matrix P = [0 1 0; 0 0 1; 1 0 0].",
   "o": [
    "P^T = [0 0 1; 1 0 0; 0 1 0], since P^T·P = I",
    "P itself, since every permutation matrix is its own inverse",
    "[0 0 1; 0 1 0; 1 0 0] — the matrix exchanging rows 1 and 3",
    "P^{-1} does not exist because det P = 0"
   ],
   "e": "The columns of P are the distinct unit vectors, so their dot products form I: P^T P = I and P^{-1} = P^T = [0 0 1; 1 0 0; 0 1 0]. A single exchange matrix is its own inverse, but this cyclic P is not.",
   "ru": {
    "t": "Найдите P^{-1} для перестановочной матрицы P = [0 1 0; 0 0 1; 1 0 0].",
    "o": [
     "P^T = [0 0 1; 1 0 0; 0 1 0], так как P^T·P = I",
     "Сама P, так как каждая перестановочная матрица обратна сама себе",
     "[0 0 1; 0 1 0; 1 0 0] — матрица, обменивающая строки 1 и 3",
     "P^{-1} не существует, так как det P = 0"
    ],
    "e": "Столбцы P — различные единичные векторы, поэтому их скалярные произведения образуют I: P^T P = I и P^{-1} = P^T = [0 0 1; 1 0 0; 0 1 0]. Матрица одиночного обмена обратна сама себе, но эта циклическая P — нет."
   },
   "uz": {
    "t": "P = [0 1 0; 0 0 1; 1 0 0] permutatsiya matritsasi uchun P^{-1} ni toping.",
    "o": [
     "P^T = [0 0 1; 1 0 0; 0 1 0], chunki P^T·P = I",
     "P oʻzi, chunki har qanday permutatsiya matritsa oʻzining teskarisi",
     "[0 0 1; 0 1 0; 1 0 0] — 1- va 3-satrlarni almashtiruvchi matritsa",
     "P^{-1} mavjud emas, chunki det P = 0"
    ],
    "e": "P ning ustunlari — har xil birlik vektorlar, shuning uchun ularning skalyar koʻpaytmalari I ni hosil qiladi: P^T P = I va P^{-1} = P^T = [0 0 1; 1 0 0; 0 1 0]. Bitta almashuv matritsasi oʻzining teskarisi, lekin bu siklik P unday emas."
   }
  },
  {
   "t": "Which statement about permutation matrices is TRUE?",
   "o": [
    "P^T·P = I, so P^{-1} = P^T; also ||Px|| = ||x|| and det P = ±1",
    "det P = +1 for every permutation matrix",
    "P^T = P for every permutation matrix",
    "There are n^2 permutation matrices of order n"
   ],
   "e": "A permutation rearranges the unit vectors, so P^T P = I, lengths are preserved (||Px|| = ||x||) and det P = ±1. A single row exchange already gives det = −1; P^T = P holds only for exchange matrices; the number of permutations of n rows is n!, e.g. 6 matrices of order 3.",
   "ru": {
    "t": "Какое утверждение о перестановочных матрицах ВЕРНО?",
    "o": [
     "P^T·P = I, поэтому P^{-1} = P^T; также ||Px|| = ||x|| и det P = ±1",
     "det P = +1 для всякой перестановочной матрицы",
     "P^T = P для всякой перестановочной матрицы",
     "Перестановочных матриц порядка n всего n^2"
    ],
    "e": "Перестановка переупорядочивает единичные векторы, поэтому P^T P = I, длины сохраняются (||Px|| = ||x||) и det P = ±1. Уже один обмен строк даёт det = −1; P^T = P верно лишь для обменных матриц; всего перестановок n строк n!, например 6 матриц порядка 3."
   },
   "uz": {
    "t": "Permutatsiya matritsalari haqida qaysi gap TOʻGʻRI?",
    "o": [
     "P^T·P = I, shuning uchun P^{-1} = P^T; shuningdek ||Px|| = ||x|| va det P = ±1",
     "Har qanday permutatsiya matritsa uchun det P = +1",
     "Har qanday permutatsiya matritsa uchun P^T = P",
     "n tartibli permutatsiya matritsalari jami n^2 ta"
    ],
    "e": "Permutatsiya birlik vektorlarni qayta tartiblaydi, shuning uchun P^T P = I, uzunliklar saqlanadi (||Px|| = ||x||) va det P = ±1. Bitta satr almashuvi allaqachon det = −1 beradi; P^T = P faqat almashuv matritsalari uchun oʻrinli; n satrning permutatsiyalari soni n!, masalan 3-tartibli 6 ta matritsa."
   }
  },
  {
   "t": "How many 3×3 permutation matrices are there, and what are their determinants?",
   "o": [
    "6 = 3! matrices: three with det = +1 (even) and three with det = −1 (odd)",
    "9 matrices, all with det = +1",
    "6 matrices, all with det = −1",
    "3 matrices: the identity and two exchanges"
   ],
   "e": "Three rows can be permuted in 3! = 6 ways. Three permutations are even (I and the two cyclic ones, det +1) and three are odd (the single exchanges P_21, P_32, P_31, det −1).",
   "ru": {
    "t": "Сколько существует перестановочных матриц 3×3 и каковы их определители?",
    "o": [
     "6 = 3! матриц: три с det = +1 (чётные) и три с det = −1 (нечётные)",
     "9 матриц, все с det = +1",
     "6 матриц, все с det = −1",
     "3 матрицы: единичная и две обменные"
    ],
    "e": "Три строки можно переставить 3! = 6 способами. Три перестановки чётные (I и две циклические, det +1) и три нечётные (одиночные обмены P_21, P_32, P_31, det −1)."
   },
   "uz": {
    "t": "3×3 permutatsiya matritsalari nechta va determinantlari qanday?",
    "o": [
     "6 = 3! ta: uchtasida det = +1 (juft), uchtasida det = −1 (toq)",
     "9 ta, hammasida det = +1",
     "6 ta, hammasida det = −1",
     "3 ta: birlik matritsa va ikkita almashuv matritsasi"
    ],
    "e": "Uch satrni 3! = 6 xil usulda permutatsiya qilish mumkin. Uchtasi juft (I va ikkita siklik, det +1), uchtasi toq (yakka almashuvlar P_21, P_32, P_31, det −1)."
   }
  },
  {
   "t": "Which of the following sets is a vector space under the usual operations?",
   "o": [
    "The set of all 2×2 real matrices",
    "The set of all invertible 2×2 matrices",
    "The set of vectors in R^2 with positive coordinates",
    "The set of all unit vectors (length 1) in R^2"
   ],
   "e": "All m×n matrices form a vector space (zero matrix; closed under sums and scalar multiples). Invertible matrices fail: I + (−I) = 0 is not invertible. Vectors with positive coordinates fail under multiplication by −1; unit vectors fail under addition (the sum of two unit vectors has length up to 2).",
   "ru": {
    "t": "Какое из следующих множеств является векторным пространством с обычными операциями?",
    "o": [
     "Множество всех вещественных матриц 2×2",
     "Множество всех обратимых матриц 2×2",
     "Множество векторов R^2 с положительными координатами",
     "Множество всех единичных векторов (длины 1) в R^2"
    ],
    "e": "Все матрицы m×n образуют векторное пространство (нулевая матрица; замкнутость относительно сумм и скалярных кратных). Обратимые матрицы не подходят: I + (−I) = 0 необратима. Векторы с положительными координатами нарушают умножение на −1; единичные векторы — сложение (сумма двух единичных векторов имеет длину до 2)."
   },
   "uz": {
    "t": "Quyidagi toʻplamlardan qaysi biri odatiy amallar bilan vektorlar fazosi hisoblanadi?",
    "o": [
     "Barcha 2×2 haqiqiy matritsalar toʻplami",
     "Barcha teskari (invertible) 2×2 matritsalar toʻplami",
     "Koordinatalari musbat boʻlgan R^2 vektorlari toʻplami",
     "R^2 dagi barcha birlik vektorlar (uzunligi 1) toʻplami"
    ],
    "e": "Barcha m×n matritsalar vektorlar fazosini hosil qiladi (nol matritsa; yigʻindilar va skalar koʻpaytmalarga nisbatan yopiq). Teskari matritsalar mos kelmaydi: I + (−I) = 0 teskari emas. Musbat koordinatali vektorlar −1 ga koʻpaytirishda, birlik vektorlar esa qoʻshishda buziladi (ikkita birlik vektor yigʻindisining uzunligi 2 gacha yetadi)."
   }
  },
  {
   "t": "Is S = {(x, y): y = 3x + 2} a subspace of R^2?",
   "o": [
    "No — the zero vector fails the equation: 3·0 + 2 = 2 ≠ 0, and every subspace must contain the origin",
    "Yes — every straight line in R^2 is a subspace",
    "Yes — the set is closed under addition because the equation is linear",
    "No — because the equation y = 3x + 2 has no solutions at all"
   ],
   "e": "A subspace must contain the zero vector, but (0, 0) does not satisfy the equation: 3·0 + 2 = 2 ≠ 0. A shifted line does not pass through the origin; the line y = 3x (no shift) would be a subspace.",
   "ru": {
    "t": "Является ли S = {(x, y): y = 3x + 2} подпространством R^2?",
    "o": [
     "Нет — нулевой вектор не удовлетворяет уравнению: 3·0 + 2 = 2 ≠ 0, а всякое подпространство обязано содержать начало координат",
     "Да — всякая прямая в R^2 является подпространством",
     "Да — множество замкнуто относительно сложения, так как уравнение линейно",
     "Нет — потому что у уравнения y = 3x + 2 вообще нет решений"
    ],
    "e": "Подпространство обязано содержать нулевой вектор, но (0, 0) не удовлетворяет уравнению: 3·0 + 2 = 2 ≠ 0. Сдвинутая прямая не проходит через начало координат; прямая y = 3x (без сдвига) была бы подпространством."
   },
   "uz": {
    "t": "S = {(x, y): y = 3x + 2} toʻplami R^2 ning pastki fazosimi?",
    "o": [
     "Yoʻq — nol vektor tenglamani qanoatlantirmaydi: 3·0 + 2 = 2 ≠ 0, har qanday pastki fazo bosh nuqtani oʻz ichiga olishi shart",
     "Ha — R^2 dagi har qanday toʻgʻri chiziq pastki faza",
     "Ha — tenglama chiziqli boʻlgani uchun toʻplam qoʻshishga nisbatan yopiq",
     "Yoʻq — chunki y = 3x + 2 tenglamasining umuman yechimi yoʻq"
    ],
    "e": "Pastki fazo nol vektorni oʻz ichiga olishi shart, lekin (0, 0) tenglamani qanoatlantirmaydi: 3·0 + 2 = 2 ≠ 0. Surilgan toʻgʻri chiziq bosh nuqtadan oʻtmaydi; y = 3x chizigʻi (surilmasiz) pastki faza boʻlardi."
   }
  },
  {
   "t": "Is W = {(x, y): x ≥ 0} a subspace of R^2?",
   "o": [
    "No: (1, 0) is in W but (−1)·(1, 0) = (−1, 0) is not — W is not closed under scalar multiplication",
    "Yes: W contains the zero vector and is closed under addition",
    "No: the zero vector does not belong to W",
    "Yes: every half-plane is a subspace"
   ],
   "e": "The zero vector is in W, and sums of nonnegative x-coordinates stay nonnegative, but closure under scalars fails: multiply (1, 0) by −1. The subspace test requires all three conditions — zero, sums, scalar multiples.",
   "ru": {
    "t": "Является ли W = {(x, y): x ≥ 0} подпространством R^2?",
    "o": [
     "Нет: (1, 0) лежит в W, но (−1)·(1, 0) = (−1, 0) уже нет — W не замкнуто относительно скалярного умножения",
     "Да: W содержит нулевой вектор и замкнуто относительно сложения",
     "Нет: нулевой вектор не принадлежит W",
     "Да: всякая полуплоскость является подпространством"
    ],
    "e": "Нулевой вектор лежит в W, и суммы неотрицательных абсцисс неотрицательны, но замкнутость относительно скаляров нарушена: умножьте (1, 0) на −1. Тест подпространства требует всех трёх условий — нулевой вектор, суммы, скалярные кратные."
   },
   "uz": {
    "t": "W = {(x, y): x ≥ 0} toʻplami R^2 ning pastki fazasimi?",
    "o": [
     "Yoʻq: (1, 0) W da yotadi, lekin (−1)·(1, 0) = (−1, 0) yotmaydi — W skalar koʻpaytmaga nisbatan yopiq emas",
     "Ha: W nol vektorni oʻz ichiga oladi va qoʻshishga nisbatan yopiq",
     "Yoʻq: nol vektor W ga tegishli emas",
     "Ha: har qanday yarim tekislik pastki faza"
    ],
    "e": "Nol vektor W da yotadi va manfiy boʻlmagan abscissalar yigʻindisi manfiy boʻlmaydi, lekin skalar koʻpaytmaga yopqlik buziladi: (1, 0) ni −1 ga koʻpaytiring. Pastki fazo testi uch shartning hammasini — nol vektor, yigʻindilar, skalar koʻpaytmalarni talab qiladi."
   }
  },
  {
   "t": "Is R^2 a subspace of R^3?",
   "o": [
    "No — R^2 is not even a subset of R^3: vectors of R^3 have three components. The plane {(x, y, 0)} is a subspace of R^3, but it is not the same set as R^2",
    "Yes — R^2 sits inside R^3 as the plane z = 0",
    "Yes — every vector space is a subspace of every other vector space",
    "No — because R^2 is not closed under addition"
   ],
   "e": "Vectors (x, y) have two components while vectors of R^3 have three, so R^2 is not a subset of R^3 and cannot be a subspace. The plane z = 0 inside R^3 is a subspace that looks like R^2, but as a set it consists of triples (x, y, 0).",
   "ru": {
    "t": "Является ли R^2 подпространством R^3?",
    "o": [
     "Нет — R^2 даже не является подмножеством R^3: у векторов R^3 три координаты. Плоскость {(x, y, 0)} — подпространство R^3, но это не то же множество, что R^2",
     "Да — R^2 лежит внутри R^3 как плоскость z = 0",
     "Да — всякое векторное пространство является подпространством любого другого",
     "Нет — потому что R^2 не замкнуто относительно сложения"
    ],
    "e": "Векторы (x, y) имеют две координаты, а векторы R^3 — три, поэтому R^2 не подмножество R^3 и подпространством быть не может. Плоскость z = 0 внутри R^3 — подпространство, «похожее» на R^2, но как множество оно состоит из троек (x, y, 0)."
   },
   "uz": {
    "t": "R^2 fazosi R^3 ning pastki fazosimi?",
    "o": [
     "Yoʻq — R^2 hatto R^3 ning toʻplami ham emas: R^3 vektorlarida uchta koordinata bor. {(x, y, 0)} tekisligi R^3 ning pastki fazosi, lekin u R^2 bilan bir xil toʻplam emas",
     "Ha — R^2 ichida R^3 sifatida z = 0 tekisligida yotadi",
     "Ha — har qanday vektorlar fazosi boshqa har qanday fazoning pastki fazasi",
     "Yoʻq — chunki R^2 qoʻshishga nisbatan yopiq emas"
    ],
    "e": "(x, y) vektorlarda ikkita koordinata, R^3 vektorlarida esa uchta boʻladi, shuning uchun R^2 — R^3 ning toʻplami emas va pastki faza boʻla olmaydi. R^3 ichidagi z = 0 tekisligi R^2 ga «oʻxshash» pastki faza, lekin toʻplam sifatida u (x, y, 0) uchliklaridan iborat."
   }
  },
  {
   "t": "Describe the null space N(A) of A = [1 2].",
   "o": [
    "N(A) = span{(−2, 1)} — a line in R^2",
    "N(A) = span{(1, 2)} — the row itself",
    "N(A) = span{(2, 1)}",
    "N(A) = R^2, since A has only one row"
   ],
   "e": "Ax = 0 reads x_1 + 2x_2 = 0, so x_1 = −2x_2: the solutions are the multiples of (−2, 1). Check: [1 2]·(−2, 1) = −2 + 2 = 0. One equation in two unknowns leaves a line of solutions through the origin.",
   "ru": {
    "t": "Опишите нуль-пространство N(A) матрицы A = [1 2].",
    "o": [
     "N(A) = span{(−2, 1)} — прямая в R^2",
     "N(A) = span{(1, 2)} — сама строка",
     "N(A) = span{(2, 1)}",
     "N(A) = R^2, так как в A всего одна строка"
    ],
    "e": "Уравнение Ax = 0 имеет вид x_1 + 2x_2 = 0, откуда x_1 = −2x_2: решения — кратные вектора (−2, 1). Проверка: [1 2]·(−2, 1) = −2 + 2 = 0. Одно уравнение с двумя неизвестными оставляет прямую решений через начало координат."
   },
   "uz": {
    "t": "A = [1 2] matritsaning nol-fazosi N(A) ni taʼriflang.",
    "o": [
     "N(A) = span{(−2, 1)} — R^2 dagi toʻgʻri chiziq",
     "N(A) = span{(1, 2)} — satrning oʻzi",
     "N(A) = span{(2, 1)}",
     "N(A) = R^2, chunki A da faqat bitta satr bor"
    ],
    "e": "Ax = 0 tenglamasi x_1 + 2x_2 = 0 koʻrinishida, demak x_1 = −2x_2: yechimlar (−2, 1) vektorning koʻpaytmalari. Tekshirish: [1 2]·(−2, 1) = −2 + 2 = 0. Ikkita nomaʼlumli bitta tenglama bosh nuqtadan oʻtuvchi yechimlar toʻgʻri chizigʻini qoldiradi."
   }
  },
  {
   "t": "Is the vector (3, 5) in span{(1, 1), (1, −1)}?",
   "o": [
    "Yes: (3, 5) = 4·(1, 1) − 1·(1, −1)",
    "No: (3, 5) is a multiple of neither (1, 1) nor (1, −1)",
    "Yes: (3, 5) = 2·(1, 1) + 1·(1, −1)",
    "No: the span of two vectors in R^2 is always a line"
   ],
   "e": "Solve c_1 + c_2 = 3 and c_1 − c_2 = 5: adding gives 2c_1 = 8, so c_1 = 4 and c_2 = −1. Hence (3, 5) = 4(1, 1) − (1, −1) belongs to the span — which here is all of R^2, since the two vectors are independent.",
   "ru": {
    "t": "Лежит ли вектор (3, 5) в span{(1, 1), (1, −1)}?",
    "o": [
     "Да: (3, 5) = 4·(1, 1) − 1·(1, −1)",
     "Нет: (3, 5) не кратно ни (1, 1), ни (1, −1)",
     "Да: (3, 5) = 2·(1, 1) + 1·(1, −1)",
     "Нет: оболочка двух векторов в R^2 — всегда прямая"
    ],
    "e": "Решите c_1 + c_2 = 3 и c_1 − c_2 = 5: сложение даёт 2c_1 = 8, откуда c_1 = 4 и c_2 = −1. Значит, (3, 5) = 4(1, 1) − (1, −1) лежит в оболочке — которая здесь всё R^2, так как векторы независимы."
   },
   "uz": {
    "t": "(3, 5) vektor span{(1, 1), (1, −1)} da yotadimi?",
    "o": [
     "Ha: (3, 5) = 4·(1, 1) − 1·(1, −1)",
     "Yoʻq: (3, 5) na (1, 1), na (1, −1) ga karrali",
     "Ha: (3, 5) = 2·(1, 1) + 1·(1, −1)",
     "Yoʻq: R^2 dagi ikki vektorning qobiq doim toʻgʻri chiziq"
    ],
    "e": "c_1 + c_2 = 3 va c_1 − c_2 = 5 ni yechamiz: qoʻshsak 2c_1 = 8, demak c_1 = 4 va c_2 = −1. Shuning uchun (3, 5) = 4(1, 1) − (1, −1) qobiqda yotadi — vektorlar mustaqil boʻlgani uchun qobiq bu yerda butun R^2."
   }
  },
  {
   "t": "Describe the column space C(A) of A = [1 2; 2 4; 0 0].",
   "o": [
    "C(A) = span{(1, 2, 0)} — a line in R^3, because column 2 is twice column 1",
    "C(A) = the whole plane z = 0 in R^3",
    "C(A) = R^3",
    "C(A) = {0}, the zero subspace"
   ],
   "e": "The columns (1, 2, 0) and (2, 4, 0) are proportional, so every combination is a multiple of (1, 2, 0): C(A) is a line. For instance (3, 6, 0) = A·[3; 0] lies in C(A), but (1, 2, 1) does not (its third coordinate is nonzero).",
   "ru": {
    "t": "Опишите столбцовое пространство C(A) матрицы A = [1 2; 2 4; 0 0].",
    "o": [
     "C(A) = span{(1, 2, 0)} — прямая в R^3, так как столбец 2 вдвое больше столбца 1",
     "C(A) = вся плоскость z = 0 в R^3",
     "C(A) = R^3",
     "C(A) = {0} — нулевое подпространство"
    ],
    "e": "Столбцы (1, 2, 0) и (2, 4, 0) пропорциональны, поэтому любая комбинация кратна (1, 2, 0): C(A) — прямая. Например, (3, 6, 0) = A·[3; 0] лежит в C(A), а (1, 2, 1) — нет (третья координата ненулевая)."
   },
   "uz": {
    "t": "A = [1 2; 2 4; 0 0] matritsaning ustunlar fazosi C(A) ni taʼriflang.",
    "o": [
     "C(A) = span{(1, 2, 0)} — R^3 dagi toʻgʻri chiziq, chunki 2-ustun 1-ustunning ikki barobari",
     "C(A) = R^3 dagi butun z = 0 tekisligi",
     "C(A) = R^3",
     "C(A) = {0} — nol pastki fazо"
    ],
    "e": "(1, 2, 0) va (2, 4, 0) ustunlari proporsional, shuning uchun har qanday kombinatsiya (1, 2, 0) koʻpaytmasi: C(A) — toʻgʻri chiziq. Masalan, (3, 6, 0) = A·[3; 0] C(A) da yotadi, lekin (1, 2, 1) yotmaydi (uchinchi koordinatasi noldan farq qiladi)."
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
   "e": "Ax = x_1·a_1 + ... + x_n·a_n produces exactly the combinations of the columns, so a solution exists precisely when b is in C(A). This is the master criterion for solvability: the system is solvable ⇔ b ∈ C(A).",
   "ru": {
    "t": "Система Ax = b имеет решение тогда и только тогда, когда:",
    "o": [
     "b лежит в столбцовом пространстве C(A) — b является комбинацией столбцов A",
     "b является комбинацией строк A",
     "b ненулевой",
     "A — квадратная матрица"
    ],
    "e": "Ax = x_1·a_1 + ... + x_n·a_n порождает в точности комбинации столбцов, поэтому решение существует ровно тогда, когда b лежит в C(A). Это главный критерий разрешимости: система разрешима ⇔ b ∈ C(A)."
   },
   "uz": {
    "t": "Ax = b sistemasi yechimga ega boʻlsa va faqat:",
    "o": [
     "b ustunlar fazosida C(A) yotsa — b A ustunlarining kombinatsiyasi boʻlsa",
     "b A satrlarining kombinatsiyasi boʻlsa",
     "b noldan farq qilgan vektor boʻlsa",
     "A kvadrat matritsa boʻlsa"
    ],
    "e": "Ax = x_1·a_1 + ... + x_n·a_n aynan ustunlar kombinatsiyalarini hosil qiladi, shuning uchun yechim faqat b C(A) da yotganda mavjud. Bu — yechiluvchanlikning asosiy mezonlari: sistema yechiladi ⇔ b ∈ C(A)."
   }
  },
  {
   "t": "Which vector lies in the null space N(A) of A = [1 2 −1]?",
   "o": [
    "(1, 0, 1)",
    "(1, 1, 1)",
    "(−2, 1, 1)",
    "(1, 2, 3)"
   ],
   "e": "N(A) consists of the solutions of x_1 + 2x_2 − x_3 = 0. Testing (1, 0, 1): 1 + 0 − 1 = 0 — it works. The other candidates give 2, −1 and 2. In fact N(A) = span{(−2, 1, 0), (1, 0, 1)} — a plane in R^3.",
   "ru": {
    "t": "Какой вектор лежит в нуль-пространстве N(A) матрицы A = [1 2 −1]?",
    "o": [
     "(1, 0, 1)",
     "(1, 1, 1)",
     "(−2, 1, 1)",
     "(1, 2, 3)"
    ],
    "e": "N(A) — решения уравнения x_1 + 2x_2 − x_3 = 0. Проверка (1, 0, 1): 1 + 0 − 1 = 0 — подходит. Остальные кандидаты дают 2, −1 и 2. На самом деле N(A) = span{(−2, 1, 0), (1, 0, 1)} — плоскость в R^3."
   },
   "uz": {
    "t": "Qaysi vektor A = [1 2 −1] matritsaning nol-fazosida N(A) yotadi?",
    "o": [
     "(1, 0, 1)",
     "(1, 1, 1)",
     "(−2, 1, 1)",
     "(1, 2, 3)"
    ],
    "e": "N(A) — x_1 + 2x_2 − x_3 = 0 tenglamasining yechimlari. (1, 0, 1) ni tekshiramiz: 1 + 0 − 1 = 0 — mos keladi. Qolgan nomzodlar 2, −1 va 2 beradi. Aslida N(A) = span{(−2, 1, 0), (1, 0, 1)} — R^3 dagi tekislik."
   }
  },
  {
   "t": "Ax = b is solvable and x_p is one particular solution. The complete solution is:",
   "o": [
    "x = x_p + x_n, where x_n is any vector of the null space N(A)",
    "x = x_p alone — the solution is always unique",
    "x = x_p + x_n, where x_n is any vector of the column space C(A)",
    "x = b + x_n, where x_n is in N(A)"
   ],
   "e": "If x is any solution, then A(x − x_p) = b − b = 0, so x − x_p is in N(A): every solution is x_p plus a null-space vector. The null space is a subspace, but for b ≠ 0 the solution set of Ax = b is its shifted copy and contains no zero vector.",
   "ru": {
    "t": "Система Ax = b разрешима, x_p — одно частное решение. Полное решение имеет вид:",
    "o": [
     "x = x_p + x_n, где x_n — любой вектор нуль-пространства N(A)",
     "x = x_p — решение всегда единственно",
     "x = x_p + x_n, где x_n — любой вектор столбцового пространства C(A)",
     "x = b + x_n, где x_n из N(A)"
    ],
    "e": "Если x — любое решение, то A(x − x_p) = b − b = 0, поэтому x − x_p лежит в N(A): каждое решение есть x_p плюс вектор нуль-пространства. N(A) — подпространство, а при b ≠ 0 множество решений Ax = b — его сдвинутая копия, не содержащая нулевого вектора."
   },
   "uz": {
    "t": "Ax = b sistemasida yechim mavjud, x_p — bitta xos yechim. Toʻliq yechim qanday koʻrinishda?",
    "o": [
     "x = x_p + x_n, bu yerda x_n — nol-fazо N(A) ning ixtiyoriy vektori",
     "x = x_p — yechim har doim yagona",
     "x = x_p + x_n, bu yerda x_n — ustunlar fazosi C(A) ning ixtiyoriy vektori",
     "x = b + x_n, bu yerda x_n — N(A) dan"
    ],
    "e": "Agar x ixtiyoriy yechim boʻlsa, A(x − x_p) = b − b = 0, demak x − x_p N(A) da yotadi: har qanday yechim x_p plus nol-fazо vektori. N(A) pastki fazо, b ≠ 0 boʻlganda esa Ax = b yechimlar toʻplami — uning surilgan nusxasi boʻlib, nol vektorni oʻz ichiga olmaydi."
   }
  }
 ]
};
