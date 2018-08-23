//Defines log10 (not defined in older versions of Safari)
Math.log10 = function (x) { return Math.log(x) / Math.LN10; };
var cut_off = 0;

function drawTriangle(ctx, cur_x, cur_y, size_x, size_y, rbg_str)
{
    ctx.beginPath(); //Need to start a new path each time so that color will be different.
    ctx.moveTo(cur_x, cur_y);
    ctx.lineTo(cur_x + size_x/2, cur_y - size_y);
    ctx.lineTo(cur_x + size_x, cur_y);
    ctx.lineTo(cur_x, cur_y);
    ctx.fillStyle = rbg_str;
    ctx.fill();
}

function drawSquare(ctx, cur_x, cur_y, size_x, size_y, rbg_str)
{
    ctx.beginPath(); //Need to start a new path each time so that color will be different.
    ctx.moveTo(cur_x, cur_y);
    ctx.lineTo(cur_x + size_x/2, cur_y - size_y);
    ctx.lineTo(cur_x + size_x, cur_y);
    ctx.lineTo(cur_x + size_x/2, cur_y + size_y);
    ctx.lineTo(cur_x, cur_y);
    ctx.fillStyle = rbg_str
    ctx.fill();
}

function clearCanvas( canvas_id, canvas_x_start, canvas_x, canvas_y_start, canvas_y )
{
    var canvas = $( '#' + canvas_id )[0];
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(255,255,255,1)"; //white
    ctx.fillRect(canvas_x_start,canvas_y_start,canvas_x,canvas_y); //clear canvas region
}

function drawGradientBar( canvas_id, x_start, x_size, y_start, y_size, flipY )
{
    var canvas = $( '#'+ canvas_id )[0];
    var ctx = canvas.getContext("2d");
    if ( $( '#' + canvas_id ).data("num_rows") <= 1)
    {
        return;
    }

    color1_hex = '#ff0000';
    color2_hex = '#0000ff';

    var my_gradient=ctx.createLinearGradient(0, y_start, 0, y_start + y_size);
    if ( $( '#' + canvas_id ).data("positive") && $( '#' + canvas_id ).data("negative") )
    {
        my_gradient.addColorStop(0,color1_hex);
        my_gradient.addColorStop(0.55,"white");
        my_gradient.addColorStop(1,color2_hex);

        ctx.fillStyle="black";
        ctx.fillText(String.fromCharCode("8805") + " " + $( '#' + canvas_id ).data("posMax"), x_start+x_size+15, y_start       -5 );
        ctx.fillText(String.fromCharCode("8804") + " " + $( '#' + canvas_id ).data("negMin"), x_start+x_size+15, y_start+y_size-10);
        if ( $( '#' + canvas_id ).data("negMax") != $( '#' + canvas_id ).data("posMin") )
        {
            ctx.fillText( $( '#' + canvas_id ).data("negMax") + " - " + $( '#' + canvas_id ).data("posMin"), x_start+x_size+15, y_start+(y_size-20)/2 );
        }
        else
        {
            ctx.fillText( $( '#' + canvas_id ).data("negMax"), x_start+x_size+15, y_start+(y_size-20)/2 );
        }
    }
    else
    {
        if ( $( '#' + canvas_id ).data("positive") )
        {
            my_gradient.addColorStop(0,color1_hex);
            my_gradient.addColorStop(1,"white");

            ctx.fillStyle="black";
            //else
            {
            ctx.fillText(String.fromCharCode("8805") + " " + $( '#' + canvas_id ).data("posMax"), x_start+x_size+15, y_start       +5 );
            ctx.fillText(String.fromCharCode("8804") + " " + $( '#' + canvas_id ).data("posMin"), x_start+x_size+15, y_start+y_size+5);
            }
        }
        else if ( $( '#' + canvas_id ).data("negative") )
        {
            my_gradient.addColorStop(0,"white");
            my_gradient.addColorStop(1,color2_hex);

            ctx.fillStyle="black";
            //else
            {
            ctx.fillText(String.fromCharCode("8805") + " " + $( '#' + canvas_id ).data("negMax"), x_start+x_size+15, y_start       +5 );
            ctx.fillText(String.fromCharCode("8804") + " " + $( '#' + canvas_id ).data("negMin"), x_start+x_size+15, y_start+y_size+5);
            }
        }
        else
        {
            return;
        }
    }

    ctx.fillStyle=my_gradient;
    //else
    {
    ctx.fillRect(x_start, y_start, x_size, y_size);
    ctx.strokeStyle="black";
    ctx.strokeRect(x_start, y_start, x_size, y_size);
    }
}

function drawXTicks( ctx, cur_x, cur_y, inward_flag, flipY )
{
    ctx.beginPath();
    if (inward_flag)
    {
        if (flipY)
            ctx.moveTo( cur_x, cur_y+4 );
        else
            ctx.moveTo( cur_x, cur_y-4 );
    }
    else
    {
        ctx.moveTo( cur_x, cur_y   );
    }
    if (flipY)
        ctx.lineTo( cur_x, cur_y-5 );
    else
        ctx.lineTo( cur_x, cur_y+5 );
    ctx.strokeStyle = "black";
    ctx.stroke();   
}

function drawXLabel( ctx, cur_x, cur_y, cur_x_tick, canvas_x, chrom, flipY )
{
    ctx.fillStyle = "black";
    var text = Number(cur_x_tick).toLocaleString(); //cur_x_tick.toString();
    var s = cur_x-ctx.measureText(text).width/2-1;
    var e = cur_x+ctx.measureText(text).width/2-1
    if (s < ctx.measureText(chrom).width || e > canvas_x )
    {
        return;
    }
    if (flipY)
        ctx.fillText(text, s, cur_y-5);
    else
        ctx.fillText(text, s, cur_y+10);
}

