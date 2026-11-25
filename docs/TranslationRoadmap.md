# Translation roadmap

## Objective and current state

Continue the translation work by migrating dynamic game text to
`json/translation.json`. This roadmap expands step 5 of
[translation.md](translation.md) and describes the remaining integration work.
It is a plan, not an implementation record.

Static page translation and dictionary loading already exist. The current
working changes introduce `TRANSLATION_CONFIG` in `GameConfig.js` and pass it
through `MainApp` and the Hall of Fame entry point. Dynamic game components
still use hard-coded text, `CONTENT`, and `TEXT_ALIAS`.

Each numbered step should form a reviewable change and a separate commit after
verification. Suggested messages use the `feature/translation:` prefix.

## Design decisions

- Create one `GameTranslation` instance per page. Pass the existing instance
  through constructors; do not create additional instances for game components.
- Store the service as `GameApp.translationHandler`. Its
  `setGameObjectsInstance()` method reads that property and needs no additional
  parameter.
- Pass the service to `GameInstruction`, `GameButton`, `HelpButton`, `GameInfo`,
  and the active `GameDialog` class defined inside `GameApp.js`.
- Keep `getText(key)` restricted to strings with fallback handling. Do not use
  the lower-level `getTranslationValue()` to bypass that handling in components.
- Keep section order and rendering structure in JavaScript. The dictionary
  contains labels, paragraphs, and clue strings, not `<ul>` or `<li>` wrappers.
- Use a small subscription API on `GameTranslation` for language changes.
  `GameApp` subscribes once and calls component `updateTranslations()` methods.
  Components do not each subscribe independently.
- Language changes update text without simulating button clicks, recreating the
  game, submitting requests, or resetting houses, counters, and active views.

## Step 1: Complete central translation configuration

### Procedure

1. Review and preserve the existing `TRANSLATION_CONFIG` wiring in `MainApp`,
   `index.html`, and `hof.html`.
2. Add `fallback` and `url` alongside `langs` and `default`.
3. Make `GameTranslation` use these values for loading, dictionary validation,
   initial language selection, fallback lookup, and diagnostics.
4. Validate that default and fallback languages are supported. Handle invalid
   configuration explicitly rather than leaving the language buttons unusable.

### Verification

Both pages load the configured URL and select the configured default language.
A missing selected-language text uses the configured fallback. Invalid
configuration produces an understandable diagnostic.

Suggested commit: `feature/translation: Centralize translation configuration`

## Step 2: Establish initialization and notification lifecycle

### Procedure

1. Add an asynchronous initialization method to `MainApp`; constructors remain
   synchronous. Expose its promise as `MainApp.ready`.
2. Wait for `GameTranslation.ready` before creating components that immediately
   request translated text. Handle its `false` result explicitly: retain the
   static page and report initialization failure without constructing a partial
   game or displaying untranslated key paths as a working game.
3. Keep the start control disabled until initialization succeeds. On failure,
   keep it disabled and provide a visible loading-error message, using a small
   static fallback because the dictionary itself may be unavailable.
4. Add `onLanguageChange(callback)` with an unsubscribe function. Notify once
   after a valid language change; do not notify for a click on the active language.
5. Keep existing static-page translation working. A selection made while the
   dictionary loads must also determine the initial dynamic component language.

### Verification

Slow loading cannot start an uninitialized game. HTTP, network, and JSON errors
are handled without an unhandled rejection. Repeated language clicks do not
produce duplicate notifications. Both page entry points continue to work.

Suggested commit: `feature/translation: Coordinate translation readiness and language changes`

## Step 3: Pass the service to GameApp and GameInstruction

### Procedure

1. Pass `this.GameTranslation` from `MainApp` to `GameApp` and store it as
   `this.translationHandler`.
2. Pass `this.translationHandler` to `GameInstruction` from
   `setGameObjectsInstance()`; store it in the instruction instance.
3. Give `GameInstruction` an `updateTranslations()` method. Initially this can
   delegate to its existing rendering; the next step migrates its data source.
4. Subscribe once in `GameApp` after its components exist. Initially refresh
   `GameInstruction`; extend this central refresh as other components migrate.
