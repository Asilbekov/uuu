# -*- coding: utf-8 -*-
"""Texts for the six ITE Weeks 5-7 study-guide diagrams (RU / EN / UZ).

All content is grounded in the guide's own text (Introduction to Engineering —
Weeks 5-7: Problem Framing and Modelling II, Quantitative Reasoning I-II).
UZ follows the guide's own terminology: talab/quvvat/utilizatsiya,
kirishlar/parametrlar/bog'lanishlar/chiqishlar, o'lcham cho'qqiga qarab.
Decimal commas in RU/UZ, points in EN. Units: кВт·ч / kWh / kVt·soat.
"""

KICKER = {
    'ru': 'Неделя 5 · Постановка проблемы и моделирование II',
    'en': 'Week 5 · Problem Framing and Modelling II',
    'uz': "5-hafta · Muammo qo'yish va modellashtirish II",
}
KICKER6 = {
    'ru': 'Неделя 6 · Количественные рассуждения I',
    'en': 'Week 6 · Quantitative Reasoning I',
    'uz': "6-hafta · Miqdoriy mushohada I",
}
KICKER7 = {
    'ru': 'Неделя 7 · Количественные рассуждения II',
    'en': 'Week 7 · Quantitative Reasoning II',
    'uz': "7-hafta · Miqdoriy mushohada II",
}

T = {}

# ---------------------------------------------------------------- figure 1
T['f1'] = {
 'ru': {
  'kicker': KICKER['ru'],
  'title': 'Анатомия модели: четыре части',
  'subtitle': 'Модель — это машина: числа входят, применяется правило, числа выходят. '
              'Каждое число нуждается в своих единицах.',
  'in_h': 'ВХОДЫ · inputs', 'in_d': 'что мы подаём: значения, которые выбираем или можем менять',
  'in_role': 'design-переменные недели 4 → входы',
  'in_chips': ['ёмкость батареи C = 200 кВт·ч', 'число автобусов', 'скорость'],
  'pa_h': 'ПАРАМЕТРЫ · parameters', 'pa_d': 'что держим фиксированным: числа, описывающие систему и её условия',
  'pa_role': 'context-переменные → параметры',
  'pa_chips': ['расход e = 1,2 кВт·ч/км', 'используемая доля u = 0,8', 'длина маршрута 96 км'],
  're_h': 'ЗАВИСИМОСТИ · relationships', 're_d': 'правила: уравнения или шаги, связывающие числа',
  're_formulas': ['E = e × d [кВт·ч]', 'R = (u × C) ÷ e [км]', 'R = 160 ÷ 1,2 ≈ 133 км'],
  'ou_h': 'ВЫХОДЫ · outputs', 'ou_d': 'что модель предсказывает: результаты, которые мы оцениваем',
  'ou_role': 'performance-переменные → выходы',
  'ou_chips': ['запас хода R ≈ 133 км', 'энергия в день, кВт·ч/день'],
  'bottom': 'Модель — целенаправленное упрощение: она что-то оставляет для вопроса, что-то '
            'отбрасывает и всегда имеет цель. Список переменных прошлой недели — уже скелет '
            'модели этой недели.',
 },
 'en': {
  'kicker': KICKER['en'],
  'title': 'Anatomy of a model: four parts',
  'subtitle': 'A model is a machine: numbers go in, a rule is applied, numbers come out. '
              'Every number needs its units.',
  'in_h': 'INPUTS', 'in_d': 'what we feed in: values we choose or can change',
  'in_role': 'week-4 design variables → inputs',
  'in_chips': ['battery capacity C = 200 kWh', 'number of buses', 'speed'],
  'pa_h': 'PARAMETERS', 'pa_d': 'what we hold fixed: numbers describing the system and its conditions',
  'pa_role': 'context variables → parameters',
  'pa_chips': ['consumption e = 1.2 kWh/km', 'usable fraction u = 0.8', 'route length 96 km'],
  're_h': 'RELATIONSHIPS', 're_d': 'the rules: equations or steps linking the numbers',
  're_formulas': ['E = e × d [kWh]', 'R = (u × C) ÷ e [km]', 'R = 160 ÷ 1.2 ≈ 133 km'],
  'ou_h': 'OUTPUTS', 'ou_d': 'what the model predicts: the results we assess',
  'ou_role': 'performance variables → outputs',
  'ou_chips': ['range R ≈ 133 km', 'energy per day, kWh/day'],
  'bottom': 'A model is a purposeful simplification: it keeps some things for the question, '
            'discards others, and always has a goal. Last week’s variable list is already the '
            'skeleton of this week’s model.',
 },
 'uz': {
  'kicker': KICKER['uz'],
  'title': "Model anatomiyasi: to'rt qism",
  'subtitle': "Model — mashina: sonlar kiradi, qoida qo'llanadi, sonlar chiqadi. "
              "Har bir son o'z birligiga muhtoj.",
  'in_h': "KIRISHLAR · inputs", 'in_d': "nimani beramiz: tanlaydigan yoki o'zgartira oladigan qiymatlar",
  'in_role': "4-hafta design-o'zgaruvchilari → kirishlar",
  'in_chips': ["batareya sig'imi C = 200 kVt·soat", "avtobuslar soni", "tezlik"],
  'pa_h': "PARAMETRLAR · parameters", 'pa_d': "qat'iy tutashtiramiz: tizim va sharoitlarni tavsiflovchi sonlar",
  'pa_role': "context-o'zgaruvchilar → parametrlar",
  'pa_chips': ["sarflash e = 1,2 kVt·soat/km", "ishlatiladigan ulush u = 0,8", "marshrut uzunligi 96 km"],
  're_h': "BOG'LANISHLAR · relationships", 're_d': "qoidalar: sonlarni bog'lovchi tenglamalar yoki qadamlar",
  're_formulas': ['E = e × d [kVt·soat]', 'R = (u × C) ÷ e [km]', 'R = 160 ÷ 1,2 ≈ 133 km'],
  'ou_h': "CHIQISHLAR · outputs", 'ou_d': "model bashorat qiladi: baholaydigan natijalar",
  'ou_role': "performance-o'zgaruvchilar → chiqishlar",
  'ou_chips': ["yurish zaxirasi R ≈ 133 km", "bir kungi energiya, kVt·soat/kun"],
  'bottom': "Model — maqsadli soddalashtirish: savol uchun nimadirni saqlaydi, nimadirni "
            "tashlab yuboradi va doimo maqsadga ega. O'tgan haftaning o'zgaruvchilar "
            "ro'yxati — shu hafta modelining skeleti.",
 },
}

