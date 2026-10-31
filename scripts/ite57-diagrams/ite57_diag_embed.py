#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Diagram overlay for the ITE Weeks 5-7 test (applied on top of build_ite_test.py):
- prepends ![Diagram: ...](/ite-diagrams/tNN_*.png) to 15 questions (EN+RU+UZ),
  with lead-ins rewritten to reference each diagram, exactly like the Weeks 1-4
  test (commit 5935d5e);
- inserts 2 image-option questions (four data-problem cards) after the
  «datasheet states 200» question, mirroring the PFD symbol questions.
apply_overlay(data) mutates the parsed weeks57_ite.cjs structure in place.
"""

D = "/ite-diagrams/"

# original question number (1-based, before insertion) -> (file, alt, en, ru, uz)
EMBEDS = {
 4: ("t13_modeltypes.png", "Diagram: the four kinds of models",
     "The diagram shows the four kinds of models from Lecture 5, each with its campus-grid example. The wind-turbine blade tested in a wind tunnel is the lecture's example of which kind?",
     "На диаграмме показаны четыре вида моделей из лекции 5, каждый с примером из сетки кампуса. Лопасть ветряной турбины, испытанная в аэродинамической трубе, — пример какого вида?",
     "Diagrammada 5-maʼruzadagi toʻrt xil model, har biri kampus tarmogʻidagi misoli bilan koʻrsatilgan. Aerodinamik trubada sinovdan oʻtkazilgan shamol turbina pichi qaysi turga misoldir?"),
 6: ("t14_anatomy.png", "Diagram: anatomy of a model — the e-bus range model",
     "The diagram shows the anatomy of the e-bus range model. Numbers that describe the system and are held fixed — such as the energy use per km e = 1.2 kWh/km — are called:",
     "На диаграмме показана анатомия модели запаса хода электробуса. Числа, которые описывают систему и держатся фиксированными, — например, расход e = 1,2 кВт·ч/км, — называются:",
     "Diagrammada elektrobus yurish masofasi modelining anatomiyasi koʻrsatilgan. Tizimni tasvirlaydigan va oʻzgarmas qilib qoʻyilgan sonlar — masalan, e = 1,2 kVt·soat/km sarfi — noma deb ataladi:"),
 11: ("t15_assumptions.png", "Diagram: three kinds of assumptions",
     "The diagram shows the three kinds of assumptions with e-bus examples. “We ignore hills, traffic lights, stops and differences between drivers.” For the e-bus model this is:",
     "На диаграмме показаны три вида допущений с примерами электробуса. «Мы игнорируем холмы, светофоры, остановки и различия между водителями» — для модели автобуса это:",
     "Diagrammada elektrobus misollari bilan uch xil faraz koʻrsatilgan. «Biz tepaliklar, svetoforlar, toʻxtashlar va haydovchilar orasidagi farqlarni hisobga olmaymiz» — avtobus modeli uchun bu:"),
 13: ("t16_template.png", "Diagram: the assumption writing template",
     "The diagram shows the course template filled in with the winter e-bus example. The general form of the template is:",
     "На диаграмме показан шаблон курса, заполненный примером зимнего электробуса. Общая форма шаблона:",
     "Diagrammada kurs shabloni qishki elektobus misoli bilan toʻldirilgan holda koʻrsatilgan. Shablonning umumiy shakli qanday?"),
 14: ("t17_range.png", "Diagram: the e-bus range under four scenarios against the daily need",
     "The diagram shows the range under four scenarios against the 96 km daily need. With winter heating (e = 1.8 kWh/km) the range becomes 89 km. What does this mean for the daily need of 96 km (8 laps × 12 km)?",
     "На диаграмме показан запас хода при четырёх сценариях против дневной потребности 96 км. С зимним отоплением (e = 1,8 кВт·ч/км) запас хода падает до 89 км. Что это значит для дневной потребности 96 км (8 кругов × 12 км)?",
     "Diagrammada toʻrt ssenariy boʻyicha yurish masofasi kunlik 96 km ehtiyojga qarshi koʻrsatilgan. Qishki isitish bilan (e = 1,8 kVt·soat/km) yurish masofasi 89 km ga tushadi. Kunlik 96 km ehtiyoj (8 aylana × 12 km) uchun bu nimani anglatadi?"),
 15: ("t18_solar.png", "Diagram: the naive solar rectangle vs the clear-day profile",
     "The diagram shows both estimates for a 5 kW array. The naive estimate “5 kW × 24 h = 120 kWh/day” is almost four times too high because:",
     "На диаграмме показаны обе оценки для установки 5 кВт. Наивная оценка «5 кВт × 24 ч = 120 кВт·ч/день» завышена почти в четыре раза, потому что:",
     "Diagrammada 5 kVt li oʻrnatma uchun ikkala baho ham koʻrsatilgan. «5 kVt × 24 soat = 120 kVt·soat/kun» degan oddiy baho deyarli toʻrt barobar yuqori, chunki:"),
 20: ("t19_utilisation.png", "Diagram: the utilisation scale with the week's systems",
     "The diagram places the week's systems on the utilisation scale (demand ÷ capacity, same units, same time basis). A value above 1.0 means:",
     "На диаграмме системы недели расставлены на шкале утилизации (спрос ÷ мощность, те же единицы, та же временная база). Значение выше 1,0 означает:",
     "Diagrammada hafta tizimlari bandlik (utilizatsiya) shkalasiga joylashtirilgan (talab ÷ sigʻim, birlik va vaqt asosi bir xil). 1,0 dan yuqori qiymat nimani anglatadi?"),
 22: ("t20_peak.png", "Diagram: the faculty building's day — average vs peak",
     "The diagram shows the building's day: it averages 94 kW but peaks at 180 kW at 13:00 (transformer 250 kW). Which week-6 rule does this illustrate?",
     "На диаграмме показан день здания: в среднем 94 кВт, но пик — 180 кВт в 13:00 (трансформатор 250 кВт). Какое правило недели 6 это иллюстрирует?",
     "Diagrammada binoning bir kuni koʻrsatilgan: oʻrtacha 94 kVt, lekin 13:00 da 180 kVt choʻqqiga chiqadi (transformator 250 kVt). Bu qaysi 6-hafta qoidasini tasvirlaydi?"),
 24: ("t21_kwh.png", "Diagram: power vs energy — kW and kWh",
     "The diagram shows how power and energy relate. A charger delivers 60 kW for 2 hours. The energy delivered is:",
     "На диаграмме показана связь мощности и энергии. Зарядник отдаёт 60 кВт в течение 2 часов. Отданная энергия:",
     "Diagrammada quvvat va energiyaning bogʻliqligi koʻrsatilgan. Zaryad qurilmasi 2 soat davomida 60 kVt quvvat beradi. Berilgan energiya:"),
 27: ("t22_charging.png", "Diagram: six buses against the 200 kW depot connection",
     "The diagram shows both charging plans. Six buses need 115 kWh each by 06:00; the depot connection is 200 kW (window 22:00–06:00 = 8 h). What does the lecture conclude?",
     "На диаграмме показаны оба плана зарядки. Шести автобусам нужно по 115 кВт·ч к 06:00; подключение депо — 200 кВт (окно 22:00–06:00 = 8 ч). К какому выводу приходит лекция?",
     "Diagrammada zaryadlashning ikkala rejasi ham koʻrsatilgan. Oltita avtobusga 06:00 gacha har biriga 115 kVt·soat kerak; depo ulanishi 200 kVt (oyna 22:00–06:00 = 8 soat). Maʼruza qanday xulosaga keladi?"),
 31: ("t23_line.png", "Diagram: the wafer packaging line and its bottleneck",
     "The diagram shows Lab 6's Semiconductor Wafer Packaging Line (12 h/day) with its stage rates. The bottleneck is:",
     "На диаграмме показана линия упаковки полупроводниковых пластин из лаб. 6 (12 ч/день) со ставками стадий. Узкое место:",
     "Diagrammada 6-laboratoriyaning yarimoʻtkazgich plastina qadoqlash liniyasi (12 soat/kun) bosqich stavkalari bilan koʻrsatilgan. Toʻsiq (bottleneck):"),
 33: ("t24_om.png", "Diagram: the four steps of order-of-magnitude estimation",
     "The diagram shows the method's four steps with the solar-sizing example. The correct sequence of the four steps is:",
     "На диаграмме показаны четыре шага метода с примером солнечной установки. Правильная последовательность четырёх шагов:",
     "Diagrammada usulning toʻrt qadami quyosh oʻrnatmasi misoli bilan koʻrsatilgan. Toʻrt qadamning toʻgʻri ketma-ketligi:"),
 35: ("t25_dataproblems.png", "Diagram: four data problems and their first aids",
     "The diagram shows the week's four data problems. The e-bus range model has summer tests (1.1–1.6 kWh/km) but no winter test, and cabin heating raises energy use by an unknown amount. This data problem is:",
     "На диаграмме показаны четыре проблемы данных этой недели. У модели запаса хода есть летние тесты (1,1–1,6 кВт·ч/км), но нет зимнего, а отопление салона повышает расход на неизвестную величину. Эта проблема данных:",
     "Diagrammada shu haftaning toʻrt maʼlumot muammosi koʻrsatilgan. Yurish masofasi modelida yozgi sinovlar (1,1–1,6 kVt·soat/km) bor, lekin qishki sinov yoʻq, salon isitishi esa sarfni nomaʼlum miqdorda oshiradi. Bu qanday maʼlumot muammosi?"),
 42: ("t26_waitdist.png", "Diagram: the waiting-time distribution and its three readings",
     "The diagram shows the distribution (mean 6 minutes) and its three readings. The 12–14 min and 14–16 min bars hold 7% and 8% of passengers. The passenger's reading of the same data:",
     "На диаграмме показано распределение (среднее 6 минут) и три его прочтения. Столбцы 12–14 мин и 14–16 мин содержат 7% и 8% пассажиров. Прочтение пассажира тех же данных:",
     "Diagrammada taqsimot (oʻrtacha 6 daqiqa) va uning uch xil oʻqilishi koʻrsatilgan. 12–14 daqiqa va 14–16 daqiqa ustunlari yoʻlovchilarning 7% va 8% ini tashkil qiladi. Xuddi shu maʼlumotning yoʻlovchi tomonidan oʻqilishi:"),
 46: ("t27_report.png", "Diagram: the honest report card — four lines",
     "The diagram shows the four lines filled with the Lab 7 LED case. An honest engineering report (Lecture 7) consists of four elements:",
     "На диаграмме показаны четыре строки, заполненные LED-кейсом лаб. 7. Честный инженерный отчёт (лекция 7) состоит из четырёх элементов:",
     "Diagrammada toʻrt qator 7-laboratoriya LED keysi bilan toʻldirilgan holda koʻrsatilgan. Halol muhandislik hisoboti (7-maʼruza) toʻrt elementdan iborat:"),
}


def _img(file, alt):
    return f"\n\n![{alt}]({D}{file})"


def apply_overlay(data):
    qs = data["questions"]
    assert len(qs) == 50, f"expected 50 base questions, got {len(qs)}"
    # 1) embed the 15 diagrams (indices are 1-based over the base list)
    for n, (file, alt, en, ru, uz) in EMBEDS.items():
        q = qs[n - 1]
        assert "ite-diagrams" not in q["t"], f"Q{n} already carries a diagram"
        q["t"] = _img(file, alt) + en
        q["ru"]["t"] = _img(file, alt) + ru
        q["uz"]["t"] = _img(file, alt) + uz
    # 2) two image-option questions, inserted after original Q37 (index 37)
    new_qs = [
      {
       "t": "Four data-problem cards are shown below. Which card shows the NOISY data problem?",
       "o": ["![](" + D + "dp_noisy.png)",
             "![](" + D + "dp_missing.png)",
             "![](" + D + "dp_unit.png)",
             "![](" + D + "dp_few.png)"],
       "e": "The noisy problem is the card with five readings scattered around the mean (58 · 61 · 54 · 63 · 60 kW); the first aid is to report the mean and the range: about 59 kW (54–63). The empty winter slot is “missing”, the unitless 200 is “wrong definition / unit”, and the single trip is “too little”.",
       "ru": {"t": "Ниже показаны четыре карточки проблем данных. Какая карточка показывает проблему ШУМНЫХ (разбросанных) данных?",
              "o": ["![](" + D + "dp_noisy.png)",
                    "![](" + D + "dp_missing.png)",
                    "![](" + D + "dp_unit.png)",
                    "![](" + D + "dp_few.png)"],
              "e": "Шумные данные — карточка с пятью разбросанными показаниями вокруг среднего (58 · 61 · 54 · 63 · 60 кВт); первая помощь — сообщить среднее и размах: около 59 кВт (54–63). Пустой зимний слот — «отсутствие данных», 200 без единицы — «неверное определение / единица», одно измерение — «слишком мало»."},
       "uz": {"t": "Quyida maʼlumot muammolarining toʻrt kartochkasi koʻrsatilgan. Qaysi kartochka SHOVQINLI (tarqoq) maʼlumot muammosini koʻrsatadi?",
              "o": ["![](" + D + "dp_noisy.png)",
                    "![](" + D + "dp_missing.png)",
                    "![](" + D + "dp_unit.png)",
                    "![](" + D + "dp_few.png)"],
              "e": "Shovqinli maʼlumot — oʻrtacha atrofida tarqoq beshta oʻlchov koʻrsatilgan kartochka (58 · 61 · 54 · 63 · 60 kVt); birinchi yordam — oʻrtacha va oraliqni xabar qilish: taxminan 59 kVt (54–63). Boʻsh qishki joy — «maʼlumot yoʻq», birliksiz 200 — «notoʻgʻri taʼrif / birlik», bitta oʻlchov — «juda kam»."},
      },
      {
       "t": "A datasheet states “200” with no unit. Which of the four data-problem cards below shows this problem?",
       "o": ["![](" + D + "dp_unit.png)",
             "![](" + D + "dp_noisy.png)",
             "![](" + D + "dp_missing.png)",
             "![](" + D + "dp_few.png)"],
       "e": "200 with no unit is the wrong-definition/unit problem: 200 kWh is energy (battery size) while 200 kW is power — the quantity itself is undefined until the unit is fixed.",
       "ru": {"t": "Паспорт указывает «200» без единицы. Какая из четырёх карточек проблем данных ниже показывает эту проблему?",
              "o": ["![](" + D + "dp_unit.png)",
                    "![](" + D + "dp_noisy.png)",
                    "![](" + D + "dp_missing.png)",
                    "![](" + D + "dp_few.png)"],
              "e": "200 без единицы — проблема неверного определения / единицы: 200 кВт·ч — это энергия (ёмкость батареи), а 200 кВт — мощность; сама величина не определена, пока не фиксирована единица."},
       "uz": {"t": "Datakatalogda birliksiz «200» koʻrsatilgan. Quyidagi toʻrt kartochkadan qaysi biri shu muammoni koʻrsatadi?",
              "o": ["![](" + D + "dp_unit.png)",
                    "![](" + D + "dp_noisy.png)",
                    "![](" + D + "dp_missing.png)",
                    "![](" + D + "dp_few.png)"],
              "e": "Birliksiz 200 — notoʻgʻri taʼrif / birlik muammosi: 200 kVt·soat — energiya (batareya sigʻimi), 200 kVt esa quvvat; birlik belgilanmaguncha miqdorning oʻzi aniqlanmagan."},
      },
    ]
    # insert after index 37 (original Q37, 0-based 36) -> position 37
    qs[37:37] = new_qs
    return data