5. Keep the subscription for the page lifetime; no unsubscribe property is
   needed while the application creates only one game instance. If instance
   replacement is introduced later, retain and call the returned unsubscribe
   function then. Do not attach fresh subscriptions during rendering.

### Verification

`MainApp`, `GameApp`, and `GameInstruction` reference the same service instance.
One language change causes one refresh. Normal game startup still works.

Suggested commit: `feature/translation: Inject translation service into game instructions`

## Step 4: Migrate instructions and clues and remove CONTENT

### Procedure

1. Add `game.instructions.origin`, `goal`, `assign`, `check`, and `restart` in
   both languages, each with `title` and `text` string entries.
2. Keep their ordered IDs in JavaScript. Retrieve individual strings through
   `getText('game.instructions.<id>.title')` and the matching `.text` key.
3. Reuse the existing `game.clues.group1`, `group2`, and `group3` entries for
   `notice`. Keep the mapping `instruction` to instructions and `notice` to
   clues explicit; these state names are not translated.
4. Render three clue groups, each with five entries. Create `<ul>` and `<li>`
   elements with `GameUi.getElement()` and fill them with `textContent`.
   Do not move the old HTML strings into JSON. Use a valid block container
   around each heading and list, rather than nesting a `<ul>` inside a `<p>`.
5. Store the current `contentKey`. Separate a real section change from a
   language-only refresh: reset scroll for section changes, preserve the current
   scroll offset where possible during translation (subject to content height).
6. In this same change, remove `const CONTENT`, its entry in `GAME_CONF`, the
   parameter in `GameApp.setConfig()`, and the `content` property assignment.
   Search the project for remaining consumers before removing them.

### Verification

Before starting, five instructions appear; during play, three groups containing
15 clues appear. Both languages work in either state. Landing-page and game
clues use the same dictionary entries. Language changes preserve the current
section and do not reset the board. No `GameUi.config.content` consumer remains.

Suggested commit: `feature/translation: Migrate instructions and clues to translation dictionary`

## Step 5: Translate GameButton

### Procedure

1. Pass and store the service in `GameButton`.
2. Select `game.buttons.start` or `game.buttons.stop` from `gameIsStart`.
3. Route initial rendering, real button-state changes, and
   `updateTranslations()` through the same label-update method.
4. Extend the central `GameApp` translation refresh to include this component.

### Verification

Start and stop labels follow both language and game state. Translating a running
game does not emit `clickGameButton`, reset the board, or change `gameIsStart`.

Suggested commit: `feature/translation: Translate game start and stop labels`

## Step 6: Translate HelpButton

### Procedure

1. Pass and store the service in `HelpButton`.
2. Add `game.help.title`, `game.help.errorCountLabel`, and `game.help.stop` in
   both languages.
3. Keep references to label elements and the existing numeric counter. Update
   labels individually; do not replace a parent element containing the counter.
4. Add `updateTranslations()` and include it in the central refresh. Track the
   latest error count consistently when `setErrorCounter()` is called.

### Verification

Translate with help open and closed and with a nonzero count. The active layer,
`playWithHelp`, counter, and existing event listeners remain unchanged.

Suggested commit: `feature/translation: Translate game help labels`

## Step 7: Translate GameInfo and retire TEXT_ALIAS

### Procedure

1. Pass and store the service in `GameInfo`.
2. Add all five `game.categories.<categoryId>` labels and all 25
   `game.items.<itemId>` labels in both languages.
3. Store the currently displayed category and item IDs separately from their
   labels. `setContent()` updates these IDs; clearing the info also clears them.
4. Render labels through `getText()`. `updateTranslations()` uses the stored
   IDs so the current selection changes language without another drag action.
5. Include `GameInfo` in the central refresh. After checking all consumers,
   remove `TEXT_ALIAS`, its configuration parameter, and `GameUi.config.textAlias`.

### Verification

Every category and item has a valid label in both languages. Empty info stays
empty. Switching language updates visible info without changing internal IDs,
image paths, drag state, or solution-check requests.

Suggested commit: `feature/translation: Translate category and item information`

## Step 8: Translate GameDialog and error counts

### Procedure

1. Pass and store the service in the `GameDialog` class actually instantiated
   by `GameApp`. Do not modify the separate unused `GameDialog.js` as a substitute.