function drawLocationBar( canvas_id, canvas_x_start, canvas_x, canvas_y_start, canvas_y, loc_start, loc_end, chrom, flipY )
{
    var canvas = $( '#' + canvas_id )[0];
    var ctx = canvas.getContext("2d");

    var x_range  = loc_end - loc_start;
    var x_tick_size = Math.pow(10, Math.floor(Math.log10(x_range)));

    var cur_x_tick = Math.ceil( loc_start / x_tick_size ) * x_tick_size;
    inward_flag = true;
    while (cur_x_tick < loc_end )
    {
        var cur_x = ( cur_x_tick - loc_start ) / x_range * ( canvas_x - canvas_x_start ) + canvas_x_start;
        drawXTicks( ctx, cur_x, canvas_y_start, inward_flag, flipY);
        drawXLabel( ctx, cur_x, canvas_y_start, cur_x_tick, canvas_x, chrom, flipY);
        cur_x_tick += x_tick_size;

        if (inward_flag)
        {
            inward_flag = false;
        }
        else
        {
            inward_flag = true;
        }
    }

    if (flipY)
    {
        //ctx.fillText('TADs', 0, 7);
        ctx.fillText(chrom, 0, 17);
    }
    else
    {
        ctx.fillText(chrom, 0, canvas_y+10);
    }
}

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

function getRgbaStr(r, g, b, a)
{
    var s = 'rgba('+ r +',' + g + ',' + b + ',' + a + ')';
    return s;
}

function getRgbStr(r, g, b)
{
    return getRgbaStr(r, g, b, 1.0);
}

var color1_hex;
var color2_hex;

function getColor()
{

    if ( window.name && JSON.parse(window.name).color1 )
    {
        color1_hex = JSON.parse(window.name).color1;
    }
    else
    {
        color1_hex = '#ff0000';
    }

    if ( window.name && JSON.parse(window.name).color2 )
    {
        color2_hex = JSON.parse(window.name).color2;
    }
    else
    {
        color2_hex = '#0000ff';
    }

    $( '#pos_color_text' ).val( color1_hex );
    $( '#neg_color_text' ).val( color2_hex );
}

function drawTAD( canvas_id, y_start )
{
    var p = canvas_id.substr(canvas_id.indexOf('_')+1);
    var canvas = $( '#' + canvas_id )[0];
    if (! canvas )
    {
        return;
    }
    var ctx = canvas.getContext("2d");
    if (! ctx)
    {
        return;
    }

    console.log( canvas_id + ":" + y_start );

    tad_arr = $( '#' + canvas_id ).data("tad");

    if (!tad_arr)
        return;

    for (i = 0; i < tad_arr.length; i++)
    {
        draw_rect( ctx, tad_arr[i][0], tad_arr[i][1], i, y_start, canvas_id );
    }
}

function draw_rect( ctx, tad_start, tad_end, index, y_start, canvas_id )
{
    ctx.fillStyle = "rgba(235, 189, 91, 0.6)";
    if (index % 2 == 1)
        ctx.fillStyle = "rgba(45, 84, 139, 0.6)";

    ctx.fillRect( get_g_to_x_coord(canvas_id, tad_start), y_start, get_g_to_x_coord(canvas_id, tad_end)-get_g_to_x_coord(canvas_id, tad_start), 10);
}

function drawLegend( ctx, canvas_x_start, canvas_x, canvas_y_start, canvas_y )
{
    var height = 30;
    ctx.fillStyle = "black";
    ctx.fillText("TADs", canvas_x-140, height);
    ctx.fillStyle = "rgba(235, 189, 91, 0.6)";
    ctx.fillRect( canvas_x-90, height-10, height+10, 10 );
    ctx.fillStyle = "rgba(45, 84, 139, 0.6)";
    ctx.fillRect( canvas_x-50, height-10, height+10, 10 );

    if ( $(":input[name=browser1]:checked").val() == "none" )
    {
    ctx.fillStyle = "black";
    ctx.fillText("DHSs", canvas_x-140, height+10);
    ctx.fillStyle = "#610809";
    ctx.fillRect( canvas_x-80, height, 1, 10 );
    ctx.fillRect( canvas_x-70, height, 3, 10 );
    ctx.fillRect( canvas_x-65, height, 1, 10 );
    ctx.fillRect( canvas_x-55, height, 4, 10 );
    ctx.fillRect( canvas_x-45, height, 2, 10 );
    ctx.fillRect( canvas_x-35, height, 1, 10 );
    ctx.fillRect( canvas_x-30, height, 5, 10 );
    ctx.fillRect( canvas_x-25, height, 1, 10 );
    ctx.fillStyle = "black";
    ctx.fillText("Genes", canvas_x-140, height+20);
    ctx.fillText("fwd strand (+)", canvas_x-90, height+20);
    ctx.fillStyle = "#337DFF";
    ctx.fillText("rev strand (-)", canvas_x-90, height+30);
    }
}

