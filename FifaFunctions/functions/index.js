var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions

exports.fifaAgent = functions.https.onRequest((request, response) =>{

    ref = admin.database().ref('/players').orderByChild("victories");

    ref.on("value", function(snapshot){
        var players = snapshot.val();
        console.log(players);

        players = exports.formatTable(players);

        var message = exports.messageTable(players);

        var data = {
            "speech" : "The classification table is here",
            "displayText" : "This is the classification table:\n" + message,
            "data" : {
                "slack": {"text": "This is the classification table:\n" + message}
            },
            "contextOut" : [],
            "source" : "Firebase"
        };

        response.send(data);
        ref.off();
    }, function(errorObject){
        console.log("The read failed: " + errorObject.code);
        response.end();
        ref.off();
    })

    // var data = {
    //     "speech" : "title text",
    //     "displayText" : "message text",
    //     "data" : {},
    //     "contextOut" : [],
    //     "source" : "Firebase"
    // }
    //

    // response.send(data);
});

exports.formatTable = function(players){

    for(var k in players){
        players[k].games = players[k].victories + players[k].defeats;
        players[k].winRate = players[k].victories / players[k].games;
    }

    return players;
};

exports.messageTable = function(players){

    var message = "";

    for(var k in players){
        message += players[k].name
            + " W:" + players[k].victories
            + " L:" + players[k].defeats
            + " W/L:" + players[k].winRate
            + "\n";
    }

    return message;
};