2. Add `game.dialog.reassurance`, `description`, `retry`, and
   `errorCount.one` / `errorCount.other` in both languages.
3. Extend `getText(key, parameters = {})` with literal placeholder replacement
   for values such as `{count}` while preserving existing single-argument calls.
   Insert the resulting dialog strings with `textContent`.
4. Store the latest error count. Select `.one` for 1 and `.other` for 0 and
   other counts in German and English.
5. Construct dialog elements and listeners once. Add `updateTranslations()`
   to change their content without opening, closing, or recreating the dialog.
6. Include the dialog in the central refresh.

### Verification

Counts 0, 1, and multiple errors display correctly. An open dialog stays open
while changing language; a closed one stays closed. Retry still fires its
existing action exactly once. Counts are preserved.

Suggested commit: `feature/translation: Translate result dialog and error counts`

## Step 9: Verify the complete dynamic translation flow

### Procedure

1. Verify matching dictionary keys and types in both languages and check every
   newly used key. Exercise missing-key and fallback behavior.
2. Run JavaScript syntax checks and whitespace checks. Perform focused behavior
   checks for startup, language notifications, placeholders, and state retention.
3. Check both pages in the browser. Exercise start, stop, help, icon assignment,
   replacement, removal, error dialogs, and transition to registration.
4. Update translation documentation to describe the implemented lifecycle and
   the removal of `CONTENT` and `TEXT_ALIAS`. Record any remaining limitations.

### Verification

Language changes preserve houses, icon positions, start state, help state,
error count, instruction mode, dialog visibility, and entered form data. No
duplicate listeners, initialization errors, or missing-key diagnostics occur
during normal use. Longer English labels remain usable in the current layout.

Suggested commit: `feature/translation: Document and verify dynamic translation flow`

## Subsequent work: Original step 6

After dynamic game translation is complete, handle registration messages,
backend message codes, and language persistence between reloads and the Hall of
Fame. Review date localization separately. These tasks remain outside the
component migration above and should receive their own reviewable changes.


## Progress and acceptance status (2026-11-25)

Steps 1–8 are implemented. Step 9 automated component/dictionary checks and
lifecycle documentation are complete. Browser acceptance is pending because the
available browser could not reach the temporary local PHP server
(`ERR_CONNECTION_REFUSED`). No browser or visual pass is claimed.

### Browser acceptance checklist

Run with a local HTTP/PHP server, not a file URL. On both `index.html` and
`hof.html`, verify German/English headings, page title, language controls, and
absence of unexpected console diagnostics.

- Start the game, switch languages repeatedly, and stop it. Confirm the correct
  button label, five instructions before play, and 15 clues during play.
- Assign, replace, and remove icons using the mouse. Switch languages with a
  partially filled board and check that houses, images, and positions stay put.
- Open help, produce a nonzero error count, and switch languages. Verify the
  active help layer and counter remain intact.
- Produce an incorrect completed solution. Switch languages with its dialog
  open, check the count and translated labels, then retry exactly once.
- Complete the correct solution to reach registration. Enter test form values
  without submitting; switch languages and confirm input values remain intact.
- Scroll the clues, change language, and check the current section/scroll
  position. Check longer English labels for clipping and overlap.
- Simulate a failed dictionary request in browser developer tools. Reload and
  verify that the start button stays disabled and a visible error appears.

Keep real Hall-of-Fame writes out of these translation checks. Record browser
results before marking step 9 fully accepted.


## Subsequent work implemented (2026-11-25)

Registration messages now use dictionary entries and backend message codes.
The current message updates on language changes. Request and user-list failures
have translated messages. The language preference is saved and restored through
localStorage on both pages, with validation and graceful handling of blocked
storage. Focused JavaScript and isolated PHP backend checks passed; real
Hall-of-Fame data was not changed. Date localization remains deferred.

Additional browser acceptance checks:

- Select English, reload, and open the Hall of Fame on the same origin; English
  should remain selected. Switch to German there and reload the main page.
- Trigger required/invalid registration messages and switch languages without
  losing field values. Use a disposable test environment for actual submissions.
- Verify translated request errors when the backend is unavailable and the
  visible Hall-of-Fame loading error when its dictionary cannot load.

The browser acceptance status above remains pending; automated checks do not
replace that visual and interactive verification.