# ---------------------------------------------------------------- figure 2
T['f2'] = {
 'ru': {
  'kicker': KICKER['ru'],
  'title': 'Модель электрического автобуса: числа и допущения',
  'chain': [('C = 200 кВт·ч', 'ёмкость'), ('× u = 0,8', 'используемая доля'),
            ('= 160 кВт·ч', 'используемая энергия'), ('÷ e = 1,2 кВт·ч/км', 'расход на км'),
            ('R ≈ 133 км', 'запас хода')],
  'day': 'День: 8 кругов × 12 км = 96 км → запас ≈ 37 км',
  'q': 'Но насколько можно доверять 133 км? Это зависит от допущений.',
  'cards': [
    ('Упрощающие · simplifying', 'что мы игнорируем: холмы, светофоры, остановки, различия между водителями', 'blue'),
    ('Данные · data', 'что мы фиксируем: e = 1,2 кВт·ч/км · C = 200 кВт·ч · u = 0,8', 'gold'),
    ('Граничные · boundary', 'что оставляем снаружи: пассажиры, зарядное устройство и сеть; в модели только автобус', 'sienna')],
  'tpl_h': 'Шаблон курса для записи допущения',
  'tpl': '«We assume [допущение] because [причина]. If it is wrong, [влияние на результат]»',
  'tpl_ex': 'Мы предполагаем 1,2 кВт·ч/км во все сезоны, потому что есть только осенние тестовые '
            'данные. Если это неверно, зимний запас хода может упасть ниже дневной потребности 96 км.',
  'bottom': 'Записанное допущение можно проверить; скрытое — нельзя. Ни одно из скрытых '
            'допущений не написано в уравнении.',
 },
 'en': {
  'kicker': KICKER['en'],
  'title': 'The electric-bus model: numbers and assumptions',
  'chain': [('C = 200 kWh', 'capacity'), ('× u = 0.8', 'usable fraction'),
            ('= 160 kWh', 'usable energy'), ('÷ e = 1.2 kWh/km', 'per-km use'),
            ('R ≈ 133 km', 'range')],
  'day': 'Day: 8 laps × 12 km = 96 km → margin ≈ 37 km',
  'q': 'But how far can 133 km be trusted? It depends on the assumptions.',
  'cards': [
    ('Simplifying', 'what we ignore: hills, traffic lights, stops, differences between drivers', 'blue'),
    ('Data', 'what we fix: e = 1.2 kWh/km · C = 200 kWh · u = 0.8', 'gold'),
    ('Boundary', 'what we leave outside: passengers, the charger and the grid; the model holds only the bus', 'sienna')],
  'tpl_h': 'The course template for writing an assumption',
  'tpl': '“We assume [assumption] because [reason]. If it is wrong, [effect on the result]”',
  'tpl_ex': 'We assume 1.2 kWh/km in every season because we only have autumn test data. '
            'If it is wrong, the winter range may fall below the daily need of 96 km.',
  'bottom': 'A written assumption can be checked; a hidden one cannot. None of the hidden '
            'assumptions is written in the equation.',
 },
 'uz': {
  'kicker': KICKER['uz'],
  'title': "Elektr avtobusi modeli: sonlar va taxminlar",
  'chain': [('C = 200 kVt·soat', 'sig\'im'), ('× u = 0,8', 'ishlatiladigan ulush'),
            ('= 160 kVt·soat', 'ishlatiladigan energiya'), ('÷ e = 1,2 kVt·soat/km', 'km ga sarflash'),
            ('R ≈ 133 km', 'yurish zaxirasi')],
  'day': "Kun: 8 aylana × 12 km = 96 km → zaxira ≈ 37 km",
  'q': "Lekin 133 km ga qanchalik ishonsa bo'ladi? Bu taxminlarga bog'liq.",
  'cards': [
    ("Soddalashtiruvchi · simplifying", "e'tiborsiz qoldiramiz: tepaliklar, svetoforlar, to'xtovlar, haydovchilar farqi", 'blue'),
    ("Ma'lumot · data", "belgilab qo'yamiz: e = 1,2 kVt·soat/km · C = 200 kVt·soat · u = 0,8", 'gold'),
    ("Chegaraviy · boundary", "tashqarida qoldiramiz: yo'lovchilar, zaryadlash qurilmasi va tarmoq; modelda faqat avtobus", 'sienna')],
  'tpl_h': "Taxminni yozish uchun kurs shabloni",
  'tpl': "«[Taxmin]ni [sabab] uchun shunday deb taxmin qilamiz. Agar bu noto'g'ri bo'lsa, [natijaga ta'siri]»",
  'tpl_ex': "Har mavsumda 1,2 kVt·soat/km deb taxmin qilamiz, chunki faqat kuzgi sinov "
            "ma'lumotlari bor. Agar bu noto'g'ri bo'lsa, qishki yurish zaxirasi kunlik "
            "96 km ehtiyojdan pastga tushishi mumkin.",
  'bottom': "Yozilgan taxminni tekshirish mumkin; yashirinini — yo'q. Yashirin taxminlarning "
            "hech biri tenglamada yozilmagan.",
 },
}

