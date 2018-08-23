function scrollBrowser()
{
    var ver = 0;
    var hor = 0;

    if (window.name === "")
    {
        if (navigator.platform.indexOf("Mac") >= 0)
        {
            ver = 186;
            hor = 217;
        }
        else if (navigator.platform.indexOf("iPhone") >= 0 || navigator.platform.indexOf("iPad") >= 0 || navigator.platform.indexOf("iPod") >= 0)
        {
            ver = 210;
            hor = 217;
        }
        else if (navigator.platform.indexOf("Linux") >= 0)
        {
            ver = 182;
            hor = 209;
        }
        else
        {
            ver = 182;
            hor = 209;
        }
    }
    else
    {
        ver = JSON.parse(window.name).ver;
        hor = JSON.parse(window.name).hor;
    }
    $("#frame").scrollTop(ver);
    $("#frame").scrollLeft(hor);

    $("#hor").val( parseInt($("#frame").scrollLeft()) );
    $("#ver").val( parseInt($("#frame").scrollTop() ) );
}

//ucsc_size_text
function getContainerHeight()
{
    var hgt = 0;
    if (window.name === "")
    {
        hgt = $('#embedContainer').height();
    }
    else
    {
        hgt = JSON.parse(window.name).hgt;
    }
    $('#ucsc_size_text').val( hgt );
}

$('#ucsc_size_button').click(function() {
    $('#embedContainer').height( $('#ucsc_size_text').val()  );   
});

$("#align_button").click(function() {
    scrollBrowser();
});

$("#change_button").click(function() {
    $("#frame").scrollTop( $("#ver").val() );
    $("#frame").scrollLeft( $("#hor").val() );
});

$("#set_button").click(function() {

    var scroll_property = {
        hor: $("#hor").val(),
        ver: $("#ver").val()
    }

    window.name = JSON.stringify(scroll_property);
});

$("#frame").scroll(function() {
    $("#hor").val($("#frame").scrollLeft());
    $("#ver").val($("#frame").scrollTop());
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

