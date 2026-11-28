<?php

class Game
{
    private array $userList;
    private array $filters;
    private array $solution;
    private string $jsonFile;

    public function __construct ()
    {
        $this->jsonFile = __DIR__ . '/../json/hall_of_fame.json';
        $this->userList = $this->getJsonUserList();
        $this->filters = [
            "name" => '/^[\w\s\d\.\(\)öüäÖÜÄß,;_-]{1,250}$/i',
            "email" => "email"
        ];
        $this->solution = require __DIR__ . '/data/solution/SolutionData.php';
    }

    public function getUserList (): array
    {
        return array_reverse($this->userList);
    }

    public function getSolutionCheck (): array
    {
        $errors = 0;
        $matches = 0;

        $puzzleVariantId = $_POST['puzzleVariantId'] ?? null;
        if (!is_string($puzzleVariantId) || trim($puzzleVariantId) === '') {
            return [
                'status' => 'error',
                'code' => 'missingPuzzleVariantId',
            ];
        }

        $variantSolution = $this->solution['variants'][$puzzleVariantId] ?? null;
        if (!is_array($variantSolution)) {
            return [
                'status' => 'error',
                'code' => 'unknownPuzzleVariantId',
            ];
        }

        foreach ($_POST as $key => $values) {
            if ($key === 'act' || $key === 'puzzleVariantId') {
                continue;
            }

            if (!isset($variantSolution[$key])) {
                return [
                    'status' => 'error',
                    'code' => 'unknownHouse',
                ];
            }

            if (!is_string($values)) {
                return [
                    'status' => 'error',
                    'code' => 'invalidHouseItems',
                ];
            }

            $values = trim($values);
            if ($values === '') {
                continue;
            }

            foreach (explode(',', $values) as $value) {
                if (!in_array($value, $variantSolution[$key], true)) {
                    $errors++;
                }
                $matches++;
            }
        }

        return ["errors" => $errors, "matches" => $matches];
    }

    public function setUser (): array
    {
        $user = [
            "name" => "",
            "email" => "",
            "date" => date('d.m.Y'),
            "isActive" => true
        ];
        $error = [];

        foreach($this->filters as $key => $reqEx) {
            if (isset($_POST[$key])) {
                if ($key === 'email') {
                    if (!filter_var($_POST[$key], FILTER_VALIDATE_EMAIL)) {
                        $error[] = $key;
                    } else {$user[$key] = $_POST[$key];}
                } else {
                    if (!preg_match($reqEx, $_POST[$key])) {
                        $error[] = $key;
                    } else {$user[$key] = $_POST[$key];}
                }
            } else {
                $error[] = $key;
            }
        }

        $response = [];
        $response["status"] = (empty($error)) ? "success" : "error";
        $response["code"] = (empty($error)) ? "success" : "invalid";

        if (empty($error)) {
            $this->userList[] = $user;
            if(!file_put_contents($this->jsonFile, json_encode($this->userList))) {
                $response["status"] = "error";
                $response["code"] = "saveFailed";
            }
        }

        return $response;
    }

    public function setRequest (): void
    {
        $this->setValidPost();
        $getAction = $_GET['act'] ?? '';
        $postAction = $_POST['act'] ?? '';

        if ($getAction === 'userList') {
            $this->sendJson($this->getUserList());
        } else if ($postAction !== '') {
            switch ($postAction) {
                case 'userForm':
                    $this->sendJson($this->setUser());
                    break;
                case 'solution':
                    $response = $this->getSolutionCheck();
                    $statusCode = ($response['status'] ?? 'success') === 'error' ? 400 : 200;
                    $this->sendJson($response, $statusCode);
                    break;
            }

        }
    }

    private function sendJson (array $payload, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_THROW_ON_ERROR);
    }

    private function setValidPost (): void
    {
        $contentType = $_SERVER["CONTENT_TYPE"] ?? '';

        if (empty($_POST) && !empty($contentType)) {
            $fetchContent = trim(file_get_contents("php://input"));
            $_POST = json_decode($fetchContent, true);
        }
        if (!empty($_POST)) {
            foreach ($_POST as $k => $v) {
                $v = trim($v);
                $_POST[$k] = strip_tags(htmlspecialchars(stripslashes($v)));
            }
        }
    }

    private function getJsonUserList (): array
    {
        $result = [];

        if ($fileContent = file_get_contents($this->jsonFile)) {
            $result = json_decode($fileContent,true);

        }

        return $result;
    }
}

$GameInst = new Game();
$GameInst->setRequest();
exit();
