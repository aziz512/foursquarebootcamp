/*global $*/

function clearAll(){
    $('#inputFoodType').val('');
    $('#inputLocation').val('');
    $('.row').empty();
    $('#loader').hideY();
}
var data = null;

function submit(){
    $('#loader').show();
    if ($('#inputFoodType').val() && $('#inputLocation').val()) {
        var api = "https://api.foursquare.com/v2/venues/search?client_id=HHTLWYCDUICNHSQC0BN5LCI5ZVCN1KDDXT3203VLE2EQEXUZ&client_secret=052SMA0R4KRX5SJDGVQV1ZEQUATTU1TRJ11KCXLE2UOJZKKY&v=20160706";
        //adding location
        api += '&near=' + $('#inputLocation').val();
        //adding food type
        api += '&query=' + $('#inputFoodType').val();
        $('.row').empty();
        $.getJSON(api, {})
        .done(
            function(json)
            {
                data = json;
                if (data && data.response.venues.length > 0) {
                    var places = data.response.venues;
                    for (var i = 0; i < places.length; i++) {
                        displayPlace(places, i);
                    }
                }
            }
            )
        .fail(
            function()
            {
                var message = $('<p>No results</p>').clone();
                $('.row').append(message);
            }
        );
    }
    else {
        
    }
}
function displayPlace(places, i){
    var photosApi = 'https://api.foursquare.com/v2/venues/placeID/photos?client_id=HHTLWYCDUICNHSQC0BN5LCI5ZVCN1KDDXT3203VLE2EQEXUZ&client_secret=052SMA0R4KRX5SJDGVQV1ZEQUATTU1TRJ11KCXLE2UOJZKKY&v=20160706';
    var api = photosApi.replace('placeID',places[i].id);
    var imgURL = 'http://cdna.megamobilecontent.com/prew/soft/60602.png';
    
    var request = $.getJSON(api, {})
    .done(function(object){
        imgURL = object.response.photos.items[0].prefix + '300x300' + object.response.photos.items[0].suffix;
    })
    
    request.complete(function(){
        var template = $('#templates').children('.col-md-4').clone();
        template.find('h3').text(places[i].name);
        template.find('.placePhone').text(places[i].contact.formattedPhone);
        var address = places[i].location.address;
        // if (places[i].location.city) {
        //     address += ", " + places[i].location.city;
        // }
        // if (places[i].location.postalCode) {
        //     address += ", " + places[i].location.postalCode;
        // }
        template.find('.placeAddress').text(address);
        template.find('img').attr('src',imgURL);
        $('.row').append(template);
    });
    $('#loader').hide();
}