const IMAGES = {
    'image' : [
        'game_bg.png',
        'bg_house.gif',
        'dachtop_default.gif',
        'dachtop_gruen.gif',
        'dachtop_rot.gif',
        'dachtop_gelb.gif',
        'dachtop_blau.gif',
        'dachtop_weiss.gif',
        'dachcenter_default.gif',
        'dachcenter_gruen.gif',
        'dachcenter_rot.gif',
        'dachcenter_gelb.gif',
        'dachcenter_blau.gif',
        'dachcenter_weiss.gif',
        'bg_item.gif',
        'bg_textfield.gif',
    ],
    'items': [
        'icon_daenemark.gif',
        'icon_deutschland.gif',
        'icon_england.gif',
        'icon_italien.gif',
        'icon_norwegen.gif',
        'icon_gelb.gif',
        'icon_blau.gif',
        'icon_rot.gif',
        'icon_gruen.gif',
        'icon_weiss.gif',
        'icon_katze.gif',
        'icon_pferd.gif',
        'icon_vogel.gif',
        'icon_fisch.gif',
        'icon_hund.gif',
        'icon_wasser.gif',
        'icon_wein.gif',
        'icon_milch.gif',
        'icon_kaffe.gif',
        'icon_bier.gif',
        'icon_laufen.gif',
        'icon_fussball.gif',
        'icon_ringen.gif',
        'icon_turnen.gif',
        'icon_rudern.gif',
    ]
};

const ITEMS = {
    'country' : ['norwegen' , 'daenemark', 'england' ,'deutschland' ,'italien'],
    'color' : [ 'gelb', 'blau' , 'rot' , 'gruen' , 'weiss'],
    'animal' : ['katze' , 'pferd' , 'vogel' , 'fisch' , 'hund' ],
    'drink' : ['wasser' , 'wein' , 'milch' , 'kaffe' , 'bier' ],
    'sport' : ['laufen' , 'fussball' , 'ringen' , 'turnen' , 'rudern' ],
};
const VIEW_ID = 'GameApp';
const TEXT_ALIAS = {
    'daenemark': 'dänemark',
    'gruen': 'grün',
    'country': 'land',
    'color': 'farbe',
    'animal': 'haustier',
    'drink': 'getränk',
};
const COLOR_FILTER = {
    'default' : {
        backgroundColor : "transparent",
            color : "#f8f8f8"
    },
    'blau' : {
        backgroundColor : "#0066FF",
            color : "#33CCFF"
    },
    'rot' : {
        backgroundColor : "#CC3333",
            color : "#FF6600"
    },
    'gruen' : {
        backgroundColor : "#00CC66",
            color : "#99FF00"
    },
    'gelb' : {
        backgroundColor : "#FFFF00",
            color : "#CCCC33"
    },
    'weiss' : {
        backgroundColor : "#ffffff",
            color : "#000000"
    }
}

const CONTENT = {
    "instruction": [
        {header: "Wer hat das Spiel erfunden?", text: 'Angeblich verfasste Albert Einstein dieses Rätsel im letzten Jahrhundert. Er soll behauptet haben, 98% der Weltbevölkerung seien nicht in der Lage, es zu lösen. Viel Spass beim Ausprobieren!!!'},
        {header: "Wie löse ich das Rätsel?", text: "Finden Sie heraus, zu welchem Haus der Fisch gehört. Mit einem Klick auf START bekommen Sie die für die Lösung benötigten Tipps."},
        {header: "Wie fülle ich ein Haus?", text: "Ziehen Sie ein Spiele-Icon, das Sie auswählen möchten zu dem Haus, in das Sie es setzen möchten. Lassen Sie das Spiele-Icon dann los und es springt von selbst an die für ihn vorgesehene Stelle im Haus."},
        {header: "Wie prüfe ich das Ergebnis?", text: "Wenn alle Icons in den Häusern sind, wird das Ergebnis automatisch geprüft."},
        {header: "Wie starte ich das Spiel neu?", text: "Mit einem Klick auf BEENDEN werden alle gesetzten Icons aus den Häusern entfernt."},
    ],
    "notice": [
        {header: "Tipp 1", text: "<li>Der Engländer lebt im roten Haus</li><li>Der Italiener hält einen Hund</li><li>Der Däne trinkt gerne Wein</li><li>Das grüne Haus steht links vom weißen Haus</li><li>Der Besitzer des grünen Hauses trinkt Kaffee</li>"},
        {header: "Tipp 2", text: "<li>Die Person, die gerne ringt, hält einen Vogel</li><li>Der Mann, der im mittleren Haus wohnt, trinkt Milch</li><li>Der Besitzer des gelben Hauses ist ein Fan des Laufsports</li><li>Der Norweger wohnt im ersten Haus</li><li>Der Fussball-Spieler wohnt neben dem, der eine Katze hält</li>"},
        {header: "Tipp 3", text: "<li>Der Mann, der ein Pferd hält, wohnt neben dem, der laufen geht</li><li>Der Ruder-Fan trinkt gerne Bier</li><li>Der Norweger wohnt neben dem blauen Haus</li><li>Der Deutsche liebt das Turnen</li><li>Der Fussball-Spieler hat einen Nachbarn, der Wasser trinkt</li>"},
    ]
}

const GAME_CONF = [VIEW_ID, ITEMS, TEXT_ALIAS, COLOR_FILTER, CONTENT];