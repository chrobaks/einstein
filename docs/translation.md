# Translation structure

## Current data flow

For the puzzle page, `backend/data/puzzle/PuzzleData.php` is the source for
shared texts and puzzle-variant texts. `shared` contains stable interface and
game text per language. `variants.<variantId>` contains variant-dependent
content, currently the clue groups per language. `PuzzleDataProvider` selects
a variant, inserts its clues into the shared dictionary for each language,
then encodes the complete language map as JSON. `index.php` embeds that JSON
once in an `application/json` script element. `GameTranslation` reads it by
element ID.

The standalone Hall of Fame uses the smaller `json/hof_translation.json` file.
The former `json/translation.json` is not loaded by either page. Language
changes are not stored in `localStorage`.

## Scope

This document describes the current dictionary structure, page bindings, and
translation lifecycle. The puzzle page sends both supported language
dictionaries so `GameTranslation` can switch languages without another request.

The final JSON has two top-level language objects: `de` and `en`. Both objects
must have the same keys and value types. The shared dictionary and each puzzle
variant must provide matching structures for both languages.
Keys use English camelCase and describe meaning rather than the current wording.
Dot-separated paths, for example `game.buttons.start`, identify nested values
within the selected language object.

## Text keys

| Area | Keys within each language | Current source |
| --- | --- | --- |
| Shared branding and footer | `common.brand`, `common.footer.projectDescription`, `common.footer.history`, `common.footer.sourceLabel`, `common.footer.shortDescription` | `PuzzleData.php` shared; `hof_translation.json` for Hall of Fame |
| Language selection | `common.languages.de`, `common.languages.en` | Shared puzzle data and `hof_translation.json` |
| Page titles | `landing.pageTitle`, `hallOfFame.pageTitle` | Shared puzzle data and `hof_translation.json` |
| Introduction | `landing.title`, `landing.legend`, `landing.challenge` | `PuzzleData.php` shared; `index.php` bindings |
| Motivation | `landing.motivation.title`, `landing.motivation.lead`, `landing.motivation.description`, `landing.motivation.towelNote`, `landing.motivation.tipsLead`, `landing.motivation.tipsDescription` | `PuzzleData.php` shared; `index.php` bindings |
| Rules | `landing.rules.title`, `landing.rules.goalTitle`, `landing.rules.goal`, `landing.rules.iconsTitle`, `landing.rules.categoriesIntro`, `landing.rules.assign`, `landing.rules.replace`, `landing.rules.remove` | `PuzzleData.php` shared; `index.php` bindings |
| Landing page tips | `landing.tips.title`, `landing.tips.reminder` | `PuzzleData.php` shared; `index.php` bindings |
| Start invitation | `landing.ready.title`, `landing.ready.description`, `landing.buttons.start` | `PuzzleData.php` shared; `index.php` bindings |
| Game buttons | `game.buttons.start`, `game.buttons.stop` | `GameApp.js`, `GameButton` |
| Help | `game.help.title`, `game.help.errorCountLabel`, `game.help.stop` | `GameApp.js`, `HelpButton` |
| Result dialog | `game.dialog.errorCount.one`, `game.dialog.errorCount.other`, `game.dialog.reassurance`, `game.dialog.description`, `game.dialog.retry` | `GameApp.js`, `GameDialog` |
| Instructions | `game.instructions.origin`, `game.instructions.goal`, `game.instructions.assign`, `game.instructions.check`, `game.instructions.restart` | `PuzzleData.php` shared; `GameApp.js` |
| Puzzle clues | `game.clues.group1`, `game.clues.group2`, `game.clues.group3` | `PuzzleData.php` variant; `index.php` and `GameApp.js` |
| Category names | `game.categories.country`, `game.categories.color`, `game.categories.animal`, `game.categories.drink`, `game.categories.sport` | `PuzzleData.php` shared; `GameConfig.js` IDs; `GameApp.js` labels |
| Item names | `game.items.<itemId>` for each ID listed below | `PuzzleData.php` shared; `GameConfig.js` IDs; `GameApp.js` labels |
| Registration | `registration.title`, `registration.congratulations`, `registration.invitation`, `registration.fields.email.label`, `registration.fields.email.hint`, `registration.fields.name.label`, `registration.fields.name.hint`, `registration.buttons.save`, `registration.buttons.hallOfFame` | `PuzzleData.php` shared; `index.php` bindings |
| Registration messages | `registration.messages.required`, `registration.messages.success`, `registration.messages.invalid`, `registration.messages.saveFailed` | `PuzzleData.php` shared; `GameRegistration.js`, `backend/game.php` |
| Hall of Fame | `hallOfFame.title`, `hallOfFame.columns.name`, `hallOfFame.columns.date` | `json/hof_translation.json`; `hof.html` |

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
  from the maintained translation data; never interpolate user input into HTML.
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

The following sequence records the original translation refactor. It predates
the current `shared`/`variants` structure and is kept as historical context.

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
Both pages have their own language controls. Language changes are currently
kept in page memory and are not persisted across reloads.


## Implemented dynamic lifecycle

For the puzzle page, `index.php` receives the selected language and JSON element
ID from `backend/bootstrap.php`. The embedded payload contains the complete
`de`/`en` dictionary for the selected variant. `GameTranslation` reads that
payload by element ID. The Hall of Fame uses its own `hof_translation.json` URL
in its inline initialization config.

`MainApp.ready` resolves to a boolean. Initialization waits for
`GameTranslation.initialize()` before constructing the game. The start button stays
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

## Historical verification on 2026-11-25

These checks document the earlier client-side translation implementation.
They predate the current embedded puzzle payload and do not describe language
persistence, which is no longer implemented.

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

Registration messages were subsequently implemented as described below. Date
formatting remains unchanged.


## Registration messages and language selection

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

The main page initializes its language from the `lang` query parameter (or
`DEFAULT_LANG`). The Hall of Fame starts in its configured default language.
Language controls switch the current page's text and game labels; a reload
returns to the language selected by that page's initialization configuration.

The Hall of Fame waits for dictionary readiness before constructing registration
and list handling. Dictionary failures show a static bilingual error message.

Focused automated checks passed for registration message codes and language
refreshes, HTTP/network/JSON/unexpected-response failures, and PHP registration
responses. All JavaScript syntax and PHP syntax checks passed.
Browser layout and real end-to-end form interaction remain subject to the manual
acceptance checklist. Existing Hall-of-Fame dates retain their stored format.

## Puzzle payload verification on 2026-11-28

The `shared` and `variants.default` dictionaries were checked for matching
German and English key structures. The provider's merged JSON was parsed and
checked against the previous full dictionary structure, including all 62
translation keys bound in `index.php`. Browser layout and interaction remain
covered by the manual visual test.
