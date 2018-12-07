// -- REQUIRES -- //

    const bodyParser = require('body-parser'); 
    const express = require('express');
    var Base64 = require('Base-64');
    const superagent = require('superagent');
    const moment = require('moment')
    var request = require('request');
    var pug = require('pug');
    var fs = require('fs');

// -- REQUIRES -- //

// -- STARTAR SERVER --  //

const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// -- STARTAR SERVER -- //

app.use(express.static("public"))

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
            var json_sm_mot_ostra = [];
            var alla_resor = [];
            var json_sm_mot_tuve = [];
            var id;

            //Encryptation of key and secret
            var code = Base64.encode(key + ":" + secret);

    // -- VARIABLES -- //

//------------------------------------------------------------------ //

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

use_token = async function(token){
    var d = new Date();
    var date = d.toLocaleDateString();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    
    const url_smorslott_17_tuve = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007100001&format=json";
    const url_smorslott_17_ostra = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007880005&format=json";
    const url_backv_svart_amhult = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014001245003&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014001004007&format=json";
   // const url_backv_svart_vallhamra = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007880005&format=json";
   // const url_ostra_1an = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007880005&format=json";
    
    const headers = {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
    }

    // -- SMÖRSLOTTSGATAN/MOT TUVE -- //

        await request(url_smorslott_17_tuve, { headers },(err, res, body) => {
            if (err) { return console.log(err); }

            smorslott_mot_tuve = JSON.parse(body);

            app.get('/test', (req, res) => res.send(smorslott_mot_tuve))

            var sliced_hours_first = smorslott_mot_tuve.DepartureBoard.Departure[0].time.slice(0, 2);
            var sliced_minutes_first =  smorslott_mot_tuve.DepartureBoard.Departure[0].time.slice(3, 5);
            var api_date_first = smorslott_mot_tuve.DepartureBoard.Departure[0].date;

            var sliced_hours_second = smorslott_mot_tuve.DepartureBoard.Departure[1].time.slice(0, 2);
            var sliced_minutes_second =  smorslott_mot_tuve.DepartureBoard.Departure[1].time.slice(3, 5);
            var api_date_second = smorslott_mot_tuve.DepartureBoard.Departure[1].date;
            // TEST //

                current_date = new Date()

                first_buss = new Date(api_date_first +"T"+ sliced_hours_first +":" + sliced_minutes_first + ":00");
                second_buss = new Date(api_date_second +"T"+ sliced_hours_second +":" + sliced_minutes_second + ":00");

                function diff_minutes_first(current_date, first_buss) 
                {
                    var first_diff =(first_buss.getTime() - current_date.getTime()) / 1000;
                    first_diff /= 60;
                
                    return Math.abs(Math.round(first_diff));
                }
                // diff_minutes_first(current_date, first_buss);
                
                function diff_minutes_second(current_date, second_buss) 
                {
                    var second_diff =(second_buss.getTime() - current_date.getTime()) / 1000;
                    second_diff /= 60;
                    return Math.abs(Math.round(second_diff));
                }
                // diff_minutes_second(current_date, second_buss);

                json_sm_mot_tuve = ({track: smorslott_mot_tuve.DepartureBoard.Departure[0].track, stop: smorslott_mot_tuve.DepartureBoard.Departure[0].stop, name: smorslott_mot_tuve.DepartureBoard.Departure[0].name, first_time: diff_minutes_first(current_date, first_buss), second_time: diff_minutes_second(current_date, second_buss), direction: smorslott_mot_tuve.DepartureBoard.Departure[0].direction});
        }); 
    
    // -- SMÖRSLOTTSGATAN/MOT ÖSTRA SJUKHUSET -- //
    
        await request(url_smorslott_17_ostra, { headers },(err, res, body) => {
            if (err) { return console.log(err); }
            smorslott_mot_ostra = JSON.parse(body);
            
            for (var i = 0; i < 20; i++) { 
                json_sm_mot_ostra.push({name: smorslott_mot_ostra.DepartureBoard.Departure[0].name, time: smorslott_mot_ostra.DepartureBoard.Departure[i].time, direction: smorslott_mot_ostra.DepartureBoard.Departure[i].direction});
                alla_resor.push({mot_ostra: json_sm_mot_ostra, mot_tuve: json_sm_mot_tuve});

            }         
        });  
        app.get('/resor', (req, res) => res.send(json_sm_mot_tuve))
        // console.log(alla_resor[0].mot_ostra[0])
        // app.get('/resor', (req, res) => res.send(alla_resor))
        
        app.get('/', (req, res) => res.render('index'))
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
            token = res.body.access_token;
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
    get_token(code, deviceId, callback);
}, 10000);









