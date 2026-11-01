#!/usr/bin/env python3
# hist_w14 UZ enrichment: reach the ~5,300-word target by appending extra
# course-PDF facts (all verified against pdftext/hist_w14_uz.txt) to narrations.
import json

PATH = '/home/z/my-project/scripts/video/specs/hist_w14_uz.json'

A = {}

A[0] = " Yoʻl toʻrt hafta, toʻrt mavzu orqali oʻtadi: tarix predmeti, sivilizatsiya va davlatchilik, sovet davri hamda mustaqillik."
A[1] = " Testlar taʼriflarni va ularning mualliflarini toʻgʻridan-toʻgʻri soʻraydi."
A[2] = " Volter tarixni dunyodagi barcha jinoyatlarni oʻrganish deb atagan, Konfutsiy esa davlat boshqaruvining barcha sirlari tarixda yotishini yozgan."
A[4] = " Maʼruzada tarix turlari ham sanab oʻtiladi: siyosiy, diplomatik, ijtimoiy, intellektual, madaniy va iqtisodiy tarix."
A[7] = " Etnologik tadqiqotlar jamiyatning «intellektual antivirusi» deb ataladi: ular jamiyatni mish-mish va xurofotlardan tozalaydi. Metodologiyalarga yana paleografiya, epigrafika, genealogiya, geraldika, kodikologiya va sfragistika kiradi."
A[9] = " Yordamchi fanlarni ham takrorlab qoʻying: arxeologiya, numizmatika, xronologiya, manbashunoslik."
A[12] = " Maʼruzada bu davr «insoniyat inqilobi» deb ham ataladi."
A[14] = " Chorvachilik isteʼmol qilinadigan goʻshtning toʻrtdan besh qismidan ortigʻini bergan, choʻchqa ham boqilgan."
A[20] = " Davlatchilik tarixi suveren va qaram davrlarga boʻlinadi. Oʻrta asr sulola-davlatlari — Somoniylar, Qoraxoniylar, Gʻaznaviylar, Saljuqiylar, Xorazmshohlar va Temuriylar."
A[22] = " Sugʻd miloddan avvalgi oltinchi-toʻrtinchi asrlarda Axomaniylar satrapiyasi boʻlgan."
A[26] = " Oʻrta asrlarda eftalitlar ham davlat qurgan — beshinchi asr oʻrtasidan oltinchi asr oʻrtasigacha ular Sosoniy Eron va turkiylar orasida qisilib qolgan; ularning hokimiyatini Turk xoqonligi va Sosoniylarning qoʻshma hujumlari tugatgan."
A[28] = " Bu savol Formation slaydlarida ham takrorlanadi — uchinchi haftaning majburiy minimumi."
A[31] = " Yigirmanchi yillardan toʻqsoninchilargacha mintaqa xomashyo ilovasi sifatida yashadi: asrlarga borib taqaladigan sulolaviy davlatchilik «milliy davlat quruvchi» davlatlar bilan almashtirildi."
A[35] = " Tadqiqotchilar gipotezalari ham bor: barqaror chegaralar oʻzaro munosabatlarning gullab-yashnashiga xizmat qiladi — «yutuq-yutuq» tamoyili."
A[43] = " Frontni qurol-yarogʻ, oʻq-dorilar, kiyim-kechak va oziq-ovqat bilan taʼminlash ham respublika zimmasiga tushdi."
A[44] = " Ayni paytda Oʻzbekiston korrupsiya va past ishlab chiqarish unumdorligi uchun tanqid qilingan."
A[49] = " Deklaratsiya xalqaro huquqning asosiy tamoyillarini eʼtirof etish va hurmat qilishni ham mustahkamladi."
A[50] = " Bayonot mustaqillikni va fuqarolarning teng huquqliligini eʼlon qildi."
A[52] = " Konstitutsiyaviy qonun suverenitet, fuqarolik, mulkchilik va davlat ramzlari haqidagi asosiy moddalarni oʻz ichiga oladi."
A[54] = " Prezidentlikka nomzod talablari ham shu bobda: oʻttiz besh yosh, davlat tili, oʻn yillik yashash."

def words(s):
    return len(str(s).split())

d = json.load(open(PATH))
blocks = []
for ch in d['chapters']:
    blocks.extend(ch['blocks'])

before = sum(words(b.get('narration', '')) for b in blocks)
added = 0
for i, txt in A.items():
    old = blocks[i]['narration']
    assert txt.startswith(' ') and not old.endswith(' '), f"spacing issue at block {i}"
    blocks[i]['narration'] = old + txt
    added += words(txt)

json.dump(d, open(PATH, 'w'), ensure_ascii=False, indent=2)
after = sum(words(b.get('narration', '')) for b in blocks)
print(f"blocks patched: {len(A)}  words added: {added}")
print(f"total narration words: {before} -> {after} (target ~5300)")
