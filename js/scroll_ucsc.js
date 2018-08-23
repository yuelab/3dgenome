function scrollBrowser()
{
    var ver = 0;
    var hor = 0;

    if ( !(window.name && JSON.parse(window.name).hor && JSON.parse(window.name).ver) )
    {
        if (navigator.platform.indexOf("Mac") >= 0)
        {
            ver = 180;
            hor = 161;
        }
        else if (navigator.platform.indexOf("iPhone") >= 0 || navigator.platform.indexOf("iPad") >= 0 || navigator.platform.indexOf("iPod") >= 0)
        {
            ver = 210;
            hor = 161;
        }
        else if (navigator.platform.indexOf("Linux") >= 0)
        {
            ver = 182;
            hor = 153;
        }
        else
        {
            ver = 177;
            hor = 161;
        }
    }
    else
    {
        ver = JSON.parse(window.name).ver;
        hor = JSON.parse(window.name).hor;
    }
    $("#embedFrame").scrollTop(ver);
    $("#embedFrame").scrollLeft(hor);

    $("#hor").val( parseInt($("#embedFrame").scrollLeft()) );
    $("#ver").val( parseInt($("#embedFrame").scrollTop() ) );
}

$("#align_button").click(function() {
    scrollBrowser();
});

$("#change_button").click(function() {
    $("#embedFrame").scrollTop( $("#ver").val() );
    $("#embedFrame").scrollLeft( $("#hor").val() );
});

$("#set_button").click(function() {
    var s = {};
    if ( window.name )
    {
        s = JSON.parse(window.name);
    }
    s['hor'] = $("#hor").val();
    s['ver'] = $("#ver").val();

    window.name = JSON.stringify(s);
});

$("#embedFrame").scroll(function() {
    $("#hor").val($("#embedFrame").scrollLeft());
    $("#ver").val($("#embedFrame").scrollTop());
});

$('#embedContainer').mouseenter(function() {
    $('#embedCanvas').hide();
});

$('#embedContainer').mouseleave(function() {
    $('#embedCanvas').show();
});

$('#embedFrame').scroll(function() {
    if ( parseInt($("#embedFrame").scrollTop() ) < 125 )
        $("#embedFrame").scrollTop( 125 );   
});