# ---------------------------------------------------------------- figure 3
T['f3'] = {
 'ru': {
  'kicker': KICKER6['ru'],
  'title': 'Спрос и мощность: утилизация',
  'subtitle': 'Спрос — что система должна выдать; мощность — максимум, который она может. '
              'Одна единица и одна временная база с обеих сторон.',
  'formula': 'Утилизация = спрос ÷ мощность (те же единицы, та же временная база)',
  'rows': [
    ('Здание факультета, пик 13:00', 'спрос 180 кВт', 'мощность 250 кВт', '0,72', 'комфортно', 'ok'),
    ('Столовая в обед', '360 обедающих/час', '400 обедов/час', '0,90', 'напряжённо', 'tight'),
    ('Кампусный автобус в пик', '300 хотят ехать/час', '240 мест (40 × 6)/час', '1,25', 'перегрузка', 'over'),
    ('Депо: шесть зарядников', '360 кВт', '200 кВт подключения', '1,80', 'перегрузка', 'over')],
  'scale_marks': [('0,72', 0.72), ('0,90', 0.90), ('1,25', 1.25), ('1,80', 1.80)],
  'zones': [('ниже 0,8 — комфортно: запас поглотить вариации', 'ok'),
            ('0,8–1,0 — напряжённо: малый запас, задержки', 'tight'),
            ('выше 1,0 — перегрузка: спрос отвергается или растёт очередь', 'over')],
  'bottom': 'Размер под пик, а не под среднее: среднее прячет пик. Здание факультета: среднее '
            '94 кВт, пик 180 кВт в 13:00, трансформатор 250 кВт — система, рассчитанная на '
            'среднее, отказала бы в полдень.',
 },
 'en': {
  'kicker': KICKER6['en'],
  'title': 'Demand and capacity: utilisation',
  'subtitle': 'Demand — what the system must deliver; capacity — the maximum it can. '
              'One unit and one time basis on both sides.',
  'formula': 'Utilisation = Demand ÷ Capacity (the same units, the same time basis)',
  'rows': [
    ('Faculty building, peak 13:00', 'demand 180 kW', 'capacity 250 kW', '0.72', 'comfortable', 'ok'),
    ('Cafeteria at lunch', '360 diners/hour', '400 meals/hour', '0.90', 'tight', 'tight'),
    ('Campus bus at peak', '300 want to ride/hour', '240 seats (40 × 6)/hour', '1.25', 'overloaded', 'over'),
    ('Depot: six chargers', '360 kW', '200 kW connection', '1.80', 'overloaded', 'over')],
  'scale_marks': [('0.72', 0.72), ('0.90', 0.90), ('1.25', 1.25), ('1.80', 1.80)],
  'zones': [('below 0.8 — comfortable: margin to absorb variation', 'ok'),
            ('0.8–1.0 — tight: little margin, delays appear', 'tight'),
            ('above 1.0 — overloaded: demand is refused or the queue grows', 'over')],
  'bottom': 'Size for the peak, not for the average: the average hides the peak. Faculty '
            'building: mean 94 kW, peak 180 kW at 13:00, transformer 250 kW — a system sized '
            'for the average would fail at midday.',
 },
 'uz': {
  'kicker': KICKER6['uz'],
  'title': 'Talab va quvvat: utilizatsiya',
  'subtitle': "Talab — tizim yetkazishi kerak bo'lgan narsa; quvvat — bera oladigan "
              "maksimumi. Ikkala tomonda bitta birlik va bitta vaqt asosi.",
  'formula': 'Utilizatsiya = talab ÷ quvvat (bir xil birlik, bir xil vaqt asosi)',
  'rows': [
    ("Fakultet binosi, cho'qqi 13:00", 'talab 180 kVt', 'quvvat 250 kVt', '0,72', 'qulay', 'ok'),
    ("Oshxona tushda", '360 kishi/soat', '400 ovqat/soat', '0,90', 'tarang', 'tight'),
    ("Kampus avtobusi cho'qqida", "300 yo'lovchi/soat", '240 joy (40 × 6)/soat', '1,25', 'ortiqcha yuklanish', 'over'),
    ("Depo: oltita zaryadlagich", '360 kVt', '200 kVt ulanish', '1,80', 'ortiqcha yuklanish', 'over')],
  'scale_marks': [('0,72', 0.72), ('0,90', 0.90), ('1,25', 1.25), ('1,80', 1.80)],
  'zones': [("0,8 dan past — qulay: variatsiyalarga zaxira", 'ok'),
            ("0,8–1,0 — tarang: zaxira kam, kechikishlar paydo bo'ladi", 'tight'),
            ("1,0 dan yuqori — ortiqcha yuklanish: talab rad etiladi yoki navbat o'sadi", 'over')],
  'bottom': "O'lcham cho'qqiga qarab oling, o'rtachaga emas: o'rtacha cho'qqini yashiradi. "
            "Fakultet binosi: o'rtacha 94 kVt, cho'qqi 180 kVt (13:00), transformer 250 kVt — "
            "o'rtachaga o'lchangan tizim tush paytida ishdan chiqardi.",
 },
}

