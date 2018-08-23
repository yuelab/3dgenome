//Defines log10 (not defined in older versions of Safari)
Math.log10 = function (x) { return Math.log(x) / Math.LN10; };
var cut_off = 0;


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
    var canvas_id = '#heatMapCanvas_right';

    var s = {};
    if ( window.name )
    {
        s = JSON.parse(window.name);
    }
   
    //getColor(); 
    color1_hex = '#ff0000';
    color2_hex = '#0000ff';

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
    drawMaps();
});


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


var getAllZerosFlag = false;

function getCutOffs ( canvas_id )
{
    var upper_quan = 0.95;
    var lower_quan = 0.05;
    if ($( canvas_id ).data("matrix"))
    {
        //sort matrix (now as an array) by value
        var sorted_array = $( canvas_id ).data("matrix").slice().sort( function (a, b)
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

function fillEmpty( canvas_id )
{
    $(canvas_id).data("abs_max", 1);
    $(canvas_id).data("abs_min", 0);
    $(canvas_id).data("cut_max_pos", 0.95);
    $(canvas_id).data("cut_min_pos", 0.05);
}

//adapted from https://jqueryui.com/slider/#range
//             https://stackoverflow.com/questions/19142251/jquery-slider-with-range-and-three-different-background-color
//Watchout, every object name in this function begins with '#'
function drawSlider( canvas_id, canvas_id1, canvas_id2, canvas_id3 )
{

    console.log( $(canvas_id1).data() );
    console.log( $(canvas_id2).data() );
    console.log( $(canvas_id3).data() );
    getCutOffs( canvas_id1 );
    getCutOffs( canvas_id2 );
    getCutOffs( canvas_id3 );

    $(canvas_id).data("abs_max", Math.max($(canvas_id1).data("abs_max") || 1, $(canvas_id2).data("abs_max") || 1, $(canvas_id3).data("abs_max") || 1 ) );
    $(canvas_id).data("abs_min", Math.min($(canvas_id1).data("abs_min") || 0, $(canvas_id2).data("abs_min") || 0, $(canvas_id3).data("abs_min") || 0 ) );   
    $(canvas_id).data("cut_max_pos", Math.max($(canvas_id1).data("cut_max_pos") || 1, $(canvas_id2).data("cut_max_pos") || 1, $(canvas_id3).data("cut_max_pos") || 1 ) );
    $(canvas_id).data("cut_min_pos", Math.min($(canvas_id1).data("cut_min_pos") || 0, $(canvas_id2).data("cut_min_pos") || 0, $(canvas_id3).data("cut_min_pos") || 0) );
    $(canvas_id).data("positive", $(canvas_id2).data("positive") || 1);
    $(canvas_id).data("negative", $(canvas_id2).data("negative") || 0);
    $(canvas_id).data("num_rows", $(canvas_id2).data("num_rows") || $(canvas_id3).data("num_rows"));

    console.log( $(canvas_id).data() );

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
                drawMaps();
            }

        }).append('<div id="sliderRangePosAppendDiv" style="width: '+ (100 - $( '#sliderRangePos' ).slider( "values", 1 )) +'%;;height: 10px; float: right;"></div>');

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
                drawMaps();
            }

        }).append('<div id="sliderRangeNegAppendDiv" style="width: '+ (100 - $( '#sliderRangeNeg' ).slider( "values", 1 )) +'%;height: 10px; float: right;"></div>');

        $( '#spinnerNegMin' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangeNeg' ).slider( "values", 0 ) ));
        $( '#spinnerNegMax' ).spinner( "value", percentToValue( canvas_id, $( '#sliderRangeNeg' ).slider( "values", 1 ) ));

        $( canvas_id ).data("negMin", $( '#spinnerNegMin' ).spinner( "value") );
        $( canvas_id ).data("negMax", $( '#spinnerNegMax' ).spinner( "value") );

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

function getRBGAStr(r, g, b, a)
{
    var s = 'rgba('+ r +',' + g + ',' + b + ',' + a + ')';
    return s;
}

function getRBGStr(r, g, b)
{
    return getRBGAStr(r, g, b, 1.0);
}

var color1_hex = '#ff0000';
var color2_hex = '#0000ff';

function getColor()
{
    /* 
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
    */
}

function drawGradientBar( canvas_id, x_start, x_size, y_start, y_size )
{
    drawMiniMap( 'miniMapCanvas' );
    var canvas = $( canvas_id )[0];
    var ctx = canvas.getContext("2d");
    if ( $( canvas_id ).data("num_rows") <= 1)
    {
        return;
    }

    ctx.lineWidth = 1;

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

function drawInterchromSquare(ctx, cur_x, cur_y, size_x, size_y, rbg_str)
{
    ctx.beginPath(); //Need to start a new path each time so that color will be different.
    ctx.moveTo(cur_x, cur_y);
    ctx.lineTo(cur_x + size_x/2, cur_y - size_y/2);
    ctx.lineTo(cur_x + size_x, cur_y);
    ctx.lineTo(cur_x + size_x/2, cur_y + size_y/2);
    ctx.lineTo(cur_x, cur_y);
    ctx.fillStyle = rbg_str
    ctx.fill();
}

function drawInterchromHeatmap( canvas_id, canvas_id_data, canvas_x_start, canvas_width, canvas_y_start, canvas_height ) {
    //getColor();
    color1_hex = '#ff0000';
    color2_hex = '#0000ff';
    $( '#sliderRangePosAppendDiv' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 1.0)' );
    $( '#sliderRangePos .ui-slider-range' ).css( 'background', 'rgba(' + hexToRgb(color1_hex).r + ',' + hexToRgb(color1_hex).g + ',' + hexToRgb(color1_hex).b + ', 0.5)' );
    $( '#sliderRangeNeg' ).css( 'background', 'rgba(' + hexToRgb(color2_hex).r + ',' + hexToRgb(color2_hex).g + ',' + hexToRgb(color2_hex).b + ', 1.0)' );

    clearCanvas( canvas_id );
    if (getAllZerosFlag) return;

    //Draw gradient bar
    drawGradientBar('#' +canvas_id_data, 200, 10, 20, canvasHeight/4);

    var canvas = $( "#" + canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");

        var n_i = Math.ceil((end1 - start1)/res);
        var n_j = Math.ceil((end2 - start2)/res);

        var n_t = Math.max(n_i, n_j);

        var start_x = canvas_x_start + canvasLength/2 - canvasHeight/2;
        var start_y = canvas_y_start + canvasHeight/2;

        var length_x = canvasHeight;
        var length_y = canvasHeight;

        var size_x = length_x/n_t;
        var size_y = length_y/n_t;

        var cur_x  = start_x;
        var cur_y  = start_y;

        var n = 0;

    
        for (var i = 0; i < n_i; i++)
        {
            if ( $('#' + canvas_id ).data("row_chr") == chr1 )
            {
                cur_x  = start_x + i * size_x/2;
                cur_y  = start_y + i * size_y/2;
            }
            else
            {
                cur_x  = start_x + i * size_x/2;
                cur_y  = start_y - i * size_y/2;
            }

            for (var j = 0; j < n_j; j++)
            {
                var val = parseFloat($( '#' + canvas_id ).data("matrix")[n]);
                if (!isNumber(val))
                {
                    val = 0;
                }   

                if (val < $( '#'+canvas_id_data ).data("posMin") )
                {
                    //drawInterchromSquare(ctx, cur_x, cur_y, size_x, size_y, "rgba(255, 255, 255, 1.0)")
                }
                else if (val >= $( '#'+canvas_id_data ).data("posMax") )
                {
                    drawInterchromSquare(ctx, cur_x, cur_y, size_x, size_y, "rgba(255, 0, 0, 1.0)");
                }
                else
                {
                    var a = (1.0 * ( val - $( '#'+canvas_id_data ).data("posMin") ))/( $( '#'+canvas_id_data ).data("posMax") - $( '#'+canvas_id_data ).data("posMin") );
                    drawInterchromSquare(ctx, cur_x, cur_y, size_x, size_y, "rgba(255, 0, 0, "+a+")");
                }

                //ctx.fillStyle = "black";
                //ctx.fillText( val, cur_x, cur_y);

                if ( $('#' + canvas_id ).data("row_chr") == chr1 )
                {
                    cur_x += size_x/2;
                    cur_y -= size_y/2;
                }
                else
                {
                    cur_x += size_x/2;
                    cur_y += size_y/2;
                }
                n++;
            }
        }
    }

    //drawDirection('miniMapCanvas');
}

function drawDirection(canvas_id)
{
    var canvas = $( "#" + canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");
        arrow_image = new Image();
        arrow_image.onload = function() {
            console.log('here');
            ctx.drawImage(arrow_image, 420, 80, 80, 80);
        }
        arrow_image.src = 'img/arrow_up.png';
    }   
}

function drawMaps()
{
    drawHeatMap('heatMapCanvas_right', 'miniMapCanvas', 700, 1400, 350, 700);
    drawHeatMap('heatMapCanvas_left' , 'miniMapCanvas', 0, 700, 350, 700);
    drawInterchromHeatmap( "heatMapCanvas", 'miniMapCanvas', 0, 1400, 0, 700 );
    drawDiamond('navigator');
}

/*
Copyright (c) 1970-2003, Wm. Randolph Franklin
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimers.
Redistributions in binary form must reproduce the above copyright notice in the documentation and/or other materials provided with the distribution.
The name of W. Randolph Franklin may not be used to endorse or promote products derived from this Software without specific prior written permission.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function pnpoly( nvert, vertx, verty, testx, testy ) {
    var i, j, c = false;
    for( i = 0, j = nvert-1; i < nvert; j = i++ ) {
        if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
            ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                c = !c;
        }
    }
    return c;
}

var minimap_dim = 250;

first = true;

function drawMiniMap( canvas_id )
{
    clearCanvas( canvas_id );

    var canvas = $( "#" + canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");
        var n_i = Math.ceil(chrom_end1/1000000);
        var n_j = Math.ceil(chrom_end2/1000000);

        var n_p = Math.min(n_i, n_j);
        var n_t = Math.max(n_i, n_j);

        var size_y = minimap_dim/n_j;
        var size_x = minimap_dim/n_i;

        for (var i = 0; i < n_p; i++)
        {
            if ( i % 2 == 0)
                ctx.fillStyle = "rgba(0,0,0,0.2)";
            else
                ctx.fillStyle = "rgba(255,255,255,0.2)"; 

            ctx.fillRect(canvas.width-minimap_dim + size_x*i, 0, size_x, minimap_dim * n_i/n_t); 
        }

        for (var j = 0; j < n_p; j++)
        {
            if ( j % 2 == 0)
                ctx.fillStyle = "rgba(0,0,0,0.2)";
            else
                ctx.fillStyle = "rgba(255,255,255,0.2)";

            ctx.fillRect(canvas.width-minimap_dim, size_y*j, minimap_dim * n_j/n_t, size_y);
        }

        ctx.fillStyle = "black";
        ctx.fillText(chr1, canvas.width-minimap_dim-ctx.measureText(chr1).width, 10);
        ctx.fillText(chr2, canvas.width-minimap_dim, minimap_dim*(n_i/n_t)+10);


        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.strokeRect( canvas.width-minimap_dim+start2/chrom_end2 * minimap_dim * (n_j/n_t), 0+start1/chrom_end1 * minimap_dim * (n_i/n_t), (end2-start2)/chrom_end2 * minimap_dim * (n_j/n_t), (end1-start1)/chrom_end1 * minimap_dim * (n_i/n_t) );
    }
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
    if (s < 0 || e > canvas_x )
    {
        return;
    }
    ctx.fillText(text, s, cur_y+10);
}
function drawLocationBar( canvas_id, canvas_x_start, canvas_x, canvas_y_start, canvas_y, loc_start, loc_end, chr )
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
    ctx.fillText( chr, canvas_x_start, canvas_y);
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

function drawHeatMap( canvas_id, canvas_id_data, canvas_x_start, canvas_x, canvas_y_start, canvas_y )
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

    num_rows = $( '#' + canvas_id ).data("num_rows");
    if (num_rows <= 0)
    {   
        return;
    }

    clearCanvas(canvas_id);

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
            var val = parseFloat($( '#' + canvas_id ).data("matrix")[n]);
            var rbg_str = getRBGStr(255, 255, 255, 1.0);
            
            if ( $( '#' + canvas_id_data ).data("positive") )
            {   
                if ( $( '#' + canvas_id ).data("num_rows") == 1 )
                {   
                    if ( val >= cut_off )
                    {
                        rbg_str = getRBGStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b );
                    }
                }
                else
                {
                    if ( val >= $( '#' + canvas_id_data ).data("posMax") )
                    {
                        rbg_str = getRBGStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b );
                    }
                    else if (val <= $( '#' + canvas_id_data ).data("posMin") )
                    {
                    }
                    else
                    {
                        rbg_str = getRBGAStr( hexToRgb(color1_hex).r, hexToRgb(color1_hex).g, hexToRgb(color1_hex).b, (1.0 * ( val - $( '#' + canvas_id_data ).data("posMin") ))/( $( '#' + canvas_id_data ).data("posMax") - $( canvas_id_data ).data("posMin") ) );
                    }
                }
            }

            if ( $( '#' + canvas_id_data ).data("negative") )
            {
                if ( $( '#' + canvas_id_data ).data("num_rows") == 1 )
                {
                    if ( val < cut_off )
                    {
                        rbg_str = getRBGStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b );

                    }
                }
                else
                {
                    if ( val >= $( '#' + canvas_id_data ).data("negMax") )
                    {
                    }
                    else if ( val <= $( '#' + canvas_id_data ).data("negMin") )
                    {
                        rbg_str = getRBGStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b );
                    }
                    else
                    {
                        rbg_str = getRBGAStr( hexToRgb(color2_hex).r, hexToRgb(color2_hex).g, hexToRgb(color2_hex).b, (1.0 * ( val - $( '#' + canvas_id_data ).data("negMin") ))/( $( '#' + canvas_id_data ).data("negMax") - $( '#' + canvas_id_data ).data("negMin") ) );
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
    var dir = canvas_id.substr(canvas_id.indexOf('_')+1);
    if (dir == "left")
        n = 1;
    else
        n = 2;

    drawLocationBar( 'location', canvas_x_start, canvas_x, canvas_y, canvas_y+20, parseInt($("#start"+n).val()), parseInt($("#end"+n).val()), $("#chr"+n).val() );
}



function drawNavigator( canvas_id, x, y )
{
    clearCanvas( canvas_id );
    clearCanvas( 'embedCanvas_1' );
    clearCanvas( 'embedCanvas_2' );

    if ( !pnpoly( 4, [canvasLength/2, canvasLength/2-canvasHeight/2, canvasLength/2, canvasLength/2+canvasHeight/2], [0, canvasHeight/2, canvasHeight, canvasHeight/2], x, y ) )
        return;

    var canvas = $( "#" + canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");
        var n_i = (end1 - start1)/res;
        var n_j = (end2 - start2)/res;

        var n_t = Math.max(n_i, n_j);

        var start_x = canvasLength/2 - canvasHeight/2;
        var start_y = canvasHeight/2;

        var length_x = canvasHeight;
        var length_y = canvasHeight;

        var size_x = length_x/n_t;
        var size_y = length_y/n_t;

        var cur_x  = start_x;
        var cur_y  = start_y;

        var top_x = cur_x + size_x/2;
        var top_y = cur_y - size_y/2;

        var n = 0;

        var sel_x = 0;
        var sel_y = 0;

        for (var i = 0; i < n_i; i++)
        {
            cur_x  = start_x + i * size_x/2;
            cur_y  = start_y + i * size_y/2;
            for (var j = 0; j < n_j; j++)
            {
                if ( pnpoly( 4, [cur_x, cur_x + size_x/2, cur_x + size_x, cur_x + size_x/2], [cur_y, cur_y - size_y/2, cur_y, cur_y + size_y/2], x, y ) )
                {
                    sel_x = cur_x;
                    sel_y = cur_y;
                    ctx.fillStyle = "rgba(150, 150, 150, 0.35)";
                    ctx.strokeStyle = "black";
                    ctx.beginPath();
                    ctx.moveTo(cur_x + size_x/2, cur_y - size_y/2);
                    ctx.lineTo(cur_x + size_x/2 + canvasHeight - (cur_y - size_y/2), canvasHeight);
                    ctx.lineTo(cur_x + size_x/2 + canvasHeight - (cur_y - size_y/2) - size_x, canvasHeight);
                    ctx.lineTo(cur_x + size_x/2, cur_y + size_y/2);
                    ctx.lineTo(cur_x + size_x/2 - canvasHeight + (cur_y - size_y/2) + size_x, canvasHeight);
                    ctx.lineTo(cur_x + size_x/2 - canvasHeight + (cur_y - size_y/2), canvasHeight);
                    ctx.lineTo(cur_x + size_x/2, cur_y - size_y/2);
                    ctx.fill();
                    break;
                }
                cur_x += size_x/2;
                cur_y -= size_y/2;
                n++;
            }
        }

    }
    var canvas_1 = $( "#embedCanvas_1" )[0];
    if ( canvas_1 )
    {
        var ctx_1 = canvas_1.getContext("2d");
        a = sel_x + size_x/2 - canvasHeight + (sel_y - size_y/2) + 10;
        ctx_1.fillStyle = "rgba(150, 150, 150, 0.35)";
        ctx_1.fillRect(a-10, 0, size_x, canvas_1.height);
    }


    var canvas_2 = $( "#embedCanvas_2" )[0];
    if ( canvas_2 )
    {
        var ctx_2 = canvas_2.getContext("2d");
        a = sel_x + size_x/2 + canvasHeight - (sel_y - size_y/2) - size_x - canvasLength/2;
        ctx_2.fillStyle = "rgba(150, 150, 150, 0.35)";
        ctx_2.fillRect(a, 0, size_x, canvas_2.height);
    }
}

$("#navigator").click(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
//    drawNavigator( this.id, x, y );
});

$("#navigator").dblclick(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    goToRegion('miniMapCanvas', x, y);    
});

function goToRegion(canvas_id, x, y)
{
    var n_i = chrom_end1/1000000;
    var n_j = chrom_end2/1000000;

    var n_t = Math.max(n_i, n_j);

    var start_x = 1400-minimap_dim;
    var start_y = 0;

    if ( x >= start_x && x <= start_x+minimap_dim * n_j/n_t && y >= 0 && y <= 0+minimap_dim * n_i/n_t )
        console.log('here');
    else
        return;

    range1 = $('#end1').val() - $('#start1').val(); 
    range2 = $('#end2').val() - $('#start2').val();

    midpoint2 = ((x-start_x)/(minimap_dim * n_j/n_t)) * chrom_end2;
    midpoint1 = ((y-start_y)/(minimap_dim * n_i/n_t)) * chrom_end1;

    $( '#start1' ).val( Math.round(midpoint1 - range1/2) );
    $( '#end1'   ).val( Math.round(midpoint1 + range1/2) );
    $( '#start2' ).val( Math.round(midpoint2 - range2/2) );
    $( '#end2'   ).val( Math.round(midpoint2 + range2/2) );
    $("#mainForm").submit();
}

function CarteToGenomicCoord(x, y)
{
    var n_i = (end1 - start1)/res;
    var n_j = (end2 - start2)/res;

    var n_t = Math.max(n_i, n_j);

    var start_x = canvasLength/2 - canvasHeight/2;
    var start_y = canvasHeight/2;

    var length_x = canvasHeight;
    var length_y = canvasHeight;

    var size_x = length_x/n_t;
    var size_y = length_y/n_t;

    var cur_x  = start_x;
    var cur_y  = start_y;

    var top_x = cur_x + size_x/2;
    var top_y = cur_y - size_y/2; 

    var g1 = start1;
    var g2 = start2;

    var sel_i = 0;
    var sel_j = 0;

    for (var i = 0; i < n_i; i++)
    {
        cur_x  = start_x + i * size_x/2;
        cur_y  = start_y + i * size_y/2;
        g1 = start1 + i * res;
        for (var j = 0; j < n_j; j++)
        {
            g2 = start2 + j * res;
            if ( pnpoly( 4, [cur_x, cur_x + size_x/2, cur_x + size_x, cur_x + size_x/2], [cur_y, cur_y - size_y/2, cur_y, cur_y + size_y/2], x, y ) )
            {
                sel_i = i;
                sel_j = j;
                break;
            }
            cur_x += size_x/2;
            cur_y -= size_y/2;
        }
    }
  
    g1 = start1 + sel_i * res;
    g2 = start2 + sel_j * res;

    return {g1: g1, g2: g2};
}

function drawRectIndicator(canvas_id, x1, y1, x2, y2)
{
    clearCanvas( canvas_id );
    var canvas = $( "#" + canvas_id )[0];
    if ( canvas )
    {
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = "black";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + Math.abs(x2-x1)/2, y1 - Math.abs(x2-x1)/2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1 + Math.abs(x2-x1)/2, y1 + Math.abs(x2-x1)/2);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

}

var mouseDownFlag = false;
var mouseDownX = 0;
var mouseDownY = 0;

$("#navigator").mousedown(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    mouseDownFlag = true;
    mouseDownX = x;
    mouseDownY = y;
});

$("#navigator").mousemove(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    if ( pnpoly( 4, [canvasLength/2, canvasLength/2-canvasHeight/2, canvasLength/2, canvasLength/2+canvasHeight/2], [0, canvasHeight/2, canvasHeight, canvasHeight/2], x, y ) )
    {
        $("#navigator").css("cursor", "pointer");
    }
    else
        $("#navigator").css("cursor", "auto");

    if (mouseDownFlag)
    {
        if ( Math.abs(x - mouseDownX) < 5 || Math.abs(y - mouseDownY) < 5 )
            drawInterchromHeatmap( "heatMapCanvas", 'miniMapCanvas', 0, 1400, 0, 700 );
        else
            drawInterchromHeatmap( "heatMapCanvas", 'miniMapCanvas', x-mouseDownX, 1400, y-mouseDownY, 700 );

        console.log('here');
        console.log( mouseDownFlag );
    }

});

$("#navigator").mouseup(function(e) {
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;

    $("#navigator").css("cursor", "auto");

    if ( Math.abs(x - mouseDownX) < 5 || Math.abs(y - mouseDownY) < 5 )
    {
        mouseDownFlag = false;
        drawNavigator( this.id, x, y );
        return;
    }

    if ( !pnpoly( 4, [canvasLength/2, canvasLength/2-canvasHeight/2, canvasLength/2, canvasLength/2+canvasHeight/2], [0, canvasHeight/2, canvasHeight, canvasHeight/2], x, y ) )
    {
        mouseDownFlag = false; 
        return;
    }

    if (mouseDownFlag)
    {
        var total = Math.sqrt(Math.pow(canvasHeight/2,2) + Math.pow(canvasHeight/2,2));
        var moved = Math.sqrt(Math.pow(x-mouseDownX,2) + Math.pow(y-mouseDownY,2));

        if (x - mouseDownX > 0 && y - mouseDownY > 0)
        {
            var g = moved/total * (parseInt($('#end1').val()) - parseInt($('#start1').val()));
            $('#end1').val( parseInt($('#end1').val()) - g);
            $('#start1').val( parseInt($('#start1').val()) - g);
        }
        if (x - mouseDownX < 0 && y - mouseDownY < 0)
        {
            var g = moved/total * (parseInt($('#end1').val()) - parseInt($('#start1').val()));
            $('#end1').val( parseInt($('#end1').val()) + g);
            $('#start1').val( parseInt($('#start1').val()) + g);
        }
        if (x - mouseDownX < 0 && y - mouseDownY > 0)
        {
            var g = moved/total * (parseInt($('#end2').val()) - parseInt($('#start2').val()));
            $('#end2').val( parseInt($('#end2').val()) + g);
            $('#start2').val( parseInt($('#start2').val()) + g);
        }
        if (x - mouseDownX > 0 && y - mouseDownY < 0)
        {
            var g = moved/total * (parseInt($('#end2').val()) - parseInt($('#start2').val()));
            $('#end2').val( parseInt($('#end2').val()) - g);
            $('#start2').val( parseInt($('#start2').val()) - g);
        }
        $("#mainForm").submit();
        mouseDownFlag = false;
    }
    
});
