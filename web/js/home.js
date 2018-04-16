/**
 * Created by StarkX on 16-Apr-18.
 */
window.FontAwesomeConfig = {
    searchPseudoElements : true
};

$(() => {
    let sizeTheOverlays = function () {
        $(".overlay").resize().each(function () {
            let h = $(this).parent().outerHeight();
            let w = $(this).parent().outerWidth();
            $(this).css("height", h);
            $(this).css("width", w);
        });
    };
    
    sizeTheOverlays();
    
    let width = $(window).width();
    $(window).resize(function () {
        if ($(this).width() !== width) {
            width = $(this).width();
            sizeTheOverlays();
        }
    });
});

$('#logout').click(() => {
    delete localStorage.authToken;
    location.href = '/auth/logout';
    return false;
});