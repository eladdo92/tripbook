$(document).ready(function(){
    $.get("/users/all", function(data){
        $(data).each(function(i, item){
            if (!item.error && item.name && item.email){
                var a = $('<a/>').attr('href', '/');
                var li = $('<li/>').append(a);
                var name = $('<h1/>').text(item.name).addClass('entity');
                li.append(name);
                if(item.photo){
                    var photo = $('<p/>').text(item.photo).addClass('entity');
                    li.append(photo);
                }
                var email = $('<p/>').text(item.email).addClass('entity');
                li.append(email);
                $('#friends_list').append(li).listview('refresh');
            }
        });
    });
});