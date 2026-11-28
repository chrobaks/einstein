<?php

declare(strict_types=1);

namespace Backend\Service;

use JsonException;
use RuntimeException;

class PuzzleDataProvider
{
    private string $language;
    private array $puzzleData;
    private string $puzzleVariantId;
    
    public function __construct(string $language, array $puzzleData)
    {
        $this->language = $language;
        $this->puzzleData = $puzzleData;
        $this->puzzleVariantId = $this->selectPuzzleVariantId();
    }
    
    public function getPuzzleData(): string
    {
        $payload = $this->buildTranslationPayload();

        try {
            return json_encode(
                $payload,
                JSON_HEX_TAG
                | JSON_HEX_AMP
                | JSON_HEX_APOS
                | JSON_HEX_QUOT
                | JSON_THROW_ON_ERROR,
            );
        } catch (JsonException $exception) {
            throw new RuntimeException(
                'Puzzle data could not be encoded as JSON.',
                0,
                $exception,
            );
        }
    }

    public function getPuzzleJsonId(): string
    {
        return 'puzzleJsonId-' . date('Y-m-d_H:i:s');
    }

    public function getPuzzleVariantId(): string
    {
        return $this->puzzleVariantId;
    }

    private function selectPuzzleVariantId(): string
    {
        $variants = $this->puzzleData['variants'] ?? [];
        $sharedTranslations = $this->puzzleData['shared'] ?? [];
        $languages = array_keys($sharedTranslations);
        $availableVariantIds = [];

        if (!in_array($this->language, $languages, true)) {
            throw new RuntimeException(
                sprintf('No shared translations are available for language "%s".', $this->language),
            );
        }

        foreach ($variants as $variantId => $translations) {
            $hasCompleteTranslations = $languages !== [];

            foreach ($languages as $language) {
                $languageVariant = $translations[$language] ?? null;
                $clues = is_array($languageVariant)
                    ? ($languageVariant['game']['clues'] ?? null)
                    : null;

                if (!is_array($clues)) {
                    $hasCompleteTranslations = false;
                    break;
                }
            }

            if ($hasCompleteTranslations) {
                $availableVariantIds[] = (string) $variantId;
            }
        }

        if ($availableVariantIds === []) {
            throw new RuntimeException(
                sprintf('No puzzle variant is available for language "%s".', $this->language),
            );
        }

        $selectedIndex = random_int(0, count($availableVariantIds) - 1);

        return $availableVariantIds[$selectedIndex];
    }

    private function buildTranslationPayload(): array
    {
        $payload = [];
        $sharedTranslations = $this->puzzleData['shared'] ?? [];
        $variantTranslations = $this->puzzleData['variants'][$this->puzzleVariantId] ?? [];

        foreach ($sharedTranslations as $language => $sharedData) {
            $languageData = $sharedData;
            $languageData['game']['clues'] = $variantTranslations[$language]['game']['clues'];
            $payload[$language] = $languageData;
        }

        if ($payload === []) {
            throw new RuntimeException('No translations are available for the selected puzzle variant.');
        }

        return $payload;
    }
}