# ---------------------------------------------------------------- figure 4
T['f4'] = {
 'ru': {
  'kicker': KICKER6['ru'],
  'title': 'Крючок недели: энергия или мощность?',
  'setup': '6 автобусов × 115 кВт·ч к 06:00 · окно 22:00–06:00 = 8 ч · подключение 200 кВт. '
           'Энергия: 6 × 115 = 690 кВт·ч → средняя мощность 690 ÷ 8 ≈ 86 кВт.',
  'pa_h': 'Все шесть сразу — 22:00',
  'pa_stat': '6 × 60 = 360 кВт против 200 кВт → утилизация 1,8 — перегрузка',
  'pa_note': 'Подключение не выдерживает: перегрузка +160 кВт над линией 200 кВт.',
  'pb_h': 'Две партии по три',
  'pb_stat': '3 × 60 = 180 кВт ≤ 200 кВт → утилизация 0,9 — напряжённо, но внутри окна',
  'pb_note': 'Время: 2 × 1,9 ≈ 3,8 ч — готово к ≈ 02:00, до 06:00 запас больше 4 часов.',
  'cap': 'подключение 200 кВт',
  'tl': ['22:00', '00:00', '02:00', '04:00', '06:00'],
  'kw': 'кВт',
  'quote': '«Энергия никогда не была проблемой. Проблемой была мощность — и сдвиг зарядки '
           'её решает» — “Energy was never the problem. Power was, and staggering the '
           'charging solves it.”',
 },
 'en': {
  'kicker': KICKER6['en'],
  'title': 'The week’s hook: energy or power?',
  'setup': '6 buses × 115 kWh by 06:00 · window 22:00–06:00 = 8 h · a 200 kW connection. '
           'Energy: 6 × 115 = 690 kWh → average power 690 ÷ 8 ≈ 86 kW.',
  'pa_h': 'All six at once — 22:00',
  'pa_stat': '6 × 60 = 360 kW against 200 kW → utilisation 1.8 — overloaded',
  'pa_note': 'The connection cannot take it: +160 kW above the 200 kW line.',
  'pb_h': 'Two batches of three',
  'pb_stat': '3 × 60 = 180 kW ≤ 200 kW → utilisation 0.9 — tight, but inside the window',
  'pb_note': 'Time: 2 × 1.9 ≈ 3.8 h — done by ≈ 02:00, over 4 hours of margin before 06:00.',
  'cap': 'connection 200 kW',
  'tl': ['22:00', '00:00', '02:00', '04:00', '06:00'],
  'kw': 'kW',
  'quote': '“Energy was never the problem. Power was, and staggering the charging solves it.”',
 },
 'uz': {
  'kicker': KICKER6['uz'],
  'title': "Hafta iligi: energiya yoki quvvat?",
  'setup': "6 avtobus × 115 kVt·soat, 06:00 ga · oyna 22:00–06:00 = 8 soat · 200 kVt ulanish. "
           "Energiya: 6 × 115 = 690 kVt·soat → o'rtacha quvvat 690 ÷ 8 ≈ 86 kVt.",
  'pa_h': "Hammasi birdan — 22:00",
  'pa_stat': "6 × 60 = 360 kVt, 200 kVt ga qarshi → utilizatsiya 1,8 — ortiqcha yuklanish",
  'pa_note': "Ulanish chidamaydi: 200 kVt chizig'idan +160 kVt yuqorida.",
  'pb_h': "Uchtadan ikki partiya",
  'pb_stat': "3 × 60 = 180 kVt ≤ 200 kVt → utilizatsiya 0,9 — tarang, lekin oyna ichida",
  'pb_note': "Vaqt: 2 × 1,9 ≈ 3,8 soat — ≈ 02:00 ga tayyor, 06:00 gacha 4 soatdan ko'p zaxira.",
  'cap': "ulanish 200 kVt",
  'tl': ['22:00', '00:00', '02:00', '04:00', '06:00'],
  'kw': 'kVt',
  'quote': "«Energiya hech qachon muammo bo'lmagan — muammo quvvat edi, va zaryadlashni "
           "partiyalarga bo'lib surish uni hal qiladi».",
 },
}