function drawHeatMap( canvas_id, canvas_x_start, canvas_x, canvas_y_start, canvas_y, flipY ) 
{
    var p = canvas_id.substr(canvas_id.indexOf('_')+1);
    var canvas = $( '#' + canvas_id )[0];
    if (! canvas )
    {
        return;
    }
    var ctx = canvas.getContext("2d");
    if (! ctx)
    {
        return;
    }

    if ( $("#" + canvas_id).data("error") )
    {
        $('#loading_' + n).hide();
        ctx.fillStyle = "black";
        var message = "Error: " + $("#" + canvas_id).data("error");
        displayCenter( '#' + canvas_id, canvas_x, canvas_y, message );
        return;
    }


    num_rows = $( '#' + canvas_id ).data("num_rows");
    if (num_rows <= 0)
    {
        return;
    }

    //getColor();
    color1_hex = '#ff0000';
    color2_hex = '#00ff00';

    $( '#sliderRangePosAppendDiv_' + p ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 1.0)' );
    $( '#sliderRangePos_' + p + ' .ui-slider-range' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 0.5)' );
    $( '#sliderRangeNeg_' + p + ' .ui-slider-range' ).css( 'background', 'rgba(' + hexToRgb(color2_hex).r + ',' + hexToRgb(color2_hex).g + ',' + hexToRgb(color2_hex).b + ', 1.0)' );

    clearCanvas( canvas_id, canvas_x_start, canvas_x, 0, canvas_y+20 );

    if ( $('#' + canvas_id).data("estimate") )
    {
        ctx.fillStyle = "#9900FF";
        var text= "Warning: Due to viewing too many bins,"
        var t = ctx.measureText(text).width;
        if (flipY)
            ctx.fillText(text, canvas_x-t-1, 363-20);
        else
            ctx.fillText(text, canvas_x-t-1, 10);

        text = "the current values are estimations." 
        var t = ctx.measureText(text).width;
        if (flipY)
            ctx.fillText(text, canvas_x-t-1, 363-10);
        else
            ctx.fillText(text, canvas_x-t-1, 20);
    }

    //Draw gradient bar
    if (flipY)
        drawGradientBar(canvas_id, 10, 20, 363-canvas_y/2, canvas_y/2-10, true);
    else
        drawGradientBar(canvas_id, 10, 20, 10, canvas_y/2-10, false);

    var size_x = (canvas_x-canvas_x_start) / num_rows;
    var size_y = (canvas_y-canvas_y_start) / num_rows;

    var x_start = canvas_x_start;
    var y_start;

    if (flipY)
        y_start = canvas_y_start;
    else
        y_start = canvas_y;

    var n = 0; //index of the array
    for (i = num_rows; i > 0; i--)
    {
        var cur_x = x_start;
        var cur_y = y_start;

        for (j = 0; j < i; j++)
        {
            var val = parseFloat($( '#' + canvas_id ).data("matrix")[n]);
            var rbg_str = getRgbStr(255, 255, 255, 1.0);

            if ( $( '#' + canvas_id ).data("positive") )
            {
                if ( $( '#' + canvas_id ).data("num_rows") == 1 )
                {
                    if ( val >= cut_off )
                    {
                        rbg_str = getRgbStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b );
                    }
                }
                else
                {
                    if ( val >= $( '#' + canvas_id ).data("posMax") )
                    {
                        rbg_str = getRgbStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b );
                    }
                    else if (val <= $( '#' + canvas_id ).data("posMin") )
                    {
                    }
                    else
                    {
                        rbg_str = getRgbaStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b, (1.0 * ( val - $( '#' + canvas_id ).data("posMin") ))/( $( '#' + canvas_id ).data("posMax") - $( '#' + canvas_id ).data("posMin") ) );
                    }
                }
            }
            if ( $( '#' + canvas_id ).data("negative") )
            {
                if ( $( '#' + canvas_id ).data("num_rows") == 1 )
                {
                    if ( val < cut_off )
                    {
                        rbg_str = getRgbStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b );

                    }
                }
                else
                {
                    if ( val >= $( '#' + canvas_id ).data("negMax") )
                    {
                    }
                    else if ( val <= $( '#' + canvas_id ).data("negMin") )
                    {
                        rbg_str = getRgbStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b );
                    }
                    else
                    {
                        rbg_str = getRgbaStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b, (1.0 * ( val - $( '#' + canvas_id ).data("negMin") ))/( $( '#' + canvas_id ).data("negMax") - $( '#' + canvas_id ).data("negMin") ) );
                    }
                }
            }

            //if (shade != 255)
            //{
                if (j == 0) //Draws triangle at bottom
                {
                    if (flipY)
                        drawTriangle(ctx, cur_x, cur_y, size_x, -size_y, rbg_str);
                    else
                        drawTriangle(ctx, cur_x, cur_y, size_x, size_y, rbg_str);
                    //setTimeout(drawTriangle, 3, ctx, cur_x, cur_y, size_x, size_y, bg);
                }
                else
                {
                    drawSquare(ctx, cur_x, cur_y, size_x, size_y, rbg_str);
                    //setTimeout(drawSquare, 3, ctx, cur_x, cur_y, size_x, size_y, bg);
                }
            //}
            cur_x += size_x/2;
            if (flipY)
                cur_y += size_y;
            else
                cur_y -= size_y;
            n += 1;
        }//closes for (j = 0; j < i; j++)
        x_start += size_x;
    } //closes for (i = num_rows; i > 0; i--)

    //Draw the location ticks
    if (flipY)
        drawLocationBar( canvas_id, canvas_x_start, canvas_x, 20, canvas_y, $('#start' + p).val(), $('#end' + p).val(), $('#chr' + p).val(), flipY );
    else {
	if ( p==3 ) {p=1;}
        drawLocationBar( canvas_id, canvas_x_start, canvas_x, canvas_y, canvas_y, $('#start' + p).val(), $('#end' + p).val(), $('#chr' + p).val(), flipY );
	p = 1;
	}
    if ( p == 1 )
        drawLegend( ctx, canvas_x_start, canvas_x, canvas_y_start, canvas_y );

/*
    var extra_canvas = document.createElement("canvas");
    var w = 1800;
    var h = 900;
    extra_canvas.setAttribute('width',w);
    extra_canvas.setAttribute('height',h);
    var ntx = extra_canvas.getContext('2d');
    ntx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,w,h);
    var dataURL = extra_canvas.toDataURL("image/jpeg", 1.0);
    $("#lk").attr("href", dataURL);
*/
} //closes function drawHeatMap()

