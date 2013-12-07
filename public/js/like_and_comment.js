var tarck_likes;
var tracks;
function create() {
    $('#tracks').empty();
    tarck_likes = {};
    tracks = [];
    $.get('tracks/all', function (data) {
        data.forEach(function (item) {
            tarck_likes[item._id] = item.likes;
            tracks.push(item._id);
            var article = $('<article />').attr('id', item._id);
            var user = $('<header />').text('posted by ' + item.user.name + ':');
            var content = $('<section />').text(item.content);
            article.append(user).append(content);
            if (item.comments) {
                var comments = $('<ul />');
                item.comments.forEach(function (note) {
                    var comment = $('<li/>').attr('id', note._id);
                    var user = $('<header />').text('posted by ' + note.user.name + ':');
                    var content = $('<section />').text(note.content);
                    var remove = $('<button />').text('Remove').addClass('remove');
                    comment.append(user).append(content).append(remove);
                    comments.append(comment);
                });
                article.append(comments);
            }
            var likes = 0;
            var like = $('<button />').text('Like!').addClass('like');
            if (item.likes) {
                likes = item.likes.length;
                if ($.inArray($('#users').find(':selected').val(), item.likes) != -1)
                    like = $('<button />').text('Unlike!').addClass('unlike');
                else
                    like = $('<button />').text('Like!').addClass('like');
            }
            likes = $('<footer />').text(likes + ' peoples like that');
            var comment = $('<button />').text('Add comment').addClass('comment');
            article.append(likes).append('<textarea />').append('<br/>').append(like).append(comment)
                .append('<br/>').append('<br/>');
            $('#tracks').append(article);
        });
    });
}

$(document).ready(function () {
    create();
    $('#tracks').on('click', '.like',function () {
        var track_id = $(this).parent().attr('id');
        var user_id = {user_id: $('#users').find(':selected').val()};
        $.ajax({
            type: 'PUT',
            url: 'tracks/like/' + track_id,
            data: user_id,
            success: function (res) {
                console.log(res);
                create();
            }
        });
    }).on('click', '.unlike',function () {
            var track_id = $(this).parent().attr('id');
            var user_id = {user_id: $('#users').find(':selected').val()};
            $.ajax({
                type: 'DELETE',
                url: 'tracks/like/' + track_id,
                data: user_id,
                success: function (res) {
                    console.log(res);
                    create();
                }
            });
        }).on('click', '.comment',function () {
            var track_id = $(this).parent().attr('id');
            var comment = {};
            comment.content = $(this).parent().find('textarea').val();
            comment.user = {};
            var user = $('#users').find(':selected');
            comment.user._id = user.val();
            comment.user.name = user.text();
            $.ajax({
                type: 'PUT',
                url: 'tracks/comment/' + track_id,
                data: comment,
                success: function (res) {
                    console.log(res);
                    create();
                }
            });
        }).on('click', '.remove', function () {
            var track_id = $(this).parent().parent().parent().attr('id');
            var comment_id = $(this).parent().attr('id');
            var comment = {comment_id: comment_id};
            $.ajax({
                type: 'DELETE',
                url: 'tracks/comment/' + track_id,
                data: comment,
                success: function (res) {
                    console.log(res);
                    create();
                }
            });
        });

    $('#users').on('change', function () {
        $('.unlike').text('Like!').removeClass('unlike').addClass('like');
        var user_id = $('#users').find(':selected').val();
        tracks.forEach(function (track_id) {
            if (tarck_likes[track_id]) {
                if ($.inArray(user_id, tarck_likes[track_id]) != -1) {
                    $('#' + track_id).find('.like').text('Unlike!').removeClass('like').addClass('unlike');
                }
                else {
                    $('#' + track_id).find('.like').text('Like!').removeClass('unlike').addClass('like');
                }
            }
        });
    });
});