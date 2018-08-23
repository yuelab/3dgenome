
var plot_total_length = 720;
var plot_total_height = 380;

var plot_start_x = 0;
var plot_endin_x = 686;
var plot_start_y = 0;
var plot_endin_y = plot_total_height - 20;

Math.log10 = function (x) { return Math.log(x) / Math.LN10; };

var rgbaColor;

///////////////////////////////////////////////////////////////////////////////
//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
///////////////////////////////////////////////////////////////////////////////
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
///////////////////////////////////////////////////////////////////////////////

function getRGBAStr(r, g, b, a)
{
    var s = 'rgba('+ r +',' + g + ',' + b + ',' + a + ')';
    return s;
}

function getRGBStr(r, g, b)
{
    return getRBGAStr(r, g, b, 1.0);
}

function getColor()
{
    if ( window.name && JSON.parse(window.name).color )
    {
        rgbaColor = JSON.parse(window.name).color;
    }
    else
    {
        rgbaColor = "#0040ff";
    }

    $( '#colorInput' ).val( rgbaColor );
}

function getPointIndex(x_points, x)
{
    if (! x_points)
    {
        return;
    }
    var index = 0;
    var diff = x_points[x_points.length-1] - x_points[0];
    for (i = 0; i < x_points.length; i++)
    {
        if (Math.abs(x_points[i]-x) < diff)
        {
            index = i;
            diff = Math.abs(x_points[i]-x);
        }
    }
    return index;
}

function plot4c (id_name)
{
    var ctx = $( '#' + id_name)[0].getContext("2d");
    if (!ctx) return;
    plot4c_on_ctx( id_name, ctx );
}

