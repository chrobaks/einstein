# Translation structure

## Scope

All application-owned interface text will be stored in `json/translation.json`.
This document describes the dictionary structure, page bindings, and dynamic
translation lifecycle. Registration messages and language persistence are implemented.

The file will have two top-level language objects: `de` and `en`. The fallback language is configured centrally; the current configuration uses
German. Both objects must have the same keys and value types.
Keys use English camelCase and describe meaning rather than the current wording.
Dot-separated paths, for example `game.buttons.start`, identify nested values
within the selected language object.

## Text keys

| Area | Keys within each language | Current source |
| --- | --- | --- |
| Shared branding and footer | `common.brand`, `common.footer.projectDescription`, `common.footer.history`, `common.footer.sourceLabel`, `common.footer.shortDescription` | `index.html`, `hof.html` |
| Language selection | `common.languages.de`, `common.languages.en` | `index.html` |
| Page titles | `landing.pageTitle`, `hallOfFame.pageTitle` | HTML `title` elements |
| Introduction | `landing.title`, `landing.legend`, `landing.challenge` | `index.html` |
| Motivation | `landing.motivation.title`, `landing.motivation.lead`, `landing.motivation.description`, `landing.motivation.towelNote`, `landing.motivation.tipsLead`, `landing.motivation.tipsDescription` | `index.html` |
| Rules | `landing.rules.title`, `landing.rules.goalTitle`, `landing.rules.goal`, `landing.rules.iconsTitle`, `landing.rules.categoriesIntro`, `landing.rules.assign`, `landing.rules.replace`, `landing.rules.remove` | `index.html` |
| Landing page tips | `landing.tips.title`, `landing.tips.reminder` | `index.html` |
| Start invitation | `landing.ready.title`, `landing.ready.description`, `landing.buttons.start` | `index.html` |
| Game buttons | `game.buttons.start`, `game.buttons.stop` | `GameApp.js`, `GameButton` |
| Help | `game.help.title`, `game.help.errorCountLabel`, `game.help.stop` | `GameApp.js`, `HelpButton` |
| Result dialog | `game.dialog.errorCount.one`, `game.dialog.errorCount.other`, `game.dialog.reassurance`, `game.dialog.description`, `game.dialog.retry` | `GameApp.js`, `GameDialog` |
| Instructions | `game.instructions.origin`, `game.instructions.goal`, `game.instructions.assign`, `game.instructions.check`, `game.instructions.restart` | `GameConfig.js`, `CONTENT.instruction` |
| Puzzle clues | `game.clues.group1`, `game.clues.group2`, `game.clues.group3` | `index.html` and `GameConfig.js`, `CONTENT.notice` |
| Category names | `game.categories.country`, `game.categories.color`, `game.categories.animal`, `game.categories.drink`, `game.categories.sport` | `GameConfig.js`, `TEXT_ALIAS`; category list in `index.html` |
| Item names | `game.items.<itemId>` for each ID listed below | `GameConfig.js`, `ITEMS` and `TEXT_ALIAS`; `GameApp.js`, `GameInfo` |
| Registration | `registration.title`, `registration.congratulations`, `registration.invitation`, `registration.fields.email.label`, `registration.fields.email.hint`, `registration.fields.name.label`, `registration.fields.name.hint`, `registration.buttons.save`, `registration.buttons.hallOfFame` | `index.html` |
| Registration messages | `registration.messages.required`, `registration.messages.success`, `registration.messages.invalid`, `registration.messages.saveFailed` | `GameRegistration.js`, `backend/game.php` |
| Hall of Fame | `hallOfFame.title`, `hallOfFame.columns.name`, `hallOfFame.columns.date` | `hof.html` |

Instruction entries are objects with `title` and `text` strings.
Clue groups are objects with a `title` string and an `items` array of five strings.
The landing page and the game use the same clue groups to avoid duplicate text.

Item IDs remain exactly as used by the game:

| Category | Item IDs |
| --- | --- |
| `country` | `norwegen`, `daenemark`, `england`, `deutschland`, `italien` |
| `color` | `gelb`, `blau`, `rot`, `gruen`, `weiss` |
| `animal` | `katze`, `pferd`, `vogel`, `fisch`, `hund` |
| `drink` | `wasser`, `wein`, `milch`, `kaffe`, `bier` |
| `sport` | `laufen`, `fussball`, `ringen`, `turnen`, `rudern` |

## Rendering conventions

- Use plain text by default, rendered with `textContent`.
- Keep headings, paragraphs, lists, buttons and links in the HTML or component
  rendering code. Do not store entire interface sections in translated strings.
- Selected editorial strings may contain inline `<strong>` and `<small>` markup
  where needed to preserve emphasis. Treat these explicitly as trusted HTML
  from the maintained translation file; never interpolate user input into HTML.
- Keep link URLs and brand link labels in the markup. Split footer paragraphs
  around inline links into named text parts when implementing them, so their
  order can differ between languages without embedding links in JSON.
- Use `{count}` in `game.dialog.errorCount.one` and `.other`. Choose `.one` for
  a count of 1 and `.other` for all other counts in German and English.
- Future translated attributes such as `aria-label`, `title` or `placeholder`
  receive explicit keys for their meaning rather than being inferred from IDs.
- Missing entries fall back to the German entry. If that entry is also missing,
  expose the key and log a diagnostic rather than displaying an empty string.

## Boundaries and integration

Only displayed labels are translated. Category IDs, item IDs, selectors, event
names, asset paths, request parameters and solution data stay unchanged.
Player names and email addresses are user data and are not translated.
Date formatting is handled separately from translation strings.
Developer console diagnostics do not belong to this interface dictionary.

`GameTranslation` loads the dictionary before `MainApp` constructs game
components. Language changes update static text and notify dynamic components
without recreating the game. The page's `lang` attribute and document title
follow the selected language.

Backend registration responses will eventually provide a stable message code
(`success`, `invalid` or `saveFailed`), mapped by the frontend to the corresponding
`registration.messages` key. The backend will continue to validate input.

## Implementation sequence

1. Define structure and keys (this document).
2. Create `json/translation.json` with `landing.buttons.start`,
   `game.buttons.start` and `game.buttons.stop` in both languages.
3. Add dictionary loading, lookup and fallback handling.
4. Connect static HTML text and complete its dictionary entries.
5. Connect dynamic game text while preserving game state.
6. Complete shared instructions, clues, backend messages and language persistence;
   verify both languages and missing-key handling.

Each step is intended to be reviewed and committed separately.

## Static page binding

`data-trans-key` identifies plain text elements, including page titles.
`data-trans-html` is reserved for maintained editorial HTML (currently the goal
sentence with its emphasized fish). It must never contain user-supplied data.
The dictionary is applied after loading and whenever a language button changes
selection. Existing form fields, links, and game containers are preserved.

The footer uses `common.footer.projectDescription` and `common.footer.idea`
around the existing brand link. Landing-page category labels currently use
`landing.rules.categories.<categoryId>`, including the explanatory internal IDs.
Clue list entries use numeric paths such as `game.clues.group1.items.0`.
Language labels stay in their native language (Deutsch and English).
Both pages have their own language controls and restore the saved language.


## Implemented dynamic lifecycle

`TRANSLATION_CONFIG` in `GameConfig.js` defines `langs`, `default`, `fallback`,
and `url`. Both HTML entry points use this configuration. An unsupported default
uses the fallback with a warning; an invalid fallback, URL, or language list
raises a configuration error.

`MainApp.ready` resolves to a boolean. Initialization waits for
`GameTranslation.ready` before constructing the game. The start button stays
disabled until initialization succeeds. Load failures retain the static landing
page and display a bilingual error message without requiring the dictionary.

`MainApp` passes its translation instance to `GameApp`, which stores it as
`translationHandler` and passes it to the five text-producing components.
`GameApp` subscribes once with `onLanguageChange(callback)` and refreshes
`GameInstruction`, `GameButton`, `HelpButton`, `GameInfo`, and `GameDialog`.
The subscription lasts for the page lifetime. The returned unsubscribe function
is not stored because the application creates one game and does not replace it.