function captureDIV()
{
    html2canvas($('#heatMapContainer'), {
        onrendered: function (canvas) {
            var extra_canvas = document.createElement("canvas");
            var w = 1800;
            var h = 900;
            extra_canvas.setAttribute('width',w);
            extra_canvas.setAttribute('height',h);
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,w,h);
            var img = extra_canvas.toDataURL("image/png");
            $("#lk").attr("href", img);
        }
    });
}


//binary search function: finding the last negative value in sorted array, before it becomes zero or positive
function getLastNegValue(c_array, value)
{
    var imin = 0;
    var imax = c_array.length - 1;
    while (imax > imin)
    {
        var imid = Math.floor((imax + imin) / 2);
        if (c_array[imid] < value)
        {
            imin = imid + 1;
        }
        else
        {
            imax = imid - 1;
        }
    }
    return c_array[imin];
}

function getCutOffs ( canvas_id )
{
    var upper_quan = 0.95;
    var lower_quan = 0.05;

    if ( $( '#' + canvas_id ).data("matrix") )
    {

        //sort matrix (now as an array) by value
        var sorted_array = $( '#' +  canvas_id ).data("matrix").slice().sort(function (a, b) { return parseFloat(a) - parseFloat(b);});
        $( '#' + canvas_id ).data("positive", 1);
        $( '#' + canvas_id ).data("negative", 1);
        l = sorted_array.length;
        $( '#' + canvas_id ).data( "abs_max", sorted_array[l-1] );
        $( '#' + canvas_id ).data( "abs_min", sorted_array[0]   );
        //array does not contain negative values
        if ( sorted_array[0] >= cut_off )
        {
            $( '#' + canvas_id ).data("negative", 0);
            $( '#' + canvas_id ).data( "cut_max_pos", Math.max(1, valueToPercent( canvas_id, sorted_array[ Math.floor( l*upper_quan ) ] ) ));
            $( '#' + canvas_id ).data( "cut_min_pos", valueToPercent( canvas_id, sorted_array[ Math.floor( l*lower_quan ) ] ) ); 

            if ( $( '#' + canvas_id ).data( "cut_max_pos") < 0.1 && $( '#' + canvas_id ).data( "cut_min_pos") < 0.1 )
                $( '#' + canvas_id ).data( "cut_max_pos", 1);

        }
        else
        {
            //array does not contain positive values
            if ( sorted_array[sorted_array.length-1] <= cut_off)
            {
                $( '#' + canvas_id ).data("positive", 0);
                $( '#' + canvas_id ).data( "cut_max_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( l*upper_quan ) ] ) );
                $( '#' + canvas_id ).data( "cut_min_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( l*lower_quan ) ] ) );
            }
            //array contains both positive and negative values
            else
            {
                //get the last index of the last negative value
                var i = sorted_array.lastIndexOf( getLastNegValue( sorted_array, cut_off ) );
                var p = valueToPercent( canvas_id, sorted_array[ i ] );
                $( '#' + canvas_id ).data( "cut_max_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( i*upper_quan ) ]) );
                $( '#' + canvas_id ).data( "cut_min_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( i*lower_quan ) ]) );

                $( '#' + canvas_id ).data( "cut_max_pos", valueToPercent( canvas_id, sorted_array[ Math.floor( i + (l-i)*upper_quan ) ]) );
                $( '#' + canvas_id ).data( "cut_min_pos", valueToPercent( canvas_id, sorted_array[ Math.floor( i + (l-i)*lower_quan ) ]) );
            }
        }
    }
}

function getRange( canvas_id )
{
    max_val = $( '#' + canvas_id ).data("abs_max");
    min_val = $( '#' + canvas_id ).data("abs_min");
    return max_val - min_val;
}

function getSigFig( canvas_id )
{
    range   = getRange( canvas_id );
    if (range == 0)
    {
        return 0;
    }

    sigFig  = Math.floor(Math.log10(range)) - 2;
    return sigFig;
}

function getIncrementSize( canvas_id )
{
    sigFig  = getSigFig( canvas_id );
    step = Math.pow( 10, sigFig );
    return step;
}

function getRoundUp( value, increment )
{
    if (value == 0)
    {
        return 0;
    }
    return (value/Math.abs(value)) * Math.ceil( Math.abs(value) / increment) * increment;      
}

function getRoundDown( value, increment )
{
    if (value == 0)
    {
        return 0;
    }
    return (value/Math.abs(value)) * Math.floor( Math.abs(value) / increment) * increment;
}

function percentToValue( canvas_id, percent )
{
    min_val = $( '#' + canvas_id ).data("abs_min");
    percentage = percent / 100.0;
    range   = getRange( canvas_id );

    return range * percentage + min_val;
}

function valueToPercent( canvas_id, value )
{
    min_val = $( '#' + canvas_id ).data("abs_min");
    range   = getRange( canvas_id );

    percentage = (value - min_val) / range;
    return percentage * 100.0;
}

function resetSpinners( canvas_id )
{
    var p = canvas_id.substr(canvas_id.indexOf('_')+1);
    if ( $( '#' + canvas_id ).data("positive") )
    {
        $( '#spinnerPosMin_' + p ).spinner( "value", $( '#' + canvas_id ).data("posMin") );
        $( '#spinnerPosMax_' + p ).spinner( "value", $( '#' + canvas_id ).data("posMax") );
    }
    if ( $( '#' + canvas_id ).data("negative") )
    {
        $( '#spinnerNegMin_' + p ).spinner( "value", $( '#' + canvas_id ).data("negMin") );
        $( '#spinnerNegMax_' + p ).spinner( "value", $( '#' + canvas_id ).data("negMax") );  
    }
}

$( '.refreshButton' ).click(function() {
    var p = this.id.substr(this.id.indexOf('_')+1);
    var canvas_id = 'heatMapCanvas_' + p;

/*
    var s = {};
    if ( window.name )
    {
        s = JSON.parse(window.name);
    }
    s['color1'] = $( '#pos_color_text' ).val();
    s['color2'] = $( '#neg_color_text' ).val();
    window.name = JSON.stringify(s);
    color1_hex = $( '#pos_color_text' ).val();
    color2_hex = $( '#neg_color_text' ).val();
*/
    color1_hex = '#ff0000';
    color2_hex = '#00ff00';

    //$( '#sliderRangePosAppendDiv_' + p ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 1.0)' );
    $( '#sliderRangePos_' + p + ' .ui-slider-range' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 0.5)' );
    $( '#sliderRangeNeg_' + p ).css( 'background', 'rgba(' + hexToRgb(color2_hex).r + ',' + hexToRgb(color2_hex).g + ',' + hexToRgb(color2_hex).b + ', 1.0)' );

    if ( $( '#' + canvas_id ).data("positive") && ( isNaN(parseFloat( $( '#spinnerPosMin_' + p ).spinner( "value") ) ) || isNaN(parseFloat( $( '#spinnerPosMax_' + p ).spinner( "value") ) ) ) )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( '#' + canvas_id ).data("negative") && ( isNaN(parseFloat( $( '#spinnerNegMin_' + p ).spinner( "value") ) ) || isNaN(parseFloat( $( '#spinnerNegMax_' + p ).spinner( "value") ) ) ) )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( '#' + canvas_id ).data("positive") && $( '#spinnerPosMin_' + p ).spinner( "value") > $( '#spinnerPosMax_' + p ).spinner( "value") )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( '#' + canvas_id ).data("negative") && $( '#spinnerNegMin_' + p ).spinner( "value") > $( '#spinnerNegMax_' + p ).spinner( "value") )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( '#' + canvas_id ).data("positive") && $( '#' + canvas_id ).data("negative") && $( '#spinnerNegMax_' + p ).spinner( "value") > $( '#spinnerPosMin_' + p ).spinner( "value") )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( '#' + canvas_id ).data("positive") )
    {
        $( '#sliderRangePos_' + p ).slider( "values", 0, getRoundDown( valueToPercent( canvas_id, $( '#spinnerPosMin_' + p ).spinner( "value") ), 0.01 ) );
        $( '#sliderRangePos_' + p ).slider( "values", 1, getRoundUp( valueToPercent( canvas_id, $( '#spinnerPosMax_' + p ).spinner( "value") ), 0.01 ) );
        $( canvas_id ).data("posMin", $( '#spinnerPosMin_' + p ).spinner( "value") );
        $( canvas_id ).data("posMax", $( '#spinnerPosMax_' + p ).spinner( "value") );
    }
    if ( $( canvas_id ).data("negative") )
    {
        $( '#sliderRangeNeg_' + p ).slider( "values", 0, getRoundDown( valueToPercent( canvas_id, $( '#spinnerNegMin_' + p ).spinner( "value") ), 0.01 ) );
        $( '#sliderRangeNeg_' + p ).slider( "values", 1, getRoundUp( valueToPercent( canvas_id, $( '#spinnerNegMax_' + p ).spinner( "value") ), 0.01 ) );
        $( '#' + canvas_id ).data("negMin", $( '#spinnerNegMin_' + p ).spinner( "value") );
        $( '#' + canvas_id ).data("negMax", $( '#spinnerNegMax_' + p ).spinner( "value") );
    }

    for (p = 1; p <= 2; p++)
    {
        if (p % 2 == 1)
            {
                drawHeatMap('heatMapCanvas_'+p, 0, canvasWidth, 0, canvasHeight, false);
            }
            else
            {
                drawHeatMap('heatMapCanvas_'+p, 0, canvasWidth, 20, canvasHeight+20, true);
            }
    }
});

