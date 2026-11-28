<?php

declare(strict_types=1);

$projectRoot = dirname(__DIR__);
$view = require $projectRoot . '/backend/bootstrap.php';
$solutionData = require $projectRoot . '/backend/data/solution/SolutionData.php';

function assertSameValue(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        throw new RuntimeException(sprintf(
            "%s\nExpected: %s\nActual: %s",
            $message,
            var_export($expected, true),
            var_export($actual, true),
        ));
    }
}

function requestSolutionEndpoint(string $endpointPath, array $payload): array
{
    $childCode = sprintf(
        '$endpoint = %s; $_POST = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR); '
        . '$_SERVER["CONTENT_TYPE"] = "application/json"; require $endpoint;',
        var_export($endpointPath, true),
    );
    $process = proc_open(
        [PHP_BINARY, '-r', $childCode],
        [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ],
        $pipes,
    );

    if (!is_resource($process)) {
        throw new RuntimeException('Could not start the solution endpoint process.');
    }

    fwrite($pipes[0], json_encode($payload, JSON_THROW_ON_ERROR));
    fclose($pipes[0]);
    $responseBody = stream_get_contents($pipes[1]);
    $errorOutput = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $exitCode = proc_close($process);

    if ($exitCode !== 0) {
        throw new RuntimeException(sprintf('The solution endpoint failed: %s', trim($errorOutput)));
    }

    $response = json_decode($responseBody, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($response)) {
        throw new RuntimeException('The solution endpoint returned an unexpected response.');
    }

    return $response;
}

function runSolutionVariantTest(array $view, array $solutionData, string $projectRoot): void
{
    $variantId = $view['puzzleVariantId'] ?? null;
    if (!is_string($variantId) || $variantId === '') {
        throw new RuntimeException('The bootstrap did not provide a puzzle variant ID.');
    }

    $variantSolution = $solutionData['variants'][$variantId] ?? null;
    if (!is_array($variantSolution)) {
        throw new RuntimeException(sprintf('No solution data exists for puzzle variant "%s".', $variantId));
    }

    $endpointPath = $projectRoot . '/backend/game.php';
    $correctPayload = ['act' => 'solution', 'puzzleVariantId' => $variantId];
    foreach ($variantSolution as $houseId => $items) {
        $correctPayload[$houseId] = implode(',', $items);
    }

    $correctResult = requestSolutionEndpoint($endpointPath, $correctPayload);
    assertSameValue(0, $correctResult['errors'] ?? null, 'A correct board should have no placement errors.');
    assertSameValue(25, $correctResult['matches'] ?? null, 'A complete board should contain 25 checked items.');

    $incorrectPayload = $correctPayload;
    $houseOneItems = explode(',', $incorrectPayload['house1']);
    $houseTwoItems = explode(',', $incorrectPayload['house2']);
    [$houseOneItems[0], $houseTwoItems[0]] = [$houseTwoItems[0], $houseOneItems[0]];
    $incorrectPayload['house1'] = implode(',', $houseOneItems);
    $incorrectPayload['house2'] = implode(',', $houseTwoItems);

    $incorrectResult = requestSolutionEndpoint($endpointPath, $incorrectPayload);
    assertSameValue(2, $incorrectResult['errors'] ?? null, 'Swapping two house assignments should produce two placement errors.');
    assertSameValue(25, $incorrectResult['matches'] ?? null, 'A complete but incorrect board should still check 25 items.');

    $missingVariantResult = requestSolutionEndpoint($endpointPath, ['act' => 'solution']);
    assertSameValue('error', $missingVariantResult['status'] ?? null, 'A missing variant ID should return a JSON error response.');
    assertSameValue('missingPuzzleVariantId', $missingVariantResult['code'] ?? null, 'A missing variant ID should have a stable error code.');

    $unknownVariantResult = requestSolutionEndpoint($endpointPath, [
        'act' => 'solution',
        'puzzleVariantId' => 'unknown-variant',
    ]);
    assertSameValue('error', $unknownVariantResult['status'] ?? null, 'An unknown variant ID should return a JSON error response.');
    assertSameValue('unknownPuzzleVariantId', $unknownVariantResult['code'] ?? null, 'An unknown variant ID should have a stable error code.');
}

try {
    runSolutionVariantTest($view, $solutionData, $projectRoot);
    fwrite(STDOUT, "PASS: solution variant checks and variant ID errors return valid JSON.\n");
} catch (Throwable $exception) {
    fwrite(STDERR, sprintf("FAIL: %s\n", $exception->getMessage()));
    exit(1);
}
