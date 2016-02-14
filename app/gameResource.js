// CONTENT QUIZ RESULT
var gameResource = [];
gameResource["loesung"] = [];
gameResource["loesung"][0] = [];
gameResource["loesung"][1] = [];
gameResource["loesung"][2] = [];
gameResource["loesung"][3] = [];
gameResource["loesung"][0]['header'] = 'Kein Schweiss, ein Preis?';
gameResource["loesung"][0]['text'] = 'Ihr Weg des geringsten Wiederstandes zur L&ouml;sung dieses R&auml;tsels ist doch nicht ohne Hindernisse!';
gameResource["loesung"][1]['header'] = 'Hindernis 1';
gameResource["loesung"][1]['text'] = 'Spenden Sie min. 20,- Euro an eine gemeinn&uuml;tzige Organisation oder den n&auml;chsten, bed&uuml;rftigen Menschen in ihrer N&auml;he und lassen sie sich den Empfang quittieren.';
gameResource["loesung"][2]['header'] = 'Hindernis 2';
gameResource["loesung"][2]['text'] = 'Scannen Sie bitte diese Quittung und senden Sie sie uns dann als Mail mit ihrem Namen.';
gameResource["loesung"][3]['header'] = 'Hindernis 3';
gameResource["loesung"][3]['text'] = 'Nach der Begutachtung ihrer sozialen Tat schicken wir ihnen als Preis die L&ouml;sung dieses R&auml;tzels.';
// CONTENT QUIZ TIPP
gameResource["tipps"] = [];
gameResource["tipps"][0] = [];
gameResource["tipps"][1] = [];
gameResource["tipps"][2] = [];
gameResource["tipps"][0]['header'] = 'Tipp 1';
gameResource["tipps"][0]['text'] = '<li>Der Engl&auml;nder lebt im roten Haus</li><li>Der Italiener h&auml;lt einen Hund</li><li>Der D&auml;ne trinkt gerne Wein</li><li>Das gr&uuml;ne Haus steht links vom weissen Haus</li><li>Der Besitzer des gr&uuml;nen Hauses trinkt Kaffee</li>';
gameResource["tipps"][1]['header'] = 'Tipp 2';
gameResource["tipps"][1]['text'] = '<li>Die Person, die gerne ringt, h&auml;lt einen Vogel</li><li>Der Mann, der im mittleren Haus wohnt, trinkt Milch</li><li>Der Besitzer des gelben Hauses ist ein Fan des Laufsports</li><li>Der Norweger wohnt im ersten Haus</li><li>Der Fussball-Spieler wohnt neben dem, der eine Katze h&auml;lt</li>';
gameResource["tipps"][2]['header'] = 'Tipp 3';
gameResource["tipps"][2]['text'] = '<li>Der Mann, der ein Pferd h&auml;lt, wohnt neben dem, der Laufen geht</li><li>Der Ruder-Fan trinkt gerne Bier</li><li>Der Norweger wohnt neben dem blauen Haus</li><li>Der Deutsche liebt das Turnen</li><li>Der Fussball-Spieler hat einen Nachbarn, der Wasser trinkt</li>';
// CONTENT GAME INFO
gameResource["spielinfo"] = [];
gameResource["spielinfo"][0] = [];
gameResource["spielinfo"][1] = [];
gameResource["spielinfo"][2] = [];
gameResource["spielinfo"][3] = [];
gameResource["spielinfo"][4] = [];
gameResource["spielinfo"][0]['header'] = 'Wer hat das Spiel erfunden?';
gameResource["spielinfo"][0]['text'] = 'Albert Einstein verfasste dieses R&auml;tsel im letzten Jahrhundert. Er behauptete, 98% der Weltbev&ouml;lkerung seien nicht in der Lage, es zu l&ouml;sen. Viel Spass beim Ausprobieren!!!';
gameResource["spielinfo"][1]['header'] = 'Wie l&ouml;se ich das R&auml;tsel?';
gameResource["spielinfo"][1]['text'] = 'Finden Sie heraus, zu welchem Haus der Fisch geh&ouml;rt. Mit einem Klick auf &quot;START&quot; bekommen Sie die f&uuml;r die L&ouml;sung ben&ouml;tigten Tipps.';
gameResource["spielinfo"][2]['header'] = 'Wie f&uuml;lle ich ein Haus?';
gameResource["spielinfo"][2]['text'] = 'Ziehen Sie ein Spiele-Icon, das Sie ausw&auml;hlen m&ouml;chten zu dem Haus, in das Sie es setzen m&ouml;chten. Lassen Sie das Spiele-Icon dann los und es springt von selbst an die f&uuml;r ihn vorgesehene Stelle im Haus.';
gameResource["spielinfo"][3]['header'] = 'Wie pr&uuml;fe ich das Ergebnis?';
gameResource["spielinfo"][3]['text'] = 'Wenn alle Icons in den H&auml;usern sind, wird das Ergebnis gepr&uuml;ft.';
gameResource["spielinfo"][4]['header'] = 'Wie starte ich das Spiel neu?';
gameResource["spielinfo"][4]['text'] = 'Mit einem Klick auf &quot;REFRESH&quot; werden alle gesetzten Icons aus den H&auml;usern entfernt.';
// CONTENT QUIZ RESULT
gameResource["quizResult"] = {
	'house1' : ['norwegen' , 'gelb' , 'katze' , 'wasser' , 'laufen'],
	'house2' : ['daenemark' , 'blau' , 'pferd' , 'wein' , 'fussball'],
	'house3' : ['england' , 'rot' , 'vogel' , 'milch' , 'ringen' ],
	'house4' : ['deutschland' , 'gruen' , 'fisch' , 'kaffe' , 'turnen' ],
	'house5' : ['italien' , 'weiss' , 'hund' , 'bier' , 'rudern' ],
};
gameResource["gameInfoText"] = {
	'found_wrong' : 'Leider ist deine Lösung falsch! Versuche es nocheinmal, du gehörst doch nicht zu zu 98% ..!',
	'game_success' : 'Glückwunsch, Einstein wäre stolz auf dich!',
	'app_error' : 'Uupss, Applikationsfehler gefunden, das hätte nicht passieren dürfen.'
};