//adapted from https://jqueryui.com/slider/#range
//             https://stackoverflow.com/questions/19142251/jquery-slider-with-range-and-three-different-background-color
function drawSlider( canvas_id )
{
    var n = canvas_id.substr(canvas_id.indexOf('_')+1);
    getCutOffs( canvas_id );

    if ( $( '#' + canvas_id ).data("num_rows") <= 1 )
    {
        return;
    }

    var increSize = getIncrementSize( canvas_id );
    var round_max = getRoundUp(   $( '#' + canvas_id ).data("abs_max"), increSize );
    var round_min = getRoundDown( $( '#' + canvas_id ).data("abs_min"), increSize );
    $( '.spinnerButton' ).show();

    if ( $( '#' + canvas_id ).data("positive") )
    {
        
        $( '.pos_color' ).show();
        $( '#colorButton' ).show();

        var spinnerPosDivID = 'spinnerPosDiv_' + n;
        var spinnerPosMinID = 'spinnerPosMin_' + n;
        var spinnerPosMaxID = 'spinnerPosMax_' + n;
        var sliderRangePosID = 'sliderRangePos_' + n;

        var sliderRangeNegID = 'sliderRangeNeg_' + n;

        $( '#' + spinnerPosDivID ).show();

        $( '#' + spinnerPosMinID ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value >= $( '#' + spinnerPosMaxID ).spinner( "value") )
                {
                    return false;
                }
                if ( $( '#' + canvas_id ).data("negative") && ui.value <= $( '#' + spinnerNegMaxID ).spinner( "value") )
                {
                    return false;
                }
            },
        });
        $( '#' + spinnerPosMaxID ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value <= $( '#' + spinnerPosMinID ).spinner( "value") )
                {
                    return false;
                }
            },
        });

        $( '#' + sliderRangePosID ).slider({
            range: true,
            min: 0,
            max: 100.0,
            step: 0.01,
            values: [ $( '#' + canvas_id ).data("cut_min_pos"), $( '#' + canvas_id ).data("cut_max_pos") ],

            slide: function (event, ui) {
                if ( $( '#' + canvas_id ).data("negative") && ui.values[0] <= $( '#' + sliderRangeNegID ).slider( "values", 1 ) )
                {
                    return false;
                }
                $('#sliderRangePosAppendDiv_' + n).css('width', 100 - ui.values[1] +'%');
                $( '#' + spinnerPosMinID ).spinner( "value", percentToValue( canvas_id, ui.values[0] ) );
                $( '#' + spinnerPosMaxID ).spinner( "value", percentToValue( canvas_id, ui.values[1] ) );
            },

            change: function (event, ui) {
                if ( $( '#' + canvas_id ).data("negative") && ui.values[0] <= $( '#' + sliderRangeNegID ).slider( "values", 1 ) )
                {
                    return false;
                }
                $('#sliderRangePosAppendDiv_' + n).css('width', 100 - ui.values[1] +'%');
                $( '#' + canvas_id ).data("posMin", $( '#' + spinnerPosMinID ).spinner( "value") );
                $( '#' + canvas_id ).data("posMax", $( '#' + spinnerPosMaxID ).spinner( "value") );


                for (p = 1; p <= 2; p++)
                {
                    if (p % 2 == 1)
                    {
                        drawHeatMap('heatMapCanvas_'+p, 0, canvasWidth, 0, canvasHeight, false);
			drawTAD( 'heatMapCanvas_'+p );
                    }
                    else
                    {
                        drawHeatMap('heatMapCanvas_'+p, 0, canvasWidth, 20, canvasHeight+20, true);
			drawTAD( 'heatMapCanvas_'+p );
                    }
                }

           }

        }).append('<div class="sliderRangePosAppendDiv" id="sliderRangePosAppendDiv_' + n + '" style="width: '+ (100 - $( '#' + sliderRangePosID ).slider( "values", 1 )) +'%"></div>');

        $( '#' + spinnerPosMinID ).spinner( "value", percentToValue( canvas_id, $( '#' + sliderRangePosID ).slider( "values", 0 ) ));
        $( '#' + spinnerPosMaxID ).spinner( "value", percentToValue( canvas_id, $( '#' + sliderRangePosID ).slider( "values", 1 ) ));

        $( '#' + canvas_id ).data("posMin", $( '#' + spinnerPosMinID ).spinner( "value") );
        $( '#' + canvas_id ).data("posMax", $( '#' + spinnerPosMaxID ).spinner( "value") );
    }


    if ( $( '#' + canvas_id ).data("negative") )
    {
        $( '.neg_color' ).show();
        $( '#colorButton' ).show();

        var spinnerNegDivID = 'spinnerNegDiv_' + n;
        var spinnerNegMinID = 'spinnerNegMin_' + n;
        var spinnerNegMaxID = 'spinnerNegMax_' + n;
        var sliderRangeNegID = 'sliderRangeNeg_' + n;

        $( '#' + spinnerNegDivID ).show();

        $( '#' + spinnerNegMinID ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value >= $( '#' + spinnerNegMaxID ).spinner( "value") )
                {
                    return false;
                }
            },
        });
        $( '#' + spinnerNegMaxID ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value <= $( '#' + spinnerNegMinID ).spinner( "value") )
                {
                    return false;
                }
                if ( $( canvas_id ).data("positive") && ui.value >= $( '#spinnerPosMin' ).spinner( "value") )
                {
                    return false;
                }          
            },
        });

        $( '#' + sliderRangeNegID ).slider({
            range: true,
            min: 0,
            max: 100.0,
            step: 0.01,
            values: [ $( canvas_id ).data("cut_min_neg"), $( canvas_id ).data("cut_max_neg") ],

            slide: function (event, ui) {
                if ( $( canvas_id ).data("positive") && ui.values[1] >= $( '#sliderRangePos' ).slider( "values", 0 ) )
                {
                    return false;
                }
                $('#sliderRangeNegAppendDiv').css('width', 100 - ui.values[1] +'%');
                $( '#' + spinnerNegMinID ).spinner( "value", percentToValue( canvas_id, ui.values[0] ) );
                $( '#' + spinnerNegMaxID ).spinner( "value", percentToValue( canvas_id, ui.values[1] ) );
            },

       
            change: function (event, ui) {
                if ( $( canvas_id ).data("positive") && ui.values[1] >= $( '#sliderRangePos' ).slider( "values", 0 ) )
                {
                    return false;
                }
                $('#sliderRangeNegAppendDiv').css('width', 100 - ui.values[1] +'%');
                $( canvas_id ).data("negMin", $( '#' + spinnerNegMinID ).spinner( "value") );
                $( canvas_id ).data("negMax", $( '#' + spinnerNegMaxID ).spinner( "value") );
                drawHeatMap( canvas_id, 0, 686, 0, 343);
            }

        }).append('<div id="sliderRangeNegAppendDiv" style="width: '+ (100 - $( '#' + sliderRangeNegID ).slider( "values", 1 )) +'%"></div>');

        $( '#' + spinnerNegMinID ).spinner( "value", percentToValue( canvas_id, $( '#' + sliderRangeNegID ).slider( "values", 0 ) ));
        $( '#' + spinnerNegMaxID ).spinner( "value", percentToValue( canvas_id, $( '#' + sliderRangeNegID ).slider( "values", 1 ) ));

        $( canvas_id ).data("negMin", $( '#' + spinnerNegMinID ).spinner( "value") );
        $( canvas_id ).data("negMax", $( '#' + spinnerNegMaxID ).spinner( "value") );

    }
}

