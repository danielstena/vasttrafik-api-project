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
    $.ajax({
        type: "GET",
        url: '/resor',
        dataType: 'json',
        data: {"data":"check"},
        success: function(data){

            $("#time").html("<h1>"+ total_tid + "</h1>");
            
            $("#1").append("<div class='cell stop'>" + data.stop.slice(0,15) + " </div><div class='cell bus'>" + data.name.slice(5,7) + "</div><div class='cell' id='first'>" + data.first_time + " min</div><div class='cell' id=''second>" + data.second_time + " min</div><div class='cell' id='direction'>"+ data.direction+"</div><div class='cell' id='track'>"+ data.track+"</div>");

            // $(".container").append("<div class='row'><div class='cell_buss'>" + data[0].mot_tuve[0].name + "</div><div class='cell'>" + data[0].mot_ostra[0].time + "</div><div class='cell'>"+ data[0].tuve[0].direction+"</div></div>");


            // $(".container").append("<div class='row'><div class='cell_buss'>" + mall(2,"name") + "</div><div class='cell'>" + mall(2,"time") + "</div><div class='cell'>" + mall(2,"direction") + "</div></div>");

            // $(".container").append("<div class='row'><div class='cell_buss'>" + mall(3,"name") + "</div><div class='cell'>" + mall(3,"time") + "</div><div class='cell'>" + mall(3,"direction") + "</div></div>");
            
                    
            }
        });
    }
    setInterval(function()
    { 
        update(total_tid);  
        location.reload();
    }
    , 30000);

});



