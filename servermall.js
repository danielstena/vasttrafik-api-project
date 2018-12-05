var express = require('express');
var bodyParser = require('body-parser')

var pug = require('pug');
const path = require('path');
var fs = require('fs');

const app = express();

app.use(express.static("website"))

const fetch = require("node-fetch");

app.use( ( req, res, next ) => {
    setTimeout(next, 200 );
 });
//------------------------------------------------------------------

    // -- Kör Servern -- //

        app.listen(3000, listening);

        function listening(){
            console.log("listening...")
        }
        console.log("server online");

    // -- Kör Servern -- //


// ------------------------------------------------------------------- //

//------------------------------------------------------------------//

    // -- För PUG -- //

        app.set('view engine', 'pug');

        app.use(bodyParser.urlencoded({extended: true}));

    // -- För PUG -- //

//------------------------------------------------------------------ //

//------------------------------------------------------------------//

    //VISAR INDEX//

        app.get('/', function(request, response){
                        
            return response.render('index', {list})
        });

    //VISAR INDEX//

//------------------------------------------------------------------//

//------------------------------------------------------------------ //

    //  -- SÖK  --  //
    
        app.get('/searchsubmit', function(request, response){
            var city = request.query.city;
            ggData(city);
            response.redirect('back');
        });

//------------------------------------------------------------------ //
var list = {};

ggData = async function(stad){
   const urll = "http://api.openweathermap.org/data/2.5/weather?q=" + stad + "&units=metric&APPID=db46926eeb7e6616b39cc14986bf2b62";

   try {
       const response = await fetch(urll);
       const json = await response.json();
        list["weather"] = json.weather[0].description
        list["temp"] = json.main.temp;
        list["wind"] = json.wind.speed;
        list["name"] = json.name;

   } catch (error) {
       console.log(error);

   }
}
//------------------------------------------------------------------ //

    //RENDERERA RESULTATET

        

    //RENDERERA RESULTATET

//------------------------------------------------------------------ //
