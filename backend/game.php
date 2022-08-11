<?php

class Game
{
    private array $userList;
    private array $filters;
    private array $solution;
    private string $jsonFile;

    public function __construct ()
    {
        $this->jsonFile = '../json/hall_of_fame.json';
        $this->userList = $this->getJsonUserList();
        $this->filters = [
            "name" => '/^[\w\s\d\.\(\)öüäÖÜÄß,;_-]{1,250}$/i',
            "email" => "email"
        ];
        $this->solution = [
            'house1' => ['norwegen' , 'gelb' , 'katze' , 'wasser' , 'laufen'],
            'house2' => ['daenemark' , 'blau' , 'pferd' , 'wein' , 'fussball'],
            'house3' => ['england' , 'rot' , 'vogel' , 'milch' , 'ringen' ],
            'house4' => ['deutschland' , 'gruen' , 'fisch' , 'kaffe' , 'turnen' ],
            'house5' => ['italien' , 'weiss' , 'hund' , 'bier' , 'rudern' ],
        ];
    }

    public function getUserList (): array
    {
        return array_reverse($this->userList);
    }

    public function getSolutionCheck (): array
    {
        $errors = 0;
        $matches = 0;

        if (!empty($_POST)) {
            foreach ($_POST as $k => $values) {
                if ($k !== "act") {
                    $values = trim($values);
                    if (isset($this->solution[$k]) && $values !== '') {
                        $value = explode(',', $values);
                        foreach ($value as $v) {
                            if (!in_array($v, $this->solution[$k])) {
                                $errors++;
                            }
                            $matches++;
                        }
                    }
                }
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
        $response["msg"] = (empty($error)) ? "Du wurdest erfolgreich in die Hall of Fame aufgenommen." : "Deine Daten sind nicht korrekt.";

        if (empty($error)) {
            $this->userList[] = $user;
            if(!file_put_contents($this->jsonFile, json_encode($this->userList))) {
                $response["status"] = "error";
                $response["msg"] = "Die Daten konnten nicht gespeichert werden.";
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
            echo json_encode($this->getUserList());
        } else if ($postAction !== '') {
            switch ($postAction) {
                case 'userForm':
                    echo json_encode($this->setUser());
                    break;
                case 'solution':
                    echo json_encode($this->getSolutionCheck());
                    break;
            }

        }
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
