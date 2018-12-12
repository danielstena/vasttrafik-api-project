// -- REQUIRES -- //

    const bodyParser = require('body-parser'); 
    const express = require('express');
    var Base64 = require('Base-64');
    const superagent = require('superagent');
    var request = require('request');
    var pug = require('pug');

// -- REQUIRES -- //

// -- STARTING SERVER --  //

const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use(express.static("public"))

//------------------------------------------------------------------//

    // -- FOR PUG -- //

    app.set('view engine', 'pug');

    app.use(bodyParser.urlencoded({extended: true}));

    // -- FOR PUG -- //

//------------------------------------------------------------------ //

    // -- VARIABLES -- //
            
            //VARIABELS TO ACCESS THE TOKEN
            const key = '27ZODCx9Dwf71auxcafiA2va3bAa';
            const secret = 'RzHR_Nr9Q6CndGJs9eCSsfgqIVIa';
            var deviceId = "unit_one";
            var callback;
            
            var json_sm_mot_ostra = [];
            var json_sm_mot_tuve = [];
            var json_backvagen_amhult = [];
            var json_backvagen_vallhamra = [];
            var json_ostra_ettans = [];
            var current_date = new Date();
            var d = new Date();

            var alla_resor = [];

            //Encryptation of key and secret
            var code = Base64.encode(key + ":" + secret);

    // -- VARIABLES -- //

 // -------------------------------------------------------------------------------------------------------------------- //


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// -------------------------------------------------------------------------------------------------------------------- //

// -- FUNCTIONS -- //

function get_sliced_time(value_first, value_second){
    var sliced_hours_first = value_first.slice(0, 2);
    var sliced_minutes_first =  value_first.slice(3, 5);
    var sliced_hours_second = value_second.slice(0, 2);
    var sliced_minutes_second =  value_second.slice(3, 5);
    
    return {sliced_hours_first,sliced_minutes_first,sliced_hours_second, sliced_minutes_second}
}

function diff_minutes_first(current_date, first_buss) 
{
    var first_diff =(first_buss.getTime() - current_date.getTime()) / 1000;
    first_diff /= 60;

    return Math.abs(Math.round(first_diff));
}                
function diff_minutes_second(current_date, second_buss) 
{
    var second_diff =(second_buss.getTime() - current_date.getTime()) / 1000;
    second_diff /= 60;
    return Math.abs(Math.round(second_diff));
}