function plot4c_on_ctx( id_name, ctx )
{

    if ( $( "#" + id_name ).data("error") )
    {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.textAlign="center";
        ctx.fillText("Error: Your requested region could not be retrieved.", plot_total_length/2, plot_total_height/2);
        ctx.fillText( $( "#" + id_name ).data("error") , plot_total_length/2, plot_total_height/2+20);
        return;
    }

////////y-axis label
    ctx.save();
    ctx.translate(0,plot_total_height);
    ctx.rotate(-0.5*Math.PI);
    ctx.fillStyle = "rgba(0,0,0,1)";
    var y_label = "Hi-C Read Value";
    ctx.fillText(y_label, plot_start_x+(plot_endin_y-plot_start_y)/2, plot_total_length-1);
    ctx.restore();

////////x- and y- axis, along with the border for the plot
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.moveTo(plot_start_x, plot_start_y);
    ctx.lineTo(plot_start_x, plot_endin_y);
    ctx.lineTo(plot_endin_x, plot_endin_y);
    ctx.lineTo(plot_endin_x, plot_start_y);
    ctx.lineTo(plot_start_x, plot_start_y);
    ctx.stroke();

    var x_list = $( "#" + id_name ).data("x");
    var y_list = $( "#" + id_name ).data("y");
    //references https://stackoverflow.com/questions/1669190/javascript-min-max-array-values
    var x_min = Math.min.apply(Math, x_list);
    var x_max = Math.max.apply(Math, x_list);
    var y_min = Math.min.apply(Math, y_list);
    var y_max = Math.max.apply(Math, y_list);

    //sanity check, both must be positive since they describe
    //chromosome coordinates
    if (x_min < 0 || x_max < 0)
    {
        return;
    }

    //determine the loweest and highest y-axis label number as well as the step between adjacent ticks.
    var y_step = 0;
    if (y_min >= 0 && y_max >= 0)
    {
        sigfig = getSigFig(y_max);
        y_max = Math.ceil(y_max / sigfig) * sigfig;
        y_min = 0;
        y_step = sigfig;
    }
    else if (y_min < 0 && y_max < 0)
    {
        sigfig = getSigFig(-y_min);
        y_max = 0;
        y_min = Math.floor(y_min / sigfig) * sigfig;
        y_step = sigfig;
    }
    else if (y_min < 0 && y_max >= 0)
    {
        console.log(y_min + "," + y_max);
        sigfigpos = getSigFig(y_max);
        sigfigneg = getSigFig(-y_min);
        if (sigfigpos > sigfigneg)
        {
            y_max = Math.ceil(y_max / sigfigpos) * sigfigpos;
            y_min = Math.floor(y_min / sigfigpos) * sigfigpos;
            y_step = sigfigpos;
        }
        else
        {
            y_max = Math.ceil(y_max / sigfigneg) * sigfigneg;
            y_min = Math.floor(y_min / sigfigneg) * sigfigneg;
            y_step = sigfigneg;
        }
        console.log(y_min + "," + y_max + ";" + y_step);
    }
    else
    {
        return;
    }

    y_range = Math.abs(y_max-y_min);

//////////////////////////////////////
//////draw y-axis labels (Hi-C read value)
//////////////////////////////////////
    y_tick_num = Math.max(10, y_range/y_step);
    for (i = 0; i <= y_tick_num; i++)
    {
        //draw ticks
        ctx.beginPath();
        ctx.moveTo( plot_endin_x  , plot_endin_y - (plot_endin_y - plot_start_y) / y_tick_num * i);
        ctx.lineTo( plot_endin_x-5, plot_endin_y - (plot_endin_y - plot_start_y) / y_tick_num * i);
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();

        //draw number labels
        ctx.fillStyle = "rgba(0,0,0,1)";
        text = "" + (y_min + y_range/y_tick_num * i);
        if (i < y_tick_num)
            ctx.fillText(text, plot_endin_x+2, plot_endin_y - (plot_endin_y - plot_start_y)/y_tick_num * i + 2);
        else
            ctx.fillText(text, plot_endin_x+2, plot_endin_y - (plot_endin_y - plot_start_y)/y_tick_num * i + 10); 
    }

    x_range = x_max - x_min;
    data_start = $( "#" + id_name ).data("start");
    data_endin = $( "#" + id_name ).data("end");
    
/////////////////////////////////////////
//////draw x-axis labels (chromosome coordinates)
/////////////////////////////////////////
    sigfig = getSigFig(x_range);
    if (x_range / sigfig >= 2) x_tick_size = sigfig;
    else x_tick_size = sigfig/2;

    cur_x_tick = Math.ceil( data_start / x_tick_size ) * x_tick_size;
    i = 0;
    while (cur_x_tick < data_endin )
    {
        cur_x = (cur_x_tick - data_start)/x_range * (plot_endin_x - plot_start_x) + plot_start_x;
        //draw ticks
        ctx.beginPath();
        ctx.moveTo(cur_x, plot_endin_y  );
        ctx.lineTo(cur_x, plot_endin_y-5);
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();

        //draw number labels
        ctx.fillStyle = "rgba(0,0,0,1)";
        text = insertCommaSep( cur_x_tick );

        var space = 10;
        if ( i % 2 == 1)
        {
            space = 16;
        }

        ctx.fillText(text, cur_x-ctx.measureText(text).width/2-1, plot_endin_y + space);
        cur_x_tick += x_tick_size;
        i += 1;
    }

/////////////////////////////////////////
//////draw actual points
/////////////////////////////////////////
    var x_pos_list = [];
    var y_pos_list = [];

    ctx.beginPath();
    var tss_index;
    var cur_x = plot_start_x;
    for (i = 0; i < x_list.length; i++)
    {
        if (x_list[i] == $( "#" + id_name ).data("tss")) { tss_index = i; }
        var x_val = x_list[i]; var y_val = y_list[i];
        var cur_y = plot_endin_y - (y_val-y_min)/y_range * (plot_endin_y - plot_start_y);

        if (i == 0)
        {
            ctx.moveTo(cur_x, cur_y);
        }
        else
        {
            ctx.lineTo(cur_x, cur_y);
        }

        x_pos_list.push(cur_x);
        y_pos_list.push(cur_y);

        if (i < x_list.length - 1)
        {
            cur_x += (x_list[i+1] - x_val)/x_range * (plot_endin_x - plot_start_x);
        }
        else
        {
            cur_x = plot_endin_x;
        }
    }

    getColor();
    ctx.strokeStyle = getRGBAStr( hexToRgb( rgbaColor ).r, hexToRgb( rgbaColor ).g, hexToRgb( rgbaColor ).b, 0.75);
    ctx.stroke();

    $( "#" + id_name ).data("x_pos_list", x_pos_list);
    $( "#" + id_name ).data("y_pos_list", y_pos_list);


    if ( $("#anchorCheckbox").prop('checked') )
    {
        //Draw anchor line
        ctx.beginPath();
        ctx.moveTo(x_pos_list[tss_index], plot_start_y)
        ctx.lineTo(x_pos_list[tss_index], plot_endin_y)
        ctx.strokeStyle = "rgba(255,0,0,0.5)";
        ctx.stroke();

        ctx.fillStyle = "rgba(255,0,0,1)";
        ctx.fillText("anchoring", x_pos_list[tss_index] - ctx.measureText("anchoring").width - 2, plot_start_y+10);
        ctx.fillText("point", x_pos_list[tss_index] + 2, plot_start_y+10);
    }
}

