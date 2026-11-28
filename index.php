<?php
$View = require __DIR__ . '/backend/bootstrap.php';
?>

<!DOCTYPE html>
<html lang="<?=$View['language'];?>">
<head>
    <meta charset="UTF-8">
    <title data-trans-key="landing.pageTitle"></title>
    <link rel="stylesheet" href="app/css/app.css">
    <script src="app/js/GameConfig.js"></script>
    <script src="app/js/GameUi.js"></script>
    <script src="app/js/GameProxy.js"></script>
    <script src="app/js/GameLandingPage.js"></script>
    <script src="app/js/GameApp.js"></script>
    <script src="app/js/GameRegistration.js"></script>
    <script src="app/js/GameTranslation.js"></script>
    <script src="app/js/MainApp.js"></script>
    <script>
        window.onload = () => {
            const AppConfig = {
                'puzzleVariantId'   : '<?=$View['puzzleVariantId'];?>',
                'puzzleJsonId'      : '<?=$View['puzzleJsonId'];?>',
                'translationConfig' : <?=$View['translationConfig'];?>,
                'gameConf'          : GAME_CONF,
                'images'            : IMAGES,
            };
            const InstMainApp = new MainApp(AppConfig);
        };
    </script>
    <script type="application/json" id="<?=$View['puzzleJsonId'];?>">
        <?=$View['puzzleData'];?>
    </script>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="header-title"><span data-trans-key="common.brand"></span></div>
            <div class="header-ctrl-trans"><button data-trans-value="de" class="btn ctrl-trans"><span data-trans-key="common.languages.de"></span></button> | <button data-trans-value="en" class="btn ctrl-trans"><span data-trans-key="common.languages.en"></span></button></div>
        </div>
    </div>
    <div id="GameLandingPage" class="container-landingpage">
        <div class="landingpage-content">
            <h2><span data-trans-key="landing.title"></span></h2>
            <p>
                <span data-trans-key="landing.legend"></span><br>&nbsp;<br>
                <strong><span data-trans-key="landing.challenge"></span></strong>
            </p>
            <h3><span data-trans-key="landing.motivation.title"></span></h3>
            <p>
                <strong><span data-trans-key="landing.motivation.lead"></span></strong><br>
                <span data-trans-key="landing.motivation.description"></span>
                <br>&nbsp;<br>
                <small><span data-trans-key="landing.motivation.towelNote"></span></small>
                <br>&nbsp;<br>
                <strong><span data-trans-key="landing.motivation.tipsLead"></span></strong><br>
                <span data-trans-key="landing.motivation.tipsDescription"></span>
            </p>
            <h3><span data-trans-key="landing.rules.title"></span></h3>
            <p>
                <strong><span data-trans-key="landing.rules.goalTitle"></span></strong><br>
                <span data-trans-html="landing.rules.goal"></span>
            </p>
            <p>
                <strong><span data-trans-key="landing.rules.iconsTitle"></span></strong><br>
                <span data-trans-key="landing.rules.categoriesIntro"></span><br>&nbsp;<br>
                <span data-trans-key="landing.rules.categories.color"></span><br>
                <span data-trans-key="landing.rules.categories.animal"></span><br>
                <span data-trans-key="landing.rules.categories.sport"></span><br>
                <span data-trans-key="landing.rules.categories.country"></span><br>
                <span data-trans-key="landing.rules.categories.drink"></span><br>
                <br>&nbsp;<br>
                <span data-trans-key="landing.rules.assign"></span>
                <br>&nbsp;<br>
                <span data-trans-key="landing.rules.replace"></span>
                <br>&nbsp;<br>
                <span data-trans-key="landing.rules.remove"></span>
            </p>
            <h3><span data-trans-key="landing.tips.title"></span></h3>
            <ul>
                <li><strong><span data-trans-key="game.clues.group1.title"></span></strong></li>
                <li><span data-trans-key="game.clues.group1.items.0"></span></li>
                <li><span data-trans-key="game.clues.group1.items.1"></span></li>
                <li><span data-trans-key="game.clues.group1.items.2"></span></li>
                <li><span data-trans-key="game.clues.group1.items.3"></span></li>
                <li><span data-trans-key="game.clues.group1.items.4"></span></li>
            </ul>
            <ul>
                <li><strong><span data-trans-key="game.clues.group2.title"></span></strong></li>
                <li><span data-trans-key="game.clues.group2.items.0"></span></li>
                <li><span data-trans-key="game.clues.group2.items.1"></span></li>
                <li><span data-trans-key="game.clues.group2.items.2"></span></li>
                <li><span data-trans-key="game.clues.group2.items.3"></span></li>
                <li><span data-trans-key="game.clues.group2.items.4"></span></li>
            </ul>
            <ul>
                <li><strong><span data-trans-key="game.clues.group3.title"></span></strong></li>
                <li><span data-trans-key="game.clues.group3.items.0"></span></li>
                <li><span data-trans-key="game.clues.group3.items.1"></span></li>
                <li><span data-trans-key="game.clues.group3.items.2"></span></li>
                <li><span data-trans-key="game.clues.group3.items.3"></span></li>
                <li><span data-trans-key="game.clues.group3.items.4"></span></li>
            </ul>
            <p><span data-trans-key="landing.tips.reminder"></span></p>
            <h3><span data-trans-key="landing.ready.title"></span></h3>
            <p>
                <strong><span data-trans-key="landing.ready.description"></span></strong><br>
            </p>
            <p class="footer">
                <span data-trans-key="common.footer.projectDescription"></span> <a href="http://www.netcodev.de" title="http://www.netcodev.de" target="_blank">NetCoDev</a><span data-trans-key="common.footer.idea"></span>
                <br>&nbsp;<br>
                <span data-trans-key="common.footer.history"></span>
                <br>&nbsp;<br>
                <span data-trans-key="common.footer.sourceLabel"></span><br>
                <a href="https://github.com/chrobaks/einstein" title="https://github.com/chrobaks/einstein" target="_blank">github.com/chrobaks/einstein</a>

            </p>
        </div>
        <div class="landingpage-btn">
            <button id="btnIntroCtrl" class="btn" disabled><span data-trans-key="landing.buttons.start"></span></button>
            <p id="gameInitializationError" role="alert" hidden>Das Spiel konnte nicht geladen werden. Bitte lade die Seite erneut. / The game could not be loaded. Please reload the page.</p>
        </div>
    </div>
    <div id="GameApp" class="container-game"></div>
    <div id="GameRegistration" class="container-landingpage">
        <div class="landingpage-content">
            <h2><span data-trans-key="registration.title"></span></h2>
            <p>
                <strong><span data-trans-key="registration.congratulations"></span></strong>
            </p>
            <h3><span data-trans-key="registration.invitation"></span></h3>
                <form name="formUser" method="post">
                        <strong><span data-trans-key="registration.fields.email.label"></span></strong><small> <span data-trans-key="registration.fields.email.hint"></span></small><br>
                        <input name="email">
                        <br>&nbsp;<br>
                        <strong><span data-trans-key="registration.fields.name.label"></span></strong><small> <span data-trans-key="registration.fields.name.hint"></span></small><br>
                        <input name="name">

                </form>
                <div class="form-msg"></div>
            <p>
                <button class="btn btn-submit"><span data-trans-key="registration.buttons.save"></span></button> <a href="hof.html" target="_blank" class="btn btn-hof btn-green"><span data-trans-key="registration.buttons.hallOfFame"></span></a>
            </p>
            <p class="footer">
                <span data-trans-key="common.footer.projectDescription"></span> <a href="http://www.netcodev.de" title="http://www.netcodev.de" target="_blank">NetCoDev</a><span data-trans-key="common.footer.idea"></span>
                <br>&nbsp;<br>
                <span data-trans-key="common.footer.history"></span>
                <br>&nbsp;<br>
                <span data-trans-key="common.footer.sourceLabel"></span><br>
                <a href="https://github.com/chrobaks/einstein" title="https://github.com/chrobaks/einstein" target="_blank">github.com/chrobaks/einstein</a>
            </p>
        </div>
    </div>
</body>
</html>
