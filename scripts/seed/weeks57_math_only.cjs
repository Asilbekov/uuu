module.exports = {
 "title": "Math I: Weeks 5-7 Complete Test",
 "description": "Weeks 5-7 of Math I in one test: continuity and inverse functions, the Intermediate Value and Weierstrass theorems; derivatives, differentiation rules, higher-order derivatives; related rates and the review of chapter 3. The full study-guide PDFs (RU/EN/UZ) are attached.",
 "topic": "Mathematics",
 "attachments": [
  {
   "title": "Study Guide (RU) — Math I, недели 5–7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Math_I_Weeks_5-7_RU.pdf",
   "size": null
  },
  {
   "title": "Study Guide (EN) — Math I, Weeks 5-7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Math_I_Weeks_5-7_EN.pdf",
   "size": null
  },
  {
   "title": "Study Guide (UZ) — Math I, 5–7 haftalar",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Math_I_Weeks_5-7_UZ.pdf",
   "size": null
  },
  {
   "title": "Course file: Guide to MIDTERM EXAM Preparation (Math I)",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/course-files/math-1-mathematical-analysis/Guide_to_MIDTERM_EXAM.pdf",
   "size": 271562
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
  }
 ]
};
