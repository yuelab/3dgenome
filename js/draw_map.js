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
    var canvas = $( '#' + canvas_id )[0];
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
        my_gradient.addColorStop(0,"red");
        my_gradient.addColorStop(0.55,"white");
        my_gradient.addColorStop(1,"blue");

        ctx.fillStyle="black";
        ctx.fillText(String.fromCharCode("8805") + " " + $( canvas_id ).data("posMax"), x_start+x_size+15, y_start       -5 );
        ctx.fillText(String.fromCharCode("8804") + " " + $( canvas_id ).data("negMin"), x_start+x_size+15, y_start+y_size-10);
        ctx.fillText( $( canvas_id ).data("negMax") + " - " + $( canvas_id ).data("posMin"), x_start+x_size+15, y_start+(y_size-20)/2 );
    }
    else
    {
        if ( $( canvas_id ).data("positive") )
        {
            my_gradient.addColorStop(0,"red");
            my_gradient.addColorStop(1,"white");

            ctx.fillStyle="black";
            ctx.fillText(String.fromCharCode("8805") + " " + $( canvas_id ).data("posMax"), x_start+x_size+15, y_start       -5 );
            ctx.fillText(String.fromCharCode("8804") + " " + $( canvas_id ).data("posMin"), x_start+x_size+15, y_start+y_size-10);
        }
        else if ( $( canvas_id ).data("negative") )
        {
            my_gradient.addColorStop(0,"white");
            my_gradient.addColorStop(1,"blue");

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

function drawXTicks( ctx, cur_x, cur_y )
{
    ctx.beginPath();
    ctx.moveTo( cur_x, cur_y   );
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
    if (s < 0 || e > canvas_x )
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
    while (cur_x_tick < loc_end )
    {
        var cur_x = ( cur_x_tick - loc_start ) / x_range * ( canvas_x - canvas_x_start ) + canvas_x_start;
        drawXTicks( ctx, cur_x, canvas_y_start );
        drawXLabel( ctx, cur_x, canvas_y_start, cur_x_tick, canvas_x);
        cur_x_tick += x_tick_size;
    }
}

function getRBGAStr(r, g, b, a)
{
    var s = 'rgba('+ r +',' + g + ',' + b + ',' + a + ')';
    return s;
}

function getRBGStr(r, g, b)
{
    return getRBGAStr(r, g, b, 1.0);
}

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

    //Draw the location ticks
    drawLocationBar( canvas_id, canvas_x_start, canvas_x, canvas_y, canvas_y+20, $('#start').val(), $('#end').val() );
    //Draw gradient bar
    drawGradientBar(canvas_id, 10, 10, 20, canvas_y/2-10);

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
            var shade = 255;
            var rbg_str = getRBGStr(255, 255, 255, 1.0);

            if ( $( canvas_id ).data("positive") )
            {
                if ( $( canvas_id ).data("num_rows") == 1 )
                {
                    if ( val >= cut_off )
                    {
                        shade = 0;
                        rbg_str = getRBGStr(255, shade, shade);
                    }
                }
                else
                {
                    if ( val >= $( canvas_id ).data("posMax") )
                    {
                        shade = 0;
                        rbg_str = getRBGStr(255, shade, shade);
                    }
                    else if (val <= $( canvas_id ).data("posMin") )
                    {
                    }
                    else
                    {
                        shade = 255 - Math.floor( 255 * ( val - $( canvas_id ).data("posMin") )/( $( canvas_id ).data("posMax") - $( canvas_id ).data("posMin") ) );
                        rbg_str = getRBGStr(255, shade, shade);
                    }
                }
            }

            if ( $( canvas_id ).data("negative") )
            {
                if ( $( canvas_id ).data("num_rows") == 1 )
                {
                    if ( val < cut_off )
                    {
                        shade = 0;
                        rbg_str = getRBGStr(shade, shade, 255);
                    }
                }
                else
                {
                    if ( val >= $( canvas_id ).data("negMax") )
                    {
                    }
                    else if ( val <= $( canvas_id ).data("negMin") )
                    {
                        shade = 0;
                        rbg_str = getRBGStr(shade, shade, 255);
                    }
                    else
                    {
                        shade = 255 - Math.floor( 255 * ( val - $( canvas_id ).data("negMin") )/( $( canvas_id ).data("negMax") - $( canvas_id ).data("negMin") ) );
                        rbg_str = getRBGStr(shade, shade, 255);
                    }
                }
            }

            if (shade != 255)
            {
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
            }
            cur_x += size_x/2;
            cur_y -= size_y;
            n += 1;
        }//closes for (j = 0; j < i; j++)
        x_start += size_x;
    } //closes for (i = num_rows; i > 0; i--)

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
        //array does not contain negative values
        if ( sorted_array[0] >= cut_off )
        {
            $( canvas_id ).data("negative", 0);
            $( canvas_id ).data( "cut_max_pos", valueToPercent( canvas_id, sorted_array[ Math.floor( l*upper_quan ) ] ) );
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

$( '#spinnerButton' ).click(function() {
    var canvas_id = '#heatMapCanvas';
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
    drawHeatMap( canvas_id, 0, 686, 0, 343);
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
                $( canvas_id ).data("posMax", $( '#spinnerPosMax' ).spinner( "value") )
                drawHeatMap( canvas_id, 0, 686, 0, 343);
            }

        }).append('<div id="sliderRangePosAppendDiv" style="width: '+ (100 - $( '#sliderRangePos' ).slider( "values", 1 )) +'%"></div>');

        $( '#spinnerPosMin' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangePos' ).slider( "values", 0 ) ));
        $( '#spinnerPosMax' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangePos' ).slider( "values", 1 ) ));

        $( canvas_id ).data("posMin", $( '#spinnerPosMin' ).spinner( "value") );
        $( canvas_id ).data("posMax", $( '#spinnerPosMax' ).spinner( "value") );
    }
    if ( $( canvas_id ).data("negative") )
    {
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
                drawHeatMap( canvas_id, 0, 686, 0, 343);
            }

        }).append('<div id="sliderRangeNegAppendDiv" style="width: '+ (100 - $( '#sliderRangeNeg' ).slider( "values", 1 )) +'%"></div>');

        $( '#spinnerNegMin' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangeNeg' ).slider( "values", 0 ) ));
        $( '#spinnerNegMax' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangeNeg' ).slider( "values", 1 ) ));

        $( canvas_id ).data("negMin", $( '#spinnerNegMin' ).spinner( "value") );
        $( canvas_id ).data("negMax", $( '#spinnerNegMax' ).spinner( "value") );
    }
}

