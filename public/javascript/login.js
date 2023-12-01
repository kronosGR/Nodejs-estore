$(function () {
  hideSpinner();
  $('#swagger-url').attr('href', API_URL + '/doc');

  $('#login-form').on('click', function (e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();
    //console.log(email, password);
    const data = JSON.stringify({
      emailOrUsername: email,
      password: password,
    });

    $.ajax({
      type: 'POST',
      url: API_LOGIN_URL,
      data: data,
      contentType: 'Application/json',
      dataType: 'json',
      success: function (result) {
        window.location.href = `${API_URL}/admin`;
      },
      error: function (err) {
        console.log(err);
        showToast('Error', err.responseJSON.data.data);
      },
    });
  });
});
