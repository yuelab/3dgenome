function scrollBrowser(frame_id)
{
    var ver = 0;
    var hor = 0;

    if (window.name === "")
    {
        if (navigator.platform.indexOf("Mac") >= 0)
        {
            ver = 186;
            hor = 218;
        }
        else if (navigator.platform.indexOf("iPhone") >= 0 || navigator.platform.indexOf("iPad") >= 0 || navigator.platform.indexOf("iPod") >= 0)
        {
            ver = 210;
            hor = 218;
        }
        else if (navigator.platform.indexOf("Linux") >= 0)
        {
            ver = 182;
            hor = 210;
        }
        else
        {
            ver = 177;
            hor = 216;
        }
    }
    else
    {
        ver = JSON.parse(window.name).ver;
        hor = JSON.parse(window.name).hor;
    }
    $( "#" + frame_id ).scrollTop(ver);
    $( "#" + frame_id ).scrollLeft(hor);

    var hor_id   = frame_id.replace('embedFrame', 'hor');
    var ver_id   = frame_id.replace('embedFrame', 'ver');
    $("#" + hor_id ).val( $( "#" + frame_id ).scrollLeft() );
    $("#" + ver_id ).val( $( "#" + frame_id ).scrollTop() );

}


$(".align_button").click(function() {
    scrollBrowser( this.id.replace('align_button', 'embedFrame') );
});

$(".change_button").click(function() {
    var frame_id = this.id.replace('change_button', 'embedFrame');
    var hor_id   = this.id.replace('change_button', 'hor');
    var ver_id   = this.id.replace('change_button', 'ver');

    $("#" + frame_id).scrollTop( $("#"  + ver_id).val() );
    $("#" + frame_id).scrollLeft( $("#" + hor_id).val() );
});

$(".set_button").click(function() {
    var hor_id   = this.id.replace('set_button', 'hor');
    var ver_id   = this.id.replace('set_button', 'ver');
    var scroll_property = {
        hor: $("#" + hor_id).val(),
        ver: $("#" + ver_id).val()
    }

    window.name = JSON.stringify(scroll_property);
});

$(".embedFrame").scroll(function() {
    var frame_id = this.id;
    var hor_id   = frame_id.replace('embedFrame', 'hor');
    var ver_id   = frame_id.replace('embedFrame', 'ver');
    $("#" + hor_id ).val( $( "#" + frame_id ).scrollLeft() );
    $("#" + ver_id ).val( $( "#" + frame_id ).scrollTop() );

});

$(".embedFrame").scroll(function() {
    var frame_id = this.id;
    var hor_id   = frame_id.replace('embedFrame', 'hor');
    var ver_id   = frame_id.replace('embedFrame', 'ver');
    $("#" + hor_id ).val( $( "#" + frame_id ).scrollLeft() );
    $("#" + ver_id ).val( $( "#" + frame_id ).scrollTop() );

});