console.log($( canvas_id ).data("negMin"));
var canvas_start_x = 0;
var canvas_endin_x = canvasWidth;
var canvas_start_y = 0;
var canvas_endin_y = canvasHeight + 20;
var canvas_image_y = canvasHeight;

function drawNavigator( canvas_id, x, y )
{
    var n = canvas_id.substr(canvas_id.indexOf('_')+1);
    var canvas = $( '#navigator_1' )[0];
    var danvas = $( '#navigator_2' )[0];
    if (! canvas )
    {
        return;
    }
    var ctx = canvas.getContext("2d");
    var dtx = danvas.getContext("2d");
    if (! ctx)
    {
        return;
    }

    var num_rows = $( '#heatMapCanvas_' + n ).data("num_rows");
    if (!num_rows)
    {
        return;
    }

    if ( n == 2)
        y = canvas_endin_y - y;
    
    ctx.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);
    dtx.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);

    var size_x = (canvas_endin_x-canvas_start_x)/num_rows;
    var size_y = (canvas_endin_y-canvas_start_y)/num_rows;

    var cur_x = x;

    var cur_y = canvas_image_y - y;
    var start_x = cur_x - (canvas_image_y - y);
    var endin_x = cur_x + (canvas_image_y - y);

    var start_x = Math.floor(start_x/size_x) * size_x;
    var endin_x = Math.ceil(endin_x/size_x) * size_x;
    var offst_x = (endin_x - start_x)/2;

    var start_y = offst_x;

    ctx.fillStyle = "rgba(150, 150, 150, 0.35)";
    ctx.strokeStyle = "black";
    dtx.fillStyle = "rgba(150, 150, 150, 0.35)";
    dtx.strokeStyle = "black";


    var ext1 = $( '#embedCanvas_1' )[0];
    var ext2 = $( '#embedCanvas_2' )[0];

    var txt1 = $( '#embedCanvas2_1' )[0];
    var txt2 = $( '#embedCanvas2_2' )[0];

    if (ext1)
        etx1 = ext1.getContext("2d");
    if (ext2)
        etx2 = ext2.getContext("2d");

    if (txt1)
        ttx1 = txt1.getContext("2d");
    if (txt2)
        ttx2 = txt2.getContext("2d");


    if (ext1)
        etx1.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);
    if (ext2)
        etx2.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);
    if (ttx1)
        ttx1.clearRect(canvas_start_x,0,canvas_endin_x-canvas_start_x,10);
    if (ttx2)
        ttx2.clearRect(canvas_start_x,0,canvas_endin_x-canvas_start_x,10);


    if (start_x >= 0 && endin_x <= canvas_endin_x && y <= canvas_image_y)
    {
        offst_x = (endin_x - start_x)/2;

        ctx.beginPath();
        ctx.moveTo(start_x, canvas_endin_y);
        ctx.lineTo(start_x, canvas_image_y);
        ctx.lineTo(start_x + offst_x, canvas_image_y - start_y);
        ctx.lineTo(endin_x, canvas_image_y);
        ctx.lineTo(endin_x, canvas_endin_y);

        dtx.beginPath();
        dtx.moveTo(start_x, 0);
        dtx.lineTo(start_x, canvas_endin_y - canvas_image_y);
        dtx.lineTo(start_x + offst_x, canvas_endin_y - canvas_image_y + start_y);
        dtx.lineTo(endin_x, canvas_endin_y - canvas_image_y);
        dtx.lineTo(endin_x, 0);

        if (endin_x - size_x > start_x + size_x)
        {
            ctx.moveTo(start_x + size_x, canvas_endin_y);
            ctx.lineTo(start_x + size_x, canvas_image_y);
            ctx.lineTo(start_x + offst_x, canvas_image_y - start_y + size_x);
            ctx.lineTo(endin_x - size_x , canvas_image_y);
            ctx.lineTo(endin_x - size_x , canvas_endin_y);
        }
        ctx.fill();
        dtx.fill();

        if (ext1)
        {
            etx1.fillStyle = "rgba(50, 50, 50, 0.2)";
            etx1.fillRect(start_x, 0, size_x, canvas_endin_y);
            etx1.fillRect(endin_x - size_x , 0, size_x, canvas_endin_y);
        }

        if (ext2)
        {
            etx2.fillStyle = "rgba(50, 50, 50, 0.2)";
            etx2.fillRect(start_x, 0, size_x, canvas_endin_y);
            etx2.fillRect(endin_x - size_x , 0, size_x, canvas_endin_y);
        }

        if (ttx1)
        {
            ttx1.fillStyle = "rgba(50, 50, 50, 0.2)";
            ttx1.fillRect(start_x, 0, size_x, 10);
            ttx1.fillRect(endin_x - size_x , 0, size_x, 10);
        }

        if (ttx2)
        {
            ttx2.fillStyle = "rgba(50, 50, 50, 0.2)";
            ttx2.fillRect(start_x, 0, size_x, 10);
            ttx2.fillRect(endin_x - size_x , 0, size_x, 10);
        }
    }
}


