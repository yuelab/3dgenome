//Defines log10 (not defined in older versions of Safari)
Math.log10 = function (x) { return Math.log(x) / Math.LN10; };
var cut_off = 0;

//Display text in the center of the canvas
function displayCenterLoc( canvas_id, size_x, size_y, message) {
    var canvas = $( canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");
        if (ctx)
        {
            var text = message;
            var t = ctx.measureText(text).width/2-1;
            ctx.fillStyle = "black";
            ctx.fillText(text, size_x/2-t, size_y/2);
        }
    }
}

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
    var canvas = $( canvas_id )[0];
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(255,255,255,1)"; //white
    ctx.fillRect(canvas_x_start,canvas_y_start,canvas_x,canvas_y); //clear canvas region
}

function drawGradientBar( canvas_id, x_start, x_size, y_start, y_size )
{
    var canvas = $( canvas_id )[0];
    var ctx = canvas.getContext("2d");
    if ( $( canvas_id ).data("num_rows") <= 1)
    {
        return;
    }
    var my_gradient=ctx.createLinearGradient(0, 0, 0, y_size);
    if ( $( canvas_id ).data("positive") && $( canvas_id ).data("negative") )
    {
        my_gradient.addColorStop(0,color1_hex);
        my_gradient.addColorStop(0.55,"white");
        my_gradient.addColorStop(1,color2_hex);

        ctx.fillStyle="black";
        ctx.fillText(String.fromCharCode("8805") + " " + $( canvas_id ).data("posMax"), x_start+x_size+15, y_start       -5 );
        ctx.fillText(String.fromCharCode("8804") + " " + $( canvas_id ).data("negMin"), x_start+x_size+15, y_start+y_size-10);
        if ( $( canvas_id ).data("negMax") != $( canvas_id ).data("posMin") )
        {
            ctx.fillText( $( canvas_id ).data("negMax") + " - " + $( canvas_id ).data("posMin"), x_start+x_size+15, y_start+(y_size-20)/2 );
        }
        else
        {
            ctx.fillText( $( canvas_id ).data("negMax"), x_start+x_size+15, y_start+(y_size-20)/2 );
        }
    }
    else
    {
        if ( $( canvas_id ).data("positive") )
        {
            my_gradient.addColorStop(0,color1_hex);
            my_gradient.addColorStop(1,"white");

            ctx.fillStyle="black";
            ctx.fillText(String.fromCharCode("8805") + " " + $( canvas_id ).data("posMax"), x_start+x_size+15, y_start       -5 );
            ctx.fillText(String.fromCharCode("8804") + " " + $( canvas_id ).data("posMin"), x_start+x_size+15, y_start+y_size-10);
        }
        else if ( $( canvas_id ).data("negative") )
        {
            my_gradient.addColorStop(0,"white");
            my_gradient.addColorStop(1,color2_hex);

            ctx.fillStyle="black";
            ctx.fillText(String.fromCharCode("8805") + " " + $( canvas_id ).data("negMax"), x_start+x_size+15, y_start       -5 );
            ctx.fillText(String.fromCharCode("8804") + " " + $( canvas_id ).data("negMin"), x_start+x_size+15, y_start+y_size-10);
        }
        else
        {
            return;
        }
    }
    ctx.fillStyle=my_gradient;
    ctx.fillRect(x_start, x_size, y_start, y_size);
    ctx.strokeStyle="black";
    ctx.strokeRect(x_start, x_size, y_start, y_size);
}

function drawXTicks( ctx, cur_x, cur_y, inward_flag )
{
    ctx.beginPath();
    if (inward_flag)
    {
        ctx.moveTo( cur_x, cur_y-4 );
    }
    else
    {
        ctx.moveTo( cur_x, cur_y   );
    }
    ctx.lineTo( cur_x, cur_y+5 );
    ctx.strokeStyle = "black";
    ctx.stroke();   
}

function drawXLabel( ctx, cur_x, cur_y, cur_x_tick, canvas_x )
{
    ctx.fillStyle = "black";
    var text = Number(cur_x_tick).toLocaleString(); //cur_x_tick.toString();
    var s = cur_x-ctx.measureText(text).width/2-1;
    var e = cur_x+ctx.measureText(text).width/2-1
    if (s < ctx.measureText($('#chr').val()).width || e > canvas_x )
    {
        return;
    }
    ctx.fillText(text, s, cur_y+10);
}

