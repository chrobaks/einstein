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

const TRANSLATION_CONFIG = {
    langs:['de', 'en'],
    default: 'de',
    fallback: 'de',
    url: 'json/translation.json'
};

const GAME_CONF = [VIEW_ID, ITEMS, COLOR_FILTER];
