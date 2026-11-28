<?php

declare(strict_types=1);

use backend\Service\LanguageProvider;
use backend\Service\PuzzleDataProvider;
use const backend\config\APP_SUPPORTED_LANGUAGES;
use const backend\config\DEFAULT_LANG;

require_once __DIR__ . '/config/config_default.php';
require_once __DIR__ . '/Service/LanguageProvider.php';
require_once __DIR__ . '/Service/PuzzleDataProvider.php';

$puzzleData = require __DIR__ . '/data/puzzle/PuzzleData.php';

$languagesConfig = [
    'default_lang' => DEFAULT_LANG,
    'languages' => APP_SUPPORTED_LANGUAGES
];

$appLang = LanguageProvider::getLanguage($languagesConfig);

$puzzleDataProvider = new PuzzleDataProvider($appLang, $puzzleData);

return [
    'language' => $appLang,
    'translationConfig' => LanguageProvider::getTranslationConfig($languagesConfig),
    'puzzleData' => $puzzleDataProvider->getPuzzleData(),
    'puzzleJsonId' => $puzzleDataProvider->getPuzzleJsonId(),
    'puzzleVariantId' => $puzzleDataProvider->getPuzzleVariantId(),
];