function drawLocationBar( canvas_id, canvas_x_start, canvas_x, canvas_y_start, canvas_y, loc_start, loc_end )
{
    var canvas = $( canvas_id )[0];
    var ctx = canvas.getContext("2d");

    var x_range  = loc_end - loc_start;
    var x_tick_size = Math.pow(10, Math.floor(Math.log10(x_range)));

    var cur_x_tick = Math.ceil( loc_start / x_tick_size ) * x_tick_size;
    inward_flag = true;
    while (cur_x_tick < loc_end )
    {
        var cur_x = ( cur_x_tick - loc_start ) / x_range * ( canvas_x - canvas_x_start ) + canvas_x_start;
        drawXTicks( ctx, cur_x, canvas_y_start, inward_flag );
        drawXLabel( ctx, cur_x, canvas_y_start, cur_x_tick, canvas_x);
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
    ctx.fillText( $('#chr').val(), 0, canvas_y-10);
    //if ( $( '#TADCanvas' ).data("tad") )
    //    ctx.fillText( 'Topologically Associating Domains (TADs)', 0, canvas_y);
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

function getRBGAStr(r, g, b, a)
{
    var s = 'rgba('+ r +',' + g + ',' + b + ',' + a + ')';
    return s;
}

function getRBGStr(r, g, b)
{
    return getRBGAStr(r, g, b, 1.0);
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

var getAllZerosFlag = false;

function drawHeatMap( canvas_id, canvas_x_start, canvas_x, canvas_y_start, canvas_y ) 
{
    var canvas = $( canvas_id )[0];
    if (! canvas )
    {
        return;
    }
    var ctx = canvas.getContext("2d");
    if (! ctx)
    {
        return;
    }

    if ( $("#heatMapCanvas").data("error") )
    {
        $('#loading').hide();
        ctx.fillStyle = "black";
        var message = "Error: " + $("#heatMapCanvas").data("error");
        displayCenterLoc( canvas_id, canvas_x, canvas_y, message );
        return;
    }

    num_rows = $( canvas_id ).data("num_rows");
    if (num_rows <= 0)
    {
        return;
    }

    getColor();

    $( '#sliderRangePosAppendDiv' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 1.0)' );
    $( '#sliderRangePos .ui-slider-range' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 0.5)' );
    $( '#sliderRangeNeg' ).css( 'background', 'rgba(' + hexToRgb(color2_hex).r + ',' + hexToRgb(color2_hex).g + ',' + hexToRgb(color2_hex).b + ', 1.0)' );

    clearCanvas( canvas_id, canvas_x_start, canvas_x, canvas_y_start, canvas_y+20 );

    if ( $("#heatMapCanvas").data("estimate") )
    {
        ctx.fillStyle = "#9900FF";
        var text= "Warning: Due to viewing too many bins,"
        var t = ctx.measureText(text).width;
        ctx.fillText(text, canvas_x-t-1, 10);

        text = "the current values are estimations." 
        var t = ctx.measureText(text).width;
        ctx.fillText(text, canvas_x-t-1, 20);
    }
    else
    {
        if ( $(":input[name=source]:checked").val() == "inside" && $("#heatMapCanvas").data("resolution") != $('#resolution').val() )
        {
            ctx.fillStyle = "#9900FF";
            var text= "The resolution has been decreased to " + $("#heatMapCanvas").data("resolution") + "kb";
            var t = ctx.measureText(text).width;
            ctx.fillText(text, canvas_x-t-1, 10);
        }
    }

    //Draw gradient bar
    drawGradientBar(canvas_id, 10, 10, 20, canvas_y/2-10);

    if (!getAllZerosFlag)
    {
    var size_x = (canvas_x-canvas_x_start) / num_rows;
    var size_y = (canvas_y-canvas_y_start) / num_rows;

    var x_start = canvas_x_start;
    var y_start = canvas_y;

    var n = 0; //index of the array

    for (i = num_rows; i > 0; i--)
    {
        var cur_x = x_start;
        var cur_y = y_start;


        for (j = 0; j < i; j++)
        {
            var val = parseFloat($( canvas_id ).data("matrix")[n]);

            var rbg_str = getRBGStr(255, 255, 255, 1.0);

            if ( $( canvas_id ).data("positive") )
            {
                if ( $( canvas_id ).data("num_rows") == 1 )
                {
                    if ( val >= cut_off )
                    {
                        rbg_str = getRBGStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b );
                    }
                }
                else
                {
                    if ( val >= $( canvas_id ).data("posMax") )
                    {
                        rbg_str = getRBGStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b );
                    }
                    else if (val <= $( canvas_id ).data("posMin") )
                    {
                    }
                    else
                    {
                        rbg_str = getRBGAStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b, (1.0 * Math.abs( val - $( canvas_id ).data("posMin") ))/Math.abs( $( canvas_id ).data("posMax") - $( canvas_id ).data("posMin") ) );
                    }
                }
            }

            if ( $( canvas_id ).data("negative") )
            {
                if ( $( canvas_id ).data("num_rows") == 1 )
                {
                    if ( val < cut_off )
                    {
                        rbg_str = getRBGStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b );

                    }
                }
                else
                {
                    if ( val >= $( canvas_id ).data("negMax") )
                    {
                    }
                    else 
                    {
                        if ( val <= $( canvas_id ).data("negMin") )
                        {
                            rbg_str = getRBGStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b );
                        }
                        else
                        {
                            alpha = 1.0 * ( ( val - $( canvas_id ).data("negMax") )/( $( canvas_id ).data("negMin") - $( canvas_id ).data("negMax") ) );
                            rbg_str = getRBGAStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b, alpha );
                        }
                    }
                }
            }

            //if (shade != 255)
            //{
                if (j == 0) //Draws triangle at bottom
                {
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
            cur_y -= size_y;
            n += 1;
        }//closes for (j = 0; j < i; j++)
        x_start += size_x;
    } //closes for (i = num_rows; i > 0; i--)

    }

    //Draw the location ticks
    drawLocationBar( canvas_id, canvas_x_start, canvas_x, canvas_y, canvas_y+20, $('#start').val(), $('#end').val() );

    var extra_canvas = document.createElement("canvas");
    var w = 1800;
    var h = 900;
    extra_canvas.setAttribute('width',w);
    extra_canvas.setAttribute('height',h);
    var ntx = extra_canvas.getContext('2d');
    ntx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,w,h);
    var dataURL = extra_canvas.toDataURL("image/jpeg", 1.0);
    $("#lk").attr("href", dataURL);
    
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
    if ($( canvas_id ).data("matrix"))
    {
        //sort matrix (now as an array) by value
        var sorted_array = $( canvas_id ).data("matrix").slice().sort(  function (a, b)
                                                                        {
                                                                            return parseFloat(a) - parseFloat(b);

                                                                        });
        $( canvas_id ).data("positive", 1);
        $( canvas_id ).data("negative", 1);


        l = sorted_array.length;
        $( canvas_id ).data( "abs_max", sorted_array[l-1] );
        $( canvas_id ).data( "abs_min", sorted_array[0]   );

        if ( $( canvas_id ).data( "abs_max") == 0 && $( canvas_id ).data( "abs_min") == 0 )
        {
            getAllZerosFlag = true;
        }

        //array does not contain negative values
        if ( sorted_array[0] >= cut_off )
        {
            $( canvas_id ).data("negative", 0);
            $( canvas_id ).data( "cut_max_pos", Math.max(1, valueToPercent( canvas_id, sorted_array[ Math.floor( l*upper_quan ) ] ) ) );
            $( canvas_id ).data( "cut_min_pos", valueToPercent( canvas_id, sorted_array[ Math.floor( l*lower_quan ) ] ) ); 
        }
        else
        {
            //array does not contain positive values
            if ( sorted_array[sorted_array.length-1] <= cut_off)
            {
                $( canvas_id ).data("positive", 0);
                $( canvas_id ).data( "cut_max_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( l*upper_quan ) ] ) );
                $( canvas_id ).data( "cut_min_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( l*lower_quan ) ] ) );
            }
            //array contains both positive and negative values
            else
            {
                //get the last index of the last negative value
                var i = sorted_array.lastIndexOf( getLastNegValue( sorted_array, cut_off ) );
                var p = valueToPercent( canvas_id, sorted_array[ i ] );
                $( canvas_id ).data( "cut_max_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( i*upper_quan ) ]) );
                $( canvas_id ).data( "cut_min_neg", valueToPercent( canvas_id, sorted_array[ Math.floor( i*lower_quan ) ]) );

                $( canvas_id ).data( "cut_max_pos", valueToPercent( canvas_id, sorted_array[ Math.floor( i + (l-i)*upper_quan ) ]) );
                $( canvas_id ).data( "cut_min_pos", valueToPercent( canvas_id, sorted_array[ Math.floor( i + (l-i)*lower_quan ) ]) );
            }
        }
    }
}

function getRange( canvas_id )
{
    max_val = $( canvas_id ).data("abs_max");
    min_val = $( canvas_id ).data("abs_min");
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
    min_val = $( canvas_id ).data("abs_min");
    percentage = percent / 100.0;
    range   = getRange( canvas_id );

    return range * percentage + min_val;
}

function valueToPercent( canvas_id, value )
{
    min_val = $( canvas_id ).data("abs_min");
    range   = getRange( canvas_id );

    percentage = (value - min_val) / range;
    return percentage * 100.0;
}

function resetSpinners( canvas_id )
{
    if ( $( canvas_id ).data("positive") )
    {
        $( '#spinnerPosMin' ).spinner( "value", $( canvas_id ).data("posMin") );
        $( '#spinnerPosMax' ).spinner( "value", $( canvas_id ).data("posMax") );
    }
    if ( $( canvas_id ).data("negative") )
    {
        $( '#spinnerNegMin' ).spinner( "value", $( canvas_id ).data("negMin") );
        $( '#spinnerNegMax' ).spinner( "value", $( canvas_id ).data("negMax") );  
    }
}

$( '.refreshButton' ).click(function() {
    var canvas_id = '#heatMapCanvas';

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

    $( '#sliderRangePosAppendDiv' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 1.0)' );
    $( '#sliderRangePos .ui-slider-range' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 0.5)' );
    $( '#sliderRangeNeg' ).css( 'background', 'rgba(' + hexToRgb(color2_hex).r + ',' + hexToRgb(color2_hex).g + ',' + hexToRgb(color2_hex).b + ', 1.0)' );

    if ( $( canvas_id ).data("positive") && ( isNaN(parseFloat( $( '#spinnerPosMin' ).spinner( "value") ) ) || isNaN(parseFloat( $( '#spinnerPosMax' ).spinner( "value") ) ) ) )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( canvas_id ).data("negative") && ( isNaN(parseFloat( $( '#spinnerNegMin' ).spinner( "value") ) ) || isNaN(parseFloat( $( '#spinnerNegMax' ).spinner( "value") ) ) ) )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( canvas_id ).data("positive") && $( '#spinnerPosMin' ).spinner( "value") > $( '#spinnerPosMax' ).spinner( "value") )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( canvas_id ).data("negative") && $( '#spinnerNegMin' ).spinner( "value") > $( '#spinnerNegMax' ).spinner( "value") )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( canvas_id ).data("positive") && $( canvas_id ).data("negative") && $( '#spinnerNegMax' ).spinner( "value") > $( '#spinnerPosMin' ).spinner( "value") )
    {
        resetSpinners( canvas_id );
        alert("The inputted intensity cutoffs are invalid\n");
        return;
    }

    if ( $( canvas_id ).data("positive") )
    {
        $( '#sliderRangePos' ).slider( "values", 0, getRoundDown( valueToPercent( canvas_id, $( '#spinnerPosMin' ).spinner( "value") ), 0.01 ) );
        $( '#sliderRangePos' ).slider( "values", 1, getRoundUp( valueToPercent( canvas_id, $( '#spinnerPosMax' ).spinner( "value") ), 0.01 ) );
        $( canvas_id ).data("posMin", $( '#spinnerPosMin' ).spinner( "value") );
        $( canvas_id ).data("posMax", $( '#spinnerPosMax' ).spinner( "value") );
    }
    if ( $( canvas_id ).data("negative") )
    {
        $( '#sliderRangeNeg' ).slider( "values", 0, getRoundDown( valueToPercent( canvas_id, $( '#spinnerNegMin' ).spinner( "value") ), 0.01 ) );
        $( '#sliderRangeNeg' ).slider( "values", 1, getRoundUp( valueToPercent( canvas_id, $( '#spinnerNegMax' ).spinner( "value") ), 0.01 ) );
        $( canvas_id ).data("negMin", $( '#spinnerNegMin' ).spinner( "value") );
        $( canvas_id ).data("negMax", $( '#spinnerNegMax' ).spinner( "value") );
    }

    $( '#loading' ).show();
    drawHeatMap( canvas_id, 0, canvas_width, 0, canvas_height);
    $( '#loading' ).hide();
    drawTAD( canvas_id );
});

