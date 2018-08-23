
graph_start_x = 0;
graph_end_x   = 686;

function drawArc( canvas_id )
{
    var width = graph_end_x;
    var height = 240;
    var ctx = document.getElementById( canvas_id ).getContext("2d");

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.strokeRect(0, 0, width, height);

    for (i = 0; i < $('#' + canvas_id).data("coord").length; i++)
    {
        var pair = $('#' + canvas_id).data("coord")[i];
        p1_x1 = get_x(canvas_id, parseInt( pair[0].split(':')[1].split('-')[0]));
        p1_x2 = get_x(canvas_id, parseInt( pair[0].split(':')[1].split('-')[1]));
        p2_x1 = get_x(canvas_id, parseInt( pair[1].split(':')[1].split('-')[0]));
        p2_x2 = get_x(canvas_id, parseInt( pair[1].split(':')[1].split('-')[1]));
        ctx.strokeStyle = get_rgba( pair[3] , 0.6);

        ctx.beginPath();
        ctx.moveTo(p1_x1, height-3);
        ctx.lineTo(p1_x2, height-3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p2_x1, height-3);
        ctx.lineTo(p2_x2, height-3);
        ctx.stroke();
        
        x1 = (p1_x1+p1_x2)/2;
        x2 = (p2_x1+p2_x2)/2;
        
        rad = Math.abs(x1-x2)/2;
        drawOval(ctx, (x1+x2)/2, width-rad/width*height, rad, rad/width*height);

    }

}

function get_x(canvas_id, x)
{
    return graph_start_x + (graph_end_x - graph_start_x) * (( x - $( "#" + canvas_id ).data("start") )/( $( "#" + canvas_id ).data("end") - $( "#" + canvas_id ).data("start") ));
}

function get_rgba(hex, v)
{
    var s = "rgba(";
        s += parseInt(hex.substr(0, 2), 16);
        s += ",";
        s += parseInt(hex.substr(2, 2), 16);
        s += ",";
        s += parseInt(hex.substr(4, 2), 16);
        s += ",";
        s += v;
        s += ")";
    return s;
}

function drawOval(context, x, y, rw, rh)
{
    //x += oft;
    context.save();
    context.scale(1,  rh/rw);
    context.beginPath();
    context.arc(x, y, rw, 1 * Math.PI, 0);
    context.restore();
    context.lineWidth=1;
    context.stroke();
}