# ---------------------------------------------------------------- figure 5
T['f5'] = {
 'ru': {
  'kicker': KICKER7['ru'],
  'title': 'От трёх поездок к честному отчёту',
  'chips': ['три летние поездки: 1,1 / 1,3 / 1,6 кВт·ч/км (n = 3)',
            'mean = 1,33 · median = 1,3 кВт·ч/км — пишите n рядом с каждым числом'],
  'sum_bar': ('Лето · измерено, n = 3',
              'e = 1,1 / 1,3 / 1,6 кВт·ч/км → R = 145 / 123 / 100 км — все случаи покрывают дневные 96 км; '
              'высокорасходный — только с запасом 4 км', 'good'),
  'win_bar': ('Зима · зимнего теста нет',
              'e = 1,5 / 1,8 / 2,0 — оценка по аналогии «лето + отопление», низкое доверие '
              '→ R = 107 / 89 / 80 км — проходит только оптимистичный случай', 'bad'),
  'ticks_sum': ['145', '123', '100'],
  'ticks_win': ['107', '89', '80'],
  'axis': 'запас хода R, км',
  'marker': 'дневная потребность 96 км',
  'report_h': 'Честный отчёт: четыре элемента',
  'report': [
    ('RESULT', '«вероятно, нет: 89 км против 96 км»', 'sienna'),
    ('RANGE', '80–107 км — не одно значение', 'blue'),
    ('TOP ASSUMPTION', 'зимний расход 1,8 кВт·ч/км — низкое доверие', 'gold'),
    ('WHAT WOULD CHANGE IT', 'один реальный зимний рейс или дневная подзарядка', 'green')],
  'bottom': 'Низкая уверенность идёт на страницу: сокрытие её не убирает. Диапазон '
            'сообщает читателю, насколько доверять ответу.',
 },
 'en': {
  'kicker': KICKER7['en'],
  'title': 'From three test drives to an honest report',
  'chips': ['three summer test drives: 1.1 / 1.3 / 1.6 kWh/km (n = 3)',
            'mean = 1.33 · median = 1.3 kWh/km — report n next to every number'],
  'sum_bar': ('Summer · measured, n = 3',
              'e = 1.1 / 1.3 / 1.6 kWh/km → R = 145 / 123 / 100 km — every case covers the daily '
              '96 km; the high-use case only by 4 km', 'good'),
  'win_bar': ('Winter · no winter test',
              'e = 1.5 / 1.8 / 2.0 — analogy estimate “summer + heating”, low confidence '
              '→ R = 107 / 89 / 80 km — only the optimistic case passes', 'bad'),
  'ticks_sum': ['145', '123', '100'],
  'ticks_win': ['107', '89', '80'],
  'axis': 'range R, km',
  'marker': 'daily need 96 km',
  'report_h': 'The honest report: four elements',
  'report': [
    ('RESULT', '“probably no: 89 km against 96 km”', 'sienna'),
    ('RANGE', '80–107 km — not a single value', 'blue'),
    ('TOP ASSUMPTION', 'winter use 1.8 kWh/km — low confidence', 'gold'),
    ('WHAT WOULD CHANGE IT', 'one real winter run, or daytime top-up charging', 'green')],
  'bottom': 'Low confidence goes on the page: hiding it does not remove it. The range '
            'tells the reader how far to trust the answer.',
 },
 'uz': {
  'kicker': KICKER7['uz'],
  'title': "Uchta sinov safaridan halol hisobotgacha",
  'chips': ["uchta yozgi sinov safari: 1,1 / 1,3 / 1,6 kVt·soat/km (n = 3)",
            "mean = 1,33 · median = 1,3 kVt·soat/km — har bir son yoniga n yozing"],
  'sum_bar': ("Yoz · o'lchangan, n = 3",
              "e = 1,1 / 1,3 / 1,6 kVt·soat/km → R = 145 / 123 / 100 km — hamma holat kunlik "
              "96 km ni qoplaydi; yuqori sarflashli holat — atigi 4 km zaxira bilan", 'good'),
  'win_bar': ("Qish · qishki sinov yo'q",
              "e = 1,5 / 1,8 / 2,0 — «yoz + isitish» analogiya bahosi, past ishonch "
              "→ R = 107 / 89 / 80 km — faqat optimistik holat o'tadi", 'bad'),
  'ticks_sum': ['145', '123', '100'],
  'ticks_win': ['107', '89', '80'],
  'axis': "yurish zaxirasi R, km",
  'marker': "kunlik ehtiyoj 96 km",
  'report_h': "Halol hisobot: to'rt element",
  'report': [
    ('RESULT', "«ehtimol yo'q: 89 km, 96 km ga qarshi»", 'sienna'),
    ('RANGE', "80–107 km — bitta qiymat emas", 'blue'),
    ('TOP ASSUMPTION', "qishki sarflash 1,8 kVt·soat/km — past ishonch", 'gold'),
    ('WHAT WOULD CHANGE IT', "bitta haqiqiy qishki reys yoki kunduzgi qo'shimcha zaryad", 'green')],
  'bottom': "Past ishonch hisobotga yoziladi: uni yashirish yo'qolib ketirmaydi. Diapazon "
            "o'quvchiga javobga qanchalik ishonish kerakligini aytadi.",
 },
}