//adapted from https://jqueryui.com/slider/#range
//             https://stackoverflow.com/questions/19142251/jquery-slider-with-range-and-three-different-background-color
function drawSlider( canvas_id )
{
    getCutOffs( canvas_id );

    if ( $( canvas_id ).data("num_rows") <= 1 )
    {
        return;
    }

    var increSize = getIncrementSize( canvas_id );
    var round_max = getRoundUp(   $( canvas_id ).data("abs_max"), increSize );
    var round_min = getRoundDown( $( canvas_id ).data("abs_min"), increSize );

    $( '#spinnerButton' ).show();

    if ( $( canvas_id ).data("positive") )
    {
        $( '.pos_color' ).show();
        $( '#colorButton' ).show();

        $( '#spinnerPosDiv' ).show();

        $( '#spinnerPosMin' ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value >= $( '#spinnerPosMax' ).spinner( "value") )
                {
                    return false;
                }
                if ( $( canvas_id ).data("negative") && ui.value <= $( '#spinnerNegMax' ).spinner( "value") )
                {
                    return false;
                }
            },
        });
        $( '#spinnerPosMax' ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value <= $( '#spinnerPosMin' ).spinner( "value") )
                {
                    return false;
                }
            },
        });

        $( '#sliderRangePos' ).slider({
            range: true,
            min: 0,
            max: 100.0,
            step: 0.01,
            values: [ $( canvas_id ).data("cut_min_pos"), $( canvas_id ).data("cut_max_pos") ],

            slide: function (event, ui) {
                if ( $( canvas_id ).data("negative") && ui.values[0] <= $( '#sliderRangeNeg' ).slider( "values", 1 ) )
                {
                    return false;
                }
                $('#sliderRangePosAppendDiv').css('width', 100 - ui.values[1] +'%');
                $( '#spinnerPosMin' ).spinner( "value", percentToValue( canvas_id, ui.values[0] ) );
                $( '#spinnerPosMax' ).spinner( "value", percentToValue( canvas_id, ui.values[1] ) );
            },

            change: function (event, ui) {
                if ( $( canvas_id ).data("negative") && ui.values[0] <= $( '#sliderRangeNeg' ).slider( "values", 1 ) )
                {
                    return false;
                }
                $('#sliderRangePosAppendDiv').css('width', 100 - ui.values[1] +'%');
                $( canvas_id ).data("posMin", $( '#spinnerPosMin' ).spinner( "value") );
                $( canvas_id ).data("posMax", $( '#spinnerPosMax' ).spinner( "value") );
                $( '#loading' ).show();
                drawHeatMap( canvas_id, 0, canvas_width, 0, canvas_height);
                $( '#loading' ).hide();
                drawTAD( canvas_id );
            }

        }).append('<div id="sliderRangePosAppendDiv" style="width: '+ (100 - $( '#sliderRangePos' ).slider( "values", 1 )) +'%"></div>');

        $( '#spinnerPosMin' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangePos' ).slider( "values", 0 ) ));
        $( '#spinnerPosMax' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangePos' ).slider( "values", 1 ) ));

        $( canvas_id ).data("posMin", $( '#spinnerPosMin' ).spinner( "value") );
        $( canvas_id ).data("posMax", $( '#spinnerPosMax' ).spinner( "value") );

    }



    if ( $( canvas_id ).data("negative") )
    {
        $( '.neg_color' ).show();
        $( '#colorButton' ).show();

        $( '#spinnerNegDiv' ).show();

        $( '#spinnerNegMin' ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value >= $( '#spinnerNegMax' ).spinner( "value") )
                {
                    return false;
                }
            },
        });
        $( '#spinnerNegMax' ).spinner({
            min: round_min,
            max: round_max,
            step: increSize,
            spin: function( event, ui ) {
                if ( ui.value <= $( '#spinnerNegMin' ).spinner( "value") )
                {
                    return false;
                }
                if ( $( canvas_id ).data("positive") && ui.value >= $( '#spinnerPosMin' ).spinner( "value") )
                {
                    return false;
                }          
            },
        });

        $( '#sliderRangeNeg' ).slider({
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
                $( '#spinnerNegMin' ).spinner( "value", percentToValue( canvas_id, ui.values[0] ) );
                $( '#spinnerNegMax' ).spinner( "value", percentToValue( canvas_id, ui.values[1] ) );
            },

            change: function (event, ui) {
                if ( $( canvas_id ).data("positive") && ui.values[1] >= $( '#sliderRangePos' ).slider( "values", 0 ) )
                {
                    return false;
                }
                $('#sliderRangeNegAppendDiv').css('width', 100 - ui.values[1] +'%');
                $( canvas_id ).data("negMin", $( '#spinnerNegMin' ).spinner( "value") );
                $( canvas_id ).data("negMax", $( '#spinnerNegMax' ).spinner( "value") );
                $( '#loading' ).show();
                drawHeatMap( canvas_id, 0, canvas_width, 0, canvas_height);
                $( '#loading' ).hide();
                drawTAD( canvas_id );
            }

        }).append('<div id="sliderRangeNegAppendDiv" style="width: '+ (100 - $( '#sliderRangeNeg' ).slider( "values", 1 )) +'%"></div>');

        $( '#spinnerNegMin' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangeNeg' ).slider( "values", 0 ) ));
        $( '#spinnerNegMax' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangeNeg' ).slider( "values", 1 ) ));

        $( canvas_id ).data("negMin", $( '#spinnerNegMin' ).spinner( "value") );
        $( canvas_id ).data("negMax", $( '#spinnerNegMax' ).spinner( "value") );

    }
}

