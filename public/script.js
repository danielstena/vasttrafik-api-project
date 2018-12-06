$(document).ready(function(){
  
update();  

function update(){
    $.ajax({
        type: "GET",
        url: '/test',
        dataType: 'json',
        data: {"data":"check"},
        success: function(data){
            $(".container").html("");
            $(".container").append("<div class='row'><div class='cell_buss'>"+ data[0].name+"</div><div class='cell'>"+ data[0].time+"</div><div class='cell'>"+ data[0].direction+"</div></div>");

            $(".container").append("<div class='row'><div class='cell_buss'>"+ data[1].name+"</div><div class='cell'>"+ data[1].time+"</div><div class='cell'>"+ data[1].direction+"</div></div>");

            $(".container").append("<div class='row'><div class='cell_buss'>"+ data[2].name+"</div><div class='cell'>"+ data[2].time+"</div><div class='cell'>"+ data[2].direction+"</div></div>");

            $(".container").append("<div class='row'><div class='cell_buss'>"+ data[3].name+"</div><div class='cell'>"+ data[3].time+"</div><div class='cell'>"+ data[3].direction+"</div></div>");
            
            // $.each(data, function () {
                //     $.each(this, function (name,value) {
                    //         console.log(typeof value)
                    //         // $(".row").append("<div class='cell'>"+ value.name+"</div><div class='cell'>"+ value.time+"</div>");
                    //     })
                    // });
                    
            }
        });
    }
    setInterval(function()
    { 
        update();  
        console.log("+1") 
    }
    , 3000);

});



