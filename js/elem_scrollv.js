function scrollBrowser( frame_id )
{
    var verScroll = 0;
    var horScroll = 0;

    if ( !(window.name && JSON.parse(window.name).horScroll && JSON.parse(window.name).verScroll) )
    {
        if (navigator.platform.indexOf("Mac") >= 0)
        {
            verScroll = 186;
            horScroll = 183;
        }
        else if (navigator.platform.indexOf("iPhone") >= 0 || navigator.platform.indexOf("iPad") >= 0 || navigator.platform.indexOf("iPod") >= 0)
        {
            verScroll = 210;
            horScroll = 183;
        }
        else if (navigator.platform.indexOf("Linux") >= 0)
        {
            verScroll = 182;
            horScroll = 175;
        }
        else
        {
            verScroll = 177;
            horScroll = 183;
        }
    }
    else
    {
        verScroll = JSON.parse(window.name).verScroll;
        horScroll = JSON.parse(window.name).horScroll;
    }

    $( "#" + frame_id ).scrollTop (verScroll);
    $( "#" + frame_id ).scrollLeft(horScroll);

    $( "#horInput_" + frame_id.substr(frame_id.indexOf('_')+1) ).val( verScroll );
    $( "#verInput_" + frame_id.substr(frame_id.indexOf('_')+1) ).val( horScroll );

}

$(".alignButton").click(function() {
    scrollBrowser( "embedFrame_" + this.id.substr(this.id.indexOf('_')+1));
});

$(".changeButton").click(function() {
    $( "#embedFrame_" + this.id.substr(this.id.indexOf('_')+1) ).scrollTop(  $( "#horInput_" + this.id.substr(this.id.indexOf('_')+1) ).val() );
    $( "#embedFrame_" + this.id.substr(this.id.indexOf('_')+1) ).scrollLeft( $( "#verInput_" + this.id.substr(this.id.indexOf('_')+1) ).val() );
});

$(".setButton").click(function() {
    var s = {};
    if ( window.name )
    {
        s = JSON.parse(window.name);
    }
    s['horScroll'] = $( "#horInput_" + this.id.substr(this.id.indexOf('_')+1) ).val();
    s['verScroll'] = $( "#verInput_" + this.id.substr(this.id.indexOf('_')+1) ).val();

    window.name = JSON.stringify(s);
});

$('.embedContainer').mouseenter(function() {
    $('.embedCanvas').hide();
});

$('.embedContainer').mouseleave(function() {
    $('.embedCanvas').show();
});

