// Week 3 part A — lecture: quantifiers lead-in, Activities 1-2, reading "8 ways"
module.exports = [
  // --- Lead-in (audio 9.10): 6 sentences ---
  { t: 'Lead-in (9.10): "I used to have ___ of different gadgets, but now I use my phone for almost everything."', o: ['a lot', 'a lots', 'many lot', 'much lot'], e: 'Key: a lot (of different gadgets).' },
  { t: 'Lead-in (9.10): "I\'d like to have a better computer, but I don\'t have ___ to buy one right now."', o: ['enough money', 'money enough much', 'enough moneys', 'too money'], e: 'Key: enough money (enough + noun).' },
  { t: 'Lead-in (9.10): "I spend ___ time online. I think I need to take a break."', o: ['too much', 'too many', 'much too', 'many too'], e: 'too much + uncountable (time) — Rule 13.' },
  { t: 'Lead-in (9.10): "I have a lot of friends on social media, but only ___ of them are close friends."', o: ['a couple', 'a couple of friends much', 'many couple', 'much couple'], e: 'Key: a couple (or a few) of them.' },
  { t: 'Lead-in (9.10): "I never watch TV or films on my phone, because the screen isn\'t ___."', o: ['big enough', 'enough big', 'too big enough', 'small enough'], e: 'enough AFTER the adjective: big enough — Rule 14.' },
  { t: 'Lead-in (9.10): "I like Apple products, but I can\'t afford them — I think they\'re ___."', o: ['too expensive', 'too much expensive', 'enough expensive', 'expensive enough much'], e: 'too + adjective: too expensive.' },

  // --- Activity 1: circle the correct word or phrase (10) ---
  { t: 'Act.1: "I just have to reply to ___ emails." (a few / a little)', o: ['a few', 'a little', 'a few of', 'little of the'], e: 'emails = countable plural → a few.' },
  { t: 'Act.1: "Do you spend ___ time on social media?" (much / many)', o: ['much', 'many', 'much of', 'many of'], e: 'time = uncountable, and it is a question → much.' },
  { t: 'Act.1: "My bedroom is a nice size. There\'s ___ for a desk." (enough room / plenty of room)', o: ['both are possible', 'only enough room', 'only plenty of room', 'neither is possible'], e: 'Both fit "a nice size": enough room = sufficient; plenty of room = more than enough (tick).' },
  { t: 'Act.1: "I know very ___ people who speak two foreign languages." (few / little)', o: ['few', 'little', 'a few', 'a little'], e: 'people = countable → very few.' },
  { t: 'Act.1: "My brother has downloaded ___ apps onto his new phone." (a lot of / lots of)', o: ['both are possible', 'only a lot of', 'only lots of', 'neither'], e: 'a lot of / lots of are interchangeable with countable plurals (tick).' },
  { t: 'Act.1: "I have some cash on me, but not ___." (a lot / a lot of)', o: ['a lot', 'a lot of', 'much lot', 'many'], e: 'After not, with no noun, use a lot (without of).' },
  { t: 'Act.1: "Their new TV is ___. It hardly fits in the living room." (too much big / too big)', o: ['too big', 'too much big', 'too much bigger', 'enough big'], e: 'too + adjective; too much never precedes an adjective.' },
  { t: 'Act.1: "___ potatoes. I forgot to buy some." (There aren\'t any / There are no)', o: ['both are possible', 'only There aren\'t any', 'only There are no', 'neither'], e: 'aren\'t any (negative verb + any) and There are no (no + affirmative verb) are both correct (tick).' },
  { t: 'Act.1: "My niece isn\'t ___ to play with a games console." (old enough / enough old)', o: ['old enough', 'enough old', 'enough oldly', 'old enoughly'], e: 'enough follows the adjective — Rule 14.' },
  { t: 'Act.1: "I don\'t have ___ close friends." (a lot of / many)', o: ['both are possible', 'only a lot of', 'only many of them', 'neither'], e: 'Both are possible (many slightly more formal) — tick.' },

  // --- Activity 2: right or wrong? (10) ---
  { t: 'Act.2: "\'How many presents did you get?\' — \'A lot of!\'" — right or wrong?', o: ['Wrong → "A lot!"', 'Right', 'Wrong → "A lot of them!" only correct form', 'Wrong → "Much!"'], e: 'a lot of must be followed by a noun; in short answers use a lot.' },
  { t: 'Act.2: "I buy fewer e-books than I used to because I prefer physical books." — right or wrong?', o: ['Right', 'Wrong → less e-books', 'Wrong → a fewer e-books', 'Wrong → fewers e-books'], e: 'fewer + countable plural — correct.' },
  { t: 'Act.2: "There isn\'t no time to walk there. We\'ll have to get a taxi." — right or wrong?', o: ['Wrong → "There isn\'t any time" / "There\'s no time"', 'Right', 'Wrong → "There is no not time"', 'Wrong → "There aren\'t no time"'], e: 'Double negative impossible — Rule 15.' },
  { t: 'Act.2: "Please turn that music down. It\'s too much loud!" — right or wrong?', o: ['Wrong → "too loud"', 'Right', 'Wrong → "too much loudly"', 'Wrong → "enough loud"'], e: 'too + adjective: too loud.' },
  { t: 'Act.2: "There aren\'t many good programmes on TV tonight." — right or wrong?', o: ['Right', 'Wrong → aren\'t much good programmes', 'Wrong → is no many programmes', 'Wrong → aren\'t some programmes'], e: "aren't many + countable plural — correct." },
  { t: 'Act.2: "My broadband isn\'t enough fast for me to download films easily." — right or wrong?', o: ['Wrong → "isn\'t fast enough"', 'Right', 'Wrong → "isn\'t enough fastly"', 'Wrong → "is too much fast"'], e: 'enough follows the adjective: fast enough.' },
  { t: 'Act.2: "I get too much emails at work. It takes me ages to read them all!" — right or wrong?', o: ['Wrong → "too many emails"', 'Right', 'Wrong → "much emails"', 'Wrong → "too much of emails"'], e: 'emails = countable → too many.' },
  { t: 'Act.2: "A: How much fruit do we have? B: Any. Can you buy some?" — right or wrong?', o: ['Wrong → "None."', 'Right', 'Wrong → "Nothing."', 'Wrong → "No any."'], e: 'Zero quantity in short answers = None — Rule 15.' },
  { t: 'Act.2: "There are only a little people that I can talk to about my problems." — right or wrong?', o: ['Wrong → "only a few people"', 'Right', 'Wrong → "only a little of people"', 'Wrong → "only little peoples"'], e: 'people = countable → a few.' },
  { t: 'Act.2: "Katarina has plenty of money, so she always has the latest phone." — right or wrong?', o: ['Right', 'Wrong → plenty money', 'Wrong → plenty of moneys', 'Wrong → a plenty of money'], e: 'plenty of + noun = more than enough — correct.' },

  // --- Reading: "8 ways to tidy up your digital life" — verbs (8) ---
  { t: 'Reading tip 1 (Inbox messages): "If you can ___ an email in less than two minutes, do it right away." (verb list)', o: ['answer', 'click', 'recycle', 'free up'], e: 'Key verbs: answer, click, find, forget, free up, keep, recycle, update — answer an email.' },
  { t: 'Reading tip 2 (Old software or apps): "Uninstall software or apps that you don\'t use. This will ___ a lot more space."', o: ['free up', 'find', 'keep', 'update'], e: 'free up space = make space available.' },
  { t: 'Reading tip 3 (Photos): "Having poor-quality photos just makes it more difficult to ___ a good photo when you need one."', o: ['find', 'keep', 'click', 'recycle'], e: 'find a good photo.' },
  { t: 'Reading tip 4 (Friends): "Having too many friends on social media makes it more difficult to ___ in touch with the ones you really care about."', o: ['keep', 'update', 'forget', 'click'], e: 'keep in touch — fixed expression.' },
  { t: 'Reading tip 5 (Contact information): "___ contact information regularly and delete contacts you no longer need."', o: ['Update', 'Answer', 'Recycle', 'Free up'], e: 'Update contact information.' },
  { t: 'Reading tip 6 (Passwords): "Use a password manager app… You\'ll never ___ a password again."', o: ['forget', 'find', 'keep', 'click'], e: 'forget a password.' },
  { t: 'Reading tip 7 (Email marketing): "Just ___ on the \'unsubscribe\' link at the bottom of the email."', o: ['click', 'keep', 'answer', 'free up'], e: 'click on the link.' },
  { t: 'Reading tip 8 (Old devices): "If you can\'t give them to somebody who would use them, ___ old devices properly."', o: ['recycle', 'update', 'answer', 'forget'], e: 'recycle old devices.' },

  // --- Reading: prefix un- (d + e, 8 quick items) ---
  { t: 'Prefix un-: "Why should you have hundreds of un___ or un___ emails?" — choose the pair.', o: ['unopened, unanswered', 'unopened, unclick', 'unfree, unanswer', 'unkeep, unread'], e: 'Key (d): unopened / unanswered emails.' },
  { t: 'Prefix un-: "___ software or apps that you don\'t use." — choose the verb.', o: ['Uninstall', 'Unupdate', 'Unkeep', 'Unfind'], e: 'Uninstall software (Tip 2).' },
  { t: 'Prefix un-: "You can ___ friends without them knowing." — choose the verb.', o: ['unfollow', 'unfriend of', 'unkeep', 'unsee'], e: 'unfollow friends (Tip 4).' },
  { t: 'Prefix un-: "If you get ___ emails… don\'t just delete them — ___." — choose the pair.', o: ['unwanted; unsubscribe', 'unwanted; unclick', 'unwanting; unsubscribe', 'unneed; unsign'], e: 'unwanted emails — unsubscribe (Tip 7).' },
  { t: 'un- words: "Why do you have over 100 ___ emails?" (un + read/lock/helpful/known…)', o: ['unread', 'unlocked', 'unhelpful', 'unknown'], e: 'Key (e) 1: unread (or unopened) emails.' },
  { t: 'un- words: "If you want to ___ what you\'ve done, press Ctrl+Z."', o: ['undo', 'unmake', 'unwork', 'unact'], e: 'undo = cancel the last action.' },
  { t: 'un- words: "I had to ___ her as she was posting some really annoying things."', o: ['unfollow', 'unlike', 'unlock', 'undo'], e: 'unfollow her.' },
  { t: 'un- words: "I can\'t ___ my phone — I\'ve forgotten the password."', o: ['unlock', 'unfollow', 'unread', 'undo'], e: 'unlock the phone.' },
  { t: 'un- words: "The IT Support person was very ___. I still can\'t print anything."', o: ['unhelpful', 'unclear', 'uncomfortable', 'unknown'], e: 'unhelpful.' },
  { t: 'un- words: "I didn\'t answer the phone, because it said \'caller ___\'."', o: ['unknown', 'unhelpful', 'unclear', 'unlocked'], e: 'caller unknown.' },
  { t: 'un- words: "I can\'t set up the new router — the instructions are really ___."', o: ['unclear', 'uncomfortable', 'unread', 'unhelpful'], e: 'unclear instructions.' },
  { t: 'un- words: "I hate earbuds — I find them really ___."', o: ['uncomfortable', 'unclear', 'unknown', 'unread'], e: 'uncomfortable.' },
];
