# AGENTS.md — Studio v3 authoring contract

Этот каталог — эталон для локального ИИ-агента, который превращает PDF в длинный обучающий фильм. Не начинайте с рендера: начинайте с источника, структуры курса и короткого сквозного preview.

## Источники истины

1. `../study-guides/Math_I_Weeks_1-4_RU.pdf` — исходный PDF.
2. `reference/math1_w14_ru.txt` — извлечённый текст всех 42 страниц для проверки покрытия.
3. `make_math_masterclass.py` — authoring-логика этого курса, dedup и специальные сцены.
4. `content/math1_w14_ru.json` — генерируемый полный спек; не редактируйте его вручную поверх генератора.
5. `render_video.py` и `engine/` — общий движок. Предметный контент не должен hardcode'иться в движке.

## Неснижаемые требования

- Русский мастер-класс по всем неделям 1–4, целевой хронометраж **195 минут**; допустимый диапазон задачи — 3–4 часа.
- Все 123 worked examples сохранены. Повторный пример — новая быстрая проверка, а не повторение того же объяснения.
- Сначала вопрос и пауза для самостоятельной работы, затем решение и проверка ответа.
- Никакого filler-текста, замедленной речи или искусственных повторов ради длительности. Длительность выравнивается только `flex`-паузами после фактических TTS timings.
- Озвучка объясняет причину; экран показывает действие. Не читайте длинные списки, которые зритель может прочитать сам.
- Математические идеи визуализируются: график, function machine, squeeze-диаграмма, последовательность — не только словами.
- Все ресурсы локальные. Сцена обязана детерминированно рендериться через `window.__seek(t)` без зависимости от wall clock.

## Обязательный цикл

```bash
# 1. Schema + KaTeX + editorial + duplication QA
python3 video-pipeline-v3/validate_spec.py \
  video-pipeline-v3/content/math1_w14_ru.json

# 2. Короткий сквозной фильм перед дорогим полным рендером
python3 video-pipeline-v3/make_preview.py
python3 video-pipeline-v3/render_video.py \
  --spec video-pipeline-v3/content/math1_w14_v3_preview.json \
  --out video-pipeline-v3/out/preview \
  --workdir video-pipeline-v3/work/preview --workers 2

# 3. Полный TTS + audio + comp + DOM/KaTeX validation + frame plan, БЕЗ capture
python3 video-pipeline-v3/render_video.py \
  --spec video-pipeline-v3/content/math1_w14_ru.json \
  --out video-pipeline-v3/out/full \
  --workdir video-pipeline-v3/work/full --workers 2 --plan-only

# 4. Полный запуск / resume после успешного этапа 3
python3 video-pipeline-v3/render_video.py \
  --spec video-pipeline-v3/content/math1_w14_ru.json \
  --out video-pipeline-v3/out/full \
  --workdir video-pipeline-v3/work/full --workers 2 --skip-tts
```

Не используйте `--skip-tts` при изменении narration или при отсутствующем `times.json`. Не удаляйте checkpoints во время активного рендера.

## Definition of done

- `validate_spec.py`: `errors: []`, `warnings: []`.
- 294 блока, 123 examples, 119 questions, четыре предметные visual-сцены; при изменении курса числа пересчитываются, а не подгоняются.
- Все блоки проходят `validate_comp`: один видимый block, нет raw LaTeX, formula содержит KaTeX.
- MP4: 1920×1080, H.264 + AAC, faststart, ровно четыре главы, длительность 195 минут.
- Рядом находятся `.srt` и `.report.json`; `issues: []`.
- Просмотрены все контрольные stills и как минимум начало, середина каждой главы и конец MP4. Автоматический QA не заменяет визуальную и методическую ревизию.
- Секреты только в environment; не записывать токены в спек, metadata, dataset, Git или логи.

## Изменение движка

Сохраняйте checkpoint/resume, абсолютные пути, локальные KaTeX/шрифты, TTS timeout и fallback, screenshot retry, static-frame skipping и FFmpeg chapters. После изменения engine удалите соответствующий `comp`/`plan` checkpoint в отдельном тестовом workdir, не трогая готовый production output. Сначала повторите preview, затем `--plan-only`, и только потом полный capture.
