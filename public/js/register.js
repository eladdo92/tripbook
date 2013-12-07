$(document).ready(function () {
    $('#reg').on('click', function () {
        var user = {};
        user.name = $('#name').val();
        user.email = $('#email').val();
        user.password = $('#password').val();
        $.post('users/new', user, function (data) {
            console.log(data);
        })
    });
});