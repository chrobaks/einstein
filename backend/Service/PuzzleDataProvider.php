<?php

declare(strict_types=1);

namespace Backend\Service;

use JsonException;
use RuntimeException;

class PuzzleDataProvider
{
    private string $language;
    private array $puzzleData;
    private string $puzzleVersion;
    
    public function __construct(string $language, array $puzzleData)
    {
        $this->language = $language;
        $this->puzzleData = $puzzleData;
        $this->puzzleVersion = 'default';
    }
    
    public function getPuzzleData(): false|string
    {
        $data = [];

        if (
            isset($this->puzzleData[$this->puzzleVersion][$this->language])
        ) {
            $data = $this->puzzleData[$this->puzzleVersion][$this->language];
        }

        $payload = $data === [] ? new \stdClass() : $data;

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
}