$(".navigator").click(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    drawNavigator( this.id, x, y );
});

$(".navigator").dblclick(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    var p = this.id.substr(this.id.indexOf('_')+1);

    /*
    var num_rows = $( '#heatMapCanvas' ).data("num_rows");
    if (!num_rows)
    {
        return;
    }
    */

    var size_x = (canvas_endin_x-canvas_start_x)/num_rows;

    var cur_x = x;
    var cur_y = canvas_endin_y - y;

    var start_x = cur_x - cur_y;
    var endin_x = cur_x + cur_y;
    //var start_x = Math.floor(start_x/size_x) * size_x;
    //var endin_x = Math.floor(endin_x/size_x) * size_x;

    if (start_x >= 0 && endin_x <= canvas_endin_x && y <= canvas_image_y)
    {
        //$( "#start" ).empty();
        //$( "#end"   ).empty();
        $( '#start' ).val( get_x_to_g_coord('1_1', start_x) );
        $( '#end'   ).val( get_x_to_g_coord('1_1', endin_x) );
        //var endVal = get_x_to_g_coord(endin_x, 1);
        //$( '#end'   ).val( endVal );
        //document.getElementsByName('end')[0].value = endVal;

        $( '#s2' ).val( get_x_to_g_coord('2_2', start_x) );
        $( '#e2' ).val( get_x_to_g_coord('2_2', endin_x) );

        $("#mainForm").submit();
    }   

});