# ---------------------------------------------------------------- figure 6
T['f6'] = {
 'ru': {
  'kicker': KICKER7['ru'],
  'title': 'Метрика выбирается решением',
  'subtitle': 'Одни данные — разные прочтения: распределение времени ожидания на остановке '
              '(доля пассажиров, %).',
  'bars': [('0–2', 14), ('2–4', 26), ('4–6', 22), ('6–8', 12), ('8–10', 7),
           ('10–12', 4), ('12–14', 8), ('14–16', 7)],
  'ann': '7% + 8% = 15% — каждый седьмой ждёт больше 12 минут',
  'axisx': 'время ожидания, мин',
  'axisy': '% пассажиров',
  'readings': [
    ('Диспетчер', '«Среднее ожидание 6 минут. Хорошо»', 'blue'),
    ('Пассажир', '«Каждый седьший из нас ждёт больше 12 минут»', 'sienna'),
    ('Администратор', '«Сокращение долгих ожиданий требует больше автобусов. Сколько это стоит?»', 'gold')],
  'metrics': [
    ('медиана ≈ 5 мин', 'сколько ждёт типичный пассажир'),
    ('среднее ≈ 6 мин', 'сколько всего ожидания'),
    ('90-й перцентиль ≈ 13 мин', 'насколько плохо неудачливым'),
    ('максимум ≈ 16 мин', 'худший случай')],
  'bottom': 'Решение выбирает метрику, а не наоборот: у пары кВт·ч/кВт та же логика — '
             '«сколько?» против «как быстро?».',
 },
 'en': {
  'kicker': KICKER7['en'],
  'title': 'The decision chooses the metric',
  'subtitle': 'One set of data — different readings: the distribution of waiting times at '
              'the stop (share of passengers, %).',
  'bars': [('0–2', 14), ('2–4', 26), ('4–6', 22), ('6–8', 12), ('8–10', 7),
           ('10–12', 4), ('12–14', 8), ('14–16', 7)],
  'ann': '7% + 8% = 15% — every seventh passenger waits more than 12 minutes',
  'axisx': 'waiting time, min',
  'axisy': '% of passengers',
  'readings': [
    ('Dispatcher', '“Average wait 6 minutes. Fine.”', 'blue'),
    ('Passenger', '“Every seventh of us waits more than 12 minutes.”', 'sienna'),
    ('Administrator', '“Cutting long waits needs more buses. What does that cost?”', 'gold')],
  'metrics': [
    ('median ≈ 5 min', 'the typical passenger’s wait'),
    ('mean ≈ 6 min', 'the total waiting'),
    ('90th percentile ≈ 13 min', 'how bad for the unlucky'),
    ('maximum ≈ 16 min', 'the worst case')],
  'bottom': 'The decision chooses the metric, not the other way round — the same pair as '
            'kWh vs kW: “how much?” against “how fast?”.',
 },
 'uz': {
  'kicker': KICKER7['uz'],
  'title': "Qaror metrikani tanlaydi",
  'subtitle': "Bitta ma'lumot — turli o'qishlar: to'xtashdagi kutish vaqti taqsimoti "
              "(yo'lovchilar ulushi, %).",
  'bars': [('0–2', 14), ('2–4', 26), ('4–6', 22), ('6–8', 12), ('8–10', 7),
           ('10–12', 4), ('12–14', 8), ('14–16', 7)],
  'ann': "7% + 8% = 15% — har yettinchidan biri 12 daqiqadan ko'p kutadi",
  'axisx': "kutish vaqti, daqiqa",
  'axisy': "yo'lovchilar, %",
  'readings': [
    ('Dispetcher', "«O'rtacha kutish 6 daqiqa. Yaxshi»", 'blue'),
    ('Yo\'lovchi', "«Har yettinchimiz 12 daqiqadan ko'p kutadi»", 'sienna'),
    ('Administrator', "«Uzun kutishlarni qisqartirish ko'proq avtobus talab qiladi. Bu qancha turadi?»", 'gold')],
  'metrics': [
    ('median ≈ 5 daqiqa', "tipik yo'lovchi qancha kutadi"),
    ("o'rtacha ≈ 6 daqiqa", "jami kutish qancha"),
    ("90-fоiz ≈ 13 daqiqa", "omadsizlarga qancha og'ir"),
    ('maksimum ≈ 16 daqiqa', "eng yomon holat")],
  'bottom': "Qaror metrikani tanlaydi, aksincha emas — kVt·soat/kVt juftligidagi xuddi shu "
            "mantiq: «qancha?» ga qarshi «qancha tez?».",
 },
}