var canvas_start_x = 0;
var canvas_endin_x = 686;
var canvas_start_y = 0;
var canvas_endin_y = 363;
var canvas_image_y = canvas_endin_y - 20;

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
    var extend = $( '#embedCanvas' )[0];

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

    ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
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
            ctx.lineTo(endin_x - size_x, canvas_image_y);
            ctx.lineTo(endin_x - size_x, canvas_endin_y);
        }
        ctx.fill();
        ctx.stroke();

        if (extend)
        {
            var etx = extend.getContext("2d");
            etx.clearRect(canvas_start_x,canvas_start_y,canvas_endin_x-canvas_start_x,canvas_endin_y-canvas_start_y);
            etx.fillStyle = "rgba(50, 50, 50, 0.2)";
            etx.fillRect(start_x, 0, size_x, canvas_image_y);
            etx.fillRect(endin_x - size_x, 0, size_x, canvas_image_y);
        }
    }
}


$("#navigator").click(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    drawNavigator( '#'+this.id, x, y );
});

function get_x_to_g_coord( x )
{
    return parseInt($("#start").val()) + parseInt( Math.abs( $("#end").val() - $("#start").val() ) *  x / 686 );
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
        $( '#end'   ).val( get_x_to_g_coord(endin_x) );
        document.getElementsByName('end'  )[0].value = get_x_to_g_coord(endin_x);
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
            ctx.clearRect(0, 0, 686, 343);           
        }
    }
}