function drawShading( canvas_id, x )
{
    var canvas = $( canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");
        if (ctx)
        {
            clearNavigator( canvas_id )
            ctx.fillStyle = "rgba(0, 200, 0, 0.2)"
            ctx.fillRect( Math.min(init_x_coord, x), 0, Math.abs(init_x_coord-x), 343 );
        }
    }
}

function clearNavigator( canvas_id )
{
    var canvas = $( canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");
        if (ctx)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);           
        }
    }
}

var mouseDownFlag = false;
var mouseDownX = 0;

$(".navigator").mousedown(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    mouseDownFlag = true;
    mouseDownX = x;
});

$(".navigator").mousemove(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    var p = this.id.substr(this.id.indexOf('_')+1);
    if (mouseDownFlag)
    {
        if (p % 2 == 1)
        {
            clearCanvas('heatMapCanvas_'+p, 0, canvasWidth, 0, canvasHeight+20);
            drawHeatMap('heatMapCanvas_'+p, 0 + x-mouseDownX, canvasWidth + x-mouseDownX, 0, canvasHeight, false);
        }
        else
        {
            clearCanvas('heatMapCanvas_'+p, 0, canvasWidth, 0, canvasHeight+20);
            drawHeatMap('heatMapCanvas_'+p, 0 + x-mouseDownX, canvasWidth + x-mouseDownX, 20, canvasHeight+20, true);
        }
    }
});

$(".navigator").mouseleave(function(e) {
    var p = this.id.substr(this.id.indexOf('_')+1);
    if (mouseDownFlag)
    {
        if (p % 2 == 1)
        {
            clearCanvas('heatMapCanvas_'+p, 0, canvasWidth, 0, canvasHeight+20);
            drawHeatMap('heatMapCanvas_'+p, 0, canvasWidth, 0, canvasHeight, false);
        }
        else
        {
            clearCanvas('heatMapCanvas_'+p, 0, canvasWidth, 0, canvasHeight+20);
            drawHeatMap('heatMapCanvas_'+p, 0, canvasWidth, 20, canvasHeight+20, true);
        }

        mouseDownFlag = false;        
    }
});

$(".navigator").mouseup(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    if (mouseDownFlag)
    {
        if (Math.abs(x - mouseDownX) > 5)
        {
            g1 = get_x_to_g_coord(this.id, mouseDownX );
            g2 = get_x_to_g_coord(this.id, x );
            d  = g1 - g2;

            $.contextMenu({
                // define which elements trigger this menu
                selector: "#navigator_1",
                trigger: 'left',
                callback: function(key, options) {
                    if (key == "one")
                    {
                        $( '#start' ).val( parseInt($( '#start' ).val()) + d );
                        $( '#end' ).val( parseInt($( '#end' ).val()) + d );
                        $("#mainForm").submit();
                    }
                    else if (key == "two")
                    {
                        $( '#start' ).val( parseInt($( '#start' ).val()) + d );
                        $( '#end' ).val( parseInt($( '#end' ).val()) + d );
                        $( '#s2' ).val( parseInt($( '#s2' ).val()) + d );
                        $( '#e2' ).val( parseInt($( '#e2' ).val()) + d );
                        $("#mainForm").submit();
                    }
                    else
                    {
                    }
                },
                // define the elements of the menu
                items:  {
                two: {name: "Move Both" },
                one: {name: "Move This Heatmap Only" },
                highlight: {name: "Highlight/Unhighlight" }
                }
            });


            $.contextMenu({
                // define which elements trigger this menu
                selector: "#navigator_2",
                trigger: 'left',
                callback: function(key, options) {
                    if (key == "one")
                    {
                        $( '#s2' ).val( parseInt($( '#s2' ).val()) + d );
                        $( '#e2' ).val( parseInt($( '#e2' ).val()) + d );
                        $("#mainForm").submit();
                    }
                    else if (key == "two")
                    {
                        $( '#start' ).val( parseInt($( '#start' ).val()) + d );
                        $( '#end' ).val( parseInt($( '#end' ).val()) + d );
                        $( '#s2' ).val( parseInt($( '#s2' ).val()) + d );
                        $( '#e2' ).val( parseInt($( '#e2' ).val()) + d );
                        $("#mainForm").submit();
                    }
                    else
                    {
                    }
                },
                // define the elements of the menu
                items:  {
                two: {name: "Move Both" },
                one: {name: "Move This Heatmap Only" },
                highlight: {name: "Highlight" }
                }
            });

        }
        mouseDownFlag = false;
    }

});


$(".navigator").mouseover(function(e) {
    $(".navigator").css( 'cursor', 'pointer' );
});