var canvas_start_x = 0;
var canvas_endin_x = canvas_width;
var canvas_start_y = 0;
var canvas_endin_y = canvas_height+20;
var canvas_image_y = canvas_endin_y-20;

function drawNavigator( canvas_id, x, y )
{
    var canvas = $( canvas_id )[0];
    if (! canvas )
    {
        return;
    }
    var ctx = canvas.getContext("2d");
    if (! ctx)
    {
        return;
    }
    var extend  = $( '#embedCanvas' )[0];
    var extend2 = $( '#embedCanvas2' )[0];

    var num_rows = $( '#heatMapCanvas' ).data("num_rows");
    if (!num_rows)
    {
        return;
    }
    
    ctx.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);

    if (extend)
    {
        var etx = extend.getContext("2d");
        etx.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);
    }

    if (extend2)
    {
        var etx2 = extend2.getContext("2d");
        etx2.clearRect(canvas_start_x,0,canvas_endin_x-canvas_start_x, extend2.height);
    }

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
    if (start_x >= 0 && endin_x <= canvas_endin_x && y <= canvas_image_y)
    {
        offst_x = (endin_x - start_x)/2;

        ctx.beginPath();
        ctx.moveTo(start_x, canvas_endin_y);
        ctx.lineTo(start_x, canvas_image_y);
        ctx.lineTo(start_x + offst_x, canvas_image_y - start_y);
        ctx.lineTo(endin_x, canvas_image_y);
        ctx.lineTo(endin_x, canvas_endin_y);

        if (endin_x - size_x > start_x + size_x)
        {
            ctx.moveTo(start_x + size_x, canvas_endin_y);
            ctx.lineTo(start_x + size_x, canvas_image_y);
            ctx.lineTo(start_x + offst_x, canvas_image_y - start_y + size_x);
            ctx.lineTo(endin_x - size_x , canvas_image_y);
            ctx.lineTo(endin_x - size_x , canvas_endin_y);
        }
        ctx.fill();
//        ctx.stroke();

        if (extend)
        {
            var etx = extend.getContext("2d");
            etx.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);
            etx.fillStyle = "rgba(50, 50, 50, 0.2)";
            etx.fillRect(start_x, 0, size_x, canvas_endin_y);
            etx.fillRect(endin_x - size_x , 0, size_x, canvas_endin_y);
        }
        if (extend2)
        {
            var etx2 = extend2.getContext("2d");
            etx2.fillStyle = "rgba(50, 50, 50, 0.2)";
            etx2.fillRect(start_x, 0, size_x, extend2.height);
            etx2.fillRect(endin_x - size_x , 0, size_x, extend2.height);
        }
    }
}

