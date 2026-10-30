module.exports = {
 "title": "Computer Science (C Programming) — Weeks 4-7: Complete Test",
 "description": "Weeks 4-7 in one test: C basics and program structure (week 4), control structures — if/else, switch, loops (week 5), functions and structures (week 6), recursion, pointers and strings (week 7) — lectures, bug hunts and the coffee-machine demo. The full study-guide PDFs (RU/EN/UZ) are attached.",
 "topic": "Computer Science",
 "attachments": [
  {
   "title": "Study Guide (RU) — Информатика: программирование на C, недели 4–7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Computer_Science_C_Programming_Weeks_4-7_RU.pdf",
   "size": null
  },
  {
   "title": "Study Guide (EN) — Computer Science: C Programming, Weeks 4-7",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Computer_Science_C_Programming_Weeks_4-7_EN.pdf",
   "size": null
  },
  {
   "title": "Study Guide (UZ) — Informatika: C dasturlash, 4–7 haftalar",
   "type": "pdf",
   "url": "https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Computer_Science_C_Programming_Weeks_4-7_UZ.pdf",
   "size": null
  }
 ],
 "questions": [
  {
   "t": "What does this fragment print?\n\ndouble fraction = 4 / 3;\nprintf(\"%f\\n\", fraction);",
   "o": [
    "1.000000",
    "1.333333",
    "0.000000",
    "a compilation error"
   ],
   "e": "Both operands of / are int, so 4 / 3 is integer division giving 1; only then is 1 converted to double. The type of the receiving variable does not change how the division is done.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\ndouble fraction = 4 / 3;\nprintf(\"%f\\n\", fraction);",
    "o": [
     "1.000000",
     "1.333333",
     "0.000000",
     "ошибка компиляции"
    ],
    "e": "Оба операнда / — целые, поэтому 4 / 3 — целочисленное деление, дающее 1; лишь затем 1 преобразуется в double. Тип переменной-приёмника не меняет способ выполнения деления."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\ndouble fraction = 4 / 3;\nprintf(\"%f\\n\", fraction);",
    "o": [
     "1.000000",
     "1.333333",
     "0.000000",
     "kompilyatsiya xatosi"
    ],
    "e": "Boʻluvning ikkala operandi int, shuning uchun 4 / 3 butun sonli boʻlinish boʻlib, 1 beradi; faqat undan keyin 1 double ga aylanadi. Qabul qiluvchi oʻzgaruvchining turi boʻlinish usulini oʻzgartirmaydi."
   }
  },
  {
   "t": "Which C type stores one basic character (for example 'B')?",
   "o": [
    "char",
    "int",
    "double",
    "bool"
   ],
   "e": "char grade = 'B'; stores one basic character. int is for whole numbers, double for approximate real values, bool for true/false (via <stdbool.h> in C99).",
   "ru": {
    "t": "Какой тип C хранит один базовый символ (например 'B')?",
    "o": [
     "char",
     "int",
     "double",
     "bool"
    ],
    "e": "char grade = 'B'; хранит один базовый символ. int — для целых чисел, double — для приближённых вещественных значений, bool — true/false (в C99 через <stdbool.h>)."
   },
   "uz": {
    "t": "C tilining qaysi turi bitta asosiy belgini (masalan 'B') saqlaydi?",
    "o": [
     "char",
     "int",
     "double",
     "bool"
    ],
    "e": "char grade = 'B'; bitta asosiy belgini saqlaydi. int — butun sonlar, double — taxminiy haqiqiy qiymatlar, bool — true/false (C99 da <stdbool.h> orqali)."
   }
  },
  {
   "t": "Which variable declaration is valid in standard C?",
   "o": [
    "int total_count;",
    "int money$owed;",
    "int 2ndscore;",
    "int long;"
   ],
   "e": "Names may contain letters, digits and _, must start with a letter and must not be keywords: a digit-first name is a hard compile error, long is a keyword, and $ in identifiers is only a GNU extension, not standard C.",
   "ru": {
    "t": "Какое объявление переменной корректно в стандартном C?",
    "o": [
     "int total_count;",
     "int money$owed;",
     "int 2ndscore;",
     "int long;"
    ],
    "e": "Имена могут содержать буквы, цифры и _, должны начинаться с буквы и не быть ключевыми словами: имя с цифры в начале — ошибка компиляции, long — ключевое слово, а $ в идентификаторах — лишь расширение GNU, не стандартный C."
   },
   "uz": {
    "t": "Standart C da qaysi oʻzgaruvchi eʼloni toʻgʻri?",
    "o": [
     "int total_count;",
     "int money$owed;",
     "int 2ndscore;",
     "int long;"
    ],
    "e": "Nomlar harf, raqam va _ saqlashi mumkin, harf bilan boshlanishi va kalit soʻz boʻlmasligi kerak: raqam bilan boshlanuvchi nom — kompilyatsiya xatosi, long — kalit soʻz, identifikatordagi $ esa faqat GNU kengaytmasi, standart C emas."
   }
  },
  {
   "t": "What does this fragment print?\n\nint x = 017;\nprintf(\"%d\\n\", x);",
   "o": [
    "15",
    "17",
    "0",
    "a compilation error"
   ],
   "e": "017 is an octal literal: 1·8 + 7 = 15. That is why with int y = 12; the value of x is greater than y.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nint x = 017;\nprintf(\"%d\\n\", x);",
    "o": [
     "15",
     "17",
     "0",
     "ошибка компиляции"
    ],
    "e": "017 — восьмеричный литерал: 1·8 + 7 = 15. Именно поэтому при int y = 12; значение x больше y."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nint x = 017;\nprintf(\"%d\\n\", x);",
    "o": [
     "15",
     "17",
     "0",
     "kompilyatsiya xatosi"
    ],
    "e": "017 — sakkizlik (oktal) literal: 1·8 + 7 = 15. Shu sababli int y = 12; boʻlganda x qiymati y dan katta."
   }
  },
  {
   "t": "What does this fragment print?\n\nenum COLOR { R = 1, G, B, Y = 10 };\nprintf(\"%d\\n\", G);",
   "o": [
    "2",
    "1",
    "10",
    "0"
   ],
   "e": "An enumerator without an explicit value continues numbering from the previous one: R = 1, so G = 2 and B = 3; Y is explicitly 10.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nenum COLOR { R = 1, G, B, Y = 10 };\nprintf(\"%d\\n\", G);",
    "o": [
     "2",
     "1",
     "10",
     "0"
    ],
    "e": "Энумератор без явного значения продолжает нумерацию от предыдущего: R = 1, поэтому G = 2 и B = 3; Y явно равен 10."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nenum COLOR { R = 1, G, B, Y = 10 };\nprintf(\"%d\\n\", G);",
    "o": [
     "2",
     "1",
     "10",
     "0"
    ],
    "e": "Aniq qiymat berilmagan enumerator oldingisidan boshlab raqamlashni davom ettiradi: R = 1, shuning uchun G = 2 va B = 3; Y esa aniq 10."
   }
  },
  {
   "t": "What does this fragment print?\n\nint y = 7;\nprintf(\"%d\\n\", y % 10);",
   "o": [
    "7",
    "0",
    "1",
    "3"
   ],
   "e": "7 is less than 10, so the remainder of 7 divided by 10 is 7 itself; y % 4 would give 3.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nint y = 7;\nprintf(\"%d\\n\", y % 10);",
    "o": [
     "7",
     "0",
     "1",
     "3"
    ],
    "e": "7 меньше 10, поэтому остаток от деления 7 на 10 равен самому числу 7; а y % 4 дал бы 3."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nint y = 7;\nprintf(\"%d\\n\", y % 10);",
    "o": [
     "7",
     "0",
     "1",
     "3"
    ],
    "e": "7 soni 10 dan kichik, shuning uchun 7 ni 10 ga boʻlgandagi qoldiq 7 ning oʻzi; y % 4 esa 3 berardi."
   }
  },
  {
   "t": "What does this fragment print?\n\nint x = 5;\nint y = x++;\nprintf(\"%d %d\\n\", x, y);",
   "o": [
    "6 5",
    "5 6",
    "6 6",
    "5 5"
   ],
   "e": "Postfix: y = x++; means y = x; x = x + 1; — y gets the old value 5, while x becomes 6.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nint x = 5;\nint y = x++;\nprintf(\"%d %d\\n\", x, y);",
    "o": [
     "6 5",
     "5 6",
     "6 6",
     "5 5"
    ],
    "e": "Постфикс: y = x++; эквивалентно y = x; x = x + 1; — y получает старое значение 5, а x становится 6."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nint x = 5;\nint y = x++;\nprintf(\"%d %d\\n\", x, y);",
    "o": [
     "6 5",
     "5 6",
     "6 6",
     "5 5"
    ],
    "e": "Postfiks: y = x++; — bu y = x; x = x + 1; degani — y eski 5 qiymatini oladi, x esa 6 boʻladi."
   }
  },
  {
   "t": "And with prefix increment?\n\nint x = 5;\nint y = ++x;\nprintf(\"%d %d\\n\", x, y);",
   "o": [
    "6 6",
    "6 5",
    "5 6",
    "5 5"
   ],
   "e": "Prefix: y = ++x; means x = x + 1; y = x; — x is incremented first, so both print 6.",
   "ru": {
    "t": "А с префиксным инкрементом?\n\nint x = 5;\nint y = ++x;\nprintf(\"%d %d\\n\", x, y);",
    "o": [
     "6 6",
     "6 5",
     "5 6",
     "5 5"
    ],
    "e": "Префикс: y = ++x; эквивалентно x = x + 1; y = x; — x увеличивается первым, поэтому печатаются 6 и 6."
   },
   "uz": {
    "t": "Prefiks oshirish bilan-chi?\n\nint x = 5;\nint y = ++x;\nprintf(\"%d %d\\n\", x, y);",
    "o": [
     "6 6",
     "6 5",
     "5 6",
     "5 5"
    ],
    "e": "Prefiks: y = ++x; — bu x = x + 1; y = x; degani — x avval oshadi, shuning uchun ikkalasi ham 6 chiqadi."
   }
  },
  {
   "t": "What does this fragment print?\n\nint x = 5;\n(0) && ((x = x + 1) > 0);\nprintf(\"%d\\n\", x);",
   "o": [
    "5",
    "6",
    "0",
    "a compilation error"
   ],
   "e": "Short circuit: the left operand of && is 0, so the whole expression is already false and the right side — with its side effect x = x + 1 — is never evaluated.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nint x = 5;\n(0) && ((x = x + 1) > 0);\nprintf(\"%d\\n\", x);",
    "o": [
     "5",
     "6",
     "0",
     "ошибка компиляции"
    ],
    "e": "Короткое замыкание: левый операнд && равен 0, всё выражение уже ложно, и правая часть — с побочным эффектом x = x + 1 — не вычисляется вовсе."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nint x = 5;\n(0) && ((x = x + 1) > 0);\nprintf(\"%d\\n\", x);",
    "o": [
     "5",
     "6",
     "0",
     "kompilyatsiya xatosi"
    ],
    "e": "Qisqa tutashuv: && ning chap operandi 0 — butun ifoda allaqachon yolgʻon, oʻng tomon esa (x = x + 1 yon effekti bilan) umuman hisoblanmaydi."
   }
  },
  {
   "t": "What does this line print?\n\nprintf(\"0x%x\\n\", 0x01 << 4);",
   "o": [
    "0x10",
    "0x01",
    "0x14",
    "0x04"
   ],
   "e": "Shifting 0x01 left by 4 bits gives 0x10; similarly 1 << 2 is 4, 0x010 >> 4 is 0x01, and 4 >> 1 is 2.",
   "ru": {
    "t": "Что напечатает эта строка?\n\nprintf(\"0x%x\\n\", 0x01 << 4);",
    "o": [
     "0x10",
     "0x01",
     "0x14",
     "0x04"
    ],
    "e": "Сдвиг 0x01 влево на 4 бита даёт 0x10; аналогично 1 << 2 → 4, 0x010 >> 4 → 0x01, а 4 >> 1 → 2."
   },
   "uz": {
    "t": "Bu satr nima chop etadi?\n\nprintf(\"0x%x\\n\", 0x01 << 4);",
    "o": [
     "0x10",
     "0x01",
     "0x14",
     "0x04"
    ],
    "e": "0x01 ni 4 bit chapga siljitish 0x10 beradi; xuddi shunday 1 << 2 → 4, 0x010 >> 4 → 0x01, 4 >> 1 → 2."
   }
  },
  {
   "t": "The expression y = x*3 + 2; is equivalent to…",
   "o": [
    "y = (x*3) + 2;",
    "y = x*(3+2);",
    "y = x + (3*2);",
    "y = 3*(x+2);"
   ],
   "e": "*, / and % bind tighter than + and −, so the multiplication happens first — same as y = (x*3)+2. Use parentheses generously.",
   "ru": {
    "t": "Выражение y = x*3 + 2; эквивалентно…",
    "o": [
     "y = (x*3) + 2;",
     "y = x*(3+2);",
     "y = x + (3*2);",
     "y = 3*(x+2);"
    ],
    "e": "*, / и % связывают сильнее, чем + и −, поэтому умножение выполняется первым — как в y = (x*3)+2. Используйте скобки щедро."
   },
   "uz": {
    "t": "y = x*3 + 2; ifodasi … ga teng.",
    "o": [
     "y = (x*3) + 2;",
     "y = x*(3+2);",
     "y = x + (3*2);",
     "y = 3*(x+2);"
    ],
    "e": "*, / va % + va − dan kuchliroq bogʻlanadi, shuning uchun koʻpaytirish birinchi bajariladi — y = (x*3)+2 kabi. Qavslarni koʻp ishlating."
   }
  },
  {
   "t": "Which of these years is a leap year?",
   "o": [
    "2000",
    "1900",
    "2100",
    "2025"
   ],
   "e": "Compact rule: year % 400 == 0 || (year % 4 == 0 && year % 100 != 0). 2000 is divisible by 400; 1900 and 2100 are divisible by 100 but not by 400; 2025 is not even divisible by 4 (2024 is a leap year).",
   "ru": {
    "t": "Какой из этих годов — високосный?",
    "o": [
     "2000",
     "1900",
     "2100",
     "2025"
    ],
    "e": "Компактное правило: year % 400 == 0 || (year % 4 == 0 && year % 100 != 0). 2000 кратен 400; 1900 и 2100 кратны 100, но не 400; 2025 даже не кратен 4 (2024 — високосный)."
   },
   "uz": {
    "t": "Bu yillardan qaysi biri kabisa yili?",
    "o": [
     "2000",
     "1900",
     "2100",
     "2025"
    ],
    "e": "Ixcham qoida: year % 400 == 0 || (year % 4 == 0 && year % 100 != 0). 2000 — 400 ga boʻlinadi; 1900 va 2100 — 100 ga boʻlinadi, lekin 400 ga emas; 2025 hatto 4 ga ham boʻlinmaydi (2024 — kabisa yili)."
   }
  },
  {
   "t": "How many significant decimal digits do float and double keep on the course platform?",
   "o": [
    "float — 6, double — 15",
    "float — 15, double — 6",
    "float — 6, double — 6",
    "float — 15, double — 15"
   ],
   "e": "FLT_DIG = 6 and DBL_DIG = 15 — significant digits, not digits after the decimal point. That is why the sphere task uses double for the radius and volume.",
   "ru": {
    "t": "Сколько значащих десятичных цифр хранят float и double на платформе курса?",
    "o": [
     "float — 6, double — 15",
     "float — 15, double — 6",
     "float — 6, double — 6",
     "float — 15, double — 15"
    ],
    "e": "FLT_DIG = 6 и DBL_DIG = 15 — это значащие цифры, а не знаки после запятой. Поэтому задача сферы использует double для радиуса и объёма."
   },
   "uz": {
    "t": "Kurs platformasida float va double nechta muhim oʻnlik raqamni saqlaydi?",
    "o": [
     "float — 6, double — 15",
     "float — 15, double — 6",
     "float — 6, double — 6",
     "float — 15, double — 15"
    ],
    "e": "FLT_DIG = 6 va DBL_DIG = 15 — bular kasr nuqtasidan keyingi emas, muhim raqamlar. Shuning uchun sfera masalasi radius va hajm uchun double ishlatadi."
   }
  },
  {
   "t": "The sphere task with radius 3 (pi = 3.1415). What is printed?\n\nconst double pi = 3.1415;\ndouble radius = 3;\ndouble volume = 4.0 / 3.0 * pi * radius * radius * radius;\nprintf(\"%.1f\\n\", volume);",
   "o": [
    "113.1",
    "84.8",
    "113.0940",
    "a compilation error"
   ],
   "e": "The stored value is about 113.094: %.1f shows 113.1 and %.4f would show 113.0940 — formatting changes only the display, not the stored number. With integer division 4 / 3 the volume would collapse to 84.8.",
   "ru": {
    "t": "Задача сферы при радиусе 3 (pi = 3.1415). Что печатается?\n\nconst double pi = 3.1415;\ndouble radius = 3;\ndouble volume = 4.0 / 3.0 * pi * radius * radius * radius;\nprintf(\"%.1f\\n\", volume);",
    "o": [
     "113.1",
     "84.8",
     "113.0940",
     "ошибка компиляции"
    ],
    "e": "Сохранённое значение ≈ 113.094: %.1f печатает 113.1, а %.4f напечатал бы 113.0940 — форматирование меняет только представление, а не сохранённое число. При целочисленном делении 4 / 3 объём превратился бы в 84.8."
   },
   "uz": {
    "t": "Radiusi 3 boʻlgan sfera masalasi (pi = 3.1415). Nima chop etiladi?\n\nconst double pi = 3.1415;\ndouble radius = 3;\ndouble volume = 4.0 / 3.0 * pi * radius * radius * radius;\nprintf(\"%.1f\\n\", volume);",
    "o": [
     "113.1",
     "84.8",
     "113.0940",
     "kompilyatsiya xatosi"
    ],
    "e": "Saqlangan qiymat ≈ 113.094: %.1f 113.1 koʻrsatadi, %.4f esa 113.0940 koʻrsatar edi — formatlash faqat koʻrinishni oʻzgartiradi, saqlangan sonni emas. Butun sonli 4 / 3 boʻlinishda hajm 84.8 ga aylanardi."
   }
  },
  {
   "t": "sign = x > 0 ? 1 : -1; is short for…",
   "o": [
    "if (x > 0) sign = 1; else sign = -1;",
    "if (x > 0) sign = -1; else sign = 1;",
    "if (x >= 0) sign = 1; else sign = -1;",
    "while (x > 0) sign = 1;"
   ],
   "e": "The ternary operator ?: is syntactic sugar for the if/else pattern: the condition stands before ?, the value when true between ? and :, the value when false after :.",
   "ru": {
    "t": "sign = x > 0 ? 1 : -1; — краткая запись…",
    "o": [
     "if (x > 0) sign = 1; else sign = -1;",
     "if (x > 0) sign = -1; else sign = 1;",
     "if (x >= 0) sign = 1; else sign = -1;",
     "while (x > 0) sign = 1;"
    ],
    "e": "Тернарный оператор ?: — синтаксический сахар для шаблона if/else: условие стоит перед ?, значение при истине — между ? и :, значение при лжи — после :."
   },
   "uz": {
    "t": "sign = x > 0 ? 1 : -1; — … ning qisqa yozilishi.",
    "o": [
     "if (x > 0) sign = 1; else sign = -1;",
     "if (x > 0) sign = -1; else sign = 1;",
     "if (x >= 0) sign = 1; else sign = -1;",
     "while (x > 0) sign = 1;"
    ],
    "e": "Uchlik ?: operatori if/else andozasining qisqa yozilishi: shart ? oldida, rost qiymat ? bilan : orasida, yolgʻon qiymat : dan keyin turadi."
   }
  },
  {
   "t": "How many times is the body of a do-while loop guaranteed to execute?",
   "o": [
    "at least once",
    "exactly once",
    "zero or more times — maybe never",
    "it depends on the compiler"
   ],
   "e": "do-while checks the condition after each iteration, so the body runs at least once; note the semicolon at the end: } while (cond);",
   "ru": {
    "t": "Сколько раз гарантированно выполняется тело цикла do-while?",
    "o": [
     "хотя бы один раз",
     "ровно один раз",
     "ноль или больше — может ни разу",
     "зависит от компилятора"
    ],
    "e": "do-while проверяет условие после каждой итерации, поэтому тело выполняется хотя бы один раз; обратите внимание на точку с запятой в конце: } while (cond);"
   },
   "uz": {
    "t": "do-while siklining tanasi kafolatlangan holda necha marta bajariladi?",
    "o": [
     "kamida bir marta",
     "aniq bir marta",
     "nol yoki undan koʻp — umuman bajarilmasligi ham mumkin",
     "kompilyatorga bogʻliq"
    ],
    "e": "do-while shartni har bir takrorlanishdan keyin tekshiradi, shuning uchun tana kamida bir marta bajariladi; oxiridagi nuqtali vergulga eʼtibor bering: } while (cond);"
   }
  },
  {
   "t": "When is the condition of a while loop evaluated?",
   "o": [
    "before the body — so the body may never execute",
    "after the body — like in do-while",
    "in the middle of the body",
    "only on the first iteration"
   ],
   "e": "while is a pre-condition loop: the condition is evaluated first, and if it is false from the start, the body never runs at all.",
   "ru": {
    "t": "Когда вычисляется условие цикла while?",
    "o": [
     "до тела — поэтому тело может не выполниться ни разу",
     "после тела — как в do-while",
     "в середине тела",
     "только на первой итерации"
    ],
    "e": "while — цикл с предусловием: условие вычисляется первым, и если оно ложно с самого начала, тело не выполнится ни разу."
   },
   "uz": {
    "t": "while siklining sharti qachon hisoblanadi?",
    "o": [
     "tanadan oldin — shuning uchun tana umuman bajarilmasligi mumkin",
     "tanadan keyin — do-while dagidek",
     "tananing oʻrtasida",
     "faqat birinchi takrorlanishda"
    ],
    "e": "while — oldindan shartli sikl: shart avval hisoblanadi va boshidanoq yolgʻon boʻlsa, tana umuman bajarilmaydi."
   }
  },
  {
   "t": "What does break do inside a switch?",
   "o": [
    "leaves the switch — execution continues after the closing brace",
    "terminates the whole program",
    "jumps to the default case",
    "skips the loop condition"
   ],
   "e": "After the printf in a case, break leaves the switch and the program continues after it; break does not end the program.",
   "ru": {
    "t": "Что делает break внутри switch?",
    "o": [
     "выходит из switch — выполнение продолжается после закрывающей скобки",
     "завершает всю программу",
     "переходит к ветке default",
     "пропускает условие цикла"
    ],
    "e": "После printf в case оператор break выходит из switch, и программа продолжается после него; break не завершает программу."
   },
   "uz": {
    "t": "switch ichida break nima qiladi?",
    "o": [
     "switch dan chiqadi — bajarilish yopuvchi qavsdan keyin davom etadi",
     "butun dasturni tugatadi",
     "default shoxchasiga oʻtadi",
     "sikl shartini tashlab yuboradi"
    ],
    "e": "case ichidagi printf dan keyin break switch dan chiqadi va dastur undan keyin davom etadi; break dasturni tugatmaydi."
   }
  },
  {
   "t": "What does continue; do inside a loop?",
   "o": [
    "skips the rest of the innermost loop body and jumps to the loop condition",
    "exits the loop completely",
    "restarts the loop from the initialization",
    "exits the function"
   ],
   "e": "continue skips the rest of the innermost loop body; in the lecture's gcd example a divisor candidate i that does not divide a is simply skipped.",
   "ru": {
    "t": "Что делает continue; внутри цикла?",
    "o": [
     "пропускает остаток тела самого внутреннего цикла и переходит к его условию",
     "полностью выходит из цикла",
     "перезапускает цикл с инициализации",
     "выходит из функции"
    ],
    "e": "continue пропускает остаток тела самого внутреннего цикла; в примере НОД из лекции кандидат-делитель i, не делящий a, просто пропускается."
   },
   "uz": {
    "t": "sikl ichida continue; nima qiladi?",
    "o": [
     "eng ichki sikl tanasining qolgan qismini tashlab, sikl shartiga oʻtadi",
     "sikldan butunlay chiqadi",
     "siklni boshlanishidan qayta boshlaydi",
     "funksiyadan chiqadi"
    ],
    "e": "continue eng ichki sikl tanasining qolgan qismini tashlaydi; maʼruzadagi EKUB misolida a ni boʻlmagan i kandidati shunchaki oʻtkazib yuboriladi."
   }
  },
  {
   "t": "What happens if the condition is omitted in a for header: for (i = 1; ; i++)?",
   "o": [
    "the empty condition is considered true — the loop runs until a break",
    "a compilation error",
    "the body never executes",
    "the loop runs exactly once"
   ],
   "e": "Any of the three for expressions may be empty; an empty condition is assumed to be true, so only break can stop the loop.",
   "ru": {
    "t": "Что будет, если опустить условие в заголовке for: for (i = 1; ; i++)?",
    "o": [
     "пустое условие считается истинным — цикл крутится до break",
     "ошибка компиляции",
     "тело не выполнится ни разу",
     "цикл выполнится ровно один раз"
    ],
    "e": "Любое из трёх выражений for может быть пустым; пустое условие считается истинным, поэтому остановить цикл может только break."
   },
   "uz": {
    "t": "for sarlavhasidan shart tashlab yuborilsa nima boʻladi: for (i = 1; ; i++)?",
    "o": [
     "boʻsh shart rost deb hisoblanadi — sikl break gacha ishlaydi",
     "kompilyatsiya xatosi",
     "tana umuman bajarilmaydi",
     "sikl aniq bir marta bajariladi"
    ],
    "e": "for ning uchta ifodasidan har qanday biri boʻsh boʻlishi mumkin; boʻsh shart rost deb qabul qilinadi, shuning uchun siklni faqat break toʻxtatadi."
   }
  },
  {
   "t": "In C99, the boolean type bool becomes available through which header?",
   "o": [
    "<stdbool.h>",
    "<bool.h>",
    "<stdio.h>",
    "<logic.h>"
   ],
   "e": "C89/C90 has no boolean type — any nonzero value is true and 0 is false; in C99 bool is provided via <stdbool.h>.",
   "ru": {
    "t": "В C99 логический тип bool становится доступен через какой заголовок?",
    "o": [
     "<stdbool.h>",
     "<bool.h>",
     "<stdio.h>",
     "<logic.h>"
    ],
    "e": "В C89/C90 логического типа нет — любое ненулевое значение истинно, 0 ложно; в C99 bool предоставляется через <stdbool.h>."
   },
   "uz": {
    "t": "C99 da mantiqiy bool turi qaysi sarlavha orqali mavjud boʻladi?",
    "o": [
     "<stdbool.h>",
     "<bool.h>",
     "<stdio.h>",
     "<logic.h>"
    ],
    "e": "C89/C90 da mantiqiy tur yoʻq — noldan farqli har qanday qiymat rost, 0 yolgʻon; C99 da bool <stdbool.h> orqali beriladi."
   }
  },
  {
   "t": "Which operator joins several expressions in one part of a for header, as in for (i = 1, j = 1; i <= n; j *= i, i++)?",
   "o": [
    "the comma operator",
    "the semicolon",
    "&&",
    "the colon"
   ],
   "e": "The comma is an operator with the lowest precedence, evaluated left to right — not the same as the comma between function arguments.",
   "ru": {
    "t": "Какой оператор соединяет несколько выражений в одной части заголовка for, как в for (i = 1, j = 1; i <= n; j *= i, i++)?",
    "o": [
     "оператор «запятая»",
     "точка с запятой",
     "&&",
     "двоеточие"
    ],
    "e": "Запятая — оператор с низшим приоритетом, вычисляется слева направо; это не то же самое, что запятая между аргументами функции."
   },
   "uz": {
    "t": "for sarlavhasining bir qismida bir nechta ifodani qaysi operator birlashtiradi, masalan for (i = 1, j = 1; i <= n; j *= i, i++)?",
    "o": [
     "vergul operatori",
     "nuqtali vergul",
     "&&",
     "ikki nuqta"
    ],
    "e": "Vergul — eng past ustuvorlikka ega operator, chapdan oʻngga hisoblanadi; bu funksiya argumentlari orasidagi vergul bilan bir xil emas."
   }
  },
  {
   "t": "In nested ifs without braces, an else binds to…",
   "o": [
    "the nearest inner if",
    "the outermost if",
    "the first if in the file",
    "nothing — it is a compilation error"
   ],
   "e": "else attaches to the closest inner if; to bind it to the outer if, wrap the inner if in braces { }.",
   "ru": {
    "t": "Во вложенных if без скобок else связывается с…",
    "o": [
     "с ближайшим внутренним if",
     "с самым внешним if",
     "с первым if в файле",
     "ни с чем — это ошибка компиляции"
    ],
    "e": "else относится к ближайшему внутреннему if; чтобы связать его с внешним if, заключите внутренний if в фигурные скобки { }."
   },
   "uz": {
    "t": "Qavsslarsiz ichma-ich if larda else … ga bogʻlanadi.",
    "o": [
     "eng yaqin ichki if ga",
     "eng tashqi if ga",
     "fayldagi birinchi if ga",
     "hech narsaga — bu kompilyatsiya xatosi"
    ],
    "e": "else eng yaqin ichki if ga tegishli; uni tashqi if ga bogʻlash uchun ichki if ni { } qavslariga oling."
   }
  },
  {
   "t": "In an if / else if / else chain, if several conditions are true at once…",
   "o": [
    "only the first true branch executes",
    "all true branches execute",
    "the last true branch executes",
    "the program stops with an error"
   ],
   "e": "Conditions are tested in order until the first true one; the equivalent nested-if structure runs exactly one branch.",
   "ru": {
    "t": "В цепочке if / else if / else, если истинно сразу несколько условий…",
    "o": [
     "выполняется только первая истинная ветка",
     "выполняются все истинные ветки",
     "выполняется последняя истинная ветка",
     "программа останавливается с ошибкой"
    ],
    "e": "Условия проверяются по порядку до первого истинного; эквивалентная структура вложенных if выполняет ровно одну ветку."
   },
   "uz": {
    "t": "if / else if / else zanjirida bir nechta shart birdan rost boʻlsa…",
    "o": [
     "faqat birinchi rost shoxcha bajariladi",
     "barcha rost shoxchalar bajariladi",
     "oxirgi rost shoxcha bajariladi",
     "dastur xato bilan toʻxtaydi"
    ],
    "e": "Shartlar tartib bilan birinchi rost boʻlguncha tekshiriladi; ekvivalent ichma-ich if strukturasi aynan bitta shoxchani bajaradi."
   }
  },
  {
   "t": "What can a switch statement test?",
   "o": [
    "one integer (or char) expression against case labels — distinct integer constants",
    "any floating-point ranges",
    "compound conditions like x > 0 && x < 10",
    "whole strings (char arrays)"
   ],
   "e": "switch takes an integer or character expression; case labels are distinct integer constant expressions; for ranges and compound conditions use if. default is the 'otherwise' branch.",
   "ru": {
    "t": "Что может проверять оператор switch?",
    "o": [
     "одно целочисленное (или символьное) выражение на совпадение с case-метками — различными целыми константами",
     "любые диапазоны вещественных чисел",
     "составные условия вроде x > 0 && x < 10",
     "целые строки (массивы char)"
    ],
    "e": "switch принимает целочисленное или символьное выражение; case-метки — различные целые константные выражения; для диапазонов и составных условий используйте if. default — ветка «иначе»."
   },
   "uz": {
    "t": "switch operatori nimani tekshira oladi?",
    "o": [
     "bitta butun (yoki char) ifodani case yorliqlari — har xil butun konstantalar bilan solishtiradi",
     "har qanday haqiqiy sonlar diapazonlari",
     "x > 0 && x < 10 kabi murakkab shartlar",
     "butun satrlarni (char massivlari)"
    ],
    "e": "switch butun yoki belgili ifoda qabul qiladi; case yorliqlari — har xil butun konstanta ifodalar; diapazonlar va murakkab shartlar uchun if ishlating. default — «aks holda» shoxchasi."
   }
  },
  {
   "t": "The melody example (Example 6.1) computes the ASCII code of a character modulo 7. What does this print?\n\nprintf(\"%d\\n\", 'A' % 7);",
   "o": [
    "2",
    "9",
    "1",
    "3"
   ],
   "e": "The code of 'A' is 65, and 65 % 7 = 2 — case 2 prints the note C.",
   "ru": {
    "t": "Пример «мелодия» (Example 6.1) вычисляет ASCII-код символа по модулю 7. Что напечатает этот фрагмент?\n\nprintf(\"%d\\n\", 'A' % 7);",
    "o": [
     "2",
     "9",
     "1",
     "3"
    ],
    "e": "Код 'A' равен 65, и 65 % 7 = 2 — case 2 печатает ноту C."
   },
   "uz": {
    "t": "«Melodiya» misoli (Example 6.1) belgining ASCII kodini 7 ga boʻlgan qoldiqqa hisoblaydi. Bu nimani chop etadi?\n\nprintf(\"%d\\n\", 'A' % 7);",
    "o": [
     "2",
     "9",
     "1",
     "3"
    ],
    "e": "'A' belgisining kodi 65 va 65 % 7 = 2 — case 2 «C» notasini chop etadi."
   }
  },
  {
   "t": "What does this fragment print?\n\nint score = 0;\nchar reaction = 'W';\nswitch (reaction) {\ncase 'W': score += 2;\ncase 'L': score -= 1; break;\n}\nprintf(\"%d\\n\", score);",
   "o": [
    "1",
    "2",
    "0",
    "-1"
   ],
   "e": "'W' matches case 'W' (score becomes 2), but there is no break, so execution falls through into case 'L' without a new check: score -= 1 gives 1; the break then leaves the switch.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nint score = 0;\nchar reaction = 'W';\nswitch (reaction) {\ncase 'W': score += 2;\ncase 'L': score -= 1; break;\n}\nprintf(\"%d\\n\", score);",
    "o": [
     "1",
     "2",
     "0",
     "-1"
    ],
    "e": "'W' совпадает с case 'W' (score становится 2), но break нет — выполнение проваливается в case 'L' без новой проверки: score -= 1 даёт 1; затем break выходит из switch."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nint score = 0;\nchar reaction = 'W';\nswitch (reaction) {\ncase 'W': score += 2;\ncase 'L': score -= 1; break;\n}\nprintf(\"%d\\n\", score);",
    "o": [
     "1",
     "2",
     "0",
     "-1"
    ],
    "e": "'W' case 'W' ga mos keladi (score 2 boʻladi), lekin break yoʻq — bajarilish yangi tekshiruvsiz case 'L' ga tushib ketadi: score -= 1 natijada 1; keyin break switch dan chiqadi."
   }
  },
  {
   "t": "Bug hunt: this should print the sum 1..10 (55). What does it actually print?\n\nint sum = 0;\nint i;\nfor (i = 1; i <= 10; i++); {\nsum += i;\n}\nprintf(\"%d\\n\", sum);",
   "o": [
    "11",
    "55",
    "0",
    "10"
   ],
   "e": "The semicolon right after the for header makes the loop body an empty statement: the loop just runs i up to 11, and the block { sum += i; } then executes once with i = 11.",
   "ru": {
    "t": "Bug hunt: это должно печатать сумму 1..10 (55). Что печатается на самом деле?\n\nint sum = 0;\nint i;\nfor (i = 1; i <= 10; i++); {\nsum += i;\n}\nprintf(\"%d\\n\", sum);",
    "o": [
     "11",
     "55",
     "0",
     "10"
    ],
    "e": "Точка с запятой сразу после заголовка for делает телом цикла пустой оператор: цикл лишь доводит i до 11, а блок { sum += i; } затем выполняется один раз с i = 11."
   },
   "uz": {
    "t": "Bug hunt: bu 1..10 yigʻindisini (55) chop etishi kerak edi. Aslida nima chop etiladi?\n\nint sum = 0;\nint i;\nfor (i = 1; i <= 10; i++); {\nsum += i;\n}\nprintf(\"%d\\n\", sum);",
    "o": [
     "11",
     "55",
     "0",
     "10"
    ],
    "e": "for sarlavhasidan keyingi nuqtali vergul sikl tanasini boʻsh operatorga aylantiradi: sikl faqat i ni 11 gacha yetkazadi, { sum += i; } bloki esa keyin i = 11 bilan bir marta bajariladi."
   }
  },
  {
   "t": "Bug hunt: \"Total: 15\" is expected. What is printed?\n\nint total = 0;\nfor (int i = 1; i <= 5; i++) {\nint total = 0;\ntotal += i;\n}\nprintf(\"Total: %d\\n\", total);",
   "o": [
    "Total: 0",
    "Total: 15",
    "Total: 5",
    "a compilation error"
   ],
   "e": "The inner declaration int total = 0; shadows the outer variable: each iteration creates a fresh inner total and throws it away — the outer total never changes.",
   "ru": {
    "t": "Bug hunt: ожидается «Total: 15». Что печатается?\n\nint total = 0;\nfor (int i = 1; i <= 5; i++) {\nint total = 0;\ntotal += i;\n}\nprintf(\"Total: %d\\n\", total);",
    "o": [
     "Total: 0",
     "Total: 15",
     "Total: 5",
     "ошибка компиляции"
    ],
    "e": "Внутреннее объявление int total = 0; затеняет внешнюю переменную: каждая итерация создаёт новую внутреннюю total и выбрасывает её — внешняя total не меняется ни разу."
   },
   "uz": {
    "t": "Bug hunt: «Total: 15» kutilgan edi. Nima chop etiladi?\n\nint total = 0;\nfor (int i = 1; i <= 5; i++) {\nint total = 0;\ntotal += i;\n}\nprintf(\"Total: %d\\n\", total);",
    "o": [
     "Total: 0",
     "Total: 15",
     "Total: 5",
     "kompilyatsiya xatosi"
    ],
    "e": "Ichki eʼlon int total = 0; tashqi oʻzgaruvchini soya qiladi: har bir takrorlanish yangi ichki total yaratadi va tashlab yuboradi — tashqi total hech qachon oʻzgarmaydi."
   }
  },
  {
   "t": "What does this fragment print?\n\nint x = 6, y = 0;\nif (x % 4 == 0)\nif (x % 2 == 0) y = 2;\nelse\ny = 1;\nprintf(\"%d\\n\", y);",
   "o": [
    "0",
    "1",
    "2",
    "a compilation error"
   ],
   "e": "The else binds to the nearest inner if. For x = 6 the outer condition x % 4 == 0 is false (6 % 4 = 2), so nothing runs and y stays 0; if the else belonged to the outer if, y would be 1.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nint x = 6, y = 0;\nif (x % 4 == 0)\nif (x % 2 == 0) y = 2;\nelse\ny = 1;\nprintf(\"%d\\n\", y);",
    "o": [
     "0",
     "1",
     "2",
     "ошибка компиляции"
    ],
    "e": "else связан с ближайшим внутренним if. При x = 6 внешнее условие x % 4 == 0 ложно (6 % 4 = 2), поэтому ничего не выполняется и y остаётся 0; если бы else принадлежал внешнему if, y было бы 1."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nint x = 6, y = 0;\nif (x % 4 == 0)\nif (x % 2 == 0) y = 2;\nelse\ny = 1;\nprintf(\"%d\\n\", y);",
    "o": [
     "0",
     "1",
     "2",
     "kompilyatsiya xatosi"
    ],
    "e": "else eng yaqin ichki if ga bogʻlangan. x = 6 uchun tashqi shart x % 4 == 0 yolgʻon (6 % 4 = 2), shuning uchun hech narsa bajarilmaydi va y 0 boʻlib qoladi; else tashqi if ga tegishli boʻlganida y 1 boʻlardi."
   }
  },
  {
   "t": "Bug hunt: why does this never print \"Liftoff!\"?\n\nfor (unsigned int i = 5; i >= 0; i--) {\nprintf(\"%d \", i);\n}\nprintf(\"Liftoff!\");",
   "o": [
    "an unsigned counter is never below 0: i >= 0 is always true, and after 0 the decrement wraps to a huge value",
    "printf cannot print unsigned values",
    "the loop condition is checked after the body",
    "0 is not a valid value for %d"
   ],
   "e": "unsigned int cannot become negative, so i >= 0 always holds; after i reaches 0, the i-- wraps the counter to 4294967295 and the loop becomes infinite. Fix: a signed int counter.",
   "ru": {
    "t": "Bug hunt: почему это никогда не печатает «Liftoff!»?\n\nfor (unsigned int i = 5; i >= 0; i--) {\nprintf(\"%d \", i);\n}\nprintf(\"Liftoff!\");",
    "o": [
     "беззнаковый счётчик не бывает меньше 0: i >= 0 всегда истинно, а после 0 декремент заворачивает счётчик в огромное значение",
     "printf не может печатать беззнаковые значения",
     "условие цикла проверяется после тела",
     "0 — недопустимое значение для %d"
    ],
    "e": "unsigned int не бывает отрицательным, поэтому i >= 0 всегда истинно; после i = 0 оператор i-- заворачивает счётчик в 4294967295, и цикл становится бесконечным. Исправление — знаковый int."
   },
   "uz": {
    "t": "Bug hunt: nima uchun bu hech qachon «Liftoff!» chop etmaydi?\n\nfor (unsigned int i = 5; i >= 0; i--) {\nprintf(\"%d \", i);\n}\nprintf(\"Liftoff!\");",
    "o": [
     "belgisiz sanoqchi hech qachon 0 dan kichik boʻlmaydi: i >= 0 har doim rost, 0 dan keyin kamayish uni ulkan qiymatga aylantiradi",
     "printf belgisiz qiymatlarni chop eta olmaydi",
     "sikl sharti tanadan keyin tekshiriladi",
     "0 — %d uchun yaroqsiz qiymat"
    ],
    "e": "unsigned int manfiy boʻla olmaydi, shuning uchun i >= 0 har doim rost; i = 0 ga yetgach i-- sanoqchini 4294967295 ga aylantiradi va sikl cheksiz boʻlib qoladi. Tuzatish — belgili int sanoqchi."
   }
  },
  {
   "t": "Bug hunt: this loop should print 0.0 … 0.9 and stop. Why doesn't it?\n\nfor (double x = 0.0; x != 1.0; x += 0.1) {\nprintf(\"%f \", x);\n}",
   "o": [
    "0.1 is not exactly representable in binary, so after ten additions x misses 1.0 and x != 1.0 stays true",
    "printf %f always rounds up",
    "a double cannot hold the value 1.0",
    "the += operator is not defined for double"
   ],
   "e": "Comparing floating-point values with == or != is unreliable because of finite precision (ten 0.1's sum to 0.99999999999999989…). The fix is an ordering condition: x < 1.0.",
   "ru": {
    "t": "Bug hunt: цикл должен печатать 0.0 … 0.9 и остановиться. Почему этого не происходит?\n\nfor (double x = 0.0; x != 1.0; x += 0.1) {\nprintf(\"%f \", x);\n}",
    "o": [
     "0.1 непредставимо точно в двоичной системе, поэтому после десяти прибавлений x «промахивается» мимо 1.0, и x != 1.0 остаётся истинным",
     "printf %f всегда округляет вверх",
     "double не может хранить значение 1.0",
     "оператор += не определён для double"
    ],
    "e": "Сравнение вещественных значений через == или != ненадёжно из-за конечной точности (сумма десяти 0.1 равна 0.99999999999999989…). Исправление — условие порядка: x < 1.0."
   },
   "uz": {
    "t": "Bug hunt: sikl 0.0 … 0.9 ni chop etib toʻxtashi kerak edi. Nega bunday boʻlmaydi?\n\nfor (double x = 0.0; x != 1.0; x += 0.1) {\nprintf(\"%f \", x);\n}",
    "o": [
     "0.1 ikkilik sistemada aniq saqlanmaydi, shuning uchun oʻn qoʻshishdan keyin x 1.0 ni «oʻtkazib yuboradi» va x != 1.0 rost boʻlib qoladi",
     "printf %f har doim yuqoriga yaxlitlaydi",
     "double 1.0 qiymatini saqlay olmaydi",
     "+= operatori double uchun aniqlanmagan"
    ],
    "e": "Chekli aniqlik tufayli haqiqiy sonlarni == yoki != bilan solishtirish ishonchsiz (oʻnta 0.1 ning yigʻindisi 0.99999999999999989…). Tuzatish — tartib sharti: x < 1.0."
   }
  },
  {
   "t": "The buggy melody program is missing break after case 2. The input character is 'A' (code 65). What is printed?\n\nswitch (c % 7) {\ncase 2: printf(\"C\");\ncase 3: printf(\"D\"); break;\ndefault: break;\n}",
   "o": [
    "CD",
    "C",
    "D",
    "DC"
   ],
   "e": "65 % 7 = 2, so case 2 prints C; with no break, execution falls through into case 3 without a new check and also prints D. The fix is adding break after the printf in case 2.",
   "ru": {
    "t": "В испорченной «мелодии» после case 2 пропущен break. Входной символ — 'A' (код 65). Что печатается?\n\nswitch (c % 7) {\ncase 2: printf(\"C\");\ncase 3: printf(\"D\"); break;\ndefault: break;\n}",
    "o": [
     "CD",
     "C",
     "D",
     "DC"
    ],
    "e": "65 % 7 = 2, поэтому case 2 печатает C; без break выполнение проваливается в case 3 без новой проверки и печатает ещё и D. Исправление — добавить break после printf в case 2."
   },
   "uz": {
    "t": "Xatoli bor «melodiya» dasturida case 2 dan keyin break tushib qolgan. Kirish belgisi — 'A' (kod 65). Nima chop etiladi?\n\nswitch (c % 7) {\ncase 2: printf(\"C\");\ncase 3: printf(\"D\"); break;\ndefault: break;\n}",
    "o": [
     "CD",
     "C",
     "D",
     "DC"
    ],
    "e": "65 % 7 = 2, shuning uchun case 2 C ni chop etadi; break boʻlmaganda bajarilish yangi tekshiruvsiz case 3 ga tushadi va D ni ham chop etadi. Tuzatish — case 2 dagi printf dan keyin break qoʻshish."
   }
  },
  {
   "t": "What is a function prototype?",
   "o": [
    "a declaration that ends with ';' and has no body — it announces the function before main calls it",
    "the function body in curly braces",
    "a call of the function from main",
    "a variable declared inside a function"
   ],
   "e": "Prototype — announce the function; call — run it now; definition — describe its work. The prototype stands before main, and the definition may come after main.",
   "ru": {
    "t": "Что такое прототип функции?",
    "o": [
     "объявление, которое заканчивается ';' и не имеет тела — оно сообщает о функции до того, как main её вызовет",
     "тело функции в фигурных скобках",
     "вызов функции из main",
     "переменная, объявленная внутри функции"
    ],
    "e": "Прототип объявляет функцию; вызов выполняет её сейчас; определение описывает работу. Прототип стоит до main, а определение может идти после main."
   },
   "uz": {
    "t": "Funksiya prototipi nima?",
    "o": [
     "';' bilan tugaydigan va tanasi yoʻq eʼlon — u funksiyani main chaqirmasidan oldin eʼlon qiladi",
     "qavslar ichidagi funksiya tanasi",
     "main dan funksiyani chaqirish",
     "funksiya ichida eʼlon qilingan oʻzgaruvchi"
    ],
    "e": "Prototip funksiyani eʼlon qiladi; chaqiruv — uni hozir bajarish; taʼrif — ishini tasvirlash. Prototip main dan oldin turadi, taʼrif esa main dan keyin kelishi mumkin."
   }
  },
  {
   "t": "void print_meow(void) — how many inputs and return values does this function have?",
   "o": [
    "no inputs, no return value",
    "one input, one return value",
    "no inputs, one return value",
    "one input, no return value"
   ],
   "e": "The leading void means 'no return value', and (void) means 'no parameters'. A printed line is not a returned value.",
   "ru": {
    "t": "void print_meow(void) — сколько входов и возвращаемых значений у этой функции?",
    "o": [
     "нет входов, нет возвращаемого значения",
     "один вход, одно возвращаемое значение",
     "нет входов, одно возвращаемое значение",
     "один вход, нет возвращаемого значения"
    ],
    "e": "void перед именем означает «нет возвращаемого значения», а (void) — «нет параметров». Напечатанная строка — не возвращаемое значение."
   },
   "uz": {
    "t": "void print_meow(void) — bu funksiyada nechta kirish va qaytarish qiymati bor?",
    "o": [
     "kirish yoʻq, qaytarish qiymati yoʻq",
     "bitta kirish, bitta qaytarish qiymati",
     "kirish yoʻq, bitta qaytarish qiymati",
     "bitta kirish, qaytarish qiymati yoʻq"
    ],
    "e": "Nom oldidagi void «qaytarish qiymati yoʻq», (void) esa «parametrlar yoʻq» degani. Chop etilgan satr — qaytarilgan qiymat emas."
   }
  },
  {
   "t": "IntegerRoot is the integer square root: the largest r with r*r <= number. What does main print?\n\nint first = IntegerRoot(27);\nint second = IntegerRoot(16);\nprintf(\"%d %d\\n\", first, second);",
   "o": [
    "5 4",
    "5 5",
    "6 4",
    "27 16"
   ],
   "e": "For 27: 5×5 = 25 ≤ 27 while 6×6 = 36 > 27, so the answer is 5; for 16 it is 4. IntegerRoot returns the number — the caller prints it.",
   "ru": {
    "t": "IntegerRoot — целочисленный квадратный корень: наибольшее r, для которого r*r <= number. Что печатает main?\n\nint first = IntegerRoot(27);\nint second = IntegerRoot(16);\nprintf(\"%d %d\\n\", first, second);",
    "o": [
     "5 4",
     "5 5",
     "6 4",
     "27 16"
    ],
    "e": "Для 27: 5×5 = 25 ≤ 27, а 6×6 = 36 > 27 — ответ 5; для 16 — 4. IntegerRoot возвращает число — печатает его вызывающий."
   },
   "uz": {
    "t": "IntegerRoot — butun kvadrat ildiz: r*r <= number shartini qanoatlantiruvchi eng katta r. main nima chop etadi?\n\nint first = IntegerRoot(27);\nint second = IntegerRoot(16);\nprintf(\"%d %d\\n\", first, second);",
    "o": [
     "5 4",
     "5 5",
     "6 4",
     "27 16"
    ],
    "e": "27 uchun: 5×5 = 25 ≤ 27, ammo 6×6 = 36 > 27 — javob 5; 16 uchun — 4. IntegerRoot sonni qaytaradi — uni chaqiruvchi tomon chop etadi."
   }
  },
  {
   "t": "How do you access the field water_ml of the variable stock (type Stock)?",
   "o": [
    "stock.water_ml",
    "Stock.water_ml",
    "stock->water_ml",
    "stock:water_ml"
   ],
   "e": "A single field of a record is accessed with the dot: stock.water_ml = 450;. (Stock is the type name, stock is the variable; -> is used with pointers.)",
   "ru": {
    "t": "Как обратиться к полю water_ml переменной stock (типа Stock)?",
    "o": [
     "stock.water_ml",
     "Stock.water_ml",
     "stock->water_ml",
     "stock:water_ml"
    ],
    "e": "К одному полю записи обращаются через точку: stock.water_ml = 450;. (Stock — имя типа, stock — переменная; -> используется с указателями.)"
   },
   "uz": {
    "t": "stock oʻzgaruvchisining (Stock turi) water_ml maydoniga qanday murojaat qilinadi?",
    "o": [
     "stock.water_ml",
     "Stock.water_ml",
     "stock->water_ml",
     "stock:water_ml"
    ],
    "e": "Yozuvning bitta maydoniga nuqta orqali murojaat qilinadi: stock.water_ml = 450;. (Stock — tur nomi, stock — oʻzgaruvchi; -> koʻrsatkichlar bilan ishlatiladi.)"
   }
  },
  {
   "t": "In typedef struct { int water_ml; … } Stock; the name Stock is…",
   "o": [
    "a type name introduced by typedef",
    "a variable of the structure",
    "a field of the structure",
    "a function"
   ],
   "e": "typedef gives the structure type a convenient name; the variable is created separately: Stock stock = {500, 200, 40, 3}; — and case matters (Stock ≠ stock).",
   "ru": {
    "t": "В typedef struct { int water_ml; … } Stock; имя Stock — это…",
    "o": [
     "имя типа, введённое typedef",
     "переменная структуры",
     "поле структуры",
     "функция"
    ],
    "e": "typedef даёт типу-структуре удобное имя; переменная создаётся отдельно: Stock stock = {500, 200, 40, 3}; — и регистр важен (Stock ≠ stock)."
   },
   "uz": {
    "t": "typedef struct { int water_ml; … } Stock; da Stock nomi…",
    "o": [
     "typedef kiritgan tur nomi",
     "strukturaning oʻzgaruvchisi",
     "strukturaning maydoni",
     "funksiya"
    ],
    "e": "typedef strukturaga qulay tur nomi beradi; oʻzgaruvchi esa alohida yaratiladi: Stock stock = {500, 200, 40, 3}; — va registr muhim (Stock ≠ stock)."
   }
  },
  {
   "t": "stock starts with water 500. What does this print?\n\nStock preview = stock_after_water_use(stock, 100);\nprintf(\"%d\\n\", stock.water_ml);\nprintf(\"%d\\n\", preview.water_ml);\nstock = stock_after_water_use(stock, 50);\nprintf(\"%d\\n\", stock.water_ml);",
   "o": [
    "500, then 400, then 450",
    "400, then 400, then 450",
    "500, then 400, then 400",
    "400, then 500, then 450"
   ],
   "e": "The helper gets a copy of Stock: it subtracts from the copy and returns it. The original stays 500; preview holds 400; the second call starts from the unchanged 500 and saves 450 into stock.",
   "ru": {
    "t": "stock стартует с водой 500. Что печатает этот код?\n\nStock preview = stock_after_water_use(stock, 100);\nprintf(\"%d\\n\", stock.water_ml);\nprintf(\"%d\\n\", preview.water_ml);\nstock = stock_after_water_use(stock, 50);\nprintf(\"%d\\n\", stock.water_ml);",
    "o": [
     "500, затем 400, затем 450",
     "400, затем 400, затем 450",
     "500, затем 400, затем 400",
     "400, затем 500, затем 450"
    ],
    "e": "Помощник получает копию Stock: он вычитает из копии и возвращает её. Оригинал остаётся 500; preview хранит 400; второй вызов стартует от неизменённых 500 и сохраняет 450 в stock."
   },
   "uz": {
    "t": "stock 500 suv bilan boshlanadi. Bu kod nima chop etadi?\n\nStock preview = stock_after_water_use(stock, 100);\nprintf(\"%d\\n\", stock.water_ml);\nprintf(\"%d\\n\", preview.water_ml);\nstock = stock_after_water_use(stock, 50);\nprintf(\"%d\\n\", stock.water_ml);",
    "o": [
     "500, soʻng 400, soʻng 450",
     "400, soʻng 400, soʻng 450",
     "500, soʻng 400, soʻng 400",
     "400, soʻng 500, soʻng 450"
    ],
    "e": "Yordamchi funksiya Stock nusxasini oladi: undan ayiradi va qaytaradi. Original 500 boʻlib qoladi; preview 400 ni saqlaydi; ikkinchi chaqiruv oʻzgarmagan 500 dan boshlanib, 450 ni stock ga saqlaydi."
   }
  },
  {
   "t": "The machine has water 500 / milk 200 / beans 40 / cups 0; one latte needs 100 / 50 / 10 / 1. What does can_make_coffee return?",
   "o": [
    "false — one missing paper cup is enough to stop the order",
    "true — water, milk and beans are enough",
    "true — cups are not checked",
    "a compilation error"
   ],
   "e": "can_make_coffee joins all four >= checks with &&, so every resource must be sufficient; 'exactly enough' is accepted, but a single missing cup returns false and the if branch does nothing.",
   "ru": {
    "t": "В машине вода 500 / молоко 200 / зёрна 40 / стаканчики 0; один латте требует 100 / 50 / 10 / 1. Что вернёт can_make_coffee?",
    "o": [
     "false — одного недостающего стаканчика достаточно, чтобы остановить заказ",
     "true — воды, молока и зёрен хватает",
     "true — стаканчики не проверяются",
     "ошибка компиляции"
    ],
    "e": "can_make_coffee соединяет все четыре проверки >= через &&, поэтому каждого ресурса должно хватать; «ровно столько» принимается, но одного недостающего стаканчика достаточно для false — и ветка if ничего не делает."
   },
   "uz": {
    "t": "Mashinada suv 500 / sut 200 / don 40 / stakan 0; bitta latte uchun 100 / 50 / 10 / 1 kerak. can_make_coffee nima qaytaradi?",
    "o": [
     "false — bitta yetishmayotgan qogʻoz stakan buyurtmani toʻxtatishga yetarli",
     "true — suv, sut va don yetarli",
     "true — stakanlar tekshirilmaydi",
     "kompilyatsiya xatosi"
    ],
    "e": "can_make_coffee toʻrtta >= tekshiruvini && bilan birlashtiradi, shuning uchun har bir resurs yetarli boʻlishi kerak; «aynan yetarli» qabul qilinadi, lekin bitta yetishmayotgan stakan false qaytaradi va if shoxchasi hech narsa qilmaydi."
   }
  },
  {
   "t": "What does this line print?\n\nprintf(\"%04d\\n\", 10);",
   "o": [
    "0010",
    "  10 (two spaces before the number)",
    "10",
    "0100"
   ],
   "e": "Width 4 with the 0 flag pads with zeros: 0010. Without the flag %4d pads with spaces, and the − flag (%-7s) pads on the right.",
   "ru": {
    "t": "Что напечатает эта строка?\n\nprintf(\"%04d\\n\", 10);",
    "o": [
     "0010",
     "  10 (два пробела перед числом)",
     "10",
     "0100"
    ],
    "e": "Ширина 4 с флагом 0 дополняет нулями: 0010. Без флага %4d дополняет пробелами слева, а флаг − (%-7s) — справа."
   },
   "uz": {
    "t": "Bu satr nima chop etadi?\n\nprintf(\"%04d\\n\", 10);",
    "o": [
     "0010",
     "  10 (sondan oldin ikki probel)",
     "10",
     "0100"
    ],
    "e": "0 bayrogʻi bilan 4 kenglik nollar bilan toʻldiradi: 0010. Bayroqsiz %4d chap tomondan probellar bilan, − bayrogʻi (%-7s) esa oʻng tomondan toʻldiradi."
   }
  },
  {
   "t": "What does this line print?\n\nprintf(\"%.4s\\n\", \"hello\");",
   "o": [
    "hell",
    "hello",
    "h",
    "ello"
   ],
   "e": "Precision for strings cuts the output to 4 characters; %.1s would print just \"h\", and %.2f means two digits after the decimal point.",
   "ru": {
    "t": "Что напечатает эта строка?\n\nprintf(\"%.4s\\n\", \"hello\");",
    "o": [
     "hell",
     "hello",
     "h",
     "ello"
    ],
    "e": "Точность для строк обрезает вывод до 4 символов; %.1s напечатал бы только «h», а %.2f — два знака после запятой."
   },
   "uz": {
    "t": "Bu satr nima chop etadi?\n\nprintf(\"%.4s\\n\", \"hello\");",
    "o": [
     "hell",
     "hello",
     "h",
     "ello"
    ],
    "e": "Satrlar uchun aniqlik chiqishni 4 belgiga kesadi; %.1s faqat «h» chop etardi, %.2f esa kasr nuqtasidan keyin ikki raqam degani."
   }
  },
  {
   "t": "How do you read an integer into the variable x with scanf?",
   "o": [
    "scanf(\"%d\", &x);",
    "scanf(\"%d\", x);",
    "scanf(\"%d\", *x);",
    "scanf(%d, &x);"
   ],
   "e": "scanf arguments must be addresses (pointers) — &x. For a char array the name is already an address: scanf(\"%s\", str) without &.",
   "ru": {
    "t": "Как прочитать целое число в переменную x с помощью scanf?",
    "o": [
     "scanf(\"%d\", &x);",
     "scanf(\"%d\", x);",
     "scanf(\"%d\", *x);",
     "scanf(%d, &x);"
    ],
    "e": "Аргументы scanf должны быть адресами (указателями) — &x. Для массива char имя уже является адресом: scanf(\"%s\", str) без &."
   },
   "uz": {
    "t": "scanf yordamida butun sonni x oʻzgaruvchisiga qanday oʻqiladi?",
    "o": [
     "scanf(\"%d\", &x);",
     "scanf(\"%d\", x);",
     "scanf(\"%d\", *x);",
     "scanf(%d, &x);"
    ],
    "e": "scanf argumentlari manzillar (koʻrsatkichlar) boʻlishi kerak — &x. char massivi uchun nomning oʻzi manzil: scanf(\"%s\", str) — & siz."
   }
  },
  {
   "t": "What does the mode \"r\" of fopen mean?",
   "o": [
    "open the file for reading only",
    "open the file for writing only",
    "open the file for appending",
    "make the file binary"
   ],
   "e": "\"r\" — read, \"w\" — write, \"a\" — append; \"b\" is added for binary files. fopen returns a FILE* or NULL if the stream cannot be opened.",
   "ru": {
    "t": "Что означает режим \"r\" функции fopen?",
    "o": [
     "открыть файл только для чтения",
     "открыть файл только для записи",
     "открыть файл для добавления",
     "сделать файл двоичным"
    ],
    "e": "\"r\" — чтение, \"w\" — запись, \"a\" — добавление; для двоичных файлов добавляется \"b\". fopen возвращает FILE* или NULL, если поток не открывается."
   },
   "uz": {
    "t": "fopen ning \"r\" rejimi nimani anglatadi?",
    "o": [
     "faylni faqat oʻqish uchun ochish",
     "faylni faqat yozish uchun ochish",
     "faylni qoʻshish uchun ochish",
     "faylni ikkilik qilish"
    ],
    "e": "\"r\" — oʻqish, \"w\" — yozish, \"a\" — qoʻshish; ikkilik fayllar uchun \"b\" qoʻshiladi. fopen FILE* yoki ochilmasa NULL qaytaradi."
   }
  },
  {
   "t": "In void print_meows(int count), which is the parameter and which is the argument in the call print_meows(3)?",
   "o": [
    "count is the parameter, 3 is the argument",
    "count is the argument, 3 is the parameter",
    "both are parameters",
    "both are arguments"
   ],
   "e": "The parameter is the input's name inside the function (count, local to it); the argument is the value passed by the call (3) — it is copied into the parameter on every call.",
   "ru": {
    "t": "В void print_meows(int count) что является параметром, а что аргументом в вызове print_meows(3)?",
    "o": [
     "count — параметр, 3 — аргумент",
     "count — аргумент, 3 — параметр",
     "оба — параметры",
     "оба — аргументы"
    ],
    "e": "Параметр — имя входа внутри функции (count, локально для неё); аргумент — значение, переданное вызовом (3); при каждом вызове оно копируется в параметр."
   },
   "uz": {
    "t": "void print_meows(int count) da print_meows(3) chaqiruvida qaysi biri parametr, qaysi biri argument?",
    "o": [
     "count — parametr, 3 — argument",
     "count — argument, 3 — parametr",
     "ikalasi ham parametr",
     "ikalasi ham argument"
    ],
    "e": "Parametr — funksiya ichidagi kirish nomi (count, faqat unga mahalliy); argument — chaqiruv uzatadigan qiymat (3); har chaqiruvda u parametrga koʻchiriladi."
   }
  },
  {
   "t": "print_meow prints \"meow\" on a line; print_meows(count) calls it in a loop. What does print_meows(3) print?",
   "o": [
    "meow three times, one per line",
    "meow once",
    "meow twice",
    "nothing — the function is void"
   ],
   "e": "print_meows(3) runs the for loop with i = 0, 1, 2 and calls print_meow() each time; being void does not stop a function from printing.",
   "ru": {
    "t": "print_meow печатает «meow» на строке; print_meows(count) вызывает её в цикле. Что напечатает print_meows(3)?",
    "o": [
     "meow три раза, по одному на строку",
     "meow один раз",
     "meow два раза",
     "ничего — функция void"
    ],
    "e": "print_meows(3) выполняет цикл for с i = 0, 1, 2 и каждый раз вызывает print_meow(); то, что функция void, не мешает ей печатать."
   },
   "uz": {
    "t": "print_meow bitta satrda «meow» chop etadi; print_meows(count) uni siklda chaqiradi. print_meows(3) nima chop etadi?",
    "o": [
     "meow uch marta, har biri alohida satrda",
     "meow bir marta",
     "meow ikki marta",
     "hech narsa — funksiya void"
    ],
    "e": "print_meows(3) for siklini i = 0, 1, 2 bilan bajaradi va har safar print_meow() ni chaqiradi; funksiyaning void boʻlishi chop etishga toʻsqinlik qilmaydi."
   }
  },
  {
   "t": "Dijkstra called excessive goto harmful ('spaghetti code'). What is a legitimate use of goto in C?",
   "o": [
    "exiting from nested blocks — for example, jumping to an error: label when handling errors",
    "making loops run faster",
    "replacing function calls",
    "declaring variables"
   ],
   "e": "C++ and Java have exceptions for error recovery; in C, goto is a convenient way to exit nested blocks to an error label. Excess goto makes code hard to read and debug.",
   "ru": {
    "t": "Дейкстра называл избыточный goto вредным («спагетти-код»). Какое применение goto в C законно?",
    "o": [
     "выход из вложенных блоков — например, переход на метку error: при обработке ошибок",
     "ускорение циклов",
     "замена вызовов функций",
     "объявление переменных"
    ],
    "e": "В C++ и Java для восстановления после ошибок есть исключения; в C goto — удобный способ выйти из вложенных блоков на метку error:. Избыток goto делает код трудным для чтения и отладки."
   },
   "uz": {
    "t": "Dijkstra ortiqcha gotoni zararli deb atagan («spagetti-kod»). C da gotoning qonuniy qoʻllanishi qanday?",
    "o": [
     "ichma-ich bloklardan chiqish — masalan, xatolarni qayta ishlashda error: yorligʻiga oʻtish",
     "sikllarni tezlashtirish",
     "funksiya chaqiruvlarini almashtirish",
     "oʻzgaruvchilar eʼlon qilish"
    ],
    "e": "C++ va Javada xatoliklarni tiklash uchun istisnolar bor; C da goto — ichma-ich bloklardan error: yorligʻiga chiqishning qulay usuli. Ortiqcha goto kodni oʻqish va tuzatishni qiyinlashtiradi."
   }
  },
  {
   "t": "The program is run as ./cat a.txt b.txt and starts with int main(int argc, char *argv[]). What are argc and argv[0]?",
   "o": [
    "argc = 3, argv[0] = \"cat\" (the program name)",
    "argc = 2, argv[0] = \"a.txt\"",
    "argc = 3, argv[0] = \"a.txt\"",
    "argc = 1, argv[0] = \"cat\""
   ],
   "e": "Command-line arguments include the program name: argc = 3, argv[0] = \"cat\", argv[1] = \"a.txt\", argv[2] = \"b.txt\"; a lone ./cat gives argc = 1.",
   "ru": {
    "t": "Программу запускают как ./cat a.txt b.txt, и она начинается с int main(int argc, char *argv[]). Что такое argc и argv[0]?",
    "o": [
     "argc = 3, argv[0] = \"cat\" (имя программы)",
     "argc = 2, argv[0] = \"a.txt\"",
     "argc = 3, argv[0] = \"a.txt\"",
     "argc = 1, argv[0] = \"cat\""
    ],
    "e": "Аргументы командной строки включают имя программы: argc = 3, argv[0] = \"cat\", argv[1] = \"a.txt\", argv[2] = \"b.txt\"; одиночный ./cat даёт argc = 1."
   },
   "uz": {
    "t": "Dastur ./cat a.txt b.txt sifatida ishga tushiriladi va int main(int argc, char *argv[]) bilan boshlanadi. argc va argv[0] nima?",
    "o": [
     "argc = 3, argv[0] = \"cat\" (dastur nomi)",
     "argc = 2, argv[0] = \"a.txt\"",
     "argc = 3, argv[0] = \"a.txt\"",
     "argc = 1, argv[0] = \"cat\""
    ],
    "e": "Buyruq qatori argumentlari dastur nomini ham oʻz ichiga oladi: argc = 3, argv[0] = \"cat\", argv[1] = \"a.txt\", argv[2] = \"b.txt\"; yolgʻiz ./cat esa argc = 1 beradi."
   }
  },
  {
   "t": "Bug hunt: why does int total = doubled(5) + doubled(3); fail to compile, if doubled is declared as void and only prints?",
   "o": [
    "a void function returns nothing, so it cannot be used inside an expression",
    "the + operator works only with int variables",
    "doubled(5) must be written as doubled(5.0)",
    "total must be declared const"
   ],
   "e": "The compiler reports \"void value not ignored as it ought to be\". Fix: int doubled(int x) { return x * 2; } — then total = 10 + 6 = 16.",
   "ru": {
    "t": "Bug hunt: почему int total = doubled(5) + doubled(3); не компилируется, если doubled объявлена как void и только печатает?",
    "o": [
     "void-функция ничего не возвращает, поэтому её нельзя использовать в выражении",
     "оператор + работает только с переменными int",
     "надо писать doubled(5.0), а не doubled(5)",
     "total должен быть объявлен const"
    ],
    "e": "Компилятор сообщает «void value not ignored as it ought to be». Исправление: int doubled(int x) { return x * 2; } — тогда total = 10 + 6 = 16."
   },
   "uz": {
    "t": "Bug hunt: doubled void deb eʼlon qilingan va faqat chop etsa, int total = doubled(5) + doubled(3); nega kompilyatsiya qilinmaydi?",
    "o": [
     "void funksiya hech narsa qaytarmaydi, shuning uchun uni ifoda ichida ishlatib boʻlmaydi",
     "+ operatori faqat int oʻzgaruvchilar bilan ishlaydi",
     "doubled(5) emas, doubled(5.0) deb yozilishi kerak",
     "total const deb eʼlon qilinishi kerak"
    ],
    "e": "Kompilyator «void value not ignored as it ought to be» deb xabar beradi. Tuzatish: int doubled(int x) { return x * 2; } — unda total = 10 + 6 = 16."
   }
  },
  {
   "t": "Bug hunt: what happens when apply_discount(100, 0) runs?\n\ndouble apply_discount(double price, int is_member) {\ndouble discount;\nif (is_member) discount = 0.2;\nreturn price * (1 - discount);\n}",
   "o": [
    "with is_member = 0 the discount variable is uninitialized — the result is garbage (undefined behavior)",
    "discount is automatically set to 0.0",
    "the function returns 120.0",
    "the compiler refuses to compile the code"
   ],
   "e": "C has no default values: with is_member = 0 the if body never runs and discount keeps a garbage value. Fix: double discount = 0.0; or add an else branch.",
   "ru": {
    "t": "Bug hunt: что происходит при вызове apply_discount(100, 0)?\n\ndouble apply_discount(double price, int is_member) {\ndouble discount;\nif (is_member) discount = 0.2;\nreturn price * (1 - discount);\n}",
    "o": [
     "при is_member = 0 переменная discount не инициализирована — результат мусор (неопределённое поведение)",
     "discount автоматически становится 0.0",
     "функция возвращает 120.0",
     "компилятор отказывается компилировать код"
    ],
    "e": "В C нет значений по умолчанию: при is_member = 0 тело if не выполняется, и discount хранит мусорное значение. Исправление: double discount = 0.0; или ветка else."
   },
   "uz": {
    "t": "Bug hunt: apply_discount(100, 0) chaqirilganda nima boʻladi?\n\ndouble apply_discount(double price, int is_member) {\ndouble discount;\nif (is_member) discount = 0.2;\nreturn price * (1 - discount);\n}",
    "o": [
     "is_member = 0 boʻlganda discount oʻzgaruvchisi ishga tushirilmagan — natija chiqindi qiymat (aniqlanmagan xatti-harakat)",
     "discount avtomatik ravishda 0.0 boʻladi",
     "funksiya 120.0 qaytaradi",
     "kompilyator kodni kompilyatsiya qilishdan bosh tortadi"
    ],
    "e": "C da standart qiymatlar yoʻq: is_member = 0 boʻlsa if tanasi bajarilmaydi va discount chiqindi qiymatni saqlab qoladi. Tuzatish: double discount = 0.0; yoki else shoxchasi."
   }
  },
  {
   "t": "stock is 500 / 200 / 40 / 3, latte needs 100 / 50 / 10 / 1. What does this print?\n\nstock_after_coffee(stock, latte);\nprintf(\"%d\\n\", stock.paper_cups);\nstock = stock_after_coffee(stock, latte);\nprintf(\"%d\\n\", stock.paper_cups);",
   "o": [
    "3, then 2",
    "2, then 2",
    "3, then 3",
    "2, then 1"
   ],
   "e": "The first call discards the returned copy (\"stock is still unchanged\"); only the assignment stock = stock_after_coffee(stock, latte); saves the new record — after it the machine holds 400 / 150 / 30 / 2.",
   "ru": {
    "t": "stock — 500 / 200 / 40 / 3, латте требует 100 / 50 / 10 / 1. Что печатает этот код?\n\nstock_after_coffee(stock, latte);\nprintf(\"%d\\n\", stock.paper_cups);\nstock = stock_after_coffee(stock, latte);\nprintf(\"%d\\n\", stock.paper_cups);",
    "o": [
     "3, затем 2",
     "2, затем 2",
     "3, затем 3",
     "2, затем 1"
    ],
    "e": "Первый вызов отбрасывает возвращённую копию («stock is still unchanged»); только присваивание stock = stock_after_coffee(stock, latte); сохраняет новую запись — после него в машине 400 / 150 / 30 / 2."
   },
   "uz": {
    "t": "stock — 500 / 200 / 40 / 3, latte uchun 100 / 50 / 10 / 1 kerak. Bu kod nima chop etadi?\n\nstock_after_coffee(stock, latte);\nprintf(\"%d\\n\", stock.paper_cups);\nstock = stock_after_coffee(stock, latte);\nprintf(\"%d\\n\", stock.paper_cups);",
    "o": [
     "3, soʻng 2",
     "2, soʻng 2",
     "3, soʻng 3",
     "2, soʻng 1"
    ],
    "e": "Birinchi chaqiruv qaytarilgan nusxani tashlab yuboradi («stock is still unchanged»); faqat stock = stock_after_coffee(stock, latte); tayinlashi yangi yozuvni saqlaydi — undan keyin mashinada 400 / 150 / 30 / 2 qoladi."
   }
  },
  {
   "t": "What does the & operator do with a variable?",
   "o": [
    "returns the variable's address in memory",
    "dereferences a pointer",
    "multiplies the variable by itself",
    "declares a pointer"
   ],
   "e": "& gives the address: int *pn = &n;. The address of a variable of type t has type t *.",
   "ru": {
    "t": "Что делает оператор & с переменной?",
    "o": [
     "возвращает адрес переменной в памяти",
     "разыменовывает указатель",
     "умножает переменную саму на себя",
     "объявляет указатель"
    ],
    "e": "& даёт адрес: int *pn = &n;. Адрес переменной типа t имеет тип t *."
   },
   "uz": {
    "t": "& operatori oʻzgaruvchi bilan nima qiladi?",
    "o": [
     "oʻzgaruvchining xotiradagi manzilini qaytaradi",
     "koʻrsatkich orqali qiymatni ochadi",
     "oʻzgaruvchini oʻziga koʻpaytiradi",
     "koʻrsatkich eʼlon qiladi"
    ],
    "e": "& manzil beradi: int *pn = &n;. t turidagi oʻzgaruvchining manzili t * turiga ega."
   }
  },
  {
   "t": "What does this fragment print?\n\nint n = 4;\ndouble pi = 3.14159;\nint *pn = &n;\ndouble *ppi = &pi;\n*ppi = *ppi + *pn;\nprintf(\"%g\\n\", pi);",
   "o": [
    "7.14159",
    "3.14159",
    "4",
    "7"
   ],
   "e": "*ppi on the left writes through the pointer, on the right it reads the value: pi becomes 3.14159 + 4 = 7.14159. A dereferenced pointer behaves like a normal variable.",
   "ru": {
    "t": "Что напечатает этот фрагмент?\n\nint n = 4;\ndouble pi = 3.14159;\nint *pn = &n;\ndouble *ppi = &pi;\n*ppi = *ppi + *pn;\nprintf(\"%g\\n\", pi);",
    "o": [
     "7.14159",
     "3.14159",
     "4",
     "7"
    ],
    "e": "*ppi слева — запись по указателю, справа — чтение значения: pi становится 3.14159 + 4 = 7.14159. Разыменованный указатель ведёт себя как обычная переменная."
   },
   "uz": {
    "t": "Bu fragment nima chop etadi?\n\nint n = 4;\ndouble pi = 3.14159;\nint *pn = &n;\ndouble *ppi = &pi;\n*ppi = *ppi + *pn;\nprintf(\"%g\\n\", pi);",
    "o": [
     "7.14159",
     "3.14159",
     "4",
     "7"
    ],
    "e": "Chapdagi *ppi koʻrsatkich orqali yozadi, oʻngdagi esa qiymatni oʻqiydi: pi 3.14159 + 4 = 7.14159 boʻladi. Ochilgan koʻrsatkich oddiy oʻzgaruvchi kabi ishlaydi."
   }
  },
  {
   "t": "What does this fragment print on a 64-bit platform?\n\nint arr[8];\nprintf(\"%zu\\n\", sizeof(arr));",
   "o": [
    "32",
    "8",
    "4",
    "64"
   ],
   "e": "For a primitive array sizeof gives the size of the whole array in bytes: 8 elements × 4 bytes = 32; long arr[5] would give 40.",
   "ru": {
    "t": "Что напечатает этот фрагмент на 64-битной платформе?\n\nint arr[8];\nprintf(\"%zu\\n\", sizeof(arr));",
    "o": [
     "32",
     "8",
     "4",
     "64"
    ],
    "e": "Для примитивного массива sizeof даёт размер всего массива в байтах: 8 элементов × 4 байта = 32; long arr[5] дал бы 40."
   },
   "uz": {
    "t": "Bu fragment 64-bitli platformada nima chop etadi?\n\nint arr[8];\nprintf(\"%zu\\n\", sizeof(arr));",
    "o": [
     "32",
     "8",
     "4",
     "64"
    ],
    "e": "Primitiv massiv uchun sizeof butun massivning baytlardagi oʻlchamini beradi: 8 element × 4 bayt = 32; long arr[5] esa 40 berardi."
   }
  },
  {
   "t": "Where do declared variables go, and where does dynamic memory come from?",
   "o": [
    "declared variables — on the stack; dynamic memory — from the heap",
    "both on the stack",
    "both from the heap",
    "declared — on the heap; dynamic — on the stack"
   ],
   "e": "Usable parts of virtual memory: the stack is where declared variables go, the heap is where dynamic memory goes.",
   "ru": {
    "t": "Куда попадают объявленные переменные и откуда берётся динамическая память?",
    "o": [
     "объявленные — в стек; динамическая память — из кучи",
     "и те и другие — в стек",
     "и те и другие — из кучи",
     "объявленные — в кучу; динамическая — в стек"
    ],
    "e": "Используемые части виртуальной памяти: стек — куда попадают объявленные переменные, куча — откуда берётся динамическая память."
   },
   "uz": {
    "t": "Eʼlon qilingan oʻzgaruvchilar qayerga tushadi va dinamik xotira qayerdan olinadi?",
    "o": [
     "eʼlon qilinganlar — stekka; dinamik xotira — kupadan",
     "ikalasi ham stekka",
     "ikalasi ham kupadan",
     "eʼlon qilinganlar — kupaga; dinamik — stekka"
    ],
    "e": "Virtual xotiraning ishlatiladigan qismlari: stek — eʼlon qilingan oʻzgaruvchilar tushadigan joy, kupa — dinamik xotira olinadigan joy."
   }
  },
  {
   "t": "strcmp(str1, str2) returns 0 when…",
   "o": [
    "the strings are equal",
    "str1 is greater than str2",
    "str1 is less than str2",
    "the strings have different lengths"
   ],
   "e": "0 — equal; positive — str1 > str2; negative — str1 < str2 (dictionary order, case-sensitive: strcmp(\"aA\", \"aA\") is 0).",
   "ru": {
    "t": "strcmp(str1, str2) возвращает 0, когда…",
    "o": [
     "строки равны",
     "str1 больше str2",
     "str1 меньше str2",
     "строки разной длины"
    ],
    "e": "0 — равны; положительное — str1 > str2; отрицательное — str1 < str2 (словарный порядок, с учётом регистра: strcmp(\"aA\", \"aA\") даёт 0)."
   },
   "uz": {
    "t": "strcmp(str1, str2) 0 qaytaradi…",
    "o": [
     "satrlar teng boʻlganda",
     "str1 str2 dan katta boʻlganda",
     "str1 str2 dan kichik boʻlganda",
     "satrlar uzunligi har xil boʻlganda"
    ],
    "e": "0 — teng; musbat — str1 > str2; manfiy — str1 < str2 (lugʻat tartibi, registrga bogʻliq: strcmp(\"aA\", \"aA\") 0 beradi)."
   }
  },
  {
   "t": "What does this program print?\n\nvoid swap(int *x, int *y) {\nint temp = *x;\n*x = *y;\n*y = temp;\n}\n/* in main: a = 5, b = 7 */\nswap(&a, &b);\nprintf(\"%d %d\\n\", a, b);",
   "o": [
    "7 5",
    "5 7",
    "7 7",
    "5 5"
   ],
   "e": "Passing &a and &b lets the function change the caller's variables through the pointers: after swap(&a, &b), a = 7 and b = 5.",
   "ru": {
    "t": "Что напечатает эта программа?\n\nvoid swap(int *x, int *y) {\nint temp = *x;\n*x = *y;\n*y = temp;\n}\n/* в main: a = 5, b = 7 */\nswap(&a, &b);\nprintf(\"%d %d\\n\", a, b);",
    "o": [
     "7 5",
     "5 7",
     "7 7",
     "5 5"
    ],
    "e": "Передача &a и &b позволяет функции менять переменные вызывающего через указатели: после swap(&a, &b) a = 7 и b = 5."
   },
   "uz": {
    "t": "Bu dastur nima chop etadi?\n\nvoid swap(int *x, int *y) {\nint temp = *x;\n*x = *y;\n*y = temp;\n}\n/* main ichida: a = 5, b = 7 */\nswap(&a, &b);\nprintf(\"%d %d\\n\", a, b);",
    "o": [
     "7 5",
     "5 7",
     "7 7",
     "5 5"
    ],
    "e": "&a va &b uzatish funksiyaga chaqiruvchining oʻzgaruvchilarini koʻrsatkichlar orqali oʻzgartirish imkonini beradi: swap(&a, &b) dan keyin a = 7, b = 5."
   }
  },
  {
   "t": "Bug hunt: what does this print?\n\nvoid swap(int a, int b) {\nint t = a;\na = b;\nb = t;\n}\nint x = 1, y = 2;\nswap(x, y);\nprintf(\"%d %d\\n\", x, y);",
   "o": [
    "1 2",
    "2 1",
    "1 1",
    "2 2"
   ],
   "e": "C passes copies by value: swap exchanges its own local copies, and main's x and y stay 1 2. The fix is swap(int *a, int *b) with the call swap(&x, &y).",
   "ru": {
    "t": "Bug hunt: что напечатает этот код?\n\nvoid swap(int a, int b) {\nint t = a;\na = b;\nb = t;\n}\nint x = 1, y = 2;\nswap(x, y);\nprintf(\"%d %d\\n\", x, y);",
    "o": [
     "1 2",
     "2 1",
     "1 1",
     "2 2"
    ],
    "e": "C передаёт копии по значению: swap меняет местами собственные локальные копии, а x и y в main остаются 1 2. Исправление — swap(int *a, int *b) и вызов swap(&x, &y)."
   },
   "uz": {
    "t": "Bug hunt: bu kod nima chop etadi?\n\nvoid swap(int a, int b) {\nint t = a;\na = b;\nb = t;\n}\nint x = 1, y = 2;\nswap(x, y);\nprintf(\"%d %d\\n\", x, y);",
    "o": [
     "1 2",
     "2 1",
     "1 1",
     "2 2"
    ],
    "e": "C qiymat boʻyicha nusxalarni uzatadi: swap oʻzining mahalliy nusxalarini almashtiradi, main dagi x va y esa 1 2 boʻlib qoladi. Tuzatish — swap(int *a, int *b) va swap(&x, &y) chaqiruvi."
   }
  },
  {
   "t": "Bug hunt: what does this print?\n\nchar a[] = \"cat\";\nchar b[] = \"cat\";\nif (a == b)\nputs(\"Same\");\nelse\nputs(\"Different\");",
   "o": [
    "Different",
    "Same",
    "Same Same",
    "a compilation error"
   ],
   "e": "== compares the addresses of the two arrays — two different objects in memory — not the characters. String contents are compared with strcmp(a, b) == 0.",
   "ru": {
    "t": "Bug hunt: что напечатает этот код?\n\nchar a[] = \"cat\";\nchar b[] = \"cat\";\nif (a == b)\nputs(\"Same\");\nelse\nputs(\"Different\");",
    "o": [
     "Different",
     "Same",
     "Same Same",
     "ошибка компиляции"
    ],
    "e": "== сравнивает адреса двух массивов — двух разных объектов в памяти, а не символы. Содержимое строк сравнивают через strcmp(a, b) == 0."
   },
   "uz": {
    "t": "Bug hunt: bu kod nima chop etadi?\n\nchar a[] = \"cat\";\nchar b[] = \"cat\";\nif (a == b)\nputs(\"Same\");\nelse\nputs(\"Different\");",
    "o": [
     "Different",
     "Same",
     "Same Same",
     "kompilyatsiya xatosi"
    ],
    "e": "== ikkita massivning manzillarini — xotiradagi ikki xil obyektni — solishtiradi, belgilarni emas. Satr tarkibi strcmp(a, b) == 0 bilan solishtiriladi."
   }
  },
  {
   "t": "Bug hunt: what is wrong here?\n\nchar *s = \"hello\";\ns[0] = 'J';\nprintf(\"%s\\n\", s);",
   "o": [
    "the string literal lives in read-only memory — writing s[0] usually crashes (segfault); the fix is char s[] = \"hello\";",
    "s is not a pointer to a string",
    "'J' must be written in double quotes",
    "printf cannot print char pointers"
   ],
   "e": "\"hello\" is stored in read-only memory; s only points to it, and the write usually causes a segmentation fault. The key's fix: char s[] = \"hello\"; — a modifiable copy that prints \"Jello\".",
   "ru": {
    "t": "Bug hunt: что здесь не так?\n\nchar *s = \"hello\";\ns[0] = 'J';\nprintf(\"%s\\n\", s);",
    "o": [
     "строковый литерал лежит в памяти только для чтения — запись s[0] обычно приводит к падению (segfault); исправление — char s[] = \"hello\";",
     "s — не указатель на строку",
     "'J' надо писать в двойных кавычках",
     "printf не может печатать указатели char"
    ],
    "e": "\"hello\" хранится в памяти только для чтения; s лишь указывает на неё, и запись обычно вызывает segmentation fault. Исправление из ключа: char s[] = \"hello\"; — изменяемая копия, которая печатает \"Jello\"."
   },
   "uz": {
    "t": "Bug hunt: bu yerda nima xato?\n\nchar *s = \"hello\";\ns[0] = 'J';\nprintf(\"%s\\n\", s);",
    "o": [
     "satr literal faqat oʻqiladigan xotirada yashaydi — s[0] yozish odatda dasturni qulatadi (segfault); tuzatish — char s[] = \"hello\";",
     "s satrga koʻrsatkich emas",
     "'J' ikki qoʻshtirnoq ichida yozilishi kerak",
     "printf char koʻrsatkichlarini chop eta olmaydi"
    ],
    "e": "\"hello\" faqat oʻqiladigan xotirada saqlanadi; s unga faqat ishora qiladi va yozish odatda segmentation fault beradi. Kalitdagi tuzatish: char s[] = \"hello\"; — \"Jello\" chop etadigan oʻzgartiriladigan nusxa."
   }
  },
  {
   "t": "Bug hunt: char dest[5]; strcpy(dest, \"hello\"); — what is wrong?",
   "o": [
    "\"hello\" needs 6 bytes (5 letters + '\\0'), so strcpy writes one byte past the array — the buffer must be at least 6",
    "strcpy cannot copy string literals",
    "dest must be a char *",
    "hello has 6 letters"
   ],
   "e": "strcpy copies the terminating '\\0' too; dest[5] holds only 5 bytes — a one-byte buffer overflow (AddressSanitizer reports a WRITE of size 6). Fix: char dest[6]; — the same +1 rule as malloc(strlen(s) + 1).",
   "ru": {
    "t": "Bug hunt: char dest[5]; strcpy(dest, \"hello\"); — что здесь не так?",
    "o": [
     "\"hello\" требует 6 байт (5 букв + '\\0'), поэтому strcpy пишет один байт за массивом — буфер должен быть минимум 6",
     "strcpy не может копировать строковые литералы",
     "dest должен быть char *",
     "в hello шесть букв"
    ],
    "e": "strcpy копирует и завершающий '\\0'; dest[5] вмещает лишь 5 байт — переполнение буфера на один байт (AddressSanitizer сообщает о записи размером 6). Исправление: char dest[6]; — то же правило +1, что и malloc(strlen(s) + 1)."
   },
   "uz": {
    "t": "Bug hunt: char dest[5]; strcpy(dest, \"hello\"); — bu yerda nima xato?",
    "o": [
     "\"hello\" 6 bayt talab qiladi (5 harf + '\\0'), shuning uchun strcpy massivdan bir bayt tashqariga yozadi — bufer kamida 6 boʻlishi kerak",
     "strcpy satr literallarini koʻchira olmaydi",
     "dest char * boʻlishi kerak",
     "hello da oltita harf bor"
    ],
    "e": "strcpy tugatuvchi '\\0' ni ham koʻchiradi; dest[5] faqat 5 bayt sigʻdiradi — bir baytli bufer toʻlib ketishi (AddressSanitizer 6 oʻlchamdagi YOZUV haqida xabar beradi). Tuzatish: char dest[6]; — malloc(strlen(s) + 1) dagidek +1 qoidasi."
   }
  },
  {
   "t": "Bug hunt: why does returning buf from this function create a dangling pointer?\n\nchar *greeting(void) {\nchar buf[20];\nstrcpy(buf, \"Hi there\");\nreturn buf;\n}",
   "o": [
    "buf lives on the function's stack frame, which disappears on return — the pointer becomes invalid",
    "buf is a string literal",
    "strcpy always returns NULL",
    "char * cannot be a return type"
   ],
   "e": "After the function returns, its stack frame is gone and the address points to dead memory (compilers warn about it). Fixes: a static array, a caller-provided buffer, or malloc'ed memory that the caller frees.",
   "ru": {
    "t": "Bug hunt: почему возврат buf из этой функции создаёт висячий указатель?\n\nchar *greeting(void) {\nchar buf[20];\nstrcpy(buf, \"Hi there\");\nreturn buf;\n}",
    "o": [
     "buf живёт на стековом кадре функции, который исчезает при возврате — указатель становится недействительным",
     "buf — строковый литерал",
     "strcpy всегда возвращает NULL",
     "char * не может быть типом возвращаемого значения"
    ],
    "e": "После возврата функции её стековый кадр исчезает, и адрес указывает на мёртвую память (компилятор предупреждает об этом). Исправления: static-массив, буфер вызывающего или память из malloc, которую освободит вызывающий."
   },
   "uz": {
    "t": "Bug hunt: bu funksiyadan buf ni qaytarish nega osilgan (dangling) koʻrsatkich yaratadi?\n\nchar *greeting(void) {\nchar buf[20];\nstrcpy(buf, \"Hi there\");\nreturn buf;\n}",
    "o": [
     "buf funksiyaning stek kadrida yashaydi, qaytishda u yoʻqoladi — koʻrsatkich yaroqsiz boʻlib qoladi",
     "buf — satr literal",
     "strcpy har doim NULL qaytaradi",
     "char * qaytarish turi boʻla olmaydi"
    ],
    "e": "Funksiya qaytgach uning stek kadri yoʻqoladi va manzil oʻlik xotiraga ishora qiladi (kompilyator buni ogohlantiradi). Tuzatishlar: static massiv, chaqiruvchi bergan bufer yoki chaqiruvchi ozod qiladigan malloc xotirasi."
   }
  },
  {
   "t": "What is the base case of a recursion?",
   "o": [
    "an answer that is produced without another recursive call",
    "the first call of the function",
    "a loop inside the function",
    "the last return from main"
   ],
   "e": "The base case answers directly (n == 0 in count_down); the other two ingredients of recursion are a smaller subproblem and progress towards the base case.",
   "ru": {
    "t": "Что такое базовый случай рекурсии?",
    "o": [
     "ответ, который получается без нового рекурсивного вызова",
     "первый вызов функции",
     "цикл внутри функции",
     "последний возврат из main"
    ],
    "e": "Базовый случай отвечает напрямую (n == 0 в count_down); другие два ингредиента рекурсии — меньшая задача и прогресс к базовому случаю."
   },
   "uz": {
    "t": "Rekursiyaning bazaviy holati nima?",
    "o": [
     "yangi rekursiv chaqiruvsiz olinadigan javob",
     "funksiyaning birinchi chaqiruvi",
     "funksiya ichidagi sikl",
     "main dan oxirgi qaytish"
    ],
    "e": "Bazaviy holat toʻgʻridan-toʻgʻri javob beradi (count_down da n == 0); rekursiyaning qolgan ikki tarkibiy qismi — kichikroq masala va bazaviy holatga progress."
   }
  },
  {
   "t": "What does count_down(3) print?\n\nvoid count_down(int n) {\nif (n == 0)\nreturn;\nprintf(\"%i\\n\", n);\ncount_down(n - 1);\n}",
   "o": [
    "3, 2, 1 — each on its own line",
    "1, 2, 3 — each on its own line",
    "3, 3, 3 — forever",
    "0, 1, 2, 3"
   ],
   "e": "The printf stands before the recursive call, so the values appear on the way down; count_down(0) returns without printing — 0 is reached but never printed.",
   "ru": {
    "t": "Что напечатает count_down(3)?\n\nvoid count_down(int n) {\nif (n == 0)\nreturn;\nprintf(\"%i\\n\", n);\ncount_down(n - 1);\n}",
    "o": [
     "3, 2, 1 — каждое на своей строке",
     "1, 2, 3 — каждое на своей строке",
     "3, 3, 3 — бесконечно",
     "0, 1, 2, 3"
    ],
    "e": "printf стоит до рекурсивного вызова, поэтому значения появляются при спуске; count_down(0) возвращается без печати — 0 достигается, но не печатается."
   },
   "uz": {
    "t": "count_down(3) nima chop etadi?\n\nvoid count_down(int n) {\nif (n == 0)\nreturn;\nprintf(\"%i\\n\", n);\ncount_down(n - 1);\n}",
    "o": [
     "3, 2, 1 — har biri alohida satrda",
     "1, 2, 3 — har biri alohida satrda",
     "3, 3, 3 — cheksiz",
     "0, 1, 2, 3"
    ],
    "e": "printf rekursiv chaqiruvdan oldin turadi, shuning uchun qiymatlar tushish yoʻlida chiqadi; count_down(0) chop etmasdan qaytadi — 0 ga erishiladi, lekin chop etilmaydi."
   }
  },
  {
   "t": "And what does count_up(3) print?\n\nvoid count_up(int n) {\nif (n == 0)\nreturn;\ncount_up(n - 1);\nprintf(\"%i\\n\", n);\n}",
   "o": [
    "1, 2, 3 — each on its own line",
    "3, 2, 1 — each on its own line",
    "0, 1, 2, 3",
    "nothing"
   ],
   "e": "Here the printf stands after the recursive call: each print waits for the smaller call to return, so the values appear in rising order on the way back up.",
   "ru": {
    "t": "А что напечатает count_up(3)?\n\nvoid count_up(int n) {\nif (n == 0)\nreturn;\ncount_up(n - 1);\nprintf(\"%i\\n\", n);\n}",
    "o": [
     "1, 2, 3 — каждое на своей строке",
     "3, 2, 1 — каждое на своей строке",
     "0, 1, 2, 3",
     "ничего"
    ],
    "e": "Здесь printf стоит после рекурсивного вызова: каждая печать ждёт возврата меньшего вызова, поэтому значения появляются по возрастанию при возврате."
   },
   "uz": {
    "t": "count_up(3) esa nima chop etadi?\n\nvoid count_up(int n) {\nif (n == 0)\nreturn;\ncount_up(n - 1);\nprintf(\"%i\\n\", n);\n}",
    "o": [
     "1, 2, 3 — har biri alohida satrda",
     "3, 2, 1 — har biri alohida satrda",
     "0, 1, 2, 3",
     "hech narsa"
    ],
    "e": "Bu yerda printf rekursiv chaqiruvdan keyin turadi: har chop etish kichik chaqiruv qaytishini kutadi, shuning uchun qiymatlar qaytish yoʻlida oʻsish tartibida chiqadi."
   }
  },
  {
   "t": "What happens if count_down calls count_down(n) instead of count_down(n - 1)?",
   "o": [
    "the input never reaches 0 — it prints 3, 3, 3, … until the stack is exhausted",
    "it still prints 3, 2, 1 correctly",
    "the compiler rejects the call",
    "it prints 3 once and stops"
   ],
   "e": "Having a base case in the code is not enough — every recursive path must make progress towards it. count_down(n) keeps the same n, so the recursion never stops (stack overflow).",
   "ru": {
    "t": "Что будет, если count_down вызывает count_down(n) вместо count_down(n - 1)?",
    "o": [
     "вход никогда не достигает 0 — печатается 3, 3, 3, … пока не исчерпается стек",
     "всё равно печатается 3, 2, 1",
     "компилятор отклоняет вызов",
     "печатается 3 один раз, и стоп"
    ],
    "e": "Наличия базового случая в коде недостаточно — каждый рекурсивный путь должен приближаться к нему. count_down(n) сохраняет тот же n, и рекурсия никогда не останавливается (переполнение стека)."
   },
   "uz": {
    "t": "count_down, count_down(n - 1) oʻrniga count_down(n) ni chaqirsa nima boʻladi?",
    "o": [
     "kirish hech qachon 0 ga yetmaydi — stek tugaguncha 3, 3, 3, … chop etiladi",
     "baribir 3, 2, 1 toʻgʻri chop etiladi",
     "kompilyator chaqiruvni rad etadi",
     "3 bir marta chop etilib toʻxtaydi"
    ],
    "e": "Kodda bazaviy holat boʻlishi yetarli emas — har bir rekursiv yoʻl unga progress qilishi kerak. count_down(n) xuddi shu n ni saqlaydi, shuning uchun rekursiya hech toʻxtamaydi (stek toʻlib ketishi)."
   }
  },
  {
   "t": "What does this print?\n\nint factorial(int n) {\nif (n == 0)\nreturn 1;\nint smaller = factorial(n - 1);\nreturn n * smaller;\n}\n/* in main: */\nprintf(\"%d\\n\", factorial(3));",
   "o": [
    "6",
    "3",
    "1",
    "0"
   ],
   "e": "Calls go 3 → 2 → 1 → 0; the base case returns 1, then the returns unwind: 1, 1, 2, 6. factorial(3) = 3 × 2 × 1 = 6, and the base 0! = 1 keeps the products from becoming zero.",
   "ru": {
    "t": "Что напечатает этот код?\n\nint factorial(int n) {\nif (n == 0)\nreturn 1;\nint smaller = factorial(n - 1);\nreturn n * smaller;\n}\n/* в main: */\nprintf(\"%d\\n\", factorial(3));",
    "o": [
     "6",
     "3",
     "1",
     "0"
    ],
    "e": "Вызовы идут 3 → 2 → 1 → 0; базовый случай возвращает 1, затем возвраты раскручиваются: 1, 1, 2, 6. factorial(3) = 3 × 2 × 1 = 6, а база 0! = 1 не даёт произведениям обнулиться."
   },
   "uz": {
    "t": "Bu kod nima chop etadi?\n\nint factorial(int n) {\nif (n == 0)\nreturn 1;\nint smaller = factorial(n - 1);\nreturn n * smaller;\n}\n/* main ichida: */\nprintf(\"%d\\n\", factorial(3));",
    "o": [
     "6",
     "3",
     "1",
     "0"
    ],
    "e": "Chaqiruvlar 3 → 2 → 1 → 0 ketadi; bazaviy holat 1 qaytaradi, soʻng qaytishlar yoyiladi: 1, 1, 2, 6. factorial(3) = 3 × 2 × 1 = 6, 0! = 1 bazasi esa koʻpaytmalarning nolga aylanishiga yoʻl qoʻymaydi."
   }
  },
  {
   "t": "What does this print?\n\nint fibonacci(int n) {\nif (n == 0) return 0;\nif (n == 1) return 1;\nint left = fibonacci(n - 1);\nint right = fibonacci(n - 2);\nreturn left + right;\n}\n/* in main: */\nprintf(\"%d\\n\", fibonacci(4));",
   "o": [
    "3",
    "4",
    "5",
    "2"
   ],
   "e": "Fibonacci: 0, 1, 1, 2, 3, 5, 8… with two base cases F(0) = 0 and F(1) = 1; F(4) = F(3) + F(2) = 2 + 1 = 3.",
   "ru": {
    "t": "Что напечатает этот код?\n\nint fibonacci(int n) {\nif (n == 0) return 0;\nif (n == 1) return 1;\nint left = fibonacci(n - 1);\nint right = fibonacci(n - 2);\nreturn left + right;\n}\n/* в main: */\nprintf(\"%d\\n\", fibonacci(4));",
    "o": [
     "3",
     "4",
     "5",
     "2"
    ],
    "e": "Фибоначчи: 0, 1, 1, 2, 3, 5, 8… с двумя базовыми случаями F(0) = 0 и F(1) = 1; F(4) = F(3) + F(2) = 2 + 1 = 3."
   },
   "uz": {
    "t": "Bu kod nima chop etadi?\n\nint fibonacci(int n) {\nif (n == 0) return 0;\nif (n == 1) return 1;\nint left = fibonacci(n - 1);\nint right = fibonacci(n - 2);\nreturn left + right;\n}\n/* main ichida: */\nprintf(\"%d\\n\", fibonacci(4));",
    "o": [
     "3",
     "4",
     "5",
     "2"
    ],
    "e": "Fibonacci: 0, 1, 1, 2, 3, 5, 8… ikkita bazaviy holat F(0) = 0 va F(1) = 1 bilan; F(4) = F(3) + F(2) = 2 + 1 = 3."
   }
  },
  {
   "t": "The call tree of fibonacci(4) contains nine calls. How many times is fibonacci(2) computed?",
   "o": [
    "twice — the same answer is computed again, because the second branch does not remember the first",
    "once — the result is cached",
    "never — fibonacci(2) is a base case",
    "four times"
   ],
   "e": "The tree runs 4, 3, 2, 1, 0, 1, 2, 1, 0: both fibonacci(2) subtrees compute the same value independently — this simple version repeats work.",
   "ru": {
    "t": "Дерево вызовов fibonacci(4) содержит девять вызовов. Сколько раз вычисляется fibonacci(2)?",
    "o": [
     "дважды — тот же ответ считается заново, потому что вторая ветвь не помнит первую",
     "один раз — результат кэшируется",
     "ни разу — fibonacci(2) — базовый случай",
     "четыре раза"
    ],
    "e": "Дерево проходит 4, 3, 2, 1, 0, 1, 2, 1, 0: оба поддерева fibonacci(2) независимо вычисляют одно и то же значение — простая версия повторяет работу."
   },
   "uz": {
    "t": "fibonacci(4) chaqiruv daraxtida toʻqqiz chaqiruv bor. fibonacci(2) necha marta hisoblanadi?",
    "o": [
     "ikki marta — ikkinchi shoxcha birinchisini eslamaganligi uchun bir xil javob qayta hisoblanadi",
     "bir marta — natija keshlanadi",
     "hech qachon — fibonacci(2) bazaviy holat",
     "toʻrt marta"
    ],
    "e": "Daraxt 4, 3, 2, 1, 0, 1, 2, 1, 0 tartibida yuradi: fibonacci(2) ning ikkala pastki daraxti bir xil qiymatni mustaqil hisoblaydi — bu oddiy versiya ishni takrorlaydi."
   }
  },
  {
   "t": "Tower of Hanoi: moving all 3 disks from peg A to peg C (using B) takes how many moves?",
   "o": [
    "7 (3 + 1 + 3)",
    "3",
    "6",
    "9"
   ],
   "e": "Recursively: move 2 disks A→B (3 moves), move disk 3 A→C (1 move), move 2 disks B→C (3 moves) — 7 in total. Base case: no disks — no moves.",
   "ru": {
    "t": "Ханойская башня: перенос всех 3 дисков со стержня A на стержень C (через B) требует сколько ходов?",
    "o": [
     "7 (3 + 1 + 3)",
     "3",
     "6",
     "9"
    ],
    "e": "Рекурсивно: перенести 2 диска A→B (3 хода), диск 3 A→C (1 ход), 2 диска B→C (3 хода) — итого 7. Базовый случай: нет дисков — нет ходов."
   },
   "uz": {
    "t": "Xanoy minorasi: barcha 3 diskni A tigʻidan C tigʻiga (B orqali) koʻchirish necha yurish talab qiladi?",
    "o": [
     "7 (3 + 1 + 3)",
     "3",
     "6",
     "9"
    ],
    "e": "Rekursiv ravishda: 2 diskni A→B (3 yurish), 3-diskni A→C (1 yurish), 2 diskni B→C (3 yurish) — jami 7. Bazaviy holat: disk yoʻq — yurish yoʻq."
   }
  }
 ]
};
