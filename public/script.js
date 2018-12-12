$(document).ready(function(){
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var hours = addZeroBefore(h);
    var minutes = addZeroBefore(m);
    var total_tid = hours + ":" + minutes

    function addZeroBefore(n) {
        return (n < 10 ? '0' : '') + n;
    }
    

update(total_tid);  

function update(total_tid){
    $.ajax(
        {
            type: "GET",
            url: '/resor',
            dataType: 'json',
            data: {"data":"check"},
            success: function(data)
            {
                $("#time").html("<h1 id='time'>"+ total_tid + "</h1>");
                
                $("#1").append("<div class='cell stop'>" + data.mot_tuve.stop.slice(0,15) + " </div><div class='cell bus'>" + data.mot_tuve.name + "</div><div class='cell' id='first'>" + data.mot_tuve.first_time + " min</div><div class='cell second'>" + data.mot_tuve.second_time + " min</div><div class='cell direction'>"+ data.mot_tuve.direction+"</div><div class='cell track'>"+ data.mot_tuve.track+"</div>");
                $("#2").append("<div class='cell stop'>" + data.mot_ostra.stop.slice(0,15) + " </div><div class='cell bus'>" + data.mot_ostra.name + "</div><div class='cell' id='first'>" + data.mot_ostra.first_time + " min</div><div class='cell second'>" + data.mot_ostra.second_time + " min</div><div class='cell direction'>"+ data.mot_ostra.direction+"</div><div class='cell track'>"+ data.mot_ostra.track+"</div>");
                $("#3").append("<div class='cell stop'>" + data.mot_amhult.stop.slice(0,9) + " </div><div class='cell bus '>" + data.mot_amhult.name + "</div><div class='cell' id='first'>" + data.mot_amhult.first_time + " min</div><div class='cell second'>" + data.mot_amhult.second_time + " min</div><div class='cell direction'>"+ data.mot_amhult.direction+"</div><div class='cell track'>"+ data.mot_amhult.track+"</div>");
                $("#4").append("<div class='cell stop'>" + data.mot_vallhamra.stop.slice(0,9) + " </div><div class='cell bus'>" + data.mot_vallhamra.name + "</div><div class='cell' id='first'>" + data.mot_vallhamra.first_time + " min</div><div class='cell second'>" + data.mot_vallhamra.second_time + " min</div><div class='cell direction'>"+ data.mot_vallhamra.direction+"</div><div class='cell track'>"+ data.mot_vallhamra.track+"</div>");
                $("#5").append("<div class='cell stop'>" + data.ettans_vagn.stop.slice(0,15) + " </div><div class='cell bus tram'>" + data.ettans_vagn.name + "</div><div class='cell' id='first'>" + data.ettans_vagn.first_time + " min</div><div class='cell second'>" + data.ettans_vagn.second_time + " min</div><div class='cell direction'>"+ data.ettans_vagn.direction+"</div><div class='cell track'>"+ data.ettans_vagn.track+"</div>");
            }
        });
    }
    setInterval(function()
    { 
        update(total_tid);  
        location.reload();
    }
        , 30000
    );

});



