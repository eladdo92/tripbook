$(document).ready(function () {
    $.get('users/all', function (data) {
        data.forEach(function (item) {
            $('#users').append($('<option></option>').val(item._id).text(item.name));
            $('#friends').append($('<option></option>').val(item._id).text(item.name));
        });
    });

    $('#create').on('click', function () {
        var user = $('#users').find(':selected');
        var friend = $('#friends').find(':selected');
        var data = {
            user: {
                _id: user.val(),
                name: user.text()
            },
            friend: {
                _id: friend.val(),
                name: friend.text()
            }
        };
        $.ajax({
            type: 'PUT',
            url: 'user/friend/new',
            data: data,
            success: function (res) {
                console.log(res);
            }
        });
    });
});