function drawTAD( canvas_id )
{
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

    tad_arr = $( '#' + canvas_id ).data("tad");
    for (i = 0; i < tad_arr.length; i++)
    {
        draw_rect( ctx, tad_arr[i][0], tad_arr[i][1], i);
    }

    if ( tad_arr.length > 0 )
    {
        ctx.fillStyle = "black";
        ctx.fillText( "TADs", 0, 10 );
    }
}

function draw_rect( ctx, tad_start, tad_end, index )
{
    ctx.fillStyle = "rgba(235, 189, 91, 0.6)";
    if (index % 2 == 1)
        ctx.fillStyle = "rgba(45, 84, 139, 0.6)";

    ctx.fillRect( get_g_to_x_coord(tad_start), 10, get_g_to_x_coord(tad_end)-get_g_to_x_coord(tad_start), 10);
}

$("#navigator").click(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    drawNavigator( '#'+this.id, x, y );
});

function get_x_to_g_coord( x )
{
    return parseInt($("#start").val()) + parseInt( Math.abs( $("#end").val() - $("#start").val() ) *  x / canvas_width );
}

function get_g_to_x_coord( g )
{
    return ( canvas_width - 0 ) * ( ( g - $("#start").val() )/($("#end").val() - $("#start").val()) );
}

$("#navigator").dblclick(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    var num_rows = $( '#heatMapCanvas' ).data("num_rows");
    if (!num_rows)
    {
        return;
    }

    var size_x = (canvas_endin_x-canvas_start_x)/num_rows;

    var cur_x = x;
    var cur_y = canvas_image_y - y;

    var start_x = cur_x - cur_y;
    var endin_x = cur_x + cur_y;
    //var start_x = Math.floor(start_x/size_x) * size_x;
    //var endin_x = Math.floor(endin_x/size_x) * size_x;

    if (start_x >= 0 && endin_x <= canvas_endin_x && y <= canvas_image_y)
    {
        $( "#start" ).empty();
        $( "#end"   ).empty();
        $( '#start' ).val( get_x_to_g_coord(start_x) );
        var endVal = get_x_to_g_coord(endin_x);
        $( '#end'   ).val( endVal );
        document.getElementsByName('end')[0].value = endVal;
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
            ctx.fillRect( Math.min(init_x_coord, x), 0, Math.abs(init_x_coord-x), canvas_height );
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

$("#navigator").mouseover(function(e) {
    $("#navigator").css( 'cursor', 'pointer' );
});


$("#navigator").mousedown(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    mouseDownFlag = true;
    mouseDownX = x;
});

$("#navigator").mousemove(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    if (mouseDownFlag && Math.abs(x - mouseDownX) > 5)
    {
        clearCanvas( '#heatMapCanvas', 0, canvas_width, 0, canvas_height+20);
        drawHeatMap( '#heatMapCanvas', 0 + x - mouseDownX, canvas_width + x - mouseDownX, 0, canvas_height);
    }

});

$("#navigator").mouseleave(function(e) {
    if ( mouseDownFlag )
    {
        mouseDownFlag = false;
        clearCanvas( '#heatMapCanvas', 0, canvas_width, 0, canvas_height+20);
        drawHeatMap( '#heatMapCanvas', 0, canvas_width, 0, canvas_height);
    }
});

$("#navigator").mouseup(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    if (mouseDownFlag)
    {
        if (Math.abs(x - mouseDownX) > 5)
        {
            g1 = get_x_to_g_coord( mouseDownX );
            g2 = get_x_to_g_coord( x );
            d  = g1 - g2;
            console.log(d);
            $( '#start' ).val( parseInt($( '#start' ).val()) + d );
            $( '#end' ).val( parseInt($( '#end' ).val()) + d );
            $("#mainForm").submit();           
        }
        mouseDownFlag = false;
    }

});


