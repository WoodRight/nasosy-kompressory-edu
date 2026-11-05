# Насосы и компрессоры — учебное веб-пособие

Статический SPA (vanilla HTML/CSS/JS) на русском языке для студентов техвузов (ориентир — дисциплина УГНТУ «Насосы и компрессоры»).

## Быстрый старт (локально)

```bash
cd pumps-site
python3 -m http.server 8080
# открыть http://localhost:8080
```

Или просто открыть `index.html` в браузере (hash-роутинг работает и с `file://`).

## Разделы

1. Главная  
2. Классификация (+ SVG для печати)  
3. Динамические насосы  
4. Объёмные насосы  
5. Параметры (Q, H, N, η, NPSH, подобие)  
6. Компрессоры  
7. 3D и симуляторы (внешние интерактивные модели)  
8. Факты и парадоксы  
9. Мини-тест (10 вопросов)  
10. Литература  

## Деплой на Firebase Hosting

1. Установите Firebase CLI / войдите в аккаунт Google.  
2. В `.firebaserc` укажите свой `project_id`.  
3. Из этой папки:

```bash
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use YOUR_FIREBASE_PROJECT_ID
npx -y firebase-tools@latest deploy --only hosting
```

`firebase.json` уже настроен: `public` = текущая папка (`.`).

## Деплой на GitHub Pages

1. Залейте содержимое репозитория.  
2. Settings → Pages → Deploy from branch → `/` (root) или `/docs`, если скопируете файлы туда.  
3. Сайт будет доступен как `https://<user>.github.io/<repo>/`.

## Печать схем

Откройте раздел «Классификация» → Ctrl+P (альбомная ориентация).  
Файлы: `assets/classification.svg`, `assets/devices.svg`.

## Замечания по iframe

Часть внешних 3D (Alberta Oil, Engineers Universe и др.) может блокировать встраивание через `X-Frame-Options` / CSP. В интерфейсе есть кнопка **Открыть** (`target=_blank`) — она всегда работает. Для HowItWorks есть пробный iframe.

## Стек

- Без npm-сборки  
- Hash-роутинг (`#/classify` …)  
- Адаптивная вёрстка + `@media print`  