`getText(key, parameters = {})` returns a string from the selected language or
configured fallback. Missing entries return the key and log a diagnostic.
Placeholder replacement is literal, leaves unknown placeholders unchanged, and
also applies to fallback strings. Dialogs use `{count}` and select `.one` for 1
and `.other` for all other numeric counts in the supported languages.

Instruction order remains in JavaScript. Instructions use title/text entries;
clues use the same three groups of five strings as the landing page. JavaScript
creates block containers, headings, and actual `ul`/`li` elements using
`textContent`. A section change resets scroll; a language refresh restores the
previous offset, subject to the available rendered content height.

`GameInfo` stores category and item IDs, translating only their labels. Help
labels and dialog labels update existing elements and preserve counters,
visibility, and click handlers. The start/stop label follows the current game
state. Language changes do not dispatch game-control events.

`CONTENT`, `TEXT_ALIAS`, and their `GameUi.config` properties have been removed.
`GAME_CONF` now contains `[VIEW_ID, ITEMS, COLOR_FILTER]`.

## Verification on 2026-11-25

Automated checks passed for:

- Syntax of every JavaScript file and resolution of all static HTML keys.
- Matching German/English dictionary paths and types.
- Five instructions, three groups of five clues, all five categories and 25 items.
- Repeated language changes across all five dynamic components, preserving
  instruction mode/scroll offset, selected IDs, start/help state, error count,
  and dialog visibility in a lightweight DOM simulation.
- No extra game events or duplicate retry handlers during those refreshes.
- Counts 0, 1, and multiple errors, literal placeholders, fallback, missing keys,
  and unsubscription.
- Removal of legacy content/alias consumers and whitespace validation.

Earlier focused checks also covered delayed initialization, language selection
while loading, and HTTP/network/JSON/configuration failures. The combined checks
above use a simulated DOM; they do not verify browser layout or real pointer
interactions. An attempt to open a temporary local PHP server in the available
browser failed with `ERR_CONNECTION_REFUSED`. Browser acceptance therefore
remains pending; see the roadmap checklist.

Registration messages and language persistence were subsequently implemented
as described below. Date formatting remains unchanged.


## Registration messages and language persistence

`GameRegistration` receives the existing translation service on both pages.
It fetches the user list only when its container contains a table body, as on
the Hall of Fame page. The main-page registration form makes no user-list request.
It stores a message code and translates it through `registration.messages`.
Language changes refresh the current message without altering form input.
Messages are rendered with `textContent`, not server-provided HTML.

The registration endpoint now returns `{status, code}` instead of `{status, msg}`.
Its codes are `success`, `invalid`, and `saveFailed`; statuses remain `success`
and `error`. Frontend validation uses `required`. Network, HTTP, malformed JSON,
and unexpected response codes use `requestFailed`; user-list failures use
`listFailed`. Deploy frontend and backend together because this response contract
has changed. Backend field validation and solution checking remain in place.
The user-list path is resolved relative to the PHP file with `__DIR__`.

`TRANSLATION_CONFIG.storageKey` is `einstein.language`. A supported language
saved in localStorage takes precedence over the default during construction.
Unknown saved languages are ignored. Valid language changes are saved before
listeners run. Storage access failures emit a warning and leave the current-page
language switch usable. Only the language code is stored; no form data is saved.
Preferences apply to pages on the same origin (scheme, host, and port).

The Hall of Fame waits for dictionary readiness before constructing registration
and list handling. Dictionary failures show a static bilingual error message.

Focused automated checks passed for registration message codes and language
refreshes, HTTP/network/JSON/unexpected-response failures, persistence restoration,
unknown saved languages, and blocked storage. PHP checks exercised invalid input,
success, and write failure using temporary storage, without modifying the actual
Hall of Fame file. All JavaScript syntax and PHP syntax checks passed.
Browser layout and real end-to-end form interaction remain subject to the manual
acceptance checklist. Existing Hall-of-Fame dates retain their stored format.