$( '.refreshButton' ).click(function() {
    var s = {};
    if ( window.name )
    {
        s = JSON.parse(window.name);
    }
    s['color'] = $( '#colorInput' ).val();
    console.log(s);
    window.name = JSON.stringify(s);
    rgbaColor = $( '#colorInput' ).val();

    $('.virtual4cPlot').each(function() {
        clearCanvas(this.id);
        plot4c(this.id);
        var ctx = new C2S({width:720, height:380});
        plot4c_on_ctx(this.id, ctx);
        $('#saveSVG_' + this.id.substr(this.id.indexOf('_')+1) ).attr('href', 'data:application/csv;charset=utf-8,' + encodeURI(ctx.getSerializedSvg(true)));
        saveImage();
    });
});

$("#anchorCheckbox").change(function(){
    $('.virtual4cPlot').each(function() {
        clearCanvas(this.id);
        plot4c(this.id);
        var ctx = new C2S({width:720, height:380});
        plot4c_on_ctx(this.id, ctx);
        $('#saveSVG_' + this.id.substr(this.id.indexOf('_')+1) ).attr('href', 'data:application/csv;charset=utf-8,' + encodeURI(ctx.getSerializedSvg(true)));
        saveImage();
    });
});

function drawIndicator(canvas_id, x, y)
{
    if ( x < 0 && y < 0 ) return;
    var plot_id = 'virtual4cPlot_' + canvas_id.substr(canvas_id.indexOf('_')+1);

    if ( $( "#" + plot_id ).data("error") ) return;
    var ctx = $( '#' + canvas_id)[0].getContext("2d");
    if (!ctx) return;

    retrieveHighlight( canvas_id, false );

    var dhs_id = 'dhsPlot_' + canvas_id.substr(canvas_id.indexOf('_')+1);
    dtx = $( '#' + dhs_id)[0].getContext("2d");

    var x_pos_list = $( "#" + plot_id ).data("x_pos_list");
    var y_pos_list = $( "#" + plot_id ).data("y_pos_list");

    var resolution = $('#resolution_val').val();
    var res = resolution * 1000;

    var index = getPointIndex(x_pos_list, x);

    //draw indicator ball
    ctx.strokeStyle = "rgba(0,200,0,1)";
    ctx.beginPath();
    ctx.arc(x_pos_list[index], y_pos_list[index], 4, 0, 2*Math.PI);
    ctx.stroke();

    start = $( '#' + plot_id ).data("start");
    end   = $( '#' + plot_id ).data("end");

    //draw indicator rectangle to highlight region
    ctx.fillStyle = "rgba(102,102,255,0.25)";
    var g1 = Math.max(Math.floor($( "#" + plot_id ).data("x")[index] / res) * res, start);
    var x1 = ( g1 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;
    var g2 = Math.min((Math.floor($( "#" + plot_id ).data("x")[index] / res)+1) * res, end);
    var x2 = ( g2 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;
    ctx.fillRect(x1, plot_start_y, x2-x1, plot_total_height - plot_start_y);

    //draw the upper left corner region information
    ctx.fillStyle = "rgba(0,0,0,1)";
    x_text1 = "Genomic Coordinate: " + $( "#" + plot_id ).data("x")[index];
    x_text2 = "Matrix Bin: " + g1 + "-" + (g2-1);
    x_offset = Math.max(ctx.measureText(x_text1).width, ctx.measureText(x_text2).width);
    ctx.fillText(x_text1, plot_endin_x - x_offset-1, plot_start_y+10);
    ctx.fillText(x_text2, plot_endin_x - x_offset-1, plot_start_y+20);
    y_text = "Counts: "             + $( "#" + plot_id ).data("y")[index];
    ctx.fillText(y_text, plot_endin_x - x_offset-1, plot_start_y+30);
    ctx.fillStyle = "rgba(102,102,255,0.25)"; //highlighted bin information
    ctx.fillRect(plot_endin_x - x_offset-1, plot_start_y+10, x_offset, 10);

    var ucsc_cov_id = 'embedCanvas_' + canvas_id.substr(canvas_id.indexOf('_')+1);
    ctx = $( '#' + ucsc_cov_id)[0].getContext("2d");
    if (ctx)
    {
        ctx.fillStyle = "rgba(102,102,255,0.25)";
        ctx.fillRect(x1, 0, x2-x1, $( '#' + ucsc_cov_id)[0].scrollHeight );
    }

    if (dtx)
    {
        drawLinkage(dhs_id, false, x1, x2);
        dtx.fillStyle = "rgba(102,102,255,0.25)";
        dtx.fillRect(x1, 0, x2-x1, $( '#' + dhs_id)[0].scrollHeight );
    }

    $('.chiaPlot').each(function() {
        if (this.id.split('_')[1] == canvas_id.split('_')[1])
        {
            var rtx = $( '#' + this.id)[0].getContext("2d");
            if (rtx)
            {
                drawChiapet(this.id, false, x1, x2);
                rtx.fillStyle = "rgba(102,102,255,0.25)";
                rtx.fillRect(x1, 0, x2-x1, $( '#' + this.id)[0].scrollHeight );
            }        
        }
    });
}

function drawHighlight(canvas_id, x1, x2)
{
    var plot_id = 'virtual4cPlot_' + canvas_id.substr(canvas_id.indexOf('_')+1);

    var ctx = $( '#' + canvas_id)[0].getContext("2d");
    if (!ctx) return;

    var x_pos_list = $( "#" + plot_id ).data("x_pos_list");
    start = $( '#' + plot_id ).data("start");
    end   = $( '#' + plot_id ).data("end");

    var index1 = getPointIndex(x_pos_list, x1);
    var index2 = getPointIndex(x_pos_list, x2);

    if (index2 < index1)
    {
        var temp = index2;
        index2 = index1;
        index1 = temp;
    }

    var resolution = $('#resolution_val').val();
    var res = resolution * 1000;

    var hi_array = $( '#' + plot_id ).data("highlight_array");

    for (var i = index1; i <= index2; i++)
    {
        hi_array[i] = 1;
    }
    $( '#' + plot_id ).data("highlight_array", hi_array);    

    ctx.fillStyle = "rgba(102,102,255,0.25)";
    var g1 = Math.max(Math.floor($( "#" + plot_id ).data("x")[index1] / res) * res, start);
    var xn1 = ( g1 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;
    var g2 = Math.min((Math.floor($( "#" + plot_id ).data("x")[index2] / res)+1) * res, end);
    var xn2 = ( g2 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;
    ctx.fillRect(xn1, plot_start_y, xn2-xn1, plot_total_height - plot_start_y);
}

function retrieveHighlight(canvas_id, mouseLeftFlag)
{
    var plot_id = 'virtual4cPlot_' + canvas_id.substr(canvas_id.indexOf('_')+1);

    var ctx = $( '#' + canvas_id)[0].getContext("2d");
    clearCanvas( canvas_id );
    if (!ctx) return;

    //!
    plot4c( canvas_id );

    ctx.fillStyle = "rgba(102,102,255,0.25)";
    var resolution = $('#resolution_val').val();
    var res = resolution * 1000;

    start = $( '#' + plot_id ).data("start");
    end   = $( '#' + plot_id ).data("end");

    var hi_array = $( '#' + plot_id ).data("highlight_array");

    var ucsc_cov_id = 'embedCanvas_' + canvas_id.substr(canvas_id.indexOf('_')+1);
    etx = $( '#' + ucsc_cov_id)[0].getContext("2d");
    if (etx)
    {
        clearCanvas( ucsc_cov_id );
        etx.fillStyle = "rgba(102,102,255,0.25)";
    }

    var dhs_id = 'dhsPlot_' + canvas_id.substr(canvas_id.indexOf('_')+1);
    dtx = $( '#' + dhs_id)[0].getContext("2d");
    if (dtx)
    {
        clearCanvas( dhs_id );
    }

    $('.chiaPlot').each(function() {
        if (this.id.split('_')[1] == canvas_id.split('_')[1])
        {
            clearCanvas( this.id );
        }
    });

    var isEmptyFlag = true;
    for (var i = 0; i < hi_array.length; i++)
    {
        if ( hi_array[i] == 1)
        {
            isEmptyFlag = false;
            var g1 = Math.max(Math.floor($( "#" + plot_id ).data("x")[i] / res) * res, start);
            var x1 = ( g1 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;
            var g2 = Math.min((Math.floor($( "#" + plot_id ).data("x")[i] / res)+1) * res, end);
            var x2 = ( g2 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;

            if (dtx)
            {
                drawLinkage( dhs_id, false, x1, x2);
            }
        }
    }
    dtx.fillStyle = "rgba(102,102,255,0.25)";

    if ( isEmptyFlag && mouseLeftFlag )
    {
        var x_pos_list = $('#' + plot_id).data("x_pos_list");
        for (var i = 0; i < $('#' + plot_id).data("x").length; i++)
        {
            if ($('#' + plot_id).data("x")[i] == tss)
            {
                tss_index = i;
                break;
            }
        }

        for (var i = 0; i < $( '#' + dhs_id ).data('color_list').length; i++)
        {
            var x1 = $("#" + dhs_id).data("x1_list")[i];
            var x2 = $("#" + dhs_id).data("x2_list")[i];

            if ( (x1 >= x_pos_list[tss_index] && x1 < x_pos_list[tss_index+1]) || (x2 >= x_pos_list[tss_index] && x2 < x_pos_list[tss_index+1]) )
            {
                dtx.strokeStyle = getRgbaStr( $( '#' + dhs_id ).data('color_list')[i] , ($( '#' + dhs_id ).data('alpha_list')[i]-0.5)/0.5 );
                rad = Math.abs(x1-x2)/2;
                drawOval(dtx, (x1+x2)/2, $( '#' + dhs_id)[0].scrollWidth-rad/$( '#' + dhs_id)[0].scrollWidth*$( '#' + dhs_id)[0].scrollHeight, rad, rad/$( '#' + dhs_id)[0].scrollWidth*$( '#' + dhs_id)[0].scrollHeight);
            }
        }
    }

    $('.chiaPlot').each(function() {
        if (this.id.split('_')[1] == canvas_id.split('_')[1])
        {
            drawChiapet(this.id, false, x1, x2);
        }
    });

    

    for (var i = 0; i < hi_array.length; i++)
    {
        if ( hi_array[i] == 1)
        {
            var g1 = Math.max(Math.floor($( "#" + plot_id ).data("x")[i] / res) * res, start);
            var x1 = ( g1 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;
            var g2 = Math.min((Math.floor($( "#" + plot_id ).data("x")[i] / res)+1) * res, end);
            var x2 = ( g2 - start ) / ( end - start )  * (plot_endin_x - plot_start_x) + plot_start_x;
            ctx.fillRect(x1, plot_start_y, x2-x1, plot_total_height - plot_start_y);

            if (etx)
            {
                etx.fillRect(x1, 0, x2-x1, $( '#' + ucsc_cov_id)[0].scrollHeight );                
            }
            if (dtx)
            {
                dtx.fillRect(x1, 0, x2-x1, $( '#' + dhs_id)[0].scrollHeight );
            }

            $('.chiaPlot').each(function() {
                if (this.id.split('_')[1] == canvas_id.split('_')[1])
                {
                    var rtx = $( '#' + this.id)[0].getContext("2d");
                    if (rtx)
                    {
                        rtx.fillStyle = "rgba(102,102,255,0.25)";
                        rtx.fillRect(x1, 0, x2-x1, $( '#' + this.id)[0].scrollHeight );
                    }
                }
            });


        }
    }
}

//Parameter: number
//Returns: the order of the most significant digit, i.e. input: 956, out: 100; input 0.045, output: 0.01
function getSigFig(num)
{
    return Math.pow(10, Math.floor(Math.log10(num)));
}

//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function insertCommaSep(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

