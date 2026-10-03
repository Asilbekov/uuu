// Week 3 part B — Numbers practice (Sections B & C) + Quantifiers worksheet (exercises 1–7)
module.exports = [
  // --- Numbers B, Activity 1: answer the questions (8) ---
  { t: 'Numbers B A1: What is five squared?', o: ['25', '10', '15', '125'], e: '5 × 5 = 25.' },
  { t: 'Numbers B A1: What is the next prime number after 19?', o: ['23', '21', '22', '25'], e: '21 = 3×7 and 22 = 2×11 are divisible; the next prime is 23.' },
  { t: 'Numbers B A1: How is the sequence 3, 9, 27, 81 created?', o: ['Each number is multiplied by 3', 'Each number is multiplied by 9', 'Each number is increased by 6', 'Each number is squared'], e: '3×3=9, 9×3=27, 27×3=81 — a geometric sequence.' },
  { t: 'Numbers B A1: What is the aggregate of this set of test marks: 6, 8, 9, 5, 6, 7?', o: ['41', '6.8', '40', '39'], e: 'Aggregate = total: 6+8+9+5+6+7 = 41 (average would be 41÷6 ≈ 6.8).' },
  { t: 'Numbers B A1: If you round up 6.66, what number do you have?', o: ['7', '6', '6.7', '66'], e: 'Rounding up gives the next whole number: 7.' },
  { t: 'Numbers B A1: 3/4 and 4 — which is a whole number and which is a fraction?', o: ['3/4 is a fraction, 4 is a whole number', '3/4 is a whole number, 4 is a fraction', 'both are fractions', 'both are whole numbers'], e: 'A fraction shows parts of a whole; 4 is a complete (whole) number.' },
  { t: 'Numbers B A1: Is an accountant pleased or displeased if the figures he/she is checking tally?', o: ['Pleased — the figures match', 'Displeased — there is an error', 'Pleased — the figures are missing', 'Displeased — the figures doubled'], e: 'If figures tally, they match/agree, so there is no error to investigate.' },

  // --- Numbers B, Activity 2: complete the conversation (9) ---
  { t: 'Numbers B A2: "You could ___ the total number of private cars that use the tunnel each week." (c…)', o: ['calculate', 'tally', 'estimate it exactly', 'round'], e: 'calculate = work out (Rule 16).' },
  { t: 'Numbers B A2: "…and get an ___ figure for how much carbon they\'re all emitting." (a…)', o: ['approximate', 'approximation', 'exact', 'estimated exactly'], e: 'approximate = a roughly correct figure.' },
  { t: 'Numbers B A2: "How ___ would that figure have to be?" (p…)', o: ['precise', 'approximate', 'constant', 'discrete'], e: 'precise = exact.' },
  { t: 'Numbers B A2: "you just need to ___ more or less what the total pollution will be" (e…)', o: ['estimate', 'tally', 'prove', 'round'], e: 'estimate = make a rough guess.' },
  { t: 'Numbers B A2: "check to see if those figures ___ with the figures that have already been published" (t…)', o: ['tally', 'vary', 'count', 'calculate'], e: 'tally with = match, agree.' },
  { t: 'Numbers B A2: "And the figure won\'t be ___, of course; it\'ll go up and down…" (c…)', o: ['constant', 'precise', 'discrete', 'approximate'], e: 'constant = staying the same — the figure goes up and down, so it is not constant.' },
  { t: 'Numbers B A2: "Should I present each daily total as a ___ item…?" (d…)', o: ['discrete', 'constant', 'decimal', 'rounded'], e: 'discrete = a separate item that cannot be divided (Rule 16).' },
  { t: 'Numbers B A2: "you can ___ it up or down to the nearest 100" — choose the verb.', o: ['round', 'divide', 'tally', 'average'], e: 'round up / round down — the fixed pair.' },

  // --- Numbers B, Activity 3: rewrite using the word in capitals (5) ---
  { t: 'Numbers B A3 (ESTIMATE): "We made a rough guess at what the final figure might be." → choose the rewrite.', o: ['We made a rough estimate of what the final figure might be.', 'We made a rough estimate on what the final figure might be.', 'We estimated roughly at the final figure might be.', 'We did a rough estimate about the figure final.'], e: 'estimate (verb) → estimate (noun) + of.' },
  { t: 'Numbers B A3 (MAGNITUDE): "The graph shows the results from the lowest to the highest." → choose the rewrite.', o: ['The graph shows the results in order of magnitude, from the lowest to the highest.', 'The graph shows the results by magnitude order, from the lowest to the highest.', 'The graph magnitudes the results from lowest to highest.', 'The graph shows the magnitude results lowest to highest.'], e: 'Fixed phrase: in order of magnitude.' },
  { t: 'Numbers B A3 (CALCULATE): "A computer program helped us work out the significance of the different variables." → choose the rewrite.', o: ['A computer program helped us calculate the significance of the different variables.', 'A computer program helped us calculation the significance…', 'A computer program helped us calculating the significance…', 'A computer program calculated to us the significance…'], e: 'work out → calculate.' },
  { t: 'Numbers B A3 (SUBTRACT): "Taking x away from y will help you arrive at the correct answer." → choose the rewrite.', o: ['Subtracting x from y will help you arrive at the correct answer.', 'Subtracting x of y will help you arrive at the correct answer.', 'Subtract x away y will help you arrive at the correct answer.', 'Subtracted from x y will help you arrive at the correct answer.'], e: 'subtract x from y; gerund subject Subtracting…' },
  { t: 'Numbers B A3 (TALLY): "The results from the first experiment were not the same as those we got from the repeat experiment." → choose the rewrite.', o: ['The results from the first experiment did not tally with those we got from the repeat experiment.', 'The results from the first experiment did not tally to those we got…', 'The results did not tally the repeat experiment.', 'The results were not tallying with the repeat experiment.'], e: 'tally with = match.' },

  // --- Numbers B, Activity 4: the maths tutor's email (7 gaps + odd word) ---
  { t: 'Numbers B A4: "Don\'t forget to show your ___." (all the calculations leading up to an answer)', o: ['workings', 'figures', 'values', 'area'], e: 'workings = all the calculations shown step by step.' },
  { t: 'Numbers B A4: "It is a good idea to show how you ___ your ___." (the verb + the numbers)', o: ['arrived at; figures', 'reached to; figures', 'arrived in; values', 'arrived; areas'], e: 'arrive at your figures — the collocation is arrive at.' },
  { t: 'Numbers B A4: "…answers that are hardly even in the right ___." (approximately correct)', o: ['area', 'figure', 'value', 'variable'], e: 'in the right area = approximately correct.' },
  { t: 'Numbers B A4: "we must be able to distinguish all your ___." (legible writing)', o: ['calculations', 'variables', 'values', 'workings'], e: 'calculations — the key for gap 5.' },
  { t: 'Numbers B A4: "When doing graphs, plot the ___ carefully" (individual data points)', o: ['values', 'figures', 'area', 'workings'], e: 'plot the values.' },
  { t: 'Numbers B A4: "take all ___ into account" (the things that can change)', o: ['variables', 'values', 'figures', 'calculations'], e: 'take all variables into account.' },
  { t: 'Numbers B A4: Which word from the box is NOT needed?', o: ['reached', 'calculations', 'figures', 'values'], e: 'The extra word is reached — the email uses arrive at.' },

  // --- Numbers C, Exercises 1–2: proportions ---
  { t: 'Numbers C Ex.1: "the highest percentage of smokers" matches which student citation?', o: ['B — Naples has the highest proportion of smokers', 'D — only a small minority of US workers', 'A — the majority were non-smokers', 'C — two per cent of the US population'], e: '1 → B: percentage → proportion.' },
  { t: 'Numbers C Ex.1: "this small fraction of the population" matches which student citation?', o: ['D — only a small minority of US workers (around 5%)', 'B — the highest proportion of smokers', 'C — the whole country', 'A — the majority of those questioned'], e: '2 → D: a small fraction = a small minority.' },
  { t: 'Numbers C Ex.2: "This type of treatment is appropriate in only a minority of cases." — large (L) or small (S)?', o: ['S (small)', 'L (large)'], e: 'a minority = small quantity.' },
  { t: 'Numbers C Ex.2: "Fuel costs make up a tiny fraction of the firm\'s total operating costs." — L or S?', o: ['S (small)', 'L (large)'], e: 'a tiny fraction = small.' },
  { t: 'Numbers C Ex.2: "The majority of students at the college speak English as a second language." — L or S?', o: ['L (large)', 'S (small)'], e: 'the majority = large.' },
  { t: 'Numbers C Ex.2: "A high proportion of their income is spent on food…" — L or S?', o: ['L (large)', 'S (small)'], e: 'a high proportion = large.' },
  { t: 'Numbers C Ex.2: "This disease affects a relatively small percentage of the population." — L or S?', o: ['S (small)', 'L (large)'], e: 'a small percentage = small.' },

  // --- Numbers C, Exercise 3: complete with the word in CAPITALS (5) ---
  { t: 'Numbers C Ex.3 (FRACTION): "These examples represent only ___ the total number of cases (less than 4%)."', o: ['a small fraction of', 'a big fraction of', 'a small fractions of', 'small fraction the'], e: 'a small fraction of + noun.' },
  { t: 'Numbers C Ex.3 (MAJORITY): "The survey found that ___ customers (82%) are satisfied with the service."', o: ['the majority of', 'majority of the', 'a majority the', 'the most majority of'], e: 'the majority of + noun.' },
  { t: 'Numbers C Ex.3 (PROPORTION): "___ patients (approximately 10%) suffer more severe symptoms."', o: ['A small proportion of', 'A small proportion from', 'The high proportion of', 'Small proportions of'], e: 'A small proportion of patients (≈10%).' },
  { t: 'Numbers C Ex.3 (PER CENT): "In 1900, only 20 ___ American women worked outside the home."', o: ['per cent of', 'percent from', 'percents of', 'percentage of'], e: 'per cent after a number (Rule 17): 20 per cent of.' },
  { t: 'Numbers C Ex.3 (MINORITY): "In ___ people (less than 3%), the problem may continue into adulthood."', o: ['a small minority of', 'a small minorities of', 'the big minority from', 'small minority the'], e: 'a small minority of people.' },

  // --- Numbers C, Exercises 4–5: averages ---
  { t: 'Numbers C Ex.4: "You can use an ___ to represent a typical ___ for a set of data." (box: average, value…)', o: ['average; value', 'value; average', 'mean; divide', 'formula; total'], e: 'an average represents a typical value.' },
  { t: 'Numbers C Ex.4: "The most common way of measuring an average is called the ___."', o: ['mean', 'total', 'value', 'divide'], e: 'The mean is the most common average.' },
  { t: 'Numbers C Ex.4: "You can ___ the mean using the ___ shown in the text."', o: ['calculate; formula', 'divide; mean', 'average; total', 'formula; value'], e: 'calculate the mean using the formula.' },
  { t: 'Numbers C Ex.4: "You work out the ___ of all the values, then you ___ that by the number of values."', o: ['total; divide', 'divide; total', 'mean; multiply', 'formula; add'], e: 'total first, then divide by the count (Rule 18).' },
  { t: 'Numbers C Ex.5: 6 + 9 + 3 + 9 + 7 circled in the picture — this is the…', o: ['total', 'formula', 'divide by', 'majority'], e: 'The circled sum is the total.' },
  { t: 'Numbers C Ex.5: (n+1)/2 bracketed in the picture — this is a…', o: ['formula', 'percentage', 'total', 'minority'], e: 'A mathematical expression like (n+1)/2 is a formula.' },
  { t: 'Numbers C Ex.5: the fraction line labelled in the picture — this means…', o: ['divide by', 'majority', 'percentage', 'total'], e: 'The line between numbers means divide by.' },
  { t: 'Numbers C Ex.5: the pie chart sectors 15% and 85% — label them.', o: ['15% = minority, 85% = majority', '15% = majority, 85% = minority', '15% = total, 85% = formula', '15% = divide by, 85% = percentage'], e: 'The 85% sector is the majority; 15% is the minority.' },

  // --- Numbers C, Exercise 6: the Madeira weather table (10 gaps → 5 pairs) ---
  { t: 'Madeira text: "To ___ the ___ rainfall for this whole period…" (gaps 1–2)', o: ['calculate; average', 'divide; total', 'round; average', 'calculate; majority'], e: 'calculate the average rainfall.' },
  { t: 'Madeira text: "we first work out the ___ of the rainfall ___ for these six months" (gaps 3–4)', o: ['total; values', 'average; figures', 'divide; total', 'value; totals'], e: 'the total of the rainfall values.' },
  { t: 'Madeira text: "Then we ___ this by the number of months" (gap 5)', o: ['divide', 'multiply', 'round', 'tally'], e: 'divide the total by the count.' },
  { t: 'Madeira text: "So 77.66 mm is the ___ amount of rain… Looking at these ___…" (gaps 6–7)', o: ['average; figures', 'total; majorities', 'divided; values', 'average; proportions'], e: 'the average amount; looking at these figures.' },
  { t: 'Madeira text: "the ___ of wet days each month is relatively low… for the ___ of the year… a large ___ of the year" (gaps 8–10)', o: ['number; majority; proportion', 'majority; number; proportion', 'proportion; majority; number', 'number; proportion; majority'], e: 'the number of wet days; the majority of the year; a large proportion of the year.' },

  // --- Quantifiers worksheet Ex.1: how many / how much (8) ---
  { t: 'WS Ex.1: "___ active volcanoes are there throughout the world?"', o: ['How many', 'How much'], e: 'volcanoes = countable → How many.' },
  { t: 'WS Ex.1: "___ oxygen is in the air?"', o: ['How much', 'How many'], e: 'oxygen = uncountable → How much.' },
  { t: 'WS Ex.1: "___ fish are there in the sea?"', o: ['How many', 'How much'], e: 'fish (species, countable) → How many.' },
  { t: 'WS Ex.1: "___ water is there on Earth?"', o: ['How much', 'How many'], e: 'water = uncountable.' },
  { t: 'WS Ex.1: "___ kinds of clouds are there?"', o: ['How many', 'How much'], e: 'kinds = countable.' },
  { t: 'WS Ex.1: "___ teeth does an adult human have?"', o: ['How many', 'How much'], e: 'teeth = countable.' },
  { t: 'WS Ex.1: "___ does the Earth weigh?"', o: ['How much', 'How many'], e: 'weight = mass (uncountable) → How much.' },
  { t: 'WS Ex.1: "___ oil is used in the world every day?"', o: ['How much', 'How many'], e: 'oil = uncountable.' },

  // --- Quantifiers worksheet Ex.2: isn't much / aren't many (8) ---
  { t: 'WS Ex.2: "There ___ rain in the Sahara Desert."', o: ["isn't much", "aren't many"], e: 'rain = uncountable → isn\'t much.' },
  { t: 'WS Ex.2: "There ___ giant pandas left in the world."', o: ["aren't many", "isn't much"], e: 'pandas = countable → aren\'t many.' },
  { t: 'WS Ex.2: "There ___ snow in countries near the Equator."', o: ["isn't much", "aren't many"], e: 'snow = uncountable.' },
  { t: 'WS Ex.2: "There ___ unexplored places left on Earth."', o: ["aren't many", "isn't much"], e: 'places = countable.' },
  { t: 'WS Ex.2: "There ___ people living in the Antarctic."', o: ["aren't many", "isn't much"], e: 'people = countable.' },
  { t: 'WS Ex.2: "There ___ light in the ocean below 200 metres."', o: ["isn't much", "aren't many"], e: 'light = uncountable.' },
  { t: 'WS Ex.2: "There ___ iron in the human body."', o: ["isn't much", "aren't many"], e: 'iron = uncountable.' },
  { t: 'WS Ex.2: "There ___ mountains on Earth higher than 7,000 metres."', o: ["aren't many", "isn't much"], e: 'mountains = countable.' },

  // --- Quantifiers worksheet Ex.3: complete with the word in capitals (7) ---
  { t: 'WS Ex.3 (FEW): "In fact there are only one or two ways of doing this." → choose the rewrite.', o: ['In fact there are few ways of doing this.', 'In fact there are a few ways of doing this.', 'In fact there are few of ways of doing this.', 'In fact there is few ways of doing this.'], e: 'few (without a) = almost none — matches "only one or two".' },
  { t: 'WS Ex.3 (NO): "Divers could not survive at such depths." → choose the rewrite.', o: ['No divers could survive at such depths.', 'Any divers could not survive at such depths.', 'Not no divers could survive at such depths.', 'None divers could survive at such depths.'], e: 'no + affirmative verb.' },
  { t: 'WS Ex.3 (A FEW): "Some people have descended this far in underwater vessels called bathyscaphes." → choose the rewrite.', o: ['A few people have descended this far in underwater vessels called bathyscaphes.', 'A little people have descended this far…', 'Few people have descended this far… (same as some)', 'A few of people have descended this far…'], e: 'a few + countable = some.' },
  { t: 'WS Ex.3 (A FEW): "They cannot remain under water for many hours." → choose the rewrite.', o: ['They can remain under water for only a few hours.', 'They can remain under water for only a little hours.', 'They can remain under water for few hours only long.', 'They can remain under water for a few of hours.'], e: 'only a few hours.' },
  { t: 'WS Ex.3 (LOT): "There are many problems involved with descending into deep water." → choose the rewrite.', o: ['There are a lot of problems involved with descending into deep water.', 'There are a lots of problems involved…', 'There is a lot of problems involved…', 'There are a lot problems involved…'], e: 'a lot of + plural = many.' },
  { t: 'WS Ex.3 (NONE): "There is some light up to 200 metres, but at 10,000 it is completely dark." → choose the rewrite.', o: ['There is some light up to 200 metres, but at 10,000 there is none.', '…but at 10,000 there is none of it light.', '…but at 10,000 there is no.', '…but at 10,000 there are none.'], e: 'none = zero quantity (pronoun).' },
  { t: 'WS Ex.3 (FEW): "There are not many creatures that live at such a depth." → choose the rewrite.', o: ['Few creatures live at such a depth.', 'A few creatures live at such a depth.', 'Little creatures live at such a depth.', 'Few of creatures live at such a depth.'], e: 'few (without a) = not many.' },

  // --- Quantifiers worksheet Ex.4: few or little (8) ---
  { t: 'WS Ex.4 (Mars): "___ people think that there are other planets in our solar system with human life."', o: ['Few', 'Little', 'A few', 'A little'], e: 'people = countable plural → Few.' },
  { t: 'WS Ex.4: "In fact, there is ___ reason to believe that life of any kind exists on other planets."', o: ['little', 'few', 'a few', 'a little'], e: 'reason = uncountable → little.' },
  { t: 'WS Ex.4: "There are a ___ indications that microbes may exist… on Mars."', o: ['few', 'little'], e: 'indications = countable → a few.' },
  { t: 'WS Ex.4: "However, there is ___ real proof of this."', o: ['little', 'few'], e: 'proof = uncountable → little.' },
  { t: 'WS Ex.4: "There are a ___ traces of methane in the Martian atmosphere…"', o: ['few', 'little'], e: 'traces = countable → a few.' },
  { t: 'WS Ex.4: "Unfortunately, there is ___ agreement among scientists about this."', o: ['little', 'few'], e: 'agreement = uncountable → little.' },
  { t: 'WS Ex.4: "…there are a ___ areas where scientists believe ice forms and melts."', o: ['few', 'little'], e: 'areas = countable → a few.' },
  { t: 'WS Ex.4: "Other scientists argue that there is ___ chance of finding any life at all on Mars."', o: ['little', 'few'], e: 'chance = uncountable → little.' },

  // --- Quantifiers worksheet Ex.6: same meaning, one word (9) ---
  { t: 'WS Ex.6: "What is the total amount of salt contained in the world\'s oceans?" → "How ___ salt is there in the world\'s oceans?"', o: ['much', 'many', 'long', 'lots'], e: 'salt = uncountable → How much.' },
  { t: 'WS Ex.6: "We don\'t know very much about the deep oceans." → "We know very ___ about the deep oceans."', o: ['little', 'few', 'few of', 'less'], e: 'know very little (uncountable idea).' },
  { t: 'WS Ex.6: "Water covers a large part of the Earth\'s surface." → "___ of the Earth\'s surface is covered by water."', o: ['Much', 'Many', 'Most much', 'Many of'], e: 'Much of the surface (uncountable use).' },
  { t: 'WS Ex.6: "There seems to be more than enough food for everyone…" → "There seems to be ___ of food for everyone…"', o: ['plenty', 'plenty of them much', 'many plenty', 'a lots'], e: 'plenty of food — but before "of" we keep plenty; key: plenty (of).' },
  { t: 'WS Ex.6: "In fact, large amounts of the food we eat come from the oceans." → "In fact, a ___ of the food we eat comes from the oceans."', o: ['large proportion', 'largely proportion', 'big proportional', 'large partment'], e: 'a large proportion of the food.' },
  { t: 'WS Ex.6: "You can\'t swim in the Dead Sea because of the large amount of salt in it." → "…because it contains too ___ salt."', o: ['much', 'many', 'few', 'lots'], e: 'too much salt.' },
  { t: 'WS Ex.6: "There is a shortage of fish in some parts of the world." → "There aren\'t ___ fish in some parts of the world."', o: ['many', 'much', 'lots', 'little'], e: 'fish (countable here) → aren\'t many.' },
  { t: 'WS Ex.6: "The Sargasso Sea contains large amounts of seaweed." → "There is ___ of seaweed in the Sargasso Sea."', o: ['lots', 'many', 'much of', 'a lots'], e: 'lots of seaweed.' },
  { t: 'WS Ex.6: "There are areas near the Equator where the wind does not blow very much." → "The wind ___ very much in some areas near the Equator." — which quantifier pattern completes the idea correctly?', o: ['blows little (hardly at all)', 'blows many', 'blows much of', 'blow few'], e: 'The wind blows little (very infrequently) — little with the uncountable idea of wind.' },

  // --- Quantifiers worksheet Ex.7: deserts text (16 quick choices) ---
  { t: 'WS Ex.7 (deserts, a): "a desert is an area which receives ___ rain" (few / little)', o: ['little', 'few'], e: 'rain = uncountable → little.' },
  { t: 'WS Ex.7 (b): "which loses ___ its moisture through evaporation" (a few / a lot of)', o: ['a lot of', 'a few'], e: 'a lot of its moisture.' },
  { t: 'WS Ex.7 (c): "___ polar regions can be called deserts" (Many / Much)', o: ['Many', 'Much'], e: 'polar regions = countable → Many.' },
  { t: 'WS Ex.7 (d): "…a sandy, rocky area with ___ water" (not enough / few)', o: ['not enough', 'few'], e: 'not enough water (insufficient amount).' },
  { t: 'WS Ex.7 (e): "___ of deserts consist of sand dunes" (Lots / Lot)', o: ['Lots', 'Lot'], e: 'Lots of deserts — Lot alone is wrong.' },
  { t: 'WS Ex.7 (f): "and ___ are near mountain ranges" (many / much)', o: ['many', 'much'], e: 'deserts = countable → many.' },
  { t: 'WS Ex.7 (g): "…so receive ___ moisture" (few / little)', o: ['little', 'few'], e: 'moisture = uncountable → little.' },
  { t: 'WS Ex.7 (h): "…that very ___ kinds of life live in deserts" (few / lots)', o: ['few', 'lots'], e: 'very few kinds (countable).' },
  { t: 'WS Ex.7 (i): "in fact there are ___ of plants, animals and insects" (lots / many)', o: ['lots', 'many'], e: 'lots of + noun (many would drop "of").' },
  { t: 'WS Ex.7 (j): "___ desert plants store water in their leaves" (Lots / Many)', o: ['Many', 'Lots'], e: 'Many + noun directly (Lots needs of).' },
  { t: 'WS Ex.7 (k): "some desert plants can live for ___ years" (lots / many)', o: ['many', 'lots'], e: 'live for many years (no of).' },
  { t: 'WS Ex.7 (l): "They spend ___ time in the sun" (little / a few)', o: ['little', 'a few'], e: 'time = uncountable → little.' },
  { t: 'WS Ex.7 (m): "There are ___ insects, scorpions and spiders as well as reptiles…" (enough / lots of)', o: ['lots of', 'enough of insects'], e: 'lots of insects… — key: lots of.' },
  { t: 'WS Ex.7 (n): "They need to spend ___ hours in the sun" (much / many)', o: ['many', 'much'], e: 'hours = countable → many.' },
  { t: 'WS Ex.7 (o): "…so they have ___ difficulty living in high temperatures" (a few / little)', o: ['little', 'a few'], e: 'difficulty = uncountable → little.' },
  { t: 'WS Ex.7 (p): "However, ___ of them are cold deserts" (few / little)', o: ['few', 'little'], e: 'them = cold deserts (countable) → few of them.' },
];