# ---------------------------------------------------------------- captions
CAPTIONS = {
 'ru': ['Рис. 1. Анатомия модели (неделя 5): входы, параметры, зависимости и выходы — '
        'четыре части модели; переменные недели 4 в ролях модели.',
        'Рис. 2. Модель электрического автобуса (неделя 5): числа 160 кВт·ч / 133 км / '
        '96 км, три вида допущений и шаблон их записи.',
        'Рис. 3. Спрос и мощность (неделя 6): утилизация = спрос ÷ мощность в четырёх '
        'системах лекции; размер под пик, а не под среднее.',
        'Рис. 4. Шесть автобусов, одно подключение 200 кВт (неделя 6): энергия 690 кВт·ч '
        'никогда не была проблемой — проблемой была мощность; две партии по три решают её.',
        'Рис. 5. Диапазоны и честный отчёт (неделя 7): от трёх летних поездок и зимнего '
        'пробела к отчёту RESULT · RANGE · TOP ASSUMPTION · WHAT WOULD CHANGE IT.',
        'Рис. 6. Метрика выбирается решением (неделя 7): одно распределение времени '
        'ожидания — три прочтения и четыре метрики.'],
 'en': ['Fig. 1. Anatomy of a model (week 5): inputs, parameters, relationships and '
        'outputs — the four parts of a model, with week-4 variables in their model roles.',
        'Fig. 2. The electric-bus model (week 5): the numbers 160 kWh / 133 km / 96 km, '
        'the three kinds of assumptions and the writing template.',
        'Fig. 3. Demand and capacity (week 6): utilisation = demand ÷ capacity in the four '
        'lecture systems; size for the peak, not for the average.',
        'Fig. 4. Six buses, one 200 kW connection (week 6): the 690 kWh of energy was never '
        'the problem — power was; two batches of three solve it.',
        'Fig. 5. Ranges and the honest report (week 7): from three summer test drives and '
        'the winter gap to the RESULT · RANGE · TOP ASSUMPTION · WHAT WOULD CHANGE IT report.',
        'Fig. 6. The decision chooses the metric (week 7): one waiting-time distribution — '
        'three readings and four metrics.'],
 'uz': ["1-rasm. Model anatomiyasi (5-hafta): kirishlar, parametrlar, bog'lanishlar va "
        "chiqishlar — modelning to'rt qismi; 4-hafta o'zgaruvchilari model rollarida.",
        "2-rasm. Elektr avtobusi modeli (5-hafta): 160 kVt·soat / 133 km / 96 km sonlari, "
        "uch turdagi taxmin va yozish shabloni.",
        "3-rasm. Talab va quvvat (6-hafta): to'rt tizimda utilizatsiya = talab ÷ quvvat; "
        "o'lcham cho'qqiga qarab, o'rtachaga emas.",
        "4-rasm. Oltita avtobus, bitta 200 kVt ulanish (6-hafta): 690 kVt·soat energiya "
        "hech qachon muammo bo'lmagan — muammo quvvat edi; uchtadan ikki partiya uni hal qiladi.",
        "5-rasm. Diapazonlar va halol hisobot (7-hafta): uchta yozgi sinov safaridan va "
        "qishki bo'shlig'idan RESULT · RANGE · TOP ASSUMPTION · WHAT WOULD CHANGE IT hisobotigacha.",
        "6-rasm. Qaror metrikani tanlaydi (7-hafta): bitta kutish vaqti taqsimoti — uchta "
        "o'qish va to'rtta metrika."],
}
