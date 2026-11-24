# Translation structure

## Scope

All application-owned interface text will be stored in `json/translation.json`.
This document defines the structure and keys for implementation in subsequent
steps. It does not introduce translations or change application behavior.

The file will have two top-level language objects: `de` and `en`. German is the
fallback language. Both objects must have the same keys and value types.
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

`GameTranslation` will load the dictionary before components first render
translated text. A language change will update static text and notify dynamic
components without recreating the game or resetting its state. The page's
`lang` attribute and document title will follow the selected language.

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
Both pages have their own language controls; persistence follows in step 6.
