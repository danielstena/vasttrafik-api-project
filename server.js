// -- REQUIRES -- //

    const bodyParser = require('body-parser'); 
    const express = require('express');
    var Base64 = require('Base-64');
    const superagent = require('superagent');

    var request = require('request');
    var pug = require('pug');
    var fs = require('fs');

// -- REQUIRES -- //

// -- STARTAR SERVER --  //

    const app = express()
    const port = 3000

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// -- STARTAR SERVER -- //


//------------------------------------------------------------------//

    // -- För PUG -- //

        app.set('view engine', 'pug');

        app.use(bodyParser.urlencoded({extended: true}));

    // -- För PUG -- //

//------------------------------------------------------------------ //

// -- VARIABLES -- //

    const key = '27ZODCx9Dwf71auxcafiA2va3bAa';
    const secret = 'RzHR_Nr9Q6CndGJs9eCSsfgqIVIa';
    var deviceId = "unit_one";
    var callback;
    var smorslott_mot_ostra;
    var smorslott_mot_tuve;
    var id;
    //Encryptation of key and secret
    var code = Base64.encode(key + ":" + secret);

// -- VARIABLES -- //

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



use_token = async function(token){
    var d = new Date();
    var date = d.toLocaleDateString();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    
    // console.log(hours + ":" + minutes)
    const url_sm_tuve = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007100001&format=json";
    const url_sm_ostra = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007880005&format=json";
    
    const access_token = token;

    const headers = {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${access_token}`
    }

    // -- SMÖRSLOTTSGATAN/MOT TUVE -- //

        await request(url_sm_tuve, { headers },(err, res, body) => {
            if (err) { return console.log(err); }

        smorslott_mot_tuve = JSON.parse(body);
            
            
        var json_sm_mot_tuve = [];
        for (var i = 0; i < 20; i++) { 
            json_sm_mot_tuve.push({time: smorslott_mot_tuve.DepartureBoard.Departure[i].time, direction: smorslott_mot_tuve.DepartureBoard.Departure[i].direction});
        }
            
        console.log(json_sm_mot_tuve)
            app.get('/', (req, res) => res.render('index',{json_sm_mot_tuve}))
            // app.get('/', (req, res) => res.send(lista))
        }); 


    // -- SMÖRSLOTTSGATAN/MOT ÖSTRA SJUKHUSET -- //
    
        // await request(url_sm_ostra, { headers },(err, res, body) => {
        // if (err) { return console.log(err); }
        // smorslott_mot_ostra = JSON.parse(body);
        // // console.log(smorslott.DepartureBoard.Departure[0])

        // var json_sm_mot_ostra = [];
        // for (var i = 0; i < 20; i++) { 
        //     json_sm_mot_ostra.push({time: smorslott_mot_ostra.DepartureBoard.Departure[i].time, departure: smorslott_mot_ostra.DepartureBoard.Departure[i].direction});
        // }
            
        // console.log(json_sm_mot_ostra);

        // app.get('/', (req, res) => res.render('index',{json_sm_mot_ostra}))
        // // app.get('/', (req, res) => res.send(lista))
        // }); 

    //   lista1;
    //   lista2;
    //   lista3;
    //   json
      
}

function get_token(code, deviceId, callback) {
    deviceId = deviceId || new Date().getTime();
    
    let request = superagent('POST', 'https://api.vasttrafik.se/token');

    request.set({Authorization: 'Basic ' + code});
    request.send('grant_type=client_credentials&scope=device_' + deviceId);

    return request.then(res => {
        if (!res.ok) {
            if (callback) {
                callback(res.error, null);
            }
            return Promise.reject(res.error);
        } else {
            let token = res.body.access_token;
            let expires  = res.body.expires_in;

            if (callback) {
                callback(null, token);
            }
            console.log("Token: ", token)
            console.log("Expires in: " + expires)
            use_token(token);
        }
    });
};

setInterval(function(){
}, 3000);

get_token(code, deviceId, callback);