use_token = async function(token){
    var date = d.toLocaleDateString();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    const url_smorslott_17_tuve = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007100001&format=json";
    const url_smorslott_17_ostra = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014006100001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014007880005&format=json";
    const url_backvagen_mot_amhult = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014001245003&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014001004007&format=json";
    const url_backvagen_mot_vallhamra = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014001245004&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014013640005&format=json";
    const url_ostra_vagn_ett = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=9022014007880001&date=" + date + "&time=" + hours + ":" + minutes + "%3A06&direction=9022014002530002&format=json";
    
    const headers = {
        'Authorization': `Bearer ${token}`
    }

    // -- SMÖRSLOTTSGATAN/MOT TUVE -- //

        await request(url_smorslott_17_tuve, { headers },(err, res, body) => {
            if (err) { return console.log(err); }
            
            var smorslott_mot_tuve = JSON.parse(body);

            var tuve = get_sliced_time(smorslott_mot_tuve.DepartureBoard.Departure[0].time,smorslott_mot_tuve.DepartureBoard.Departure[1].time);
            var api_date = smorslott_mot_tuve.DepartureBoard.Departure[0].date;

            // RÄKNA UT DIFF I MINUTER //

                first_buss = new Date(api_date +"T"+ tuve.sliced_hours_first +":" + tuve.sliced_minutes_first + ":00");
                second_buss = new Date(api_date +"T"+ tuve.sliced_hours_second +":" + tuve.sliced_minutes_second + ":00");

                json_sm_mot_tuve = ({track: smorslott_mot_tuve.DepartureBoard.Departure[0].track, stop: smorslott_mot_tuve.DepartureBoard.Departure[0].stop, name: smorslott_mot_tuve.DepartureBoard.Departure[0].sname, first_time: diff_minutes_first(current_date, first_buss), second_time: diff_minutes_second(current_date, second_buss), direction: smorslott_mot_tuve.DepartureBoard.Departure[0].direction});
        }); 
    
    // -- SMÖRSLOTTSGATAN/MOT ÖSTRA SJUKHUSET -- //
    
        await request(url_smorslott_17_ostra, { headers },(err, res, body) => {
            if (err) { return console.log(err); }
            smorslott_mot_ostra = JSON.parse(body);
            var api_date = smorslott_mot_ostra.DepartureBoard.Departure[0].date;

            ostra = get_sliced_time(smorslott_mot_ostra.DepartureBoard.Departure[0].time,smorslott_mot_ostra.DepartureBoard.Departure[1].time);

                second_buss = new Date(api_date +"T"+ ostra.sliced_hours_second +":" + ostra.sliced_minutes_second + ":00");
                first_buss = new Date(api_date +"T"+ ostra.sliced_hours_first +":" + ostra.sliced_minutes_first + ":00");

            json_sm_mot_ostra = ({track: smorslott_mot_ostra.DepartureBoard.Departure[0].track, stop: smorslott_mot_ostra.DepartureBoard.Departure[0].stop, name: smorslott_mot_ostra.DepartureBoard.Departure[0].sname, first_time: diff_minutes_first(current_date, first_buss), second_time: diff_minutes_second(current_date, second_buss), direction: smorslott_mot_ostra.DepartureBoard.Departure[0].direction});  
        });  

        // -- BACKVÄGEN SVART EXPRESS MOT AMHULT -- //
    
        await request(url_backvagen_mot_amhult, { headers },(err, res, body) => {
            if (err) { return console.log(err); }

            backvagen_mot_amhult = JSON.parse(body);

            var api_date = backvagen_mot_amhult.DepartureBoard.Departure[0].date;

            amhult = get_sliced_time(backvagen_mot_amhult.DepartureBoard.Departure[0].time,backvagen_mot_amhult.DepartureBoard.Departure[1].time);

            first_buss = new Date(api_date +"T"+ amhult.sliced_hours_first +":" + amhult.sliced_minutes_first + ":00");
            second_buss = new Date(api_date +"T"+ amhult.sliced_hours_second +":" + amhult.sliced_minutes_second + ":00");

            json_backvagen_amhult = ({track: backvagen_mot_amhult.DepartureBoard.Departure[0].track, stop: backvagen_mot_amhult.DepartureBoard.Departure[0].stop, name: backvagen_mot_amhult.DepartureBoard.Departure[0].sname, first_time: diff_minutes_first(current_date, first_buss), second_time: diff_minutes_second(current_date, second_buss), direction: backvagen_mot_amhult.DepartureBoard.Departure[0].direction});  
        });  

        // -- BACKVÄGEN SVART EXPRESS MOT VALLHAMRA TORG -- //
    
        await request(url_backvagen_mot_vallhamra, { headers },(err, res, body) => {
            if (err) { return console.log(err); }

            backvagen_mot_vallhamra = JSON.parse(body);
            var svart_mot_vallhamra = [];

            var i;
            for (i = 0; i < 20; i++) { 
                if(backvagen_mot_vallhamra.DepartureBoard.Departure[i].sname == "SVART"){
                    svart_mot_vallhamra.push(backvagen_mot_vallhamra.DepartureBoard.Departure[i]);
                }
            
            }
            var api_date = svart_mot_vallhamra[0].date;

            vallhamra = get_sliced_time(svart_mot_vallhamra[0].time,svart_mot_vallhamra[1].time);

            first_buss = new Date(api_date +"T"+ vallhamra.sliced_hours_first +":" + vallhamra.sliced_minutes_first + ":00");
            second_buss = new Date(api_date +"T"+ vallhamra.sliced_hours_second +":" + vallhamra.sliced_minutes_second + ":00");

            json_backvagen_vallhamra = ({track: svart_mot_vallhamra[0].track, stop: svart_mot_vallhamra[0].stop, name: svart_mot_vallhamra[0].sname, first_time: diff_minutes_first(current_date, first_buss), second_time: diff_minutes_second(current_date, second_buss), direction: svart_mot_vallhamra[0].direction});  
            app.get('/test', (req, res) => res.send(json_backvagen_vallhamra));
        });  

        await request(url_ostra_vagn_ett, { headers },(err, res, body) => {
            if (err) { return console.log(err); }

            ostra_vagn_ett = JSON.parse(body);
            var ettan_mot_frolunda = [];

            var i;
            for (i = 0; i < 20; i++) { 
                if(ostra_vagn_ett.DepartureBoard.Departure[i].sname == "1"){
                    ettan_mot_frolunda.push(ostra_vagn_ett.DepartureBoard.Departure[i]);
                }
            }
            var api_date = ettan_mot_frolunda[0].date;

            ettan = get_sliced_time(ettan_mot_frolunda[0].time,ettan_mot_frolunda[1].time);

            first_buss = new Date(api_date +"T"+ ettan.sliced_hours_first +":" + ettan.sliced_minutes_first + ":00");
            second_buss = new Date(api_date +"T"+ ettan.sliced_hours_second +":" + ettan.sliced_minutes_second + ":00");

            json_ostra_ettans = ({track: ettan_mot_frolunda[0].track, stop: ettan_mot_frolunda[0].stop, name: ettan_mot_frolunda[0].sname, first_time: diff_minutes_first(current_date, first_buss), second_time: diff_minutes_second(current_date, second_buss), direction: ettan_mot_frolunda[0].direction});  
            // app.get('/test', (req, res) => res.send(json_backvagen_vallhamra));
        });  

        alla_resor = ({mot_ostra: json_sm_mot_ostra, mot_tuve: json_sm_mot_tuve, mot_amhult: json_backvagen_amhult, mot_vallhamra: json_backvagen_vallhamra, ettans_vagn: json_ostra_ettans});

        app.get('/resor', (req, res) => res.send(alla_resor));
        app.get('/', (req, res) => res.render('index'));
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









