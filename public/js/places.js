$(document).ready(function(){
    $.get("/places/all", function(data){
        $(data).each(function(i, item){
            if (!item.error && item.name){
                var a = $('<a/>').attr('href', '/');
                var li = $('<li/>').append(a);
                var name = $('<h1/>').text(item.name).addClass('entity');
                li.append(name);
                $('#places_list').append(li).listview('refresh');
            }
        });
    });
});