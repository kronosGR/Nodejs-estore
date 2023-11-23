const API_URL = 'http://localhost:3000';
const API_LOGIN_URL = API_URL + '/auth/login';
const API_BRAND_URL = API_URL + '/brands';

function showToast(title, message) {
  $('#toast-title').text(title);
  $('#toast-body').text(message);
  $('.toast').toast('show');
}

function hideSpinner() {
  $('#spinner').hide();
}

function showSpinner() {
  $('#spinner').show();
}
