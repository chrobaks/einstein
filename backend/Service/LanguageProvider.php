<?php

namespace backend\Service;

use JsonException;
use RuntimeException;
use const Backend\config\DEFAULT_LANG;

final class LanguageProvider
{

    private function __construct(){}

    public static function getLanguage(array $config): string
    {
        if (!self::validatedGetLang()) {
            return $config['default_lang'];
        }

        $getLang = trim($_GET['lang']);

        return (in_array($getLang, $config['languages'])) ? $getLang : $config['default_lang'];

    }

    public static function getTranslationConfig(array $config): false|string
    {
        $config = [
            'langs' => $config['languages'],
            'default' => $config['default_lang'],
            'fallback' => $config['default_lang'],
        ];

        try {
            return json_encode(
                $config,
                JSON_HEX_TAG
                | JSON_HEX_AMP
                | JSON_HEX_APOS
                | JSON_HEX_QUOT
                | JSON_THROW_ON_ERROR,
            );
        } catch (JsonException $exception) {
            throw new RuntimeException(
                'Translation config data could not be encoded as JSON.',
                0,
                $exception,
            );
        }
    }

    private static function validatedGetLang () : bool
    {
        return (
            isset($_GET['lang'])
            && is_string($_GET['lang'])
            && preg_match('/^[a-z]{2}(?:-[a-z]{2})?$/', $_GET['lang']) === 1);
    }
}
